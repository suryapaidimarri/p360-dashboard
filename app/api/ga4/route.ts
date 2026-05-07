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

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get('client_id')
  const propertyId = request.nextUrl.searchParams.get('property_id')
  const startDate = request.nextUrl.searchParams.get('start_date') || '30daysAgo'
  const endDate = request.nextUrl.searchParams.get('end_date') || 'today'

  if (!clientId || !propertyId) {
    return NextResponse.json({ error: 'Missing client_id or property_id' }, { status: 400 })
  }

  try {
    // Get connection from Supabase
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

    // Fetch GA4 data
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
          metrics: [
            { name: 'sessions' },
            { name: 'totalUsers' },
            { name: 'conversions' },
            { name: 'bounceRate' },
            { name: 'engagementRate' },
            { name: 'averageSessionDuration' },
          ],
          dimensions: [{ name: 'date' }],
          orderBys: [{ dimension: { dimensionName: 'date' } }],
          metricAggregations: ['TOTAL'],
        }),
      }
    )

    const data = await res.json()

    // Also fetch traffic sources
    const sourceRes = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: 'sessions' }],
          dimensions: [{ name: 'sessionDefaultChannelGroup' }],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 6,
        }),
      }
    )
    const sourceData = await sourceRes.json()

    // Fetch device breakdown
    const deviceRes = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: 'sessions' }],
          dimensions: [{ name: 'deviceCategory' }],
        }),
      }
    )
    const deviceData = await deviceRes.json()

    // Fetch city breakdown
    const cityRes = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: 'sessions' }],
          dimensions: [{ name: 'city' }],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 5,
        }),
      }
    )
    const cityData = await cityRes.json()

    return NextResponse.json({
      connected: true,
      timeSeries: data,
      sources: sourceData,
      devices: deviceData,
      cities: cityData,
      properties: conn.ga4_properties,
    })
  } catch (err) {
    console.error('GA4 error:', err)
    return NextResponse.json({ error: 'Failed to fetch GA4 data' }, { status: 500 })
  }
}
