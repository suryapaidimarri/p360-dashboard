'use client'
import React from 'react'
import { MoreHorizontal, Maximize2, X, Grip, Plus, Edit, Copy, Trash2, Link2, LayoutGrid } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ScatterChart, Scatter as ScatterPlot, ZAxis } from 'recharts'


// ── Alloy Design System tokens (JS constants for inline styles) ─────────────
export const ALLOY = {
  // Colors
  ink:     '#111111',
  white:   '#FFFFFF',
  paper:   '#FAFAFA',
  line:    '#E6E6E6',
  mute:    '#6B6B6B',
  green1:  '#20BB71',
  green2:  '#3FDB90',
  green3:  '#6FF5B5',
  green4:  '#C2FFE2',
  blue1:   '#48B5EA',
  blue2:   '#5BD1F2',
  blue3:   '#A4E6F3',
  blue4:   '#E1F7FF',
  yellow1: '#F9B62A',
  yellow2: '#FDC550',
  yellow3: '#FFD98B',
  yellow4: '#FFEECA',
  red1:    '#F53619',
  red2:    '#F64674',
  red3:    '#FFA9C3',
  red4:    '#FFCFDC',
  // Typography
  fontDisplay: "'Aeonik','DM Sans',system-ui,sans-serif",
  fontBody:    "'DM Sans',system-ui,sans-serif",
  fontLabel:   "'Barlow','DM Sans',system-ui,sans-serif",
  // Spacing (8pt grid)
  sp1: 4, sp2: 8, sp3: 12, sp4: 16, sp5: 24, sp6: 32, sp7: 48,
  // Label style shorthand
  label: { fontFamily:"'Barlow','DM Sans',system-ui,sans-serif", fontSize:9, fontWeight:600, textTransform:'uppercase' as const, letterSpacing:'0.1em', color:'#6B6B6B' },
} as const

// Only these dashboards have real widget content.
// Everything else (cloned, newly added, 'oiijuyuh', etc.) shows the empty canvas.
const REAL_DASHBOARDS = ['Website Performance', 'Paid Media', 'Organic + AI Search', 'Donations Trend']

const INITIAL_DASHBOARDS = ['Website Performance','Paid Media','Organic + AI Search','Donations Trend','oiijuyuh']
const DATA_SOURCES = ['SEO','Analytics','Social','Paid Ads']
const TABS = ['Dashboards','Reports','Data Sources','Goals','Client Portal','Benchmarks','More']
const RIGHT_PANEL_ITEMS = [
  {id:'build',icon:'✦',label:'Build with AI'},
  {id:'charts',icon:'📈',label:'Add Chart'},
  {id:'integrations',icon:'📊',label:'Integrations\nMetrics'},
  {id:'content',icon:'Aa',label:'Content\nBlocks'},
  {id:'media',icon:'🖼',label:'Media'},
  {id:'metrics',icon:'⊕',label:'Custom\nMetrics'},
  {id:'benchmarks',icon:'⚖',label:'Benchmarks'},
  {id:'goals',icon:'◎',label:'Goals'},
]
const CHART_TYPE_GROUPS = [
  { group:'Table', types:[
    { id:'table',       label:'Table' },
    { id:'pivot',       label:'Pivot' },
  ]},
  { group:'Scorecard', types:[
    { id:'scorecard',   label:'Scorecard' },
    { id:'scorecard2',  label:'Scorecard' },
  ]},
  { group:'Time Series', types:[
    { id:'timeseries',  label:'Smooth' },
    { id:'timeseries2', label:'Jagged' },
    { id:'sparkline',   label:'Sparkline' },
  ]},
  { group:'Bar', types:[
    { id:'column',      label:'Column' },
    { id:'bar',         label:'Bar' },
    { id:'stackedbar',  label:'Stacked' },
    { id:'combo',       label:'Line+Bar' },
    { id:'hbar',        label:'H.Bar' },
    { id:'hstacked',    label:'H.Stack' },
  ]},
  { group:'Line', types:[
    { id:'line',        label:'Line' },
    { id:'multiline',   label:'Multi' },
    { id:'smoothline',  label:'Smooth' },
    { id:'waveline',    label:'Wave' },
    { id:'candlestick', label:'Candle' },
    { id:'ohlc',        label:'OHLC' },
  ]},
  { group:'Area', types:[
    { id:'area',        label:'Area' },
    { id:'stackarea',   label:'Stacked' },
    { id:'steparea',    label:'Step' },
  ]},
  { group:'Pie', types:[
    { id:'pie',         label:'Pie' },
    { id:'donut',       label:'Donut' },
  ]},
  { group:'Scatter', types:[
    { id:'scatter',     label:'Scatter' },
    { id:'bubble',      label:'Bubble' },
  ]},
  { group:'Other', types:[
    { id:'treemap',     label:'Treemap' },
    { id:'funnel',      label:'Funnel' },
    { id:'sankey',      label:'Sankey' },
    { id:'gauge',       label:'Gauge' },
    { id:'waterfall',   label:'Waterfall' },
    { id:'timeline',    label:'Timeline' },
    { id:'map',         label:'Geo Map' },
    { id:'histogram',   label:'Histogram' },
    { id:'bullet',      label:'Bullet' },
  ]},
]

// Flat list for backward compat
const CHART_TYPES = CHART_TYPE_GROUPS.flatMap(g => g.types)

const ALL_INTEGRATIONS = [
  { name:'Bing Webmaster Tools',  domain:'bing.com',          connected:true  },
  { name:'Facebook',              domain:'facebook.com',       connected:true  },
  { name:'Facebook Ads',          domain:'facebook.com',       connected:true  },
  { name:'Google Ads',            domain:'ads.google.com',     connected:true  },
  { name:'Google Analytics 4',    domain:'analytics.google.com', connected:true },
  { name:'Google Lighthouse',     domain:'developers.google.com', connected:true },
  { name:'Google Search Console', domain:'search.google.com',  connected:true  },
  { name:'Google Sheets',         domain:'sheets.google.com',  connected:true  },
  { name:'LinkedIn Ads',          domain:'linkedin.com',       connected:true  },
  { name:'Semrush - Backlinks',   domain:'semrush.com',        connected:true  },
  { name:'Semrush - Projects',    domain:'semrush.com',        connected:true  },
  { name:'ActiveCampaign',        domain:'activecampaign.com', connected:false },
  { name:'AdRoll',                domain:'adroll.com',         connected:false },
  { name:'Adform',                domain:'adform.com',         connected:false },
  { name:'Ahrefs',                domain:'ahrefs.com',         connected:false },
  { name:'Amazon Ads',            domain:'advertising.amazon.com', connected:false },
  { name:'Apple Search Ads',      domain:'searchads.apple.com', connected:false },
  { name:'Appsflyer',             domain:'appsflyer.com',      connected:false },
  { name:'Capterra',              domain:'capterra.com',       connected:false },
  { name:'Criteo',                domain:'criteo.com',         connected:false },
  { name:'DV360',                 domain:'displayvideo.google.com', connected:false },
  { name:'HubSpot',               domain:'hubspot.com',        connected:false },
  { name:'Instagram',             domain:'instagram.com',      connected:false },
  { name:'Klaviyo',               domain:'klaviyo.com',        connected:false },
  { name:'Mailchimp',             domain:'mailchimp.com',      connected:false },
  { name:'Pinterest',             domain:'pinterest.com',      connected:false },
  { name:'Shopify',               domain:'shopify.com',        connected:false },
  { name:'Snapchat',              domain:'snapchat.com',       connected:false },
  { name:'TikTok',                domain:'tiktok.com',         connected:false },
  { name:'Twitter/X Ads',         domain:'ads.twitter.com',    connected:false },
  { name:'YouTube',               domain:'youtube.com',        connected:false },
]

