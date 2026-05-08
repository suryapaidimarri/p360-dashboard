'use client'
import { useState, useEffect } from 'react'
import { ChevronRight, Sparkles, Settings, Calendar, ChevronDown, Plus, MoreHorizontal, Maximize2, X, Grip, RotateCcw, RotateCw, Monitor, Smartphone, ChevronLeft, RefreshCw, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const DASHBOARDS = ['Website Performance','Paid Media','Organic + AI Search','Donations Trend','oiijuyuh']
const DATA_SOURCES = ['SEO','Analytics','Social','Paid Ads']
const TABS = ['Dashboards','Reports','Data Sources','Goals','Client Portal','Benchmarks','More']
const RIGHT_PANEL_ITEMS = [
  {id:'build',icon:'✦',label:'Build with AI'},
  {id:'integrations',icon:'📊',label:'Integrations\nMetrics'},
  {id:'content',icon:'Aa',label:'Content\nBlocks'},
  {id:'media',icon:'🖼',label:'Media'},
  {id:'metrics',icon:'⊕',label:'Custom\nMetrics'},
  {id:'benchmarks',icon:'⚖',label:'Benchmarks'},
  {id:'goals',icon:'◎',label:'Goals'},
]
const CHART_TYPES = [
  {id:'column',label:'Column',icon:'📊'},{id:'line',label:'Line',icon:'📈'},
  {id:'map',label:'Map',icon:'🌐'},{id:'pie',label:'Pie',icon:'🥧'},
  {id:'sparkline',label:'Sparkline',icon:'〰'},{id:'area',label:'Area',icon:'📉'},
]

const ALL_INTEGRATIONS = [
  { name:'Bing Webmaster Tools', icon:'🔷', bg:'#e3f2fd', connected:true },
  { name:'Facebook',             icon:'📘', bg:'#e3f2fd', connected:true },
  { name:'Facebook Ads',         icon:'📘', bg:'#e3f2fd', connected:true },
  { name:'Google Ads',           icon:'🎯', bg:'#fce4ec', connected:true },
  { name:'Google Analytics 4',   icon:'📊', bg:'#fff3e0', connected:true },
  { name:'Google Lighthouse',    icon:'🌐', bg:'#e8f5e9', connected:true },
  { name:'Google Search Console',icon:'🔍', bg:'#e3f2fd', connected:true },
  { name:'Google Sheets',        icon:'📗', bg:'#e8f5e9', connected:true },
  { name:'LinkedIn Ads',         icon:'💼', bg:'#e3f2fd', connected:true },
  { name:'Semrush - Backlinks',  icon:'🔴', bg:'#fce4ec', connected:true },
  { name:'Semrush - Projects',   icon:'🔴', bg:'#fce4ec', connected:true },
  { name:'ActiveCampaign',       icon:'✉', bg:'#f3f4f6', connected:false },
  { name:'AdRoll',               icon:'⬡', bg:'#f3f4f6', connected:false },
  { name:'Adform',               icon:'Ⓐ', bg:'#f3f4f6', connected:false },
  { name:'Ahrefs',               icon:'🅰', bg:'#f3f4f6', connected:false },
  { name:'Amazon Ads',           icon:'🅰', bg:'#f3f4f6', connected:false },
  { name:'Apple Search Ads',     icon:'🍎', bg:'#f3f4f6', connected:false },
  { name:'Appsflyer',            icon:'📱', bg:'#f3f4f6', connected:false },
  { name:'Capterra',             icon:'⚑', bg:'#f3f4f6', connected:false },
  { name:'Criteo',               icon:'Ⓒ', bg:'#f3f4f6', connected:false },
  { name:'DV360',                icon:'📺', bg:'#f3f4f6', connected:false },
  { name:'HubSpot',              icon:'🟠', bg:'#f3f4f6', connected:false },
  { name:'Instagram',            icon:'📷', bg:'#f3f4f6', connected:false },
  { name:'Klaviyo',              icon:'✉', bg:'#f3f4f6', connected:false },
  { name:'Mailchimp',            icon:'🐒', bg:'#f3f4f6', connected:false },
  { name:'Pinterest',            icon:'📌', bg:'#f3f4f6', connected:false },
  { name:'Shopify',              icon:'🛍', bg:'#f3f4f6', connected:false },
  { name:'Snapchat',             icon:'👻', bg:'#f3f4f6', connected:false },
  { name:'TikTok',               icon:'🎵', bg:'#f3f4f6', connected:false },
  { name:'Twitter/X Ads',        icon:'𝕏', bg:'#f3f4f6', connected:false },
  { name:'YouTube',              icon:'▶', bg:'#fce4ec', connected:false },
]

const INTEGRATIONS = [
  {name:'Bing Webmaster Tools',connected:true},{name:'Facebook Ads',connected:true},
  {name:'Google Ads',connected:true},{name:'Google Analytics 4',connected:true},
  {name:'Google Search Console',connected:true},{name:'HubSpot',connected:false},
  {name:'Semrush - Backlinks',connected:true},{name:'ActiveCampaign',connected:false},
  {name:'AdRoll',connected:false},{name:'Ahrefs',connected:false},
]
const STATIC_SESSIONS = [{d:'1A',v:8000},{d:'6A',v:19000},{d:'13A',v:10000},{d:'20A',v:11000},{d:'27A',v:7000},{d:'4M',v:7000},{d:'11M',v:7500},{d:'18M',v:8000},{d:'25M',v:7000}]
const STATIC_DEVICES = [{name:'Mobile',v:56564},{name:'Desktop',v:31740},{name:'Tablet',v:785}]
const STATIC_DONUT = [{name:'Organic Search',value:68639,color:'#2196f3'},{name:'Direct',value:30294,color:'#64b5f6'},{name:'Paid Social',value:8288,color:'#90caf9'},{name:'Organic Social',value:6570,color:'#bbdefb'}]
const STATIC_CITIES = [{city:'Atlanta',val:25348,pct:92},{city:'(not set)',val:7210,pct:26},{city:'Singapore',val:1689,pct:6},{city:'Marietta',val:1558,pct:6}]

const KPI_BG: Record<string,{bg:string;border:string;text:string;sub:string}> = {
  white:{bg:'#fff',border:'#e5e5e5',text:'#1a1a1a',sub:'#666'},
  blue:{bg:'#48b5ea',border:'#48b5ea',text:'#fff',sub:'rgba(255,255,255,0.85)'},
  green:{bg:'#4caf82',border:'#4caf82',text:'#fff',sub:'rgba(255,255,255,0.85)'},
  red:{bg:'#ef5350',border:'#ef5350',text:'#fff',sub:'rgba(255,255,255,0.85)'},
}

interface Widget { id:string; title:string; dataSource:string; chartType:string; tooltip:string; color:string; value:string; change:string; up:boolean }

function formatNum(n: number) {
  if (n>=1000000) return (n/1000000).toFixed(1)+'M'
  if (n>=1000) return (n/1000).toFixed(1)+'K'
  return n.toString()
}

const ADD_DASHBOARD_OPTIONS = [
  { icon:'🧩', title:'Add a page template', desc:'Choose from a ready-made template or one of your saved pages' },
  { icon:'✦',  title:'Build a page using AI', desc:"Tell AI what you're trying to achieve, and watch it build your page" },
  { icon:'⧉',  title:'Clone existing page', desc:'Copy a page from another page' },
  { icon:'⊞',  title:'Smart Dashboard', desc:'Generate a dashboard from your connected integrations' },
]


function NewDashCanvas() {
  const options = [
    {
      title: 'Add a page template',
      desc: 'Choose from a ready-made template
or one of your saved pages',
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="12" height="12" rx="2" fill="#D0D0D0"/>
          <rect x="20" y="4" width="12" height="12" rx="2" fill="#D0D0D0"/>
          <rect x="4" y="20" width="12" height="7" rx="1.5" fill="#E8E8E8"/>
          <rect x="20" y="20" width="12" height="7" rx="1.5" fill="#E8E8E8"/>
          <circle cx="10" cy="30" r="2.5" fill="#48b5ea"/>
        </svg>
      ),
    },
    {
      title: 'Build a page using AI',
      desc: "Tell AI what you're trying to achieve,
and watch it build your page",
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="12" stroke="#D0D0D0" strokeWidth="2"/>
          <circle cx="18" cy="10" r="3" fill="#D0D0D0"/>
          <path d="M14 18 L17 21 L23 15" stroke="#48b5ea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M26 10 L28 14 L32 12" stroke="#D0D0D0" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      title: 'Clone existing page',
      desc: 'Copy a page from another page',
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="8" width="18" height="22" rx="2" stroke="#D0D0D0" strokeWidth="2"/>
          <rect x="13" y="6" width="18" height="22" rx="2" stroke="#D0D0D0" strokeWidth="2" fill="#FAFAFA"/>
          <path d="M18 13 h8" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M18 17 h6" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M18 21 h7" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      title: 'Smart Dashboard',
      desc: 'Generate a dashboard from your
connected integrations',
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="9" width="28" height="18" rx="2" stroke="#D0D0D0" strokeWidth="2"/>
          <path d="M4 15 h28" stroke="#D0D0D0" strokeWidth="1.5"/>
          <rect x="8" y="19" width="7" height="5" rx="1" fill="#E0E0E0"/>
          <rect x="20" y="19" width="7" height="5" rx="1" fill="#48b5ea" fillOpacity="0.35"/>
          <rect x="14" y="27" width="8" height="2" rx="1" fill="#D0D0D0"/>
        </svg>
      ),
    },
  ]
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:6, background:'#f8f9fa' }}>
      <p style={{ fontSize:15, color:'#555', marginBottom:2 }}>Start building by dragging widgets</p>
      <p style={{ fontSize:13, color:'#bbb', marginBottom:20 }}>or</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, width:520 }}>
        {options.map(opt => (
          <button key={opt.title}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'30px 24px', background:'#fff', border:'1px solid #e8e8e8', borderRadius:8, cursor:'pointer', textAlign:'center' as const, transition:'border-color 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor='#c8c8c8'; b.style.boxShadow='0 2px 8px rgba(0,0,0,0.07)' }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor='#e8e8e8'; b.style.boxShadow='none' }}
          >
            <div style={{ width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center' }}>{opt.icon}</div>
            <div>
              <p style={{ fontSize:14, fontWeight:500, color:'#1a1a1a', marginBottom:6 }}>{opt.title}</p>
              <p style={{ fontSize:12, color:'#aaa', lineHeight:1.6, whiteSpace:'pre-line' as const }}>{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ClientWorkspace({ params }: { params: { id: string } }) {
  const clientId = params.id
  const [activeTab, setActiveTab] = useState('Dashboards')
  const [activeDash, setActiveDash] = useState('Website Performance')
  const [editMode, setEditMode] = useState(false)
  const [liveData, setLiveData] = useState(true)
  const [openSrc, setOpenSrc] = useState<Set<string>>(new Set())
  const [editingWidget, setEditingWidget] = useState<Widget|null>(null)
  const [editTab, setEditTab] = useState<'General'|'Data'|'Display'>('General')
  const [drillWidget, setDrillWidget] = useState<Widget|null>(null)
  const [drillChannel, setDrillChannel] = useState('All')
  const [openMenu, setOpenMenu] = useState<string|null>(null)
  const [activeRightPanel, setActiveRightPanel] = useState<string|null>(null)
  const [integrationSearch, setIntegrationSearch] = useState('')
  const [connection, setConnection] = useState<any>(null)
  const [checkingConn, setCheckingConn] = useState(true)
  const [ga4Data, setGa4Data] = useState<any>(null)
  const [loadingData, setLoadingData] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState('')
  const [selectedSite, setSelectedSite] = useState('')
  const [dateRange, setDateRange] = useState('30daysAgo')
  const [clientName, setClientName] = useState('Client')
  const [clientDomain, setClientDomain] = useState('')
  const [showMappingModal, setShowMappingModal] = useState(false)
  const [mappingProp, setMappingProp] = useState('')
  const [mappingPropName, setMappingPropName] = useState('')
  const [mappingSite, setMappingSite] = useState('')
  const [savingMapping, setSavingMapping] = useState(false)
  const [mappingSaved, setMappingSaved] = useState(false)
  const [dashboards, setDashboards] = useState(DASHBOARDS)
  const [widgets, setWidgets] = useState<Widget[]>([
    {id:'w1',title:'Total Sessions',dataSource:'google-analytics-4 / traffic-analytics',chartType:'sparkline',tooltip:'Total sessions during the selected period.',color:'white',value:'120.5 K',change:'29%',up:true},
    {id:'w2',title:'Total Conversions',dataSource:'google-analytics-4 / conversions',chartType:'column',tooltip:'Total conversions tracked.',color:'blue',value:'3,610',change:'16%',up:false},
    {id:'w3',title:'Referring Domains',dataSource:'google-analytics-4 / referring',chartType:'line',tooltip:'Unique domains sending traffic.',color:'white',value:'6,961',change:'',up:true},
    {id:'w4',title:'Engagement Rate',dataSource:'google-analytics-4 / engagement',chartType:'area',tooltip:'Percentage of engaged sessions.',color:'green',value:'60.77%',change:'3.97%',up:false},
  ])

  useEffect(() => {
    loadClientInfo()
    checkConnection().then(() => loadMapping())
  }, [clientId])

  async function loadClientInfo() {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const sb = createClient()
      const { data } = await sb.from('clients').select('name,domain').eq('id', clientId).single()
      if (data) { setClientName(data.name); setClientDomain(data.domain||'') }
    } catch {}
  }

  async function checkConnection(): Promise<void> {
    setCheckingConn(true)
    try {
      const res = await fetch(`/api/connection?client_id=${clientId}`)
      const data = await res.json()
      setConnection(data)
      if (data.connected && data.ga4_properties?.length > 0) {
        setSelectedProperty(data.ga4_properties[0].name)
      }
    } catch { setConnection({ connected: false }) }
    finally { setCheckingConn(false) }
  }

  async function loadMapping() {
    try {
      const res = await fetch(`/api/mapping?client_id=${clientId}`)
      const data = await res.json()
      if (data.ga4_property_id) {
        setSelectedProperty(data.ga4_property_id)
        setMappingProp(data.ga4_property_id)
        setMappingPropName(data.ga4_property_name || '')
        setMappingSite(data.gsc_site_url || '')
        fetchGA4(data.ga4_property_id)
      } else {
        fetchGA4()
      }
    } catch { fetchGA4() }
  }

  async function fetchGA4(propertyId?: string) {
    const pid = propertyId || selectedProperty
    if (!pid) return
    setLoadingData(true)
    try {
      const res = await fetch(`/api/ga4?client_id=${clientId}&property_id=${pid}&start_date=${dateRange}&end_date=today`)
      const data = await res.json()
      if (data.connected) {
        setGa4Data(data)
        const totalsRow = data.timeSeries?.totals?.[0]
        const sessions = parseInt(totalsRow?.metricValues?.[0]?.value || '0')
        const users = parseInt(totalsRow?.metricValues?.[1]?.value || '0')
        const conversions = parseInt(totalsRow?.metricValues?.[2]?.value || '0')
        const engagementRate = parseFloat(totalsRow?.metricValues?.[4]?.value || '0')
        setWidgets(prev => prev.map(w => {
          if (w.id==='w1') return {...w, value: formatNum(sessions)}
          if (w.id==='w2') return {...w, value: formatNum(conversions)}
          if (w.id==='w3') return {...w, value: formatNum(users)}
          if (w.id==='w4') return {...w, value: (engagementRate * 100).toFixed(2) + '%'}
          return w
        }))
      }
    } catch {}
    finally { setLoadingData(false) }
  }

  async function saveMapping() {
    setSavingMapping(true)
    try {
      await fetch('/api/mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: clientId, ga4_property_id: mappingProp, ga4_property_name: mappingPropName, gsc_site_url: mappingSite }),
      })
      setSelectedProperty(mappingProp)
      fetchGA4(mappingProp)
      setMappingSaved(true)
      setTimeout(() => { setMappingSaved(false); setShowMappingModal(false) }, 1500)
    } catch {}
    setSavingMapping(false)
  }

  function connectGoogle() { window.location.href = `/api/auth/google?state=${clientId}` }
  async function disconnect() { await fetch(`/api/connection?client_id=${clientId}`,{method:'DELETE'}); setConnection({connected:false}); setGa4Data(null) }

  const sessionData = ga4Data?.timeSeries?.rows?.map((r: any) => ({ d: r.dimensionValues[0].value.slice(4), v: parseInt(r.metricValues[0].value) })) || STATIC_SESSIONS
  const deviceData = ga4Data?.devices?.rows?.map((r: any) => ({ name: r.dimensionValues[0].value, v: parseInt(r.metricValues[0].value) })) || STATIC_DEVICES
  const sourceData = ga4Data?.sources?.rows?.map((r: any, i: number) => ({ name: r.dimensionValues[0].value, value: parseInt(r.metricValues[0].value), color: ['#2196f3','#64b5f6','#90caf9','#bbdefb','#e3f2fd'][i%5] })) || STATIC_DONUT
  const cityData = ga4Data?.cities?.rows?.map((r: any) => ({ city: r.dimensionValues[0].value, val: parseInt(r.metricValues[0].value), pct: 100 })) || STATIC_CITIES
  const maxCity = Math.max(...cityData.map((c: any) => c.val), 1)

  function startEdit(w: Widget) { setEditingWidget({...w}); setEditTab('General'); setOpenMenu(null); setActiveRightPanel(null) }
  function openDrill(w: Widget) { if (!editMode) { setDrillWidget(w); setDrillChannel('All') } }
  function saveWidget() {
    if (!editingWidget) return
    setWidgets(prev => prev.map(w => w.id===editingWidget.id ? editingWidget : w))
    setEditingWidget(null)
  }

  function WidgetDot({ wid, onEdit }: { wid: string; onEdit: () => void }) {
    const isOpen = openMenu === wid
    return (
      <div style={{ position:'relative', display:'inline-flex' }}>
        <button onClick={e => { e.stopPropagation(); setOpenMenu(isOpen ? null : wid) }}
          style={{ background:'rgba(255,255,255,0.92)', border:'1px solid #e5e5e5', borderRadius:4, padding:'2px 6px', cursor:'pointer', display:'flex', alignItems:'center' }}>
          <MoreHorizontal size={13} style={{ color:'#555' }}/>
        </button>
        {isOpen && (
          <div style={{ position:'absolute', right:0, top:'calc(100% + 4px)', background:'#fff', border:'1px solid #e5e5e5', borderRadius:8, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', padding:4, minWidth:160, zIndex:999 }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => { onEdit(); setOpenMenu(null) }} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:'#1a1a1a', background:'none', border:'none', cursor:'pointer', borderRadius:4, textAlign:'left' as const }}>✏ Edit</button>
            <button onClick={() => setOpenMenu(null)} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:'#1a1a1a', background:'none', border:'none', cursor:'pointer', borderRadius:4, textAlign:'left' as const }}>⛶ Full Screen</button>
            <button onClick={() => setOpenMenu(null)} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:'#1a1a1a', background:'none', border:'none', cursor:'pointer', borderRadius:4, textAlign:'left' as const }}>⧉ Copy</button>
            <button onClick={() => setOpenMenu(null)} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:'#1a1a1a', background:'none', border:'none', cursor:'pointer', borderRadius:4, textAlign:'left' as const }}>❐ Clone</button>
            <button onClick={() => setOpenMenu(null)} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:'#1a1a1a', background:'none', border:'none', cursor:'pointer', borderRadius:4, textAlign:'left' as const }}>↗ Share</button>
            <div style={{ height:1, background:'#f0f0f0', margin:'2px 0' }}/>
            <button onClick={() => setOpenMenu(null)} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:'#ef4444', background:'none', border:'none', cursor:'pointer', borderRadius:4 }}>🗑 Remove</button>
          </div>
        )}
      </div>
    )
  }

  function KPICard({ w }: { w: Widget }) {
    const c = KPI_BG[w.color] || KPI_BG.white
    const isWhite = w.color === 'white'
    const isSelected = editingWidget?.id === w.id
    return (
      <div
        onClick={() => { if (editMode) startEdit(w); else openDrill(w) }}
        style={{ background:c.bg, border:`2px solid ${isSelected && editMode ? '#48b5ea' : c.border}`, borderRadius:8, padding:16, position:'relative', minHeight:110, cursor: editMode ? 'pointer' : 'default', transition:'border-color 0.15s' }}
      >
        {editMode && <div style={{ position:'absolute', top:6, left:6, cursor:'grab', color:isWhite?'#d0d0d0':'rgba(255,255,255,0.35)' }}><Grip size={13}/></div>}
        {editMode && (
          <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:6, right:6, zIndex:10, display:'flex', alignItems:'center', gap:4 }}>
            <button style={{ background:isWhite?'rgba(0,0,0,0.05)':'rgba(255,255,255,0.15)', border:'none', borderRadius:4, padding:'3px 5px', cursor:'pointer', display:'flex' }}>
              <Maximize2 size={10} style={{ color:isWhite?'#666':'rgba(255,255,255,0.7)' }}/>
            </button>
            <WidgetDot wid={w.id} onEdit={() => startEdit(w)}/>
          </div>
        )}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
          <span style={{ fontSize:12, color:c.sub, fontWeight:500 }}>{w.title}</span>
          {w.change && <span style={{ fontSize:10, fontWeight:700, marginLeft:8, padding:'2px 6px', borderRadius:4, color:isWhite?(w.up?'#22c55e':'#ef4444'):'rgba(255,255,255,0.95)', background:isWhite?(w.up?'#f0fdf4':'#fef2f2'):'rgba(255,255,255,0.18)' }}>{w.up?'▲':'▼'} {w.change}</span>}
        </div>
        <p style={{ fontSize:30, fontWeight:700, color:c.text, letterSpacing:'-0.5px', lineHeight:1 }}>{w.value}</p>
        {connection?.connected && <p style={{ fontSize:9, color:isWhite?'#22c55e':'rgba(255,255,255,0.7)', marginTop:6 }}>● Live</p>}
      </div>
    )
  }

  function ChartCard({ id, children }: { id: string; children: React.ReactNode }) {
    const w = widgets.find(x => x.id === id) || widgets[0]
    const isSelected = editingWidget?.id === id
    return (
      <div
        onClick={() => { if (editMode) startEdit(w); else openDrill(w) }}
        style={{ background:'#fff', border:`2px solid ${isSelected && editMode ? '#48b5ea' : '#e5e5e5'}`, borderRadius:8, padding:16, position:'relative', cursor: editMode ? 'pointer' : 'default', transition:'border-color 0.15s' }}
      >
        {editMode && <div style={{ position:'absolute', top:6, left:6, cursor:'grab', color:'#d0d0d0' }}><Grip size={13}/></div>}
        {editMode && (
          <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:6, right:6, zIndex:10, display:'flex', alignItems:'center', gap:4 }}>
            <button style={{ background:'rgba(0,0,0,0.04)', border:'none', borderRadius:4, padding:'3px 5px', cursor:'pointer', display:'flex' }}>
              <Maximize2 size={10} style={{ color:'#888' }}/>
            </button>
            <WidgetDot wid={id} onEdit={() => startEdit(w)}/>
          </div>
        )}
        {children}
      </div>
    )
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden', background:'#fff' }}
      onClick={() => { if (openMenu) setOpenMenu(null) }}>

      {/* Edit mode bars */}
      {editMode && (
        <>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 16px', borderBottom:'1px solid #e5e5e5', background:'#fff', flexShrink:0 }}>
            <span style={{ fontSize:14, fontWeight:700, color:'#1a1a1a' }}>Dashboard</span>
            <div style={{ width:1, height:16, background:'#e5e5e5' }}/>
            <div style={{ width:22, height:22, borderRadius:'50%', overflow:'hidden', background:'#f0f0f0', flexShrink:0 }}>
              <img src={`https://logo.clearbit.com/${clientDomain}`} alt="" style={{ width:'100%', height:'100%', objectFit:'contain' }} onError={e=>(e.currentTarget.style.display='none')}/>
            </div>
            <span style={{ fontSize:13, fontWeight:600 }}>{clientName}</span>
            <span style={{ fontSize:11, background:'#f0f0f0', color:'#666', padding:'2px 8px', borderRadius:4 }}>Client</span>
            <button onClick={() => { setEditMode(false); setEditingWidget(null); setOpenMenu(null) }}
              style={{ marginLeft:'auto', width:28, height:28, borderRadius:'50%', background:'#f5f5f5', border:'1px solid #e5e5e5', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <X size={14} style={{ color:'#555' }}/>
            </button>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderBottom:'1px solid #e5e5e5', background:'#fff', flexShrink:0 }}>
            <div style={{ display:'flex', gap:1, background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:2 }}>
              <button onClick={() => setLiveData(true)} style={{ padding:'5px 14px', borderRadius:4, fontSize:11, fontWeight:600, background:liveData?'#48b5ea':'transparent', color:liveData?'#fff':'#666', border:'none', cursor:'pointer' }}>Live Data</button>
              <button onClick={() => setLiveData(false)} style={{ padding:'5px 14px', borderRadius:4, fontSize:11, background:!liveData?'#fff':'transparent', color:!liveData?'#333':'#666', border:'none', cursor:'pointer' }}>Sample Data</button>
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
                <img src={`https://logo.clearbit.com/${clientDomain}`} alt="" style={{ width:'100%', height:'100%', objectFit:'contain' }} onError={e=>(e.currentTarget.style.display='none')}/>
              </div>
              <span style={{ fontSize:14, fontWeight:700, color:'#1a1a1a' }}>{clientName}</span>
              <ChevronDown size={14} style={{ color:'#999' }}/>
            </div>
            {!checkingConn && (
              connection?.connected ? (
                <div style={{ display:'flex', alignItems:'center', gap:6, background:'#f0fdf4', border:'1px solid #20BB71', borderRadius:20, padding:'3px 10px' }}>
                  <CheckCircle2 size={11} style={{ color:'#20BB71' }}/>
                  <span style={{ fontSize:11, color:'#20BB71', fontWeight:600 }}>{connection.email}</span>
                  <button onClick={disconnect} style={{ background:'none', border:'none', color:'#999', cursor:'pointer', fontSize:11, marginLeft:4 }}>✕</button>
                </div>
              ) : (
                <button onClick={connectGoogle} style={{ display:'flex', alignItems:'center', gap:6, background:'#48b5ea', border:'none', borderRadius:20, padding:'4px 12px', color:'#fff', fontSize:11, fontWeight:600, cursor:'pointer' }}>
                  <Plus size={11}/> Connect Google
                </button>
              )
            )}
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
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding:'8px 14px', fontSize:13, fontWeight:500, cursor:'pointer', background:'none', border:'none', color:activeTab===tab?'#1a85c8':'#666', borderBottom:activeTab===tab?'2px solid #48b5ea':'2px solid transparent' }}>{tab}</button>
            ))}
            <div style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center' }}>
              {connection?.connected && connection.ga4_properties?.length > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <select value={selectedProperty} onChange={e => { setSelectedProperty(e.target.value); fetchGA4(e.target.value) }}
                    style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'5px 10px', fontSize:11, color:'#333', maxWidth:200 }}>
                    {connection.ga4_properties.map((p: any) => (
                      <option key={p.name} value={p.name}>{p.displayName||p.name}</option>
                    ))}
                  </select>
                  <button onClick={() => { setMappingProp(selectedProperty); setShowMappingModal(true) }}
                    style={{ background: mappingPropName?'#f0fdf4':'#fff7ed', border:`1px solid ${mappingPropName?'#20BB71':'#f9b62a'}`, borderRadius:6, padding:'5px 8px', cursor:'pointer', fontSize:11, color:mappingPropName?'#20BB71':'#f59e0b', fontWeight:600, whiteSpace:'nowrap' as const }}>
                    {mappingPropName ? '✓ Mapped' : '⚙ Map Sources'}
                  </button>
                </div>
              )}
              <select value={dateRange} onChange={e => { setDateRange(e.target.value); fetchGA4() }}
                style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'5px 10px', fontSize:11, color:'#333' }}>
                <option value="7daysAgo">Last 7 days</option>
                <option value="30daysAgo">Last 30 days</option>
                <option value="90daysAgo">Last 90 days</option>
              </select>
              {connection?.connected && (
                <button onClick={() => fetchGA4()} disabled={loadingData} style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 8px', cursor:'pointer', display:'flex' }}>
                  <RefreshCw size={13} style={{ color:'#666' }}/>
                </button>
              )}
              <button style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#333', cursor:'pointer' }}>Share</button>
              <button style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 8px', cursor:'pointer' }}><Maximize2 size={13}/></button>
              <button onClick={() => setEditMode(true)} style={{ background:'#48b5ea', border:'none', borderRadius:6, padding:'6px 16px', fontSize:12, color:'#fff', cursor:'pointer', fontWeight:600 }}>Edit My Dashboards</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        {/* Left panel */}
        <div style={{ width:220, minWidth:220, borderRight:'1px solid #e5e5e5', display:'flex', flexDirection:'column', background:'#fff' }}>
          <div style={{ padding:12 }}>
            <button onClick={() => {
                const newName = 'Untitled Dashboard'
                setDashboards(prev => [...prev, newName])
                setActiveDash(newName)
                setEditMode(true)
                setActiveRightPanel('integrations')
                setEditingWidget(null)
              }}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:6, background:'#48b5ea', border:'none', borderRadius:6, padding:'8px 12px', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>
              <Plus size={13}/> {editMode ? 'Add blank dashboard' : 'Add Dashboard'}
            </button>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {dashboards.map(d => (
              <button key={d} onClick={() => setActiveDash(d)} style={{ width:'100%', textAlign:'left', padding:'9px 12px', fontSize:13, cursor:'pointer', background:'none', border:'none', fontWeight:activeDash===d?700:400, color:activeDash===d?'#1a1a1a':'#555', borderLeft:activeDash===d?'3px solid #48b5ea':'3px solid transparent', display:'flex', alignItems:'center', gap:6 }}>
                {editMode && <Grip size={12} style={{ color:'#ccc', flexShrink:0 }}/>}
                <span style={{ flex:1 }}>{d}</span>
                {editMode && <MoreHorizontal size={13} style={{ color:'#ccc' }}/>}
              </button>
            ))}
            <div style={{ padding:'10px 16px 4px' }}>
              <p style={{ fontSize:10, fontWeight:600, color:'#999', textTransform:'uppercase' as const, letterSpacing:'0.06em' }}>DATA SOURCES</p>
            </div>
            {DATA_SOURCES.map(s => (
              <button key={s} onClick={() => setOpenSrc(p => { const n = new Set(p); n.has(s)?n.delete(s):n.add(s); return n })}
                style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:8, padding:'7px 16px', fontSize:13, cursor:'pointer', background:'none', border:'none', color:'#555' }}>
                <ChevronRight size={12} style={{ transform:openSrc.has(s)?'rotate(90deg)':'none', transition:'0.15s', color:'#999' }}/>{s}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div style={{ flex:1, overflowY:'auto', background:'#f8f9fa', position:'relative' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #e5e5e5', background:'#fff', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:16, height:16, border:'2px solid #333', borderRadius:2 }}/>
            <span style={{ fontSize:14, fontWeight:700, color:'#1a1a1a' }}>{activeDash}</span>
            {loadingData && <span style={{ fontSize:11, color:'#48b5ea', marginLeft:8 }}>↻ Loading...</span>}
            {connection?.connected && !loadingData && <span style={{ fontSize:11, color:'#20BB71', marginLeft:8 }}>● Live GA4 data</span>}
          </div>
          <div style={{ padding: activeDash.startsWith('Untitled') ? 0 : 16, height: activeDash.startsWith('Untitled') ? '100%' : 'auto' }}>
            {activeDash.startsWith('Untitled') ? (
              <NewDashCanvas/>
            ) : (
            <><div style={{ background:'#48b5ea', borderRadius:8, padding:'18px 24px', marginBottom:12 }}>
              <h2 style={{ fontSize:20, fontWeight:700, color:'#fff' }}>Website Performance</h2>
              {connection?.connected && <p style={{ fontSize:11, color:'rgba(255,255,255,0.8)', marginTop:4 }}>Real-time data from {connection.email}</p>}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:10 }}>
              {widgets.map(w => <KPICard key={w.id} w={w}/>)}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:10 }}>
              <ChartCard id="c1">
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:11, color:'#666', fontWeight:500 }}>Sessions Over Time</span>
                  {connection?.connected && <span style={{ fontSize:9, color:'#20BB71', fontWeight:600 }}>● Live</span>}
                </div>
                <ResponsiveContainer width="100%" height={80}>
                  <LineChart data={sessionData}><Line type="monotone" dataKey="v" stroke="#48b5ea" strokeWidth={2} dot={false}/><Tooltip contentStyle={{ fontSize:10, borderRadius:4 }} formatter={(v:number) => [v.toLocaleString(),'Sessions']}/></LineChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard id="c2">
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:110 }}>
                  <div style={{ position:'relative', width:90, height:90 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart><Pie data={[{v:44},{v:56}]} cx="50%" cy="50%" innerRadius={28} outerRadius={40} dataKey="v" startAngle={90} endAngle={-270}><Cell fill="#f9b62a"/><Cell fill="#e5e5e5"/></Pie></PieChart>
                    </ResponsiveContainer>
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:18, fontWeight:700 }}>44</span></div>
                  </div>
                </div>
              </ChartCard>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <ChartCard id="c3">
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:11, color:'#666' }}>Conversion Rate</span>
                    <span style={{ fontSize:10, fontWeight:700, color:'#ef4444', background:'#fef2f2', padding:'2px 5px', borderRadius:4 }}>▼ 34%</span>
                  </div>
                  <span style={{ fontSize:24, fontWeight:700, color:'#1a1a1a' }}>3%</span>
                </ChartCard>
                <div
                  onClick={() => { if (editMode) startEdit(widgets[3]) }}
                  style={{ background:'#ef5350', border:`2px solid ${editingWidget?.id==='bounce' && editMode ? '#48b5ea' : '#ef5350'}`, borderRadius:8, padding:16, position:'relative', cursor: editMode ? 'pointer' : 'default' }}>
                  {editMode && <div style={{ position:'absolute', top:6, left:6, cursor:'grab', color:'rgba(255,255,255,0.35)' }}><Grip size={13}/></div>}
                  {editMode && (
                    <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:6, right:6, zIndex:10, display:'flex', gap:4 }}>
                      <button style={{ background:'rgba(255,255,255,0.2)', border:'none', borderRadius:4, padding:'3px 5px', cursor:'pointer', display:'flex' }}><Maximize2 size={10} style={{ color:'rgba(255,255,255,0.8)' }}/></button>
                      <WidgetDot wid="bounce" onEdit={() => startEdit(widgets[3])}/>
                    </div>
                  )}
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}><span style={{ fontSize:11, color:'rgba(255,255,255,0.85)' }}>Bounce Rate</span><span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.95)', background:'rgba(255,255,255,0.18)', padding:'2px 6px', borderRadius:4 }}>▲ 6.84%</span></div>
                  <p style={{ fontSize:26, fontWeight:700, color:'#fff', letterSpacing:'-0.5px' }}>39.23%</p>
                </div>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:10 }}>
              <ChartCard id="d1">
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontSize:11, fontWeight:600 }}>Users By Device</span>
                  {connection?.connected && <span style={{ fontSize:9, color:'#20BB71', fontWeight:600 }}>● Live</span>}
                </div>
                <ResponsiveContainer width="100%" height={110}>
                  <BarChart data={deviceData} barSize={26}><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize:10, fill:'#999' }}/><YAxis hide/><Tooltip contentStyle={{ fontSize:10, borderRadius:4 }} formatter={(v:number) => [v.toLocaleString(),'']}/><Bar dataKey="v" radius={[3,3,0,0]}>{deviceData.map((_:any,i:number) => <Cell key={i} fill={['#2196f3','#42a5f5','#90caf9'][i%3]}/>)}</Bar></BarChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard id="d2">
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontSize:11, fontWeight:600 }}>Top Referral Sources</span>
                  {connection?.connected && <span style={{ fontSize:9, color:'#20BB71', fontWeight:600 }}>● Live</span>}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ position:'relative', width:80, height:80, flexShrink:0 }}>
                    <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={sourceData} cx="50%" cy="50%" innerRadius={24} outerRadius={36} dataKey="value">{sourceData.map((_:any,i:number) => <Cell key={i} fill={['#2196f3','#64b5f6','#90caf9','#bbdefb'][i%4]}/>)}</Pie></PieChart></ResponsiveContainer>
                    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:9, fontWeight:700 }}>Sources</span></div>
                  </div>
                  <div style={{ flex:1 }}>{sourceData.slice(0,4).map((d:any,i:number) => <div key={d.name} style={{ display:'flex', alignItems:'center', gap:4, marginBottom:3 }}><div style={{ width:6, height:6, borderRadius:'50%', background:['#2196f3','#64b5f6','#90caf9','#bbdefb'][i%4], flexShrink:0 }}/><span style={{ fontSize:9, color:'#666', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.name}</span><span style={{ fontSize:9, fontWeight:600 }}>{d.value?.toLocaleString()}</span></div>)}</div>
                </div>
              </ChartCard>
              <ChartCard id="d3">
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontSize:12, fontWeight:600 }}>Traffic by Cities</span>
                  {connection?.connected && <span style={{ fontSize:9, color:'#20BB71', fontWeight:600 }}>● Live</span>}
                </div>
                {cityData.map((c:any) => (
                  <div key={c.city} style={{ marginBottom:8 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}><span style={{ fontSize:12 }}>{c.city}</span><span style={{ fontSize:12, fontWeight:600 }}>{c.val?.toLocaleString()}</span></div>
                    <div style={{ height:4, background:'#e5e5e5', borderRadius:2, overflow:'hidden' }}><div style={{ height:'100%', width:`${(c.val/maxCity)*100}%`, background:'#4caf82', borderRadius:2 }}/></div>
                  </div>
                ))}
              </ChartCard>
            </div>
            <ChartCard id="v1">
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                <span style={{ fontSize:12, fontWeight:600 }}>Website Views</span>
                {connection?.connected && <span style={{ fontSize:9, color:'#20BB71', fontWeight:600 }}>● Live GA4</span>}
              </div>
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={sessionData}><defs><linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#48b5ea" stopOpacity={0.3}/><stop offset="95%" stopColor="#48b5ea" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:10, fill:'#999' }}/><YAxis axisLine={false} tickLine={false} tick={{ fontSize:10, fill:'#999' }}/><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><Tooltip contentStyle={{ fontSize:10, borderRadius:4 }}/><Area type="monotone" dataKey="v" stroke="#48b5ea" fill="url(#vg)" strokeWidth={2}/></AreaChart>
              </ResponsiveContainer>
            </ChartCard>
            </>)}
          </div>
        </div>

        {/* Right panel */}
        {editMode && (
          <div style={{ display:'flex', height:'100%', borderLeft:'1px solid #e5e5e5' }}>
            {editingWidget && (
              <div style={{ width:300, minWidth:300, background:'#fff', borderRight:'1px solid #e5e5e5', display:'flex', flexDirection:'column', overflow:'hidden' }}>
                <div style={{ padding:'14px 16px', borderBottom:'1px solid #e5e5e5' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                    <button onClick={() => setEditingWidget(null)} style={{ width:28, height:28, borderRadius:'50%', background:'#f5f5f5', border:'1px solid #e5e5e5', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
                      <ChevronLeft size={14} style={{ color:'#333' }}/>
                    </button>
                    <div>
                      <p style={{ fontSize:14, fontWeight:700, color:'#1a1a1a', lineHeight:1.2 }}>Edit Widget</p>
                      <p style={{ fontSize:11, color:'#999', marginTop:2 }}>{editingWidget.dataSource}</p>
                    </div>
                  </div>
                  <div style={{ display:'flex', borderBottom:'1px solid #e5e5e5' }}>
                    {(['General','Data','Display'] as const).map(t => (
                      <button key={t} onClick={() => setEditTab(t)} style={{ flex:1, padding:'8px 0', fontSize:13, fontWeight:editTab===t?600:400, background:'none', border:'none', cursor:'pointer', color:editTab===t?'#1a85c8':'#666', borderBottom:editTab===t?'2px solid #48b5ea':'2px solid transparent' }}>{t}</button>
                    ))}
                  </div>
                </div>
                <div style={{ flex:1, overflowY:'auto', padding:16 }}>
                  {editTab==='General' && (
                    <>
                      <div style={{ marginBottom:18 }}>
                        <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#1a1a1a', marginBottom:8 }}>Title</label>
                        <input value={editingWidget.title} onChange={e => setEditingWidget({...editingWidget, title:e.target.value})}
                          style={{ width:'100%', background:'#fafafa', border:'1px solid #e5e5e5', borderRadius:6, padding:'8px 12px', fontSize:13, outline:'none', color:'#333', boxSizing:'border-box' as const }}/>
                      </div>
                      <div style={{ marginBottom:18 }}>
                        <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#1a1a1a', marginBottom:8 }}>Tooltip</label>
                        <textarea value={editingWidget.tooltip} onChange={e => setEditingWidget({...editingWidget, tooltip:e.target.value})}
                          style={{ width:'100%', background:'#fafafa', border:'1px solid #e5e5e5', borderRadius:6, padding:'8px 12px', fontSize:13, outline:'none', color:'#333', resize:'vertical' as const, minHeight:80, fontFamily:'system-ui,sans-serif', boxSizing:'border-box' as const }}/>
                      </div>
                      <div style={{ marginBottom:18 }}>
                        <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#1a1a1a', marginBottom:10 }}>Chart Type</label>
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                          {CHART_TYPES.map(ct => (
                            <button key={ct.id} onClick={() => setEditingWidget({...editingWidget, chartType:ct.id})}
                              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'12px 6px', borderRadius:8, border:`2px solid ${editingWidget.chartType===ct.id?'#48b5ea':'#e5e5e5'}`, background:editingWidget.chartType===ct.id?'#ebf7ff':'#fff', cursor:'pointer' }}>
                              <span style={{ fontSize:20 }}>{ct.icon}</span>
                              <span style={{ fontSize:11, color:editingWidget.chartType===ct.id?'#1a85c8':'#666', fontWeight:editingWidget.chartType===ct.id?600:400 }}>{ct.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderTop:'1px solid #f0f0f0', marginBottom:16 }}>
                        <span style={{ fontSize:13, fontWeight:600, color:'#1a1a1a' }}>Override Date Range</span>
                        <div style={{ width:42, height:24, borderRadius:12, background:'#e5e5e5', position:'relative', cursor:'pointer' }}>
                          <div style={{ width:20, height:20, borderRadius:'50%', background:'#fff', position:'absolute', top:2, left:2, boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
                        </div>
                      </div>
                      <button onClick={saveWidget} style={{ width:'100%', background:'#48b5ea', border:'none', borderRadius:6, padding:'10px', fontSize:13, fontWeight:600, color:'#fff', cursor:'pointer' }}>Save Changes</button>
                    </>
                  )}
                  {editTab==='Data' && (
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
                    </div>
                  )}
                  {editTab==='Display' && (
                    <div>
                      <div style={{ marginBottom:16 }}>
                        <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#1a1a1a', marginBottom:10 }}>Background Color</label>
                        <div style={{ display:'flex', gap:8 }}>
                          {[{col:'#fff',key:'white'},{col:'#48b5ea',key:'blue'},{col:'#4caf82',key:'green'},{col:'#ef5350',key:'red'}].map(({col,key}) => (
                            <div key={key} onClick={() => setEditingWidget({...editingWidget, color:key})}
                              style={{ width:30, height:30, borderRadius:6, background:col, border:`3px solid ${editingWidget.color===key?'#333':'#e5e5e5'}`, cursor:'pointer' }}/>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeRightPanel && !editingWidget && (
              <div style={{ width:300, background:'#fff', borderRight:'1px solid #e5e5e5', display:'flex', flexDirection:'column', overflow:'hidden' }}>
                {activeRightPanel==='build' && (
                  <div style={{ flex:1, overflowY:'auto', padding:20 }}>
                    {[{icon:'⊞',title:'Summarize your data with AI',desc:'Transform your data into clear, meaningful insights your clients will actually understand'},{icon:'📊',title:'Build metrics with AI',desc:'Use natural prompts to find the right widgets and instantly add the metrics that matter most'}].map(item => (
                      <div key={item.title} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'16px 0', borderBottom:'1px solid #f0f0f0', cursor:'pointer' }}>
                        <div style={{ width:36, height:36, borderRadius:8, background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:16 }}>{item.icon}</div>
                        <div style={{ flex:1 }}><p style={{ fontSize:15, fontWeight:700, color:'#1a1a1a', marginBottom:4 }}>{item.title}</p><p style={{ fontSize:13, color:'#666', lineHeight:1.5 }}>{item.desc}</p></div>
                      </div>
                    ))}
                  </div>
                )}
                {activeRightPanel==='integrations' && (
                  <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                    <div style={{ padding:'10px 12px', borderBottom:'1px solid #f0f0f0' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'7px 10px', marginBottom:8 }}>
                        <span style={{ color:'#999', fontSize:13 }}>🔍</span>
                        <input value={integrationSearch} onChange={e => setIntegrationSearch(e.target.value)} placeholder="Search" style={{ background:'transparent', border:'none', outline:'none', fontSize:13, color:'#333', width:'100%' }}/>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <span style={{ fontSize:12, fontWeight:600, color:'#333' }}>All Integrations</span>
                        <span style={{ color:'#999', fontSize:16 }}>⌄</span>
                      </div>
                    </div>
                    <div style={{ flex:1, overflowY:'auto' }}>
                      {ALL_INTEGRATIONS.filter((i:any) => i.name.toLowerCase().includes(integrationSearch.toLowerCase())).map((i:any) => (
                        <div key={i.name} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', borderBottom:'1px solid #f5f5f5', cursor:'pointer' }}
                          onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#f8f9fa'}
                          onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}>
                          <div style={{ width:22, height:22, borderRadius:4, background:i.bg||'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>{i.icon}</div>
                          <span style={{ flex:1, fontSize:13, color:i.connected?'#1a1a1a':'#888' }}>{i.name}</span>
                          <span style={{ color:'#ccc', fontSize:14 }}>›</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeRightPanel==='content' && (
                  <div style={{ flex:1, overflowY:'auto', padding:20 }}>
                    {[{icon:'Aa',title:'Title',desc:'Add page titles to structure your report'},{icon:'Aa',title:'Textbox',desc:'Create custom text alongside your data'},{icon:'≡',title:'Table of Contents',desc:'Build headings for easy navigation'},{icon:'#',title:'Stat',desc:'Spotlight key numbers'}].map(item => (
                      <div key={item.title} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'16px 0', borderBottom:'1px solid #f0f0f0', cursor:'pointer' }}>
                        <div style={{ width:32, height:32, borderRadius:6, background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:14, fontWeight:700, color:'#333' }}>{item.icon}</div>
                        <div><p style={{ fontSize:14, fontWeight:700, color:'#1a1a1a', marginBottom:4 }}>{item.title}</p><p style={{ fontSize:12, color:'#666', lineHeight:1.5 }}>{item.desc}</p></div>
                      </div>
                    ))}
                  </div>
                )}
                {activeRightPanel==='media' && (
                  <div style={{ flex:1, overflowY:'auto', padding:20 }}>
                    {[{icon:'🖼',title:'Image',desc:'Add images, graphics, or logos'},{icon:'</>',title:'Embed',desc:'Pull in live content from YouTube, Google Sheets, and more'}].map(item => (
                      <div key={item.title} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'16px 0', borderBottom:'1px solid #f0f0f0', cursor:'pointer' }}>
                        <div style={{ width:32, height:32, borderRadius:6, background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:14, fontWeight:700 }}>{item.icon}</div>
                        <div><p style={{ fontSize:14, fontWeight:700, color:'#1a1a1a', marginBottom:4 }}>{item.title}</p><p style={{ fontSize:12, color:'#666', lineHeight:1.5 }}>{item.desc}</p></div>
                      </div>
                    ))}
                  </div>
                )}
                {activeRightPanel==='metrics' && (
                  <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
                    <div style={{ padding:12, borderBottom:'1px solid #f0f0f0' }}>
                      <button style={{ width:'100%', background:'#48b5ea', border:'none', borderRadius:6, padding:'10px', fontSize:13, fontWeight:600, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><Plus size={14}/> Add Custom Metric</button>
                    </div>
                    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, textAlign:'center' }}>
                      <div style={{ width:60, height:60, borderRadius:'50%', background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, fontSize:24 }}>✏️</div>
                      <p style={{ fontSize:13, color:'#555', lineHeight:1.6 }}>No custom metrics yet</p>
                    </div>
                  </div>
                )}
                {activeRightPanel==='benchmarks' && (
                  <div style={{ flex:1, overflowY:'auto', padding:20 }}>
                    <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'16px 0', cursor:'pointer' }}>
                      <div style={{ width:32, height:32, borderRadius:6, background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:16 }}>⚖️</div>
                      <div><p style={{ fontSize:14, fontWeight:700, color:'#1a1a1a', marginBottom:4 }}>Benchmark</p><p style={{ fontSize:12, color:'#666', lineHeight:1.5 }}>Visualize your client's performance against others</p></div>
                    </div>
                  </div>
                )}
                {activeRightPanel==='goals' && (
                  <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
                    <div style={{ padding:12, borderBottom:'1px solid #f0f0f0' }}>
                      <button style={{ width:'100%', background:'#48b5ea', border:'none', borderRadius:6, padding:'10px', fontSize:13, fontWeight:600, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><Plus size={14}/> Add Goal</button>
                    </div>
                    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, textAlign:'center' }}>
                      <div style={{ width:60, height:60, borderRadius:'50%', background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, fontSize:24 }}>🚩</div>
                      <p style={{ fontSize:13, color:'#555', lineHeight:1.6 }}>No goals yet</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div style={{ width:80, minWidth:80, background:'#fff', display:'flex', flexDirection:'column', alignItems:'center', padding:'12px 0', gap:2 }}>
              {RIGHT_PANEL_ITEMS.map(item => (
                <button key={item.id}
                  onClick={() => { setActiveRightPanel(activeRightPanel===item.id ? null : item.id); setEditingWidget(null) }}
                  style={{ width:68, padding:'10px 4px', display:'flex', flexDirection:'column', alignItems:'center', gap:5, border:'none', cursor:'pointer', borderRadius:8, transition:'background 0.1s', background:activeRightPanel===item.id?'#f0f0f0':'none' }}>
                  <span style={{ fontSize:18, lineHeight:1 }}>{item.icon}</span>
                  <span style={{ fontSize:9, color:activeRightPanel===item.id?'#333':'#666', textAlign:'center', lineHeight:1.3, whiteSpace:'pre-line', fontWeight:activeRightPanel===item.id?600:400 }}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Drill-down panel */}
      {drillWidget && !editMode && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200, display:'flex', alignItems:'stretch', justifyContent:'flex-end' }}
          onClick={() => setDrillWidget(null)}>
          <div style={{ width:'82%', background:'#fff', display:'flex', flexDirection:'column', overflow:'hidden' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding:'14px 24px', borderBottom:'1px solid #e5e5e5', display:'flex', alignItems:'center', gap:12, background:'#fff', flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:15, fontWeight:700, color:'#1a1a1a' }}>All Channels</span>
                <div style={{ background:'#f0f0f0', border:'1px solid #e5e5e5', borderRadius:6, padding:'4px 12px', fontSize:12, color:'#333', display:'flex', alignItems:'center', gap:6 }}>
                  Account is <strong>Atlanta BeltLine Website</strong>
                </div>
                <button style={{ background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'4px 12px', fontSize:12, color:'#333', cursor:'pointer' }}>+ Add Filter</button>
                <button style={{ background:'none', border:'none', fontSize:12, color:'#999', cursor:'pointer' }}>Clear All</button>
              </div>
              <button onClick={() => setDrillWidget(null)} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', fontSize:20, color:'#999' }}>✕</button>
            </div>
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'#999', fontSize:14 }}>
              Drill-down panel — integrate DrillDownPanel component here
            </div>
          </div>
        </div>
      )}


      {/* Map Data Sources Modal */}
      {showMappingModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:16 }}
          onClick={() => setShowMappingModal(false)}>
          <div style={{ background:'#fff', borderRadius:12, width:'100%', maxWidth:480, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ height:3, background:'#20BB71' }}/>
            <div style={{ padding:28 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <div>
                  <h2 style={{ fontSize:16, fontWeight:700, color:'#1a1a1a', marginBottom:2 }}>Map Data Sources</h2>
                  <p style={{ fontSize:12, color:'#999' }}>Set default data sources for <strong>{clientName}</strong></p>
                </div>
                <button onClick={() => setShowMappingModal(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#999', fontSize:18 }}>✕</button>
              </div>
              <div style={{ borderRadius:8, background:'#f8f9fa', border:'1px solid #e5e5e5', padding:16, marginBottom:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <div style={{ width:28, height:28, borderRadius:6, background:'#e8f5e9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>📊</div>
                  <div><p style={{ fontSize:12, fontWeight:700, color:'#1a1a1a' }}>Google Analytics 4</p><p style={{ fontSize:11, color:'#999' }}>Select the GA4 property for this client</p></div>
                </div>
                <select value={mappingProp}
                  onChange={e => { setMappingProp(e.target.value); const p = connection?.ga4_properties?.find((x: any) => x.name===e.target.value); setMappingPropName(p?.displayName||e.target.value) }}
                  style={{ width:'100%', background:'#fff', border:'1px solid #e5e5e5', borderRadius:6, padding:'9px 12px', fontSize:13, outline:'none', color:'#333', cursor:'pointer' }}>
                  <option value="">— Select GA4 Property —</option>
                  {connection?.ga4_properties?.map((p: any) => (
                    <option key={p.name} value={p.name}>{p.displayName||p.name}</option>
                  ))}
                </select>
              </div>
              {connection?.gsc_sites?.length > 0 && (
                <div style={{ borderRadius:8, background:'#f8f9fa', border:'1px solid #e5e5e5', padding:16, marginBottom:16 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    <div style={{ width:28, height:28, borderRadius:6, background:'#e3f2fd', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>🔍</div>
                    <div><p style={{ fontSize:12, fontWeight:700, color:'#1a1a1a' }}>Google Search Console</p><p style={{ fontSize:11, color:'#999' }}>Select the GSC site for this client</p></div>
                  </div>
                  <select value={mappingSite} onChange={e => setMappingSite(e.target.value)}
                    style={{ width:'100%', background:'#fff', border:'1px solid #e5e5e5', borderRadius:6, padding:'9px 12px', fontSize:13, outline:'none', color:'#333', cursor:'pointer' }}>
                    <option value="">— Select GSC Site —</option>
                    {connection?.gsc_sites?.map((s: any) => (
                      <option key={s.siteUrl} value={s.siteUrl}>{s.siteUrl}</option>
                    ))}
                  </select>
                </div>
              )}
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => setShowMappingModal(false)}
                  style={{ flex:1, background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:8, padding:'10px', fontSize:13, color:'#666', cursor:'pointer', fontWeight:500 }}>Cancel</button>
                <button onClick={saveMapping} disabled={!mappingProp||savingMapping}
                  style={{ flex:2, background:mappingSaved?'#20BB71':'#48b5ea', border:'none', borderRadius:8, padding:'10px', fontSize:13, fontWeight:600, color:'#fff', cursor:'pointer', opacity:!mappingProp||savingMapping?0.6:1, transition:'background 0.2s' }}>
                  {mappingSaved ? '✓ Saved!' : savingMapping ? 'Saving...' : 'Save & Apply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
