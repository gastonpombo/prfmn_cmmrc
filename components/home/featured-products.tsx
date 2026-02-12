import { getSupabaseClient, type Product } from "@/lib/supabase"
import { FeaturedCarousel } from "./featured-carousel"

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .gt("stock", 0)
    .order("id", { ascending: false })
    .limit(8)
  if (error) {
    console.error("Error fetching products:", error)
    return []
  }
  return data || []
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  if (products.length === 0) {
    return null
  }

  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <p className="mb-2 font-sans text-xs uppercase tracking-[0.3em] text-secondary">
            Reci&eacute;n Llegados
          </p>
          <h2 className="text-balance font-serif text-3xl text-primary md:text-4xl">
            Novedades
          </h2>
        </div>
        <FeaturedCarousel products={products} />
      </div>
    </section>
  )
}
