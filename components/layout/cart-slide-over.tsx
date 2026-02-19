"use client"

import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { useCart } from "@/context/cart-context"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// CartSlideOver — Mobile-First, Touch-Optimized, Luxury Minimal
// ---------------------------------------------------------------------------

export function CartSlideOver() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } =
    useCart()

  if (!isOpen) return null

  return (
    <>
      {/* ── Backdrop — frosted dark overlay ── */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md animate-fade-in duration-500"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* ── Panel ── */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex flex-col",
          "w-[88%] sm:w-[400px] md:w-[420px]",
          "bg-background shadow-2xl animate-slide-in-right duration-500 ease-out",
          "border-l border-border/40"
        )}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-lg text-primary">Tu Carrito</h2>
            {totalItems > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center bg-secondary/15 px-1.5 font-sans text-[10px] font-semibold text-secondary">
                {totalItems}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-11 w-11 items-center justify-center text-primary/50
                       transition-all duration-200
                       active:scale-90 active:text-primary
                       md:hover:text-primary"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Scrollable Item List ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6">
          {items.length === 0 ? (
            /* ── Empty State ── */
            <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary/5">
                <ShoppingBag className="h-9 w-9 text-secondary/30" strokeWidth={1.2} />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="font-serif text-xl text-primary/80">
                  Tu carrito te está esperando
                </p>
                <p className="font-sans text-xs text-muted-foreground">
                  Explorá nuestra colección y encontrá tu fragancia ideal.
                </p>
              </div>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-2 flex h-11 items-center justify-center px-8
                           border border-secondary/50 bg-transparent
                           font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary
                           transition-all duration-200
                           active:scale-[0.96] active:bg-secondary/10
                           md:hover:bg-secondary md:hover:text-secondary-foreground"
              >
                Explorar fragancias
              </Link>
            </div>
          ) : (
            /* ── Cart Items ── */
            <ul className="flex flex-col gap-5">
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex gap-4 border-b border-border/40 pb-5 last:border-b-0"
                >
                  {/* Image */}
                  <Link
                    href={`/product/${item.product.id}`}
                    onClick={closeCart}
                    className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-[hsl(24,8%,12%)]
                               active:scale-[0.97] transition-transform duration-200"
                  >
                    <Image
                      src={item.product.image_url || "/images/hero-perfume.jpg"}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-contain p-2"
                    />
                  </Link>

                  {/* Info + Controls */}
                  <div className="flex flex-1 flex-col justify-between py-0.5">
                    {/* Name + Remove */}
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.product.id}`}
                        onClick={closeCart}
                        className="font-sans text-xs font-medium uppercase tracking-wide text-primary/80 line-clamp-2
                                   transition-colors duration-200 md:hover:text-secondary"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center
                                   text-muted-foreground/60
                                   transition-all duration-200
                                   active:scale-90 active:text-destructive
                                   md:hover:text-destructive"
                        aria-label={`Eliminar ${item.product.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Quantity + Price */}
                    <div className="flex items-center justify-between">
                      {/* Quantity Controls — 44px tap targets */}
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="flex h-11 w-11 items-center justify-center
                                     border border-border/60 text-primary/60
                                     transition-all duration-200
                                     active:scale-90 active:border-secondary active:text-secondary
                                     md:hover:border-secondary md:hover:text-secondary"
                          aria-label="Reducir cantidad"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="flex h-11 w-10 items-center justify-center
                                        border-y border-border/60
                                        font-sans text-sm tabular-nums text-primary">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="flex h-11 w-11 items-center justify-center
                                     border border-border/60 text-primary/60
                                     transition-all duration-200
                                     active:scale-90 active:border-secondary active:text-secondary
                                     md:hover:border-secondary md:hover:text-secondary"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Item total */}
                      <span className="font-serif text-base font-light tracking-tight text-secondary">
                        ${(item.product.price * item.quantity).toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Sticky Footer — always visible for checkout ── */}
        {items.length > 0 && (
          <div className="sticky bottom-0 border-t border-border/60 bg-background/95 backdrop-blur-sm px-5 py-4 sm:px-6">
            {/* Subtotal */}
            <div className="flex items-center justify-between pb-4">
              <span className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
                Subtotal
              </span>
              <span className="font-serif text-xl font-light tracking-tight text-primary">
                ${totalPrice.toLocaleString("es-AR")}
              </span>
            </div>

            {/* Checkout CTA — 48px height, prominent gold */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex h-12 w-full items-center justify-center
                         bg-secondary text-secondary-foreground
                         font-sans text-[11px] font-semibold uppercase tracking-[0.2em]
                         transition-all duration-200
                         active:scale-[0.97] active:opacity-90
                         md:hover:opacity-90"
            >
              Ir al Checkout
            </Link>

            {/* Continue shopping link */}
            <button
              type="button"
              onClick={closeCart}
              className="mt-3 w-full text-center font-sans text-[10px] uppercase tracking-wider
                         text-muted-foreground/70
                         transition-colors duration-200
                         active:text-primary
                         md:hover:text-primary"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}
