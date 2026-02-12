import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pol\u00EDticas de Devoluci\u00F3n | PerfuMan",
  description: "Conoce nuestras pol\u00EDticas de devoluci\u00F3n y cambios en PerfuMan.",
}

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-12 text-center">
        <p className="mb-2 font-sans text-xs uppercase tracking-[0.3em] text-secondary">
          Legal
        </p>
        <h1 className="text-balance font-serif text-4xl text-primary md:text-5xl">
          Pol&iacute;ticas de Devoluci&oacute;n
        </h1>
      </div>

      <div className="flex flex-col gap-8">
        <section>
          <h2 className="mb-3 font-serif text-xl text-primary">
            Plazo de Devoluci&oacute;n
          </h2>
          <p className="font-sans text-sm leading-relaxed text-muted-foreground">
            Ten&eacute;s hasta 30 d&iacute;as corridos desde la fecha de recepci&oacute;n del
            producto para solicitar un cambio o devoluci&oacute;n. El producto debe
            estar sin uso, en su envase original y con todas las etiquetas
            intactas.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl text-primary">
            Condiciones
          </h2>
          <ul className="flex flex-col gap-2">
            <li className="font-sans text-sm leading-relaxed text-muted-foreground">
              &bull; El producto debe estar sin abrir y en condiciones originales.
            </li>
            <li className="font-sans text-sm leading-relaxed text-muted-foreground">
              &bull; El empaque original debe estar en buen estado.
            </li>
            <li className="font-sans text-sm leading-relaxed text-muted-foreground">
              &bull; Se debe presentar el comprobante de compra.
            </li>
            <li className="font-sans text-sm leading-relaxed text-muted-foreground">
              &bull; Los productos en oferta o promoci&oacute;n pueden tener condiciones
              especiales.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl text-primary">
            Proceso de Devoluci&oacute;n
          </h2>
          <p className="font-sans text-sm leading-relaxed text-muted-foreground">
            Para iniciar una devoluci&oacute;n, contact&aacute;nos por WhatsApp al +54 9 11
            1234-5678 o por email a info@perfuman.com.ar indicando tu n&uacute;mero de
            pedido y el motivo de la devoluci&oacute;n. Nuestro equipo te guiar&aacute; en
            el proceso y coordinar&aacute; el retiro o env&iacute;o del producto.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl text-primary">
            Reembolsos
          </h2>
          <p className="font-sans text-sm leading-relaxed text-muted-foreground">
            Una vez recibido y verificado el producto, procesaremos el reembolso
            dentro de los 10 d&iacute;as h&aacute;biles siguientes. El reembolso se
            realizar&aacute; por el mismo medio de pago utilizado en la compra
            original.
          </p>
        </section>
      </div>
    </div>
  )
}
