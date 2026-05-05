'use client'
import { useState } from 'react'
import { Plus, Search, LayoutGrid, List, Sparkles, MoreHorizontal, Copy, Trash2, X, FolderOpen } from 'lucide-react'
import Link from 'next/link'
import { Client } from '@/types'

const DEMO_CLIENTS: Client[] = [
  { id:'group1', name:'Lumistella', domain:'', logo_url:null, status:'active', agency_id:'1', group:'group', group_count:5, created_at:'' },
  { id:'1', name:'Alloy (internal)', domain:'alloy.com', logo_url:null, status:'active', agency_id:'1', created_at:'' },
  { id:'2', name:'Atlanta Beltline', domain:'beltline.org', logo_url:null, status:'active', agency_id:'1', created_at:'' },
  { id:'3', name:'Collaborating Docs', domain:'collaboratingdocs.com', logo_url:null, status:'active', agency_id:'1', created_at:'' },
  { id:'4', name:'DEMO: Grainwise Gr...', domain:'grainwise.com', logo_url:null, status:'active', agency_id:'1', created_at:'' },
  { id:'5', name:'Georgia Aquarium', domain:'georgiaaquarium.org', logo_url:null, status:'active', agency_id:'1', created_at:'' },
  { id:'6', name:'GFVGA', domain:'gfvga.org', logo_url:null, status:'active', agency_id:'1', created_at:'' },
  { id:'7', name:'HHAeXchange', domain:'hhaexchange.com', logo_url:null, status:'active', agency_id:'1', created_at:'' },
  { id:'8', name:'IOU Financial', domain:'ioufinancial.com', logo_url:null, status:'active', agency_id:'1', created_at:'' },
  { id:'9', name:'Latapult', domain:'latapult.com', logo_url:null, status:'active', agency_id:'1', created_at:'' },
  { id:'10', name:'Litmos', domain:'litmos.com', logo_url:null, status:'active', agency_id:'1', created_at:'' },
  { id:'11', name:'NCH', domain:'nchmd.org', logo_url:null, status:'active', agency_id:'1', created_at:'' },
  { id:'12', name:'S&T Bank', domain:'stbank.com', logo_url:null, status:'active', agency_id:'1', created_at:'' },
  { id:'13', name:'TPX', domain:'tpx.com', logo_url:null, status:'active', agency_id:'1', created_at:'' },
]

