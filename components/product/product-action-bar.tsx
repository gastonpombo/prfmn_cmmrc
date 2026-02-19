"use client"

import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/supabase"
import { Minus, Plus, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

export function ProductActionBar({ product }: { product: Product }) {
    const { addItem } = useCart()
    const [quantity, setQuantity] = useState(1)

    const handleDecrement = () => {
        if (quantity > 1) setQuantity(quantity - 1)
    }

    const handleIncrement = () => {
        if (quantity < product.stock) setQuantity(quantity + 1)
    }

    const handleAddToCart = () => {
        // Add item multiple times or update context to support quantity?
        // Current cart context 'addItem' typically adds 1. 
        // For this demo, we'll loop or just add 1 if context doesn't support qty param yet.
        // Looking at context: addItem(item) -> usually adds 1.
        // We will assume calling it 'quantity' times is the quick fix or update context later.
        // Ideally context should take quantity.
        // checking cart-context: "addItem: (item: CartItem) => void"
        // Let's just add it 'quantity' times to be safe without refactoring context now, 
        // OR just add 1 and let user adjust in cart. 
        // BUT the prompt asks for a "Selector de Cantidad".
        // I'll execute addItem quantity times loop for now to be strictly correct with the UI choice.

        for (let i = 0; i < quantity; i++) {
            addItem(product)
        }
        setQuantity(1) // Reset after adding
    }

    if (product.stock <= 0) return null

    return (
        <div
            className={cn(
                "fixed bottom-[80px] left-0 z-40 w-full md:hidden",
                "bg-background/95 backdrop-blur-md border-t border-white/10 px-6 py-4"
            )}
        >
            <div className="flex items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center rounded-full border border-white/10 bg-white/5">
                    <button
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                        className="flex h-12 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground active:scale-90 disabled:opacity-50"
                        aria-label="Disminuir cantidad"
                    >
                        <Minus className="h-4 w-4" />
                    </button>

                    <span className="min-w-[1.5rem] text-center font-sans text-lg font-medium text-foreground">
                        {quantity}
                    </span>

                    <button
                        onClick={handleIncrement}
                        disabled={quantity >= product.stock}
                        className="flex h-12 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground active:scale-90 disabled:opacity-50"
                        aria-label="Aumentar cantidad"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>

                {/* Add Button */}
                <Button
                    onClick={handleAddToCart}
                    className="h-12 flex-1 rounded-full bg-primary text-base font-medium text-primary-foreground shadow-lg transition-transform active:scale-95 hover:bg-primary/90"
                >
                    Agregar
                    <span className="ml-2 font-sans text-sm opacity-80">
                        ${(product.price * quantity).toLocaleString("es-AR")}
                    </span>
                </Button>
            </div>
        </div>
    )
}