const STATIC_SESSIONS = [{d:'1A',v:8000},{d:'6A',v:19000},{d:'13A',v:10000},{d:'20A',v:11000},{d:'27A',v:7000},{d:'4M',v:7000},{d:'11M',v:7500},{d:'18M',v:8000},{d:'25M',v:7000}]
const STATIC_DEVICES = [{name:'Mobile',v:56564},{name:'Desktop',v:31740},{name:'Tablet',v:785}]
const STATIC_DONUT = [{name:'Organic Search',value:68639,color:'#2196f3'},{name:'Direct',value:30294,color:'#64b5f6'},{name:'Paid Social',value:8288,color:ALLOY.blue3},{name:'Organic Social',value:6570,color:'#bbdefb'}]
const STATIC_CITIES = [{city:'Atlanta',val:25348,pct:92},{city:'(not set)',val:7210,pct:26},{city:'Singapore',val:1689,pct:6},{city:'Marietta',val:1558,pct:6}]

export const KPI_BG: {[key:string]:{bg:string;border:string;text:string;sub:string}} = {
  white:{bg:ALLOY.white,border:ALLOY.line,text:ALLOY.ink,sub:ALLOY.mute},
  blue:{bg:ALLOY.blue1,border:ALLOY.blue1,text:ALLOY.white,sub:'rgba(255,255,255,0.85)'},
  green:{bg:ALLOY.green1,border:ALLOY.green1,text:ALLOY.white,sub:'rgba(255,255,255,0.85)'},
  red:{bg:ALLOY.red1,border:ALLOY.red1,text:ALLOY.white,sub:'rgba(255,255,255,0.85)'},
}

export interface Widget { id:string; title:string; dataSource:string; chartType:string; tooltip:string; color:string; value:string; change:string; up:boolean; textColor?:string; borderColor?:string; bgHex?:string; showAnomalies?:boolean; showForecast?:boolean; showIntegIcon?:boolean; metrics?:string[]; dimensions?:string[]; filters?:string[] }

function formatNum(n: number) {
  if (n>=1000000) return (n/1000000).toFixed(1)+'M'
  if (n>=1000) return (n/1000).toFixed(1)+'K'
  return n.toString()
}

