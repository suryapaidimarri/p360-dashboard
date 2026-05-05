'use client'
import { useState } from 'react'
import { Plus, CheckCircle2, XCircle } from 'lucide-react'

const SOURCES = [
  {name:'Google Analytics 4',type:'Analytics',account:'Agency Main',id:'UA-29384710',clients:48,connected:true,color:'#F9B62A'},
  {name:'Google Ads',type:'Advertising',account:'P360 Ads',id:'ADS-7741029',clients:32,connected:true,color:'#48B5EA'},
  {name:'Google Search Console',type:'SEO',account:'Agency GSC',id:'GSC-1029384',clients:55,connected:true,color:'#20BB71'},
  {name:'Facebook Ads',type:'Advertising',account:'P360 Meta',id:'FB-88291047',clients:29,connected:true,color:'#48B5EA'},
  {name:'LinkedIn Ads',type:'Advertising',account:'P360 LinkedIn',id:'LI-99102847',clients:18,connected:true,color:'#48B5EA'},
  {name:'Semrush',type:'SEO',account:'Agency Pro',id:'SEM-4728190',clients:40,connected:false,color:'#F53619'},
  {name:'StackAdapt',type:'Programmatic',account:'P360 SA',id:'SA-1827364',clients:12,connected:true,color:'#F64674'},
  {name:'YouTube',type:'Social',account:'Agency YT',id:'YT-0928374',clients:22,connected:true,color:'#F53619'},
  {name:'Bing Webmaster',type:'SEO',account:'P360 Bing',id:'BW-3847291',clients:14,connected:true,color:'#48B5EA'},
]

const label9 = { fontFamily:"'Barlow',sans-serif", fontSize:9, fontWeight:600, color:'#6B6B6B', textTransform:'uppercase' as const, letterSpacing:'0.1em' }

export default function DataSourcesPage() {
  const [sources, setSources] = useState(SOURCES)
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 24px', borderBottom:'1px solid #E6E6E6', background:'#FFFFFF', flexShrink:0 }}>
        <span style={{ fontSize:14, fontWeight:500, color:'#111111', fontFamily:"'DM Sans',sans-serif" }}>Data Sources</span>
        <span style={{ ...label9, marginLeft:4 }}>— {sources.filter(s=>s.connected).length} connected</span>
        <button style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6, background:'#20BB71', border:'none', color:'#111111', fontSize:9, fontWeight:700, fontFamily:"'Barlow',sans-serif", letterSpacing:'0.08em', textTransform:'uppercase', padding:'7px 14px', borderRadius:2, cursor:'pointer' }}>
          <Plus size={11} /> Connect Source
        </button>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>
        <div style={{ background:'#FFFFFF', border:'1px solid #E6E6E6', borderRadius:2, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr style={{ borderBottom:'1px solid #E6E6E6' }}>
                {['Integration','Type','Account','Account ID','Clients','Status',''].map(h => (
                  <th key={h} style={{ ...label9, textAlign:'left', padding:'10px 16px', fontWeight:600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sources.map(s => (
                <tr key={s.id} style={{ borderBottom:'1px solid #E6E6E6' }}>
                  <td style={{ padding:'11px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:28, height:28, borderRadius:2, background:s.color+'22', border:`1px solid ${s.color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Barlow',sans-serif", fontSize:10, fontWeight:700, color:s.color }}>{s.name[0]}</div>
                      <span style={{ fontSize:12, fontWeight:500, color:'#111111', fontFamily:"'DM Sans',sans-serif" }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:'11px 16px', ...label9 }}>{s.type}</td>
                  <td style={{ padding:'11px 16px', fontSize:12, color:'#2A2A2A', fontFamily:"'DM Sans',sans-serif" }}>{s.account}</td>
                  <td style={{ padding:'11px 16px', fontFamily:"'Barlow',sans-serif", fontSize:9, color:'#6B6B6B', letterSpacing:'0.04em' }}>{s.id}</td>
                  <td style={{ padding:'11px 16px', fontSize:12, color:'#2A2A2A', fontFamily:"'DM Sans',sans-serif" }}>{s.clients}</td>
                  <td style={{ padding:'11px 16px' }}>
                    {s.connected
                      ? <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:'#C2FFE2', color:'#111', fontFamily:"'Barlow',sans-serif", fontSize:9, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', padding:'3px 8px', borderRadius:999 }}><CheckCircle2 size={9}/>Connected</span>
                      : <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:'#E6E6E6', color:'#6B6B6B', fontFamily:"'Barlow',sans-serif", fontSize:9, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', padding:'3px 8px', borderRadius:999 }}><XCircle size={9}/>Disconnected</span>
                    }
                  </td>
                  <td style={{ padding:'11px 16px', textAlign:'right' }}>
                    <button onClick={()=>setSources(p=>p.map(x=>x.id===s.id?{...x,connected:!x.connected}:x))}
                      style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', padding:'4px 10px', borderRadius:2, border:'1px solid #E6E6E6', background:'#FAFAFA', color:'#6B6B6B', cursor:'pointer' }}>
                      {s.connected?'Manage':'Connect'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
