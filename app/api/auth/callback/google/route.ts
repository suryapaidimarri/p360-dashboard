import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')
  const error = request.nextUrl.searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/clients?error=oauth_failed`)
  }

  try {
    // 1. Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }),
    })
    const tokens = await tokenRes.json()
    if (!tokens.access_token) throw new Error(`No access token: ${JSON.stringify(tokens)}`)

    // 2. Get user info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const userInfo = await userRes.json()

    // 3. Get GA4 properties via accountSummaries (most reliable endpoint)
    let properties: any[] = []
    try {
      const summaryRes = await fetch(
        'https://analyticsadmin.googleapis.com/v1beta/accountSummaries',
        { headers: { Authorization: `Bearer ${tokens.access_token}` } }
      )
      const summaryData = await summaryRes.json()
      const summaries = summaryData.accountSummaries || []
      for (const acc of summaries) {
        if (acc.propertySummaries) {
          for (const prop of acc.propertySummaries) {
            properties.push({
              name: prop.property,
              displayName: prop.displayName,
              account: acc.displayName,
            })
          }
        }
      }
    } catch (e) {
      console.error('GA4 properties error:', e)
    }

    // 4. Get GSC sites
    let sites: any[] = []
    try {
      const gscRes = await fetch(
        'https://www.googleapis.com/webmasters/v3/sites',
        { headers: { Authorization: `Bearer ${tokens.access_token}` } }
      )
      const gscData = await gscRes.json()
      sites = gscData.siteEntry || []
    } catch (e) {
      console.error('GSC sites error:', e)
    }

    // 5. Save everything to Supabase
    const { error: dbError } = await supabase
      .from('google_connections')
      .upsert({
        client_id: state,
        email: userInfo.email,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(Date.now() + (tokens.expires_in || 3600) * 1000).toISOString(),
        ga4_properties: properties,
        gsc_sites: sites,
        connected_at: new Date().toISOString(),
      }, { onConflict: 'client_id' })

    if (dbError) console.error('DB error:', dbError)

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/clients/${state}?connected=true`
    )
  } catch (err) {
    console.error('OAuth error:', err)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/clients?error=oauth_failed`
    )
  }
}
