"use client"

import { Mail, Phone, MapPin } from "lucide-react"

interface ContactInfoProps {
  email: string | null
  whatsapp: string | null
  address: string | null
}

export function ContactInfo({ email, whatsapp, address }: ContactInfoProps) {
  const contactItems = [
    {
      icon: Phone,
      title: "WhatsApp",
      value: whatsapp || "+54 9 11 1234-5678",
      show: true,
    },
    {
      icon: Mail,
      title: "Email",
      value: email || "info@perfuman.com.ar",
      show: true,
    },
    {
      icon: MapPin,
      title: "Ubicación",
      value: address || "Buenos Aires, Argentina",
      show: true,
    },
  ]

  return (
    <div className="flex flex-col gap-8 lg:w-1/3">
      {contactItems.map(
        (item) =>
          item.show && (
            <div key={item.title} className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded bg-muted">
                <item.icon className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-sans text-sm font-semibold text-primary">
                  {item.title}
                </h3>
                <p className="mt-1 font-sans text-sm text-muted-foreground">
                  {item.value}
                </p>
              </div>
            </div>
          )
      )}
    </div>
  )
}
