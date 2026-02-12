# 🛒 Configuración del Checkout con Mercado Pago

## 📦 1. Instalar el SDK de Mercado Pago

```bash
pnpm add mercadopago
# o
npm install mercadopago
# o
yarn add mercadopago
```

## 🔑 2. Configurar Variables de Entorno

Crea o actualiza tu archivo `.env.local`:

```env
# Mercado Pago (OBLIGATORIO)
MERCADOPAGO_ACCESS_TOKEN=tu-access-token-aqui

# Base URL (IMPORTANTE para webhooks)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### ¿Dónde obtener el Access Token?

1. Ve a [Mercado Pago Developers](https://www.mercadopago.com.ar/developers)
2. Inicia sesión con tu cuenta
3. Ve a "Tus integraciones" → "Credenciales"
4. Copia el **Access Token** (modo TEST para pruebas, PROD para producción)

## 🧪 3. Testear la API

### Request de ejemplo:

```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "id": 1,
        "name": "Perfume Armani Code",
        "price": 15000,
        "quantity": 1
      },
      {
        "id": 2,
        "name": "Perfume Dior Sauvage",
        "price": 18000,
        "quantity": 2
      }
    ],
    "customer_info": {
      "name": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "phone": "1234567890",
      "address": {
        "street": "Av. Corrientes 1234",
        "city": "Buenos Aires",
        "state": "CABA",
        "postal_code": "1043",
        "country": "Argentina"
      }
    }
  }'
```

### Response esperado:

```json
{
  "success": true,
  "order_id": 123,
  "init_point": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=...",
  "preference_id": "1234567-abc-def-ghi-123456789"
}
```

## 🎯 4. Integrar en el Frontend

### Ejemplo con React:

```tsx
'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext' // Tu context del carrito

export default function CheckoutButton() {
  const { items } = useCart()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          customer_info: {
            name: 'Usuario Anónimo', // O tomar del formulario
            email: 'user@ejemplo.com',
            phone: '1234567890',
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirigir a Mercado Pago
        window.location.href = data.init_point
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error en checkout:', error)
      alert('Error al procesar el pago')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || items.length === 0}
      className="btn-primary"
    >
      {loading ? 'Procesando...' : 'Proceder al Pago'}
    </button>
  )
}
```

## 🔄 5. Páginas de Retorno

Crea las páginas para manejar las respuestas de Mercado Pago:

### `app/checkout/success/page.tsx`
```tsx
export default function CheckoutSuccess() {
  return (
    <div className="container py-20 text-center">
      <h1 className="text-3xl font-bold text-green-600">¡Pago Exitoso!</h1>
      <p className="mt-4">Tu orden ha sido procesada correctamente.</p>
      <a href="/" className="btn-primary mt-6">Volver al inicio</a>
    </div>
  )
}
```

### `app/checkout/failure/page.tsx`
```tsx
export default function CheckoutFailure() {
  return (
    <div className="container py-20 text-center">
      <h1 className="text-3xl font-bold text-red-600">Pago Rechazado</h1>
      <p className="mt-4">Hubo un problema con tu pago. Por favor intenta nuevamente.</p>
      <a href="/shop" className="btn-primary mt-6">Volver a la tienda</a>
    </div>
  )
}
```

### `app/checkout/pending/page.tsx`
```tsx
export default function CheckoutPending() {
  return (
    <div className="container py-20 text-center">
      <h1 className="text-3xl font-bold text-yellow-600">Pago Pendiente</h1>
      <p className="mt-4">Tu pago está siendo procesado. Te notificaremos por email.</p>
      <a href="/" className="btn-primary mt-6">Volver al inicio</a>
    </div>
  )
}
```

## 🔔 6. Webhook (IMPORTANTE)

Para producción, necesitarás configurar el webhook de Mercado Pago:

1. Crea `app/api/webhooks/mercadopago/route.ts`
2. Configura la URL en el panel de Mercado Pago
3. El webhook actualizará el status de la orden automáticamente

Ejemplo básico de webhook:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Mercado Pago envía notificaciones del tipo "payment"
    if (body.type === 'payment') {
      const paymentId = body.data.id

      // Aquí deberías consultar la API de MP para obtener los detalles
      // y actualizar el status de la orden según el external_reference

      console.log('Payment notification:', paymentId)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
```

## ⚙️ 7. Configuración de Moneda

Por defecto está configurado para **ARS (Pesos Argentinos)**.

Para cambiar la moneda, edita en `route.ts`:

```typescript
currency_id: "ARS", // Cambiar a: USD, MXN, CLP, BRL, COP, etc.
```

## 🧪 8. Modo TEST

Para probar sin hacer pagos reales:

1. Usa el **Access Token de TEST** (empieza con `TEST-...`)
2. Usa tarjetas de prueba de Mercado Pago:
   - VISA: `4509 9535 6623 3704`
   - Mastercard: `5031 7557 3453 0604`
   - CVV: cualquiera de 3 dígitos
   - Fecha: cualquier fecha futura

## ✅ Checklist de Producción

- [ ] Cambiar a Access Token de PRODUCCIÓN
- [ ] Configurar `NEXT_PUBLIC_BASE_URL` con tu dominio real
- [ ] Implementar el webhook completo
- [ ] Configurar la URL del webhook en Mercado Pago
- [ ] Testear con pagos reales pequeños
- [ ] Implementar manejo de errores y logs
- [ ] Agregar rate limiting a la API

## 📚 Recursos

- [Documentación oficial de Mercado Pago](https://www.mercadopago.com.ar/developers/es/docs)
- [SDK Node.js](https://github.com/mercadopago/sdk-nodejs)
- [Tarjetas de prueba](https://www.mercadopago.com.ar/developers/es/docs/checkout-api/testing)
