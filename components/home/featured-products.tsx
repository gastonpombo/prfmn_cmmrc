import { getSupabaseClient, type Product } from "@/lib/supabase"
import { FeaturedCarousel } from "./featured-carousel"
import { ProductCard } from "@/components/product-card"

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

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <FeaturedCarousel products={products} />
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
