"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/context/supabase-context"
import type { Order } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { Mail, Package, Calendar, CreditCard } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = useSupabase()

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("[v0] Verificando sesión...")
        const { data: { session } } = await supabase.auth.getSession()
        console.log("[v0] Sesión obtenida:", { user: session?.user?.email })

        if (!session) {
          console.log("[v0] No hay sesión, redirigiendo a login")
          router.push("/login")
          return
        }

        setUser(session.user)

        // Fetch user orders
        console.log("[v0] Buscando órdenes para:", session.user.email)
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("customer_email", session.user.email)
          .order("created_at", { ascending: false })

        if (ordersError) {
          console.error("[v0] Error al buscar órdenes:", ordersError)
        } else {
          console.log("[v0] Órdenes encontradas:", ordersData?.length)
          setOrders(ordersData || [])
        }

        setLoading(false)
      } catch (err) {
        console.error("[v0] Error en profile:", err)
        setError("Error al cargar el perfil")
        setLoading(false)
      }
    }

    checkUser()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
        <p className="font-sans text-sm text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4">
        <div className="max-w-md rounded border border-destructive/20 bg-destructive/10 p-6 text-center">
          <p className="mb-4 font-sans text-sm text-destructive">{error}</p>
          <a href="/" className="text-secondary underline">
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <p className="mb-2 font-sans text-xs uppercase tracking-[0.3em] text-secondary">
          Mi Cuenta
        </p>
        <h1 className="text-balance font-serif text-4xl text-primary md:text-5xl">
          Perfil
        </h1>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* User Info */}
        <div className="lg:col-span-1">
          <div className="border border-border bg-card p-6">
            <h2 className="mb-6 font-serif text-xl text-primary">
              Información Personal
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary" />
                <div>
                  <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
                    Email
                  </p>
                  <p className="font-sans text-sm text-primary">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2">
          <h2 className="mb-6 font-serif text-2xl text-primary">
            Historial de Compras
          </h2>
          {orders.length > 0 ? (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-border bg-card p-6"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <p className="mb-1 font-sans text-xs uppercase tracking-wider text-muted-foreground">
                        Pedido #{order.id}
                      </p>
                      <p className="font-serif text-2xl text-secondary">
                        ${order.total_amount.toLocaleString("es-AR")}
                      </p>
                    </div>
                    <span
                      className={`border px-3 py-1 font-sans text-xs uppercase tracking-wider ${order.status === "completado"
                        ? "border-secondary/30 bg-secondary/10 text-secondary"
                        : order.status === "pendiente"
                          ? "border-highlight/30 bg-highlight/10 text-highlight"
                          : "border-muted bg-muted/10 text-muted-foreground"
                        }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-sans text-sm text-muted-foreground">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString("es-AR") : '-'}
                      </span>
                    </div>
                    {order.payment_id && (
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="font-sans text-sm text-muted-foreground">
                          ID: {order.payment_id}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center border border-border bg-card py-16 text-center">
              <Package className="mb-4 h-12 w-12 text-muted-foreground/40" />
              <p className="mb-2 font-sans text-sm text-muted-foreground">
                Aún no tienes compras
              </p>
              <a
                href="/shop"
                className="font-sans text-sm text-secondary underline"
              >
                Explorar productos
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
