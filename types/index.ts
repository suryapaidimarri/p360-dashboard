export type Role = 'admin' | 'client'
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
