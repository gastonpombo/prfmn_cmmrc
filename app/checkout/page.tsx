"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2, ShoppingBag } from "lucide-react"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"
import type { CheckoutResponse } from "@/lib/supabase"

// Constante de departamentos ANTES del schema (z.enum la requiere al compilar)
const DEPARTAMENTOS = [
    "Artigas", "Canelones", "Cerro Largo", "Colonia", "Durazno",
    "Flores", "Florida", "Lavalleja", "Maldonado", "Montevideo",
    "Paysandú", "Río Negro", "Rivera", "Rocha", "Salto",
    "San José", "Soriano", "Tacuarembó", "Treinta y Tres"
] as const

// Función para formatear Cédula de Identidad uruguaya
const formatCI = (value: string) => {
    // Eliminar todo lo que no sea dígito
    const numbers = value.replace(/\D/g, "")

    // Limitar a 8 dígitos
    const clean = numbers.slice(0, 8)

    // Formatear según longitud
    // X.XXX.XXX-X
    if (clean.length > 7) {
        return `${clean.slice(0, 1)}.${clean.slice(1, 4)}.${clean.slice(4, 7)}-${clean.slice(7)}`
    }
    // XXX.XXX-X (para 7 dígitos, aunque el standard uruguayo suele manejar 8 con cero a la izq)
    if (clean.length > 6) {
        return `${clean.slice(0, 3)}.${clean.slice(3, 6)}-${clean.slice(6)}`
    }
    if (clean.length > 3) {
        return `${clean.slice(0, clean.length - 3)}.${clean.slice(clean.length - 3)}`
    }
    return clean
}

