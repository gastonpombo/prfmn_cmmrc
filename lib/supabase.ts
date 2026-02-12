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

export type Product = {
  id: number
  name: string
  price: number
  image_url: string
  category: number
  stock: number
  description?: string | null
  top_notes?: string | null
  heart_notes?: string | null
  base_notes?: string | null
  season?: string | null
  longevity?: string | null
  sillage?: string | null
  time_of_day?: string | null
}

export type Category = {
  id: number
  name: string
  image_url: string
}

export type Order = {
  id: number
  customer_email: string
  total: number
  status: string
  payment_id?: string | null
  created_at: string
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
