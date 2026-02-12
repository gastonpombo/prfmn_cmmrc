"use client"

import React from "react"

import { useState } from "react"

export function ContactForm() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setFormState({ name: "", email: "", message: "" })
  }

  return (
    <div className="flex-1">
      {submitted ? (
        <div className="flex flex-col items-center justify-center rounded border border-border py-16 text-center">
          <p className="mb-2 font-serif text-xl text-primary">
            Mensaje enviado
          </p>
          <p className="font-sans text-sm text-muted-foreground">
            Te responderemos a la brevedad. Gracias por contactarnos.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-6 font-sans text-sm text-secondary underline"
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="contact-name"
              className="mb-2 block font-sans text-sm font-medium text-primary"
            >
              Nombre
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={formState.name}
              onChange={(e) =>
                setFormState((s) => ({ ...s, name: e.target.value }))
              }
              className="w-full rounded border border-border bg-background px-4 py-3 font-sans text-sm text-primary placeholder:text-muted-foreground focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="mb-2 block font-sans text-sm font-medium text-primary"
            >
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={formState.email}
              onChange={(e) =>
                setFormState((s) => ({ ...s, email: e.target.value }))
              }
              className="w-full rounded border border-border bg-background px-4 py-3 font-sans text-sm text-primary placeholder:text-muted-foreground focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label
              htmlFor="contact-message"
              className="mb-2 block font-sans text-sm font-medium text-primary"
            >
              Mensaje
            </label>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={formState.message}
              onChange={(e) =>
                setFormState((s) => ({ ...s, message: e.target.value }))
              }
              className="w-full resize-none rounded border border-border bg-background px-4 py-3 font-sans text-sm text-primary placeholder:text-muted-foreground focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
              placeholder="Contános en qué podemos ayudarte..."
            />
          </div>
          <button
            type="submit"
            className="self-start rounded bg-secondary px-8 py-3 font-sans text-sm font-semibold uppercase tracking-widest text-secondary-foreground transition-opacity hover:opacity-90"
          >
            Enviar Mensaje
          </button>
        </form>
      )}
    </div>
  )
}
