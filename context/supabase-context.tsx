"use client"

import { createBrowserClient } from "@/lib/supabase"
import { createContext, useContext, ReactNode, useMemo } from "react"
import type { SupabaseClient } from "@supabase/supabase-js"

const SupabaseContext = createContext<SupabaseClient | null>(null)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createBrowserClient(), [])

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error("useSupabase debe usarse dentro de SupabaseProvider")
  }
  return context
}
