"use client"

import Link from "next/link"

interface FooterProps {
  contactEmail: string | null
  contactWhatsapp: string | null
}

export function Footer({ contactEmail, contactWhatsapp }: FooterProps) {
  const displayEmail = contactEmail || "info@perfuman.com.ar"
  const displayWhatsapp = contactWhatsapp || "+54 9 11 1234-5678"

  return (
    <footer className="border-t border-border/20" style={{ background: "hsl(24, 8%, 5%)" }}>
      <div className="mx-auto max-w-7xl px-4 py-8">

        {/* Brand Header (Compact) */}
        <div className="mb-8 flex flex-col gap-2">
          <span className="font-serif text-lg tracking-[0.1em] text-foreground/90">PerfuMan</span>
          <p className="max-w-md font-sans text-xs leading-relaxed text-foreground/40">
            Fragancias que cuentan historias. Selección exclusiva con pasión.
          </p>
        </div>

        {/* Main Grid: 3 Columns mobile */}
        <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm">

          {/* Col 1: Tienda */}
          <div className="flex flex-col gap-3">
            <h4 className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/50">
              Tienda
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/shop" className="text-white/50 hover:text-secondary transition-colors">Catálogo</Link>
              <Link href="/about" className="text-white/50 hover:text-secondary transition-colors">Sobre Mí</Link>
              <Link href="/contact" className="text-white/50 hover:text-secondary transition-colors">Contacto</Link>
            </nav>
          </div>

          {/* Col 2: Ayuda */}
          <div className="flex flex-col gap-3">
            <h4 className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/50">
              Ayuda
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/returns" className="text-white/50 hover:text-secondary transition-colors">Devoluciones</Link>
              <Link href="/terms" className="text-white/50 hover:text-secondary transition-colors">Términos</Link>
              <Link href="#" className="text-white/50 hover:text-secondary transition-colors">Fell back</Link>
            </nav>
          </div>

          {/* Col 3: Contacto */}
          <div className="flex flex-col gap-3">
            <h4 className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/50">
              Contacto
            </h4>
            <div className="flex flex-col gap-2 text-white/50">
              <p>WhatsApp:<br />{displayWhatsapp}</p>
              <p className="break-words">{displayEmail}</p>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border/15 pt-6 text-center">
          <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-foreground/25">
            &copy; {new Date().getFullYear()} PerfuMan.
          </p>
        </div>
      </div>
    </footer>
  )
}
