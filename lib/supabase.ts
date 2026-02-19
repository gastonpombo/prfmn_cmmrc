import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase credentials missing during module initialization")
}

// True singleton: one instance shared across all server-side usage
const globalForSupabase = globalThis as unknown as { __supabase?: SupabaseClient }

if (!globalForSupabase.__supabase && supabaseUrl && supabaseAnonKey) {
  globalForSupabase.__supabase = createClient(supabaseUrl, supabaseAnonKey)
}

const supabase = globalForSupabase.__supabase

// Server-side usage (RSC, route handlers, server functions)
export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    console.error("❌ Attempted to use Supabase client but it was not initialized. Check environment variables.")
    // Return a dummy client or throw? Throwing is better to catch the error.
    throw new Error("Supabase client not initialized")
  }
  return supabase
}

// Client-side usage (via SupabaseProvider context - also a singleton)
export function createBrowserClient(): SupabaseClient {
  if (!supabase) {
    console.error("❌ Attempted to use Supabase client but it was not initialized. Check environment variables.")
    throw new Error("Supabase client not initialized")
  }
  return supabase
}

// Admin client with SERVICE_ROLE_KEY (bypasses RLS)
// ⚠️ SOLO usar en server-side code (API routes, server actions)
// NUNCA exponer el SERVICE_ROLE_KEY al cliente
let supabaseAdmin: SupabaseClient | null = null

export function getSupabaseAdminClient(): SupabaseClient {
  if (supabaseAdmin) return supabaseAdmin

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Admin client cannot be initialized."
    )
  }

  supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return supabaseAdmin
}

// ============================================
// Database Types - Basados en esquema de Supabase
// ============================================

export type Product = {
  id: number // int8
  name: string // text
  price: number // numeric
  stock: number // int4
  image_url?: string | null
  category?: number | null
  description?: string | null
  top_notes?: string | null
  heart_notes?: string | null
  base_notes?: string | null
  season?: string | null
  longevity?: string | null
  sillage?: string | null
  time_of_day?: string | null
  created_at?: string
  updated_at?: string
}

export type Category = {
  id: number
  name: string
  image_url: string
}

export type Order = {
  id: number // int8
  total_amount: number // numeric
  status: string // text (ej: 'pending', 'completed', 'cancelled')
  payment_id?: string | null // text
  customer_email?: string | null // text — columna dedicada para búsquedas rápidas
  customer_details: CustomerDetails // jsonb
  user_id?: string | null // uuid (null para usuarios anónimos)
  created_at?: string
  updated_at?: string
}

export type CustomerDetails = {
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
    shipping_company?: string // 'DAC' | 'UES'
    shipping_method?: string  // 'domicilio' | 'agencia'
  }
}

export type OrderItem = {
  id: number // int8
  order_id: number // int8, FK -> orders
  product_id: number // int8, FK -> products
  quantity: number // int4
  unit_price: number // numeric
  created_at?: string
}

// Tipo extendido para mostrar items con info del producto
export type OrderItemWithProduct = OrderItem & {
  product?: Product
}

// Tipo extendido para mostrar órdenes con sus items
export type OrderWithItems = Order & {
  order_items?: OrderItemWithProduct[]
}

// ============================================
// Tipos para Checkout y Carrito
// ============================================

export type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  image_url?: string
}

export type CheckoutRequest = {
  items: CartItem[]
  customer_info: CustomerDetails
}

export type CheckoutResponse = {
  success: boolean
  order_id: number
  init_point: string // URL de Mercado Pago
  preference_id: string
  error?: string
  details?: string[] | string
  missing_products?: number[]
}

export type SiteConfig = {
  announcement_message: string | null
  hero_image_url: string | null
  welcome_title: string | null
  welcome_subtitle: string | null
  contact_email: string | null
  contact_whatsapp: string | null
  about_title: string | null
  about_description: string | null
  about_image_url: string | null
  contact_address: string | null
  about_quote: string | null
  about_quote_author: string | null
}

export async function getProductById(id: number): Promise<Product | null> {
  const { data, error } = await getSupabaseClient()
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching product:", error.message)
    return null
  }

  return data as Product
}

export async function getRelatedProducts(categoryId: number, currentProductId: number, limit: number = 4): Promise<Product[]> {
  const { data, error } = await getSupabaseClient()
    .from("products")
    .select("*")
    .eq("category", categoryId)
    .neq("id", currentProductId)
    .limit(limit)

  if (error) {
    console.error("Error fetching related products:", error.message)
    return []
  }

  return (data || []) as Product[]
}

export async function getSiteConfig(): Promise<SiteConfig | null> {
  const { data, error } = await getSupabaseClient()
    .from("site_config")
    .select("*")
    .single()

  if (error) {
    console.error("Error fetching site_config:", error.message)
    return null
  }

  return data as SiteConfig
}
