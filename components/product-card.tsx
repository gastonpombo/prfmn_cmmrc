"use client"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/supabase"
import { useCart } from "@/context/cart-context"
import { ShoppingBag } from "lucide-react"

// ---------------------------------------------------------------------------
// ProductCard — Mobile-First, Touch-Optimized, Luxury Minimal
// ---------------------------------------------------------------------------

interface ProductCardProps {
  product: Product
  priority?: boolean
  /** Stagger index for fade-in-up animation (0-based) */
  index?: number
  /** Optional category/family name to display as tag */
  categoryLabel?: string
}

export function ProductCard({ product, priority = false, index = 0, categoryLabel }: ProductCardProps) {
  const { addItem } = useCart()
  const isOutOfStock = product.stock <= 0

  // Stagger delay: 60ms per card, max 600ms
  const staggerDelay = `${Math.min(index * 60, 600)}ms`

  return (
    <article
      className="flex flex-col animate-fade-in-up opacity-0"
      style={{ animationDelay: staggerDelay }}
    >
      {/* ── Image Container ── */}
      <Link
        href={`/product/${product.id}`}
        className="group relative aspect-[3/4] overflow-hidden bg-[hsl(24,8%,12%)]
                   active:scale-[0.97] transition-transform duration-300 ease-out"
        style={{ boxShadow: "inset 0 0 0 1px hsl(36 12% 18% / 0.5)" }}
      >
        <Image
          src={product.image_url || "/images/hero-perfume.jpg"}
          alt={product.name}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
          className="object-contain p-6 sm:p-8
                     transition-transform duration-700 ease-out
                     md:group-hover:scale-[1.05]"
        />

        {/* Gradient shimmer — desktop only */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent
                        opacity-0 transition-opacity duration-500
                        md:group-hover:opacity-100" />

        {/* Sold out overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-[2px]">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
              Agotado
            </span>
          </div>
        )}

        {/* Desktop-only hover cart — frosted gold pill */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            addItem(product)
          }}
          disabled={isOutOfStock}
          className="absolute bottom-3 right-3 z-10
                     hidden h-11 w-11 items-center justify-center
                     border border-secondary/60 bg-secondary/90 text-secondary-foreground
                     opacity-0 transition-all duration-500 ease-out
                     hover:bg-secondary hover:border-secondary
                     group-hover:opacity-100
                     disabled:cursor-not-allowed disabled:opacity-30
                     md:flex"
          style={{ backdropFilter: "blur(4px)" }}
          aria-label={`Agregar ${product.name} al carrito`}
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      </Link>

      {/* ── Product Info — always visible ── */}
      <div className="mt-3 flex flex-col gap-1 px-0.5 sm:mt-4 sm:gap-1.5">
        <Link href={`/product/${product.id}`}>
          {categoryLabel && (
            <span className="block mb-1 font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
              {categoryLabel}
            </span>
          )}
          {/* Brand */}
          <p className="mb-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-secondary/90">
            {product.brand || "EXCLUSIVO"}
          </p>
          <h3 className="font-sans text-[11px] sm:text-xs font-semibold uppercase
                         tracking-[0.14em] text-primary/70 line-clamp-2
                         transition-colors duration-300
                         md:hover:text-secondary mb-1">
            {product.name}
          </h3>
        </Link>

        <span className="font-serif text-lg sm:text-xl font-light tracking-tight text-secondary">
          ${product.price.toLocaleString("es-AR")}
        </span>
      </div>

      {/* ── Mobile CTA — always visible, 44px+ tap target ── */}
      <div className="mt-2.5 sm:mt-3 md:hidden">
        <button
          type="button"
          onClick={() => addItem(product)}
          disabled={isOutOfStock}
          className="flex h-11 w-full items-center justify-center gap-2
                     border border-secondary/50 bg-transparent text-secondary
                     transition-all duration-200 ease-out
                     active:scale-[0.96] active:bg-secondary/10
                     disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Agregar ${product.name} al carrito`}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.2em]">
            Agregar
          </span>
        </button>
      </div>
    </article>
  )
}
