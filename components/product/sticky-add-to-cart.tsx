"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/supabase"
import { ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

export function StickyAddToCart({ product }: { product: Product }) {
    const { addItem } = useCart()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            // Show when scrolled past 600px (roughly past the main hero section)
            const shouldShow = window.scrollY > 600
            setIsVisible(shouldShow)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    if (!isVisible || product.stock <= 0) return null

    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 z-50 w-full animate-in slide-in-from-bottom-full duration-300 md:hidden",
                "bg-background/80 backdrop-blur-md border-t border-border p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
            )}
        >
            <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm truncate text-primary">{product.name}</p>
                    <p className="font-sans text-xs text-secondary">
                        ${product.price.toLocaleString("es-AR")}
                    </p>
                </div>
                <Button
                    onClick={() => addItem(product)}
                    className="rounded-none bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Agregar
                </Button>
            </div>
        </div>
    )
}
