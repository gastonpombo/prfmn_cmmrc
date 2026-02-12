import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductById, getSiteConfig, getRelatedProducts, getSupabaseClient } from "@/lib/supabase"
import { AddToCartButton } from "@/components/product/add-to-cart-button"
import { OlfactoryPyramid } from "@/components/product/olfactory-pyramid"
import { IntensityScale } from "@/components/product/intensity-scale"
import { RelatedProducts } from "@/components/product/related-products"
import { ProductGallery } from "@/components/product/product-gallery"
import { StickyAddToCart } from "@/components/product/sticky-add-to-cart"
import { RecentlyViewed } from "@/components/product/recently-viewed"
import { Clock, Star, ShieldCheck, Truck } from "lucide-react"
import { NotePills } from "@/components/product/note-pills"
import type { Category } from "@/lib/supabase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

  const relatedProducts = product.category ? await getRelatedProducts(product.category, product.id, 4) : []

  // Fetch all categories for sidebar
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
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm overflow-x-auto whitespace-nowrap pb-2">
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
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        {/* Main Grid Layout */}
        <div className="grid gap-12 lg:grid-cols-[280px_1fr_1fr]">
          {/* Left Sidebar - Filters (Desktop Only) */}
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
                          className={`block font-sans text-sm transition-colors ${product.category === cat.id
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
          <div className="space-y-16 lg:col-span-2">
            {/* Hero Section */}
            <div className="grid gap-8 md:grid-cols-2">
              {/* Product Gallery */}
              <div className="flex flex-col">
                <ProductGallery
                  images={[product.image_url || "/placeholder.svg"]}
                  name={product.name}
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-center">
                <div className="space-y-6">
                  <div>
                    <h1 className="font-serif text-4xl font-light tracking-tight text-primary md:text-5xl lg:text-6xl">
                      {product.name}
                    </h1>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex text-secondary">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                      </div>
                      <span className="text-xs text-muted-foreground">(5.0)</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <p className="font-serif text-4xl font-light text-secondary">
                      ${product.price.toLocaleString("es-AR")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      3 cuotas sin interés de ${(product.price / 3).toLocaleString("es-AR", { maximumFractionDigits: 2 })}
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
                      <div className="inline-block rounded-full bg-secondary/10 px-4 py-1">
                        <span className="font-sans text-xs font-medium text-secondary">
                          Disponible - {product.stock} unidades
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <div className="pt-4">
                    <AddToCartButton product={product} />
                  </div>

                  {/* Trust Badges */}
                  <div className="flex items-center gap-6 border-y border-border py-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      <span>Envío Gratis &gt; $50.000</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Garantía de Autenticidad</span>
                    </div>
                  </div>

                  {/* Quick Specs */}
                  <div className="space-y-3">
                    <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                      Características
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {product.season && (
                        <div className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm">
                          <span className="text-lg">{getSeasonIcon(product.season)}</span>
                          <span className="font-sans text-xs text-foreground capitalize">
                            {product.season}
                          </span>
                        </div>
                      )}
                      {product.time_of_day && (
                        <div className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm">
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

            {/* Product Details Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b border-border bg-transparent p-0">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent px-8 py-4 font-serif text-lg text-muted-foreground data-[state=active]:border-secondary data-[state=active]:text-secondary data-[state=active]:shadow-none"
                >
                  Descripción
                </TabsTrigger>
                <TabsTrigger
                  value="notes"
                  className="rounded-none border-b-2 border-transparent px-8 py-4 font-serif text-lg text-muted-foreground data-[state=active]:border-secondary data-[state=active]:text-secondary data-[state=active]:shadow-none"
                >
                  Notas Olfativas
                </TabsTrigger>
                <TabsTrigger
                  value="performance"
                  className="rounded-none border-b-2 border-transparent px-8 py-4 font-serif text-lg text-muted-foreground data-[state=active]:border-secondary data-[state=active]:text-secondary data-[state=active]:shadow-none"
                >
                  Rendimiento
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="py-8">
                <div className="prose prose-neutral max-w-none">
                  <p className="font-sans text-base leading-relaxed text-muted-foreground">
                    {product.description || "Sin descripción disponible."}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="py-8">
                {(product.top_notes || product.heart_notes || product.base_notes) ? (
                  <div className="max-w-2xl">
                    <NotePills
                      topNotes={product.top_notes}
                      heartNotes={product.heart_notes}
                      baseNotes={product.base_notes}
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground">Información no disponible.</p>
                )}
              </TabsContent>

              <TabsContent value="performance" className="py-8">
                <div className="grid gap-8 sm:grid-cols-2 max-w-2xl">
                  <IntensityScale value={product.longevity} label="Longevidad" />
                  <IntensityScale value={product.sillage} label="Estela" />
                </div>
              </TabsContent>
            </Tabs>

            {/* Recently Viewed */}
            <RecentlyViewed currentProduct={product} />

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <div className="border-t border-border pt-16">
                <RelatedProducts products={relatedProducts} />
              </div>
            )}
          </div>
        </div>
      </div>
      <StickyAddToCart product={product} />
    </div>
  )
}
