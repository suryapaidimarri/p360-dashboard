// app/api/ga4/custom/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function refreshToken(refreshToken: string) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: 'refresh_token',
    }),
  })
  return res.json()
}

async function handler(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get('client_id')
  const propertyId = request.nextUrl.searchParams.get('property_id')
  const dimensionsParam = request.nextUrl.searchParams.get('dimensions') || 'date'
  const metricsParam = request.nextUrl.searchParams.get('metrics') || 'sessions'
  const startDate = request.nextUrl.searchParams.get('start_date') || '30daysAgo'
  const endDate = request.nextUrl.searchParams.get('end_date') || 'today'
  const limitParam = request.nextUrl.searchParams.get('limit') || '50'

  if (!clientId || !propertyId) {
    return NextResponse.json({ error: 'Missing client_id or property_id' }, { status: 400 })
  }

  // Parse optional dimensionFilter from POST body
  let dimensionFilter: any = undefined
  if (request.method === 'POST') {
    try {
      const body = await request.json()
      if (body.dimensionFilter) dimensionFilter = body.dimensionFilter
    } catch {}
  }

  try {
    const { data: conn, error } = await supabase
      .from('google_connections')
      .select('*')
      .eq('client_id', clientId)
      .single()

    if (error || !conn) {
      return NextResponse.json({ error: 'Not connected', connected: false }, { status: 401 })
    }

    let accessToken = conn.access_token

    // Refresh if expired
    if (new Date(conn.expires_at) < new Date()) {
      const refreshed = await refreshToken(conn.refresh_token)
      accessToken = refreshed.access_token
      await supabase.from('google_connections').update({
        access_token: refreshed.access_token,
        expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
      }).eq('client_id', clientId)
    }

    // Build request body
    const requestBody: any = {
      dateRanges: [{ startDate, endDate }],
      dimensions: dimensionsParam.split(',').map((d: string) => ({ name: d.trim() })),
      metrics: metricsParam.split(',').map((m: string) => ({ name: m.trim() })),
      orderBys: [{ metric: { metricName: metricsParam.split(',')[0].trim() }, desc: true }],
      limit: parseInt(limitParam),
    }

    // Add dimensionFilter if provided
    if (dimensionFilter) {
      requestBody.dimensionFilter = dimensionFilter
    }

    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    )

    const data = await res.json()

    if (data.error) {
      return NextResponse.json({ error: data.error.message, details: data.error }, { status: 400 })
    }

    return NextResponse.json({
      connected: true,
      rows: data.rows || [],
      totals: data.totals || [],
      rowCount: data.rowCount || 0,
    })
  } catch (err) {
    console.error('GA4 custom error:', err)
    return NextResponse.json({ error: 'Failed to fetch GA4 data' }, { status: 500 })
  }
}

export const GET = handler
export const POST = handler
