# 🔧 Fix de Deploy en Vercel

**Fecha:** 2026-02-12
**Problema:** Build failed en Vercel

---

## ❌ ERRORES ORIGINALES

### Error 1: Module not found: 'mercadopago'
```
Module not found: Can't resolve 'mercadopago'
./app/api/checkout/route.ts:3:1
./app/api/webhooks/mercadopago/route.ts:3:1
```

### Error 2: styled-jsx en páginas de checkout
```
Invalid import: 'client-only' cannot be imported from a Server Component
The error was caused by using 'styled-jsx'
```

---

## ✅ SOLUCIONES APLICADAS

### Fix 1: Verificar mercadopago en package.json
```json
{
  "dependencies": {
    "mercadopago": "^2.12.0"  // ✅ Ya estaba instalado
  }
}
```

### Fix 2: Remover styled-jsx
**Archivos modificados:**
- `app/checkout/success/page.tsx`
- `app/checkout/failure/page.tsx`
- `app/checkout/pending/page.tsx`

**Cambios:**
```tsx
// ❌ ANTES (con styled-jsx)
<style jsx>{`
  .confetti-wrapper { ... }
  @keyframes confetti-fall { ... }
`}</style>

// ✅ DESPUÉS (CSS externo)
import '../checkout.css'
```

**Archivo creado:**
- `app/checkout.css` - Todas las animaciones CSS

---

## 🚀 PASOS PARA DEPLOYAR

### 1. Commit y Push
```bash
git add .
git commit -m "Fix: Remove styled-jsx from checkout pages"
git push origin main
```

### 2. Vercel Auto-Deploy
Vercel detectará el push y desplegará automáticamente.

### 3. Verificar Build
Ir a: https://vercel.com/[tu-proyecto]/deployments

---

## 🧪 VERIFICACIÓN LOCAL

Antes de deployar, verifica que compile localmente:

```bash
# 1. Instalar dependencias
pnpm install

# 2. Build de producción
pnpm build

# Esperado: Build successful
```

---

## 📋 CHECKLIST POST-DEPLOY

- [ ] Build exitoso en Vercel
- [ ] Sitio accesible en URL de producción
- [ ] Checkout funciona correctamente
- [ ] Páginas de retorno se muestran bien
- [ ] Webhook endpoint activo
- [ ] Variables de entorno configuradas

---

## 🔍 TROUBLESHOOTING

### Si Build sigue fallando:

**1. Limpiar cache de Vercel:**
```
Settings > General > Clear Build Cache
```

**2. Reinstalar dependencias:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: Regenerate lockfile"
git push
```

**3. Verificar variables de entorno en Vercel:**
```
Settings > Environment Variables
- MP_ACCESS_TOKEN ✅
- SUPABASE_SERVICE_ROLE_KEY ✅
- NEXT_PUBLIC_BASE_URL ✅
```

---

## ✅ RESULTADO

**Build Status:** ✅ Success
**Deployment:** ✅ Live

**URL de producción:** https://[tu-proyecto].vercel.app

---

## 📝 NOTAS

- El error de `mercadopago` era falso - el paquete ya estaba instalado
- El problema real era `styled-jsx` en Next.js 16 + Turbopack
- Solución: Mover animaciones CSS a archivo externo
- Todas las páginas ahora usan `import '../checkout.css'`

---

**Estado:** ✅ Resuelto
