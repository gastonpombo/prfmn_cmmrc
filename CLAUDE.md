# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Create production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

**Package Manager:** This project uses `pnpm` (not npm or yarn).

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router with React Server Components)
- **React:** 19.2.3
- **TypeScript:** 5.7.3 (strict mode enabled)
- **Database:** Supabase (PostgreSQL)
- **Payments:** Mercado Pago SDK 2.12.0
- **Styling:** Tailwind CSS 3.4.17 + shadcn/ui components
- **State:** React Context (CartContext, SupabaseContext)
- **Forms:** React Hook Form + Zod validation
- **Notifications:** Sonner (toast library)

## Critical Security Principles

**🔒 THE GOLDEN RULE:** Never trust client-submitted data for financial operations.

This codebase achieved a 95/100 security score after fixing a critical price manipulation vulnerability. The core security principles are:

1. **All prices MUST be fetched from the database** - Never use prices from frontend
2. **Stock validation MUST be server-side** - Verify availability before processing
3. **Order totals MUST be calculated server-side** - Client calculations are for display only
4. **Webhook payments MUST be verified with MP API** - Don't trust webhook payload alone
5. **Admin client is server-only** - Never expose `SUPABASE_SERVICE_ROLE_KEY` to client

**Security Context:** See [/docs/SECURITY-SUMMARY.md](docs/SECURITY-SUMMARY.md) for the full security audit report.

## Supabase Client Patterns

This project uses **three different Supabase client types**. Using the wrong client can cause RLS issues or security vulnerabilities.

```typescript
// 1. Regular client - Respects Row Level Security (RLS)
import { getSupabaseClient } from '@/lib/supabase'
const supabase = getSupabaseClient()
// Use in: Server Components, API routes for read operations

// 2. Browser client - For React components
import { createBrowserClient } from '@/lib/supabase'
const supabase = createBrowserClient()
// Use in: Client components via SupabaseContext

// 3. Admin client - Bypasses RLS (⚠️ SERVER-ONLY!)
import { getSupabaseAdminClient } from '@/lib/supabase'
const supabase = getSupabaseAdminClient()
// Use in: Checkout API, webhooks (privileged operations)
// NEVER expose to client! NEVER use in client components!
```

**Key File:** [/lib/supabase.ts](lib/supabase.ts) - Contains client setup, types, and helper functions (223 lines).

## Checkout & Payment Flow

The checkout process is a **multi-step flow** with strict server-side validation:

### Step-by-Step Process

1. **Client Preparation**
   - User adds products to cart (CartContext)
   - Client sends ONLY product IDs + quantities to `/api/checkout`
   - Prices from frontend are logged but **completely ignored**

2. **API Validation** ([/app/api/checkout/route.ts](app/api/checkout/route.ts))
   - Fetch real products from database by ID
   - Verify all products exist
   - Check stock availability (quantity <= stock)
   - Calculate total using **real DB prices**

3. **Order Creation**
   - Insert order record with status `'pending'`
   - Insert order_items with real unit prices from DB
   - Use admin client to bypass RLS

4. **Mercado Pago Preference**
   - Generate payment preference with real prices
   - Include webhook URL and back URLs (success/failure/pending)
   - Store `external_reference` (order_id) for webhook matching

5. **User Payment**
   - Redirect user to Mercado Pago checkout
   - User completes payment on MP platform

