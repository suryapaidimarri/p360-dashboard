'use client'
import { useState } from 'react'
import { ChevronRight, Sparkles, Settings, Calendar, Share2, ChevronDown, Plus, MoreHorizontal, Maximize2, X, Grip, RotateCcw, RotateCw, Monitor, Smartphone, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const DASHBOARDS = ['Website Performance','Paid Media','Organic + AI Search','Donations Trend','oiijuyuh']
const DATA_SOURCES = ['SEO','Analytics','Social','Paid Ads']
const TABS = ['Dashboards','Reports','Data Sources','Goals','Client Portal','Benchmarks','More']
const RIGHT_PANEL_ITEMS = [
  { icon:'◆', label:'Build with AI' },
  { icon:'⊞', label:'Integrations\nMetrics' },
  { icon:'Aa', label:'Content\nBlocks' },
  { icon:'▦', label:'Media' },
  { icon:'⊕', label:'Custom\nMetrics' },
  { icon:'⚖', label:'Benchmarks' },
  { icon:'◎', label:'Goals' },
]
const CHART_TYPES = [
  { id:'column', label:'Column', icon:'📊' },
  { id:'line', label:'Line', icon:'📈' },
  { id:'map', label:'Map', icon:'🌐' },
  { id:'pie', label:'Pie', icon:'🥧' },
  { id:'sparkline', label:'Sparkline', icon:'〰' },
  { id:'area', label:'Area', icon:'📉' },
]
const SESSIONS = [{d:'1A',v:8000},{d:'6A',v:19000},{d:'13A',v:10000},{d:'20A',v:11000},{d:'27A',v:7000},{d:'4M',v:7000},{d:'11M',v:7500},{d:'18M',v:8000},{d:'25M',v:7000}]
const DEVICES = [{name:'Mobile',v:56564},{name:'Desktop',v:31740},{name:'Tablet',v:785}]
const DONUT = [{name:'Organic Search',value:68639,color:'#2196f3'},{name:'Direct',value:30294,color:'#64b5f6'},{name:'Paid Social',value:8288,color:'#90caf9'},{name:'Organic Social',value:6570,color:'#bbdefb'}]
const CITIES = [{city:'Atlanta',val:25348,pct:92},{city:'(not set)',val:7210,pct:26},{city:'Singapore',val:1689,pct:6},{city:'Marietta',val:1558,pct:6}]
const VIEWS = [{d:'6A',v:18000},{d:'13A',v:9000},{d:'20A',v:8000},{d:'27A',v:11000},{d:'4M',v:7000},{d:'11M',v:8000},{d:'18M',v:7500},{d:'25M',v:8000}]

const KPI_BG: Record<string,{bg:string;border:string;text:string;sub:string}> = {
  white:{bg:'#fff',border:'#e5e5e5',text:'#1a1a1a',sub:'#666'},
  blue:{bg:'#48b5ea',border:'#48b5ea',text:'#fff',sub:'rgba(255,255,255,0.85)'},
  green:{bg:'#4caf82',border:'#4caf82',text:'#fff',sub:'rgba(255,255,255,0.85)'},
  red:{bg:'#ef5350',border:'#ef5350',text:'#fff',sub:'rgba(255,255,255,0.85)'},
}

interface Widget { id:string; title:string; dataSource:string; chartType:string; tooltip:string; color:string; value:string; change:string; up:boolean }

const INIT_WIDGETS: Widget[] = [
  {id:'w1',title:'Total Sessions',dataSource:'google-analytics-4 / traffic-analytics',chartType:'sparkline',tooltip:'Total number of visits to the website during the selected period.',color:'white',value:'120.5 K',change:'29%',up:true},
  {id:'w2',title:'Total Conversions',dataSource:'google-analytics-4 / conversions',chartType:'column',tooltip:'Total conversions tracked.',color:'blue',value:'3,610',change:'16%',up:false},
  {id:'w3',title:'Referring Domains',dataSource:'google-analytics-4 / referring',chartType:'line',tooltip:'Unique domains sending traffic.',color:'white',value:'6,961',change:'',up:true},
  {id:'w4',title:'Engagement Rate',dataSource:'google-analytics-4 / engagement',chartType:'area',tooltip:'Percentage of engaged sessions.',color:'green',value:'60.77%',change:'3.97%',up:false},
]

export default function ClientWorkspace({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('Dashboards')
  const [activeDash, setActiveDash] = useState('Website Performance')
  const [editMode, setEditMode] = useState(false)
  const [liveData, setLiveData] = useState(true)
  const [openSrc, setOpenSrc] = useState<Set<string>>(new Set())
  const [editingWidget, setEditingWidget] = useState<Widget|null>(null)
  const [widgets, setWidgets] = useState<Widget[]>(INIT_WIDGETS)
  const [editTab, setEditTab] = useState<'General'|'Data'|'Display'>('General')
  const [openMenu, setOpenMenu] = useState<string|null>(null)
  const [activeRightPanel, setActiveRightPanel] = useState<string|null>(null)
  const [integrationSearch, setIntegrationSearch] = useState('')

  const INTEGRATIONS = [
    {name:'Bing Webmaster Tools',connected:true},{name:'Facebook Ads',connected:true},
    {name:'Google Ads',connected:true},{name:'Google Analytics 4',connected:true},
    {name:'Google Lighthouse',connected:true},{name:'Google Search Console',connected:true},
    {name:'Google Sheets',connected:true},{name:'HubSpot',connected:false},
    {name:'Semrush - Backlinks',connected:true},{name:'ActiveCampaign',connected:false},
    {name:'AdRoll',connected:false},{name:'Adform',connected:false},
    {name:'Ahrefs',connected:false},{name:'Amazon Ads',connected:false},
    {name:'Amazon Redshift',connected:false},{name:'Avanser',connected:false},
    {name:'Backlink Manager',connected:false},{name:'BigCommerce',connected:false},
    {name:'Brevo',connected:false},{name:'BrightLocal',connected:false},
  ]

  function startEdit(w: Widget) {
    setEditingWidget({...w})
    setEditTab('General')
    setOpenMenu(null)
  }

  function saveWidget() {
    if (!editingWidget) return
    setWidgets(prev => prev.map(w => w.id===editingWidget.id ? editingWidget : w))
    setEditingWidget(null)
  }

  // Widget 3-dot dropdown
  function WidgetDot({wid, onEdit}: {wid:string; onEdit:()=>void}) {
    const isOpen = openMenu === wid
    return (
      <div style={{ position:'relative', display:'inline-flex' }}>
        <button
          onClick={e => { e.stopPropagation(); setOpenMenu(isOpen ? null : wid) }}
          style={{ background:'rgba(255,255,255,0.92)', border:'1px solid #e5e5e5', borderRadius:4, padding:'2px 6px', cursor:'pointer', display:'flex', alignItems:'center', lineHeight:1 }}>
          <MoreHorizontal size={13} style={{ color:'#555' }}/>
        </button>
        {isOpen && (
          <div style={{ position:'absolute', right:0, top:'calc(100% + 4px)', background:'#fff', border:'1px solid #e5e5e5', borderRadius:8, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', padding:'4px', minWidth:160, zIndex:999 }}
            onClick={e=>e.stopPropagation()}>
            <button onClick={()=>{ onEdit(); setOpenMenu(null) }} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:'#1a1a1a', background:'none', border:'none', cursor:'pointer', borderRadius:4, textAlign:'left' as const }}>
              ✏ Edit
            </button>
            <button onClick={()=>setOpenMenu(null)} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:'#1a1a1a', background:'none', border:'none', cursor:'pointer', borderRadius:4, textAlign:'left' as const }}>
              ⛶ Full Screen
            </button>
            <button onClick={()=>setOpenMenu(null)} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:'#1a1a1a', background:'none', border:'none', cursor:'pointer', borderRadius:4, textAlign:'left' as const }}>
              ⧉ Copy
            </button>
            <button onClick={()=>setOpenMenu(null)} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:'#1a1a1a', background:'none', border:'none', cursor:'pointer', borderRadius:4, textAlign:'left' as const }}>
              ❐ Clone
            </button>
            <button onClick={()=>setOpenMenu(null)} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:'#1a1a1a', background:'none', border:'none', cursor:'pointer', borderRadius:4, textAlign:'left' as const }}>
              ↗ Share
            </button>
            <div style={{ height:1, background:'#f0f0f0', margin:'2px 0' }}/>
            <button onClick={()=>setOpenMenu(null)} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:'#ef4444', background:'none', border:'none', cursor:'pointer', borderRadius:4, textAlign:'left' as const }}>
              🗑 Remove
            </button>
          </div>
        )}
      </div>
    )
  }

  function KPICard({w}: {w: Widget}) {
    const c = KPI_BG[w.color] || KPI_BG.white
    const isWhite = w.color === 'white'
    return (
      <div style={{ background:c.bg, border:`1px solid ${c.border}`, borderRadius:8, padding:16, position:'relative', minHeight:110 }}>
        {editMode && <div style={{ position:'absolute', top:6, left:6, cursor:'grab', color:isWhite?'#d0d0d0':'rgba(255,255,255,0.35)' }}><Grip size={13}/></div>}
        {editMode && (
          <div style={{ position:'absolute', top:6, right:6, zIndex:10, display:'flex', alignItems:'center', gap:4 }}>
            <button style={{ background: isWhite?'rgba(0,0,0,0.05)':'rgba(255,255,255,0.15)', border:'none', borderRadius:4, padding:'3px 5px', cursor:'pointer', display:'flex', alignItems:'center' }}>
              <Maximize2 size={10} style={{ color:isWhite?'#666':'rgba(255,255,255,0.7)' }}/>
            </button>
            <WidgetDot wid={w.id} onEdit={()=>startEdit(w)}/>
          </div>
        )}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
          <span style={{ fontSize:12, color:c.sub, fontWeight:500 }}>{w.title}</span>
          {w.change && (
            <span style={{ fontSize:10, fontWeight:700, marginLeft:8, padding:'2px 6px', borderRadius:4,
              color: isWhite ? (w.up?'#22c55e':'#ef4444') : 'rgba(255,255,255,0.95)',
              background: isWhite ? (w.up?'#f0fdf4':'#fef2f2') : 'rgba(255,255,255,0.18)',
            }}>
              {w.up?'▲':'▼'} {w.change}
            </span>
          )}
        </div>
        <p style={{ fontSize:30, fontWeight:700, color:c.text, letterSpacing:'-0.5px', lineHeight:1 }}>{w.value}</p>
      </div>
    )
  }

  function ChartCard({id, title, children}: {id:string; title:string; children:React.ReactNode}) {
    const w = widgets.find(x=>x.id===id) || INIT_WIDGETS[0]
    return (
      <div style={{ background:'#fff', border:'1px solid #e5e5e5', borderRadius:8, padding:16, position:'relative' }}>
        {editMode && <div style={{ position:'absolute', top:6, left:6, cursor:'grab', color:'#d0d0d0' }}><Grip size={13}/></div>}
        {editMode && (
          <div style={{ position:'absolute', top:6, right:6, zIndex:10, display:'flex', alignItems:'center', gap:4 }}>
            <button style={{ background:'rgba(0,0,0,0.04)', border:'none', borderRadius:4, padding:'3px 5px', cursor:'pointer', display:'flex' }}><Maximize2 size={10} style={{ color:'#888' }}/></button>
            <WidgetDot wid={id} onEdit={()=>startEdit(w)}/>
          </div>
        )}
        {children}
      </div>
    )
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden', background:'#fff' }}
      onClick={()=>{ if(openMenu) setOpenMenu(null) }}>

      {/* Edit mode bars */}
      {editMode && (
        <>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 16px', borderBottom:'1px solid #e5e5e5', background:'#fff', flexShrink:0 }}>
            <span style={{ fontSize:14, fontWeight:700, color:'#1a1a1a' }}>Dashboard</span>
            <div style={{ width:1, height:16, background:'#e5e5e5' }}/>
            <div style={{ width:22, height:22, borderRadius:'50%', overflow:'hidden', background:'#f0f0f0', flexShrink:0 }}>
              <img src="https://logo.clearbit.com/beltline.org" alt="" style={{ width:'100%', height:'100%', objectFit:'contain' }} onError={e=>(e.currentTarget.style.display='none')}/>
            </div>
            <span style={{ fontSize:13, fontWeight:600 }}>Collaborating Docs</span>
            <span style={{ fontSize:11, background:'#f0f0f0', color:'#666', padding:'2px 8px', borderRadius:4 }}>Client</span>
            <button onClick={()=>{setEditMode(false);setEditingWidget(null);setOpenMenu(null)}}
              style={{ marginLeft:'auto', width:28, height:28, borderRadius:'50%', background:'#f5f5f5', border:'1px solid #e5e5e5', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <X size={14} style={{ color:'#555' }}/>
            </button>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderBottom:'1px solid #e5e5e5', background:'#fff', flexShrink:0 }}>
            <div style={{ display:'flex', gap:1, background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:2 }}>
              <button onClick={()=>setLiveData(true)} style={{ padding:'5px 14px', borderRadius:4, fontSize:11, fontWeight:600, background:liveData?'#48b5ea':'transparent', color:liveData?'#fff':'#666', border:'none', cursor:'pointer' }}>Live Data</button>
              <button onClick={()=>setLiveData(false)} style={{ padding:'5px 14px', borderRadius:4, fontSize:11, background:!liveData?'#fff':'transparent', color:!liveData?'#333':'#666', border:'none', cursor:'pointer' }}>Sample Data</button>
            </div>
            <button style={{ background:'none', border:'none', cursor:'pointer', color:'#bbb', display:'flex', padding:'4px 5px' }}><RotateCcw size={14}/></button>
            <button style={{ background:'none', border:'none', cursor:'pointer', color:'#bbb', display:'flex', padding:'4px 5px' }}><RotateCw size={14}/></button>
            <div style={{ width:1, height:14, background:'#e5e5e5', margin:'0 2px' }}/>
            <button style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'5px 8px', cursor:'pointer', display:'flex' }}><Monitor size={13} style={{ color:'#333' }}/></button>
            <button style={{ background:'transparent', border:'none', borderRadius:6, padding:'5px 8px', cursor:'pointer', display:'flex' }}><Smartphone size={13} style={{ color:'#bbb' }}/></button>
            <div style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center' }}>
              <button style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#333', cursor:'pointer' }}>⊞ Page Setup</button>
              <button style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#333', cursor:'pointer' }}>◑ Theme</button>
              <button style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#333', cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
                <Calendar size={12}/> Apr 1, 2026 - Apr 30, 2026 <ChevronDown size={11}/>
              </button>
              <button style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#333', cursor:'pointer' }}>▶ Preview</button>
              <span style={{ fontSize:11, color:'#999' }}>☁ Auto saved</span>
            </div>
          </div>
        </>
      )}

      {/* View mode topbar */}
      {!editMode && (
        <div style={{ padding:'12px 24px', borderBottom:'1px solid #e5e5e5', background:'#fff', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <Link href="/dashboard/clients" style={{ fontSize:13, color:'#666', textDecoration:'none' }}>Clients</Link>
            <ChevronRight size={14} style={{ color:'#ccc' }}/>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:22, height:22, borderRadius:'50%', overflow:'hidden', background:'#f0f0f0' }}>
                <img src="https://logo.clearbit.com/beltline.org" alt="" style={{ width:'100%', height:'100%', objectFit:'contain' }} onError={e=>(e.currentTarget.style.display='none')}/>
              </div>
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
          <div style={{ display:'flex', alignItems:'center' }}>
            {TABS.map(tab => (
              <button key={tab} onClick={()=>setActiveTab(tab)} style={{ padding:'8px 14px', fontSize:13, fontWeight:500, cursor:'pointer', background:'none', border:'none', color: activeTab===tab?'#1a85c8':'#666', borderBottom: activeTab===tab?'2px solid #48b5ea':'2px solid transparent' }}>{tab}</button>
            ))}
            <div style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center' }}>
              <button style={{ display:'flex', alignItems:'center', gap:6, background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#333', cursor:'pointer' }}>
                <Calendar size={12}/> Apr 1, 2026 - Apr 30, 2026 <ChevronDown size={11}/>
              </button>
              <button style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#333', cursor:'pointer' }}>Share</button>
              <button style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 8px', cursor:'pointer' }}><Maximize2 size={13}/></button>
              <button onClick={()=>setEditMode(true)} style={{ background:'#48b5ea', border:'none', borderRadius:6, padding:'6px 16px', fontSize:12, color:'#fff', cursor:'pointer', fontWeight:600 }}>Edit My Dashboards</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        {/* Left panel */}
        <div style={{ width:220, minWidth:220, borderRight:'1px solid #e5e5e5', display:'flex', flexDirection:'column', background:'#fff' }}>
          <div style={{ padding:12 }}>
            <button style={{ width:'100%', display:'flex', alignItems:'center', gap:6, background:'#48b5ea', border:'none', borderRadius:6, padding:'8px 12px', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>
              <Plus size={13}/> {editMode?'Add blank dashboard':'Add Dashboard'}
            </button>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {DASHBOARDS.map(d => (
              <button key={d} onClick={()=>setActiveDash(d)} style={{ width:'100%', textAlign:'left', padding:'9px 12px', fontSize:13, cursor:'pointer', background:'none', border:'none', fontWeight: activeDash===d?700:400, color: activeDash===d?'#1a1a1a':'#555', borderLeft: activeDash===d?'3px solid #48b5ea':'3px solid transparent', display:'flex', alignItems:'center', gap:6 }}>
                {editMode && <Grip size={12} style={{ color:'#ccc', flexShrink:0 }}/>}
                <span style={{ flex:1 }}>{d}</span>
                {editMode && <MoreHorizontal size={13} style={{ color:'#ccc' }}/>}
              </button>
            ))}
            <div style={{ padding:'10px 16px 4px' }}>
              <p style={{ fontSize:10, fontWeight:600, color:'#999', textTransform:'uppercase' as const, letterSpacing:'0.06em' }}>DATA SOURCES</p>
            </div>
            {DATA_SOURCES.map(s => (
              <button key={s} onClick={()=>setOpenSrc(p=>{const n=new Set(p);n.has(s)?n.delete(s):n.add(s);return n})}
                style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:8, padding:'7px 16px', fontSize:13, cursor:'pointer', background:'none', border:'none', color:'#555' }}>
                <ChevronRight size={12} style={{ transform:openSrc.has(s)?'rotate(90deg)':'none', transition:'0.15s', color:'#999' }}/>{s}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div style={{ flex:1, overflowY:'auto', background:'#f8f9fa' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #e5e5e5', background:'#fff', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:16, height:16, border:'2px solid #333', borderRadius:2 }}/>
            <span style={{ fontSize:14, fontWeight:700, color:'#1a1a1a' }}>{activeDash}</span>
          </div>
          <div style={{ padding:16 }}>
            <div style={{ background:'#48b5ea', borderRadius:8, padding:'18px 24px', marginBottom:12 }}>
              <h2 style={{ fontSize:20, fontWeight:700, color:'#fff' }}>Website Performance</h2>
            </div>
            {/* KPI row */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:10 }}>
              {widgets.map(w => <KPICard key={w.id} w={w}/>)}
            </div>
            {/* Row 2 */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:10 }}>
              <ChartCard id="c1" title="Total Sessions">
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:11, color:'#666', fontWeight:500 }}>Total Sessions</span>
                  <span style={{ fontSize:10, fontWeight:700, color:'#22c55e', background:'#f0fdf4', padding:'2px 5px', borderRadius:4 }}>▲ 29%</span>
                </div>
                <ResponsiveContainer width="100%" height={80}>
                  <LineChart data={SESSIONS}><Line type="monotone" dataKey="v" stroke="#48b5ea" strokeWidth={2} dot={false}/><Tooltip contentStyle={{ fontSize:10, borderRadius:4 }} formatter={(v:number)=>[v.toLocaleString(),'']} /></LineChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard id="c2" title="Domain Authority">
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:110 }}>
                  <div style={{ position:'relative', width:90, height:90 }}>
                    <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{v:44},{v:56}]} cx="50%" cy="50%" innerRadius={28} outerRadius={40} dataKey="v" startAngle={90} endAngle={-270}><Cell fill="#f9b62a"/><Cell fill="#e5e5e5"/></Pie></PieChart></ResponsiveContainer>
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:18, fontWeight:700 }}>44</span></div>
                  </div>
                </div>
              </ChartCard>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <ChartCard id="c3" title="Conversion Rate">
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:11, color:'#666' }}>Conversion Rate</span>
                    <span style={{ fontSize:10, fontWeight:700, color:'#ef4444', background:'#fef2f2', padding:'2px 5px', borderRadius:4 }}>▼ 34%</span>
                  </div>
                  <span style={{ fontSize:24, fontWeight:700, color:'#1a1a1a' }}>3%</span>
                </ChartCard>
                <div style={{ background:'#ef5350', border:'1px solid #ef5350', borderRadius:8, padding:16, position:'relative' }}>
                  {editMode && <div style={{ position:'absolute', top:6, left:6, cursor:'grab', color:'rgba(255,255,255,0.35)' }}><Grip size={13}/></div>}
                  {editMode && (
                    <div style={{ position:'absolute', top:6, right:6, zIndex:10, display:'flex', gap:4 }}>
                      <button style={{ background:'rgba(255,255,255,0.2)', border:'none', borderRadius:4, padding:'3px 5px', cursor:'pointer', display:'flex' }}><Maximize2 size={10} style={{ color:'rgba(255,255,255,0.8)' }}/></button>
                      <WidgetDot wid="bounce" onEdit={()=>startEdit(widgets[3])}/>
                    </div>
                  )}
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}><span style={{ fontSize:11, color:'rgba(255,255,255,0.85)' }}>Bounce Rate</span><span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.95)', background:'rgba(255,255,255,0.18)', padding:'2px 6px', borderRadius:4 }}>▲ 6.84%</span></div>
                  <p style={{ fontSize:26, fontWeight:700, color:'#fff', letterSpacing:'-0.5px' }}>39.23%</p>
                </div>
              </div>
            </div>
            {/* Row 3 */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:10 }}>
              <ChartCard id="d1" title="Users By Device">
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}><span style={{ fontSize:11, fontWeight:600 }}>Users By Device</span><span style={{ fontSize:11 }}>88,957 <span style={{ color:'#22c55e', fontWeight:700 }}>▲ 42%</span></span></div>
                <ResponsiveContainer width="100%" height={110}><BarChart data={DEVICES} barSize={26}><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize:10, fill:'#999' }}/><YAxis hide/><Tooltip contentStyle={{ fontSize:10, borderRadius:4 }} formatter={(v:number)=>[v.toLocaleString(),'']} /><Bar dataKey="v" radius={[3,3,0,0]}>{DEVICES.map((e,i)=><Cell key={i} fill={i===0?'#2196f3':i===1?'#42a5f5':'#90caf9'}/>)}</Bar></BarChart></ResponsiveContainer>
              </ChartCard>
              <ChartCard id="d2" title="Top Referral Sources">
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}><span style={{ fontSize:11, fontWeight:600 }}>Top Referral Sources</span><span style={{ fontSize:11, color:'#22c55e', fontWeight:700 }}>▲ 29%</span></div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ position:'relative', width:80, height:80, flexShrink:0 }}>
                    <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={DONUT} cx="50%" cy="50%" innerRadius={24} outerRadius={36} dataKey="value">{DONUT.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie></PieChart></ResponsiveContainer>
                    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:11, fontWeight:700 }}>120.5K</span><span style={{ fontSize:8, color:'#999' }}>Sessions</span></div>
                  </div>
                  <div style={{ flex:1 }}>{DONUT.map(d=><div key={d.name} style={{ display:'flex', alignItems:'center', gap:4, marginBottom:3 }}><div style={{ width:6, height:6, borderRadius:'50%', background:d.color, flexShrink:0 }}/><span style={{ fontSize:9, color:'#666', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.name}</span><span style={{ fontSize:9, fontWeight:600 }}>{d.value.toLocaleString()}</span></div>)}</div>
                </div>
              </ChartCard>
              <ChartCard id="d3" title="Traffic by Cities">
                <span style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:10 }}>Traffic by Cities</span>
                {CITIES.map(c=><div key={c.city} style={{ marginBottom:8 }}><div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}><span style={{ fontSize:12 }}>{c.city}</span><span style={{ fontSize:12, fontWeight:600 }}>{c.val.toLocaleString()}</span></div><div style={{ height:4, background:'#e5e5e5', borderRadius:2, overflow:'hidden' }}><div style={{ height:'100%', width:`${c.pct}%`, background:'#4caf82', borderRadius:2 }}/></div></div>)}
              </ChartCard>
            </div>
            <ChartCard id="v1" title="Website Views">
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}><span style={{ fontSize:12, fontWeight:600 }}>Website Views</span><span style={{ fontSize:11 }}>243 K <span style={{ color:'#22c55e', fontWeight:700 }}>▲ 18%</span></span></div>
              <ResponsiveContainer width="100%" height={130}><AreaChart data={VIEWS}><defs><linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#48b5ea" stopOpacity={0.3}/><stop offset="95%" stopColor="#48b5ea" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:10, fill:'#999' }}/><YAxis axisLine={false} tickLine={false} tick={{ fontSize:10, fill:'#999' }}/><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><Tooltip contentStyle={{ fontSize:10, borderRadius:4 }}/><Area type="monotone" dataKey="v" stroke="#48b5ea" fill="url(#vg)" strokeWidth={2}/></AreaChart></ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Right panel */}
        {editMode && (
          editingWidget ? (
            <div style={{ width:300, minWidth:300, borderLeft:'1px solid #e5e5e5', background:'#fff', display:'flex', flexDirection:'column', overflow:'hidden' }}>
              <div style={{ padding:'14px 16px', borderBottom:'1px solid #e5e5e5' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <button onClick={()=>setEditingWidget(null)} style={{ width:28, height:28, borderRadius:'50%', background:'#f5f5f5', border:'1px solid #e5e5e5', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
                    <ChevronLeft size={14} style={{ color:'#333' }}/>
                  </button>
                  <div>
                    <p style={{ fontSize:14, fontWeight:700, color:'#1a1a1a', lineHeight:1.2 }}>Edit Widget</p>
                    <p style={{ fontSize:11, color:'#999', marginTop:2 }}>{editingWidget.dataSource}</p>
                  </div>
                </div>
                <div style={{ display:'flex', borderBottom:'1px solid #e5e5e5' }}>
                  {(['General','Data','Display'] as const).map(t => (
                    <button key={t} onClick={()=>setEditTab(t)} style={{ flex:1, padding:'8px 0', fontSize:13, fontWeight:editTab===t?600:400, background:'none', border:'none', cursor:'pointer', color: editTab===t?'#1a85c8':'#666', borderBottom: editTab===t?'2px solid #48b5ea':'2px solid transparent' }}>{t}</button>
                  ))}
                </div>
              </div>
              <div style={{ flex:1, overflowY:'auto', padding:16 }}>
                {editTab === 'General' && (
                  <>
                    <div style={{ marginBottom:18 }}>
                      <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#1a1a1a', marginBottom:8 }}>Title</label>
                      <input value={editingWidget.title} onChange={e=>setEditingWidget({...editingWidget, title:e.target.value})}
                        style={{ width:'100%', background:'#fafafa', border:'1px solid #e5e5e5', borderRadius:6, padding:'8px 12px', fontSize:13, outline:'none', color:'#333', boxSizing:'border-box' as const }}/>
                    </div>
                    <div style={{ marginBottom:18 }}>
                      <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#1a1a1a', marginBottom:8 }}>Tooltip</label>
                      <textarea value={editingWidget.tooltip} onChange={e=>setEditingWidget({...editingWidget, tooltip:e.target.value})}
                        style={{ width:'100%', background:'#fafafa', border:'1px solid #e5e5e5', borderRadius:6, padding:'8px 12px', fontSize:13, outline:'none', color:'#333', resize:'vertical' as const, minHeight:80, fontFamily:'system-ui,sans-serif', boxSizing:'border-box' as const }}/>
                    </div>
                    <div style={{ marginBottom:18 }}>
                      <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#1a1a1a', marginBottom:10 }}>Chart Type</label>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                        {CHART_TYPES.map(ct => (
                          <button key={ct.id} onClick={()=>setEditingWidget({...editingWidget, chartType:ct.id})}
                            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'12px 6px', borderRadius:8, border:`2px solid ${editingWidget.chartType===ct.id?'#48b5ea':'#e5e5e5'}`, background: editingWidget.chartType===ct.id?'#ebf7ff':'#fff', cursor:'pointer', transition:'all 0.1s' }}>
                            <span style={{ fontSize:20 }}>{ct.icon}</span>
                            <span style={{ fontSize:11, color: editingWidget.chartType===ct.id?'#1a85c8':'#666', fontWeight: editingWidget.chartType===ct.id?600:400 }}>{ct.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderTop:'1px solid #f0f0f0', marginBottom:16 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:'#1a1a1a' }}>Override Date Range</span>
                      <div style={{ width:42, height:24, borderRadius:12, background:'#e5e5e5', position:'relative', cursor:'pointer' }}>
                        <div style={{ width:20, height:20, borderRadius:'50%', background:'#fff', position:'absolute', top:2, left:2, boxShadow:'0 1px 3px rgba(0,0,0,0.2)', transition:'left 0.2s' }}/>
                      </div>
                    </div>
                    <button onClick={saveWidget} style={{ width:'100%', background:'#48b5ea', border:'none', borderRadius:6, padding:'10px', fontSize:13, fontWeight:600, color:'#fff', cursor:'pointer' }}>
                      Save Changes
                    </button>
                  </>
                )}
                {editTab === 'Data' && (
                  <div>
                    <div style={{ marginBottom:16 }}>
                      <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#1a1a1a', marginBottom:8 }}>Data Source</label>
                      <p style={{ fontSize:12, color:'#999', background:'#f5f5f5', padding:'8px 12px', borderRadius:6 }}>{editingWidget.dataSource}</p>
                    </div>
                    <div style={{ marginBottom:16 }}>
                      <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#1a1a1a', marginBottom:8 }}>Metric</label>
                      <select style={{ width:'100%', border:'1px solid #e5e5e5', borderRadius:6, padding:'8px 12px', fontSize:13, outline:'none', color:'#333', background:'#fff' }}>
                        <option>Total Sessions</option><option>Total Users</option><option>Conversions</option><option>Engagement Rate</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#1a1a1a', marginBottom:8 }}>Comparison Period</label>
                      <select style={{ width:'100%', border:'1px solid #e5e5e5', borderRadius:6, padding:'8px 12px', fontSize:13, outline:'none', color:'#333', background:'#fff' }}>
                        <option>Previous Period</option><option>Previous Year</option><option>No Comparison</option>
                      </select>
                    </div>
                  </div>
                )}
                {editTab === 'Display' && (
                  <div>
                    <div style={{ marginBottom:16 }}>
                      <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#1a1a1a', marginBottom:10 }}>Background Color</label>
                      <div style={{ display:'flex', gap:8 }}>
                        {[{col:'#fff',key:'white'},{col:'#48b5ea',key:'blue'},{col:'#4caf82',key:'green'},{col:'#ef5350',key:'red'},{col:'#f9b62a',key:'yellow'}].map(({col,key}) => (
                          <div key={key} onClick={()=>setEditingWidget({...editingWidget, color:key})}
                            style={{ width:30, height:30, borderRadius:6, background:col, border:`3px solid ${editingWidget.color===key?'#333':'#e5e5e5'}`, cursor:'pointer', transition:'border 0.1s' }}/>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#1a1a1a', marginBottom:8 }}>Font Size</label>
                      <select style={{ width:'100%', border:'1px solid #e5e5e5', borderRadius:6, padding:'8px 12px', fontSize:13, outline:'none', color:'#333', background:'#fff' }}>
                        <option>Large</option><option>Medium</option><option>Small</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display:'flex', borderLeft:'1px solid #e5e5e5' }}>
              {/* Panel content */}
              {activeRightPanel && (
                <div style={{ width:320, borderRight:'1px solid #e5e5e5', background:'#fff', display:'flex', flexDirection:'column', overflow:'hidden' }}>
                  {activeRightPanel === 'build' && (
                    <div style={{ flex:1, overflowY:'auto', padding:20 }}>
                      <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'16px 0', borderBottom:'1px solid #f0f0f0' }}>
                        <div style={{ width:36, height:36, borderRadius:8, background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:16 }}>⊞</div>
                        <div>
                          <p style={{ fontSize:15, fontWeight:700, color:'#1a1a1a', marginBottom:4 }}>Summarize your data with AI</p>
                          <p style={{ fontSize:13, color:'#666', lineHeight:1.5 }}>Transform your data into clear, meaningful insights your clients will actually understand</p>
                        </div>
                      </div>
                      <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'16px 0', borderBottom:'1px solid #f0f0f0', cursor:'pointer' }}>
                        <div style={{ width:36, height:36, borderRadius:8, background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:16 }}>📊</div>
                        <div style={{ flex:1 }}>
                          <p style={{ fontSize:15, fontWeight:700, color:'#1a1a1a', marginBottom:4 }}>Build metrics with AI</p>
                          <p style={{ fontSize:13, color:'#666', lineHeight:1.5 }}>Use natural prompts to find the right widgets and instantly add the metrics that matter most</p>
                        </div>
                        <span style={{ color:'#999', fontSize:16, marginTop:2 }}>›</span>
                      </div>
                    </div>
                  )}
                  {activeRightPanel === 'integrations' && (
                    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                      <div style={{ padding:12, borderBottom:'1px solid #f0f0f0' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'8px 12px', marginBottom:8 }}>
                          <span style={{ color:'#999', fontSize:14 }}>🔍</span>
                          <input value={integrationSearch} onChange={e=>setIntegrationSearch(e.target.value)} placeholder="Search"
                            style={{ background:'transparent', border:'none', outline:'none', fontSize:13, color:'#333', width:'100%' }}/>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'#fff', border:'1px solid #e5e5e5', borderRadius:6, padding:'8px 12px', cursor:'pointer' }}>
                          <span style={{ fontSize:13, color:'#1a1a1a', fontWeight:500 }}>All Integrations</span>
                          <span style={{ color:'#999' }}>⇅</span>
                        </div>
                      </div>
                      <div style={{ flex:1, overflowY:'auto' }}>
                        {INTEGRATIONS.filter(i=>i.name.toLowerCase().includes(integrationSearch.toLowerCase())).map(i=>(
                          <div key={i.name} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:'1px solid #f5f5f5', cursor:'pointer' }}
                            onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#f9f9f9'}
                            onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}>
                            <div style={{ width:28, height:28, borderRadius:'50%', background: i.connected?'#e3f2fd':'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color: i.connected?'#1565c0':'#999', flexShrink:0 }}>{i.name[0]}</div>
                            <span style={{ flex:1, fontSize:13, color: i.connected?'#1a1a1a':'#999', fontWeight: i.connected?500:400 }}>{i.name}</span>
                            {!i.connected && <span style={{ fontSize:12, color:'#48b5ea', fontWeight:600, textDecoration:'underline', marginRight:4 }}>Connect</span>}
                            <span style={{ color:'#ccc' }}>›</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeRightPanel === 'content' && (
                    <div style={{ flex:1, overflowY:'auto', padding:20 }}>
                      {[
                        {icon:'Aa',title:'Title',desc:'Add page titles to structure your report, and include them in your table of contents'},
                        {icon:'Aa',title:'Textbox',desc:"Create custom text alongside your data to guide the story you're telling"},
                        {icon:'≡',title:'Table of Contents',desc:'Build your titles and headings so clients can easily scan and navigate your report'},
                        {icon:'#',title:'Stat',desc:'Spotlight key numbers to make your data instantly stand out'},
                      ].map(item=>(
                        <div key={item.title} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'16px 0', borderBottom:'1px solid #f0f0f0', cursor:'pointer' }}>
                          <div style={{ width:32, height:32, borderRadius:6, background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:14, fontWeight:700, color:'#333' }}>{item.icon}</div>
                          <div>
                            <p style={{ fontSize:14, fontWeight:700, color:'#1a1a1a', marginBottom:4 }}>{item.title}</p>
                            <p style={{ fontSize:12, color:'#666', lineHeight:1.5 }}>{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeRightPanel === 'media' && (
                    <div style={{ flex:1, overflowY:'auto', padding:20 }}>
                      {[
                        {icon:'🖼',title:'Image',desc:'Add images, graphics, or logos to bring personality and context to your report'},
                        {icon:'</>',title:'Embed',desc:'Pull in live content from YouTube, Google Sheets, and more to enrich your data story'},
                      ].map(item=>(
                        <div key={item.title} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'16px 0', borderBottom:'1px solid #f0f0f0', cursor:'pointer' }}>
                          <div style={{ width:32, height:32, borderRadius:6, background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:14, fontWeight:700, color:'#333' }}>{item.icon}</div>
                          <div>
                            <p style={{ fontSize:14, fontWeight:700, color:'#1a1a1a', marginBottom:4 }}>{item.title}</p>
                            <p style={{ fontSize:12, color:'#666', lineHeight:1.5 }}>{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeRightPanel === 'metrics' && (
                    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                      <div style={{ padding:12, borderBottom:'1px solid #f0f0f0' }}>
                        <button style={{ width:'100%', background:'#48b5ea', border:'none', borderRadius:6, padding:'10px', fontSize:13, fontWeight:600, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                          <Plus size={14}/> Add Custom Metric
                        </button>
                      </div>
                      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, textAlign:'center', color:'#999' }}>
                        <div style={{ width:80, height:80, borderRadius:'50%', background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, fontSize:32 }}>✏️</div>
                        <p style={{ fontSize:13, color:'#555', lineHeight:1.6 }}>You haven't created any custom metrics yet<br/>Click the button above to add a custom metric</p>
                      </div>
                    </div>
                  )}
                  {activeRightPanel === 'benchmarks' && (
                    <div style={{ flex:1, overflowY:'auto', padding:20 }}>
                      <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'16px 0', borderBottom:'1px solid #f0f0f0', cursor:'pointer' }}>
                        <div style={{ width:32, height:32, borderRadius:6, background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:16 }}>⚖️</div>
                        <div>
                          <p style={{ fontSize:14, fontWeight:700, color:'#1a1a1a', marginBottom:4 }}>Benchmark</p>
                          <p style={{ fontSize:12, color:'#666', lineHeight:1.5 }}>Visualize your client's performance against others</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeRightPanel === 'goals' && (
                    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                      <div style={{ padding:12, borderBottom:'1px solid #f0f0f0' }}>
                        <button style={{ width:'100%', background:'#48b5ea', border:'none', borderRadius:6, padding:'10px', fontSize:13, fontWeight:600, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                          <Plus size={14}/> Add Goal
                        </button>
                      </div>
                      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, textAlign:'center' }}>
                        <div style={{ width:80, height:80, borderRadius:'50%', background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, fontSize:32 }}>🚩</div>
                        <p style={{ fontSize:13, color:'#555', lineHeight:1.6 }}>You haven't created any goals yet<br/>Click the button above to add a goal</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* Icon strip */}
              <div style={{ width:80, minWidth:80, background:'#fff', display:'flex', flexDirection:'column', alignItems:'center', padding:'12px 0', gap:2 }}>
                {[
                  {id:'build',icon:'✦',label:'Build with AI'},
                  {id:'integrations',icon:'📊',label:'Integrations\nMetrics'},
                  {id:'content',icon:'Aa',label:'Content\nBlocks'},
                  {id:'media',icon:'🖼',label:'Media'},
                  {id:'metrics',icon:'⊕',label:'Custom\nMetrics'},
                  {id:'benchmarks',icon:'⚖',label:'Benchmarks'},
                  {id:'goals',icon:'◎',label:'Goals'},
                ].map(item => (
                  <button key={item.id}
                    onClick={()=>setActiveRightPanel(activeRightPanel===item.id ? null : item.id)}
                    style={{ width:68, padding:'10px 4px', display:'flex', flexDirection:'column', alignItems:'center', gap:5, border:'none', cursor:'pointer', borderRadius:8, transition:'background 0.1s', background: activeRightPanel===item.id?'#f0f0f0':'none' }}>
                    <span style={{ fontSize:18, lineHeight:1 }}>{item.icon}</span>
                    <span style={{ fontSize:9, color: activeRightPanel===item.id?'#333':'#666', textAlign:'center', lineHeight:1.3, whiteSpace:'pre-line', fontWeight: activeRightPanel===item.id?600:400 }}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
