"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { ZoomIn } from "lucide-react"

interface ProductGalleryProps {
    images: string[]
    name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [isZoomOpen, setIsZoomOpen] = useState(false)

    // Use the first image if array is empty, or placeholder
    const displayImages = images.length > 0 ? images : ["/placeholder.svg"]

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-white group">
                <Image
                    src={displayImages[selectedImage]}
                    alt={name}
                    fill
                    className="object-contain p-8"
                    priority
                />
                <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
                    <DialogTrigger asChild>
                        <button
                            className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-primary shadow-sm backdrop-blur-sm transition-opacity hover:bg-background opacity-0 group-hover:opacity-100"
                            aria-label="Zoom image"
                        >
                            <ZoomIn className="h-5 w-5" />
                        </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
                        <div className="relative aspect-square w-full h-[80vh]">
                            <Image
                                src={displayImages[selectedImage]}
                                alt={name}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {displayImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={cn(
                                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-white",
                                selectedImage === index
                                    ? "border-secondary ring-1 ring-secondary"
                                    : "border-border hover:border-secondary/50"
                            )}
                        >
                            <Image
                                src={image}
                                alt={`${name} thumbnail ${index + 1}`}
                                fill
                                className="object-contain p-2"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