// ── DynamicChart: renders the right chart based on widget.chartType ────────────
export function DynamicChart({ chartType, data, height = 80, dimensions = ['Date'], metrics = ['Sessions'], opts = {} }: { chartType: string; data: any[]; height?: number; dimensions?: string[]; metrics?: string[]; opts?: any }) {
  const colors = ['#4285f4','#ea8600','#a142f4','#34a853','#ea4335','#24c1e0']
  const c = colors[0]
  if (!data || data.length === 0) return null

  if (chartType === 'line' || chartType === 'timeseries' || chartType === 'sparkline' || chartType === 'smoothline') {
    const metLabel = metrics[0] || 'Sessions'
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <XAxis dataKey="d" hide={chartType === 'sparkline'} axisLine={false} tickLine={false} tick={{ fontSize:9, fill:ALLOY.mute }}/>
          <Line type="monotone" dataKey="v" stroke={c} strokeWidth={2} dot={false} name={metLabel}/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2 }} formatter={(v:number) => [v.toLocaleString(), metLabel]}/>
        </LineChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'area' || chartType === 'stackarea' || chartType === 'steparea') {
    const metLabel = metrics[0] || 'Sessions'
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs><linearGradient id="dcg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={c} stopOpacity={0.3}/><stop offset="95%" stopColor={c} stopOpacity={0}/></linearGradient></defs>
          <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:ALLOY.mute }}/>
          <Area type={chartType === 'steparea' ? 'step' : 'monotone'} dataKey="v" stroke={c} fill="url(#dcg)" strokeWidth={2} dot={false} name={metLabel}/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2 }} formatter={(v:number) => [v.toLocaleString(), metLabel]}/>
        </AreaChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'column' || chartType === 'bar' || chartType === 'histogram' || chartType === 'stackedbar') {
    const metLabel = metrics[0] || 'Value'
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} barSize={18}>
          <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:ALLOY.mute }}/>
          <YAxis hide/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2 }} formatter={(v:number) => [v.toLocaleString(), metLabel]}/>
          <Bar dataKey="v" radius={[3,3,0,0]} name={metLabel}>
            {data.map((_:any, i:number) => <Cell key={i} fill={colors[i % colors.length]}/>)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} dataKey="v" cx="50%" cy="50%" outerRadius={height/2 - 8}>
            {data.map((_:any, i:number) => <Cell key={i} fill={colors[i % colors.length]}/>)}
          </Pie>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2 }}/>
        </PieChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'donut') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} dataKey="v" cx="50%" cy="50%" innerRadius={height/4 - 4} outerRadius={height/2 - 8}>
            {data.map((_:any, i:number) => <Cell key={i} fill={colors[i % colors.length]}/>)}
          </Pie>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2 }}/>
        </PieChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'scorecard') {
    const total = data.reduce((s:number, d:any) => s + (d.v || 0), 0)
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height }}>
        <span style={{ fontSize:32, fontWeight:700, color:c, letterSpacing:'-1px' }}>
          {total >= 1000000 ? (total/1000000).toFixed(1)+'M' : total >= 1000 ? (total/1000).toFixed(1)+'K' : total}
        </span>
      </div>
    )
  }
  if (chartType === 'table') {
    const dimLabel = dimensions[0] || 'Dimension'
    const metLabel = metrics[0] || 'Value'
    return (
      <div style={{ height, overflowY:'auto' }}>
        <table style={{ width:'100%', fontSize:10, borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:ALLOY.paper }}>
              <th style={{ padding:'5px 8px', textAlign:'left', fontWeight:600, color:ALLOY.mute, borderBottom:`2px solid ${ALLOY.line}` }}>{dimLabel}</th>
              {metrics.map((m, i) => <th key={i} style={{ padding:'5px 8px', textAlign:'right', fontWeight:600, color:ALLOY.mute, borderBottom:`2px solid ${ALLOY.line}` }}>{m}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, Math.floor(height/22) || 6).map((d:any, i:number) => (
              <tr key={i} style={{ borderBottom:`1px solid ${ALLOY.line}`, background: i%2===0 ? ALLOY.white : ALLOY.paper }}>
                <td style={{ padding:'4px 8px', color:'#444', fontWeight:500 }}>{d.d}</td>
                {metrics.map((_, mi) => <td key={mi} style={{ padding:'4px 8px', textAlign:'right', fontWeight:600, color:ALLOY.ink }}>{d.v?.toLocaleString()}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  if (chartType === 'combo') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} barSize={14}>
          <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:ALLOY.mute }}/>
          <YAxis hide/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2 }}/>
          <Bar dataKey="v" fill={c} fillOpacity={0.4} radius={[2,2,0,0]}/>
          <Line type="monotone" dataKey="v" stroke="#ea8600" strokeWidth={2} dot={false}/>
        </BarChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'multiline' || chartType === 'waveline' || chartType === 'timeseries2') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <Line type={chartType === 'waveline' ? 'basis' : 'monotone'} dataKey="v" stroke={c} strokeWidth={2} dot={false}/>
          <Line type="monotone" dataKey="v" stroke="#ea8600" strokeWidth={1.5} dot={false} strokeDasharray="4 2"/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2 }}/>
        </LineChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'hbar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" barSize={12}>
          <XAxis type="number" hide/>
          <YAxis type="category" dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:ALLOY.mute }} width={30}/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2 }}/>
          <Bar dataKey="v" radius={[0,3,3,0]}>
            {data.map((_:any,i:number) => <Cell key={i} fill={colors[i%colors.length]}/>)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'hstacked') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data.slice(0,4)} layout="vertical" barSize={10}>
          <XAxis type="number" hide/>
          <YAxis type="category" dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:ALLOY.mute }} width={30}/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2 }}/>
          <Bar dataKey="v" stackId="a" fill={c} radius={[0,3,3,0]}/>
        </BarChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'scatter' || chartType === 'bubble') {
    const scatterData = data.map((d:any, i:number) => ({ x: i * 10, y: d.v, z: chartType === 'bubble' ? Math.max(10, (d.v % 500) + 20) : 20 }))
    return (
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{ top:4, right:4, bottom:4, left:4 }}>
          <XAxis type="number" dataKey="x" hide/>
          <YAxis type="number" dataKey="y" hide/>
          {chartType === 'bubble' && <ZAxis type="number" dataKey="z" range={[20, 80]}/>}
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2 }} formatter={(v:number) => [v.toLocaleString(),'']}/>
          <ScatterPlot data={scatterData} fill={c}/>
        </ScatterChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'candlestick' || chartType === 'ohlc') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} barSize={6}>
          <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:ALLOY.mute }}/>
          <YAxis hide/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2 }}/>
          <Bar dataKey="v" radius={[2,2,0,0]}>
            {data.map((d:any,i:number) => <Cell key={i} fill={i%2===0?'#34a853':'#ea4335'}/>)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'waterfall') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} barSize={16}>
          <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:ALLOY.mute }}/>
          <YAxis hide/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2 }}/>
          <Bar dataKey="v" radius={[3,3,0,0]}>
            {data.map((d:any,i:number) => <Cell key={i} fill={i===data.length-1?'#ea4335':i%2===0?c:'#34a853'}/>)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'funnel') {
    const maxV = Math.max(...data.map((d:any)=>d.v))
    return (
      <div style={{ height, display:'flex', flexDirection:'column', justifyContent:'center', gap:3, padding:'0 8px' }}>
        {data.slice(0,5).map((d:any,i:number) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ height:14, borderRadius:2, background:colors[i%colors.length], transition:'width 0.3s' , width:`${Math.max(20,(d.v/maxV)*100)}%`}}/>
            <span style={{ fontSize:9, color:ALLOY.mute, whiteSpace:'nowrap' }}>{d.d}</span>
          </div>
        ))}
      </div>
    )
  }
  if (chartType === 'treemap') {
    return (
      <div style={{ height, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:2, padding:'4px' }}>
        {data.slice(0,4).map((d:any,i:number) => (
          <div key={i} style={{ background:colors[i%colors.length], borderRadius:3, display:'flex', alignItems:'center', justifyContent:'center', opacity:0.8 }}>
            <span style={{ fontSize:9, color:ALLOY.white, fontWeight:600 }}>{d.d}</span>
          </div>
        ))}
      </div>
    )
  }
  if (chartType === 'gauge') {
    const maxV = Math.max(...data.map((d:any)=>d.v), 1)
    const latest = data[data.length-1]?.v || 0
    const pct = Math.min(latest/maxV, 1)
    const angle = -140 + pct * 280
    return (
      <div style={{ height, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width={height*2} height={height} viewBox={`0 0 ${height*2} ${height}`}>
          <path d={`M ${height*0.15} ${height*0.9} A ${height*0.7} ${height*0.7} 0 0 1 ${height*1.85} ${height*0.9}`} stroke="#e0e0e0" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d={`M ${height*0.15} ${height*0.9} A ${height*0.7} ${height*0.7} 0 0 1 ${height*1.85} ${height*0.9}`} stroke={c} strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={`${pct*2.19*(height*0.7)} 999`}/>
          <circle cx={height} cy={height*0.9} r="3" fill="#333"/>
        </svg>
      </div>
    )
  }
  if (chartType === 'timeline' || chartType === 'sankey') {
    return (
      <div style={{ height, display:'flex', flexDirection:'column', justifyContent:'center', gap:4, padding:'0 8px' }}>
        {data.slice(0,4).map((d:any,i:number) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:colors[i%colors.length], flexShrink:0 }}/>
            <div style={{ flex:1, height:10, borderRadius:2, background:colors[i%colors.length], opacity:0.7, width:`${30+i*15}%` }}/>
            <span style={{ fontSize:9, color:ALLOY.mute }}>{d.d}</span>
          </div>
        ))}
      </div>
    )
  }
  if (chartType === 'bullet') {
    const maxV = Math.max(...data.map((d:any)=>d.v), 1)
    const latest = data[data.length-1]?.v || 0
    return (
      <div style={{ height, display:'flex', flexDirection:'column', justifyContent:'center', padding:'0 8px', gap:8 }}>
        {data.slice(0,3).map((d:any,i:number) => (
          <div key={i}>
            <div style={{ height:12, background:ALLOY.line, borderRadius:2, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', left:0, top:2, height:8, width:`${(d.v/maxV)*80}%`, background:ALLOY.line, borderRadius:2 }}/>
              <div style={{ position:'absolute', left:0, top:3, height:6, width:`${(d.v/maxV)*60}%`, background:c, borderRadius:2 }}/>
            </div>
          </div>
        ))}
      </div>
    )
  }
  if (chartType === 'map') {
    return (
      <div style={{ height, display:'flex', alignItems:'center', justifyContent:'center', background:ALLOY.blue4, borderRadius:2, position:'relative', overflow:'hidden' }}>
        <svg width="100%" height="100%" viewBox="0 0 200 120">
          <ellipse cx="100" cy="60" rx="90" ry="55" fill="#c8e6f5" stroke="#90caf9" strokeWidth="1"/>
          <path d="M10 60 Q50 50 100 60 Q150 70 190 60" stroke="#90caf9" strokeWidth="1" fill="none"/>
          <circle cx="80" cy="50" r="5" fill="#4285f4" opacity="0.8"/>
          <circle cx="120" cy="65" r="4" fill="#ea4335" opacity="0.8"/>
          <circle cx="60" cy="70" r="3" fill="#34a853" opacity="0.8"/>
        </svg>
      </div>
    )
  }
  if (chartType === 'pivot' || chartType === 'scorecard2') {
    const dimLabel = dimensions[0] || 'Dimension'
    return (
      <div style={{ height, overflowY:'auto' }}>
        <table style={{ width:'100%', fontSize:10, borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:ALLOY.blue4 }}>
              <th style={{ padding:'4px 8px', textAlign:'left', fontWeight:600, color:ALLOY.mute, borderBottom:`2px solid ${ALLOY.blue3}` }}>{dimLabel}</th>
              {metrics.map((m, i) => <th key={i} style={{ padding:'4px 8px', textAlign:'right', fontWeight:600, color:ALLOY.mute, borderBottom:`2px solid ${ALLOY.blue3}` }}>{m}</th>)}
              <th style={{ padding:'4px 8px', textAlign:'right', fontWeight:600, color:ALLOY.mute, borderBottom:'2px solid #c5cae9' }}>Avg/Day</th>
            </tr>
          </thead>
          <tbody>{data.slice(0,6).map((d:any,i:number) => (
            <tr key={i} style={{ borderBottom:`1px solid ${ALLOY.line}`, background: i%2===0?ALLOY.white:ALLOY.paper }}>
              <td style={{ padding:'4px 8px', color:'#444', fontWeight:500 }}>{d.d}</td>
              {metrics.map((_,mi) => <td key={mi} style={{ padding:'4px 8px', textAlign:'right', fontWeight:600, color:ALLOY.ink }}>{d.v?.toLocaleString()}</td>)}
              <td style={{ padding:'4px 8px', textAlign:'right', color:ALLOY.mute }}>{Math.round(d.v/30).toLocaleString()}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    )
  }
  // Default fallback — line
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="v" stroke={c} strokeWidth={2} dot={false}/>
        <Tooltip contentStyle={{ fontSize:10, borderRadius:2 }}/>
      </LineChart>
    </ResponsiveContainer>
  )
}

// ── Empty canvas shown for any dashboard not in REAL_DASHBOARDS ──────────────
export function NewDashCanvas({ onClone }: { onClone: () => void }) {
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', background:ALLOY.paper }}>
      <p style={{ fontSize:15, color:ALLOY.ink, marginBottom:2 }}>Start building by dragging widgets</p>
      <p style={{ fontSize:13, color:ALLOY.mute, marginBottom:20 }}>or</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, width:520 }}>

        {/* Add a page template */}
        <button style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'30px 24px', background:ALLOY.white, border:'1px solid #e8e8e8', borderRadius:2, cursor:'pointer', textAlign:'center' as const }}>
          <div style={{ width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="4" width="12" height="12" rx="2" fill="#D0D0D0"/><rect x="20" y="4" width="12" height="12" rx="2" fill="#D0D0D0"/><rect x="4" y="20" width="12" height="7" rx="1.5" fill="#E8E8E8"/><rect x="20" y="20" width="12" height="7" rx="1.5" fill="#E8E8E8"/><circle cx="10" cy="30" r="2.5" fill="#48b5ea"/></svg>
          </div>
          <div>
            <p style={{ fontSize:14, fontWeight:500, color:ALLOY.ink, marginBottom:6 }}>Add a page template</p>
            <p style={{ fontSize:12, color:ALLOY.mute, lineHeight:1.6 }}>Choose from a ready-made template or one of your saved pages</p>
          </div>
        </button>

        {/* Build a page using AI */}
        <button style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'30px 24px', background:ALLOY.white, border:'1px solid #e8e8e8', borderRadius:2, cursor:'pointer', textAlign:'center' as const }}>
          <div style={{ width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="12" stroke="#D0D0D0" strokeWidth="2"/><circle cx="18" cy="10" r="3" fill="#D0D0D0"/><path d="M14 18 L17 21 L23 15" stroke="#48b5ea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M26 10 L28 14 L32 12" stroke="#D0D0D0" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <div>
            <p style={{ fontSize:14, fontWeight:500, color:ALLOY.ink, marginBottom:6 }}>Build a page using AI</p>
            <p style={{ fontSize:12, color:ALLOY.mute, lineHeight:1.6 }}>Tell AI what you're trying to achieve, and watch it build your page</p>
          </div>
        </button>

        {/* Clone existing page */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClone(); }}
          style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'30px 24px', background:ALLOY.white, border:'1px solid #e8e8e8', borderRadius:2, cursor:'pointer', textAlign:'center' as const }}>
          <div style={{ width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="5" y="8" width="18" height="22" rx="2" stroke="#D0D0D0" strokeWidth="2"/><rect x="13" y="6" width="18" height="22" rx="2" stroke="#D0D0D0" strokeWidth="2" fill="#FAFAFA"/><path d="M18 13 h8" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round"/><path d="M18 17 h6" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round"/><path d="M18 21 h7" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <div>
            <p style={{ fontSize:14, fontWeight:500, color:ALLOY.ink, marginBottom:6 }}>Clone existing page</p>
            <p style={{ fontSize:12, color:ALLOY.mute, lineHeight:1.6 }}>Copy a page from another page</p>
          </div>
        </button>

        {/* Smart Dashboard */}
        <button style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'30px 24px', background:ALLOY.white, border:'1px solid #e8e8e8', borderRadius:2, cursor:'pointer', textAlign:'center' as const }}>
          <div style={{ width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="9" width="28" height="18" rx="2" stroke="#D0D0D0" strokeWidth="2"/><path d="M4 15 h28" stroke="#D0D0D0" strokeWidth="1.5"/><rect x="8" y="19" width="7" height="5" rx="1" fill="#E0E0E0"/><rect x="20" y="19" width="7" height="5" rx="1" fill="#48b5ea" fillOpacity="0.35"/><rect x="14" y="27" width="8" height="2" rx="1" fill="#D0D0D0"/></svg>
          </div>
          <div>
            <p style={{ fontSize:14, fontWeight:500, color:ALLOY.ink, marginBottom:6 }}>Smart Dashboard</p>
            <p style={{ fontSize:12, color:ALLOY.mute, lineHeight:1.6 }}>Generate a dashboard from your connected integrations</p>
          </div>
        </button>

      </div>
    </div>
  )
}

