interface TopBarProps {
  announcement: string | null
}

export function TopBar({ announcement }: TopBarProps) {
  if (!announcement) return null

  return (
    <div className="border-b border-border/30 bg-black">
      <div className="mx-auto max-w-7xl px-4">
        <p className="py-2.5 text-center font-sans text-[10px] font-medium uppercase tracking-[0.15em] text-white/70">
          {announcement}
        </p>
      </div>
    </div>
  )
}
