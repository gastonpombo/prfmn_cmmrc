"use client"

export const dynamic = "force-dynamic"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef } from "react"
import { CheckCheck, ArrowRight, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId =
    searchParams.get("order_id") ||
    (typeof window !== "undefined" ? localStorage.getItem("last_order_id") : null)
  const total =
    searchParams.get("total") ||
    (typeof window !== "undefined" ? localStorage.getItem("last_order_total") : null)

  const { clearCart } = useCart()
  const cleared = useRef(false)

  useEffect(() => {
    if (!cleared.current) {
      clearCart()
      cleared.current = true
    }
  }, [clearCart])

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-24">

      {/* Radial glow backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(34,197,94,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Thin top divider line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-lg text-center">

        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10"
            style={{ boxShadow: "0 0 40px rgba(34,197,94,0.15)" }}
          >
            <CheckCheck className="h-10 w-10 stroke-[1.5] text-green-400" />
          </div>
        </div>

        {/* Headline */}
        <p className="mb-3 font-sans text-xs uppercase tracking-[0.35em] text-green-400/80">
          Pago Confirmado
        </p>
        <h1 className="mb-4 font-serif text-3xl leading-tight text-primary md:text-4xl">
          Tu fragancia está en camino
        </h1>
        <p className="mx-auto mb-10 max-w-sm font-sans text-sm leading-relaxed text-muted-foreground">
          Procesamos tu pedido correctamente. Recibirás un
          email con todos los detalles de tu compra.
        </p>

        {/* Order summary card */}
        <div className="mb-10 rounded-2xl border border-white/8 bg-white/[0.03] px-6 py-5 text-left backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
              Número de orden
            </span>
            <span className="font-mono text-sm font-medium text-primary">
              #{orderId ?? "—"}
            </span>
          </div>

          {total && (
            <>
              <div className="my-4 h-px bg-white/8" />
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                  Total pagado
                </span>
                <span className="font-mono text-sm font-medium text-secondary">
                  ${Number(total).toLocaleString("es-AR")}
                </span>
              </div>
            </>
          )}

          <div className="my-4 h-px bg-white/8" />
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary/10">
              <ShoppingBag className="h-3.5 w-3.5 text-secondary" />
            </div>
            <p className="font-sans text-xs leading-relaxed text-muted-foreground">
              Tu pedido será procesado en las próximas 24&nbsp;hs.
              Te avisaremos cuando sea despachado.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/shop"
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-none border border-secondary bg-secondary px-8 font-sans text-xs font-semibold uppercase tracking-widest text-secondary-foreground transition-all duration-300 hover:bg-secondary/90"
          >
            Seguir Comprando
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/profile"
            className="inline-flex h-11 items-center justify-center rounded-none border border-white/15 px-8 font-sans text-xs font-semibold uppercase tracking-widest text-primary/80 transition-all duration-300 hover:border-secondary/40 hover:text-secondary"
          >
            Ver mis órdenes
          </Link>
        </div>

        {/* Support */}
        <p className="mt-10 font-sans text-xs text-muted-foreground/60">
          ¿Tenés alguna duda?{" "}
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary/80 transition-colors hover:text-secondary"
          >
            Escribinos por WhatsApp
          </a>
        </p>
      </div>
    </main>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background" />}>
      <SuccessContent />
    </Suspense>
  )
}
