import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase"
import { MercadoPagoConfig, Preference } from "mercadopago"

// ============================================
// Tipos para el request
// ============================================

type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
}

type CustomerInfo = {
  name: string
  email: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
  }
  extra_details?: {
    ci?: string
    shipping_company?: string
    shipping_method?: string
  }
}

type CheckoutRequest = {
  items: CartItem[]
  customer_info: CustomerInfo
}

type DBProduct = {
  id: number
  name: string
  price: number
  stock: number
}

// ============================================
// Configurar Mercado Pago
// ============================================

const accessToken = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN

if (!accessToken) {
  console.error("❌ MP_ACCESS_TOKEN no está configurado en las variables de entorno")
}

const client = new MercadoPagoConfig({
  accessToken: accessToken || "",
  options: {
    timeout: 5000,
  },
})

// ============================================
// POST /api/checkout
// ============================================

export async function POST(request: NextRequest) {
  try {
    // 1. Validar variables de entorno
    if (!accessToken) {
      return NextResponse.json(
        { error: "Configuración de pago no disponible" },
        { status: 500 }
      )
    }

    // 2. Parsear el body
    const body: CheckoutRequest = await request.json()
    const { items, customer_info } = body

    // 3. Validar datos recibidos
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 })
    }

    if (!customer_info || !customer_info.name || !customer_info.email) {
      return NextResponse.json(
        { error: "Información del cliente incompleta" },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdminClient()

    // ============================================
    // 4. 🔒 SEGURIDAD: Validar productos y precios desde la DB
    // ============================================

    console.log(`🔍 Validando ${items.length} productos desde la base de datos...`)

    const productIds = items.map(item => item.id)

    // Consultar productos reales desde Supabase
    const { data: realProducts, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, stock')
      .in('id', productIds)

    if (productsError || !realProducts) {
      console.error('❌ Error al obtener productos:', productsError)
      return NextResponse.json(
        { error: 'Error al validar productos' },
        { status: 500 }
      )
    }

    // Validar que todos los productos existan
    if (realProducts.length !== items.length) {
      const missingIds = items
        .filter(item => !realProducts.find(p => p.id === item.id))
        .map(item => item.id)

      console.error('❌ Productos no encontrados:', missingIds)
      return NextResponse.json(
        {
          error: 'Algunos productos no están disponibles',
          missing_products: missingIds
        },
        { status: 400 }
      )
    }

    // Validar stock y calcular total con precios reales
    let total_amount = 0
    const validationErrors: string[] = []
    const validatedItems: Array<{ item: CartItem; dbProduct: DBProduct }> = []

    for (const item of items) {
      const dbProduct = realProducts.find(p => p.id === item.id)

      if (!dbProduct) {
        validationErrors.push(`Producto ${item.name} no encontrado`)
        continue
      }

      // 🔒 Validar stock disponible
      if (dbProduct.stock < item.quantity) {
        validationErrors.push(
          `Stock insuficiente para "${dbProduct.name}". ` +
          `Disponible: ${dbProduct.stock}, solicitado: ${item.quantity}`
        )
        continue
      }

      // ✅ Usar precio real de la base de datos
      total_amount += dbProduct.price * item.quantity

      validatedItems.push({ item, dbProduct })
    }

    // Si hay errores de validación, retornar error
    if (validationErrors.length > 0) {
      console.error('❌ Errores de validación:', validationErrors)
      return NextResponse.json(
        {
          error: 'Error de validación',
          details: validationErrors
        },
        { status: 400 }
      )
    }

    // Validar total final
    if (total_amount <= 0) {
      return NextResponse.json(
        { error: 'El total debe ser mayor a 0' },
        { status: 400 }
      )
    }

    console.log(`✅ Validación completada: ${validatedItems.length} productos, total=$${total_amount}`)

    // ============================================================
    // PASO 1: 🔒 Reserva atómica de stock  (ANTES de crear la orden)
    //   check_and_decrease_stock devuelve TRUE si hay stock y lo descuenta,
    //   FALSE si el stock es insuficiente. Usa FOR UPDATE internamente.
    // ============================================================

    const reservedProductIds: number[] = [] // Para rollback parcial

    for (const { item, dbProduct } of validatedItems) {
      const { data: reserved, error: rpcError } = await supabase.rpc(
        'check_and_decrease_stock',
        { row_id: item.id, qty: item.quantity }
      )

      if (rpcError) {
        console.error(`❌ RPC check_and_decrease_stock falló para #${item.id}:`, rpcError.message)
        // Rollback de los que ya fueron reservados
        for (const reservedId of reservedProductIds) {
          const qty = validatedItems.find(({ item: i }) => i.id === reservedId)?.item.quantity ?? 0
          await supabase.rpc('increment_stock', { row_id: reservedId, quantity_to_add: qty })
        }
        return NextResponse.json(
          { error: 'Error al reservar stock', details: rpcError.message },
          { status: 500 }
        )
      }

      if (!reserved) {
        // Stock insuficiente para este producto → rollback de los ya reservados
        console.warn(`⚠️ Sin stock para "${dbProduct.name}" (#${item.id})`)
        for (const reservedId of reservedProductIds) {
          const qty = validatedItems.find(({ item: i }) => i.id === reservedId)?.item.quantity ?? 0
          await supabase.rpc('increment_stock', { row_id: reservedId, quantity_to_add: qty })
        }
        return NextResponse.json(
          {
            error: 'stock_unavailable',
            message: `Lo sentimos, nos quedamos sin stock de "${dbProduct.name}" mientras realizabas tu compra.`,
            product_id: item.id,
          },
          { status: 409 }
        )
      }

      reservedProductIds.push(item.id)
      console.log(`✅ Stock reservado: "${dbProduct.name}" -${item.quantity}`)
    }

    console.log(`✅ Stock 100% reservado para ${validatedItems.length} productos`)

    // ============================================================
    // PASO 2: Crear la orden con status 'pending'
    //   (stock ya asegurado antes de este punto)
    // ============================================================

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        total_amount,
        status: 'pending',
        customer_email: customer_info.email,
        customer_details: customer_info,
        user_id: null,
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('❌ Error al crear la orden:', orderError)
      // Rollback total de stock
      for (const { item } of validatedItems) {
        await supabase.rpc('increment_stock', { row_id: item.id, quantity_to_add: item.quantity })
      }
      return NextResponse.json(
        { error: 'Error al crear la orden', details: orderError?.message },
        { status: 500 }
      )
    }

    const orderId = order.id
    console.log(`✅ Orden creada con ID: ${orderId}`)

    // ============================================================
    // PASO 3: Insertar los order_items (con precios reales)
    // ============================================================

    const orderItems = validatedItems.map(({ item, dbProduct }) => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: dbProduct.price,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

    if (itemsError) {
      console.error('❌ Error al insertar order_items:', itemsError)
      await supabase.from('orders').delete().eq('id', orderId)
      // Rollback stock
      for (const { item } of validatedItems) {
        await supabase.rpc('increment_stock', { row_id: item.id, quantity_to_add: item.quantity })
      }
      return NextResponse.json(
        { error: 'Error al crear los items de la orden', details: itemsError.message },
        { status: 500 }
      )
    }

    console.log(`✅ ${orderItems.length} items insertados para la orden ${orderId}`)



    // ============================================
    // PASO 3: Crear la preferencia de Mercado Pago
    // ============================================

    const preference = new Preference(client)

    // Transformar items al formato de Mercado Pago (CON PRECIOS REALES)
    const mpItems = validatedItems.map(({ item, dbProduct }) => ({
      id: item.id.toString(),
      title: dbProduct.name,
      quantity: item.quantity,
      unit_price: dbProduct.price, // ✅ Usar precio real
      currency_id: "ARS", // Ajustar moneda según corresponda (UYU o ARS)
    }))

    // URLs de retorno
    // ✅ FALLBACK ROBUSTO: Si no hay variable de entorno, usar localhost (para desarrollo)
    // En producción, Vercel suele inyectar VERCEL_URL, pero es mejor configurar NEXT_PUBLIC_BASE_URL explícitamente.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

    try {
      const preferenceResponse = await preference.create({
        body: {
          items: mpItems,
          payer: {
            name: customer_info.name,
            email: customer_info.email,
            phone: customer_info.phone
              ? {
                number: customer_info.phone,
              }
              : undefined,
            address: customer_info.address
              ? {
                street_name: customer_info.address.street,
                zip_code: customer_info.address.postal_code,
              }
              : undefined,
            // ⚠️ MercadoPago TS SDK limitation: Identification might not be fully typed in 'payer'
            // We can pass it if supported, or rely on our internal `extra_details`
          },
          back_urls: {
            success: `${baseUrl}/checkout/success`,
            failure: `${baseUrl}/checkout/failure`,
            pending: `${baseUrl}/checkout/pending`,
          },
          auto_return: "approved",
          external_reference: orderId.toString(),
          notification_url: `${baseUrl}/api/webhooks/mercadopago`,
          statement_descriptor: "PerfuMan",
          expires: true,
          expiration_date_from: new Date().toISOString(),
          expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
        },
      })

      if (!preferenceResponse.id || !preferenceResponse.init_point) {
        throw new Error("Respuesta inválida de Mercado Pago")
      }

      console.log(`✅ Preferencia de MP creada: ${preferenceResponse.id}`)

      // ============================================
      // PASO 4: Actualizar la orden con el payment_id
      // ============================================

      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_id: preferenceResponse.id,
        })
        .eq("id", orderId)

      if (updateError) {
        console.error("⚠️ Error al actualizar payment_id:", updateError)
        // No bloqueo flujo, el webhook puede corregir
      }

      // ============================================
      // PASO 5: Responder al cliente
      // ============================================

      return NextResponse.json(
        {
          success: true,
          order_id: orderId,
          init_point: preferenceResponse.init_point,
          preference_id: preferenceResponse.id,
          total_amount,
        },
        { status: 201 }
      )
    } catch (mpError: unknown) {
      console.error("❌ Error al crear preferencia de Mercado Pago:", mpError)

      // Rollback
      await supabase.from("order_items").delete().eq("order_id", orderId)
      await supabase.from("orders").delete().eq("id", orderId)

      return NextResponse.json(
        {
          error: "Error al procesar el pago",
          details: mpError instanceof Error ? mpError.message : "Error desconocido",
        },
        { status: 500 }
      )
    }
  } catch (error: unknown) {
    console.error("❌ Error general en /api/checkout:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    )
  }
}
