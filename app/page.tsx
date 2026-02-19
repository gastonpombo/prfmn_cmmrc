import { HeroBanner } from "@/components/home/hero-banner"
import { TrustBar } from "@/components/home/trust-bar"
import { CategoriesGrid } from "@/components/home/categories-grid"
import { FeaturedProducts } from "@/components/home/featured-products"
import { getSiteConfig, getStoreSettings, getFeaturedBrands } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"

export const revalidate = 60

export default async function HomePage() {
  const siteConfig = await getSiteConfig()
  const storeSettings = await getStoreSettings()
  const brands = await getFeaturedBrands()

  return (
    <main className="relative flex flex-col bg-background">
      {/* ── Layer 1: Hero (Base) ── */}
      <section className="sticky top-0 z-0 h-screen w-full overflow-hidden">
        <HeroBanner
          heroImageUrl={siteConfig?.hero_image_url}
          mobileImage={storeSettings?.hero_img_mobile}
          desktopImage={storeSettings?.hero_img_desktop}
          overlayOpacity={storeSettings?.hero_overlay_opacity}
        />
      </section>

      {/* ── Layer 1.5: Marcas Exclusivas (Scrolls over Hero) ── */}
      <section className="relative z-10 bg-background py-12 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-8 text-center font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Nuestras Marcas
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-70 grayscale transition-all hover:grayscale-0 hover:opacity-100">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/shop?marca=${encodeURIComponent(brand.name)}`}
                className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-sm ring-1 ring-white/5 md:h-20 md:w-20 transition-transform hover:scale-110 active:scale-95"
              >
                {brand.logo_url ? (
                  <div className="relative h-10 w-10 md:h-12 md:w-12">
                    <Image
                      src={brand.logo_url}
                      alt={brand.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-[10px] font-bold text-primary md:text-xs text-center px-1">
                    {brand.name}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Layer 2: Featured (Stacks on top) ── */}
      <section className="sticky top-0 z-10 flex min-h-screen w-full flex-col justify-center bg-background border-t border-white/5 shadow-[0_-5px_30px_rgba(0,0,0,0.5)]">
        <FeaturedProducts />
      </section>

      {/* ── Layer 3: Categories (Stacks on top) ── */}
      <section className="sticky top-0 z-20 flex min-h-screen w-full flex-col justify-center bg-background border-t border-white/5 shadow-[0_-5px_30px_rgba(0,0,0,0.5)]">
        <CategoriesGrid />
      </section>

      {/* ── Layer 4: Trust & Footer (Final) ── */}
      <section className="relative z-30 w-full bg-background border-t border-white/5">
        <TrustBar />
      </section>
    </main>
  )
}
