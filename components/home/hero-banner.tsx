"use client"

import Link from "next/link"
import Image from "next/image"

export function HeroBanner({
    heroImageUrl, // Keep for backward compatibility or as fallback
    mobileImage,
    desktopImage,
    overlayOpacity = 60
}: {
    heroImageUrl?: string | null
    mobileImage?: string | null
    desktopImage?: string | null
    overlayOpacity?: number
}) {
    // Fallback logic
    const imgMobile = mobileImage || heroImageUrl
    const imgDesktop = desktopImage || heroImageUrl

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black">
            {/* Background Images - Mobile/Desktop split */}
            <div className="absolute inset-0">
                {/* Mobile Image */}
                {imgMobile && (
                    <div className="block md:hidden h-full w-full relative">
                        <Image
                            src={imgMobile}
                            alt="Perfume elegante"
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>
                )}
                {/* Desktop Image */}
                {imgDesktop && (
                    <div className="hidden md:block h-full w-full relative">
                        <Image
                            src={imgDesktop}
                            alt="Perfume elegante"
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>
                )}

                {/* Dynamic Overlay */}
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: `rgba(0,0,0, ${overlayOpacity / 100})` }}
                />
            </div>

            {/* Content */}
            <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
                <h1 className="mb-6 font-serif text-5xl font-medium tracking-tight text-white opacity-0 animate-fade-in-up md:text-7xl lg:text-8xl">
                    DESCUBRE <br />
                    <span className="italic text-[#C8A55A]">TU ESENCIA</span>
                </h1>

                <p className="mb-8 max-w-lg font-sans text-sm font-light tracking-widest text-gray-300 opacity-0 animate-fade-in-up"
                    style={{ animationDelay: "150ms" }}>
                    LUJO MINIMALISTA. AROMAS INOLVIDABLES.
                </p>

                <Link
                    href="/shop"
                    className="group relative inline-flex h-12 w-48 items-center justify-center overflow-hidden border border-[#C8A55A] bg-transparent px-6 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#C8A55A] transition-all duration-300 hover:bg-[#C8A55A] hover:text-black opacity-0 animate-fade-in-up"
                    style={{ animationDelay: "300ms" }}
                >
                    <span className="relative z-10">Ver Colección</span>
                </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-[#C8A55A] to-transparent" />
            </div>
        </div>
    )
}
