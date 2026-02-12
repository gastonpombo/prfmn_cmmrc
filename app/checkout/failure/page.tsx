"use client"

import Link from 'next/link'
import { XCircle, RefreshCw, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import '../checkout.css'

export default function CheckoutFailurePage() {
  return (
    <div className="container max-w-2xl py-20">
      {/* Contenido principal */}
      <div className="text-center">
        {/* Icono de error */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-6 animate-shake">
            <XCircle className="h-16 w-16 text-red-600" strokeWidth={2} />
          </div>
        </div>

        {/* Título */}
        <h1 className="font-serif text-4xl text-primary mb-4">
          Pago Rechazado
        </h1>

        {/* Descripción */}
        <p className="text-muted-foreground text-lg mb-8">
          Hubo un problema al procesar tu pago.
          <br />
          No te preocupes, no se realizó ningún cargo.
        </p>

        {/* Card con razones comunes */}
        <Card className="mb-8 text-left">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-primary mb-2">
                    Razones comunes del rechazo:
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Fondos insuficientes en la tarjeta</li>
                    <li>• Datos de la tarjeta incorrectos</li>
                    <li>• Límite de compra excedido</li>
                    <li>• Tarjeta vencida o bloqueada</li>
                    <li>• Problemas de conexión con el banco</li>
                  </ul>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-primary">Tip:</strong> Verifica los datos de tu tarjeta
                  o intenta con otro método de pago. Si el problema persiste, contacta a tu banco.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="min-w-[200px]">
            <Link href="/shop">
              <RefreshCw className="mr-2 h-4 w-4" />
              Intentar Nuevamente
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="min-w-[200px]">
            <Link href="/contact">
              Contactar Soporte
            </Link>
          </Button>
        </div>

        {/* Mensaje de ayuda */}
        <div className="mt-8 rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            ¿Necesitas ayuda inmediata?
            <br />
            Escríbenos por WhatsApp o email y te asistiremos con tu compra.
          </p>
        </div>

        {/* Link al inicio */}
        <p className="text-sm text-muted-foreground mt-6">
          <Link href="/" className="text-secondary hover:underline font-medium">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  )
}
