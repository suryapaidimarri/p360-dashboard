'use client'
import { useState } from 'react'
import { ChevronRight, Sparkles, Settings, Calendar, Share2, ChevronDown, Plus, MoreHorizontal, Search, Maximize2, Edit2, Copy, Trash2, Monitor, Smartphone, RotateCcw, RotateCw, X, Grip } from 'lucide-react'
import Link from 'next/link'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const DASHBOARDS = ['Website Performance','Paid Media','Organic + AI Search','Donations Trend','oiijuyuh']
const DATA_SOURCES = ['SEO','Analytics','Social','Paid Ads']
const TABS = ['Dashboards','Reports','Data Sources','Goals','Client Portal','Benchmarks','More']
const RIGHT_PANEL = [
  { icon:'✦', label:'Build with AI' },
  { icon:'⊞', label:'Integrations Metrics' },
  { icon:'Aa', label:'Content Blocks' },
  { icon:'🖼', label:'Media' },
  { icon:'⊕', label:'Custom Metrics' },
  { icon:'⚖', label:'Benchmarks' },
  { icon:'◎', label:'Goals' },
]

const SESSIONS = [{d:'1A',v:8000},{d:'6A',v:19000},{d:'13A',v:10000},{d:'20A',v:11000},{d:'27A',v:7000},{d:'4M',v:7000},{d:'11M',v:7500},{d:'18M',v:8000},{d:'25M',v:7000}]
const DEVICES = [{name:'Mobile',v:56564},{name:'Desktop',v:31740},{name:'Tablet',v:785}]
const DONUT = [{name:'Organic Search',value:68639,color:'#2196f3'},{name:'Direct',value:30294,color:'#64b5f6'},{name:'Paid Social',value:8288,color:'#90caf9'},{name:'Organic Social',value:6570,color:'#bbdefb'},{name:'Referral',value:4379,color:'#e3f2fd'}]
const CITIES = [{city:'Atlanta',val:25348,pct:92},{city:'(not set)',val:7210,pct:26},{city:'Singapore',val:1689,pct:6},{city:'Marietta',val:1558,pct:6}]
const VIEWS = [{d:'6A',v:18000},{d:'13A',v:9000},{d:'20A',v:8000},{d:'27A',v:11000},{d:'4M',v:7000},{d:'11M',v:8000},{d:'18M',v:7500},{d:'25M',v:8000}]

const KPI_COLORS = {
  white:{bg:'#fff',border:'#e5e5e5',text:'#1a1a1a',sub:'#666',badge:'rgba(0,0,0,0.06)',badgeText:'#333'},
  blue:{bg:'#48b5ea',border:'#48b5ea',text:'#fff',sub:'rgba(255,255,255,0.85)',badge:'rgba(255,255,255,0.2)',badgeText:'#fff'},
  green:{bg:'#4caf82',border:'#4caf82',text:'#fff',sub:'rgba(255,255,255,0.85)',badge:'rgba(255,255,255,0.2)',badgeText:'#fff'},
  red:{bg:'#ef5350',border:'#ef5350',text:'#fff',sub:'rgba(255,255,255,0.85)',badge:'rgba(255,255,255,0.2)',badgeText:'#fff'},
}

