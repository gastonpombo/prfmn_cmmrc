"use client"

import { Droplet, Leaf, Wind } from "lucide-react"

interface OlfactoryPyramidProps {
  topNotes?: string | null
  heartNotes?: string | null
  baseNotes?: string | null
}

export function OlfactoryPyramid({
  topNotes,
  heartNotes,
  baseNotes,
}: OlfactoryPyramidProps) {
  const parseNotes = (notes: string | undefined | null) => {
    if (!notes) return []
    return notes
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean)
  }

  const topNotesArray = parseNotes(topNotes)
  const heartNotesArray = parseNotes(heartNotes)
  const baseNotesArray = parseNotes(baseNotes)

  return (
    <div className="space-y-8">
      {/* Pyramid Visualization */}
      <div className="mx-auto max-w-xs space-y-4">
        {/* Top Notes */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Droplet className="h-5 w-5 text-secondary" />
            <h4 className="font-serif text-sm uppercase tracking-widest text-secondary">
              Notas de Salida
            </h4>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {topNotesArray.length > 0 ? (
              topNotesArray.map((note, idx) => (
                <span
                  key={idx}
                  className="rounded border border-secondary/30 bg-secondary/5 px-3 py-1 font-sans text-xs text-foreground"
                >
                  {note}
                </span>
              ))
            ) : (
              <span className="font-sans text-xs text-muted-foreground italic">
                Sin especificar
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="flex justify-center">
          <div className="h-6 w-px bg-border" />
        </div>

        {/* Heart Notes */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Leaf className="h-5 w-5 text-secondary" />
            <h4 className="font-serif text-sm uppercase tracking-widest text-secondary">
              Notas de Corazón
            </h4>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {heartNotesArray.length > 0 ? (
              heartNotesArray.map((note, idx) => (
                <span
                  key={idx}
                  className="rounded border border-secondary bg-secondary/10 px-4 py-1.5 font-sans text-xs font-medium text-foreground"
                >
                  {note}
                </span>
              ))
            ) : (
              <span className="font-sans text-xs text-muted-foreground italic">
                Sin especificar
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="flex justify-center">
          <div className="h-6 w-px bg-border" />
        </div>

        {/* Base Notes */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Wind className="h-5 w-5 text-secondary" />
            <h4 className="font-serif text-sm uppercase tracking-widest text-secondary">
              Notas de Fondo
            </h4>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {baseNotesArray.length > 0 ? (
              baseNotesArray.map((note, idx) => (
                <span
                  key={idx}
                  className="rounded border border-secondary/50 bg-transparent px-4 py-1.5 font-sans text-xs text-foreground"
                >
                  {note}
                </span>
              ))
            ) : (
              <span className="font-sans text-xs text-muted-foreground italic">
                Sin especificar
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
