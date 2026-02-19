import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase'
import { MercadoPagoConfig, Payment } from 'mercadopago'

// ============================================
// Configuración de Mercado Pago
// ============================================

const accessToken = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN

if (!accessToken) {
  console.error('❌ MP_ACCESS_TOKEN no configurado')
}

const client = new MercadoPagoConfig({
  accessToken: accessToken || '',
  options: {
    timeout: 5000,
  },
})

// ============================================
// Tipos
// ============================================

type WebhookNotification = {
  action: string
  api_version: string
  data: {
    id: string // ID del pago en Mercado Pago
  }
  date_created: string
  id: number
  live_mode: boolean
  type: string // "payment", "merchant_order", etc.
  user_id: string
}

type OrderItem = {
  id: number
  product_id: number
  quantity: number
}

// ============================================
// POST /api/webhooks/mercadopago
// ============================================

export async function POST(request: NextRequest) {
  console.log('🔔 Webhook de Mercado Pago recibido')

  try {
    // ============================================
    // 1. Parsear el body del webhook
    // ============================================
    const body: WebhookNotification = await request.json()

    console.log('📦 Body del webhook:', {
      type: body.type,
      action: body.action,
      data_id: body.data?.id,
    })

    // ============================================
    // 2. Filtrar solo notificaciones de pagos
    // ============================================
    if (body.type !== 'payment') {
      console.log('ℹ️ Notificación ignorada (no es payment):', body.type)
      return NextResponse.json({ received: true })
    }

    const paymentId = body.data?.id

    if (!paymentId) {
      console.error('❌ No se encontró payment ID en el webhook')
      return NextResponse.json({ received: true })
    }

    // ============================================
    // 3. 🔒 SEGURIDAD: Consultar el pago directamente a Mercado Pago
    //    NO confiar solo en el webhook body
    // ============================================
    console.log(`🔍 Consultando pago ${paymentId} a Mercado Pago...`)

    if (!accessToken) {
      console.error('❌ No se puede validar el pago: ACCESS_TOKEN no configurado')
      return NextResponse.json({ received: true })
    }

    const paymentClient = new Payment(client)
    let paymentData

    try {
      paymentData = await paymentClient.get({ id: paymentId })
      console.log('✅ Pago obtenido de MP:', {
        id: paymentData.id,
        status: paymentData.status,
        external_reference: paymentData.external_reference,
        transaction_amount: paymentData.transaction_amount,
      })
    } catch (error) {
      console.error('❌ Error al consultar pago en Mercado Pago:', error)
      return NextResponse.json({ received: true })
    }

    // ============================================
    // 4. Mapear status de Mercado Pago → status interno
    // ============================================

    /**
     * Tabla de equivalencias MP → Supabase:
     *
     * MP status         | Supabase status   | Acción adicional
     * ------------------|-------------------|------------------
     * approved          | approved          | descontar stock ✅
     * in_process        | pending           | esperar siguiente webhook
     * pending           | pending           | esperar siguiente webhook
     * authorized        | pending           | esperar captura
     * rejected          | rejected          | sin acción
     * cancelled         | cancelled         | sin acción
     * refunded          | refunded          | sin acción (admin gestiona manualmente)
     * charged_back      | charged_back      | sin acción
     */

    const TERMINAL_FAILURE_STATUSES = ['rejected', 'cancelled', 'refunded', 'charged_back'] as const
    const PENDING_STATUSES = ['in_process', 'pending', 'authorized'] as const

    type MPStatus = typeof TERMINAL_FAILURE_STATUSES[number] | typeof PENDING_STATUSES[number] | 'approved'

    const mpStatus = paymentData.status as MPStatus

    // — Estados no terminales: MP volverá a notificar cuando haya resolución —
    if ((PENDING_STATUSES as readonly string[]).includes(mpStatus)) {
      console.log(`ℹ️ Pago en estado intermedio (${mpStatus}). Esperando webhook definitivo.`)
      return NextResponse.json({ received: true, status: mpStatus })
    }

    // ============================================
    // 5. Obtener el external_reference (order_id)
    // ============================================
    const externalReference = paymentData.external_reference

    if (!externalReference) {
      console.error('❌ El pago no tiene external_reference')
      return NextResponse.json({ received: true })
    }

    const orderId = parseInt(externalReference, 10)

    if (isNaN(orderId)) {
      console.error('❌ external_reference no es un número válido:', externalReference)
      return NextResponse.json({ received: true })
    }

    // ============================================
    // 6. Obtener cliente admin de Supabase (bypass RLS)
    // ============================================
    const supabase = getSupabaseAdminClient()

    // ============================================
    // 7. Verificar que la orden exista
    // ============================================
    const { data: order, error: orderFetchError } = await supabase
      .from('orders')
      .select('id, status, total_amount')
      .eq('id', orderId)
      .single()

    if (orderFetchError || !order) {
      console.error(`❌ Orden #${orderId} no encontrada:`, orderFetchError?.message)
      return NextResponse.json({ received: true })
    }

    // ============================================
    // 8a. Manejar pagos FALLIDOS / CANCELADOS
    //     → Solo actualizar status, NO tocar stock
    // ============================================
    if ((TERMINAL_FAILURE_STATUSES as readonly string[]).includes(mpStatus)) {
      // Evitar sobreescribir un pago ya aprobado (edge case: retries desordenados)
      if (order.status === 'approved' || order.status === 'completed') {
        console.log(`ℹ️ Orden #${orderId} ya fue aprobada; ignorando webhook tardío (${mpStatus})`)
        return NextResponse.json({ received: true })
      }

      const { error: failureUpdateError } = await supabase
        .from('orders')
        .update({
          status: mpStatus,             // 'rejected' | 'cancelled' | 'refunded' | 'charged_back'
          payment_id: paymentId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)

      if (failureUpdateError) {
        console.error(
          `❌ Error al actualizar orden #${orderId} a '${mpStatus}':`,
          failureUpdateError.message
        )
      } else {
        console.log(`✅ Orden #${orderId} marcada como '${mpStatus}'`)
      }

      return NextResponse.json({
        received: true,
        order_id: orderId,
        payment_id: paymentId,
        status: mpStatus,
      })
    }

    // ============================================
    // 8b. Pago APROBADO → flujo completo con stock
    // ============================================

    // Prevenir doble procesamiento
    if (order.status === 'approved' || order.status === 'completed') {
      console.log(`ℹ️ Orden #${orderId} ya fue procesada (status: ${order.status})`)
      return NextResponse.json({ received: true })
    }

    console.log(`📝 Procesando orden #${orderId} - Pago aprobado`)

    // Actualizar status a 'approved'
    const { error: updateOrderError } = await supabase
      .from('orders')
      .update({
        status: 'approved',
        payment_id: paymentId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    if (updateOrderError) {
      console.error(`❌ Error al actualizar orden #${orderId}:`, updateOrderError.message)
      return NextResponse.json({ received: true })
    }

    console.log(`✅ Orden #${orderId} actualizada a status 'approved'`)

    // ============================================
    // 9. Obtener los items de la orden
    // ============================================
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('id, product_id, quantity')
      .eq('order_id', orderId)

    if (itemsError || !orderItems || orderItems.length === 0) {
      console.error(`❌ Error al obtener items de orden #${orderId}:`, itemsError?.message)
      return NextResponse.json({ received: true })
    }

    console.log(`📦 Orden #${orderId} tiene ${orderItems.length} items`)

    // ============================================
    // 10. Restar stock de cada producto
    // ============================================
    const stockUpdatePromises = orderItems.map(async (item: OrderItem) => {
      try {
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('id, name, stock')
          .eq('id', item.product_id)
          .single()

        if (productError || !product) {
          console.error(`⚠️ Producto #${item.product_id} no encontrado:`, productError?.message)
          return { success: false, product_id: item.product_id, error: 'Product not found' }
        }

        if (product.stock < item.quantity) {
          console.warn(
            `⚠️ Stock insuficiente para producto #${item.product_id} (${product.name}): ` +
            `disponible=${product.stock}, requerido=${item.quantity}`
          )
        }

        // Intentar RPC atómica primero
        const { error: updateStockError } = await supabase.rpc('decrement_stock', {
          row_id: item.product_id,
          quantity_to_subtract: item.quantity,
        })

        if (
          updateStockError?.message?.includes('function') ||
          updateStockError?.message?.includes('does not exist')
        ) {
          // Fallback: UPDATE directo
          const { error: directUpdateError } = await supabase
            .from('products')
            .update({ stock: Math.max(0, product.stock - item.quantity) })
            .eq('id', item.product_id)

          if (directUpdateError) {
            console.error(`❌ Error stock directo #${item.product_id}:`, directUpdateError.message)
            return { success: false, product_id: item.product_id, error: directUpdateError.message }
          }

          console.log(
            `✅ Stock actualizado #${item.product_id} (${product.name}): ` +
            `${product.stock} → ${Math.max(0, product.stock - item.quantity)}`
          )
          return { success: true, product_id: item.product_id }
        }

        if (updateStockError) {
          console.error(`❌ Error RPC stock #${item.product_id}:`, updateStockError.message)
          return { success: false, product_id: item.product_id, error: updateStockError.message }
        }

        console.log(`✅ Stock decrementado #${item.product_id} (${product.name}): -${item.quantity}`)
        return { success: true, product_id: item.product_id }
      } catch (error) {
        console.error(`❌ Error procesando producto #${item.product_id}:`, error)
        return {
          success: false,
          product_id: item.product_id,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    })

    const stockUpdateResults = await Promise.allSettled(stockUpdatePromises)

    const successCount = stockUpdateResults.filter(
      (r) => r.status === 'fulfilled' && r.value.success
    ).length
    const errorCount = stockUpdateResults.length - successCount

    console.log(`📊 Stock: ${successCount} OK, ${errorCount} errores`)

    // ============================================
    // 11. Log final y respuesta
    // ============================================
    console.log(`✅ Webhook procesado exitosamente para orden #${orderId}`)

    return NextResponse.json({
      received: true,
      order_id: orderId,
      payment_id: paymentId,
      status: 'processed',
      stock_updates: { success: successCount, errors: errorCount },
    })
  } catch (error) {
    console.error('❌ Error general en webhook:', error)

    // Incluso en caso de error, devolver 200 para evitar reintentos infinitos
    return NextResponse.json({
      received: true,
      error: 'internal_error',
    })
  }
}

// ============================================
// GET - Para verificar que el webhook esté activo
// ============================================
export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/webhooks/mercadopago',
    message: 'Webhook de Mercado Pago funcionando correctamente',
  })
}
