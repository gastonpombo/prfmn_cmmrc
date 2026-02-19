import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductById, getRelatedProducts } from "@/lib/supabase"
import { AddToCartButton } from "@/components/product/add-to-cart-button"
import { RelatedProducts } from "@/components/product/related-products"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductActionBar } from "@/components/product/product-action-bar"
import { RecentlyViewed } from "@/components/product/recently-viewed"
import { Clock, Sparkles } from "lucide-react"
import { NotePills } from "@/components/product/note-pills"
import { IntensityScale } from "@/components/product/intensity-scale"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProductById(Number(id))

  if (!product) {
    notFound()
  }

  const relatedProducts = product.category ? await getRelatedProducts(product.category, product.id, 4) : []

  // Helper for season icon
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
    <div className="min-h-screen bg-background pb-40 md:pb-20">

      {/* ── Main Layout ── */}
      <div className="md:mx-auto md:max-w-7xl md:grid md:grid-cols-2 md:gap-12 md:px-6 md:py-12">

        {/* ── Left Column: Image (Sticky on Desktop) ── */}
        <div className="relative">
          {/* Desktop Sticky Container */}
          <div className="md:sticky md:top-24 md:h-[calc(100vh-8rem)]">
            {/* 
                  Mobile: Immersive 55vh, Rounded Bottom 3xl (1.5rem)
                  Desktop: Full height, Rounded 2xl 
                */}
            <div className="relative h-[55vh] w-full overflow-hidden rounded-b-3xl shadow-lg md:h-full md:rounded-2xl">
              <ProductGallery
                images={[product.image_url || "/placeholder.svg"]}
                name={product.name}
              />
            </div>
          </div>
        </div>

        {/* ── Right Column: Details ── */}
        <div className="md:px-0 md:py-0">

          {/* Breadcrumb (Desktop Only) */}
          <nav className="mb-6 hidden items-center gap-2 text-xs md:flex">
            <Link href="/" className="text-muted-foreground hover:text-secondary">Inicio</Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/shop" className="text-muted-foreground hover:text-secondary">Catálogo</Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-foreground">{product.name}</span>
          </nav>

          {/* Mobile Content Container */}
          <div className="px-6 pt-8">

            {/* Brand / Collection */}
            <p className="mb-3 font-sans text-xs uppercase tracking-[0.25em] text-secondary">
              PerfuMan Exclusive
            </p>

            {/* Title */}
            <h1 className="mb-2 font-serif text-4xl font-medium tracking-tight text-primary md:text-5xl">
              {product.name}
            </h1>

            {/* Price */}
            <p className="mb-6 font-serif text-2xl text-muted-foreground md:text-3xl">
              ${product.price.toLocaleString("es-AR")}
            </p>

            {/* Description (Short) */}
            <div className="mb-10 prose prose-neutral prose-sm leading-relaxed text-muted-foreground/90">
              <p>{product.description || "Una fragancia sofisticada que deja una impresión duradera. Notas seleccionadas para momentos inolvidables."}</p>
            </div>

            {/* Desktop Add to Cart (Hidden on Mobile) */}
            <div className="mb-10 hidden md:block">
              <AddToCartButton product={product} />
            </div>

            {/* ── Accordions (Shadcn) - Minimalist ── */}
            <Accordion type="single" collapsible className="w-full border-t border-white/10">

              {/* 1. Notas Olfativas */}
              <AccordionItem value="notes" className="border-white/10">
                <AccordionTrigger className="font-serif text-lg text-primary hover:text-secondary hover:no-underline">
                  Notas Olfativas
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4 pb-6">
                    {(product.top_notes || product.heart_notes || product.base_notes) ? (
                      <NotePills
                        topNotes={product.top_notes}
                        heartNotes={product.heart_notes}
                        baseNotes={product.base_notes}
                      />
                    ) : (
                      <p className="text-muted-foreground italic">Consultar al asesor.</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 2. Detalles e Ingredientes */}
              <AccordionItem value="details" className="border-white/10">
                <AccordionTrigger className="font-serif text-lg text-primary hover:text-secondary hover:no-underline">
                  Detalles e Ingredientes
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 pt-4 pb-6">
                    <div className="grid gap-6">
                      <IntensityScale value={product.longevity} label="Longevidad" />
                      <IntensityScale value={product.sillage} label="Estela" />
                    </div>
                    {product.time_of_day && (
                      <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-4">
                        <Clock className="h-5 w-5 text-secondary" />
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Uso Recomendado</p>
                          <p className="font-medium capitalize text-foreground">{product.time_of_day}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

            </Accordion>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="mt-16 pt-10">
                <h3 className="mb-6 font-serif text-2xl text-primary">También te podría gustar</h3>
                <RelatedProducts products={relatedProducts} />
              </div>
            )}

            {/* Recently Viewed */}
            <div className="mt-10">
              <RecentlyViewed currentProduct={product} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Sticky Action Bar ── */}
      <ProductActionBar product={product} />
    </div>
  )
}
