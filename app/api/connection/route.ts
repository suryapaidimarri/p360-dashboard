import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get('client_id')
  if (!clientId) return NextResponse.json({ connected: false })

  const { data } = await supabase
    .from('google_connections')
    .select('email, ga4_properties, gsc_sites, connected_at')
    .eq('client_id', clientId)
    .single()

  if (!data) return NextResponse.json({ connected: false })

  return NextResponse.json({
    connected: true,
    email: data.email,
    ga4_properties: data.ga4_properties || [],
    gsc_sites: data.gsc_sites || [],
    connected_at: data.connected_at,
  })
}

export async function DELETE(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get('client_id')
  if (!clientId) return NextResponse.json({ error: 'Missing client_id' }, { status: 400 })

  await supabase.from('google_connections').delete().eq('client_id', clientId)
  return NextResponse.json({ disconnected: true })
}
