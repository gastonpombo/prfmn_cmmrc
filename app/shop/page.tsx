import { getSupabaseClient, type Product, type Category } from "@/lib/supabase"
import { ShopContent } from "@/components/shop/shop-content"

async function getProducts(searchParams?: { marca?: string; q?: string; category?: string }): Promise<Product[]> {
  const supabase = getSupabaseClient()
  let query = supabase
    .from("products")
    .select("*")
    .order("name")

  if (searchParams?.marca) {
    query = query.eq("brand", searchParams.marca) // Assuming 'brand' column
  }

  if (searchParams?.category) {
    query = query.eq("category", searchParams.category)
  }

  // Basic search if needed (though ShopContent usually handles client-side, 
  // server-side filter is better for initial load if URL has params)
  if (searchParams?.q) {
    query = query.ilike('name', `%${searchParams.q}%`)
  }

  const { data, error } = await query
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


export default async function ShopPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const marca = typeof searchParams?.marca === 'string' ? searchParams.marca : undefined
  const q = typeof searchParams?.q === 'string' ? searchParams.q : undefined
  const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined

  const [products, categories] = await Promise.all([
    getProducts({ marca, q, category }),
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
