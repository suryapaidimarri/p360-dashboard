export interface Client {
  id: string
  name: string
  domain: string
  logo_url: string | null
  status: 'active' | 'review' | 'paused'
  agency_id: string
  group?: string
  group_count?: number
  created_at: string
}

export interface Dashboard {
  id: string
  name: string
  client_id: string
}

export interface KPI {
  label: string
  value: string
  change: string
  up: boolean
  color: 'blue' | 'green' | 'red' | 'white'
}
