"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useCart } from "@/context/cart-context"
import {
    Home,
    Store,
    User,
    Info,
    ShoppingCart,
    MessageCircle,
    Search,
    CreditCard,
    Mail
} from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
    const pathname = usePathname()
    const router = useRouter()
    const { openCart, totalItems } = useCart()

    // Helper to determine active state
    const isActive = (path: string) => pathname === path

    // Configuration based on current route
    const getNavConfig = () => {
        // 1. Home ("/")
        if (pathname === "/") {
            return {
                center: {
                    icon: Store,
                    label: "Catálogo",
                    action: () => router.push("/shop"),
                    bg: "bg-secondary text-secondary-foreground"
                },
                sides: [
                    { icon: User, label: "Perfil", href: "/profile" },
                    { icon: Info, label: "Info", href: "/about" },
                    // Right side
                    { icon: ShoppingCart, label: "Carrito", action: openCart, badge: totalItems },
                    { icon: MessageCircle, label: "Contacto", href: "/contact" },
                ]
            }
        }

        // 2. Catalog ("/shop")
        if (pathname.startsWith("/shop")) {
            return {
                center: {
                    icon: ShoppingCart,
                    label: "Carrito",
                    action: openCart,
                    bg: "bg-primary text-primary-foreground",
                    badge: totalItems // Show badge on center button if it's cart
                },
                sides: [
                    { icon: Home, label: "Inicio", href: "/" },
                    { icon: User, label: "Perfil", href: "/profile" },
                    // Right side
                    { icon: Search, label: "Buscar", action: () => document.getElementById("mobile-search-trigger")?.click() }, // Hacky but effective if we add ID to navbar search
                    { icon: MessageCircle, label: "Contacto", href: "/contact" },
                ]
            }
        }

        // 3. Cart/Checkout ("/cart" or "/checkout")
        if (pathname === "/cart" || pathname === "/checkout") {
            return {
                center: {
                    icon: CreditCard,
                    label: "Pagar",
                    action: () => router.push("/checkout"),
                    bg: "bg-emerald-600 text-white"
                },
                sides: [
                    { icon: Home, label: "Inicio", href: "/" },
                    { icon: Store, label: "Catálogo", href: "/shop" },
                    // Right side
                    { icon: User, label: "Perfil", href: "/profile" },
                    { icon: MessageCircle, label: "Contacto", href: "/contact" },
                ]
            }
        }

        // 4. Contact ("/contact")
        if (pathname === "/contact") {
            return {
                center: {
                    icon: Mail,
                    label: "Enviar",
                    action: () => window.location.href = "mailto:info@perfuman.com.ar", // Or scroll to form
                    bg: "bg-secondary text-secondary-foreground"
                },
                sides: [
                    { icon: Home, label: "Inicio", href: "/" },
                    { icon: Store, label: "Catálogo", href: "/shop" },
                    // Right side
                    { icon: ShoppingCart, label: "Carrito", action: openCart, badge: totalItems },
                    { icon: User, label: "Perfil", href: "/profile" },
                ]
            }
        }

        // Default fallback (Generic pages)
        return {
            center: {
                icon: Store,
                label: "Catálogo",
                action: () => router.push("/shop"),
                bg: "bg-primary text-primary-foreground"
            },
            sides: [
                { icon: Home, label: "Inicio", href: "/" },
                { icon: Search, label: "Buscar", href: "/shop" },
                // Right side
                { icon: ShoppingCart, label: "Carrito", action: openCart, badge: totalItems },
                { icon: User, label: "Perfil", href: "/profile" },
            ]
        }
    }

    const config = getNavConfig()
    const [left1, left2, right1, right2] = config.sides

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full border-t border-white/10 bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
            <div className="grid h-16 grid-cols-5 items-center px-2">

                {/* Left 1 */}
                <NavItem item={left1} isActive={isActive(left1.href || "")} />

                {/* Left 2 */}
                <NavItem item={left2} isActive={isActive(left2.href || "")} />

                {/* CENTER FAB */}
                <div className="relative -mt-8 flex justify-center">
                    <button
                        onClick={config.center.action}
                        className={cn(
                            "flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95",
                            config.center.bg
                        )}
                        aria-label={config.center.label}
                    >
                        <config.center.icon className="h-6 w-6" strokeWidth={1.5} />
                        {config.center.badge && config.center.badge > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                                {config.center.badge}
                            </span>
                        )}
                    </button>
                </div>

                {/* Right 1 */}
                <NavItem item={right1} isActive={isActive(right1.href || "")} />

                {/* Right 2 */}
                <NavItem item={right2} isActive={isActive(right2.href || "")} />

            </div>
        </div>
    )
}

// Subcomponent for side items
function NavItem({ item, isActive }: { item: any, isActive: boolean }) {
    const Icon = item.icon

    if (item.action) {
        return (
            <button
                onClick={item.action}
                className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors active:text-primary active:scale-95"
            >
                <div className="relative">
                    <Icon className={cn("h-5 w-5", isActive && "text-primary")} strokeWidth={1.5} />
                    {item.badge && item.badge > 0 && (
                        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-secondary-foreground">
                            {item.badge}
                        </span>
                    )}
                </div>
                <span className={cn("text-[9px] font-medium", isActive ? "text-primary" : "text-muted-foreground/80")}>
                    {item.label}
                </span>
            </button>
        )
    }

    return (
        <Link
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors active:text-primary active:scale-95"
        >
            <Icon className={cn("h-5 w-5", isActive && "text-primary")} strokeWidth={1.5} />
            <span className={cn("text-[9px] font-medium", isActive ? "text-primary" : "text-muted-foreground/80")}>
                {item.label}
            </span>
        </Link>
    )
}
