"use client"

import Link from "next/link"
import { useState } from "react"

interface FooterProps {
  contactEmail: string | null
  contactWhatsapp: string | null
}

export function Footer({ contactEmail, contactWhatsapp }: FooterProps) {
  const [email, setEmail] = useState("")
  const displayEmail = contactEmail || "info@perfuman.com.ar"
  const displayWhatsapp = contactWhatsapp || "+54 9 11 1234-5678"

  return (
    <footer className="border-t border-border/20" style={{ background: "hsl(24, 8%, 5%)" }}>
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <span className="font-serif text-xl tracking-[0.1em] text-foreground/90">PerfuMan</span>
            <p className="font-sans text-sm leading-relaxed text-foreground/40">
              Descubr&iacute; fragancias que cuentan historias. Cada perfume es una experiencia
              &uacute;nica, seleccionada con pasi&oacute;n y dedicaci&oacute;n.
            </p>
          </div>

          {/* Tienda */}
          <div className="flex flex-col gap-5">
            <h4 className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/50">Tienda</h4>
            <nav className="flex flex-col gap-3">
              <Link
                href="/shop"
                className="font-sans text-sm text-white/50 transition-colors duration-300 hover:text-secondary"
              >
                Cat&aacute;logo
              </Link>
              <Link
                href="/about"
                className="font-sans text-sm text-white/50 transition-colors duration-300 hover:text-secondary"
              >
                Sobre M&iacute;
              </Link>
              <Link
                href="/contact"
                className="font-sans text-sm text-white/50 transition-colors duration-300 hover:text-secondary"
              >
                Contacto
              </Link>
            </nav>
          </div>

          {/* Ayuda y Legales */}
          <div className="flex flex-col gap-5">
            <h4 className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/50">
              Ayuda y Legales
            </h4>
            <nav className="flex flex-col gap-3">
              <Link
                href="/returns"
                className="font-sans text-sm text-foreground/40 transition-colors duration-300 hover:text-secondary"
              >
                Pol&iacute;ticas de Devoluci&oacute;n
              </Link>
              <Link
                href="/terms"
                className="font-sans text-sm text-foreground/40 transition-colors duration-300 hover:text-secondary"
              >
                T&eacute;rminos de Uso
              </Link>
              <Link
                href="#"
                className="font-sans text-sm text-foreground/40 transition-colors duration-300 hover:text-secondary"
              >
                Preguntas Frecuentes
              </Link>
            </nav>
          </div>

          {/* Contacto & Newsletter */}
          <div className="flex flex-col gap-5">
            <h4 className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/50">
              Contacto
            </h4>
            <p className="font-sans text-sm text-foreground/40">
              {"WhatsApp: "}{displayWhatsapp}
            </p>
            <p className="font-sans text-sm text-foreground/40">
              {displayEmail}
            </p>
            <div className="mt-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Email para newsletter
              </label>
              <div className="flex">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu email"
                  className="flex-1 border border-border/40 bg-foreground/5 px-4 py-2.5 font-sans text-sm text-foreground/80 placeholder:text-foreground/25 focus:border-secondary focus:outline-none"
                />
                <button
                  type="button"
                  className="border border-secondary bg-secondary px-5 py-2.5 font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-secondary-foreground transition-all duration-300 hover:bg-secondary/90"
                >
                  Suscribir
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-border/15 pt-8">
          <p className="text-center font-sans text-[10px] uppercase tracking-[0.15em] text-foreground/25">
            &copy; {new Date().getFullYear()} PerfuMan. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
