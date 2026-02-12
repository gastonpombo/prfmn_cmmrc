import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { TopBar } from "@/components/layout/top-bar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { CartSlideOver } from "@/components/layout/cart-slide-over"
import { CartProvider } from "@/context/cart-context"
import { SupabaseProvider } from "@/context/supabase-context"
import { getSiteConfig } from "@/lib/supabase"

import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "PerfuMan | Boutique de Perfumes",
  description:
    "Descubr\u00ED fragancias exclusivas y perfumes artesanales. Env\u00EDo gratis en compras mayores a $2000.",
}

export const viewport: Viewport = {
  themeColor: "#2E3133",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const siteConfig = await getSiteConfig()

  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <SupabaseProvider>
          <CartProvider>
            <TopBar announcement={siteConfig?.announcement_message ?? null} />
            <Navbar />
            <main>{children}</main>
            <Footer
              contactEmail={siteConfig?.contact_email ?? null}
              contactWhatsapp={siteConfig?.contact_whatsapp ?? null}
            />
            <CartSlideOver />
          </CartProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
