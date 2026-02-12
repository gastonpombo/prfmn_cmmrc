'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CartItem, CustomerDetails, CheckoutResponse } from '@/lib/supabase'

// ============================================
// Ejemplo de componente de Checkout Form
// ============================================

type CheckoutFormProps = {
  cartItems: CartItem[]
  onSuccess?: (orderId: number) => void
  onError?: (error: string) => void
}

export function CheckoutForm({ cartItems, onSuccess, onError }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Argentina',
  })

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validar que haya items en el carrito
      if (cartItems.length === 0) {
        throw new Error('El carrito está vacío')
      }

      // Construir el objeto customer_info
      const customerInfo: CustomerDetails = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        address: {
          street: formData.street || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          postal_code: formData.postal_code || undefined,
          country: formData.country || undefined,
        },
      }

      // Llamar a la API de checkout
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          customer_info: customerInfo,
        }),
      })

      const data: CheckoutResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el pago')
      }

      if (data.success && data.init_point) {
        // Guardar el order_id en localStorage (opcional)
        localStorage.setItem('last_order_id', data.order_id.toString())

        // Callback de éxito
        onSuccess?.(data.order_id)

        // Redirigir a Mercado Pago
        window.location.href = data.init_point
      }
    } catch (error) {
      console.error('Error en checkout:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      onError?.(errorMessage)
      alert(`Error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información Personal */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Información Personal</h2>

        <div>
          <Label htmlFor="name">
            Nombre completo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Juan Pérez"
          />
        </div>

        <div>
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="juan@ejemplo.com"
          />
        </div>

        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="1234567890"
          />
        </div>
      </div>

      {/* Dirección de Envío */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Dirección de Envío</h2>

        <div>
          <Label htmlFor="street">Calle y número</Label>
          <Input
            id="street"
            name="street"
            type="text"
            value={formData.street}
            onChange={handleChange}
            placeholder="Av. Corrientes 1234"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              placeholder="Buenos Aires"
            />
          </div>

          <div>
            <Label htmlFor="state">Provincia/Estado</Label>
            <Input
              id="state"
              name="state"
              type="text"
              value={formData.state}
              onChange={handleChange}
              placeholder="CABA"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="postal_code">Código Postal</Label>
            <Input
              id="postal_code"
              name="postal_code"
              type="text"
              value={formData.postal_code}
              onChange={handleChange}
              placeholder="1043"
            />
          </div>

          <div>
            <Label htmlFor="country">País</Label>
            <Input
              id="country"
              name="country"
              type="text"
              value={formData.country}
              onChange={handleChange}
              placeholder="Argentina"
            />
          </div>
        </div>
      </div>

      {/* Resumen del Pedido */}
      <div className="rounded-lg border p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">Resumen del Pedido</h3>
        <div className="space-y-1 text-sm">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-2 pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Botón de Pago */}
      <Button
        type="submit"
        disabled={loading || cartItems.length === 0}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Procesando...
          </>
        ) : (
          `Pagar $${total.toFixed(2)} con Mercado Pago`
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Al hacer clic en "Pagar", serás redirigido a Mercado Pago para completar el pago de forma
        segura.
      </p>
    </form>
  )
}
