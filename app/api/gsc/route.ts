import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get('client_id')
  const siteUrl = request.nextUrl.searchParams.get('site_url')
  const startDate = request.nextUrl.searchParams.get('start_date') || '2026-04-01'
  const endDate = request.nextUrl.searchParams.get('end_date') || '2026-04-30'

  if (!clientId || !siteUrl) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  try {
    const { data: conn } = await supabase
      .from('google_connections')
      .select('*')
      .eq('client_id', clientId)
      .single()

    if (!conn) return NextResponse.json({ error: 'Not connected', connected: false }, { status: 401 })

    const res = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${conn.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: ['query'],
          rowLimit: 10,
        }),
      }
    )
    const data = await res.json()

    // Also get totals
    const totalsRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${conn.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate, endDate, dimensions: ['date'] }),
      }
    )
    const totalsData = await totalsRes.json()

    return NextResponse.json({
      connected: true,
      queries: data,
      totals: totalsData,
      sites: conn.gsc_sites,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch GSC data' }, { status: 500 })
  }
}
