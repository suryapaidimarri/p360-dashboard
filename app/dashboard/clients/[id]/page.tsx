'use client'
import { useState } from 'react'
import { ChevronRight, Sparkles, Settings, Calendar, Share2, Edit, Plus, MoreHorizontal, Search, ChevronDown, ChevronRight as CR, Maximize2 } from 'lucide-react'
import Link from 'next/link'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

const DASHBOARDS = ['Website Performance', 'Paid Media', 'Organic + AI Search', 'Donations Trend', 'oiijuyuh']
const DATA_SOURCES = [
  { label:'SEO', children:[] },
  { label:'Analytics', children:[] },
  { label:'Social', children:[] },
  { label:'Paid Ads', children:[] },
]
const TABS = ['Dashboards', 'Reports', 'Data Sources', 'Goals', 'Client Portal', 'Benchmarks', 'More']

const SESSIONS_DATA = [
  {d:'1 Apr',v:8000},{d:'6 Apr',v:19000},{d:'13 Apr',v:10000},{d:'20 Apr',v:11000},{d:'27 Apr',v:8000},
  {d:'4 May',v:7000},{d:'11 May',v:7500},{d:'18 May',v:8000},{d:'25 May',v:7000},
]
const DEVICE_DATA = [
  {name:'Mobile',v:56564},{name:'Desktop',v:31740},{name:'Tablet',v:785},
]
const DONUT_DATA = [
  {name:'Organic Search',value:68639,color:'#2196f3'},
  {name:'Direct',value:30294,color:'#64b5f6'},
  {name:'Paid Social',value:8288,color:'#90caf9'},
  {name:'Organic Social',value:6570,color:'#bbdefb'},
  {name:'Referral',value:4379,color:'#e3f2fd'},
]
const CITIES = [
  {city:'Atlanta',val:25348,pct:92},{city:'(not set)',val:7210,pct:26},
  {city:'Singapore',val:1689,pct:6},{city:'Marietta',val:1558,pct:6},{city:'New York',val:1380,pct:5},
]
const TOP_PAGES = [
  {page:'/_beltline-business-locations/irwin/',views:1,eng:'100.00%'},
  {page:'/_beltline-businesses/glacier-s-italian-ice/',views:3,eng:'100.00%'},
  {page:'/_business-districts/buckhead/',views:2,eng:'100.00%'},
  {page:'/_business-districts/old-fourth-ward-o4w-/',views:5,eng:'100.00%'},
]
const CHANNEL_DATA = [
  {source:'google / organic',users:37961,change:'+13%'},
  {source:'(direct) / (none)',users:23581,change:'+56%'},
  {source:'ig / paid',users:5286,change:'+176100%'},
  {source:'google / cpc',users:2574,change:'+210%'},
]
const VIEWS_DATA = [
  {d:'6 Apr',v:18000},{d:'13 Apr',v:9000},{d:'20 Apr',v:8000},{d:'27 Apr',v:11000},
  {d:'4 May',v:7000},{d:'11 May',v:8000},{d:'18 May',v:7500},{d:'25 May',v:8000},
]

const KPI_COLORS = {
  white: { bg:'#fff', border:'#e5e5e5', text:'#1a1a1a', sub:'#666' },
  blue:  { bg:'#48b5ea', border:'#48b5ea', text:'#fff', sub:'rgba(255,255,255,0.8)' },
  green: { bg:'#4caf82', border:'#4caf82', text:'#fff', sub:'rgba(255,255,255,0.8)' },
  red:   { bg:'#ef5350', border:'#ef5350', text:'#fff', sub:'rgba(255,255,255,0.8)' },
}

