'use client'
import { useState } from 'react'
import { ArrowLeft, Share2, Plus, Calendar } from 'lucide-react'
import Link from 'next/link'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const DATA = [
  {m:'Jan',v:38000},{m:'Feb',v:52000},{m:'Mar',v:45000},{m:'Apr',v:68000},
  {m:'May',v:74000},{m:'Jun',v:61000},{m:'Jul',v:79000},{m:'Aug',v:84200},
]
const TRAFFIC = [
  {name:'Organic',value:45,color:'#20BB71'},
  {name:'Paid',value:25,color:'#48B5EA'},
  {name:'Social',value:15,color:'#F9B62A'},
  {name:'Direct',value:15,color:'#E6E6E6'},
]
const KPIS = [
  {label:'Sessions',value:'84.2K',change:'+12.4%'},
  {label:'Conversions',value:'3,841',change:'+8.1%'},
  {label:'Engagement',value:'64.3%',change:'+3.2%'},
  {label:'Bounce Rate',value:'38.1%',change:'-1.8%',warn:true},
]
const TABS = ['Overview','SEO','Paid Ads','Social','Reports']

const label9 = { fontFamily:"'Barlow',sans-serif", fontSize:9, fontWeight:600, color:'#6B6B6B', textTransform:'uppercase' as const, letterSpacing:'0.1em' }

export default function ClientWorkspace({ params }: { params: { id: string } }) {
  const [tab, setTab] = useState('Overview')
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 24px', borderBottom:'1px solid #E6E6E6', background:'#FFFFFF', flexShrink:0, flexWrap:'wrap' }}>
        <Link href="/dashboard/clients" style={{ display:'flex', alignItems:'center', gap:6, fontSize:9, fontFamily:"'Barlow',sans-serif", fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'#6B6B6B', background:'#FAFAFA', border:'1px solid #E6E6E6', borderRadius:2, padding:'5px 10px', textDecoration:'none' }}>
          <ArrowLeft size={10} /> Back
        </Link>
        <div style={{ width:24, height:24, borderRadius:2, background:'#C2FFE2', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Barlow',sans-serif", fontSize:9, fontWeight:700, color:'#111' }}>AC</div>
        <span style={{ fontSize:13, fontWeight:500, color:'#111111', fontFamily:"'DM Sans',sans-serif" }}>Acme Corp</span>
        <div style={{ display:'flex', gap:1, background:'#FAFAFA', border:'1px solid #E6E6E6', borderRadius:2, padding:2, marginLeft:8 }}>
          {TABS.map(t => (
            <button key={t} onClick={()=>setTab(t)} style={{ padding:'5px 12px', borderRadius:2, fontSize:9, fontFamily:"'Barlow',sans-serif", fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', border:'none', background: tab===t?'#20BB71':'transparent', color: tab===t?'#111':'#6B6B6B', cursor:'pointer' }}>{t}</button>
          ))}
        </div>
        <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
          <button style={{ display:'flex', alignItems:'center', gap:6, fontSize:9, fontFamily:"'Barlow',sans-serif", fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:'#6B6B6B', background:'#FAFAFA', border:'1px solid #E6E6E6', borderRadius:2, padding:'6px 12px', cursor:'pointer' }}>
            <Calendar size={10} /> 30 days
          </button>
          <button style={{ display:'flex', alignItems:'center', gap:6, fontSize:9, fontFamily:"'Barlow',sans-serif", fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:'#111', background:'#20BB71', border:'none', borderRadius:2, padding:'6px 12px', cursor:'pointer' }}>
            <Share2 size={10} /> Share
          </button>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:20 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 }}>
          {KPIS.map(k => (
            <div key={k.label} style={{ background:'#FFFFFF', border:'1px solid #E6E6E6', borderRadius:2, padding:14 }}>
              <p style={{ ...label9, marginBottom:8 }}>{k.label}</p>
              <p style={{ fontSize:22, fontWeight:300, color: k.warn?'#F53619':'#111111', letterSpacing:'-0.5px', lineHeight:1 }}>{k.value}</p>
              <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, fontWeight:600, color:'#20BB71', marginTop:4 }}>{k.change}</p>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:10, marginBottom:10 }}>
          <div style={{ background:'#FFFFFF', border:'1px solid #E6E6E6', borderRadius:2, padding:16 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <span style={label9}>Sessions over time</span>
              <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:'#6B6B6B', background:'#FAFAFA', border:'1px solid #E6E6E6', borderRadius:2, padding:'2px 8px', letterSpacing:'0.06em' }}>30D</span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={DATA} barSize={18}>
                <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill:'#6B6B6B', fontSize:9, fontFamily:'Barlow' }} />
                <YAxis hide />
                <Tooltip contentStyle={{ background:'#FFFFFF', border:'1px solid #E6E6E6', borderRadius:2, fontSize:11, fontFamily:'DM Sans' }} itemStyle={{ color:'#111' }} formatter={(v:number) => [v.toLocaleString(),'Sessions']} />
                <Bar dataKey="v" fill="#20BB71" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background:'#FFFFFF', border:'1px solid #E6E6E6', borderRadius:2, padding:16 }}>
            <span style={{ ...label9, display:'block', marginBottom:12 }}>Traffic Sources</span>
            <ResponsiveContainer width="100%" height={80}>
              <PieChart>
                <Pie data={TRAFFIC} cx="50%" cy="50%" innerRadius={22} outerRadius={36} dataKey="value" paddingAngle={2}>
                  {TRAFFIC.map((e,i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:5 }}>
              {TRAFFIC.map(t => (
                <div key={t.name} style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:t.color, flexShrink:0 }} />
                  <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:'#6B6B6B', flex:1, textTransform:'uppercase', letterSpacing:'0.06em' }}>{t.name}</span>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#111', fontWeight:500 }}>{t.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:10 }}>
          <div style={{ background:'#FFFFFF', border:'1px solid #E6E6E6', borderRadius:2, padding:16 }}>
            <span style={{ ...label9, display:'block', marginBottom:14 }}>Conversion trend</span>
            <ResponsiveContainer width="100%" height={90}>
              <LineChart data={DATA}>
                <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill:'#6B6B6B', fontSize:9, fontFamily:'Barlow' }} />
                <YAxis hide />
                <Tooltip contentStyle={{ background:'#FFFFFF', border:'1px solid #E6E6E6', borderRadius:2, fontSize:11 }} itemStyle={{ color:'#111' }} />
                <Line type="monotone" dataKey="v" stroke="#20BB71" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background:'#FFFFFF', border:'1px solid #E6E6E6', borderRadius:2, padding:16 }}>
            <span style={{ ...label9, display:'block', marginBottom:14 }}>Devices</span>
            {[['Desktop',58,'#20BB71'],['Mobile',34,'#48B5EA'],['Tablet',8,'#F9B62A']].map(([l,p,c]) => (
              <div key={l as string} style={{ marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:'#6B6B6B', textTransform:'uppercase', letterSpacing:'0.06em' }}>{l}</span>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#111', fontWeight:500 }}>{p}%</span>
                </div>
                <div style={{ height:2, background:'#E6E6E6', borderRadius:0, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${p}%`, background:c as string }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
