"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/supabase"
import { ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

export function StickyAddToCart({ product }: { product: Product }) {
    const { addItem } = useCart()

    // Always visible on mobile, hidden on desktop
    if (product.stock <= 0) return null

    return (
        <div
            className={cn(
                "fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 z-40 w-full md:hidden",
                "bg-background/95 backdrop-blur-md border-t border-border p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
            )}
        >
            <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm truncate text-primary">{product.name}</p>
                    <p className="font-sans text-lg font-medium text-secondary">
                        ${product.price.toLocaleString("es-AR")}
                    </p>
                </div>
                <Button
                    onClick={() => addItem(product)}
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Agregar
                </Button>
            </div>
        </div>
    )
}
