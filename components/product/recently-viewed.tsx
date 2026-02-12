"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/supabase"

export function RecentlyViewed({ currentProduct }: { currentProduct: Product }) {
    const [recentProducts, setRecentProducts] = useState<Product[]>([])

    useEffect(() => {
        // Get existing
        const stored = localStorage.getItem("recentlyViewed")
        let products: Product[] = stored ? JSON.parse(stored) : []

        // Remove current if exists (to move to top)
        products = products.filter((p) => p.id !== currentProduct.id)

        // Add current to top
        products.unshift(currentProduct)

        // Keep max 5
        if (products.length > 5) {
            products = products.slice(0, 5)
        }

        // Save
        localStorage.setItem("recentlyViewed", JSON.stringify(products))

        // Set state (excluding current for display)
        setRecentProducts(products.filter((p) => p.id !== currentProduct.id))
    }, [currentProduct])

    if (recentProducts.length === 0) return null

    return (
        <div className="border-t border-border pt-16">
            <h2 className="mb-8 font-serif text-2xl font-light tracking-tight text-secondary">
                Visto Recientemente
            </h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                {recentProducts.slice(0, 4).map((product, index) => (
                    <ProductCard key={product.id} product={product} /> // Removed priority as these are below fold
                ))}
            </div>
        </div>
    )
}
