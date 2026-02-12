"use client"

import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/supabase"

interface RelatedProductsProps {
  products: Product[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null

  return (
    <div className="border-t border-border pt-12">
      <div className="mb-8">
        <h2 className="font-serif text-2xl font-light tracking-tight text-secondary">
          Completa tu Colección
        </h2>
        <p className="mt-2 font-sans text-sm text-muted-foreground">
          Productos similares que podrían interesarte
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
