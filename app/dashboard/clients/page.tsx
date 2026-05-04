'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import AddClientModal from '@/components/dashboard/AddClientModal'
import ClientCard from '@/components/dashboard/ClientCard'
import { Client } from '@/types'

const DEMO_CLIENTS: Client[] = [
  { id: '1', name: 'Acme Corp', domain: 'acmecorp.com', logo_url: null, color: '#6366f1', status: 'active', agency_id: '1', platforms: ['GA4', 'Ads', 'GSC'], created_at: '' },
  { id: '2', name: 'BrightMed', domain: 'brightmed.com', logo_url: null, color: '#8b5cf6', status: 'active', agency_id: '1', platforms: ['GSC', 'Semrush'], created_at: '' },
  { id: '3', name: 'CloudBase', domain: 'cloudbase.io', logo_url: null, color: '#0ea5e9', status: 'active', agency_id: '1', platforms: ['LinkedIn', 'Ads'], created_at: '' },
  { id: '4', name: 'DeltaRetail', domain: 'deltaretail.com', logo_url: null, color: '#f59e0b', status: 'review', agency_id: '1', platforms: ['FB Ads', 'StackAdapt'], created_at: '' },
  { id: '5', name: 'EcoFinance', domain: 'ecofinance.com', logo_url: null, color: '#10b981', status: 'active', agency_id: '1', platforms: ['GA4', 'YouTube'], created_at: '' },
  { id: '6', name: 'FreshBrand', domain: 'freshbrand.co', logo_url: null, color: '#ec4899', status: 'active', agency_id: '1', platforms: ['Bing', 'Meta'], created_at: '' },
  { id: '7', name: 'GrowthLab', domain: 'growthlab.io', logo_url: null, color: '#f97316', status: 'active', agency_id: '1', platforms: ['GA4', 'GSC'], created_at: '' },
  { id: '8', name: 'HorizonAI', domain: 'horizonai.com', logo_url: null, color: '#a855f7', status: 'paused', agency_id: '1', platforms: ['Ads', 'LinkedIn'], created_at: '' },
]

const FILTERS = ['all', 'active', 'review', 'paused'] as const

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(DEMO_CLIENTS)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState<typeof FILTERS[number]>('all')

  const filtered = filter === 'all' ? clients : clients.filter(c => c.status === filter)

  function onAdd(c: Client) {
    setClients(prev => [...prev, c])
    setShowModal(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#05070d', flexShrink: 0 }}>
        <div>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#f0f2ff' }}>Clients</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', marginLeft: 8 }}>— {clients.length} accounts</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 11, textTransform: 'capitalize', cursor: 'pointer', border: 'none',
              background: filter === f ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
              color: filter === f ? '#a5b4fc' : 'rgba(255,255,255,0.4)',
              outline: filter === f ? 'none' : '1px solid rgba(255,255,255,0.07)'
            }}>{f}</button>
          ))}
          <button onClick={() => setShowModal(true)} style={{
            display: 'flex', alignItems: 'center', gap: 6, background: '#4f46e5', border: 'none',
            color: 'white', fontSize: 12, fontWeight: 500, padding: '7px 14px', borderRadius: 8, cursor: 'pointer', marginLeft: 4
          }}>
            <Plus size={13} /> Add Client
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total Sessions', value: '2.4M', change: '+18.2%' },
            { label: 'Conversions', value: '94.1K', change: '+11.4%' },
            { label: 'Avg Engagement', value: '62.4%', change: '+4.2%' },
            { label: 'Active Sources', value: '247', change: '+8 new' },
          ].map(kpi => (
            <div key={kpi.label} style={{ background: '#0c0f1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>{kpi.label}</p>
              <p style={{ fontSize: 22, fontWeight: 600, color: '#f0f2ff', letterSpacing: '-0.5px' }}>{kpi.value}</p>
              <p style={{ fontSize: 10, color: '#10b981', marginTop: 4 }}>{kpi.change}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12 }}>All Clients</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
          {filtered.map(client => <ClientCard key={client.id} client={client} />)}
          <button onClick={() => setShowModal(true)} style={{
            minHeight: 108, background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)',
            borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 8, cursor: 'pointer'
          }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
              <Plus size={14} />
            </div>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Add client</span>
          </button>
        </div>
      </div>

      {showModal && <AddClientModal onClose={() => setShowModal(false)} onAdd={onAdd} />}
    </div>
  )
}