// ── Chart thumbnail SVGs (matches Looker Studio visual style) ─────────────────
export function ChartThumbSvg({ id, active }: { id: string; active: boolean }) {
  const B = active ? '#1a73e8' : '#4285f4'
  const B2 = active ? '#4285f4' : '#ea8600'
  const B3 = active ? '#669df6' : '#a142f4'
  const G = '#34a853'; const R = '#ea4335'; const O = '#ea8600'
  const s = { width:44, height:30 } as const
  if (id==='table')       return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect width="44" height="7" rx="2" fill="#e8f0fe"/><line x1="0" y1="7" x2="44" y2="7" stroke="#e0e0e0"/><line x1="0" y1="15" x2="44" y2="15" stroke="#e0e0e0"/><line x1="0" y1="23" x2="44" y2="23" stroke="#e0e0e0"/><line x1="15" y1="0" x2="15" y2="30" stroke="#e0e0e0"/><line x1="30" y1="0" x2="30" y2="30" stroke="#e0e0e0"/><rect x="1" y="8" width="13" height="6" rx="1" fill={B} fillOpacity="0.2"/><rect x="16" y="16" width="13" height="6" rx="1" fill={B} fillOpacity="0.3"/></svg>
  if (id==='pivot')       return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect width="44" height="7" rx="2" fill="#e8eaf6"/><rect x="0" y="0" width="15" height="30" fill="#e8eaf6" fillOpacity="0.5"/><line x1="0" y1="7" x2="44" y2="7" stroke="#e0e0e0"/><line x1="0" y1="15" x2="44" y2="15" stroke="#e0e0e0"/><line x1="0" y1="23" x2="44" y2="23" stroke="#e0e0e0"/><line x1="15" y1="0" x2="15" y2="30" stroke="#e0e0e0"/><rect x="16" y="8" width="27" height="6" rx="1" fill={B} fillOpacity="0.2"/></svg>
  if (id==='scorecard')   return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><text x="6" y="12" fontSize="6" fill="#777" fontFamily="sans-serif">Total</text><text x="6" y="24" fontSize="11" fontWeight="bold" fill="#222" fontFamily="sans-serif">1,168</text></svg>
  if (id==='scorecard2')  return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><text x="4" y="12" fontSize="6" fill="#777" fontFamily="sans-serif">Sessions</text><text x="4" y="24" fontSize="10" fontWeight="bold" fill="#222" fontFamily="sans-serif">69.3K</text></svg>
  if (id==='timeseries')  return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><polyline points="2,24 10,16 18,20 26,10 34,14 42,8" stroke={B} strokeWidth="2" fill="none" strokeLinecap="round"/><polyline points="2,28 10,22 18,24 26,18 34,20 42,16" stroke={O} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
  if (id==='timeseries2') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><polyline points="2,24 6,12 10,20 14,8 18,18 22,10 26,22 30,6 34,16 38,8 42,14" stroke={B} strokeWidth="1.5" fill="none" strokeLinecap="round"/><polyline points="2,26 6,18 10,24 14,12 18,22 22,14 26,26 30,10 34,20 38,12 42,18" stroke={O} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
  if (id==='sparkline')   return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><polyline points="2,24 10,18 18,22 26,12 34,16 42,10" stroke={B} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
  if (id==='column')      return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="3" y="18" width="6" height="10" fill={B}/><rect x="11" y="10" width="6" height="18" fill={B}/><rect x="19" y="14" width="6" height="14" fill={B}/><rect x="27" y="8" width="6" height="20" fill={B}/><rect x="35" y="16" width="6" height="12" fill={B}/></svg>
  if (id==='bar')         return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="3" y="18" width="6" height="10" fill={B}/><rect x="11" y="10" width="6" height="18" fill={O}/><rect x="19" y="14" width="6" height="14" fill={B}/><rect x="27" y="8" width="6" height="20" fill={O}/><rect x="35" y="16" width="6" height="12" fill={B}/></svg>
  if (id==='stackedbar')  return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="3" y="22" width="6" height="6" fill={B}/><rect x="3" y="16" width="6" height="6" fill={O}/><rect x="11" y="18" width="6" height="10" fill={B}/><rect x="11" y="12" width="6" height="6" fill={O}/><rect x="19" y="20" width="6" height="8" fill={B}/><rect x="19" y="14" width="6" height="6" fill={O}/><rect x="27" y="16" width="6" height="12" fill={B}/><rect x="27" y="10" width="6" height="6" fill={O}/><rect x="35" y="20" width="6" height="8" fill={B}/><rect x="35" y="14" width="6" height="6" fill={O}/></svg>
  if (id==='combo')       return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="3" y="18" width="6" height="10" fill={B} fillOpacity="0.7"/><rect x="11" y="12" width="6" height="16" fill={B} fillOpacity="0.7"/><rect x="19" y="16" width="6" height="12" fill={B} fillOpacity="0.7"/><rect x="27" y="10" width="6" height="18" fill={B} fillOpacity="0.7"/><polyline points="6,14 14,8 22,12 30,6 38,10" stroke={O} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
  if (id==='hbar')        return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="2" y="3" width="22" height="5" rx="1" fill={B}/><rect x="2" y="10" width="30" height="5" rx="1" fill={O}/><rect x="2" y="17" width="18" height="5" rx="1" fill={B3}/><rect x="2" y="24" width="26" height="5" rx="1" fill={B}/></svg>
  if (id==='hstacked')    return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="2" y="3" width="18" height="5" rx="1" fill={B}/><rect x="20" y="3" width="12" height="5" rx="1" fill={O}/><rect x="2" y="10" width="22" height="5" rx="1" fill={B}/><rect x="24" y="10" width="10" height="5" rx="1" fill={O}/><rect x="2" y="17" width="16" height="5" rx="1" fill={B}/><rect x="18" y="17" width="14" height="5" rx="1" fill={O}/><rect x="2" y="24" width="20" height="5" rx="1" fill={B}/><rect x="22" y="24" width="16" height="5" rx="1" fill={O}/></svg>
  if (id==='histogram')   return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="2" y="22" width="5" height="6" fill={B} fillOpacity="0.5"/><rect x="8" y="16" width="5" height="12" fill={B} fillOpacity="0.7"/><rect x="14" y="10" width="5" height="18" fill={B}/><rect x="20" y="14" width="5" height="14" fill={B} fillOpacity="0.8"/><rect x="26" y="18" width="5" height="10" fill={B} fillOpacity="0.6"/><rect x="32" y="22" width="5" height="6" fill={B} fillOpacity="0.4"/><rect x="38" y="24" width="4" height="4" fill={B} fillOpacity="0.3"/></svg>
  if (id==='line')        return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><polyline points="2,22 10,14 18,18 26,8 34,12 42,6" stroke={B} strokeWidth="2" fill="none" strokeLinecap="round"/><polyline points="2,26 10,20 18,22 26,16 34,18 42,14" stroke={O} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
  if (id==='multiline')   return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><polyline points="2,22 10,14 18,18 26,8 34,12 42,6" stroke={B} strokeWidth="1.5" fill="none" strokeLinecap="round"/><polyline points="2,26 10,20 18,22 26,14 34,18 42,10" stroke={O} strokeWidth="1.5" fill="none" strokeLinecap="round"/><polyline points="2,28 10,24 18,26 26,20 34,22 42,16" stroke={B3} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
  if (id==='smoothline')  return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><path d="M2 22 C8 16 14 20 22 10 S34 8 42 6" stroke={O} strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M2 26 C8 20 14 24 22 16 S34 14 42 12" stroke={B} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
  if (id==='waveline')    return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><path d="M2 18 C6 12 10 24 16 16 S24 8 30 14 S38 20 42 14" stroke={O} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
  if (id==='candlestick') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><line x1="7" y1="3" x2="7" y2="27" stroke="#888" strokeWidth="1"/><rect x="4" y="8" width="6" height="12" rx="1" fill={G}/><line x1="18" y1="5" x2="18" y2="25" stroke="#888" strokeWidth="1"/><rect x="15" y="12" width="6" height="8" rx="1" fill={R}/><line x1="29" y1="7" x2="29" y2="23" stroke="#888" strokeWidth="1"/><rect x="26" y="10" width="6" height="8" rx="1" fill={G}/><line x1="40" y1="9" x2="40" y2="27" stroke="#888" strokeWidth="1"/><rect x="37" y="16" width="6" height="8" rx="1" fill={R}/></svg>
  if (id==='ohlc')        return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><line x1="8" y1="5" x2="8" y2="25" stroke={G} strokeWidth="2"/><line x1="4" y1="12" x2="8" y2="12" stroke={G} strokeWidth="2"/><line x1="8" y1="20" x2="12" y2="20" stroke={G} strokeWidth="2"/><line x1="20" y1="7" x2="20" y2="23" stroke={R} strokeWidth="2"/><line x1="16" y1="14" x2="20" y2="14" stroke={R} strokeWidth="2"/><line x1="20" y1="18" x2="24" y2="18" stroke={R} strokeWidth="2"/><line x1="32" y1="9" x2="32" y2="25" stroke={G} strokeWidth="2"/><line x1="28" y1="16" x2="32" y2="16" stroke={G} strokeWidth="2"/><line x1="32" y1="22" x2="36" y2="22" stroke={G} strokeWidth="2"/></svg>
  if (id==='area')        return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><path d="M2 30 L2 22 L10 14 L18 18 L26 8 L34 12 L42 6 L42 30 Z" fill={B3} fillOpacity="0.3"/><polyline points="2,22 10,14 18,18 26,8 34,12 42,6" stroke={B3} strokeWidth="1.5" fill="none"/><path d="M2 30 L2 26 L10 20 L18 24 L26 14 L34 18 L42 12 L42 30 Z" fill={O} fillOpacity="0.25"/><polyline points="2,26 10,20 18,24 26,14 34,18 42,12" stroke={O} strokeWidth="1.5" fill="none"/></svg>
  if (id==='stackarea')   return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><path d="M2 30 L42 30 L42 18 L34 22 L26 16 L18 20 L10 24 L2 22 Z" fill={O} fillOpacity="0.5"/><path d="M2 22 L10 24 L18 20 L26 16 L34 22 L42 18 L42 8 L34 12 L26 6 L18 10 L10 14 L2 12 Z" fill={B3} fillOpacity="0.4"/><polyline points="2,12 10,14 18,10 26,6 34,12 42,8" stroke={B3} strokeWidth="1.5" fill="none"/></svg>
  if (id==='steparea')    return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><path d="M2 30 L2 22 L12 22 L12 14 L22 14 L22 10 L32 10 L32 18 L42 18 L42 30 Z" fill={B3} fillOpacity="0.3"/><polyline points="2,22 12,22 12,14 22,14 22,10 32,10 32,18 42,18" stroke={B3} strokeWidth="1.5" fill="none"/></svg>
  if (id==='pie')         return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><circle cx="22" cy="15" r="12" fill="#e0e0e0"/><path d="M22 15 L22 3 A12 12 0 0 1 34 15 Z" fill={B}/><path d="M22 15 L34 15 A12 12 0 0 1 18 26.4 Z" fill={R}/><path d="M22 15 L18 26.4 A12 12 0 0 1 22 3 Z" fill={B3}/></svg>
  if (id==='donut')       return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><circle cx="22" cy="15" r="12" fill="none" stroke={B} strokeWidth="7" strokeDasharray="30 48"/><circle cx="22" cy="15" r="12" fill="none" stroke={O} strokeWidth="7" strokeDasharray="20 58" strokeDashoffset="-30"/><circle cx="22" cy="15" r="12" fill="none" stroke={B3} strokeWidth="7" strokeDasharray="15 63" strokeDashoffset="-50"/><circle cx="22" cy="15" r="5" fill="white"/></svg>
  if (id==='scatter')     return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><circle cx="8" cy="24" r="2" fill={B}/><circle cx="14" cy="14" r="2" fill={B}/><circle cx="22" cy="20" r="2" fill={B}/><circle cx="28" cy="10" r="2" fill={B}/><circle cx="12" cy="8" r="2" fill={O}/><circle cx="36" cy="22" r="2" fill={O}/><circle cx="20" cy="26" r="2" fill={O}/><circle cx="34" cy="6" r="2" fill={O}/></svg>
  if (id==='bubble')      return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><circle cx="10" cy="22" r="5" fill={B} fillOpacity="0.7"/><circle cx="22" cy="12" r="8" fill={B} fillOpacity="0.5"/><circle cx="36" cy="20" r="6" fill={O} fillOpacity="0.6"/><circle cx="18" cy="26" r="3" fill={B3} fillOpacity="0.7"/></svg>
  if (id==='treemap')     return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="1" y="1" width="24" height="18" rx="1" fill={B}/><rect x="27" y="1" width="16" height="8" rx="1" fill={O}/><rect x="27" y="11" width="16" height="8" rx="1" fill={B3}/><rect x="1" y="21" width="11" height="8" rx="1" fill={G}/><rect x="14" y="21" width="29" height="8" rx="1" fill={R} fillOpacity="0.7"/></svg>
  if (id==='funnel')      return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="2" y="2" width="40" height="7" rx="2" fill={B}/><rect x="6" y="11" width="32" height="6" rx="2" fill={O}/><rect x="11" y="19" width="22" height="5" rx="2" fill={B3}/><rect x="16" y="26" width="12" height="3" rx="1.5" fill={G}/></svg>
  if (id==='sankey')      return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="1" y="3" width="5" height="24" rx="1" fill={B}/><rect x="38" y="2" width="5" height="12" rx="1" fill={O}/><rect x="38" y="17" width="5" height="11" rx="1" fill={B3}/><path d="M6 8 C18 8 26 6 38 6" stroke={B} strokeWidth="5" fill="none" opacity="0.4"/><path d="M6 22 C18 22 26 20 38 20" stroke={O} strokeWidth="5" fill="none" opacity="0.4"/></svg>
  if (id==='gauge')       return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><path d="M6 26 A16 16 0 0 1 38 26" stroke="#e0e0e0" strokeWidth="5" fill="none" strokeLinecap="round"/><path d="M6 26 A16 16 0 0 1 30 12" stroke={B} strokeWidth="5" fill="none" strokeLinecap="round"/><line x1="22" y1="26" x2="30" y2="12" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/><circle cx="22" cy="26" r="2.5" fill="#333"/><text x="12" y="29" fontSize="5" fill="#666" fontFamily="sans-serif">Total</text><text x="12" y="23" fontSize="6" fontWeight="bold" fill="#333" fontFamily="sans-serif">111K</text></svg>
  if (id==='waterfall')   return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="2" y="18" width="7" height="10" rx="1" fill={B}/><rect x="11" y="12" width="7" height="6" rx="1" fill={G}/><rect x="20" y="8" width="7" height="4" rx="1" fill={G}/><rect x="29" y="12" width="7" height="16" rx="1" fill={R}/><line x1="9" y1="18" x2="11" y2="18" stroke="#888" strokeWidth="1" strokeDasharray="2"/><line x1="18" y1="12" x2="20" y2="12" stroke="#888" strokeWidth="1" strokeDasharray="2"/></svg>
  if (id==='timeline')    return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="3" y="5" width="22" height="6" rx="2" fill={B}/><rect x="12" y="13" width="26" height="6" rx="2" fill={O}/><rect x="2" y="21" width="16" height="6" rx="2" fill={B3}/></svg>
  if (id==='bullet')      return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="2" y="8" width="40" height="14" rx="1" fill="#e0e0e0"/><rect x="2" y="11" width="28" height="8" rx="1" fill="#bdbdbd"/><rect x="2" y="13" width="20" height="4" rx="1" fill={B}/><line x1="32" y1="5" x2="32" y2="25" stroke="#333" strokeWidth="2" strokeLinecap="round"/></svg>
  if (id==='map')         return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><ellipse cx="22" cy="15" rx="18" ry="12" stroke="#e0e0e0" strokeWidth="1" fill="#e3f2fd"/><circle cx="24" cy="11" r="4" fill={B} fillOpacity="0.5"/><circle cx="16" cy="18" r="3" fill={B} fillOpacity="0.7"/><circle cx="30" cy="17" r="5" fill={B} fillOpacity="0.3"/></svg>
  // default fallback
  return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="4" y="4" width="36" height="22" rx="2" stroke="#d0d0d0" strokeWidth="1.5" fill="none"/></svg>
}

