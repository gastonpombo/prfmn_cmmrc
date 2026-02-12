import Link from 'next/link'
import { CheckCircle2, ShoppingBag, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function CheckoutSuccessPage() {
  return (
    <div className="container max-w-2xl py-20">
      {/* Animación de confeti (CSS puro) */}
      <div className="confetti-wrapper">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="text-center">
        {/* Icono de éxito */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-6 animate-bounce-in">
            <CheckCircle2 className="h-16 w-16 text-green-600" strokeWidth={2} />
          </div>
        </div>

        {/* Título */}
        <h1 className="font-serif text-4xl text-primary mb-4">
          ¡Pago Exitoso!
        </h1>

        {/* Descripción */}
        <p className="text-muted-foreground text-lg mb-8">
          Tu orden ha sido procesada correctamente.
          <br />
          Te hemos enviado un email con los detalles de tu compra.
        </p>

        {/* Card con información adicional */}
        <Card className="mb-8 text-left">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-primary mb-1">
                    ¿Qué sigue?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Procesaremos tu pedido en las próximas 24 horas.
                    Recibirás un email con el número de seguimiento una vez que tu pedido sea enviado.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShoppingBag className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-primary mb-1">
                    Tiempo de entrega
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Estimamos que tu pedido llegará en 3-5 días hábiles.
                    Los envíos se realizan de lunes a viernes.
                  </p>
                </div>
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
        <p className="text-sm text-muted-foreground mt-8">
          ¿Necesitas ayuda?{' '}
          <Link href="/contact" className="text-secondary hover:underline font-medium">
            Contáctanos
          </Link>
        </p>
      </div>

      {/* CSS para confeti */}
      <style jsx>{`
        .confetti-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 50;
          overflow: hidden;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          opacity: 0;
          animation: confetti-fall 3s linear forwards;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotateZ(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotateZ(360deg);
            opacity: 0;
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
