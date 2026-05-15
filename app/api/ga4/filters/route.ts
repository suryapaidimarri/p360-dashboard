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
  const propertyId = p.get('property_id') // e.g. "properties/123456"

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

    const filters: { name: string; type: 'ga4' | 'other' }[] = []

    // Fetch GA4 audiences (these appear as filters in Looker Studio)
    try {
      const audienceRes = await fetch(
        `https://analyticsadmin.googleapis.com/v1beta/${propertyId}/audiences`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      const audienceData = await audienceRes.json()
      for (const audience of audienceData.audiences || []) {
        filters.push({ name: audience.displayName, type: 'ga4' })
      }
    } catch {}

    // Fetch GA4 custom segments (if available)
    try {
      const segRes = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'sessionDefaultChannelGroup' }],
            metrics: [{ name: 'sessions' }],
            limit: 1,
          }),
        }
      )
      // Channel groups act as common filters
      const segData = await segRes.json()
      if (segData.rows) {
        for (const row of segData.rows) {
          const channel = row.dimensionValues?.[0]?.value
          if (channel && channel !== '(not set)') {
            filters.push({ name: `${channel} only`, type: 'ga4' })
          }
        }
      }
    } catch {}

    // Add standard GA4 filter presets
    const presets = [
      'New users', 'Returning users', 'Purchasers', 'Mobile users',
      'Desktop users', 'Tablet users', 'Sessions with conversions',
      'Engaged sessions only',
    ]
    for (const p of presets) {
      if (!filters.find(f => f.name === p)) {
        filters.push({ name: p, type: 'ga4' })
      }
    }

    return NextResponse.json({ filters })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch filters', filters: [] }, { status: 500 })
  }
}