// ── Main page ────────────────────────────────────────────────────────────────

export function WidgetDot({ wid, onEdit , _ctx }: {  wid: string; onEdit: () => void }; _ctx: any }) {
  const isOpen = openMenu === wid
  { openMenu, setOpenMenu, editMode, widgets, STATIC_IDS, setWidgets, setEditingWidget, startEdit, setFullscreenWidget, setDrillWidget, setDrillChannel, setShareCapture, setShareToast, setRemovedWidgetIds, LS_REMOVED_KEY, dragIdRef, justDroppedRef, resizingId, setWidgetSizes, LS_SIZES_KEY, LS_WIDGETS_KEY, dynamicWidgets, isWidgetRemoved, ALLOY, widgetSizes } = _ctx
  return (
    <div style={{ position:'relative', display:'inline-flex' }}>
      <button onClick={e => { e.stopPropagation(); setOpenMenu(isOpen ? null : wid) }}
        style={{ background:'rgba(255,255,255,0.92)', border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'2px 6px', cursor:'pointer', display:'flex', alignItems:'center' }}>
        <MoreHorizontal size={13} style={{ color:ALLOY.ink }}/>
      </button>
      {isOpen && (
        <div style={{ position:'absolute', right:0, top:'calc(100% + 4px)', background:ALLOY.white, border:`1px solid ${ALLOY.line}`, borderRadius:2, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', padding:4, minWidth:160, zIndex:999 }}
          onClick={e => e.stopPropagation()}>
          <button onClick={() => { onEdit(); setOpenMenu(null) }} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:ALLOY.ink, background:'none', border:'none', cursor:'pointer', borderRadius:2, textAlign:'left' as const }}>✏ Edit</button>
          <button onClick={() => setOpenMenu(null)} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:ALLOY.ink, background:'none', border:'none', cursor:'pointer', borderRadius:2, textAlign:'left' as const }}>⛶ Full Screen</button>
          <button onClick={() => setOpenMenu(null)} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:ALLOY.ink, background:'none', border:'none', cursor:'pointer', borderRadius:2, textAlign:'left' as const }}>⧉ Copy</button>
          <button onClick={() => setOpenMenu(null)} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:ALLOY.ink, background:'none', border:'none', cursor:'pointer', borderRadius:2, textAlign:'left' as const }}>❐ Clone</button>
          <button onClick={() => setOpenMenu(null)} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:ALLOY.ink, background:'none', border:'none', cursor:'pointer', borderRadius:2, textAlign:'left' as const }}>↗ Share</button>
          <div style={{ height:1, background:ALLOY.paper, margin:'2px 0' }}/>
          <button onClick={() => setOpenMenu(null)} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:ALLOY.red1, background:'none', border:'none', cursor:'pointer', borderRadius:2 }}>🗑 Remove</button>
        </div>
      )}
    </div>
  )
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10 }}>
      {label && <span style={{ fontSize:12, color:ALLOY.ink }}>{label}</span>}
      <div onClick={() => onChange(!on)}
        style={{ width:36, height:20, borderRadius:999, background: on ? ALLOY.green1 : ALLOY.line, position:'relative', cursor:'pointer', transition:'background 0.2s', flexShrink:0 }}>
        <div style={{ width:16, height:16, borderRadius:'50%', background:ALLOY.white, position:'absolute', top:2, left: on ? 18 : 2, transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.25)' }}/>
      </div>
    </div>
  )
}

