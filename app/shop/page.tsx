import { getSupabaseClient, type Product, type Category } from "@/lib/supabase"
import { ShopContent } from "@/components/shop/shop-content"

async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("name")
  if (error) {
    console.error("Error fetching products:", error)
    return []
  }
  return data || []
}

async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name")
  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }
  return data || []
}

export const metadata = {
  title: "Cat\u00E1logo | PerfuMan",
  description: "Explor\u00E1 nuestra colecci\u00F3n completa de perfumes exclusivos.",
}

export const dynamic = "force-dynamic"


export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10 text-center">
        <p className="mb-2 font-sans text-xs uppercase tracking-[0.3em] text-secondary">
          Colecci&oacute;n Completa
        </p>
        <h1 className="text-balance font-serif text-4xl text-primary md:text-5xl">
          Cat&aacute;logo
        </h1>
      </div>
      <ShopContent products={products} categories={categories} />
    </div>
  )
}
