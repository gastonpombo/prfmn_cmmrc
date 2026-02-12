import { Droplet } from "lucide-react"

interface PerfumeProfileProps {
  topNotes: string | null | undefined
  heartNotes: string | null | undefined
  baseNotes: string | null | undefined
}

export function PerfumeProfile({ topNotes, heartNotes, baseNotes }: PerfumeProfileProps) {
  const notes = [
    { label: "Notas de Salida", value: topNotes, position: "top" },
    { label: "Notas de Corazón", value: heartNotes, position: "middle" },
    { label: "Notas de Fondo", value: baseNotes, position: "base" },
  ]

  return (
    <div className="border-t border-border pt-12">
      <div className="mb-8 text-center">
        <h2 className="mb-2 font-serif text-3xl font-light tracking-tight text-secondary">
          Perfil Olfativo
        </h2>
        <p className="font-sans text-sm text-muted-foreground">
          La pirámide olfativa de esta fragancia
        </p>
      </div>

      {/* Pyramid Visual */}
      <div className="mx-auto max-w-3xl">
        <div className="relative">
          {/* Visual Pyramid Lines */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <svg
              className="h-full w-full"
              viewBox="0 0 400 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M200 20 L360 280 L40 280 Z"
                stroke="currentColor"
                strokeWidth="1"
                className="text-secondary"
              />
              <line x1="100" y1="180" x2="300" y2="180" stroke="currentColor" strokeWidth="1" />
              <line x1="140" y1="100" x2="260" y2="100" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          {/* Notes Content */}
          <div className="relative space-y-8">
            {notes.map((note, index) => (
              <div
                key={note.label}
                className="flex flex-col items-center gap-4 md:flex-row md:items-start"
                style={{
                  opacity: note.value ? 1 : 0.3,
                }}
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-secondary/30 bg-card">
                  <Droplet className="h-6 w-6 text-secondary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-secondary">
                    {note.label}
                  </h3>
                  <p className="font-sans text-base leading-relaxed text-muted-foreground">
                    {note.value || "No especificadas"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