export function ResizeHandle({ id, _ctx }: { id: string; _ctx: any }) {
  const { editMode, resizingId, setResizingId, setWidgetSizes, saveSizesToDB, LS_SIZES_KEY, ALLOY } = _ctx
  if (!editMode) return null
  { editMode, resizingId, setResizingId, setWidgetSizes, saveSizesToDB, LS_SIZES_KEY, ALLOY } = _ctx

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const el = (e.currentTarget as HTMLElement).closest('[data-widget-id]') as HTMLElement
    if (!el) return

    const rect = el.getBoundingClientRect()
    const startX = e.clientX
    const startY = e.clientY
    const startW = rect.width
    const startH = rect.height

    // Show a transparent global overlay to block all mouse events during drag
    const globalOverlay = document.createElement('div')
    globalOverlay.style.cssText = 'position:fixed;inset:0;z-index:99999;cursor:se-resize;user-select:none;'
    document.body.appendChild(globalOverlay)

    // Live ghost overlay showing new size
    const ghost = document.createElement('div')
    ghost.style.cssText = `position:fixed;border:2px solid #20BB71;background:rgba(32,187,113,0.06);border-radius:2px;pointer-events:none;z-index:99998;box-shadow:0 0 0 1px rgba(32,187,113,0.2);`
    ghost.innerHTML = '<div style="position:absolute;bottom:6px;right:8px;font-size:10px;font-weight:700;color:#20BB71;background:rgba(255,255,255,0.95);padding:2px 6px;border-radius:2px;font-family:Barlow,sans-serif;letter-spacing:0.05em;"></div>'
    document.body.appendChild(ghost)

    const updateGhost = (mx: number, my: number) => {
      const nw = Math.max(160, startW + mx - startX)
      const nh = Math.max(100, startH + my - startY)
      ghost.style.left = rect.left + 'px'
      ghost.style.top = rect.top + 'px'
      ghost.style.width = nw + 'px'
      ghost.style.height = nh + 'px'
      const label = ghost.querySelector('div')
      if (label) label.textContent = `${Math.round(nw)} × ${Math.round(nh)}`
    }
    updateGhost(startX, startY)

    setResizingId(id)

    const onMove = (mv: MouseEvent) => {
      updateGhost(mv.clientX, mv.clientY)
      // Also update the actual element live for instant feedback
      const nw = Math.max(160, startW + mv.clientX - startX)
      const nh = Math.max(100, startH + mv.clientY - startY)
      el.style.width = nw + 'px'
      el.style.minWidth = nw + 'px'
      el.style.height = nh + 'px'
      el.style.minHeight = nh + 'px'
      el.style.flex = '0 0 auto'
    }

    const onUp = (mv: MouseEvent) => {
      const nw = Math.max(160, startW + mv.clientX - startX)
      const nh = Math.max(100, startH + mv.clientY - startY)
      // Save to state and localStorage
      setWidgetSizes(prev => {
        const next = { ...prev, [id]: { w: nw, h: nh } }
        saveSizesToDB(next)
        return next
      })
      setResizingId(null)
      document.body.removeChild(globalOverlay)
      document.body.removeChild(ghost)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const isResizing = resizingId === id

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute', bottom: 0, right: 0,
        width: 20, height: 20,
        cursor: 'se-resize', zIndex: 30,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
        padding: '3px',
        opacity: isResizing ? 1 : 0.35,
        transition: 'opacity 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
      onMouseLeave={e => { if (resizingId !== id) (e.currentTarget as HTMLElement).style.opacity = '0.35' }}
      title="Drag to resize"
    >
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path d="M2 10 L10 2" stroke={isResizing ? '#1a73e8' : ALLOY.mute} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M5.5 10 L10 5.5" stroke={isResizing ? '#1a73e8' : ALLOY.mute} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 10 L10 9" stroke={isResizing ? '#1a73e8' : ALLOY.mute} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

export function KPICard({ w , _ctx }: {  w: Widget }; _ctx: any }) {
  const c = KPI_BG[w.color] || KPI_BG.white
  { editMode, editingWidget, widgetSizes, resizingId, connection, justDroppedRef, openDrill, startEdit, getWidgetData, ALLOY } = _ctx
  const isWhite = w.color === 'white'
  const isSelected = editingWidget?.id === w.id
  const bgColor = w.bgHex || c.bg
  const borderCol = isSelected && editMode ? ALLOY.blue1 : (w.borderColor || c.border)
  const textCol = w.textColor || c.text

  // KPI types — show number scorecard layout
  const isKpiType = !w.chartType || w.chartType === 'scorecard' || w.chartType === 'sparkline'

  const editControls = (
    <>
      {editMode && <div style={{ position:'absolute', top:6, left:6, cursor:'grab', color:isWhite?ALLOY.line:'rgba(255,255,255,0.35)', zIndex:5 }}><Grip size={13}/></div>}
      {editMode && (
        <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:6, right:6, zIndex:10, display:'flex', alignItems:'center', gap:4 }}>
          <button style={{ background:isWhite?'rgba(0,0,0,0.05)':'rgba(255,255,255,0.15)', border:'none', borderRadius:2, padding:'3px 5px', cursor:'pointer', display:'flex' }}>
            <Maximize2 size={10} style={{ color:isWhite?ALLOY.mute:'rgba(255,255,255,0.7)' }}/>
          </button>
          <WidgetDot wid={w.id} onEdit={() => startEdit(w)} _ctx={_ctx}/>
        </div>
      )}
    </>
  )

  if (!isKpiType) {
    // ── Full chart mode: replaces entire card with chart ──
    const activeFilters: string[] = (w as any).filters || []
    return (
      <div data-widget-id={w.id}
        onClick={e => { e.stopPropagation(); if (editMode) startEdit(w); else openDrill(w) }}
        style={{ background:ALLOY.white, border:`2px solid ${borderCol}`, borderRadius:2, padding:12, position:'relative', minHeight: widgetSizes[w.id]?.h || 130, cursor: editMode ? 'pointer' : 'default', transition: resizingId === w.id ? 'none' : 'border-color 0.15s', ...(widgetSizes[w.id] ? { width: widgetSizes[w.id].w, minWidth: widgetSizes[w.id].w, flex: '0 0 auto' } : { flex: '1 1 220px' }) }}>
        {editControls}
        <ResizeHandle id={w.id} _ctx={_ctx}/>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
          <span style={{ fontSize:12, color:ALLOY.mute, fontWeight:500 }}>{w.title}</span>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            {w.change && <span style={{ fontSize:10, fontWeight:700, padding:'2px 6px', borderRadius:2, color:w.up?ALLOY.green1:ALLOY.red1, background:w.up?ALLOY.green4:ALLOY.red4 }}>{w.up?'▲':'▼'} {w.change}</span>}
            {connection?.connected && <span style={{ fontSize:9, color:ALLOY.green1, fontWeight:600 }}>● Live</span>}
          </div>
        </div>
        {activeFilters.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap' as const, gap:4, marginBottom:6 }}>
            {activeFilters.map((f: string, i: number) => (
              <span key={i} style={{ fontSize:9, background:ALLOY.yellow4, color:ALLOY.yellow1, border:'1px solid #ffe0b2', borderRadius:999, padding:'2px 8px', display:'flex', alignItems:'center', gap:4 }}>
                <span>≡</span> {f}
              </span>
            ))}
          </div>
        )}
        <DynamicChart chartType={w.chartType} data={getWidgetData(w)} height={activeFilters.length > 0 ? 80 : 90} dimensions={(w as any).dimensions} metrics={(w as any).metrics}/>
      </div>
    )
  }

  // ── KPI scorecard mode — compute value from selected metric if available ──
  const wData = getWidgetData(w as any)
  const computedValue = wData.length > 0
    ? wData.reduce((sum: number, d: any) => sum + (d.v || 0), 0)
    : null
  const displayValue = w.value && w.value !== '—' ? w.value
    : computedValue !== null ? (computedValue >= 1000000 ? (computedValue/1000000).toFixed(1)+'M' : computedValue >= 1000 ? (computedValue/1000).toFixed(1)+'K' : computedValue.toFixed(0))
    : '—'

  return (
    <div data-widget-id={w.id}
      onClick={e => { e.stopPropagation(); if (editMode) startEdit(w); else openDrill(w) }}
      style={{ background:bgColor, border:`2px solid ${borderCol}`, borderRadius:2, padding:16, position:'relative', minHeight: widgetSizes[w.id]?.h || 110, cursor: editMode ? 'pointer' : 'default', transition: resizingId === w.id ? 'none' : 'border-color 0.15s', ...(widgetSizes[w.id] ? { width: widgetSizes[w.id].w, minWidth: widgetSizes[w.id].w, flex: '0 0 auto' } : { flex: '1 1 180px' }) }}>
      {editControls}
      <ResizeHandle id={w.id} _ctx={_ctx}/>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
        <span style={{ fontSize:12, color:c.sub, fontWeight:500 }}>{w.title}</span>
        {w.change && <span style={{ fontSize:10, fontWeight:700, marginLeft:8, padding:'2px 6px', borderRadius:2, color:isWhite?(w.up?ALLOY.green1:ALLOY.red1):'rgba(255,255,255,0.95)', background:isWhite?(w.up?ALLOY.green4:ALLOY.red4):'rgba(255,255,255,0.18)' }}>{w.up?'▲':'▼'} {w.change}</span>}
      </div>
      <p style={{ fontSize:30, fontWeight:700, color:textCol, letterSpacing:'-0.5px', lineHeight:1 }}>{displayValue}</p>
      {connection?.connected && <p style={{ fontSize:9, color:isWhite?ALLOY.green1:'rgba(255,255,255,0.7)', marginTop:4 }}>● Live</p>}
      {w.chartType === 'sparkline' && (
        <div style={{ marginTop:6 }}>
          <DynamicChart chartType="sparkline" data={getWidgetData(w)} height={35} dimensions={(w as any).dimensions} metrics={(w as any).metrics}/>
        </div>
      )}
    </div>
  )
}

