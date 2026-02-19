"use client"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/supabase"
import { useCart } from "@/context/cart-context"
import { ShoppingBag } from "lucide-react"

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addItem } = useCart()

  return (
    <article className="group flex flex-col cursor-pointer">
      {/* ── Image Container ─────────────────────────────────── */}
      <Link
        href={`/product/${product.id}`}
        className="relative aspect-[3/4] overflow-hidden bg-[hsl(24,8%,12%)]"
        style={{ boxShadow: "inset 0 0 0 1px hsl(36 12% 18% / 0.6)" }}
      >
        <Image
          src={product.image_url || "/images/hero-perfume.jpg"}
          alt={product.name}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />

        {/* Gradient shimmer — rich depth on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Sold out overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/75 backdrop-blur-[2px]">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
              Agotado
            </span>
          </div>
        )}

        {/* Desktop hover cart — antique gold pill bottom-right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            addItem(product)
          }}
          disabled={product.stock <= 0}
          className="absolute bottom-4 right-4 z-10 hidden h-10 w-10 items-center justify-center border border-secondary/70 bg-secondary/90 text-secondary-foreground
                     opacity-0 transition-all duration-500 ease-out
                     hover:bg-secondary hover:border-secondary
                     group-hover:opacity-100
                     disabled:cursor-not-allowed disabled:opacity-30
                     md:flex"
          style={{ backdropFilter: "blur(4px)" }}
          aria-label={`Agregar ${product.name} al carrito`}
        >
          <ShoppingBag className="h-[15px] w-[15px]" />
        </button>
      </Link>

      {/* ── Product Info ─────────────────────────────────────── */}
      <div className="mt-5 flex flex-col gap-2 px-0.5">
        {/* Brand / name */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/70 transition-colors duration-300 hover:text-secondary line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <span className="font-serif text-xl font-light tracking-tight text-secondary">
          ${product.price.toLocaleString("es-AR")}
        </span>
      </div>

      {/* ── Mobile CTA ───────────────────────────────────────── */}
      <div className="mt-3 md:hidden">
        <button
          type="button"
          onClick={() => addItem(product)}
          disabled={product.stock <= 0}
          className="flex h-10 w-full items-center justify-center gap-2
                     border border-secondary/60 bg-transparent text-secondary
                     transition-colors duration-300
                     hover:bg-secondary hover:text-secondary-foreground
                     active:opacity-80
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
