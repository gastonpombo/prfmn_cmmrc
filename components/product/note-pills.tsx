interface NotePillsProps {
  topNotes?: string | null
  heartNotes?: string | null
  baseNotes?: string | null
}

export function NotePills({ topNotes, heartNotes, baseNotes }: NotePillsProps) {
  const notes = [
    { type: "Salida", value: topNotes },
    { type: "Corazón", value: heartNotes },
    { type: "Fondo", value: baseNotes },
  ]

  return (
    <div className="space-y-4">
      <div className="mb-3 font-sans text-xs uppercase tracking-widest text-muted-foreground">
        Notas Olfativas
      </div>
      {notes.map((note) => {
        if (!note.value) return null

        const notesArray = note.value
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean)

        return (
          <div key={note.type} className="space-y-2">
            <p className="font-sans text-xs font-semibold text-secondary">
              {note.type}
            </p>
            <div className="flex flex-wrap gap-2">
              {notesArray.map((item, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-secondary/40 bg-secondary/5 px-3 py-1.5 font-sans text-xs text-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
