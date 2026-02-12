"use client"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/supabase"
import { useCart } from "@/context/cart-context"
import { ShoppingBag } from "lucide-react"

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addItem } = useCart()

  return (
    <div className="group flex flex-col">
      {/* Image Container - 3:4 ratio for tall perfume bottles */}
      <Link
        href={`/product/${product.id}`}
        className="relative aspect-[3/4] overflow-hidden border border-border bg-neutral-50"
      >
        <Image
          src={product.image_url || "/images/hero-perfume.jpg"}
          alt={product.name}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="object-contain p-6 transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Sold out overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-white/80">
              Agotado
            </span>
          </div>
        )}

        {/* Desktop-only hover cart button (inside image) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            addItem(product)
          }}
          disabled={product.stock <= 0}
          className="absolute bottom-3 right-3 z-10 hidden h-11 w-11 items-center justify-center border border-secondary bg-secondary text-secondary-foreground opacity-0 transition-all duration-500 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50 md:flex"
          aria-label={`Agregar ${product.name} al carrito`}
        >
          <ShoppingBag className="h-[18px] w-[18px]" />
        </button>
      </Link>

      {/* Product Info */}
      <div className="mt-4 flex flex-col gap-1.5 px-1">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-sans text-sm font-medium uppercase tracking-[0.08em] text-primary/90 transition-colors hover:text-secondary">
            {product.name}
          </h3>
        </Link>
        <span className="font-serif text-2xl font-light tracking-tight text-secondary">
          ${product.price.toLocaleString("es-AR")}
        </span>
      </div>

      {/* Mobile-only always-visible cart button (below info) */}
      <div className="mt-3 px-1 md:hidden">
        <button
          type="button"
          onClick={() => addItem(product)}
          disabled={product.stock <= 0}
          className="flex h-11 w-full items-center justify-center gap-2 border border-secondary bg-secondary text-secondary-foreground transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Agregar ${product.name} al carrito`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="font-sans text-xs font-semibold uppercase tracking-widest">
            Agregar
          </span>
        </button>
      </div>
    </div>
  )
}
