"use client"

import { useEffect } from "react"

export default function Template({ children }: { children: React.ReactNode }) {
    // Reset scroll on navigation (standard NEXT behavior, but good to ensure with transitions)
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="animate-fade-in-up duration-700 ease-out">
            {children}
        </div>
    )
}
