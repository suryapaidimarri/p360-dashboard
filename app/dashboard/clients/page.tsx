'use client'
import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, LayoutGrid, List, Sparkles, MoreHorizontal, Copy, Trash2, X, FolderOpen } from 'lucide-react'
import Link from 'next/link'
import { Client } from '@/types'

const ALLOY_COLORS = ['#20BB71','#48B5EA','#F9B62A','#F64674','#F53619','#3FDB90','#5BD1F2','#FDC550']
const ALLOY_TINTS: Record<string,string> = {
  '#20BB71':'#C2FFE2','#48B5EA':'#E1F7FF','#F9B62A':'#FFEECA',
  '#F64674':'#FFCFDC','#F53619':'#FFCFDC','#3FDB90':'#C2FFE2',
  '#5BD1F2':'#E1F7FF','#FDC550':'#FFEECA',
}
const label = { fontFamily:"'Barlow',sans-serif", fontSize:'9px' as const, fontWeight:600, textTransform:'uppercase' as const, letterSpacing:'0.1em' }
const KPIS = [
  { label:'Total Sessions', value:'2.4M', change:'+18.2%', w:'72%', c:'#20BB71' },
  { label:'Conversions', value:'94.1K', change:'+11.4%', w:'55%', c:'#48B5EA' },
  { label:'Avg Engagement', value:'62.4%', change:'+4.2%', w:'62%', c:'#F9B62A' },
  { label:'Active Sources', value:'247', change:'+8 new', w:'40%', c:'#20BB71' },
]

function getColor(name: string) {
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % ALLOY_COLORS.length
  return ALLOY_COLORS[h]
}

// ── localStorage helpers ─────────────────────────────────────────────────────
const LS_KEY = 'p360_clients_v2'

function lsLoad(): Client[] {
  try { const v = localStorage.getItem(LS_KEY); return v ? JSON.parse(v) : [] } catch { return [] }
}
function lsSave(clients: Client[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(clients)) } catch {}
}

