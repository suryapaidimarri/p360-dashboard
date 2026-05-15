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
  const params = request.nextUrl.searchParams
  const clientId = params.get('client_id')
  const propertyId = params.get('property_id') // "properties/123456"

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

    // 1. Fetch ALL GA4 Audiences (paginated) — these are the main filters in Looker Studio
    try {
      let pageToken: string | undefined
      do {
        const url = new URL(`https://analyticsadmin.googleapis.com/v1beta/${propertyId}/audiences`)
        url.searchParams.set('pageSize', '200')
        if (pageToken) url.searchParams.set('pageToken', pageToken)

        const res = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        const data = await res.json()

        console.log('Audiences API response status:', res.status)
        if (data.error) console.log('Audiences error:', JSON.stringify(data.error))

        for (const audience of data.audiences || []) {
          if (audience.displayName) {
            filters.push({ name: audience.displayName, type: 'ga4' })
          }
        }
        pageToken = data.nextPageToken
      } while (pageToken)
    } catch (e) {
      console.error('Audiences fetch error:', e)
    }

    // 2. Fetch GA4 channel groups as filter options
    try {
      const cgRes = await fetch(
        `https://analyticsadmin.googleapis.com/v1alpha/${propertyId}/channelGroups`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      const cgData = await cgRes.json()
      for (const cg of cgData.channelGroups || []) {
        if (cg.displayName) {
          filters.push({ name: cg.displayName, type: 'ga4' })
        }
      }
    } catch {}

    // 3. Fetch all channel group values from a runReport call
    try {
      const channelRes = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'sessionDefaultChannelGroup' }],
            metrics: [{ name: 'sessions' }],
            orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
            limit: 20,
          }),
        }
      )
      const channelData = await channelRes.json()
      for (const row of channelData.rows || []) {
        const channel = row.dimensionValues?.[0]?.value
        if (channel && channel !== '(not set)') {
          const filterName = `${channel} traffic only`
          if (!filters.find(f => f.name === filterName)) {
            filters.push({ name: filterName, type: 'ga4' })
          }
        }
      }
    } catch {}

    // 4. Always add standard GA4 presets (deduplicated)
    const presets = [
      { name: 'New users only', type: 'ga4' as const },
      { name: 'Returning users only', type: 'ga4' as const },
      { name: 'Purchasers only', type: 'ga4' as const },
      { name: 'Mobile users only', type: 'ga4' as const },
      { name: 'Desktop users only', type: 'ga4' as const },
      { name: 'Tablet users only', type: 'ga4' as const },
      { name: 'Sessions with conversions', type: 'ga4' as const },
      { name: 'Engaged sessions only', type: 'ga4' as const },
      { name: 'Bounced sessions', type: 'ga4' as const },
      { name: 'Users from US', type: 'ga4' as const },
    ]
    for (const preset of presets) {
      if (!filters.find(f => f.name === preset.name)) {
        filters.push(preset)
      }
    }

    console.log(`Total filters found: ${filters.length}`)
    return NextResponse.json({ filters, total: filters.length })

  } catch (err) {
    console.error('Filter route error:', err)
    return NextResponse.json({ error: 'Failed to fetch filters', filters: [] }, { status: 500 })
  }
}
