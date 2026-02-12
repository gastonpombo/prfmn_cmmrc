# 🛒 Guía de UI de Checkout - PerfuMan

## 📁 Archivos Creados

### ✅ Componentes
- `components/checkout/checkout-button.tsx` - Botón de checkout con lógica completa

### ✅ Páginas de Retorno
- `app/checkout/success/page.tsx` - Página de pago exitoso con confeti
- `app/checkout/failure/page.tsx` - Página de pago rechazado
- `app/checkout/pending/page.tsx` - Página de pago pendiente

### ✅ Actualizaciones
- `components/layout/cart-slide-over.tsx` - Integrado con CheckoutButton
- `app/layout.tsx` - Agregado Toaster para notificaciones

---

## 🚀 Cómo Usar

### 1️⃣ El CheckoutButton ya está integrado

El botón de "Finalizar Compra" en el carrito slide-over ya usa el nuevo `CheckoutButton`.

**No necesitas hacer nada adicional** - solo prueba el flujo:

1. Agrega productos al carrito
2. Haz clic en "Finalizar Compra"
3. El botón mostrará "Procesando..." mientras se crea la orden
4. Serás redirigido automáticamente a Mercado Pago

---

## 🎨 Personalización del CheckoutButton

Si quieres usar el `CheckoutButton` en otras partes de tu app:

### Ejemplo 1: Botón Básico (Usuario Anónimo)

```tsx
import { CheckoutButton } from '@/components/checkout/checkout-button'

export function MyCheckoutPage() {
  return (
    <div>
      <h1>Resumen de Compra</h1>
      {/* El botón toma los items del CartContext automáticamente */}
      <CheckoutButton />
    </div>
  )
}
```

### Ejemplo 2: Con Información del Cliente

```tsx
import { CheckoutButton } from '@/components/checkout/checkout-button'

export function CheckoutWithCustomerInfo() {
  const customerInfo = {
    name: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    phone: '1234567890',
    address: {
      street: 'Av. Corrientes 1234',
      city: 'Buenos Aires',
      state: 'CABA',
      postal_code: '1043',
      country: 'Argentina'
    }
  }

  return (
    <CheckoutButton
      customerInfo={customerInfo}
      label="Pagar Ahora"
    />
  )
}
```

### Ejemplo 3: Con Validación Previa

```tsx
import { CheckoutButton } from '@/components/checkout/checkout-button'
import { useState } from 'react'

export function CheckoutWithValidation() {
  const [termsAccepted, setTermsAccepted] = useState(false)

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
        />
        Acepto los términos y condiciones
      </label>

      <CheckoutButton
        onBeforeCheckout={() => {
          if (!termsAccepted) {
            alert('Debes aceptar los términos')
            return false // Cancelar el checkout
          }
          return true // Continuar
        }}
        onSuccess={(orderId) => {
          console.log('Orden creada:', orderId)
          // Enviar evento de analytics, etc.
        }}
        onError={(error) => {
          console.error('Error en checkout:', error)
          // Log de errores, etc.
        }}
      />
    </div>
  )
}
```

### Ejemplo 4: Formulario Completo de Checkout

```tsx
'use client'

import { useState } from 'react'
import { CheckoutButton } from '@/components/checkout/checkout-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function FullCheckoutForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
  })

  const [isValid, setIsValid] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = {
      ...formData,
      [e.target.name]: e.target.value,
    }
    setFormData(newData)

    // Validar campos requeridos
    setIsValid(
      newData.name.trim() !== '' &&
      newData.email.trim() !== '' &&
      newData.email.includes('@')
    )
  }

  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="street">Calle</Label>
        <Input
          id="street"
          name="street"
          value={formData.street}
          onChange={handleChange}
        />
      </div>

      <CheckoutButton
        customerInfo={{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          address: {
            street: formData.street || undefined,
            city: formData.city || undefined,
            state: formData.state || undefined,
            postal_code: formData.postal_code || undefined,
            country: 'Argentina',
          }
        }}
        onBeforeCheckout={() => {
          if (!isValid) {
            alert('Por favor completa los campos requeridos')
            return false
          }
          return true
        }}
      />
    </form>
  )
}
```

---

## 🎯 Props del CheckoutButton

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `customerInfo` | `CustomerDetails` | `undefined` | Información del cliente. Si no se provee, usa "Usuario Anónimo" |
| `label` | `string` | `"Finalizar Compra"` | Texto del botón |
| `onBeforeCheckout` | `() => boolean \| Promise<boolean>` | `undefined` | Callback ejecutado antes del checkout. Retorna `false` para cancelar |
| `onSuccess` | `(orderId: number) => void` | `undefined` | Callback ejecutado después del éxito |
| `onError` | `(error: string) => void` | `undefined` | Callback ejecutado en caso de error |
| `className` | `string` | `""` | Clase CSS adicional |

