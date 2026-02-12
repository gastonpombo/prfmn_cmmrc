interface IntensityScaleProps {
  value: string | null | undefined
  label: string
  maxPoints?: number
}

const intensityMap: Record<string, number> = {
  "baja": 2,
  "moderada": 3,
  "media": 3,
  "alta": 4,
  "muy alta": 5,
  "eterna": 5,
  "temporal": 1,
  "suave": 2,
  "fuerte": 4,
  "muy fuerte": 5,
  "ligero": 2,
  "intenso": 4,
}

export function IntensityScale({ value, label, maxPoints = 5 }: IntensityScaleProps) {
  if (!value) return null

  const intensity = intensityMap[value.toLowerCase()] || 3

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <span className="font-sans text-xs text-secondary capitalize">
          {value}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: maxPoints }).map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-colors ${
              i < intensity
                ? "bg-secondary"
                : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