function KPICard({label,value,change,up,color,editMode,onMenu,menuOpen}:{label:string;value:string;change:string;up:boolean;color:keyof typeof KPI_COLORS;editMode:boolean;onMenu:()=>void;menuOpen:boolean}) {
  const c = KPI_COLORS[color]
  return (
    <div style={{ background:c.bg, border:`1px solid ${c.border}`, borderRadius:8, padding:16, position:'relative', outline: editMode&&menuOpen ? `2px solid #48b5ea` : 'none' }}>
      {editMode && (
        <>
          <div style={{ position:'absolute', top:6, left:6, cursor:'grab', color: color==='white'?'#ccc':'rgba(255,255,255,0.4)' }}><Grip size={12}/></div>
          <div style={{ position:'absolute', top:4, right:4, zIndex:5 }}>
            <button onClick={e=>{e.stopPropagation();onMenu()}} style={{ background:'rgba(255,255,255,0.9)', border:'1px solid #e5e5e5', borderRadius:4, padding:'2px 5px', cursor:'pointer', display:'flex', alignItems:'center' }}>
              <MoreHorizontal size={12} style={{ color:'#666' }}/>
            </button>
            {menuOpen && (
              <div style={{ position:'absolute', right:0, top:'100%', marginTop:2, background:'#fff', border:'1px solid #e5e5e5', borderRadius:8, boxShadow:'0 6px 20px rgba(0,0,0,0.12)', padding:4, minWidth:140, zIndex:20 }}>
                {[['Edit','✏'],['Full Screen','⛶'],['Copy','⧉'],['Clone','❐'],['Share','↗'],['Remove','🗑']].map(([lbl,ico])=>(
                  <button key={lbl} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'7px 12px', fontSize:12, color: lbl==='Remove'?'#ef4444':'#333', background:'none', border:'none', cursor:'pointer', borderRadius:4, fontFamily:'system-ui,sans-serif' }}>
                    <span style={{ width:14 }}>{ico}</span>{lbl}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8 }}>
        <span style={{ fontSize:12, color:c.sub, fontWeight:500 }}>{label}</span>
        {change && <span style={{ fontSize:10, fontWeight:700, color: color==='white'?(up?'#22c55e':'#ef4444'):c.badgeText, background:c.badge, padding:'2px 6px', borderRadius:4 }}>{up?'▲':'▼'} {change}</span>}
      </div>
      <p style={{ fontSize:28, fontWeight:700, color:c.text, letterSpacing:'-0.5px', lineHeight:1 }}>{value}</p>
    </div>
  )
}

function ChartWidget({title,children,editMode,onMenu,menuOpen}:{title:string;children:React.ReactNode;editMode:boolean;onMenu:()=>void;menuOpen:boolean}) {
  return (
    <div style={{ background:'#fff', border:`1px solid ${editMode&&menuOpen?'#48b5ea':'#e5e5e5'}`, borderRadius:8, padding:16, position:'relative', outline: editMode&&menuOpen?'2px solid #48b5ea':'none' }}>
      {editMode && (
        <>
          <div style={{ position:'absolute', top:6, left:6, cursor:'grab', color:'#ccc' }}><Grip size={12}/></div>
          <div style={{ position:'absolute', top:4, right:4, zIndex:5 }}>
            <button onClick={e=>{e.stopPropagation();onMenu()}} style={{ background:'rgba(255,255,255,0.9)', border:'1px solid #e5e5e5', borderRadius:4, padding:'2px 5px', cursor:'pointer', display:'flex', alignItems:'center' }}>
              <MoreHorizontal size={12} style={{ color:'#666' }}/>
            </button>
            {menuOpen && (
              <div style={{ position:'absolute', right:0, top:'100%', marginTop:2, background:'#fff', border:'1px solid #e5e5e5', borderRadius:8, boxShadow:'0 6px 20px rgba(0,0,0,0.12)', padding:4, minWidth:140, zIndex:20 }}>
                {[['Edit','✏'],['Full Screen','⛶'],['Copy','⧉'],['Clone','❐'],['Share','↗'],['Remove','🗑']].map(([lbl,ico])=>(
                  <button key={lbl} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'7px 12px', fontSize:12, color: lbl==='Remove'?'#ef4444':'#333', background:'none', border:'none', cursor:'pointer', borderRadius:4, fontFamily:'system-ui,sans-serif' }}>
                    <span style={{ width:14 }}>{ico}</span>{lbl}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <span style={{ fontSize:12, color:'#333', fontWeight:600 }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

export default function ClientWorkspace({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('Dashboards')
  const [activeDash, setActiveDash] = useState('Website Performance')
  const [editMode, setEditMode] = useState(false)
  const [liveData, setLiveData] = useState(true)
  const [openSrc, setOpenSrc] = useState<Set<string>>(new Set())
  const [menuOpen, setMenuOpen] = useState<string|null>(null)

  function toggleMenu(id: string) { setMenuOpen(p => p===id ? null : id) }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden', background:'#fff' }} onClick={()=>setMenuOpen(null)}>

      {/* Edit mode topbar */}
      {editMode ? (
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 16px', borderBottom:'1px solid #e5e5e5', background:'#fff', flexShrink:0 }}>
          <span style={{ fontSize:14, fontWeight:700, color:'#1a1a1a', marginRight:4 }}>Dashboard</span>
          <div style={{ width:1, height:16, background:'#e5e5e5' }}/>
          <img src="https://logo.clearbit.com/beltline.org" alt="" style={{ width:20, height:20, borderRadius:'50%', objectFit:'contain' }} onError={e=>(e.currentTarget.style.display='none')}/>
          <span style={{ fontSize:13, fontWeight:600, color:'#1a1a1a' }}>Collaborating Docs</span>
          <span style={{ fontSize:11, background:'#f0f0f0', color:'#666', padding:'2px 8px', borderRadius:4, fontWeight:500 }}>Client</span>
          <button onClick={()=>setEditMode(false)} style={{ marginLeft:'auto', width:28, height:28, borderRadius:'50%', background:'#f5f5f5', border:'1px solid #e5e5e5', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#666' }}><X size={14}/></button>
        </div>
      ) : null}

      {editMode ? (
        /* Edit mode secondary bar */
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', borderBottom:'1px solid #e5e5e5', background:'#fff', flexShrink:0 }}>
          <div style={{ display:'flex', gap:2, background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:2 }}>
            <button onClick={()=>setLiveData(true)} style={{ padding:'5px 12px', borderRadius:4, fontSize:11, fontWeight:600, background:liveData?'#48b5ea':'transparent', color:liveData?'#fff':'#666', border:'none', cursor:'pointer' }}>Live Data</button>
            <button onClick={()=>setLiveData(false)} style={{ padding:'5px 12px', borderRadius:4, fontSize:11, fontWeight:500, background:!liveData?'#fff':'transparent', color:!liveData?'#333':'#666', border:'none', cursor:'pointer' }}>Sample Data</button>
          </div>
          <button style={{ background:'none', border:'none', cursor:'pointer', color:'#999', padding:'4px 6px', display:'flex' }}><RotateCcw size={14}/></button>
          <button style={{ background:'none', border:'none', cursor:'pointer', color:'#999', padding:'4px 6px', display:'flex' }}><RotateCw size={14}/></button>
          <div style={{ width:1, height:16, background:'#e5e5e5', margin:'0 4px' }}/>
          <button style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'5px 8px', cursor:'pointer', display:'flex' }}><Monitor size={13} style={{ color:'#333' }}/></button>
          <button style={{ background:'transparent', border:'none', borderRadius:6, padding:'5px 8px', cursor:'pointer', display:'flex' }}><Smartphone size={13} style={{ color:'#999' }}/></button>
          <div style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center' }}>
            <button style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#333', cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>⊞ Page Setup</button>
            <button style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#333', cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>◑ Theme</button>
            <button style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#333', cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
              <Calendar size={12}/> Apr 1, 2026 - Apr 30, 2026 <ChevronDown size={11}/>
            </button>
            <button style={{ background:'none', border:'none', cursor:'pointer', color:'#666', padding:'4px 6px', display:'flex' }}>?</button>
            <button style={{ background:'none', border:'none', cursor:'pointer', color:'#666', padding:'4px 6px', display:'flex' }}>⏱</button>
            <button style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#333', cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>▶ Preview</button>
            <span style={{ fontSize:11, color:'#999' }}>☁ Auto saved</span>
          </div>
        </div>
      ) : (
        /* View mode topbar */
        <div style={{ padding:'12px 24px', borderBottom:'1px solid #e5e5e5', background:'#fff', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <Link href="/dashboard/clients" style={{ fontSize:13, color:'#666', textDecoration:'none', fontWeight:500 }}>Clients</Link>
            <ChevronRight size={14} style={{ color:'#ccc' }}/>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <img src="https://logo.clearbit.com/beltline.org" alt="" style={{ width:22, height:22, borderRadius:'50%', objectFit:'contain' }} onError={e=>(e.currentTarget.style.display='none')}/>
              <span style={{ fontSize:14, fontWeight:700, color:'#1a1a1a' }}>Atlanta Beltline</span>
              <ChevronDown size={14} style={{ color:'#999' }}/>
            </div>
            <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
              <button style={{ display:'flex', alignItems:'center', gap:6, background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#333', cursor:'pointer' }}>
                <Sparkles size={13} style={{ color:'#7c3aed' }}/> Ask AI
              </button>
              <button style={{ display:'flex', alignItems:'center', gap:6, background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#333', cursor:'pointer' }}>
                <Settings size={13}/> Settings
              </button>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:0 }}>
            {TABS.map(tab => (
              <button key={tab} onClick={()=>setActiveTab(tab)} style={{ padding:'8px 14px', fontSize:13, fontWeight:500, cursor:'pointer', background:'none', border:'none', color: activeTab===tab?'#1a85c8':'#666', borderBottom: activeTab===tab?'2px solid #48b5ea':'2px solid transparent' }}>{tab}</button>
            ))}
            <div style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center' }}>
              <button style={{ display:'flex', alignItems:'center', gap:6, background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#333', cursor:'pointer' }}>
                <Calendar size={12}/> Apr 1, 2026 - Apr 30, 2026 <ChevronDown size={11}/>
              </button>
              <button style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#333', cursor:'pointer' }}>Share</button>
              <button style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 8px', fontSize:12, color:'#333', cursor:'pointer' }}><Maximize2 size={13}/></button>
              <button onClick={()=>setEditMode(true)} style={{ background:'#48b5ea', border:'none', borderRadius:6, padding:'6px 16px', fontSize:12, color:'#fff', cursor:'pointer', fontWeight:600 }}>Edit My Dashboards</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        {/* Left panel */}
        <div style={{ width:220, minWidth:220, borderRight:'1px solid #e5e5e5', display:'flex', flexDirection:'column', overflow:'hidden', background:'#fff' }}>
          <div style={{ padding:12 }}>
            <button style={{ width:'100%', display:'flex', alignItems:'center', gap:6, background:'#48b5ea', border:'none', borderRadius:6, padding:'8px 12px', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>
              <Plus size={13}/> {editMode ? 'Add blank dashboard' : 'Add Dashboard'}
            </button>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {DASHBOARDS.map(d => (
              <button key={d} onClick={()=>setActiveDash(d)} style={{
                width:'100%', textAlign:'left', padding:'9px 16px 9px 12px', fontSize:13, cursor:'pointer', background:'none',
                border:'none', fontWeight: activeDash===d?700:400, color: activeDash===d?'#1a1a1a':'#555',
                borderLeft: activeDash===d?'3px solid #48b5ea':'3px solid transparent',
                display:'flex', alignItems:'center', gap:6,
              }}>
                {editMode && <Grip size={12} style={{ color:'#ccc', flexShrink:0 }}/>}
                {d}
                {editMode && <MoreHorizontal size={13} style={{ marginLeft:'auto', color:'#ccc' }}/>}
              </button>
            ))}
            <div style={{ padding:'10px 16px 4px' }}>
              <p style={{ fontSize:10, fontWeight:600, color:'#999', textTransform:'uppercase' as const, letterSpacing:'0.06em' }}>DATA SOURCES</p>
            </div>
            {DATA_SOURCES.map(s => (
              <button key={s} onClick={()=>setOpenSrc(p=>{const n=new Set(p);n.has(s)?n.delete(s):n.add(s);return n})}
                style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:8, padding:'7px 16px', fontSize:13, cursor:'pointer', background:'none', border:'none', color:'#555' }}>
                <ChevronRight size={12} style={{ transform:openSrc.has(s)?'rotate(90deg)':'none', transition:'0.15s', color:'#999' }}/>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard canvas */}
        <div style={{ flex:1, overflowY:'auto', background: editMode?'#f8f8f8':'#f8f9fa' }}>
          {editMode && (
            <div style={{ padding:'8px 16px', background:'#fff', borderBottom:'1px solid #e5e5e5', display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:16, height:16, border:'2px solid #333', borderRadius:2 }}/>
              <span style={{ fontSize:13, fontWeight:700, color:'#1a1a1a' }}>{activeDash}</span>
            </div>
          )}

          {!editMode && (
            <div style={{ padding:'14px 20px', borderBottom:'1px solid #e5e5e5', background:'#fff', display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:16, height:16, border:'2px solid #333', borderRadius:2 }}/>
              <span style={{ fontSize:14, fontWeight:700, color:'#1a1a1a' }}>{activeDash}</span>
            </div>
          )}

          <div style={{ padding: editMode ? '12px 16px' : 16 }}>
            {/* Banner */}
            <div style={{ background:'#48b5ea', borderRadius:8, padding:'18px 24px', marginBottom:12 }}>
              <h2 style={{ fontSize:20, fontWeight:700, color:'#fff' }}>Website Performance</h2>
            </div>

            {/* KPI Row 1 */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:10 }}>
              <KPICard label="Total Sessions" value="120.5 K" change="29%" up={true} color="white" editMode={editMode} onMenu={()=>toggleMenu('s1')} menuOpen={menuOpen==='s1'}/>
              <KPICard label="Total Conversions" value="3,610" change="16%" up={false} color="blue" editMode={editMode} onMenu={()=>toggleMenu('s2')} menuOpen={menuOpen==='s2'}/>
              <KPICard label="Referring Domains" value="6,961" change="" up={true} color="white" editMode={editMode} onMenu={()=>toggleMenu('s3')} menuOpen={menuOpen==='s3'}/>
              <KPICard label="Engagement Rate" value="60.77%" change="3.97%" up={false} color="green" editMode={editMode} onMenu={()=>toggleMenu('s4')} menuOpen={menuOpen==='s4'}/>
            </div>

            {/* Row 2 */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:10 }}>
              <ChartWidget title="Total Sessions" editMode={editMode} onMenu={()=>toggleMenu('c1')} menuOpen={menuOpen==='c1'}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:11, color:'#666' }}>Total Sessions</span>
                  <span style={{ fontSize:10, fontWeight:700, color:'#22c55e', background:'#f0fdf4', padding:'2px 5px', borderRadius:4 }}>▲ 29%</span>
                </div>
                <ResponsiveContainer width="100%" height={80}>
                  <LineChart data={SESSIONS}>
                    <Line type="monotone" dataKey="v" stroke="#48b5ea" strokeWidth={2} dot={false}/>
                    <Tooltip contentStyle={{ fontSize:10, borderRadius:4 }} formatter={(v:number)=>[v.toLocaleString(),'']}/>
                  </LineChart>
                </ResponsiveContainer>
              </ChartWidget>

              <ChartWidget title="Domain Authority" editMode={editMode} onMenu={()=>toggleMenu('c2')} menuOpen={menuOpen==='c2'}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:100 }}>
                  <div style={{ position:'relative', width:90, height:90 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[{v:44},{v:56}]} cx="50%" cy="50%" innerRadius={28} outerRadius={40} dataKey="v" startAngle={90} endAngle={-270}>
                          <Cell fill="#f9b62a"/><Cell fill="#e5e5e5"/>
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontSize:18, fontWeight:700, color:'#1a1a1a' }}>44</span>
                    </div>
                  </div>
                </div>
              </ChartWidget>

              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <ChartWidget title="Conversion Rate" editMode={editMode} onMenu={()=>toggleMenu('c3')} menuOpen={menuOpen==='c3'}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:11, color:'#666' }}></span>
                    <span style={{ fontSize:10, fontWeight:700, color:'#ef4444', background:'#fef2f2', padding:'2px 5px', borderRadius:4 }}>▼ 34%</span>
                  </div>
                  <span style={{ fontSize:24, fontWeight:700, color:'#1a1a1a' }}>3%</span>
                </ChartWidget>
                <KPICard label="Bounce Rate" value="39.23%" change="6.84%" up={true} color="red" editMode={editMode} onMenu={()=>toggleMenu('c4')} menuOpen={menuOpen==='c4'}/>
              </div>
            </div>

            {/* Row 3 */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:10 }}>
              <ChartWidget title="Users By Device" editMode={editMode} onMenu={()=>toggleMenu('d1')} menuOpen={menuOpen==='d1'}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontSize:11, color:'#333', fontWeight:600 }}>Users By Device</span>
                  <span style={{ fontSize:11, color:'#333' }}>88,957 <span style={{ color:'#22c55e', fontWeight:700 }}>▲ 42%</span></span>
                </div>
                <ResponsiveContainer width="100%" height={110}>
                  <BarChart data={DEVICES} barSize={26}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize:10, fill:'#999' }}/>
                    <YAxis hide/>
                    <Tooltip contentStyle={{ fontSize:10, borderRadius:4 }} formatter={(v:number)=>[v.toLocaleString(),'']}/>
                    <Bar dataKey="v" radius={[3,3,0,0]}>{DEVICES.map((e,i)=><Cell key={i} fill={i===0?'#2196f3':i===1?'#42a5f5':'#90caf9'}/>)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartWidget>

              <ChartWidget title="Top Referral Sources" editMode={editMode} onMenu={()=>toggleMenu('d2')} menuOpen={menuOpen==='d2'}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:11, color:'#333', fontWeight:600 }}>Top Referral Sources</span>
                  <span style={{ fontSize:11, color:'#22c55e', fontWeight:700 }}>▲ 29%</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ position:'relative', width:90, height:90, flexShrink:0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={DONUT} cx="50%" cy="50%" innerRadius={28} outerRadius={40} dataKey="value">{DONUT.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontSize:12, fontWeight:700 }}>120.5K</span>
                      <span style={{ fontSize:9, color:'#999' }}>Sessions</span>
                    </div>
                  </div>
                  <div style={{ flex:1 }}>
                    {DONUT.slice(0,4).map(d=>(
                      <div key={d.name} style={{ display:'flex', alignItems:'center', gap:4, marginBottom:3 }}>
                        <div style={{ width:7, height:7, borderRadius:'50%', background:d.color, flexShrink:0 }}/>
                        <span style={{ fontSize:10, color:'#666', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.name}</span>
                        <span style={{ fontSize:10, fontWeight:600, color:'#333' }}>{d.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ChartWidget>

              <ChartWidget title="Traffic by Cities" editMode={editMode} onMenu={()=>toggleMenu('d3')} menuOpen={menuOpen==='d3'}>
                <span style={{ fontSize:12, color:'#333', fontWeight:600, display:'block', marginBottom:10 }}>Traffic by Cities</span>
                {CITIES.map(c=>(
                  <div key={c.city} style={{ marginBottom:8 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                      <span style={{ fontSize:12, color:'#333' }}>{c.city}</span>
                      <span style={{ fontSize:12, fontWeight:600 }}>{c.val.toLocaleString()}</span>
                    </div>
                    <div style={{ height:4, background:'#e5e5e5', borderRadius:2, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${c.pct}%`, background:'#4caf82', borderRadius:2 }}/>
                    </div>
                  </div>
                ))}
              </ChartWidget>
            </div>

            {/* Views area chart */}
            <ChartWidget title="Website Views" editMode={editMode} onMenu={()=>toggleMenu('v1')} menuOpen={menuOpen==='v1'}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                <span style={{ fontSize:12, color:'#333', fontWeight:600 }}>Website Views</span>
                <span style={{ fontSize:11 }}>243 K <span style={{ color:'#22c55e', fontWeight:700 }}>▲ 18%</span></span>
              </div>
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={VIEWS}>
                  <defs><linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#48b5ea" stopOpacity={0.3}/><stop offset="95%" stopColor="#48b5ea" stopOpacity={0}/></linearGradient></defs>
                  <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:10, fill:'#999' }}/>
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize:10, fill:'#999' }}/>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                  <Tooltip contentStyle={{ fontSize:10, borderRadius:4 }}/>
                  <Area type="monotone" dataKey="v" stroke="#48b5ea" fill="url(#vg)" strokeWidth={2}/>
                </AreaChart>
              </ResponsiveContainer>
            </ChartWidget>
          </div>
        </div>

        {/* Right panel - edit mode only */}
        {editMode && (
          <div style={{ width:72, minWidth:72, borderLeft:'1px solid #e5e5e5', background:'#fff', display:'flex', flexDirection:'column', alignItems:'center', padding:'12px 0', gap:2 }}>
            {RIGHT_PANEL.map(item => (
              <button key={item.label} style={{ width:60, padding:'10px 4px', display:'flex', flexDirection:'column', alignItems:'center', gap:4, background:'none', border:'none', cursor:'pointer', borderRadius:6 }}
                onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background='#f5f5f5'}
                onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background='none'}>
                <span style={{ fontSize:16 }}>{item.icon}</span>
                <span style={{ fontSize:9, color:'#666', textAlign:'center', lineHeight:1.2, fontFamily:'system-ui,sans-serif' }}>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
