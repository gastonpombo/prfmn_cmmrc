import Image from "next/image"
import type { Metadata } from "next"
import { getSiteConfig } from "@/lib/supabase"

export const metadata: Metadata = {
  title: "Sobre M\u00ED | PerfuMan",
  description: "Conoc\u00E9 la historia detr\u00E1s de PerfuMan, nuestra pasi\u00F3n por la perfumer\u00EDa artesanal.",
}

export default async function AboutPage() {
  const siteConfig = await getSiteConfig()

  const aboutTitle =
    siteConfig?.about_title || "Una pasi\u00F3n convertida en arte"
  const aboutDescription =
    siteConfig?.about_description ||
    "PerfuMan naci\u00F3 de un sue\u00F1o simple: acercar las fragancias m\u00E1s exquisitas del mundo a quienes valoran lo aut\u00E9ntico. Cada perfume en nuestra colecci\u00F3n ha sido cuidadosamente seleccionado, probado y aprobado con un solo criterio: la excelencia.\n\nCon m\u00E1s de 10 a\u00F1os de experiencia en el mundo de la perfumer\u00EDa, me dedico a buscar las mejores casas perfumistas y las creaciones m\u00E1s \u00FAnicas para ofrecerte una experiencia olfativa inolvidable.\n\nCreo firmemente que un perfume es mucho m\u00E1s que un aroma: es una extensi\u00F3n de tu personalidad, un recuerdo que perdura y una forma de arte que llevamos con nosotros."
  const aboutImageUrl = siteConfig?.about_image_url || "/images/about-founder.jpg"
  const aboutQuote = siteConfig?.about_quote
  const aboutQuoteAuthor = siteConfig?.about_quote_author

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <p className="mb-2 font-sans text-xs uppercase tracking-[0.3em] text-secondary">
          Nuestra Historia
        </p>
        <h1 className="text-balance font-serif text-4xl text-primary md:text-5xl">
          Sobre M&iacute;
        </h1>
      </div>

      <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
        {/* Photo */}
        <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded bg-muted lg:w-1/2">
          <Image
            src={aboutImageUrl || "/placeholder.svg"}
            alt="Fundadora de PerfuMan en su boutique"
            fill
            className="object-cover"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-6 lg:w-1/2">
          <h2 className="font-serif text-2xl text-primary md:text-3xl">
            {aboutTitle}
          </h2>
          <div className="whitespace-pre-wrap font-sans text-base leading-relaxed text-muted-foreground">
            {aboutDescription}
          </div>
          
          {/* Quote Section */}
          {aboutQuote && (
            <div className="mt-8 border-l-2 border-secondary bg-card/30 py-6 pl-8 pr-6">
              <p className="font-serif text-2xl italic leading-relaxed text-secondary md:text-3xl">
                {`"${aboutQuote}"`}
              </p>
              {aboutQuoteAuthor && (
                <p className="mt-4 font-sans text-sm tracking-wider text-muted-foreground">
                  &mdash; {aboutQuoteAuthor}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