---

## 🧪 Testing

### 1. Probar el flujo completo

```bash
# 1. Iniciar el servidor
pnpm dev

# 2. Agregar productos al carrito
# 3. Hacer clic en "Finalizar Compra"
# 4. Serás redirigido a Mercado Pago
```

### 2. Probar con tarjetas de prueba

Usa estas tarjetas en el entorno de TEST de Mercado Pago:

| Tarjeta | Número | CVV | Fecha | Resultado |
|---------|--------|-----|-------|-----------|
| VISA | 4509 9535 6623 3704 | 123 | 11/25 | ✅ Aprobado |
| Mastercard | 5031 7557 3453 0604 | 123 | 11/25 | ✅ Aprobado |
| VISA | 4074 0000 0000 0004 | 123 | 11/25 | ❌ Rechazado |

### 3. Probar las páginas de retorno

Accede directamente a las URLs para ver el diseño:

- ✅ Success: `http://localhost:3000/checkout/success`
- ❌ Failure: `http://localhost:3000/checkout/failure`
- ⏳ Pending: `http://localhost:3000/checkout/pending`

---

## 🎨 Personalizar las Páginas de Retorno

### Cambiar colores

Las páginas usan los colores de tu tema de Tailwind. Para personalizar:

```css
/* En tu archivo globals.css o tailwind.config.ts */
:root {
  --success-color: 34 197 94; /* green-500 */
  --error-color: 239 68 68;   /* red-500 */
  --warning-color: 234 179 8; /* yellow-500 */
}
```

### Agregar analytics

Agrega tracking en las páginas de retorno:

```tsx
// app/checkout/success/page.tsx
'use client'

import { useEffect } from 'react'

export default function CheckoutSuccessPage() {
  useEffect(() => {
    // Google Analytics
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'purchase', {
        transaction_id: localStorage.getItem('last_order_id'),
        value: localStorage.getItem('last_order_value'),
        currency: 'ARS',
      })
    }

    // Facebook Pixel
    if (typeof window.fbq !== 'undefined') {
      window.fbq('track', 'Purchase', {
        value: localStorage.getItem('last_order_value'),
        currency: 'ARS',
      })
    }
  }, [])

  return (
    // ... resto del componente
  )
}
```

---

## 🔄 Flujo Completo

```
1. Usuario agrega productos → Carrito
                                  ↓
2. Clic en "Finalizar Compra" → CheckoutButton
                                  ↓
3. POST /api/checkout → Crea orden + items
                                  ↓
4. Mercado Pago → Crea preferencia
                                  ↓
5. Redirect → init_point (página de pago MP)
                                  ↓
6. Usuario paga → Mercado Pago procesa
                                  ↓
7. Redirect según resultado:
   ✅ → /checkout/success
   ❌ → /checkout/failure
   ⏳ → /checkout/pending
```

---

## 🐛 Troubleshooting

### El botón no hace nada
- ✅ Verifica que el Toaster esté agregado en el layout
- ✅ Revisa la consola del navegador en busca de errores
- ✅ Asegúrate de que la API `/api/checkout` esté corriendo

### No me redirige a Mercado Pago
- ✅ Verifica que `MERCADOPAGO_ACCESS_TOKEN` esté configurado
- ✅ Revisa que la respuesta de la API incluya `init_point`
- ✅ Mira los logs en la terminal del servidor

### Los toasts no aparecen
- ✅ Verifica que `<Toaster />` esté en el layout
- ✅ Importa `toast` de 'sonner': `import { toast } from 'sonner'`

### El carrito no se limpia después del checkout
- Esto es intencional por seguridad
- Si quieres que se limpie, descomenta la línea `clearCart()` en el CheckoutButton

---

## 📚 Recursos

- [Documentación de Mercado Pago](https://www.mercadopago.com.ar/developers/es/docs)
- [Sonner (Toast)](https://sonner.emilkowal.ski/)
- [Shadcn/ui Components](https://ui.shadcn.com/)

---

## ✅ Checklist de Implementación

- [x] CheckoutButton creado
- [x] CartSlideOver actualizado
- [x] Páginas de retorno creadas (success, failure, pending)
- [x] Toaster agregado al layout
- [x] Animaciones y UX pulidas
- [ ] Testear con tarjetas de prueba
- [ ] Agregar analytics (opcional)
- [ ] Personalizar textos según tu marca
- [ ] Configurar webhook de Mercado Pago (siguiente paso)

---

¿Dudas? Revisa el código de los componentes - están bien documentados con comentarios.
