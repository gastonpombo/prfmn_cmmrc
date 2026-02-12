import Image from "next/image"
import Link from "next/link"

interface HeroProps {
  title: string | null
  subtitle: string | null
  imageUrl: string | null
}

export function Hero({ title, subtitle, imageUrl }: HeroProps) {
  const heroImage = imageUrl || "/images/hero-perfume.jpg"
  const heroTitle = title || "El arte de la fragancia"
  const heroSubtitle =
    subtitle ||
    "Descubr\u00ED nuestra colecci\u00F3n exclusiva de perfumes artesanales, creados para quienes buscan lo extraordinario."

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-black">
      <Image
        src={heroImage || "/placeholder.svg"}
        alt="Perfume de lujo sobre superficie de marmol"
        fill
        className="object-cover opacity-60"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24">
        <div className="max-w-2xl">
          <p className="mb-6 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-secondary">
            Boutique de Perfumes
          </p>
          <h1 className="mb-8 text-balance font-serif text-6xl font-light leading-[1.1] tracking-tight text-white md:text-7xl lg:text-8xl">
            {heroTitle}
          </h1>
          <p className="mb-10 max-w-lg font-sans text-base leading-relaxed text-white/70">
            {heroSubtitle}
          </p>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 border border-secondary bg-secondary px-10 py-4 font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-secondary-foreground transition-all duration-300 hover:bg-secondary/90"
          >
            {"Ver Colecci\u00F3n"}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
