"use client"

import { ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/lib/supabase"

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart()

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      disabled={product.stock <= 0}
      className="flex w-full items-center justify-center gap-3 border border-secondary bg-secondary py-4 font-sans text-sm font-bold uppercase tracking-[0.15em] text-secondary-foreground transition-all duration-300 hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto md:px-12"
    >
      <ShoppingBag className="h-5 w-5" />
      Agregar al Carrito
    </button>
  )
}
