"use client"

import React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, User, ShoppingBag, Menu, X, LogOut } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useSupabase } from "@/context/supabase-context"
import { useState, useEffect } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/shop", label: "Cat\u00E1logo" },
  { href: "/about", label: "Sobre M\u00ED" },
  { href: "/contact", label: "Contacto" },
]

export function Navbar() {
  const { openCart, totalItems } = useCart()
  const supabase = useSupabase()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setSearchOpen(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserMenuOpen(false)
    router.push("/")
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-500 ${scrolled
        ? "border-white/10 bg-background/90 backdrop-blur-md shadow-sm"
        : "border-transparent bg-transparent"
        }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        {/* Logo */}
        <Link href="/" className="font-serif text-xl tracking-[0.1em] text-primary transition-colors duration-300 hover:text-secondary">
          PerfuMan
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[11px] font-medium uppercase tracking-[0.15em] text-primary/60 transition-all duration-300 hover:text-secondary"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-6">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-32 border-b border-border/60 bg-transparent px-2 py-1 text-sm text-primary placeholder:text-primary/30 focus:border-secondary focus:outline-none sm:w-48"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-primary/60 transition-all duration-300 hover:text-secondary"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="text-primary/60 transition-all duration-300 hover:text-secondary"
              aria-label="Buscar"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
          )}

          {/* User Menu */}
          {user ? (
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="text-primary/60 transition-all duration-300 hover:text-secondary"
                aria-label="Mi cuenta"
              >
                <User className="h-[18px] w-[18px]" />
              </button>
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-20 mt-2 w-48 border border-border bg-card py-2 shadow-lg">
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-primary transition-colors hover:bg-accent"
                    >
                      Mi Perfil
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-primary transition-colors hover:bg-accent"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden text-primary/60 transition-all duration-300 hover:text-secondary sm:block"
              aria-label="Iniciar sesión"
            >
              <User className="h-[18px] w-[18px]" />
            </Link>
          )}

          {/* Cart */}
          <button
            type="button"
            onClick={openCart}
            className="relative text-primary/60 transition-all duration-300 hover:text-secondary"
            aria-label="Carrito"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-[16px] w-[16px] items-center justify-center bg-secondary text-[8px] font-bold text-secondary-foreground">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Button - Removed in favor of Bottom Nav */}
          {/* <button ... /> */}
        </div>
      </nav>

      {/* Mobile Nav - Removed in favor of Bottom Nav */}
      {/* {mobileOpen && ( ... )} */}
    </header>
  )
}