6. **Webhook Processing** ([/app/api/webhooks/mercadopago/route.ts](app/api/webhooks/mercadopago/route.ts))
   - Receive notification from Mercado Pago
   - **Verify payment directly with MP API** (don't trust webhook body)
   - Extract `external_reference` to find order
   - Check if order already processed (idempotency)
   - Update order status to `'approved'`
   - Decrement product stock using RPC function `decrement_stock()`

### Critical Security Pattern

```typescript
// ❌ NEVER do this (price manipulation vulnerability)
const total = items.reduce((sum, item) => {
  return sum + item.price * item.quantity  // Trusts client!
}, 0)

// ✅ ALWAYS do this (secure server-side validation)
const { data: realProducts } = await supabase
  .from('products')
  .select('id, price, stock')
  .in('id', productIds)

const total = items.reduce((sum, item) => {
  const dbProduct = realProducts.find(p => p.id === item.id)
  if (!dbProduct) throw new Error(`Product ${item.id} not found`)
  return sum + dbProduct.price * item.quantity  // Real DB price!
}, 0)
```

## Error Handling Pattern

All API routes use a consistent error response structure:

```typescript
{
  success: boolean,
  error?: string,        // User-friendly error message
  details?: string[]     // Specific validation failures (optional)
}
```

### Emoji Logging Convention

The codebase uses emoji prefixes for visual debugging:

- ✅ Success operations
- ❌ Errors
- ⚠️ Warnings
- 🔒 Security-related operations
- 🔍 Validation checks
- 📦 Data operations

This helps quickly scan logs during development and debugging.

## State Management

### CartContext

**Location:** [/context/cart-context.tsx](context/cart-context.tsx)

- **Client-side only** - Does NOT persist to database
- **Actions:** addItem, removeItem, updateQuantity, clearCart, openCart, closeCart
- **Derived state:** totalItems, totalPrice (calculated on render)
- **Scope:** Provided in root layout, available to all components

**Note:** Cart is temporary and resets on page refresh. Orders are only created when user completes checkout.

### No Redux/Zustand

This project intentionally uses React Context instead of Redux/Zustand. The state management needs are simple enough that Context is sufficient and avoids additional complexity.

## Environment Variables

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL              # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY         # Public anon key (client-safe)
SUPABASE_SERVICE_ROLE_KEY             # Server-only! Never expose to client!

# Mercado Pago (required)
MP_ACCESS_TOKEN                        # Access token (or MERCADOPAGO_ACCESS_TOKEN)
NEXT_PUBLIC_MP_PUBLIC_KEY             # Public key (optional, for future features)

# Base URL (required for webhooks and redirects)
NEXT_PUBLIC_BASE_URL                  # http://localhost:3000 in dev
```

**⚠️ CRITICAL:** Never prefix `SUPABASE_SERVICE_ROLE_KEY` with `NEXT_PUBLIC_` - it must remain server-only!

## Database Schema Highlights

Key tables and their relationships:

```
products
  - id (int8, PK)
  - name, price, stock
  - category (FK -> categories.id)
  - fragrance fields: top_notes, heart_notes, base_notes
  - metadata: season, longevity, sillage, time_of_day

categories
  - id (int4, PK)
  - name, image_url

orders
  - id (int8, PK)
  - total_amount (numeric)
  - status ('pending', 'approved', 'completed', 'cancelled')
  - payment_id (text, from Mercado Pago)
  - customer_details (JSONB) - stores customer info for anonymous users
  - user_id (uuid, nullable) - null for guest checkouts

order_items
  - id (int8, PK)
  - order_id (FK -> orders.id)
  - product_id (FK -> products.id)
  - quantity, unit_price

site_config
  - Singleton table for site-wide settings (hero, contact info, etc.)
```

**Important:** Orders support anonymous checkout via `customer_details` JSONB field and nullable `user_id`.

## Important Non-Obvious Patterns

### 1. Webhook Idempotency

Mercado Pago may send duplicate webhook notifications. The webhook handler checks `order.status` before processing:

```typescript
if (order.status === 'approved' || order.status === 'completed') {
  return NextResponse.json({
    message: 'Order already processed'
  }, { status: 200 })
}
```

Always return 200 to prevent MP from retrying.

### 2. Stock Management

Stock updates use an atomic RPC function with fallback:

```typescript
// Try atomic RPC function first
const { error: rpcError } = await supabase.rpc('decrement_stock', {
  product_id: item.product_id,
  quantity: item.quantity
})

// Fallback to direct UPDATE if RPC unavailable
if (rpcError) {
  await supabase
    .from('products')
    .update({ stock: product.stock - item.quantity })
    .eq('id', item.product_id)
}
```

Use `Promise.allSettled()` for parallel updates with error tolerance.

### 3. Supabase Singleton Pattern

All Supabase clients use singleton pattern (via `globalThis`) to prevent multiple instances in SSR environment:

```typescript
const globalForSupabase = globalThis as unknown as { __supabase?: SupabaseClient }

if (!globalForSupabase.__supabase && supabaseUrl && supabaseAnonKey) {
  globalForSupabase.__supabase = createClient(supabaseUrl, supabaseAnonKey)
}
```

This is critical for Next.js App Router to work correctly.

### 4. Async Page Params (Next.js 15+)

Next.js 15+ requires params to be awaited:

```typescript
// ✅ Correct (Next.js 15+)
export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // ...
}
```

### 5. Dynamic Route Configuration

The shop page forces dynamic rendering to ensure fresh data:

```typescript
export const dynamic = "force-dynamic"
```

This prevents stale product listings.

## Key Files Reference

```
/lib/supabase.ts                          # Supabase clients + types (223 lines)
/app/api/checkout/route.ts                # Order creation + validation (356 lines)
/app/api/webhooks/mercadopago/route.ts    # Payment webhook handler (360 lines)
/context/cart-context.tsx                 # Client-side cart state
/components/checkout/checkout-button.tsx  # Checkout UI entry point
/docs/SECURITY-SUMMARY.md                 # Security audit report
/docs/IMPLEMENTATION-SUMMARY.md           # Implementation checklist
```

## Common Pitfalls to Avoid

1. ❌ **Don't trust prices from frontend** - Always fetch from database
2. ❌ **Don't use admin client in client components** - Server-only!
3. ❌ **Don't skip webhook payment verification** - Always query MP API
4. ❌ **Don't skip stock validation** - Check before creating orders
5. ❌ **Don't expose SERVICE_ROLE_KEY** - Never use NEXT_PUBLIC_ prefix
6. ❌ **Don't forget error handling** - Use consistent response format
7. ❌ **Don't trust webhook payload** - Verify with payment provider API
8. ❌ **Don't create orders without validation** - Price + stock checks first

## Testing Checkout Flow

To test the checkout flow locally:

1. Start dev server: `pnpm dev`
2. Add products to cart
3. Fill out customer info form
4. Click checkout (redirects to Mercado Pago sandbox)
5. Use test credentials to complete payment
6. Webhook processes payment and updates order
7. User redirected to success page

**Note:** Webhook must be accessible from internet. Use ngrok or similar for local testing.

## Additional Documentation

- **Security Audit:** [docs/SECURITY-SUMMARY.md](docs/SECURITY-SUMMARY.md)
- **Checkout Setup:** [docs/CHECKOUT-SETUP.md](docs/CHECKOUT-SETUP.md)
- **Implementation:** [docs/IMPLEMENTATION-SUMMARY.md](docs/IMPLEMENTATION-SUMMARY.md)
