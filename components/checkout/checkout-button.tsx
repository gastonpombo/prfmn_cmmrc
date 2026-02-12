'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { toast } from 'sonner'

// ============================================
// Tipos de respuesta del endpoint /api/checkout
// ============================================

type CheckoutResponse = {
  success: boolean
  order_id: number
  init_point: string
  preference_id: string
  total_amount: number
  error?: string
  details?: string[] // Errores específicos (ej: stock insuficiente)
  missing_products?: number[]
}

type CheckoutButtonProps = {
  /** Información del cliente - si no se provee, se usará datos genéricos de "Usuario Anónimo" */
  customerInfo?: {
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
  }
  /** Texto del botón (default: "Finalizar Compra") */
  label?: string
  /** Callback ejecutado antes de procesar el pago */
  onBeforeCheckout?: () => boolean | Promise<boolean>
  /** Callback ejecutado después del éxito */
  onSuccess?: (orderId: number) => void
  /** Callback ejecutado en caso de error */
  onError?: (error: string) => void
  /** Clase CSS adicional */
  className?: string
}

export function CheckoutButton({
  customerInfo,
  label = 'Finalizar Compra',
  onBeforeCheckout,
  onSuccess,
  onError,
  className = '',
}: CheckoutButtonProps) {
  const { items, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    // 1. Validar que haya items en el carrito
    if (items.length === 0) {
      toast.error('Tu carrito está vacío')
      return
    }

    // 2. Ejecutar callback pre-checkout si existe
    if (onBeforeCheckout) {
      const shouldContinue = await onBeforeCheckout()
      if (!shouldContinue) return
    }

    setIsProcessing(true)

    try {
      // 3. 🔒 SEGURIDAD: Solo enviar ID y quantity
      // El servidor validará precios y stock desde la base de datos
      const checkoutItems = items.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
        // ⚠️ NO enviamos price ni name - el servidor los obtiene de la DB
      }))

      // Información del cliente (default si no se provee)
      const customer = customerInfo || {
        name: 'Usuario Anónimo',
        email: 'checkout@perfuman.com', // Email temporal para checkout anónimo
        phone: '',
      }

      console.log('🛒 Enviando checkout:', {
        items_count: checkoutItems.length,
        customer: customer.name,
      })

      // 4. Hacer POST a la API de checkout
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: checkoutItems,
          customer_info: customer,
        }),
      })

      const data: CheckoutResponse = await response.json()

      console.log('📦 Respuesta del servidor:', {
        success: data.success,
        error: data.error,
      })

      // 5. Manejar respuesta de error
      if (!response.ok || !data.success) {
        const errorMsg = data.error || 'Error al procesar el pago'

        // Si hay detalles específicos (ej: "Stock insuficiente para X")
        if (data.details && data.details.length > 0) {
          // Mostrar cada error específico
          data.details.forEach((detail) => {
            toast.error(detail, {
              duration: 5000,
            })
          })

          // Callback con el primer error
          onError?.(data.details[0])
        } else {
          // Error genérico
          toast.error(errorMsg, {
            description:
              response.status === 400
                ? 'Verifica los productos en tu carrito'
                : 'Intenta nuevamente en unos momentos',
          })

          onError?.(errorMsg)
        }

        return
      }

      // 6. Éxito: guardar info y redirigir
      if (data.init_point) {
        // Guardar información de la orden en localStorage
        localStorage.setItem('last_order_id', data.order_id.toString())
        localStorage.setItem('last_order_preference', data.preference_id)
        localStorage.setItem('last_order_total', data.total_amount.toString())

        // Mostrar toast de éxito
        toast.success('¡Orden creada!', {
          description: `Redirigiendo a Mercado Pago... (Orden #${data.order_id})`,
        })

        // Callback de éxito
        onSuccess?.(data.order_id)

        // Limpiar el carrito
        clearCart()

        // Pequeño delay para que el usuario vea el mensaje
        setTimeout(() => {
          // Redirigir a Mercado Pago
          window.location.href = data.init_point
        }, 1000)
      } else {
        throw new Error('No se recibió URL de pago')
      }
    } catch (error) {
      console.error('❌ Error en checkout:', error)

      const errorMsg = error instanceof Error ? error.message : 'Error de conexión'

      toast.error('Error al procesar el pago', {
        description: errorMsg,
      })

      onError?.(errorMsg)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={isProcessing || items.length === 0}
      className={`
        w-full rounded bg-secondary py-3 font-sans text-sm font-semibold
        uppercase tracking-widest text-secondary-foreground
        transition-all hover:opacity-90 disabled:cursor-not-allowed
        disabled:opacity-50 flex items-center justify-center gap-2
        ${className}
      `}
    >
      {isProcessing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Procesando...
        </>
      ) : (
        label
      )}
    </button>
  )
}
