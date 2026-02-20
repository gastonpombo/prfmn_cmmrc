import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase'

// Vercel Cron Jobs siempre llaman con GET
export const dynamic = 'force-dynamic'

/**
 * GET /api/cron/cleanup-orders
 *
 * Ejecutado automáticamente por Vercel Cron cada 15 minutos.
 * Llama a la función SQL `expire_old_pending_orders` que:
 *   1. Busca órdenes en estado 'pending' con más de 30 minutos de antigüedad.
 *   2. Actualiza su estado a 'expired'.
 *   3. Devuelve el stock reservado a los productos correspondientes.
 *
 * Seguridad: sólo se ejecuta si el header Authorization coincide con CRON_SECRET.
 */
export async function GET(request: NextRequest) {
    // ─── 1. Verificar autorización ───────────────────────────────────────────
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
        console.error('❌ CRON_SECRET no está configurado')
        return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }

    const authHeader = request.headers.get('authorization')

    if (authHeader !== `Bearer ${cronSecret}`) {
        console.warn('⛔ Intento no autorizado de ejecutar cron cleanup-orders')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ─── 2. Ejecutar limpieza vía RPC ────────────────────────────────────────
    console.log('🕐 Cron cleanup-orders iniciado')

    const supabase = getSupabaseAdminClient()

    const { data, error } = await supabase.rpc('expire_old_pending_orders', {
        minutes_threshold: 30,
    })

    if (error) {
        console.error('❌ Error en expire_old_pending_orders:', error.message)
        // Devolver 200: Vercel no debe reintentar en caso de error de negocio
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 200 }
        )
    }

    const expiredCount = typeof data === 'number' ? data : (data as { expired_count?: number })?.expired_count ?? 0

    console.log(`✅ Cron cleanup-orders completado: ${expiredCount} orden(es) expirada(s)`)

    return NextResponse.json({
        success: true,
        expired_orders: expiredCount,
        ran_at: new Date().toISOString(),
    })
}