function KPICard({ label, value, change, up, color }: { label:string; value:string; change:string; up:boolean; color:keyof typeof KPI_COLORS }) {
  const c = KPI_COLORS[color]
  return (
    <div style={{ background:c.bg, border:`1px solid ${c.border}`, borderRadius:8, padding:16, minHeight:120, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <span style={{ fontSize:12, color:c.sub, fontWeight:500 }}>{label}</span>
        <span style={{ fontSize:10, fontWeight:700, color: color==='white' ? (up?'#22c55e':'#ef4444') : 'rgba(255,255,255,0.9)', background: color==='white' ? (up?'#f0fdf4':'#fef2f2') : 'rgba(255,255,255,0.15)', padding:'2px 6px', borderRadius:4 }}>
          {up ? '▲' : '▼'} {change}
        </span>
      </div>
      <p style={{ fontSize:28, fontWeight:700, color:c.text, letterSpacing:'-0.5px', lineHeight:1, marginTop:8 }}>{value}</p>
    </div>
  )
}

export default function ClientWorkspace({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('Dashboards')
  const [activeDash, setActiveDash] = useState('Website Performance')
  const [openSources, setOpenSources] = useState<Set<string>>(new Set())

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden', background:'#fff' }}>
      {/* Top nav */}
      <div style={{ padding:'12px 24px', borderBottom:'1px solid #e5e5e5', background:'#fff', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <Link href="/dashboard/clients" style={{ fontSize:13, color:'#666', textDecoration:'none', fontWeight:500 }}>Clients</Link>
          <ChevronRight size={14} style={{ color:'#ccc' }} />
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:22, height:22, borderRadius:'50%', overflow:'hidden', background:'#f0f0f0', flexShrink:0 }}>
              <img src="https://logo.clearbit.com/beltline.org" alt="" style={{ width:'100%', height:'100%', objectFit:'contain' }} onError={e=>(e.currentTarget.style.display='none')} />
            </div>
            <span style={{ fontSize:14, fontWeight:700, color:'#1a1a1a' }}>Atlanta Beltline</span>
            <ChevronDown size={14} style={{ color:'#999' }} />
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
            <button style={{ display:'flex', alignItems:'center', gap:6, background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#333', cursor:'pointer', fontWeight:500 }}>
              <Sparkles size={13} style={{ color:'#7c3aed' }} /> Ask AI
            </button>
            <button style={{ display:'flex', alignItems:'center', gap:6, background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#333', cursor:'pointer' }}>
              <Settings size={13} /> Settings
            </button>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:0, borderBottom:'none' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={()=>setActiveTab(tab)} style={{
              padding:'8px 14px', fontSize:13, fontWeight:500, cursor:'pointer', background:'none', border:'none',
              color: activeTab===tab ? '#1a85c8' : '#666',
              borderBottom: activeTab===tab ? '2px solid #48b5ea' : '2px solid transparent',
            }}>{tab}</button>
          ))}
          <div style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center' }}>
            <button style={{ display:'flex', alignItems:'center', gap:6, background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#333', cursor:'pointer' }}>
              <Calendar size={12} /> Apr 1, 2026 - Apr 30, 2026 <ChevronDown size={11} />
            </button>
            <button style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#333', cursor:'pointer', fontWeight:500 }}>Share</button>
            <button style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 8px', fontSize:12, color:'#333', cursor:'pointer' }}><Maximize2 size={13}/></button>
            <button style={{ background:'#48b5ea', border:'none', borderRadius:6, padding:'6px 14px', fontSize:12, color:'#fff', cursor:'pointer', fontWeight:600 }}>
              Edit My Dashboards
            </button>
          </div>
        </div>
      </div>

      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        {/* Left panel */}
        <div style={{ width:220, minWidth:220, borderRight:'1px solid #e5e5e5', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <div style={{ padding:12 }}>
            <button style={{ width:'100%', display:'flex', alignItems:'center', gap:6, background:'#48b5ea', border:'none', borderRadius:6, padding:'8px 12px', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>
              <Plus size={13} /> Add Dashboard
            </button>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {DASHBOARDS.map(d => (
              <button key={d} onClick={()=>setActiveDash(d)} style={{
                width:'100%', textAlign:'left', padding:'9px 16px', fontSize:13, cursor:'pointer', background:'none', border:'none',
                fontWeight: activeDash===d ? 700 : 400,
                color: activeDash===d ? '#1a1a1a' : '#555',
                borderLeft: activeDash===d ? '3px solid #48b5ea' : '3px solid transparent',
              }}>{d}</button>
            ))}
            <div style={{ padding:'12px 16px 4px' }}>
              <p style={{ fontSize:10, fontWeight:600, color:'#999', textTransform:'uppercase', letterSpacing:'0.06em' }}>DATA SOURCES</p>
            </div>
            {DATA_SOURCES.map(s => (
              <button key={s.label} onClick={()=>setOpenSources(prev=>{const n=new Set(prev);n.has(s.label)?n.delete(s.label):n.add(s.label);return n})}
                style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:8, padding:'8px 16px', fontSize:13, cursor:'pointer', background:'none', border:'none', color:'#555' }}>
                <CR size={12} style={{ transform:openSources.has(s.label)?'rotate(90deg)':'none', transition:'transform 0.15s', color:'#999' }} />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard content */}
        <div style={{ flex:1, overflowY:'auto', background:'#f8f9fa' }}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid #e5e5e5', background:'#fff', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:18, height:18, borderRadius:3, border:'2px solid #333' }} />
            <span style={{ fontSize:15, fontWeight:700, color:'#1a1a1a' }}>{activeDash}</span>
          </div>

          {activeDash === 'Website Performance' && (
            <div style={{ padding:16 }}>
              {/* Header banner */}
              <div style={{ background:'#48b5ea', borderRadius:8, padding:'20px 24px', marginBottom:16 }}>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#fff' }}>Website Performance</h2>
              </div>

              {/* KPI row 1 */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:12 }}>
                <KPICard label="Total Sessions" value="120.5 K" change="29%" up={true} color="white" />
                <KPICard label="Total Conversions" value="3,610" change="16%" up={false} color="blue" />
                <KPICard label="Referring Domains" value="6,961" change="" up={true} color="white" />
                <KPICard label="Engagement Rate" value="60.77%" change="3.97%" up={false} color="green" />
              </div>

              {/* KPI row 2 */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:12 }}>
                {/* Sessions mini chart */}
                <div style={{ background:'#fff', border:'1px solid #e5e5e5', borderRadius:8, padding:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontSize:12, color:'#666', fontWeight:500 }}>Total Sessions</span>
                    <span style={{ fontSize:10, fontWeight:700, color:'#22c55e', background:'#f0fdf4', padding:'2px 6px', borderRadius:4 }}>▲ 29%</span>
                  </div>
                  <ResponsiveContainer width="100%" height={80}>
                    <LineChart data={SESSIONS_DATA}>
                      <Line type="monotone" dataKey="v" stroke="#48b5ea" strokeWidth={2} dot={false} />
                      <Tooltip contentStyle={{ fontSize:11, borderRadius:6 }} formatter={(v:number)=>[v.toLocaleString(),'Sessions']} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {/* Domain Authority donut */}
                <div style={{ background:'#fff', border:'1px solid #e5e5e5', borderRadius:8, padding:16, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:12, color:'#666', fontWeight:500, marginBottom:8, alignSelf:'flex-start' }}>Domain Authority</span>
                  <div style={{ position:'relative', width:90, height:90 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[{v:44},{v:56}]} cx="50%" cy="50%" innerRadius={30} outerRadius={42} dataKey="v" startAngle={90} endAngle={-270}>
                          <Cell fill="#f9b62a" />
                          <Cell fill="#e5e5e5" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontSize:18, fontWeight:700, color:'#1a1a1a' }}>44</span>
                    </div>
                  </div>
                </div>
                {/* Conversion rate + Bounce rate */}
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  <div style={{ background:'#fff', border:'1px solid #e5e5e5', borderRadius:8, padding:14, flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                      <span style={{ fontSize:12, color:'#666', fontWeight:500 }}>Conversion Rate</span>
                      <span style={{ fontSize:10, fontWeight:700, color:'#ef4444', background:'#fef2f2', padding:'2px 5px', borderRadius:4 }}>▼ 34%</span>
                    </div>
                    <span style={{ fontSize:24, fontWeight:700, color:'#1a1a1a' }}>3%</span>
                  </div>
                  <KPICard label="Bounce Rate" value="39.23%" change="6.84%" up={true} color="red" />
                </div>
              </div>

              {/* Bottom charts row */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:12 }}>
                {/* Users by device */}
                <div style={{ background:'#fff', border:'1px solid #e5e5e5', borderRadius:8, padding:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                    <span style={{ fontSize:12, color:'#333', fontWeight:600 }}>Users By Device</span>
                    <span style={{ fontSize:11, color:'#666' }}>88,957 <span style={{ color:'#22c55e', fontWeight:700 }}>▲ 42%</span></span>
                  </div>
                  <ResponsiveContainer width="100%" height={130}>
                    <BarChart data={DEVICE_DATA} barSize={28}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize:10, fill:'#999' }} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ fontSize:11, borderRadius:6 }} formatter={(v:number)=>[v.toLocaleString(),'']} />
                      <Bar dataKey="v" fill="#48b5ea" radius={[3,3,0,0]}>
                        {DEVICE_DATA.map((e,i)=><Cell key={i} fill={i===0?'#2196f3':i===1?'#42a5f5':'#90caf9'}/>)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Top referral sources donut */}
                <div style={{ background:'#fff', border:'1px solid #e5e5e5', borderRadius:8, padding:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontSize:12, color:'#333', fontWeight:600 }}>Top Referral Sources</span>
                    <span style={{ fontSize:11, color:'#22c55e', fontWeight:700 }}>▲ 29%</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ position:'relative', width:100, height:100, flexShrink:0 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={DONUT_DATA} cx="50%" cy="50%" innerRadius={32} outerRadius={46} dataKey="value">
                            {DONUT_DATA.map((e,i)=><Cell key={i} fill={e.color}/>)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                        <span style={{ fontSize:13, fontWeight:700, color:'#1a1a1a' }}>120.5K</span>
                        <span style={{ fontSize:9, color:'#999' }}>Sessions</span>
                      </div>
                    </div>
                    <div style={{ flex:1 }}>
                      {DONUT_DATA.slice(0,4).map(d=>(
                        <div key={d.name} style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4 }}>
                          <div style={{ width:8, height:8, borderRadius:'50%', background:d.color, flexShrink:0 }}/>
                          <span style={{ fontSize:10, color:'#666', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.name}</span>
                          <span style={{ fontSize:10, fontWeight:600, color:'#333' }}>{d.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Traffic by cities */}
                <div style={{ background:'#fff', border:'1px solid #e5e5e5', borderRadius:8, padding:16 }}>
                  <span style={{ fontSize:12, color:'#333', fontWeight:600, display:'block', marginBottom:12 }}>Traffic by Cities</span>
                  {CITIES.map(c=>(
                    <div key={c.city} style={{ marginBottom:10 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                        <span style={{ fontSize:12, color:'#333' }}>{c.city}</span>
                        <span style={{ fontSize:12, fontWeight:600, color:'#1a1a1a' }}>{c.val.toLocaleString()}</span>
                      </div>
                      <div style={{ height:4, background:'#e5e5e5', borderRadius:2, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${c.pct}%`, background:'#4caf82', borderRadius:2 }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Search traffic */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:12 }}>
                <KPICard label="AI Search Traffic" value="667" change="70%" up={true} color="green" />
                {/* Top Blog Content */}
                <div style={{ background:'#fff', border:'1px solid #e5e5e5', borderRadius:8, padding:16, gridColumn:'span 2' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                    <span style={{ fontSize:12, color:'#333', fontWeight:600 }}>Top Blog Content</span>
                    <div style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:4, padding:'4px 8px', display:'flex', alignItems:'center', gap:4 }}>
                      <Search size={11} style={{ color:'#999' }} />
                    </div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'0 0 6px', borderBottom:'1px solid #f0f0f0', marginBottom:4 }}>
                    <span style={{ fontSize:11, fontWeight:600, color:'#999', textTransform:'uppercase', letterSpacing:'0.05em' }}>Page</span>
                    <span style={{ fontSize:11, fontWeight:600, color:'#999', textTransform:'uppercase', letterSpacing:'0.05em' }}>Views</span>
                  </div>
                  {[
                    {page:'/blog/atlanta-beltline-design-and-construc...',v:2759,c:'+100%'},
                    {page:'/blog/',v:2701,c:'+56%'},
                  ].map(r=>(
                    <div key={r.page} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #f5f5f5' }}>
                      <span style={{ fontSize:11, color:'#333', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginRight:12 }}>{r.page}</span>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <div style={{ fontSize:12, fontWeight:600, color:'#1a1a1a' }}>{r.v.toLocaleString()}</div>
                        <div style={{ fontSize:10, color:'#22c55e', fontWeight:600 }}>{r.c}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Website Views area chart */}
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:12, marginBottom:12 }}>
                <div style={{ background:'#fff', border:'1px solid #e5e5e5', borderRadius:8, padding:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                    <span style={{ fontSize:12, color:'#333', fontWeight:600 }}>Website Views</span>
                    <span style={{ fontSize:11, color:'#333' }}>243 K <span style={{ color:'#22c55e', fontWeight:700 }}>▲ 18%</span></span>
                  </div>
                  <ResponsiveContainer width="100%" height={140}>
                    <AreaChart data={VIEWS_DATA}>
                      <defs>
                        <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#48b5ea" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#48b5ea" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:10, fill:'#999' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize:10, fill:'#999' }} />
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <Tooltip contentStyle={{ fontSize:11, borderRadius:6 }} />
                      <Area type="monotone" dataKey="v" stroke="#48b5ea" fill="url(#vg)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Top pages table */}
                <div style={{ background:'#fff', border:'1px solid #e5e5e5', borderRadius:8, padding:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                    <span style={{ fontSize:12, color:'#333', fontWeight:600 }}>Top Pages</span>
                    <MoreHorizontal size={14} style={{ color:'#999', cursor:'pointer' }} />
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:4, fontSize:10, fontWeight:600, color:'#999', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6 }}>
                    <span>Page</span><span>Views</span><span>Eng Rate</span>
                  </div>
                  {TOP_PAGES.map(r=>(
                    <div key={r.page} style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:4, padding:'5px 0', borderBottom:'1px solid #f5f5f5' }}>
                      <span style={{ fontSize:10, color:'#333', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.page}</span>
                      <span style={{ fontSize:10, color:'#333', fontWeight:600 }}>{r.views}</span>
                      <span style={{ fontSize:10, color:'#22c55e', fontWeight:600 }}>{r.eng}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traffic by channel */}
              <div style={{ background:'#fff', border:'1px solid #e5e5e5', borderRadius:8, padding:16, marginBottom:12 }}>
                <span style={{ fontSize:12, color:'#333', fontWeight:600, display:'block', marginBottom:12 }}>Traffic By Channel</span>
                <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', fontSize:11, fontWeight:600, color:'#999', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:8 }}>
                  <span>Session Source / Medium</span><span style={{ textAlign:'right' }}>New Users</span><span></span>
                </div>
                {CHANNEL_DATA.map(r=>(
                  <div key={r.source} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', padding:'10px 0', borderBottom:'1px solid #f5f5f5', alignItems:'center' }}>
                    <span style={{ fontSize:12, color:'#333' }}>{r.source}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:'#1a1a1a', textAlign:'right' }}>{r.users.toLocaleString()}</span>
                    <span style={{ fontSize:11, fontWeight:700, color:'#22c55e', textAlign:'right' }}>{r.change}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeDash !== 'Website Performance' && (
            <div style={{ padding:40, textAlign:'center', color:'#999' }}>
              <p style={{ fontSize:14 }}>Select a dashboard from the left panel</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