// ── logo component ───────────────────────────────────────────────────────────
function ClientLogo({ client }: { client: Client }) {
  const [srcIndex, setSrcIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const color = getColor(client.name)
  const tint = ALLOY_TINTS[color] || '#E6E6E6'

  useEffect(() => { setSrcIndex(0); setLoaded(false) }, [client.domain])

  if (client.group) {
    return (
      <div style={{ width:64, height:64, borderRadius:'50%', background:'#F0F0F0', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px' }}>
        <FolderOpen size={24} style={{ color:'#999' }} />
      </div>
    )
  }

  const domain = (client.domain||'').replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
  const SRCS = domain ? [
    `https://img.logo.dev/${domain}?token=pk_R9ZPqh9xR5Kfh1M6GvCXFA`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    `https://logo.clearbit.com/${domain}`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  ] : []

  const Fallback = () => (
    <div style={{ width:64, height:64, borderRadius:2, background:tint, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Barlow',sans-serif", fontSize:20, fontWeight:700, color:'#111' }}>
      {client.name[0]?.toUpperCase()}
    </div>
  )

  if (!SRCS[srcIndex]) return <div style={{ margin:'0 auto 10px' }}><Fallback /></div>

  return (
    <div style={{ width:64, height:64, margin:'0 auto 10px', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <img key={SRCS[srcIndex]} src={SRCS[srcIndex]} alt={client.name}
        onLoad={() => setLoaded(true)}
        onError={() => { setLoaded(false); setSrcIndex(p => p + 1) }}
        style={{ maxWidth:64, maxHeight:64, objectFit:'contain', display:loaded?'block':'none' }}
      />
      {!loaded && <Fallback />}
    </div>
  )
}

// ── card component ───────────────────────────────────────────────────────────
function ClientCard({ client, selected, onToggle, menuOpen, onMenuToggle, onDelete }: {
  client: Client; selected:boolean; onToggle:()=>void; menuOpen:boolean; onMenuToggle:()=>void; onDelete:()=>void
}) {
  const [hovered, setHovered] = useState(false)
  const color = getColor(client.name)

  const inner = (
    <div style={{ background:'#FFF', border:`1px solid ${selected||hovered?'#20BB71':'#E6E6E6'}`, borderRadius:2, padding:14, cursor:'pointer', position:'relative', overflow:'hidden', transition:'border-color 0.12s' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:color }} />
      <div style={{ position:'absolute', top:8, left:8, zIndex:2, opacity:hovered||selected?1:0, transition:'opacity 0.15s' }}
        onClick={e=>{e.preventDefault();e.stopPropagation();onToggle()}}>
        <div style={{ width:16, height:16, borderRadius:3, border:`2px solid ${selected?'#20BB71':'#ccc'}`, background:selected?'#20BB71':'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {selected && <span style={{ color:'#fff', fontSize:9, fontWeight:700 }}>✓</span>}
        </div>
      </div>
      <div style={{ position:'absolute', top:6, right:6, zIndex:2, opacity:hovered||menuOpen?1:0, transition:'opacity 0.15s' }}
        onClick={e=>{e.preventDefault();e.stopPropagation();onMenuToggle()}}>
        <button style={{ background:'rgba(255,255,255,0.95)', border:'1px solid #E6E6E6', borderRadius:2, padding:'2px 5px', cursor:'pointer', display:'flex', alignItems:'center' }}>
          <MoreHorizontal size={12} style={{ color:'#6B6B6B' }}/>
        </button>
        {menuOpen && (
          <div style={{ position:'absolute', right:0, top:'100%', marginTop:2, background:'#fff', border:'1px solid #E6E6E6', borderRadius:4, boxShadow:'0 6px 18px rgba(0,0,0,0.08)', padding:4, minWidth:110, zIndex:20 }}>
            <button style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'7px 10px', fontSize:12, color:'#111', background:'none', border:'none', cursor:'pointer' }}><Copy size={12}/> Clone</button>
            <button onClick={e=>{e.stopPropagation();onDelete()}} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'7px 10px', fontSize:12, color:'#F53619', background:'none', border:'none', cursor:'pointer' }}><Trash2 size={12}/> Delete</button>
          </div>
        )}
      </div>
      <ClientLogo client={client} />
      <p style={{ fontSize:12, fontWeight:500, color:'#111', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', textAlign:'center' as const, fontFamily:"'DM Sans',sans-serif" }}>{client.name}</p>
      {client.group && <p style={{ ...label, color:'#6B6B6B', textAlign:'center' as const, display:'block', marginTop:2 }}>{client.group_count} Clients</p>}
    </div>
  )

  if (client.group) return <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>{inner}</div>
  return (
    <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
      <Link 
  href={`/dashboard/clients/${client.id}?name=${encodeURIComponent(client.name)}&domain=${encodeURIComponent((client.domain||'').replace(/^https?:\/\//,'').replace(/^www\./,'').split('/')[0])}`}
  style={{ textDecoration:'none', display:'block' }}>{inner}</Link>
    </div>
  )
}

// ── page ─────────────────────────────────────────────────────────────────────
const DEMO: Client[] = [
  { id:'group1', name:'Lumistella', domain:'', logo_url:null, status:'active', agency_id:'1', group:'group', group_count:5, created_at:'2024-01-01' },
  { id:'demo-1', name:'Alloy (internal)', domain:'alloy.com', logo_url:null, status:'active', agency_id:'1', created_at:'2024-01-01' },
  { id:'demo-2', name:'Atlanta Beltline', domain:'beltline.org', logo_url:null, status:'active', agency_id:'1', created_at:'2024-01-01' },
  { id:'demo-3', name:'Collaborating Docs', domain:'collaboratingdocs.com', logo_url:null, status:'active', agency_id:'1', created_at:'2024-01-01' },
  { id:'demo-4', name:'DEMO: Grainwise', domain:'grainwise.com', logo_url:null, status:'active', agency_id:'1', created_at:'2024-01-01' },
  { id:'demo-5', name:'Georgia Aquarium', domain:'georgiaaquarium.org', logo_url:null, status:'active', agency_id:'1', created_at:'2024-01-01' },
  { id:'demo-6', name:'GFVGA', domain:'gfvga.org', logo_url:null, status:'active', agency_id:'1', created_at:'2024-01-01' },
  { id:'demo-7', name:'HHAeXchange', domain:'hhaexchange.com', logo_url:null, status:'active', agency_id:'1', created_at:'2024-01-01' },
  { id:'demo-8', name:'IOU Financial', domain:'ioufinancial.com', logo_url:null, status:'active', agency_id:'1', created_at:'2024-01-01' },
  { id:'demo-9', name:'Latapult', domain:'latapult.com', logo_url:null, status:'active', agency_id:'1', created_at:'2024-01-01' },
  { id:'demo-10', name:'Litmos', domain:'litmos.com', logo_url:null, status:'active', agency_id:'1', created_at:'2024-01-01' },
  { id:'demo-11', name:'NCH', domain:'nchmd.org', logo_url:null, status:'active', agency_id:'1', created_at:'2024-01-01' },
  { id:'demo-12', name:'S&T Bank', domain:'stbank.com', logo_url:null, status:'active', agency_id:'1', created_at:'2024-01-01' },
  { id:'demo-13', name:'TPX', domain:'tpx.com', logo_url:null, status:'active', agency_id:'1', created_at:'2024-01-01' },
]

export default function ClientsPage() {
  // Start with demo clients immediately — no loading flash
  const [clients, setClients] = useState<Client[]>(DEMO)
  const [extraClients, setExtraClients] = useState<Client[]>([])
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState<string|null>(null)
  const [newName, setNewName] = useState('')
  const [newDomain, setNewDomain] = useState('')
  const [adding, setAdding] = useState(false)

  // Load persisted data from localStorage on mount
  useEffect(() => {
    const saved = lsLoad()
    if (saved.length > 0) {
      const extras = saved.filter((c: Client) => c.id.startsWith('user-'))
      const deleted = saved.filter((c: Client) => c.id.startsWith('deleted-')).map((c: Client) => c.id.replace('deleted-', ''))
      setExtraClients(extras)
      setDeletedIds(new Set(deleted))
    }
  }, [])

  // Compute displayed clients: demo (minus deleted) + user-added
  const allClients = [
    ...DEMO.filter(c => !deletedIds.has(c.id)),
    ...extraClients,
  ]
  const filtered = allClients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  function persist(extras: Client[], deleted: Set<string>) {
    const toSave = [
      ...extras,
      ...Array.from(deleted).map(id => ({ id: `deleted-${id}` } as Client)),
    ]
    lsSave(toSave)
  }

  async function handleAdd() {
    if (!newName.trim()) return
    setAdding(true)
    const cleanDomain = newDomain.trim().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
    const color = getColor(newName.trim())
    const newClient: Client = {
      id: `user-${Date.now()}`,
      name: newName.trim(),
      domain: cleanDomain,
      logo_url: null,
      status: 'active',
      agency_id: '1',
      color,
      created_at: new Date().toISOString(),
    }

    // Save to localStorage immediately
    const updatedExtras = [...extraClients, newClient]
    setExtraClients(updatedExtras)
    persist(updatedExtras, deletedIds)

    // Also try Supabase in background
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data } = await supabase.from('clients')
        .insert([{ name: newClient.name, domain: newClient.domain, color, status: 'active', agency_id: '1', logo_url: null }])
        .select().single()
      if (data) {
        // Replace temp client with Supabase version
        const replaced = updatedExtras.map(c => c.id === newClient.id ? { ...data } : c)
        setExtraClients(replaced)
        persist(replaced, deletedIds)
      }
    } catch {}

    setNewName(''); setNewDomain(''); setAdding(false); setShowModal(false)
  }

  function handleDelete(id: string) {
    if (id.startsWith('demo-') || id === 'group1') {
      // Mark demo client as deleted
      const newDeleted = new Set(Array.from(deletedIds).concat(id))
      setDeletedIds(newDeleted)
      persist(extraClients, newDeleted)
    } else {
      // Remove user-added client
      const newExtras = extraClients.filter(c => c.id !== id)
      setExtraClients(newExtras)
      persist(newExtras, deletedIds)
      // Also delete from Supabase in background
      import('@/lib/supabase/client').then(({ createClient }) => {
        createClient().from('clients').delete().eq('id', id).then(() => {})
      }).catch(() => {})
    }
    setMenuOpen(null)
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n })
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden', background:'#FAFAFA', fontFamily:"'DM Sans',sans-serif" }}
      onClick={()=>setMenuOpen(null)}>

      {/* Topbar */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 24px', borderBottom:'1px solid #E6E6E6', background:'#FFF', flexShrink:0 }}>
        <span style={{ fontSize:15, fontWeight:500, color:'#111' }}>Clients</span>
        <span style={{ ...label, color:'#6B6B6B', marginLeft:4 }}>— {allClients.filter(c=>!c.group).length} ACCOUNTS</span>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
          <button style={{ display:'flex', alignItems:'center', gap:6, background:'#F5F5F5', border:'1px solid #E6E6E6', borderRadius:2, padding:'6px 12px', fontSize:11, color:'#333', cursor:'pointer', fontFamily:"'Barlow',sans-serif", fontWeight:500, letterSpacing:'0.04em' }}>
            <Sparkles size={12} style={{ color:'#7c3aed' }}/> ASK AI
          </button>
          <div style={{ display:'flex', alignItems:'center', background:'#FAFAFA', border:'1px solid #E6E6E6', borderRadius:2 }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search"
              style={{ background:'transparent', border:'none', outline:'none', padding:'6px 10px', fontSize:12, color:'#333', width:140 }}/>
            <Search size={12} style={{ color:'#999', marginRight:8 }}/>
          </div>
          <button style={{ padding:'5px 7px', borderRadius:2, background:'transparent', border:'1px solid #E6E6E6', cursor:'pointer', color:'#6B6B6B', display:'flex' }}><List size={14}/></button>
          <button style={{ padding:'5px 7px', borderRadius:2, background:'#E6E6E6', border:'1px solid #E6E6E6', cursor:'pointer', color:'#111', display:'flex' }}><LayoutGrid size={14}/></button>
          <button onClick={()=>setShowModal(true)} style={{ display:'flex', alignItems:'center', gap:6, background:'#20BB71', border:'none', borderRadius:2, padding:'7px 14px', color:'#111', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:"'Barlow',sans-serif", letterSpacing:'0.06em', textTransform:'uppercase' as const }}>
            <Plus size={12}/> Add Client
          </button>
        </div>
      </div>

      {selected.size > 0 && (
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 24px', background:'#111', flexShrink:0 }}>
          <span style={{ ...label, color:'#fff' }}>{selected.size} CLIENT{selected.size>1?'S':''} SELECTED</span>
          <button onClick={()=>{Array.from(selected).forEach(id=>handleDelete(id));setSelected(new Set())}}
            style={{ background:'#F53619', border:'none', borderRadius:2, padding:'4px 10px', color:'#fff', fontSize:11, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}><Trash2 size={11}/> Delete</button>
          <button onClick={()=>setSelected(new Set())} style={{ marginLeft:'auto', background:'none', border:'none', color:'#aaa', cursor:'pointer' }}><X size={15}/></button>
        </div>
      )}

      <div style={{ padding:'8px 24px', borderBottom:'1px solid #E6E6E6', flexShrink:0 }}>
        <button style={{ display:'flex', alignItems:'center', gap:5, ...label, color:'#6B6B6B', background:'none', border:'1px dashed #ccc', borderRadius:2, padding:'4px 10px', cursor:'pointer' }}>
          <Plus size={10}/> ADD FILTER
        </button>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:24 }}>
        {/* KPI row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:24 }}>
          {KPIS.map(k => (
            <div key={k.label} style={{ background:'#FFF', border:'1px solid #E6E6E6', borderRadius:2, padding:14 }}>
              <p style={{ ...label, color:'#6B6B6B', marginBottom:8, display:'block' }}>{k.label}</p>
              <p style={{ fontSize:22, fontWeight:300, color:'#111', letterSpacing:'-0.5px', lineHeight:1 }}>{k.value}</p>
              <p style={{ ...label, color:'#20BB71', marginTop:5, display:'block' }}>{k.change}</p>
              <div style={{ height:2, background:'#E6E6E6', marginTop:10, overflow:'hidden' }}><div style={{ height:'100%', width:k.w, background:k.c }}/></div>
            </div>
          ))}
        </div>

        <p style={{ ...label, color:'#6B6B6B', marginBottom:10, display:'block' }}>ALL CLIENTS</p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:8 }}>
          {filtered.map(client => (
            <ClientCard key={client.id} client={client}
              selected={selected.has(client.id)}
              onToggle={()=>setSelected(prev=>{const n=new Set(prev);n.has(client.id)?n.delete(client.id):n.add(client.id);return n})}
              menuOpen={menuOpen===client.id}
              onMenuToggle={()=>setMenuOpen(menuOpen===client.id?null:client.id)}
              onDelete={()=>handleDelete(client.id)}/>
          ))}
          <button onClick={()=>setShowModal(true)}
            style={{ background:'#FAFAFA', border:'1px dashed #E6E6E6', borderRadius:2, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, minHeight:120, cursor:'pointer' }}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='#20BB71';(e.currentTarget as HTMLButtonElement).style.background='#C2FFE2'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='#E6E6E6';(e.currentTarget as HTMLButtonElement).style.background='#FAFAFA'}}>
            <div style={{ width:24, height:24, borderRadius:2, background:'#E6E6E6', display:'flex', alignItems:'center', justifyContent:'center', color:'#6B6B6B', fontSize:16 }}>+</div>
            <span style={{ ...label, color:'#6B6B6B' }}>ADD CLIENT</span>
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:16 }} onClick={()=>setShowModal(false)}>
          <div style={{ background:'#FFF', borderRadius:2, width:'100%', maxWidth:400, overflow:'hidden', boxShadow:'0 18px 40px rgba(0,0,0,0.12)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ height:3, background:'#20BB71' }}/>
            <div style={{ padding:28 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                <h2 style={{ fontSize:16, fontWeight:400, color:'#111', fontFamily:"'DM Sans',sans-serif" }}>Add new client</h2>
                <button onClick={()=>setShowModal(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#6B6B6B' }}><X size={14}/></button>
              </div>
              <p style={{ ...label, color:'#6B6B6B', marginBottom:24, display:'block' }}>LOGO FETCHED AUTOMATICALLY FROM DOMAIN</p>
              <div style={{ marginBottom:14 }}>
                <label style={{ ...label, color:'#6B6B6B', display:'block', marginBottom:6 }}>CLIENT NAME</label>
                <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="e.g. Atlanta Beltline"
                  onKeyDown={e=>e.key==='Enter'&&handleAdd()}
                  style={{ width:'100%', background:'#FAFAFA', border:'1px solid #E6E6E6', borderRadius:2, padding:'9px 12px', color:'#111', fontSize:13, outline:'none', boxSizing:'border-box' as const, fontFamily:"'DM Sans',sans-serif" }}/>
              </div>
              <div style={{ marginBottom:22 }}>
                <label style={{ ...label, color:'#6B6B6B', display:'block', marginBottom:6 }}>WEBSITE / DOMAIN</label>
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  <input value={newDomain} onChange={e=>setNewDomain(e.target.value)} placeholder="e.g. beltline.org"
                    onKeyDown={e=>e.key==='Enter'&&handleAdd()}
                    style={{ flex:1, background:'#FAFAFA', border:'1px solid #E6E6E6', borderRadius:2, padding:'9px 12px', color:'#111', fontSize:13, outline:'none', boxSizing:'border-box' as const, fontFamily:"'DM Sans',sans-serif" }}/>
                  {newDomain.trim() && (
                    <div style={{ width:40, height:40, borderRadius:4, border:'1px solid #E6E6E6', background:'#FAFAFA', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden' }}>
                      <img src={`https://www.google.com/s2/favicons?domain=${newDomain.trim().replace(/^https?:\/\//, '').replace(/^www\./, '')}&sz=128`} alt="logo"
                        style={{ maxWidth:36, maxHeight:36, objectFit:'contain' }}
                        onError={e=>{const img=e.currentTarget;const d=newDomain.trim().replace(/^https?:\/\//, '').replace(/^www\./, '');if(!img.dataset.fb){img.dataset.fb='1';img.src=`https://logo.clearbit.com/${d}`}else if(!img.dataset.fb2){img.dataset.fb2='1';img.src=`https://icons.duckduckgo.com/ip3/${d}.ico`}else img.style.display='none'}}
                      />
                    </div>
                  )}
                </div>
                {newDomain.trim() && <p style={{ ...label, color:'#20BB71', marginTop:6, display:'block' }}>✓ LOGO WILL BE FETCHED FROM DOMAIN</p>}
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={()=>setShowModal(false)} style={{ flex:1, background:'#FAFAFA', border:'1px solid #E6E6E6', borderRadius:2, padding:'9px', ...label, color:'#6B6B6B', cursor:'pointer' }}>CANCEL</button>
                <button onClick={handleAdd} disabled={!newName.trim()||adding}
                  style={{ flex:2, background:'#20BB71', border:'none', borderRadius:2, padding:'9px', ...label, color:'#111', cursor:'pointer', opacity:!newName.trim()||adding?0.6:1 }}>
                  {adding?'ADDING...':'ADD CLIENT'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
