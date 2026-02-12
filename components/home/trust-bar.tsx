import { Truck, ShieldCheck, CreditCard, MessageCircle } from "lucide-react"

const trustItems = [
  {
    icon: Truck,
    title: "Env\u00EDos a todo el pa\u00EDs",
    description: "R\u00E1pido y seguro",
  },
  {
    icon: ShieldCheck,
    title: "100% Originales",
    description: "Garant\u00EDa de autenticidad",
  },
  {
    icon: CreditCard,
    title: "Pago Seguro",
    description: "Todas las tarjetas",
  },
  {
    icon: MessageCircle,
    title: "Atenci\u00F3n Personalizada",
    description: "Asesoramiento experto",
  },
]

export function TrustBar() {
  return (
    <section className="border-b border-border bg-background py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center gap-3 text-center"
            >
              <item.icon className="h-7 w-7 text-secondary" strokeWidth={1.5} />
              <div>
                <h3 className="font-sans text-sm font-semibold text-primary">
                  {item.title}
                </h3>
                <p className="mt-1 font-sans text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
