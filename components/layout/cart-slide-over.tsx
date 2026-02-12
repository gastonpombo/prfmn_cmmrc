"use client"

import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"
import Image from "next/image"

export function CartSlideOver() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } =
    useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-primary/40 animate-fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-serif text-lg text-primary">Tu Carrito</h2>
          <button
            type="button"
            onClick={closeCart}
            className="text-primary/50 transition-colors hover:text-primary"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <ShoppingBag className="h-12 w-12 text-primary/20" />
              <p className="font-sans text-sm text-muted-foreground">
                Tu carrito est&aacute; vac&iacute;o
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-6">
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex gap-4 border-b border-border pb-6 last:border-b-0"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-muted">
                    <Image
                      src={item.product.image_url || "/images/hero-perfume.jpg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <h3 className="font-sans text-sm font-medium text-primary">
                        {item.product.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="text-muted-foreground transition-colors hover:text-primary"
                        aria-label={`Eliminar ${item.product.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded border border-border text-primary/60 transition-colors hover:border-secondary hover:text-secondary"
                          aria-label="Menos"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center font-sans text-sm text-primary">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded border border-border text-primary/60 transition-colors hover:border-secondary hover:text-secondary"
                          aria-label="M\u00E1s"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-sans text-sm font-semibold text-secondary">
                        ${(item.product.price * item.quantity).toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-4">
            <div className="flex items-center justify-between pb-4">
              <span className="font-sans text-sm text-muted-foreground">Subtotal</span>
              <span className="font-serif text-lg text-primary">
                ${totalPrice.toLocaleString("es-AR")}
              </span>
            </div>
            <button
              type="button"
              className="w-full rounded bg-secondary py-3 font-sans text-sm font-semibold uppercase tracking-widest text-secondary-foreground transition-opacity hover:opacity-90"
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </>
  )
}
