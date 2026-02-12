import { getSiteConfig } from "@/lib/supabase"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"

export default async function ContactPage() {
  const siteConfig = await getSiteConfig()

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <p className="mb-2 font-sans text-xs uppercase tracking-[0.3em] text-secondary">
          {"Habl\u00e1 con nosotros"}
        </p>
        <h1 className="text-balance font-serif text-4xl text-primary md:text-5xl">
          Contacto
        </h1>
      </div>

      <div className="flex flex-col gap-16 lg:flex-row">
        <ContactInfo
          email={siteConfig?.contact_email ?? null}
          whatsapp={siteConfig?.contact_whatsapp ?? null}
          address={siteConfig?.contact_address ?? null}
        />
        <ContactForm />
      </div>
    </div>
  )
}
