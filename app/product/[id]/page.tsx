import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductById, getSiteConfig, getRelatedProducts, getSupabaseClient } from "@/lib/supabase"
import { AddToCartButton } from "@/components/product/add-to-cart-button"
import { OlfactoryPyramid } from "@/components/product/olfactory-pyramid"
import { IntensityScale } from "@/components/product/intensity-scale"
import { RelatedProducts } from "@/components/product/related-products"
import { Clock } from "lucide-react"
import { NotePills } from "@/components/product/note-pills"
import type { Category } from "@/lib/supabase"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProductById(Number(id))
  const siteConfig = await getSiteConfig()

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id, 4)

  // Fetch all categories
  const supabase = getSupabaseClient()
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  const getSeasonIcon = (season: string | undefined) => {
    if (!season) return null
    const seasonLower = season.toLowerCase()
    if (seasonLower.includes("verano")) return "🌞"
    if (seasonLower.includes("invierno")) return "❄️"
    if (seasonLower.includes("primavera")) return "🌸"
    if (seasonLower.includes("otoño")) return "🍂"
    return "🌙"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-secondary"
          >
            Inicio
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            href="/shop"
            className="text-muted-foreground transition-colors hover:text-secondary"
          >
            Catálogo
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Main Grid Layout */}
        <div className="grid gap-12 lg:grid-cols-[280px_1fr_1fr]">
          {/* Left Sidebar - Filters */}
          <aside className="hidden h-fit lg:block">
            <div className="sticky top-24 space-y-8 rounded-lg border border-border bg-card/30 p-6">
              <div>
                <h3 className="mb-4 font-serif text-sm uppercase tracking-widest text-secondary">
                  Categorías
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/shop"
                    className="block font-sans text-sm text-muted-foreground transition-colors hover:text-secondary"
                  >
                    Ver Todas
                  </Link>
                  {categories && categories.length > 0 && (
                    <>
                      {(categories as Category[]).map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/shop?category=${cat.id}`}
                          className={`block font-sans text-sm transition-colors ${
                            product.category === cat.id
                              ? "font-semibold text-secondary"
                              : "text-muted-foreground hover:text-secondary"
                          }`}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="space-y-12 lg:col-span-2">
            {/* Hero Section */}
            <div className="grid gap-8 md:grid-cols-2">
              {/* Product Image */}
              <div className="flex flex-col justify-center">
                <div className="relative aspect-square overflow-hidden border border-border bg-white">
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-contain p-8"
                    priority
                  />
                </div>
              </div>

              {/* Product Header */}
              <div className="flex flex-col justify-center">
                <div className="space-y-6">
                  <div>
                    <h1 className="font-serif text-5xl font-light tracking-tight text-primary md:text-6xl">
                      {product.name}
                    </h1>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <p className="font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Precio
                    </p>
                    <p className="font-serif text-5xl font-light text-secondary">
                      ${product.price.toLocaleString("es-AR")}
                    </p>
                  </div>

                  {/* Stock Status */}
                  <div>
                    {product.stock <= 0 ? (
                      <div className="inline-block border border-destructive px-4 py-2">
                        <span className="font-sans text-xs uppercase tracking-[0.15em] text-destructive">
                          Agotado
                        </span>
                      </div>
                    ) : (
                      <div className="inline-block border border-secondary/30 px-4 py-2">
                        <span className="font-sans text-xs uppercase tracking-[0.15em] text-secondary">
                          {product.stock} en stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <AddToCartButton product={product} />

                  {/* Quick Specs */}
                  <div className="border-t border-border pt-6 space-y-3">
                    <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                      Características Rápidas
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {product.season && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-xl">{getSeasonIcon(product.season)}</span>
                          <span className="font-sans text-xs text-foreground capitalize">
                            {product.season}
                          </span>
                        </div>
                      )}
                      {product.time_of_day && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-secondary" />
                          <span className="font-sans text-xs text-foreground capitalize">
                            {product.time_of_day}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            {product.description && (
              <div className="border-y border-border py-8">
                <h2 className="mb-4 font-serif text-2xl font-light tracking-tight text-secondary">
                  Descripción
                </h2>
                <p className="font-sans text-base leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </div>
            )}

            {/* Olfactory Profile */}
            {(product.top_notes || product.heart_notes || product.base_notes) && (
              <div className="border-b border-border pb-8">
                <h2 className="mb-6 font-serif text-2xl font-light tracking-tight text-secondary">
                  Perfil Olfativo
                </h2>
                <NotePills
                  topNotes={product.top_notes}
                  heartNotes={product.heart_notes}
                  baseNotes={product.base_notes}
                />
              </div>
            )}

            {/* Performance Metrics */}
            <div className="border-b border-border pb-8">
              <h2 className="mb-6 font-serif text-2xl font-light tracking-tight text-secondary">
                Rendimiento
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <IntensityScale value={product.longevity} label="Longevidad" />
                <IntensityScale value={product.sillage} label="Estela" />
              </div>
            </div>

            {/* Related Products Section - Full Width */}
            {relatedProducts.length > 0 && (
              <div className="mt-16 border-t border-border pt-16">
                <RelatedProducts products={relatedProducts} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
