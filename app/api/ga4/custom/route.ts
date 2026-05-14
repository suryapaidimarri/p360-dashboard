import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function refreshToken(rt: string) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: rt,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: 'refresh_token',
    }),
  })
  return res.json()
}

export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams
  const clientId = p.get('client_id')
  const propertyId = p.get('property_id')
  const dimensions = p.get('dimensions') || 'date'
  const metrics = p.get('metrics') || 'sessions'
  const startDate = p.get('start_date') || '30daysAgo'
  const endDate = p.get('end_date') || 'today'

  if (!clientId || !propertyId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  try {
    const { data: conn } = await supabase
      .from('google_connections')
      .select('*')
      .eq('client_id', clientId)
      .single()

    if (!conn) return NextResponse.json({ error: 'Not connected' }, { status: 401 })

    let accessToken = conn.access_token
    if (new Date(conn.expires_at) < new Date()) {
      const refreshed = await refreshToken(conn.refresh_token)
      accessToken = refreshed.access_token
      await supabase.from('google_connections').update({
        access_token: refreshed.access_token,
        expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
      }).eq('client_id', clientId)
    }

    const dimList = dimensions.split(',').filter(Boolean).map(d => ({ name: d.trim() }))
    const metList = metrics.split(',').filter(Boolean).map(m => ({ name: m.trim() }))

    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          dimensions: dimList,
          metrics: metList,
          orderBys: [{ metric: { metricName: metList[0].name }, desc: true }],
          limit: 30,
        }),
      }
    )

    const data = await res.json()
    return NextResponse.json({
      rows: data.rows || [],
      totals: data.totals,
      rowCount: data.rowCount,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
