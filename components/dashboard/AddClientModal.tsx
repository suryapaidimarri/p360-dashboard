'use client'
import { useState } from 'react'
import { X, ChevronDown, Loader2 } from 'lucide-react'
import { Client } from '@/types'

const COLORS = ['#20BB71','#48B5EA','#F9B62A','#F64674','#F53619','#3FDB90','#5BD1F2','#FDC550']

export default function AddClientModal({ onClose, onAdd }: { onClose:()=>void; onAdd:(c:Client)=>void }) {
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [adv, setAdv] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleAdd() {
    if (!name.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    onAdd({ id:Date.now().toString(), name:name.trim(), domain:domain.trim(), logo_url:null, color, status:'active', agency_id:'1', platforms:[], created_at:new Date().toISOString() })
    setLoading(false)
  }

  const S = {
    overlay: { position:'fixed' as const, inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:16 },
    box: { background:'#FFFFFF', border:'1px solid #E6E6E6', borderRadius:2, width:'100%', maxWidth:400, overflow:'hidden' },
    stripe: { height:3, background:'#20BB71' },
    body: { padding:28 },
    hd: { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:4 },
    title: { fontSize:16, fontWeight:400, color:'#111111', fontFamily:"'DM Sans',sans-serif", letterSpacing:'-0.2px' },
    sub: { fontFamily:"'Barlow',sans-serif", fontSize:9, color:'#6B6B6B', textTransform:'uppercase' as const, letterSpacing:'0.08em', marginBottom:24 },
    close: { width:28, height:28, borderRadius:2, border:'1px solid #E6E6E6', background:'#FAFAFA', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' },
    label: { display:'block', fontFamily:"'Barlow',sans-serif", fontSize:9, fontWeight:600, color:'#6B6B6B', textTransform:'uppercase' as const, letterSpacing:'0.1em', marginBottom:6 },
    input: { width:'100%', background:'#FAFAFA', border:'1px solid #E6E6E6', borderRadius:2, padding:'9px 12px', color:'#111111', fontSize:13, outline:'none', fontFamily:"'DM Sans',sans-serif", boxSizing:'border-box' as const },
    advBtn: { display:'flex', alignItems:'center', gap:6, fontFamily:"'Barlow',sans-serif", fontSize:9, color:'#6B6B6B', cursor:'pointer', background:'none', border:'none', textTransform:'uppercase' as const, letterSpacing:'0.08em', marginBottom:20, padding:0 },
    foot: { display:'flex', gap:8 },
    cancel: { flex:1, background:'#FAFAFA', border:'1px solid #E6E6E6', borderRadius:2, padding:'9px', fontFamily:"'Barlow',sans-serif", fontSize:9, fontWeight:600, color:'#6B6B6B', cursor:'pointer', textTransform:'uppercase' as const, letterSpacing:'0.08em' },
    add: { flex:2, background:'#20BB71', border:'none', borderRadius:2, padding:'9px', fontFamily:"'Barlow',sans-serif", fontSize:9, fontWeight:700, color:'#111111', cursor:'pointer', textTransform:'uppercase' as const, letterSpacing:'0.08em', display:'flex', alignItems:'center', justifyContent:'center', gap:6 },
  }

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.box} onClick={e => e.stopPropagation()}>
        <div style={S.stripe} />
        <div style={S.body}>
          <div style={S.hd}>
            <h2 style={S.title}>Add new client</h2>
            <button style={S.close} onClick={onClose}><X size={12} color="#6B6B6B" /></button>
          </div>
          <p style={S.sub}>Logo fetched automatically from domain</p>
          <div style={{ marginBottom:14 }}>
            <label style={S.label}>Client name</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Acme Corporation" style={S.input} />
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={S.label}>Website / Domain</label>
            <input value={domain} onChange={e=>setDomain(e.target.value)} placeholder="e.g. acmecorp.com" style={S.input} />
          </div>
          <button style={S.advBtn} onClick={()=>setAdv(!adv)}>
            <ChevronDown size={11} style={{ transform: adv?'rotate(180deg)':'none', transition:'transform 0.15s' }} />
            Advanced settings
          </button>
          {adv && (
            <div style={{ marginBottom:20 }}>
              <label style={S.label}>Brand color</label>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {COLORS.map(c => (
                  <button key={c} onClick={()=>setColor(c)} style={{ width:22, height:22, borderRadius:2, background:c, border: color===c ? '2px solid #111' : '2px solid transparent', cursor:'pointer' }} />
                ))}
              </div>
            </div>
          )}
          <div style={S.foot}>
            <button style={S.cancel} onClick={onClose}>Cancel</button>
            <button style={{ ...S.add, opacity: !name.trim()||loading ? 0.6 : 1 }} onClick={handleAdd} disabled={!name.trim()||loading}>
              {loading ? <><Loader2 size={11} style={{ animation:'spin 1s linear infinite' }} /> Adding...</> : 'Add client'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
