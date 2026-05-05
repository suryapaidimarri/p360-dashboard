'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import AddClientModal from '@/components/dashboard/AddClientModal'
import ClientCard from '@/components/dashboard/ClientCard'
import { Client } from '@/types'

const DEMO: Client[] = [
  { id:'1', name:'Acme Corp', domain:'acmecorp.com', logo_url:null, color:'#20BB71', status:'active', agency_id:'1', platforms:['GA4','Ads','GSC'], created_at:'' },
  { id:'2', name:'BrightMed', domain:'brightmed.com', logo_url:null, color:'#48B5EA', status:'active', agency_id:'1', platforms:['GSC','Semrush'], created_at:'' },
  { id:'3', name:'CloudBase', domain:'cloudbase.io', logo_url:null, color:'#F9B62A', status:'active', agency_id:'1', platforms:['LinkedIn','Ads'], created_at:'' },
  { id:'4', name:'DeltaRetail', domain:'deltaretail.com', logo_url:null, color:'#F64674', status:'review', agency_id:'1', platforms:['FB Ads','StackAdapt'], created_at:'' },
  { id:'5', name:'EcoFinance', domain:'ecofinance.com', logo_url:null, color:'#20BB71', status:'active', agency_id:'1', platforms:['GA4','YouTube'], created_at:'' },
  { id:'6', name:'FreshBrand', domain:'freshbrand.co', logo_url:null, color:'#F53619', status:'active', agency_id:'1', platforms:['Bing','Meta'], created_at:'' },
  { id:'7', name:'GrowthLab', domain:'growthlab.io', logo_url:null, color:'#48B5EA', status:'active', agency_id:'1', platforms:['GA4','GSC'], created_at:'' },
  { id:'8', name:'HorizonAI', domain:'horizonai.com', logo_url:null, color:'#F9B62A', status:'paused', agency_id:'1', platforms:['Ads','LinkedIn'], created_at:'' },
]

const FILTERS = ['all','active','review','paused'] as const
const KPIS = [
  { label:'Total Sessions', value:'2.4M', change:'+18.2%', w:'72%', c:'#20BB71' },
  { label:'Conversions', value:'94.1K', change:'+11.4%', w:'55%', c:'#48B5EA' },
  { label:'Avg Engagement', value:'62.4%', change:'+4.2%', w:'62%', c:'#F9B62A' },
  { label:'Active Sources', value:'247', change:'+8 new', w:'40%', c:'#20BB71' },
]

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(DEMO)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState<typeof FILTERS[number]>('all')

  const filtered = filter === 'all' ? clients : clients.filter(c => c.status === filter)

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
      {/* Topbar */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 24px', borderBottom:'1px solid #E6E6E6', background:'#FFFFFF', flexShrink:0 }}>
        <div>
          <span style={{ fontSize:14, fontWeight:500, color:'#111111', fontFamily:"'DM Sans',sans-serif" }}>Clients</span>
          <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:'#6B6B6B', marginLeft:8, letterSpacing:'0.08em', textTransform:'uppercase' }}>— {clients.length} accounts</span>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:'5px 12px', borderRadius:2, fontSize:9, fontFamily:"'Barlow',sans-serif", fontWeight:600,
              letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer', border:'1px solid',
              background: filter===f ? '#C2FFE2' : '#FFFFFF',
              borderColor: filter===f ? '#20BB71' : '#E6E6E6',
              color: filter===f ? '#111' : '#6B6B6B',
            }}>{f}</button>
          ))}
          <button onClick={() => setShowModal(true)} style={{
            display:'flex', alignItems:'center', gap:6, background:'#20BB71', border:'none',
            color:'#111111', fontSize:9, fontWeight:700, fontFamily:"'Barlow',sans-serif",
            letterSpacing:'0.08em', textTransform:'uppercase', padding:'7px 14px', borderRadius:2, cursor:'pointer', marginLeft:4,
          }}>
            <Plus size={11} /> Add Client
          </button>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:24 }}>
        {/* KPI row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:24 }}>
          {KPIS.map(k => (
            <div key={k.label} style={{ background:'#FFFFFF', border:'1px solid #E6E6E6', borderRadius:2, padding:16 }}>
              <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, fontWeight:600, color:'#6B6B6B', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>{k.label}</p>
              <p style={{ fontSize:22, fontWeight:300, color:'#111111', letterSpacing:'-0.5px', lineHeight:1 }}>{k.value}</p>
              <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, fontWeight:600, color:'#20BB71', marginTop:6, letterSpacing:'0.04em' }}>{k.change}</p>
              <div style={{ height:2, background:'#E6E6E6', borderRadius:0, marginTop:10, overflow:'hidden' }}>
                <div style={{ height:'100%', width:k.w, background:k.c }} />
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, fontWeight:600, color:'#6B6B6B', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:10 }}>All Clients</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:8 }}>
          {filtered.map(c => <ClientCard key={c.id} client={c} />)}
          <button onClick={() => setShowModal(true)} style={{
            minHeight:104, background:'#FAFAFA', border:'1px dashed #E6E6E6', borderRadius:2,
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer',
          }}>
            <div style={{ width:24, height:24, borderRadius:2, background:'#E6E6E6', display:'flex', alignItems:'center', justifyContent:'center', color:'#6B6B6B' }}>
              <Plus size={13} />
            </div>
            <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, fontWeight:600, color:'#6B6B6B', textTransform:'uppercase', letterSpacing:'0.08em' }}>Add client</span>
          </button>
        </div>
      </div>

      {showModal && <AddClientModal onClose={() => setShowModal(false)} onAdd={c => { setClients(p => [...p, c]); setShowModal(false) }} />}
    </div>
  )
}
