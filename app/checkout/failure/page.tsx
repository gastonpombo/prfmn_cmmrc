"use client"

export const dynamic = "force-dynamic"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { X, ArrowLeft, RefreshCw, Headphones } from "lucide-react"

const REASONS = [
  "Fondos insuficientes en la tarjeta",
  "Datos de la tarjeta incorrectos",
  "Límite de compra excedido",
  "Tarjeta vencida o bloqueada",
  "Problemas de conexión con el banco",
]

function FailureContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id") || searchParams.get("external_reference")

  function handleRetry() {
    // Cart is kept in context/localStorage — simply navigate back to checkout
    router.push("/checkout")
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-24">

      {/* Radial glow backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(239,68,68,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Thin top divider line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/25 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-lg text-center">

        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10"
            style={{ boxShadow: "0 0 40px rgba(239,68,68,0.12)" }}
          >
            <X className="h-10 w-10 stroke-[1.5] text-red-400" />
          </div>
        </div>

        {/* Headline */}
        <p className="mb-3 font-sans text-xs uppercase tracking-[0.35em] text-red-400/80">
          Pago Rechazado
        </p>
        <h1 className="mb-4 font-serif text-3xl leading-tight text-primary md:text-4xl">
          Hubo un problema con el pago
        </h1>
        <p className="mx-auto mb-10 max-w-sm font-sans text-sm leading-relaxed text-muted-foreground">
          No te preocupes, no se realizó ningún cargo.
          Tus productos siguen guardados en el carrito.
        </p>

        {/* Reasons card */}
        <div className="mb-10 rounded-2xl border border-white/8 bg-white/[0.03] px-6 py-5 text-left backdrop-blur-sm">
          {orderId && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <span className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                  Referencia
                </span>
                <span className="font-mono text-sm text-primary/70">#{orderId}</span>
              </div>
              <div className="mb-4 h-px bg-white/8" />
            </>
          )}

          <p className="mb-3 font-sans text-xs uppercase tracking-widest text-muted-foreground">
            Causas frecuentes
          </p>
          <ul className="space-y-2">
            {REASONS.map((r) => (
              <li key={r} className="flex items-center gap-2.5">
                <span className="h-1 w-1 flex-shrink-0 rounded-full bg-red-400/60" />
                <span className="font-sans text-xs leading-relaxed text-muted-foreground">
                  {r}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 h-px bg-white/8" />
          <p className="mt-4 font-sans text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-primary/80">Consejo:</span> verificá los datos de tu
            tarjeta o intentá con otro método de pago.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {/* Primary: retry — cart is PRESERVED */}
          <button
            onClick={handleRetry}
            className="group inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-none border border-secondary bg-secondary px-8 font-sans text-xs font-semibold uppercase tracking-widest text-secondary-foreground transition-all duration-300 hover:bg-secondary/90"
          >
            <RefreshCw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" />
            Reintentar Pago
          </button>

          {/* Secondary: support */}
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-none border border-white/15 px-8 font-sans text-xs font-semibold uppercase tracking-widest text-primary/80 transition-all duration-300 hover:border-secondary/40 hover:text-secondary"
          >
            <Headphones className="h-3.5 w-3.5" />
            Contactar Soporte
          </a>
        </div>

        {/* Back link */}
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-1.5 font-sans text-xs text-muted-foreground/60 transition-colors hover:text-secondary"
        >
          <ArrowLeft className="h-3 w-3" />
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}

export default function CheckoutFailurePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background" />}>
      <FailureContent />
    </Suspense>
  )
}
