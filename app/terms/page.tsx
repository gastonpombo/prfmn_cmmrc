import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "T\u00E9rminos de Uso | PerfuMan",
  description: "T\u00E9rminos y condiciones de uso de PerfuMan Boutique de Perfumes.",
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-12 text-center">
        <p className="mb-2 font-sans text-xs uppercase tracking-[0.3em] text-secondary">
          Legal
        </p>
        <h1 className="text-balance font-serif text-4xl text-primary md:text-5xl">
          T&eacute;rminos de Uso
        </h1>
      </div>

      <div className="flex flex-col gap-8">
        <section>
          <h2 className="mb-3 font-serif text-xl text-primary">
            1. Condiciones Generales
          </h2>
          <p className="font-sans text-sm leading-relaxed text-muted-foreground">
            Al acceder y utilizar este sitio web, usted acepta estar sujeto a
            estos t&eacute;rminos de servicio, todas las leyes y regulaciones aplicables,
            y acepta que es responsable del cumplimiento de las leyes locales
            aplicables. Si no est&aacute; de acuerdo con alguno de estos t&eacute;rminos, tiene
            prohibido usar o acceder a este sitio.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl text-primary">
            2. Uso de la Tienda
          </h2>
          <p className="font-sans text-sm leading-relaxed text-muted-foreground">
            Los productos ofrecidos en PerfuMan son para uso personal. Nos
            reservamos el derecho de limitar las cantidades de cualquier producto
            o servicio que ofrecemos. Todas las descripciones de productos y
            precios est&aacute;n sujetos a cambios en cualquier momento sin previo
            aviso.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl text-primary">
            3. Precios y Pagos
          </h2>
          <p className="font-sans text-sm leading-relaxed text-muted-foreground">
            Los precios publicados en el sitio son en pesos argentinos (ARS) e
            incluyen IVA. Aceptamos pagos con tarjetas de cr&eacute;dito, d&eacute;bito y
            transferencias bancarias. El pago se procesa de forma segura a
            trav&eacute;s de pasarelas de pago certificadas.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl text-primary">
            4. Propiedad Intelectual
          </h2>
          <p className="font-sans text-sm leading-relaxed text-muted-foreground">
            Todo el contenido de este sitio web, incluyendo texto, gr&aacute;ficos,
            logotipos, im&aacute;genes y software, es propiedad de PerfuMan y est&aacute;
            protegido por las leyes de propiedad intelectual aplicables.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl text-primary">
            5. Contacto
          </h2>
          <p className="font-sans text-sm leading-relaxed text-muted-foreground">
            Para cualquier consulta sobre estos t&eacute;rminos, pod&eacute;s contactarnos a
            trav&eacute;s de info@perfuman.com.ar o por WhatsApp al +54 9 11 1234-5678.
          </p>
        </section>
      </div>
    </div>
  )
}
