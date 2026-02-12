"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import type { Category } from "@/lib/supabase"
import { X } from "lucide-react"

interface FilterSidebarProps {
    categories: Category[]
    selectedCategory: string
    setSelectedCategory: (v: string) => void
    priceRange: [number, number]
    setPriceRange: (v: [number, number]) => void
    selectedSeasons: string[]
    setSelectedSeasons: (v: string[]) => void
    selectedTimes: string[]
    setSelectedTimes: (v: string[]) => void
    maxPrice: number
    className?: string
}

const seasons = ["Primavera", "Verano", "Otoño", "Invierno", "Todo el año"]
const timesOfDay = ["Día", "Noche", "Versátil"]

export function FilterSidebar({
    categories,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    selectedSeasons,
    setSelectedSeasons,
    selectedTimes,
    setSelectedTimes,
    maxPrice,
    className,
}: FilterSidebarProps) {
    const [localPrice, setLocalPrice] = useState(priceRange)

    // Sync local price with prop when prop changes (reset)
    useEffect(() => {
        setLocalPrice(priceRange)
    }, [priceRange])

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

    const hasActiveFilters =
        selectedCategory !== "all" ||
        selectedSeasons.length > 0 ||
        selectedTimes.length > 0 ||
        priceRange[0] > 0 ||
        priceRange[1] < maxPrice

    const clearFilters = () => {
        setSelectedCategory("all")
        setPriceRange([0, maxPrice])
        setSelectedSeasons([])
        setSelectedTimes([])
    }

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-primary">Filtros</h3>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-destructive"
                    >
                        Limpiar todo
                    </Button>
                )}
            </div>

            <Accordion type="multiple" defaultValue={["category", "price", "season"]} className="w-full">
                {/* Categories */}
                <AccordionItem value="category">
                    <AccordionTrigger className="text-sm uppercase tracking-widest text-primary hover:no-underline">
                        Categoría
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 pt-2">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="cat-all"
                                    checked={selectedCategory === "all"}
                                    onCheckedChange={() => setSelectedCategory("all")}
                                />
                                <label
                                    htmlFor="cat-all"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    Todas
                                </label>
                            </div>
                            {categories.map((cat) => (
                                <div key={cat.id} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`cat-${cat.id}`}
                                        checked={selectedCategory === String(cat.id)}
                                        onCheckedChange={() => setSelectedCategory(String(cat.id))}
                                    />
                                    <label
                                        htmlFor={`cat-${cat.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {cat.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Price */}
                <AccordionItem value="price">
                    <AccordionTrigger className="text-sm uppercase tracking-widest text-primary hover:no-underline">
                        Precio
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 pt-4">
                            <Slider
                                value={localPrice}
                                min={0}
                                max={maxPrice}
                                step={1000}
                                minStepsBetweenThumbs={1}
                                onValueChange={(val) => setLocalPrice(val as [number, number])}
                                onValueCommit={(val) => setPriceRange(val as [number, number])}
                                className="py-4"
                            />
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>${localPrice[0].toLocaleString("es-AR")}</span>
                                <span>${localPrice[1].toLocaleString("es-AR")}</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Season */}
                <AccordionItem value="season">
                    <AccordionTrigger className="text-sm uppercase tracking-widest text-primary hover:no-underline">
                        Estación
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 pt-2">
                            {seasons.map((season) => (
                                <div key={season} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`season-${season}`}
                                        checked={selectedSeasons.includes(season)}
                                        onCheckedChange={() => toggleSeason(season)}
                                    />
                                    <label
                                        htmlFor={`season-${season}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {season}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Time of Day */}
                <AccordionItem value="time">
                    <AccordionTrigger className="text-sm uppercase tracking-widest text-primary hover:no-underline">
                        Momento
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 pt-2">
                            {timesOfDay.map((time) => (
                                <div key={time} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`time-${time}`}
                                        checked={selectedTimes.includes(time)}
                                        onCheckedChange={() => toggleTime(time)}
                                    />
                                    <label
                                        htmlFor={`time-${time}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {time}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