// Schema de validación
const checkoutSchema = z.object({
    firstName: z.string().min(2, "Nombre requerido"),
    lastName: z.string().min(2, "Apellido requerido"),
    email: z.string().email("Email inválido"),
    ci: z.string().min(1, "C.I. requerida").refine((val) => {
        const numbers = val.replace(/\D/g, "")
        return numbers.length === 8
    }, "La cédula debe tener 8 dígitos (incluye el dígito verificador). Si tu cédula tiene 7, agrega un 0 al inicio."),
    phone: z.string({ required_error: "Teléfono requerido" }).min(8, "Teléfono inválido"),
    shippingCompany: z.enum(["DAC", "UES"], {
        required_error: "Selecciona una empresa de envío",
    }),
    shippingMethod: z.enum(["domicilio", "agencia"], {
        required_error: "Selecciona una modalidad",
    }),
    department: z.enum(DEPARTAMENTOS, {
        required_error: "Selecciona un departamento",
        invalid_type_error: "Departamento inválido",
    }),
    city: z.string().min(2, "Ciudad requerida"),
    address: z.string().min(5, "Dirección requerida"),
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
    const router = useRouter()
    const { items, totalPrice } = useCart()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            ci: "",
            phone: "",
            shippingCompany: "DAC",
            shippingMethod: "domicilio",
            // department: no default — un enum de strings específicos no admite ""
            city: "",
            address: "",
        },
    })

    const handleCIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCI(e.target.value)
        form.setValue("ci", formatted, { shouldValidate: true })
    }

    async function onSubmit(data: CheckoutFormValues) {
        setIsSubmitting(true)
        try {
            // Construir el objeto para la API
            const checkoutData = {
                items: items.map(item => ({
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity
                })),
                customer_info: {
                    name: `${data.firstName} ${data.lastName}`,
                    email: data.email,
                    phone: data.phone,
                    address: {
                        street: data.address,
                        city: data.city,
                        state: data.department,
                        postal_code: "0000", // Default o pedir al usuario si es crítico
                        country: "Uruguay"
                    },
                    // Datos adicionales para guardar en customer_details
                    extra_details: {
                        ci: data.ci.replace(/\D/g, ""), // Enviar solo números
                        shipping_company: data.shippingCompany,
                        shipping_method: data.shippingMethod,
                    }
                }
            }

            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(checkoutData),
            })

            const duplicateResponse: CheckoutResponse = await response.json() // Usamos el tipo importado o inferido

            if (!response.ok) {
                throw new Error(duplicateResponse.error || "Error al procesar el pedido")
            }

            if (duplicateResponse.success && duplicateResponse.init_point) {
                window.location.href = duplicateResponse.init_point
            }

        } catch (error) {
            console.error("Error checkout:", error)
            toast.error(error instanceof Error ? error.message : "Error desconocido")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto flex flex-col items-center justify-center py-20 px-4">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2">Tu carrito está vacío</h1>
                <p className="text-muted-foreground mb-6">Agrega productos para continuar con la compra.</p>
                <Button onClick={() => router.push("/")}>Volver a la tienda</Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-serif font-bold mb-8 text-center md:text-left">Finalizar Compra</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Columna Izquierda: Formulario */}
                <div className="space-y-6">
                    <div className="bg-card p-6 rounded-lg border shadow-sm">
                        <h2 className="text-xl font-semibold mb-6">Datos de Envío y Facturación</h2>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                                {/* Datos Personales */}
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nombre</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Juan" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Apellido</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Pérez" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="ci"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cédula (C.I.)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="1.234.567-8"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e)
                                                            handleCIChange(e)
                                                        }}
                                                        maxLength={11} // X.XXX.XXX-X son 11 chars
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Teléfono / WhatsApp</FormLabel>
                                                <FormControl>
                                                    <div className="flex">
                                                        <PhoneInput
                                                            international
                                                            defaultCountry="UY"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="juan@ejemplo.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="my-4 border-t pt-4">
                                    <h3 className="text-lg font-medium mb-4">Opciones de Envío</h3>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <FormField
                                            control={form.control}
                                            name="shippingCompany"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <FormLabel>Empresa</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            className="flex flex-col space-y-1"
                                                        >
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="DAC" />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">DAC</FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="UES" />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">UES</FormLabel>
                                                            </FormItem>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="shippingMethod"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <FormLabel>Modalidad</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            className="flex flex-col space-y-1"
                                                        >
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="domicilio" />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">Envío a Domicilio</FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="agencia" />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">Retiro en Agencia</FormLabel>
                                                            </FormItem>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 border-t pt-4">
                                    <h3 className="text-lg font-medium">Dirección</h3>

                                    <FormField
                                        control={form.control}
                                        name="department"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Departamento</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona un departamento" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {DEPARTAMENTOS.map((dep) => (
                                                            <SelectItem key={dep} value={dep}>
                                                                {dep}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Ciudad / Localidad</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ej: Montevideo" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Dirección / Agencia</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ej: Av. 18 de Julio 1234" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full mt-6" size="lg" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Procesando...
                                        </>
                                    ) : (
                                        "Ir a Pagar"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>

                {/* Columna Derecha: Resumen */}
                <div className="md:sticky md:top-24 h-fit">
                    <div className="bg-muted/30 p-6 rounded-lg border">
                        <h3 className="text-lg font-serif font-medium mb-4">Resumen del Pedido</h3>
                        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                            {items.map((item) => (
                                <div key={item.product.id} className="flex gap-4 py-2 border-b last:border-0 border-border/50">
                                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-background">
                                        <Image
                                            src={item.product.image_url || "/images/hero-perfume.jpg"}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                                        <div className="flex justify-between items-center mt-1 text-sm text-muted-foreground">
                                            <span>Cant: {item.quantity}</span>
                                            <span className="font-semibold text-primary">
                                                ${(item.product.price * item.quantity).toLocaleString("es-AR")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${totalPrice.toLocaleString("es-AR")}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Envío</span>
                                <span className="text-green-600 font-medium">Por pagar</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                <span>Total</span>
                                <span>${totalPrice.toLocaleString("es-AR")}</span>
                            </div>
                        </div>

                        <div className="mt-6 text-xs text-muted-foreground text-center">
                            <p>Seguridad garantizada por Mercado Pago.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
