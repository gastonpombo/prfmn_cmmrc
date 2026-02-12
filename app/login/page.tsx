"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSupabase } from "@/context/supabase-context"
import { Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = useSupabase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        
        if (error) {
          if (error.message.includes("already registered") || error.message.includes("User already exists")) {
            setError("Este email ya está registrado. Por favor inicia sesión.")
            setIsSignUp(false)
          } else {
            throw error
          }
        } else if (data?.user?.identities?.length === 0) {
          // Usuario ya existe
          setError("Este email ya está registrado. Por favor inicia sesión.")
          setIsSignUp(false)
        } else {
          // Signup exitoso. Si user.confirmed_at existe, el email fue auto-confirmado
          if (data?.user?.confirmed_at || data?.session) {
            router.push("/profile")
          } else {
            setError("Revisa tu email para confirmar tu cuenta. Si no ves el email, revisa spam.")
          }
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push("/profile")
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Ocurrió un error. Por favor intenta nuevamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-serif text-4xl text-primary">
            {isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
          </h1>
          <p className="font-sans text-sm text-muted-foreground">
            {isSignUp
              ? "Crea tu cuenta para continuar"
              : "Ingresa a tu cuenta"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 flex items-center gap-2 font-sans text-sm font-medium text-primary"
            >
              <Mail className="h-4 w-4" />
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-border bg-card px-4 py-3 font-sans text-sm text-primary placeholder:text-muted-foreground focus:border-secondary focus:outline-none"
              placeholder="tu@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 flex items-center gap-2 font-sans text-sm font-medium text-primary"
            >
              <Lock className="h-4 w-4" />
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-border bg-card px-4 py-3 font-sans text-sm text-primary placeholder:text-muted-foreground focus:border-secondary focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className={`rounded border px-4 py-3 text-sm ${
              error.includes("email para confirmar") || error.includes("correo de verificación")
                ? "border-highlight/20 bg-highlight/10 text-highlight"
                : "border-destructive/20 bg-destructive/10 text-destructive"
            }`}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="border border-secondary bg-secondary px-8 py-3 font-sans text-[11px] font-bold uppercase tracking-[0.15em] text-secondary-foreground transition-all duration-300 hover:bg-secondary/90 disabled:opacity-50"
          >
            {loading ? "Cargando..." : isSignUp ? "Registrarse" : "Ingresar"}
          </button>

          {/* Toggle Sign Up/Login */}
          <p className="text-center font-sans text-sm text-muted-foreground">
            {isSignUp ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError("")
              }}
              className="text-secondary underline"
            >
              {isSignUp ? "Iniciar Sesión" : "Registrarse"}
            </button>
          </p>

          {/* Back to Home */}
          <Link
            href="/"
            className="text-center font-sans text-sm text-muted-foreground transition-colors hover:text-secondary"
          >
            Volver al inicio
          </Link>
        </form>
      </div>
    </div>
  )
}