export function ChartCard({ id, children , _ctx }: {  id: string; children: React.ReactNode }; _ctx: any }) {
  const w = widgets.find(x => x.id === id) || widgets[0]
  { editMode, editingWidget, widgetSizes, resizingId, justDroppedRef, openDrill, startEdit, widgets, ALLOY } = _ctx
  const isSelected = editingWidget?.id === id
  const sz = widgetSizes[id]
  return (
    <div data-widget-id={id}
      onClick={e => { e.stopPropagation(); if (editMode) startEdit(w); else openDrill(w) }}
      style={{ background:ALLOY.white, border:`2px solid ${isSelected && editMode ? ALLOY.blue1 : ALLOY.line}`, borderRadius:2, padding:16, position:'relative', cursor: editMode ? 'pointer' : 'default', transition: resizingId === id ? 'none' : 'border-color 0.15s', ...(sz ? { width: sz.w, minWidth: sz.w, minHeight: sz.h, flex: '0 0 auto' } : { flex: '1 1 260px' }) }}>
      {editMode && <div style={{ position:'absolute', top:6, left:6, cursor:'grab', color:ALLOY.line }}><Grip size={13}/></div>}
      {editMode && (
        <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:6, right:6, zIndex:10, display:'flex', alignItems:'center', gap:4 }}>
          <button style={{ background:'rgba(0,0,0,0.04)', border:'none', borderRadius:2, padding:'3px 5px', cursor:'pointer', display:'flex' }}>
            <Maximize2 size={10} style={{ color:ALLOY.mute }}/>
          </button>
          <WidgetDot wid={id} onEdit={() => startEdit(w)} _ctx={_ctx}/>
        </div>
      )}
      <ResizeHandle id={id} _ctx={_ctx}/>
      {children}
    </div>
  )
}
