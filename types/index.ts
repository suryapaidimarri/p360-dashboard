export type Role = 'admin' | 'client'

export interface Profile {
  id: string
  email: string
  role: Role
  full_name: string | null
  agency_id: string | null
  client_id: string | null
  created_at: string
}

export interface Client {
  id: string
  name: string
  domain: string
  logo_url: string | null
  color: string
  status: 'active' | 'review' | 'paused'
  agency_id: string
  platforms: string[]
  created_at: string
}

export interface DataSource {
  id: string
  name: string
  type: string
  account_id: string
  account_label: string
  status: 'connected' | 'disconnected'
  clients_count: number
  agency_id: string
}

export interface KPIData {
  sessions: number
  conversions: number
  engagement: number
  bounce_rate: number
  sessions_change: number
  conversions_change: number
  engagement_change: number
  bounce_change: number
}

export interface ChartPoint {
  label: string
  value: number
}

export interface Report {
  id: string
  client_id: string
  title: string
  type: 'monthly' | 'weekly' | 'custom'
  schedule: string | null
  last_sent: string | null
  created_at: string
}
