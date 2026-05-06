import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get('client_id')
  if (!clientId) return NextResponse.json({})
  const { data } = await supabase
    .from('client_datasource_mapping')
    .select('*')
    .eq('client_id', clientId)
    .single()
  return NextResponse.json(data || {})
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { client_id, ga4_property_id, ga4_property_name, gsc_site_url } = body
  const { data, error } = await supabase
    .from('client_datasource_mapping')
    .upsert({ client_id, ga4_property_id, ga4_property_name, gsc_site_url, updated_at: new Date().toISOString() }, { onConflict: 'client_id' })
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
