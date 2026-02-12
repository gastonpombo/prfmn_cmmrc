"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import type { Product, Category } from "@/lib/supabase"
import { ProductCard } from "@/components/product-card"
import { SlidersHorizontal, X } from "lucide-react"

type PriceRange = "all" | "0-5000" | "5000-15000" | "15000-30000" | "30000+"

const priceRanges: { value: PriceRange; label: string }[] = [
  { value: "all", label: "Todos los precios" },
  { value: "0-5000", label: "Hasta $5.000" },
  { value: "5000-15000", label: "$5.000 - $15.000" },
  { value: "15000-30000", label: "$15.000 - $30.000" },
  { value: "30000+", label: "M\u00E1s de $30.000" },
]

const seasons = ["Primavera", "Verano", "Otoño", "Invierno", "Todo el año"]
const timesOfDay = ["Día", "Noche", "Versátil"]

function filterByPrice(product: Product, range: PriceRange): boolean {
  switch (range) {
    case "0-5000":
      return product.price <= 5000
    case "5000-15000":
      return product.price > 5000 && product.price <= 15000
    case "15000-30000":
      return product.price > 15000 && product.price <= 30000
    case "30000+":
      return product.price > 30000
    default:
      return true
  }
}

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
  const searchQuery = searchParams.get("q") || ""
  const initialCategory = searchParams.get("category")

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || "all"
  )
  const [priceRange, setPriceRange] = useState<PriceRange>("all")
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([])
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Update URL with filters
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (selectedCategory !== "all") {
      params.set("category", selectedCategory)
    } else {
      params.delete("category")
    }
    
    if (priceRange !== "all") {
      params.set("price", priceRange)
    } else {
      params.delete("price")
    }
    
    if (selectedSeasons.length > 0) {
      params.set("season", selectedSeasons.join(","))
    } else {
      params.delete("season")
    }
    
    if (selectedTimes.length > 0) {
      params.set("time", selectedTimes.join(","))
    } else {
      params.delete("time")
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [selectedCategory, priceRange, selectedSeasons, selectedTimes, pathname, router, searchParams])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        const matchesName = p.name.toLowerCase().includes(searchLower)
        const matchesDesc = p.description?.toLowerCase().includes(searchLower)
        const matchesNotes =
          p.top_notes?.toLowerCase().includes(searchLower) ||
          p.heart_notes?.toLowerCase().includes(searchLower) ||
          p.base_notes?.toLowerCase().includes(searchLower)
        
        if (!matchesName && !matchesDesc && !matchesNotes) return false
      }

      // Category filter
      const catMatch =
        selectedCategory === "all" ||
        p.category === Number(selectedCategory)
      if (!catMatch) return false

      // Price filter
      const priceMatch = filterByPrice(p, priceRange)
      if (!priceMatch) return false

      // Season filter
      if (selectedSeasons.length > 0) {
        const productSeason = p.season?.toLowerCase()
        const matchesSeason = selectedSeasons.some(
          (s) => productSeason?.includes(s.toLowerCase())
        )
        if (!matchesSeason) return false
      }

      // Time of day filter
      if (selectedTimes.length > 0) {
        const productTime = p.time_of_day?.toLowerCase()
        const matchesTime = selectedTimes.some(
          (t) => productTime?.includes(t.toLowerCase())
        )
        if (!matchesTime) return false
      }

      return true
    })
  }, [products, searchQuery, selectedCategory, priceRange, selectedSeasons, selectedTimes])

  const activeFilters =
    selectedCategory !== "all" || 
    priceRange !== "all" || 
    selectedSeasons.length > 0 || 
    selectedTimes.length > 0

  return (
    <div className="flex gap-10">
      {/* Desktop Sidebar */}
      <aside className="hidden w-56 flex-shrink-0 lg:block">
        <FilterPanel
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedSeasons={selectedSeasons}
          setSelectedSeasons={setSelectedSeasons}
          selectedTimes={selectedTimes}
          setSelectedTimes={setSelectedTimes}
        />
      </aside>

      {/* Mobile Filter Toggle */}
      <div className="flex-1">
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 rounded border border-border px-4 py-2 font-sans text-sm text-primary transition-colors hover:border-secondary"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </button>
          <span className="font-sans text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
          </span>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-primary/40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <div className="fixed inset-y-0 left-0 z-50 w-72 bg-background p-6 shadow-2xl lg:hidden">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-serif text-lg text-primary">Filtros</h3>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="text-primary/50 hover:text-primary"
                  aria-label="Cerrar filtros"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterPanel
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={(v) => {
                  setSelectedCategory(v)
                  setSidebarOpen(false)
                }}
                priceRange={priceRange}
                setPriceRange={(v) => {
                  setPriceRange(v)
                  setSidebarOpen(false)
                }}
                selectedSeasons={selectedSeasons}
                setSelectedSeasons={setSelectedSeasons}
                selectedTimes={selectedTimes}
                setSelectedTimes={setSelectedTimes}
              />
            </div>
          </>
        )}

        {/* Active Filters */}
        {activeFilters && (
          <div className="mb-6 hidden items-center gap-2 lg:flex">
            <span className="font-sans text-xs text-muted-foreground">
              Filtros activos:
            </span>
            {selectedCategory !== "all" && (
              <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-sans text-xs text-primary">
                {categories.find((c) => c.id === Number(selectedCategory))?.name}
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  aria-label="Quitar filtro de categor\u00EDa"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {priceRange !== "all" && (
              <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-sans text-xs text-primary">
                {priceRanges.find((r) => r.value === priceRange)?.label}
                <button
                  type="button"
                  onClick={() => setPriceRange("all")}
                  aria-label="Quitar filtro de precio"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Products Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
            {filtered.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 6} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="font-sans text-sm text-muted-foreground">
              No se encontraron productos con los filtros seleccionados.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all")
                setPriceRange("all")
              }}
              className="mt-4 font-sans text-sm text-secondary underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function FilterPanel({
  categories,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  selectedSeasons,
  setSelectedSeasons,
  selectedTimes,
  setSelectedTimes,
}: {
  categories: Category[]
  selectedCategory: string
  setSelectedCategory: (v: string) => void
  priceRange: PriceRange
  setPriceRange: (v: PriceRange) => void
  selectedSeasons: string[]
  setSelectedSeasons: (v: string[]) => void
  selectedTimes: string[]
  setSelectedTimes: (v: string[]) => void
}) {
  const toggleSeason = (season: string) => {
    if (selectedSeasons.includes(season)) {
      setSelectedSeasons(selectedSeasons.filter((s) => s !== season))
    } else {
      setSelectedSeasons([...selectedSeasons, season])
    }
  }

  const toggleTime = (time: string) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== time))
    } else {
      setSelectedTimes([...selectedTimes, time])
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Categories */}
      <div>
        <h4 className="mb-4 font-serif text-sm uppercase tracking-widest text-primary">
          Categor&iacute;a
        </h4>
        <ul className="flex flex-col gap-2">
          <li>
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`font-sans text-sm transition-colors ${
                selectedCategory === "all"
                  ? "font-semibold text-secondary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              Todas
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => setSelectedCategory(String(cat.id))}
                className={`font-sans text-sm transition-colors ${
                  selectedCategory === String(cat.id)
                    ? "font-semibold text-secondary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Season */}
      <div>
        <h4 className="mb-4 font-serif text-sm uppercase tracking-widest text-primary">
          Estación
        </h4>
        <ul className="flex flex-col gap-2">
          {seasons.map((season) => (
            <li key={season}>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedSeasons.includes(season)}
                  onChange={() => toggleSeason(season)}
                  className="h-4 w-4 border-border bg-background accent-secondary"
                />
                <span className="font-sans text-sm text-muted-foreground">
                  {season}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Time of Day */}
      <div>
        <h4 className="mb-4 font-serif text-sm uppercase tracking-widest text-primary">
          Momento
        </h4>
        <ul className="flex flex-col gap-2">
          {timesOfDay.map((time) => (
            <li key={time}>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedTimes.includes(time)}
                  onChange={() => toggleTime(time)}
                  className="h-4 w-4 border-border bg-background accent-secondary"
                />
                <span className="font-sans text-sm text-muted-foreground">
                  {time}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div>
        <h4 className="mb-4 font-serif text-sm uppercase tracking-widest text-primary">
          Precio
        </h4>
        <ul className="flex-col gap-2">
          {priceRanges.map((range) => (
            <li key={range.value}>
              <button
                type="button"
                onClick={() => setPriceRange(range.value)}
                className={`font-sans text-sm transition-colors ${
                  priceRange === range.value
                    ? "font-semibold text-secondary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {range.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
