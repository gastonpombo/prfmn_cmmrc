"use client"

import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback } from "react"
import type { Product } from "@/lib/supabase"
import { ProductCard } from "@/components/product-card"

export function FeaturedCarousel({ products }: { products: Product[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-0 flex-shrink-0 basis-[70%] sm:basis-[45%] md:basis-[30%] lg:basis-[23%]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={scrollPrev}
        className="absolute -left-3 top-1/3 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-primary shadow transition-colors hover:border-secondary hover:text-secondary"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        className="absolute -right-3 top-1/3 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-primary shadow transition-colors hover:border-secondary hover:text-secondary"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
