"use client"

import Link from 'next/link'
import { Clock, Mail, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import '../checkout.css'

export default function CheckoutPendingPage() {
  return (
    <div className="container max-w-2xl py-20">
      {/* Contenido principal */}
      <div className="text-center">
        {/* Icono de pendiente */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-yellow-100 p-6 animate-pulse-slow">
            <Clock className="h-16 w-16 text-yellow-600" strokeWidth={2} />
          </div>
        </div>

        {/* Título */}
        <h1 className="font-serif text-4xl text-primary mb-4">
          Pago Pendiente
        </h1>

        {/* Descripción */}
        <p className="text-muted-foreground text-lg mb-8">
          Tu pago está siendo procesado.
          <br />
          Te notificaremos por email cuando se confirme.
        </p>

        {/* Card con información */}
        <Card className="mb-8 text-left">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-primary mb-1">
                    Métodos de pago pendientes
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Si elegiste pagar en efectivo, transferencia o tarjeta de débito,
                    tu pago puede tardar entre 1 y 3 días hábiles en acreditarse.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-primary mb-1">
                    Te mantendremos informado
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Recibirás un email de confirmación apenas el pago sea aprobado.
                    También te enviaremos el número de seguimiento de tu pedido.
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-primary">Nota:</strong> Tu pedido será preparado
                  y enviado una vez que se confirme el pago.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="min-w-[200px]">
            <Link href="/shop">
              Seguir Comprando
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="min-w-[200px]">
            <Link href="/">
              Volver al Inicio
            </Link>
          </Button>
        </div>

        {/* Mensaje de soporte */}
        <div className="mt-8 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
          <p className="text-sm text-yellow-800">
            <strong>¿Tienes dudas sobre tu pago?</strong>
            <br />
            Contáctanos y te ayudaremos a verificar el estado de tu orden.
          </p>
        </div>

        {/* Link de contacto */}
        <p className="text-sm text-muted-foreground mt-6">
          <Link href="/contact" className="text-secondary hover:underline font-medium">
            Contactar Soporte
          </Link>
        </p>
      </div>
    </div>
  )
}