function ClientLogo({ client }: { client: Client }) {
  const [imgError, setImgError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  if (client.group) {
    return (
      <div style={{ width:80, height:80, borderRadius:'50%', background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
        <FolderOpen size={32} style={{ color:'#999' }} />
      </div>
    )
  }
  const logoSrc = client.domain ? `https://logo.clearbit.com/${client.domain}` : null
  if (logoSrc && !imgError) {
    return (
      <div style={{ width:80, height:80, margin:'0 auto 12px', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <img src={logoSrc} alt={client.name} onLoad={()=>setLoaded(true)} onError={()=>setImgError(true)}
          style={{ maxWidth:80, maxHeight:80, objectFit:'contain', display:loaded?'block':'none' }} />
        {!loaded && (
          <div style={{ width:80, height:80, borderRadius:8, background:'#e8e8e8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:600, color:'#888' }}>
            {client.name[0].toUpperCase()}
          </div>
        )}
      </div>
    )
  }
  return (
    <div style={{ width:80, height:80, borderRadius:8, background:'#e8e8e8', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:26, fontWeight:600, color:'#888' }}>
      {client.name[0].toUpperCase()}
    </div>
  )
}

function ClientCard({ client, selected, onToggle, menuOpen, onMenuToggle, onDelete }: {
  client: Client; selected: boolean; onToggle: ()=>void; menuOpen: boolean; onMenuToggle: ()=>void; onDelete: ()=>void
}) {
  const [hovered, setHovered] = useState(false)

  if (client.group) {
    return (
      <div style={{ position:'relative', background:'#f9f9f9', border:'1px solid #e5e5e5', borderRadius:8, padding:16, textAlign:'center', cursor:'pointer' }}
        onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
        <div style={{ position:'absolute', top:10, left:10, zIndex:2, opacity:hovered||selected?1:0, transition:'opacity 0.15s' }}
          onClick={e=>{e.preventDefault();e.stopPropagation();onToggle()}}>
          <div style={{ width:18, height:18, borderRadius:4, border:`2px solid ${selected?'#48b5ea':'#ccc'}`, background:selected?'#48b5ea':'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
            {selected && <span style={{ color:'#fff', fontSize:10, fontWeight:700 }}>✓</span>}
          </div>
        </div>
        <ClientLogo client={client} />
        <p style={{ fontSize:12, fontWeight:600, color:'#1a1a1a', marginBottom:4 }}>{client.name}</p>
        <p style={{ fontSize:11, color:'#999' }}>{client.group_count} Clients</p>
      </div>
    )
  }

  return (
    <div style={{ position:'relative' }} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
      <div style={{ position:'absolute', top:10, left:10, zIndex:2, opacity:hovered||selected?1:0, transition:'opacity 0.15s' }}
        onClick={e=>{e.preventDefault();e.stopPropagation();onToggle()}}>
        <div style={{ width:18, height:18, borderRadius:4, border:`2px solid ${selected?'#48b5ea':'#ccc'}`, background:selected?'#48b5ea':'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
          {selected && <span style={{ color:'#fff', fontSize:10, fontWeight:700 }}>✓</span>}
        </div>
      </div>
      <div style={{ position:'absolute', top:8, right:8, zIndex:2, opacity:hovered||menuOpen?1:0, transition:'opacity 0.15s' }}
        onClick={e=>{e.preventDefault();e.stopPropagation();onMenuToggle()}}>
        <button style={{ background:'rgba(255,255,255,0.95)', border:'1px solid #e5e5e5', borderRadius:6, padding:'3px 6px', cursor:'pointer', display:'flex', alignItems:'center' }}>
          <MoreHorizontal size={13} style={{ color:'#666' }} />
        </button>
        {menuOpen && (
          <div style={{ position:'absolute', right:0, top:'100%', marginTop:4, background:'#fff', border:'1px solid #e5e5e5', borderRadius:8, boxShadow:'0 4px 16px rgba(0,0,0,0.12)', padding:4, minWidth:120, zIndex:10 }}>
            <button style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'8px 12px', fontSize:13, color:'#333', background:'none', border:'none', cursor:'pointer', borderRadius:4 }}>
              <Copy size={13} /> Clone
            </button>
            <button onClick={onDelete} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'8px 12px', fontSize:13, color:'#ef4444', background:'none', border:'none', cursor:'pointer', borderRadius:4 }}>
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}
      </div>
      <Link href={`/dashboard/clients/${client.id}`} style={{ textDecoration:'none', display:'block' }}>
        <div style={{ background:'#fff', border:`2px solid ${selected?'#48b5ea':'#e5e5e5'}`, borderRadius:8, padding:16, textAlign:'center', cursor:'pointer', transition:'border-color 0.15s' }}>
          <ClientLogo client={client} />
          <p style={{ fontSize:12, fontWeight:600, color:'#1a1a1a' }}>{client.name}</p>
        </div>
      </Link>
    </div>
  )
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(DEMO_CLIENTS)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid'|'list'>('grid')
  const [menuOpen, setMenuOpen] = useState<string|null>(null)
  const [newName, setNewName] = useState('')
  const [newDomain, setNewDomain] = useState('')
  const [adding, setAdding] = useState(false)

  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  function toggleSelect(id: string) {
    setSelected(prev => { const next = new Set(prev); next.has(id)?next.delete(id):next.add(id); return next })
  }

  async function handleAdd() {
    if (!newName.trim()) return
    setAdding(true)
    await new Promise(r => setTimeout(r, 500))
    setClients(prev => [...prev, { id:Date.now().toString(), name:newName.trim(), domain:newDomain.trim(), logo_url:null, status:'active', agency_id:'1', created_at:new Date().toISOString() }])
    setNewName(''); setNewDomain(''); setAdding(false); setShowModal(false)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden', background:'#fff' }} onClick={()=>setMenuOpen(null)}>
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 24px', borderBottom:'1px solid #e5e5e5', background:'#fff', flexShrink:0 }}>
        <h1 style={{ fontSize:18, fontWeight:700, color:'#1a1a1a' }}>Clients</h1>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
          <button style={{ display:'flex', alignItems:'center', gap:6, background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#333', cursor:'pointer', fontWeight:500 }}>
            <Sparkles size={13} style={{ color:'#7c3aed' }} /> Ask AI
          </button>
          <div style={{ display:'flex', alignItems:'center', background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, overflow:'hidden' }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search"
              style={{ background:'transparent', border:'none', outline:'none', padding:'6px 10px', fontSize:12, color:'#333', width:160 }} />
            <Search size={13} style={{ color:'#999', marginRight:8 }} />
          </div>
          <button onClick={()=>setView('list')} style={{ padding:'6px 8px', borderRadius:4, background:view==='list'?'#e5e5e5':'transparent', border:'none', cursor:'pointer', color:view==='list'?'#333':'#999' }}><List size={15} /></button>
          <button onClick={()=>setView('grid')} style={{ padding:'6px 8px', borderRadius:4, background:view==='grid'?'#e5e5e5':'transparent', border:'none', cursor:'pointer', color:view==='grid'?'#333':'#999' }}><LayoutGrid size={15} /></button>
          <button onClick={()=>setShowModal(true)} style={{ display:'flex', alignItems:'center', gap:6, background:'#48b5ea', border:'none', borderRadius:6, padding:'7px 14px', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
            <Plus size={14} /> Add Client
          </button>
        </div>
      </div>

      {selected.size > 0 && (
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 24px', background:'#1a1a1a', color:'#fff', fontSize:13 }}>
          <span>{selected.size} client{selected.size>1?'s':''} selected</span>
          <button style={{ background:'#333', border:'none', borderRadius:4, padding:'4px 10px', color:'#fff', fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}><Copy size={12} /></button>
          <button onClick={()=>{setClients(prev=>prev.filter(c=>!selected.has(c.id)));setSelected(new Set())}} style={{ background:'#ef4444', border:'none', borderRadius:4, padding:'4px 10px', color:'#fff', fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}><Trash2 size={12} /></button>
          <button onClick={()=>setSelected(new Set())} style={{ marginLeft:'auto', background:'none', border:'none', color:'#aaa', cursor:'pointer' }}><X size={16} /></button>
        </div>
      )}

      <div style={{ padding:'8px 24px', borderBottom:'1px solid #f0f0f0', flexShrink:0 }}>
        <button style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#666', background:'none', border:'1px dashed #ccc', borderRadius:6, padding:'5px 10px', cursor:'pointer' }}>
          <Plus size={11} /> Add Filter
        </button>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:24 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:12 }}>
          {filtered.map(client => (
            <ClientCard key={client.id} client={client} selected={selected.has(client.id)}
              onToggle={()=>toggleSelect(client.id)} menuOpen={menuOpen===client.id}
              onMenuToggle={()=>setMenuOpen(menuOpen===client.id?null:client.id)}
              onDelete={()=>{setClients(prev=>prev.filter(c=>c.id!==client.id));setMenuOpen(null)}} />
          ))}
        </div>
      </div>

      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:16 }} onClick={()=>setShowModal(false)}>
          <div style={{ background:'#fff', borderRadius:12, width:'100%', maxWidth:420, overflow:'hidden' }} onClick={e=>e.stopPropagation()}>
            <div style={{ height:3, background:'#48b5ea' }} />
            <div style={{ padding:28 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                <h2 style={{ fontSize:16, fontWeight:700, color:'#1a1a1a' }}>Add Client</h2>
                <button onClick={()=>setShowModal(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#999' }}><X size={16} /></button>
              </div>
              <p style={{ fontSize:12, color:'#999', marginBottom:20 }}>Logo is fetched automatically from the domain.</p>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#666', textTransform:'uppercase' as const, letterSpacing:'0.05em', marginBottom:6 }}>Client Name</label>
                <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="e.g. Atlanta Beltline"
                  style={{ width:'100%', background:'#fafafa', border:'1px solid #e5e5e5', borderRadius:6, padding:'9px 12px', color:'#1a1a1a', fontSize:13, outline:'none', boxSizing:'border-box' as const }} />
              </div>
              <div style={{ marginBottom:24 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#666', textTransform:'uppercase' as const, letterSpacing:'0.05em', marginBottom:6 }}>Website / Domain</label>
                <input value={newDomain} onChange={e=>setNewDomain(e.target.value)} placeholder="e.g. beltline.org"
                  style={{ width:'100%', background:'#fafafa', border:'1px solid #e5e5e5', borderRadius:6, padding:'9px 12px', color:'#1a1a1a', fontSize:13, outline:'none', boxSizing:'border-box' as const }} />
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={()=>setShowModal(false)} style={{ flex:1, background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'9px', fontSize:13, color:'#666', cursor:'pointer' }}>Cancel</button>
                <button onClick={handleAdd} disabled={!newName.trim()||adding} style={{ flex:2, background:'#48b5ea', border:'none', borderRadius:6, padding:'9px', fontSize:13, fontWeight:600, color:'#fff', cursor:'pointer', opacity:!newName.trim()||adding?0.6:1 }}>
                  {adding?'Adding...':'Add Client'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
