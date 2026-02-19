"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import type { Product, Category } from "@/lib/supabase"
import { ProductCard } from "@/components/product-card"
import { FilterSidebar } from "@/components/shop/filter-sidebar"
import { SlidersHorizontal, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ShopContent({
  products,
  categories,
}: {
  products: Product[]
  categories: Category[]
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // URL Params
  const initialCategory = searchParams.get("category")
  const initialSearch = searchParams.get("q") || ""
  const initialSort = searchParams.get("sort") || "newest"

  // State
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all")
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([])
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>(initialSort)

  // Calculate Max Price dynamically
  const maxPrice = useMemo(() => {
    return Math.max(...products.map((p) => p.price), 500000)
  }, [products])

  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice])

  // Debounced Search URL Update
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      const currentQ = params.get("q") || ""

      // Only update if changed prevents unnecessary replaces
      if (searchQuery !== currentQ) {
        if (searchQuery) {
          params.set("q", searchQuery)
        } else {
          params.delete("q")
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      }
    }, 500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, router, pathname]) // Removed searchParams to prevent loop

  // Update URL for other filters
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    let hasChanges = false

    const currentCategory = params.get("category") || "all"
    if (selectedCategory !== currentCategory) {
      if (selectedCategory !== "all") params.set("category", selectedCategory)
      else params.delete("category")
      hasChanges = true
    }

    const currentSort = params.get("sort") || "newest"
    if (sortBy !== currentSort) {
      if (sortBy !== "newest") params.set("sort", sortBy)
      else params.delete("sort")
      hasChanges = true
    }

    if (hasChanges) {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, sortBy, pathname, router]) // Removed searchParams to prevent loop

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchName = p.name.toLowerCase().includes(query)
        const matchDesc = p.description?.toLowerCase().includes(query)
        const matchNotes =
          p.top_notes?.toLowerCase().includes(query) ||
          p.heart_notes?.toLowerCase().includes(query) ||
          p.base_notes?.toLowerCase().includes(query)

        if (!matchName && !matchDesc && !matchNotes) return false
      }

      // 2. Category
      if (selectedCategory !== "all" && p.category !== Number(selectedCategory)) {
        return false
      }

      // 3. Price
      if (p.price < priceRange[0] || p.price > priceRange[1]) {
        return false
      }

      // 4. Season
      if (selectedSeasons.length > 0) {
        const pSeason = p.season?.toLowerCase()
        if (!pSeason || !selectedSeasons.some(s => pSeason.includes(s.toLowerCase()))) {
          return false
        }
      }

      // 5. Time of Day
      if (selectedTimes.length > 0) {
        const pTime = p.time_of_day?.toLowerCase()
        if (!pTime || !selectedTimes.some(t => pTime.includes(t.toLowerCase()))) {
          return false
        }
      }

      return true
    }).sort((a, b) => {
      // Sorting
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        default: // newest (assuming higher ID is newer for now, or random if no date)
          return b.id - a.id
      }
    })
  }, [products, searchQuery, selectedCategory, priceRange, selectedSeasons, selectedTimes, sortBy])

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0) +
    selectedSeasons.length +
    selectedTimes.length

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Mobile Filter Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden w-full flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-serif text-2xl text-primary">Filtros</SheetTitle>
          </SheetHeader>
          <div className="mt-8">
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedSeasons={selectedSeasons}
              setSelectedSeasons={setSelectedSeasons}
              selectedTimes={selectedTimes}
              setSelectedTimes={setSelectedTimes}
              maxPrice={maxPrice}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 lg:block">
        <div className="sticky top-24">
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedSeasons={selectedSeasons}
            setSelectedSeasons={setSelectedSeasons}
            selectedTimes={selectedTimes}
            setSelectedTimes={setSelectedTimes}
            maxPrice={maxPrice}
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar perfumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {filteredProducts.length} resultados
            </span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Más recientes</SelectItem>
                <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
                <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Bar (Desktop) */}
        {activeFiltersCount > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {selectedCategory !== "all" && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className="h-7 text-xs"
              >
                Categoría: {categories.find(c => String(c.id) === selectedCategory)?.name}
                <X className="ml-1 h-3 w-3" />
              </Button>
            )}
            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPriceRange([0, maxPrice])}
                className="h-7 text-xs"
              >
                Precio: ${priceRange[0]} - ${priceRange[1]}
                <X className="ml-1 h-3 w-3" />
              </Button>
            )}
            {selectedSeasons.map(s => (
              <Button
                key={s}
                variant="secondary"
                size="sm"
                onClick={() => setSelectedSeasons(selectedSeasons.filter(item => item !== s))}
                className="h-7 text-xs"
              >
                {s}
                <X className="ml-1 h-3 w-3" />
              </Button>
            ))}
            {selectedTimes.map(t => (
              <Button
                key={t}
                variant="secondary"
                size="sm"
                onClick={() => setSelectedTimes(selectedTimes.filter(item => item !== t))}
                className="h-7 text-xs"
              >
                {t}
                <X className="ml-1 h-3 w-3" />
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCategory("all")
                setPriceRange([0, maxPrice])
                setSelectedSeasons([])
                setSelectedTimes([])
                setSearchQuery("")
              }}
              className="h-7 text-xs text-muted-foreground hover:text-destructive"
            >
              Limpiar todo
            </Button>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 8} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/10">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-serif text-xl font-medium text-primary">No se encontraron resultados</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              Intentá ajustar tus filtros o buscar con otros términos.
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSelectedCategory("all")
                setPriceRange([0, maxPrice])
                setSelectedSeasons([])
                setSelectedTimes([])
                setSearchQuery("")
              }}
              className="mt-4 text-secondary"
            >
              Limpiar todos los filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
