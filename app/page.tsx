import { Hero } from "@/components/home/hero"
import { TrustBar } from "@/components/home/trust-bar"
import { CategoriesGrid } from "@/components/home/categories-grid"
import { FeaturedProducts } from "@/components/home/featured-products"
import { getSiteConfig } from "@/lib/supabase"

export default async function HomePage() {
  const siteConfig = await getSiteConfig()

  return (
    <>
      <Hero
        title={siteConfig?.welcome_title ?? null}
        subtitle={siteConfig?.welcome_subtitle ?? null}
        imageUrl={siteConfig?.hero_image_url ?? null}
      />
      <TrustBar />
      <FeaturedProducts />
      <CategoriesGrid />
    </>
  )
}
