# 📚 Documentación - PerfuMan E-commerce

Toda la documentación del proyecto está organizada aquí.

---

## 🚀 INICIO RÁPIDO

**Lee primero:** `IMPLEMENTATION-SUMMARY.md`

---

## 📁 ARCHIVOS

### Implementación
- **`IMPLEMENTATION-SUMMARY.md`** ⭐ Empieza aquí - Resumen completo

### Seguridad
- **`SECURITY-SUMMARY.md`** - Resumen de auditoría de seguridad
- **`SECURITY-AUDIT-REPORT.md`** - Reporte detallado de auditoría

### Checkout
- **`CHECKOUT-SETUP.md`** - Configuración de Mercado Pago
- **`CHECKOUT-UI-GUIDE.md`** - Guía de componentes de UI

### SQL (Supabase)
- **`supabase-decrement-stock.sql`** - Función para decrementar stock
- **`supabase-rls-policies.sql`** - Políticas de seguridad RLS
- **`supabase-stock-function.sql`** - Funciones alternativas de stock

---

## ⚡ ACCIÓN INMEDIATA

1. **Ejecutar SQL en Supabase:**
   ```sql
   -- Dashboard > SQL Editor
   -- Copiar contenido de supabase-decrement-stock.sql
   -- Run
   ```

2. **Testear localmente:**
   ```bash
   pnpm dev
   # Agregar productos al carrito
   # Hacer checkout
   ```

3. **Leer documentación de seguridad:**
   - Ver `SECURITY-SUMMARY.md` para entender las mejoras

---

## 📞 AYUDA

Si tienes dudas, revisa:
1. `IMPLEMENTATION-SUMMARY.md` - Overview general
2. `SECURITY-SUMMARY.md` - Problemas de seguridad resueltos
3. `CHECKOUT-SETUP.md` - Configuración paso a paso
