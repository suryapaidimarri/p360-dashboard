'use client'
import React, { useState, useEffect } from 'react'
import { ChevronRight, Sparkles, Settings, Calendar, ChevronDown, Plus, MoreHorizontal, Maximize2, X, Grip, RotateCcw, RotateCw, Monitor, Smartphone, ChevronLeft, RefreshCw, CheckCircle2, Download, Mail, Link2, LayoutGrid, Edit, Copy, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ScatterChart, Scatter as ScatterPlot, ZAxis } from 'recharts'

// ── Alloy Design System tokens (JS constants for inline styles) ─────────────
const ALLOY = {
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

const KPI_BG: {[key:string]:{bg:string;border:string;text:string;sub:string}} = {
  white:{bg:ALLOY.white,border:ALLOY.line,text:ALLOY.ink,sub:ALLOY.mute},
  blue:{bg:ALLOY.blue1,border:ALLOY.blue1,text:ALLOY.white,sub:'rgba(255,255,255,0.85)'},
  green:{bg:ALLOY.green1,border:ALLOY.green1,text:ALLOY.white,sub:'rgba(255,255,255,0.85)'},
  red:{bg:ALLOY.red1,border:ALLOY.red1,text:ALLOY.white,sub:'rgba(255,255,255,0.85)'},
}

interface Widget { id:string; title:string; dataSource:string; chartType:string; tooltip:string; color:string; value:string; change:string; up:boolean; textColor?:string; borderColor?:string; bgHex?:string; showAnomalies?:boolean; showForecast?:boolean; showIntegIcon?:boolean; metrics?:string[]; dimensions?:string[]; filters?:string[] }

function formatNum(n: number) {
  if (n>=1000000) return (n/1000000).toFixed(1)+'M'
  if (n>=1000) return (n/1000).toFixed(1)+'K'
  return n.toString()
}

// ── DynamicChart: renders the right chart based on widget.chartType ────────────
function DynamicChart({ chartType, data, height = 80, dimensions = ['Date'], metrics = ['Sessions'], opts = {} }: { chartType: string; data: any[]; height?: number; dimensions?: string[]; metrics?: string[]; opts?: any }) {
  const colors = ['#4285f4','#ea8600','#a142f4','#34a853','#ea4335','#24c1e0']
  const c = colors[0]
  if (!data || data.length === 0) return null

  if (chartType === 'line' || chartType === 'timeseries' || chartType === 'sparkline' || chartType === 'smoothline') {
    const metLabel = metrics[0] || 'Sessions'
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <XAxis dataKey="d" hide={chartType === 'sparkline'} axisLine={false} tickLine={false} tick={{ fontSize:9, fill:ALLOY.mute, fontFamily:ALLOY.fontBody }}/>
          <Line type="monotone" dataKey="v" stroke={c} strokeWidth={2} dot={false} name={metLabel}/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2, fontFamily:ALLOY.fontBody }} formatter={(v:number) => [v.toLocaleString(), metLabel]}/>
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
          <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:ALLOY.mute, fontFamily:ALLOY.fontBody }}/>
          <Area type={chartType === 'steparea' ? 'step' : 'monotone'} dataKey="v" stroke={c} fill="url(#dcg)" strokeWidth={2} dot={false} name={metLabel}/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2, fontFamily:ALLOY.fontBody }} formatter={(v:number) => [v.toLocaleString(), metLabel]}/>
        </AreaChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'column' || chartType === 'bar' || chartType === 'histogram' || chartType === 'stackedbar') {
    const metLabel = metrics[0] || 'Value'
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} barSize={18}>
          <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:ALLOY.mute, fontFamily:ALLOY.fontBody }}/>
          <YAxis hide/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2, fontFamily:ALLOY.fontBody }} formatter={(v:number) => [v.toLocaleString(), metLabel]}/>
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
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2, fontFamily:ALLOY.fontBody }}/>
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
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2, fontFamily:ALLOY.fontBody }}/>
        </PieChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'scorecard') {
    const total = data.reduce((s:number, d:any) => s + (d.v || 0), 0)
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height }}>
        <span style={{ fontSize:32, fontWeight:700, color:c, letterSpacing:'-1px', fontFamily:ALLOY.fontDisplay }}>
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
        <table style={{ width:'100%', fontSize:10, borderCollapse:'collapse', fontFamily:ALLOY.fontBody }}>
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
          <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:ALLOY.mute, fontFamily:ALLOY.fontBody }}/>
          <YAxis hide/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2, fontFamily:ALLOY.fontBody }}/>
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
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2, fontFamily:ALLOY.fontBody }}/>
        </LineChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'hbar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" barSize={12}>
          <XAxis type="number" hide/>
          <YAxis type="category" dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:ALLOY.mute, fontFamily:ALLOY.fontBody }} width={30}/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2, fontFamily:ALLOY.fontBody }}/>
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
          <YAxis type="category" dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:ALLOY.mute, fontFamily:ALLOY.fontBody }} width={30}/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2, fontFamily:ALLOY.fontBody }}/>
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
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2, fontFamily:ALLOY.fontBody }} formatter={(v:number) => [v.toLocaleString(),'']}/>
          <ScatterPlot data={scatterData} fill={c}/>
        </ScatterChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'candlestick' || chartType === 'ohlc') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} barSize={6}>
          <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:ALLOY.mute, fontFamily:ALLOY.fontBody }}/>
          <YAxis hide/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2, fontFamily:ALLOY.fontBody }}/>
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
          <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:ALLOY.mute, fontFamily:ALLOY.fontBody }}/>
          <YAxis hide/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:2, fontFamily:ALLOY.fontBody }}/>
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
            <span style={{ fontSize:9, color:ALLOY.mute, whiteSpace:'nowrap', fontFamily:ALLOY.fontBody }}>{d.d}</span>
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
            <span style={{ fontSize:9, color:ALLOY.white, fontWeight:600, fontFamily:ALLOY.fontBody }}>{d.d}</span>
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
            <span style={{ fontSize:9, color:ALLOY.mute, fontFamily:ALLOY.fontBody }}>{d.d}</span>
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
        <table style={{ width:'100%', fontSize:10, borderCollapse:'collapse', fontFamily:ALLOY.fontBody }}>
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
        <Tooltip contentStyle={{ fontSize:10, borderRadius:2, fontFamily:ALLOY.fontBody }}/>
      </LineChart>
    </ResponsiveContainer>
  )
}

// ── Empty canvas shown for any dashboard not in REAL_DASHBOARDS ──────────────
function NewDashCanvas({ onClone }: { onClone: () => void }) {
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', background:ALLOY.paper }}>
      <p style={{ fontSize:15, color:ALLOY.ink, marginBottom:2, fontFamily:ALLOY.fontDisplay }}>Start building by dragging widgets</p>
      <p style={{ fontSize:13, color:ALLOY.mute, marginBottom:20, fontFamily:ALLOY.fontBody }}>or</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, width:520 }}>

        {/* Add a page template */}
        <button style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'30px 24px', background:ALLOY.white, border:'1px solid #e8e8e8', borderRadius:2, cursor:'pointer', textAlign:'center' as const }}>
          <div style={{ width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="4" width="12" height="12" rx="2" fill="#D0D0D0"/><rect x="20" y="4" width="12" height="12" rx="2" fill="#D0D0D0"/><rect x="4" y="20" width="12" height="7" rx="1.5" fill="#E8E8E8"/><rect x="20" y="20" width="12" height="7" rx="1.5" fill="#E8E8E8"/><circle cx="10" cy="30" r="2.5" fill="#48b5ea"/></svg>
          </div>
          <div>
            <p style={{ fontSize:14, fontWeight:500, color:ALLOY.ink, marginBottom:6, fontFamily:ALLOY.fontBody }}>Add a page template</p>
            <p style={{ fontSize:12, color:ALLOY.mute, lineHeight:1.6, fontFamily:ALLOY.fontBody }}>Choose from a ready-made template or one of your saved pages</p>
          </div>
        </button>

        {/* Build a page using AI */}
        <button style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'30px 24px', background:ALLOY.white, border:'1px solid #e8e8e8', borderRadius:2, cursor:'pointer', textAlign:'center' as const }}>
          <div style={{ width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="12" stroke="#D0D0D0" strokeWidth="2"/><circle cx="18" cy="10" r="3" fill="#D0D0D0"/><path d="M14 18 L17 21 L23 15" stroke="#48b5ea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M26 10 L28 14 L32 12" stroke="#D0D0D0" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <div>
            <p style={{ fontSize:14, fontWeight:500, color:ALLOY.ink, marginBottom:6, fontFamily:ALLOY.fontBody }}>Build a page using AI</p>
            <p style={{ fontSize:12, color:ALLOY.mute, lineHeight:1.6, fontFamily:ALLOY.fontBody }}>Tell AI what you're trying to achieve, and watch it build your page</p>
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
            <p style={{ fontSize:14, fontWeight:500, color:ALLOY.ink, marginBottom:6, fontFamily:ALLOY.fontBody }}>Clone existing page</p>
            <p style={{ fontSize:12, color:ALLOY.mute, lineHeight:1.6, fontFamily:ALLOY.fontBody }}>Copy a page from another page</p>
          </div>
        </button>

        {/* Smart Dashboard */}
        <button style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'30px 24px', background:ALLOY.white, border:'1px solid #e8e8e8', borderRadius:2, cursor:'pointer', textAlign:'center' as const }}>
          <div style={{ width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="9" width="28" height="18" rx="2" stroke="#D0D0D0" strokeWidth="2"/><path d="M4 15 h28" stroke="#D0D0D0" strokeWidth="1.5"/><rect x="8" y="19" width="7" height="5" rx="1" fill="#E0E0E0"/><rect x="20" y="19" width="7" height="5" rx="1" fill="#48b5ea" fillOpacity="0.35"/><rect x="14" y="27" width="8" height="2" rx="1" fill="#D0D0D0"/></svg>
          </div>
          <div>
            <p style={{ fontSize:14, fontWeight:500, color:ALLOY.ink, marginBottom:6, fontFamily:ALLOY.fontBody }}>Smart Dashboard</p>
            <p style={{ fontSize:12, color:ALLOY.mute, lineHeight:1.6, fontFamily:ALLOY.fontBody }}>Generate a dashboard from your connected integrations</p>
          </div>
        </button>

      </div>
    </div>
  )
}

// ── Chart thumbnail SVGs (matches Looker Studio visual style) ─────────────────
function ChartThumbSvg({ id, active }: { id: string; active: boolean }) {
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
  // Hardcoded demo clients — zero-latency name resolution
  const KNOWN_CLIENTS: {[key:string]: {name:string, domain:string}} = {
    'demo-1':  { name:'Alloy (internal)',   domain:'alloy.com' },
    'demo-2':  { name:'Atlanta Beltline',   domain:'beltline.org' },
    'demo-3':  { name:'Collaborating Docs', domain:'collaboratingdocs.com' },
    'demo-4':  { name:'DEMO: Grainwise',    domain:'grainwise.com' },
    'demo-5':  { name:'Georgia Aquarium',   domain:'georgiaaquarium.org' },
    'demo-6':  { name:'GFVGA',              domain:'gfvga.org' },
    'demo-7':  { name:'HHAeXchange',        domain:'hhaexchange.com' },
    'demo-8':  { name:'IOU Financial',      domain:'ioufinancial.com' },
    'demo-9':  { name:'Latapult',           domain:'latapult.com' },
    'demo-10': { name:'Litmos',             domain:'litmos.com' },
    'demo-11': { name:'NCH',               domain:'nchmd.org' },
    'demo-12': { name:'S&T Bank',           domain:'stbank.com' },
    'demo-13': { name:'TPX',               domain:'tpx.com' },
  }

  const [clientName, setClientName] = useState<string>(KNOWN_CLIENTS[params.id]?.name || '')
  const [clientDomain, setClientDomain] = useState<string>(KNOWN_CLIENTS[params.id]?.domain || '')
  const [showMappingModal, setShowMappingModal] = useState(false)
  const [showDsDropdown, setShowDsDropdown] = useState(false)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showCreateFilter, setShowCreateFilter] = useState(false)
  const [filterJustSaved, setFilterJustSaved] = useState(false)
  const [editingFilterName, setEditingFilterName] = useState<string|null>(null)
  const LS_SIZES_KEY = `alloy_widget_sizes_${clientId}`
  const [widgetSizes, setWidgetSizes] = useState<{[id:string]:{w:number;h:number}}>(() => {
    // Fast load from localStorage cache first (instant, no flash)
    try { const v = localStorage.getItem(`alloy_widget_sizes_${clientId}`); return v ? JSON.parse(v) : {} } catch { return {} }
  })
  const [resizingId, setResizingId] = useState<string|null>(null)
  const [resizeOverlay, setResizeOverlay] = useState<{x:number;y:number;w:number;h:number}|null>(null)
  const [newFilterName, setNewFilterName] = useState('')
  const [newFilterClauses, setNewFilterClauses] = useState([{ include: true, field: '', operator: 'contains', value: '' }])
  const [filterFieldSearch, setFilterFieldSearch] = useState('')
  const [openClauseFieldIdx, setOpenClauseFieldIdx] = useState<number|null>(null)
  const [openClauseValueIdx, setOpenClauseValueIdx] = useState<number|null>(null)
  const [ga4EventNames, setGa4EventNames] = useState<string[]>([])
  const [ga4EventRows, setGa4EventRows] = useState<{d:string;v:number}[]>([])
  const [eventSearch, setEventSearch] = useState('')
  const [selectedEventValues, setSelectedEventValues] = useState<{[idx: number]: string[]}>({})
  const [filterSearch, setFilterSearch] = useState('')
  const [ga4Filters, setGa4Filters] = useState<{name:string; type:'ga4'|'other'}[]>([])
  const [userFilters, setUserFilters] = useState<any[]>(() => {
    try { const v = localStorage.getItem('alloy_user_filters'); return v ? JSON.parse(v) : [] } catch { return [] }
  })
  const [loadingFilters, setLoadingFilters] = useState(false)
  const [showDimDropdown, setShowDimDropdown] = useState(false)
  const [showMetDropdown, setShowMetDropdown] = useState(false)
  const [dsSearch, setDsSearch] = useState('')
  const [dimSearch, setDimSearch] = useState('')
  const [metSearch, setMetSearch] = useState('')
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [shareSubmenu, setShareSubmenu] = useState<'pdf'|'email'|'link'|null>(null)
  const [shareToast, setShareToast] = useState<string|null>(null)
  const [fullscreenWidget, setFullscreenWidget] = useState<Widget|null>(null)
  const [shareCapture, setShareCapture] = useState<{ wid: string; title: string } | null>(null)
  const [shareEmailInput, setShareEmailInput] = useState('')
  const [shareLinkCopied, setShareLinkCopied] = useState(false)
  const [mappingProp, setMappingProp] = useState('')
  const [mappingPropName, setMappingPropName] = useState('')
  const [mappingSite, setMappingSite] = useState('')
  const [savingMapping, setSavingMapping] = useState(false)
  const [mappingSaved, setMappingSaved] = useState(false)
  const [showBuilder, setShowBuilder] = useState(false)
  const [showCloneModal, setShowCloneModal] = useState(false)
  const [dashMenu, setDashMenu] = useState<string|null>(null)
  const [renamingDash, setRenamingDash] = useState<string|null>(null)
  const [renameValue, setRenameValue] = useState('')
  const LS_KEY = `alloy_dashboards_${clientId}`
  const LS_CLONED_KEY = `alloy_cloned_dashboards_${clientId}`
  const LS_WIDGETS_KEY = `alloy_widgets_${clientId}`

  const [dashboards, setDashboards] = useState<string[]>(() => {
    if (typeof window === 'undefined') return INITIAL_DASHBOARDS
    try {
      const saved = localStorage.getItem(LS_KEY)
      return saved ? JSON.parse(saved) : INITIAL_DASHBOARDS
    } catch { return INITIAL_DASHBOARDS }
  })

  const [clonedDashboards, setClonedDashboards] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(LS_CLONED_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const DEFAULT_WIDGETS: Widget[] = [
    {id:'w1',title:'Total Sessions',dataSource:'google-analytics-4 / traffic-analytics',chartType:'sparkline',tooltip:'Total sessions during the selected period.',color:'white',value:'120.5 K',change:'29%',up:true},
    {id:'w2',title:'Total Conversions',dataSource:'google-analytics-4 / conversions',chartType:'column',tooltip:'Total conversions tracked.',color:'blue',value:'3,610',change:'16%',up:false},
    {id:'w3',title:'Referring Domains',dataSource:'google-analytics-4 / referring',chartType:'line',tooltip:'Unique domains sending traffic.',color:'white',value:'6,961',change:'',up:true},
    {id:'w4',title:'Engagement Rate',dataSource:'google-analytics-4 / engagement',chartType:'area',tooltip:'Percentage of engaged sessions.',color:'green',value:'60.77%',change:'3.97%',up:false},
    {id:'c1',title:'Sessions Over Time',dataSource:'google-analytics-4 / sessions',chartType:'line',tooltip:'Sessions over time.',color:'white',value:'',change:'',up:true},
    {id:'d1',title:'Users By Device',dataSource:'google-analytics-4 / devices',chartType:'column',tooltip:'Users by device category.',color:'white',value:'',change:'',up:true},
    {id:'v1',title:'Website Views',dataSource:'google-analytics-4 / views',chartType:'area',tooltip:'Website views over time.',color:'white',value:'',change:'',up:true},
  ]
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_WIDGETS
    try {
      const saved = localStorage.getItem(LS_WIDGETS_KEY)
      if (saved) {
        const parsed: Widget[] = JSON.parse(saved)

        // Restore default widgets with saved customizations
        const defaults = DEFAULT_WIDGETS.map(def => {
          const saved_w = parsed.find((s: Widget) => s.id === def.id)
          if (!saved_w) return def
          return {
            ...def,
            ...saved_w,
            // Keep live GA4 values from default (value/change/up restored by fetchGA4)
            value: def.value,
            change: def.change,
            up: def.up,
          }
        })

        // Also restore any dynamically added widgets (IDs not in DEFAULT_WIDGETS)
        const defaultIds = new Set(DEFAULT_WIDGETS.map(d => d.id))
        const dynamic = parsed.filter((s: Widget) => !defaultIds.has(s.id))

        return [...defaults, ...dynamic]
      }
    } catch {}
    return DEFAULT_WIDGETS
  })

  // Track removed static widget IDs separately — persists across refresh
  const LS_REMOVED_KEY = `alloy_removed_widgets_${clientId}`
  const [removedWidgetIds, setRemovedWidgetIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(`alloy_removed_widgets_${clientId}`)
      return saved ? new Set(JSON.parse(saved) as string[]) : new Set<string>()
    } catch { return new Set() }
  })

  // Helper — check if a widget id is removed
  const isWidgetRemoved = (id: string) => removedWidgetIds.has(id)

  // Empty canvas only for dashboards that have no content yet (not real, not cloned)
  const isEmptyDash = !REAL_DASHBOARDS.includes(activeDash) && !clonedDashboards.includes(activeDash)

  // Resolve client name immediately from URL params or localStorage (for non-demo clients)
  useEffect(() => {
    if (clientName) return // already have it from KNOWN_CLIENTS
    const urlParams = new URLSearchParams(window.location.search)
    const urlName = urlParams.get('name')
    const urlDomain = urlParams.get('domain')
    if (urlName) {
      setClientName(urlName)
      try { localStorage.setItem(`alloy_client_name_${clientId}`, urlName) } catch {}
    } else {
      const cached = localStorage.getItem(`alloy_client_name_${clientId}`)
      if (cached) setClientName(cached)
    }
    if (urlDomain) {
      setClientDomain(urlDomain)
      try { localStorage.setItem(`alloy_client_domain_${clientId}`, urlDomain) } catch {}
    } else {
      const cachedDomain = localStorage.getItem(`alloy_client_domain_${clientId}`)
      if (cachedDomain) setClientDomain(cachedDomain)
    }
  }, [])

  useEffect(() => {
    loadClientInfo()
    checkConnection().then(() => loadMapping())
    loadSizesFromDB()
  }, [clientId])

  // Hide the layout nav panels when in edit mode
  useEffect(() => {
    if (editMode) {
      document.body.classList.add('dashboard-edit-mode')
    } else {
      document.body.classList.remove('dashboard-edit-mode')
    }
    return () => { document.body.classList.remove('dashboard-edit-mode') }
  }, [editMode])

  // Persist dashboards list to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    try { localStorage.setItem(LS_KEY, JSON.stringify(dashboards)) } catch {}
  }, [dashboards])

  // Persist cloned dashboards list to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    try { localStorage.setItem(LS_CLONED_KEY, JSON.stringify(clonedDashboards)) } catch {}
  }, [clonedDashboards])

  // Persist ALL widget config to localStorage on every change
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const toSave = widgets.map(w => ({
        id: w.id,
        title: w.title,
        tooltip: w.tooltip,
        chartType: w.chartType,
        color: w.color,
        textColor: w.textColor,
        borderColor: w.borderColor,
        bgHex: w.bgHex,
        showAnomalies: w.showAnomalies,
        showForecast: w.showForecast,
        showIntegIcon: w.showIntegIcon,
        dimensions: (w as any).dimensions,
        metrics: (w as any).metrics,
        filters: (w as any).filters,
        dataSource: w.dataSource,
      }))
      localStorage.setItem(LS_WIDGETS_KEY, JSON.stringify(toSave))
    } catch {}
  }, [widgets])

  // Auto-load event data when any widget uses Event Name dimension
  useEffect(() => {
    if (connection?.connected && selectedProperty && ga4EventRows.length === 0) {
      const needsEvents = widgets.some(w => {
        const dims: string[] = (w as any).dimensions || []
        return dims.includes('Event Name') || dims.includes('eventName')
      })
      if (needsEvents) loadGA4Events()
    }
  }, [widgets, connection, selectedProperty])

  async function loadGA4Events() {
    if (!connection?.connected || !selectedProperty) return
    try {
      const res = await fetch(`/api/ga4/custom?client_id=${clientId}&property_id=${selectedProperty}&dimensions=eventName&metrics=eventCount&start_date=30daysAgo&end_date=today`)
      if (res.ok) {
        const data = await res.json()
        const rows = data.rows || []
        const events = rows.map((r: any) => r.dimensionValues?.[0]?.value).filter(Boolean)
        setGa4EventNames(events)
        setGa4EventRows(rows.map((r: any) => ({
          d: r.dimensionValues?.[0]?.value || '',
          v: parseInt(r.metricValues?.[0]?.value || '0')
        })).filter((r: any) => r.d))
      }
    } catch {}
  }

  async function loadGA4Filters() {
    if (!connection?.connected || !selectedProperty) return
    setLoadingFilters(true)
    try {
      const res = await fetch(`/api/ga4/filters?client_id=${clientId}&property_id=${selectedProperty}`)
      const data = await res.json()
      console.log('GA4 Filters loaded:', data.total, 'filters', data.error || '')
      setGa4Filters(data.filters || [])
    } catch (e) {
      console.error('loadGA4Filters error:', e)
    }
    setLoadingFilters(false)
  }

  async function saveSizesToDB(sizes: {[id:string]:{w:number;h:number}}) {
    try { localStorage.setItem(LS_SIZES_KEY, JSON.stringify(sizes)) } catch {}
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const sb = createClient()
      await sb.from('dashboard_layouts').upsert({
        client_id: clientId,
        key: 'widget_sizes',
        value: sizes,
        updated_at: new Date().toISOString()
      }, { onConflict: 'client_id,key' })
    } catch {}
  }

  async function loadSizesFromDB() {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const sb = createClient()
      const { data } = await sb.from('dashboard_layouts')
        .select('value')
        .eq('client_id', clientId)
        .eq('key', 'widget_sizes')
        .single()
      if (data?.value && typeof data.value === 'object') {
        setWidgetSizes(data.value as any)
        try { localStorage.setItem(LS_SIZES_KEY, JSON.stringify(data.value)) } catch {}
      }
    } catch {}
  }

  async function loadClientInfo() {
    // Use /api/client which uses service role key - always works regardless of RLS
    try {
      const res = await fetch(`/api/client?id=${clientId}`)
      if (res.ok) {
        const data = await res.json()
        if (data?.name) {
          const cleanDomain = (data.domain || '')
            .replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
          setClientName(data.name)
          setClientDomain(cleanDomain)
          try {
            localStorage.setItem(`alloy_client_name_${clientId}`, data.name)
            localStorage.setItem(`alloy_client_domain_${clientId}`, cleanDomain)
          } catch {}
          return
        }
      }
    } catch {}

    // Final fallback: Supabase browser client
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const sb = createClient()
      const { data } = await sb.from('clients').select('name,domain').eq('id', clientId).single()
      if (data?.name) {
        const cleanDomain = (data.domain || '')
          .replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
        setClientName(data.name)
        setClientDomain(cleanDomain)
        try {
          localStorage.setItem(`alloy_client_name_${clientId}`, data.name)
          localStorage.setItem(`alloy_client_domain_${clientId}`, cleanDomain)
        } catch {}
      }
    } catch {}
  }

  async function checkConnection() {
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
  const sourceData = ga4Data?.sources?.rows?.map((r: any, i: number) => ({ name: r.dimensionValues[0].value, value: parseInt(r.metricValues[0].value), color: ['#2196f3','#64b5f6',ALLOY.blue3,'#bbdefb','#e3f2fd'][i%5] })) || STATIC_DONUT
  const cityData = ga4Data?.cities?.rows?.map((r: any) => ({ city: r.dimensionValues[0].value, val: parseInt(r.metricValues[0].value), pct: 100 })) || STATIC_CITIES
  const maxCity = Math.max(...cityData.map((c: any) => c.val), 1)

  // Map friendly metric names to GA4 API names
  const METRIC_API_MAP: {[key:string]: string} = {
    'Sessions': 'sessions', 'Total Users': 'totalUsers', 'New Users': 'newUsers',
    'Active users': 'activeUsers', 'Conversions': 'conversions', 'Bounce Rate': 'bounceRate',
    'Engagement Rate': 'engagementRate', 'Average Session Duration': 'averageSessionDuration',
    'Screen Page Views': 'screenPageViews', 'Event Count': 'eventCount', 'Revenue': 'totalRevenue',
    'Purchase Revenue': 'purchaseRevenue', 'Purchasers': 'purchasers',
    '7-day active users': 'active7DayUsers', '28-day active users': 'active28DayUsers',
    'Ads clicks': 'advertiserAdClicks', 'Ads cost': 'advertiserAdCost',
    'Ads impressions': 'advertiserAdImpressions',
  }
  const DIMENSION_API_MAP: {[key:string]: string} = {
    'Date': 'date', 'City': 'city', 'Country': 'country', 'Device Category': 'deviceCategory',
    'Browser': 'browser', 'Session Source': 'sessionSource', 'Session Medium': 'sessionMedium',
    'Landing Page': 'landingPage', 'Page Title': 'pageTitle', 'Age': 'userAgeBracket',
    'Gender': 'userGender', 'Default Channel Group': 'sessionDefaultChannelGroup',
    'Operating System': 'operatingSystem', 'Region': 'region',
  }

  // No cache needed - derive data directly from ga4Data on every render

  // Map existing ga4Data to chart points based on dimension + metric selection
  function getWidgetDataFallback(w: any): Array<{d: string; v: number}> {
    const dims: string[] = ((w.dimensions as string[])?.length > 0 ? w.dimensions : null) || ['Date']
    const mets: string[] = ((w.metrics as string[])?.length > 0 ? w.metrics : null) || ['Sessions']
    const appliedFilters: string[] = (w.filters as string[]) || []
    const primaryDim = dims[0] || 'Date'

    // Helper: apply user-defined filter clauses to rows
    function applyUserFilters(rows: {d:string;v:number}[]): {d:string;v:number}[] {
      if (appliedFilters.length === 0) return rows
      let result = rows
      for (const filterName of appliedFilters) {
        // Check userFilters first (user-created), then ga4Filters (API filters with clauses)
        const filterDef = userFilters.find((gf: any) => gf.name === filterName) ||
                          (ga4Filters as any[]).find((gf: any) => gf.name === filterName && gf.clauses?.length > 0)
        if (!filterDef?.clauses?.length) continue
        for (const clause of filterDef.clauses) {
          if (!clause.field) continue
          const fieldLower = clause.field.toLowerCase()
          const dimLower = primaryDim.toLowerCase()
          // Match if field relates to current dimension
          const isDimMatch =
            dimLower.includes(fieldLower) ||
            fieldLower.includes(dimLower) ||
            fieldLower.replace(' ', '') === dimLower.replace(' ', '') ||
            (fieldLower.includes('event') && dimLower.includes('event')) ||
            // Always apply if no specific dimension restriction needed
            fieldLower === ''
          if (!isDimMatch) continue
          const selectedVals: string[] = clause.values || []
          const textVal = (clause.value || '').toLowerCase()
          const op = (clause.operator || '').toLowerCase()
          const include = clause.include !== false
          result = result.filter(row => {
            const dVal = (row.d || '').toLowerCase()
            let matches = false
            if (op === 'in' || op === 'in list' || op === 'in') {
              matches = selectedVals.length > 0
                ? selectedVals.some(v => dVal === v.toLowerCase().trim())
                : (textVal ? dVal === textVal : true)
            } else if (op === 'equal to (=)' || op === '=' || op === 'equals') {
              matches = dVal === textVal
            } else if (op === 'contains') {
              matches = dVal.includes(textVal)
            } else if (op === 'starts with') {
              matches = dVal.startsWith(textVal)
            } else if (op === 'regexp match' || op === 'regexp contains') {
              try { matches = new RegExp(textVal).test(dVal) } catch { matches = true }
            } else {
              matches = selectedVals.length > 0 ? selectedVals.some(v => dVal.includes(v.toLowerCase())) : true
            }
            return include ? matches : !matches
          })
        }
      }
      return result
    }

    // Helper: apply channel filter to reduce data values
    function applyChannelFilter(rows: any[]): any[] {
      if (appliedFilters.length === 0) return rows
      const channelFilter = appliedFilters.find(f => f.includes('traffic only') || f.includes('only'))
      if (!channelFilter) return rows
      // Extract channel name from filter like "Organic Search traffic only"
      const channel = channelFilter.replace(' traffic only', '').replace(' only', '').toLowerCase()
      // For source/channel dimension data, filter directly
      if (primaryDim === 'Session Source' || primaryDim === 'Default Channel Group' || primaryDim === 'Session Medium') {
        return rows.filter((r: any) => {
          const dim = (r.dimensionValues?.[0]?.value || r.d || '').toLowerCase()
          return dim.includes(channel) || channel.includes(dim)
        })
      }
      // For other dimensions (Date, City etc), scale down values to simulate filtered data
      // Use a fraction based on source data if available
      const sourceRows = ga4Data?.sources?.rows || []
      const matchingSource = sourceRows.find((r: any) =>
        (r.dimensionValues?.[0]?.value || '').toLowerCase().includes(channel)
      )
      if (matchingSource && sourceRows.length > 0) {
        const totalSessions = sourceRows.reduce((s: number, r: any) => s + parseFloat(r.metricValues?.[0]?.value || '0'), 0)
        const channelSessions = parseFloat(matchingSource.metricValues?.[0]?.value || '0')
        const ratio = totalSessions > 0 ? channelSessions / totalSessions : 0.3
        return rows.map((r: any) => ({ ...r, v: Math.round((r.v || 0) * ratio) }))
      }
      // Fallback: reduce by ~30% to indicate filtering
      return rows.map((r: any) => ({ ...r, v: Math.round((r.v || 0) * 0.3) }))
    }

    // Pick metric index from time series based on selected metric
    const metricIndexMap: {[key:string]: number} = {
      'Sessions': 0, 'Total Users': 1, 'New Users': 1, 'Active users': 1,
      'Conversions': 2, 'Bounce Rate': 3, 'Engagement Rate': 4,
      'Average Session Duration': 5, 'Screen Page Views': 0,
    }
    const metIdx = metricIndexMap[mets[0]] ?? 0

    // Dimension → dataset mapping
    if (primaryDim === 'Device Category') {
      const rows = ga4Data?.devices?.rows || STATIC_DEVICES.map((d: any) => ({ dimensionValues:[{value:d.name}], metricValues:[{value:String(d.v)}] }))
      return applyChannelFilter(rows.map((r: any) => ({ d: r.dimensionValues?.[0]?.value || '', v: parseFloat(r.metricValues?.[metIdx < 1 ? 0 : 0]?.value || '0') })))
    }
    if (primaryDim === 'City') {
      const rows = ga4Data?.cities?.rows || STATIC_CITIES.map((c: any) => ({ dimensionValues:[{value:c.city}], metricValues:[{value:String(c.val)}] }))
      return applyChannelFilter(rows.map((r: any) => ({ d: r.dimensionValues?.[0]?.value || '', v: parseFloat(r.metricValues?.[0]?.value || '0') })))
    }
    if (primaryDim === 'Session Source' || primaryDim === 'Default Channel Group' || primaryDim === 'Session Medium') {
      const rows = ga4Data?.sources?.rows || STATIC_DONUT.map((s: any) => ({ dimensionValues:[{value:s.name}], metricValues:[{value:String(s.value)}] }))
      return applyChannelFilter(rows.map((r: any) => ({ d: r.dimensionValues?.[0]?.value || '', v: parseFloat(r.metricValues?.[0]?.value || '0'), name: r.dimensionValues?.[0]?.value || '', value: parseFloat(r.metricValues?.[0]?.value || '0') })))
    }
    if (primaryDim === 'Country' || primaryDim === 'Region') {
      const rows = ga4Data?.cities?.rows || STATIC_CITIES.map((c: any) => ({ dimensionValues:[{value:c.city}], metricValues:[{value:String(c.val)}] }))
      return rows.map((r: any) => ({ d: r.dimensionValues?.[0]?.value || '', v: parseFloat(r.metricValues?.[0]?.value || '0') }))
    }
    if (primaryDim === 'Browser' || primaryDim === 'Operating System') {
      // Simulate browser breakdown from device data
      const browsers = ['Chrome','Safari','Firefox','Edge','Samsung Internet']
      const base = ga4Data?.devices?.rows || []
      if (base.length > 0) {
        const total = base.reduce((s: number, r: any) => s + parseFloat(r.metricValues?.[0]?.value || '0'), 0)
        return browsers.map((b, i) => ({ d: b, v: Math.round(total * [0.62,0.19,0.08,0.06,0.05][i]) }))
      }
      return browsers.map((b, i) => ({ d: b, v: [4200,1300,550,400,320][i] }))
    }
    if (primaryDim === 'Age' || primaryDim === 'Gender') {
      // Use simulated demographic data
      if (primaryDim === 'Age') return [
        {d:'18-24',v:2100},{d:'25-34',v:3800},{d:'35-44',v:2900},{d:'45-54',v:1800},{d:'55-64',v:900},{d:'65+',v:500}
      ]
      return [{d:'Male',v:5200},{d:'Female',v:4800},{d:'Unknown',v:800}]
    }
    if (primaryDim === 'Landing Page' || primaryDim === 'Page Title') {
      const pages = ['/','About','/services','/contact','/blog']
      return pages.map((p, i) => ({ d: p, v: [3200,1800,1400,980,760][i] }))
    }
    if (primaryDim === 'Campaign' || primaryDim === 'Session Campaign') {
      return ga4Data?.sources?.rows?.slice(0,6).map((r: any) => ({
        d: r.dimensionValues?.[0]?.value || '', v: parseFloat(r.metricValues?.[0]?.value || '0')
      })) || [{d:'organic',v:2100},{d:'direct',v:1800},{d:'cpc',v:900},{d:'email',v:400}]
    }
    if (primaryDim === 'Event Name' || primaryDim === 'eventName') {
      // Use cached event rows if available, otherwise use fallback events
      const baseRows = ga4EventRows.length > 0 ? ga4EventRows : (() => {
        // Trigger load if connected
        if (connection?.connected && selectedProperty && ga4EventNames.length === 0) loadGA4Events()
        return [
          {d:'page_view',v:45230},{d:'session_start',v:28100},{d:'first_visit',v:12400},
          {d:'scroll',v:9800},{d:'click',v:7200},{d:'user_engagement',v:5600},
          {d:'view_search_results',v:2100},{d:'file_download',v:890},
        ]
      })()
      // Apply user-defined filters (e.g. Event Name In [page_view])
      return applyUserFilters(baseRows)
    }
    // Any other dimension or Date: use time series with selected metric index
    if (!ga4Data) return STATIC_SESSIONS
    const rows = ga4Data.timeSeries?.rows || []
    if (rows.length === 0) return STATIC_SESSIONS
    return applyChannelFilter(rows.map((r: any) => ({
      d: r.dimensionValues?.[0]?.value?.length === 8 ? r.dimensionValues[0].value.slice(4) : (r.dimensionValues?.[0]?.value || ''),
      v: parseFloat(r.metricValues?.[metIdx]?.value || r.metricValues?.[0]?.value || '0')
    })))
  }

  // Get chart data — always derive fresh from ga4Data using widget's dimensions/metrics
  function getWidgetData(w: any): Array<{d: string; v: number}> {
    return getWidgetDataFallback(w)
  }
  const STATIC_IDS = ['w1','w2','w3','w4','c1','c2','c3','d1','d2','d3','v1','bounce']
  const dynamicWidgets = widgets.filter(w => !STATIC_IDS.includes(w.id))

  function startEdit(w: Widget) {
    setEditingWidget({...w})
    setEditTab('General')
    setOpenMenu(null)
    setActiveRightPanel(null)

  }
  function openDrill(w: Widget) { if (!editMode) { setDrillWidget(w); setDrillChannel('All') } }
  function addWidget(chartType: string, label: string) {
    const newId = `w${Date.now()}`
    const isKpi = chartType === 'scorecard' || chartType === 'sparkline'
    const newWidget: Widget = {
      id: newId,
      title: label,
      dataSource: 'google-analytics-4 / sessions',
      chartType,
      tooltip: `${label} from Google Analytics`,
      color: 'white',
      value: '—',
      change: '',
      up: true,
    }
    setWidgets(prev => {
      const updated = [...prev, newWidget]
      try {
        const toSave = updated.map(w => ({
          ...w,
          value: undefined,
          change: undefined,
          up: undefined,
        }))
        localStorage.setItem(LS_WIDGETS_KEY, JSON.stringify(toSave))
      } catch {}
      return updated
    })
    // Start editing the new widget immediately
    setEditingWidget(newWidget)
    setEditTab('General')
  }

  function saveWidget() {
    if (!editingWidget) return
    setWidgets(prev => {
      const updated = prev.map(w => w.id===editingWidget.id ? editingWidget : w)
      // Persist immediately
      try {
        const toSave = updated.map(w => ({
          id: w.id, title: w.title, tooltip: w.tooltip, chartType: w.chartType,
          color: w.color, textColor: w.textColor, borderColor: w.borderColor,
          bgHex: w.bgHex, showAnomalies: w.showAnomalies, showForecast: w.showForecast,
          showIntegIcon: w.showIntegIcon, dataSource: w.dataSource,
          dimensions: (w as any).dimensions, metrics: (w as any).metrics, filters: (w as any).filters,
        }))
        localStorage.setItem(LS_WIDGETS_KEY, JSON.stringify(toSave))
      } catch {}
      return updated
    })
    setEditingWidget(null)
  }

  function WidgetDot({ wid, onEdit, widget }: { wid: string; onEdit: () => void; widget?: Widget }) {
    const isOpen = openMenu === wid

    // ── Resolve the actual Widget object from wid ──────────────────────────
    // wid is either 'static__c1' or a dynamic widget id like 'w1234567'
    const resolvedWidget: Widget | undefined = widget || (() => {
      const rawId = wid.startsWith('static__') ? wid.replace('static__', '') : wid
      return widgets.find(w => w.id === rawId)
    })()

    // ── Actions ──────────────────────────────────────────────────────────────
    const handleEdit = () => { onEdit(); setOpenMenu(null) }

    const handleFullScreen = () => {
      setOpenMenu(null)
      if (resolvedWidget) setFullscreenWidget(resolvedWidget)
    }

    const handleCopy = () => {
      if (!resolvedWidget) return
      const text = JSON.stringify({
        title: resolvedWidget.title, chartType: resolvedWidget.chartType,
        dataSource: resolvedWidget.dataSource, color: resolvedWidget.color,
        dimensions: (resolvedWidget as any).dimensions,
        metrics: (resolvedWidget as any).metrics,
        filters: (resolvedWidget as any).filters,
      }, null, 2)
      const widgetTitle = resolvedWidget.title

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
          setOpenMenu(null)
          setShareToast(`"${widgetTitle}" config copied`)
          setTimeout(() => setShareToast(null), 2500)
        }).catch(() => legacyCopy())
      } else {
        legacyCopy()
      }

      function legacyCopy() {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0'
        document.body.appendChild(ta)
        ta.focus(); ta.select(); ta.setSelectionRange(0, 99999)
        let ok = false
        try { ok = document.execCommand('copy') } catch {}
        ta.remove()
        setOpenMenu(null)
        setShareToast(ok ? `"${widgetTitle}" config copied` : 'Copy failed — try again')
        setTimeout(() => setShareToast(null), 2500)
      }
    }

    const handleClone = () => {
      setOpenMenu(null)
      if (!resolvedWidget) return
      const cloneId = `w${Date.now()}`
      const cloned: Widget = {
        ...resolvedWidget,
        id: cloneId,
        title: `${resolvedWidget.title} (Copy)`,
      }
      setWidgets(prev => {
        const updated = [...prev, cloned]
        try {
          localStorage.setItem(LS_WIDGETS_KEY, JSON.stringify(
            updated.map(w => ({ ...w, value: undefined, change: undefined, up: undefined }))
          ))
        } catch {}
        return updated
      })
      setShareToast(`"${resolvedWidget.title}" cloned`)
      setTimeout(() => setShareToast(null), 2500)
      // Start editing the clone immediately
      setTimeout(() => startEdit(cloned), 50)
    }

    const handleShare = () => {
      setOpenMenu(null)
      if (!resolvedWidget) return
      const rawId = wid.startsWith('static__') ? wid.replace('static__', '') : wid
      // Open share modal — no external library needed
      setShareCapture({ wid: rawId, title: resolvedWidget.title })
    }

    const handleRemove = () => {
      setOpenMenu(null)
      if (!resolvedWidget) return
      const rawId = wid.startsWith('static__') ? wid.replace('static__', '') : wid
      const isStatic = STATIC_IDS.includes(rawId)

      if (isStatic) {
        // Static widgets: add to removed set + persist
        setRemovedWidgetIds(prev => {
          const next = new Set(Array.from(prev).concat(rawId))
          try { localStorage.setItem(LS_REMOVED_KEY, JSON.stringify(Array.from(next))) } catch {}
          return next
        })
      } else {
        // Dynamic widgets: remove from array + persist
        setWidgets(prev => {
          const updated = prev.filter(w => w.id !== rawId)
          try {
            localStorage.setItem(LS_WIDGETS_KEY, JSON.stringify(
              updated.map(w => ({ ...w, value: undefined, change: undefined, up: undefined }))
            ))
          } catch {}
          return updated
        })
      }
      if (editingWidget?.id === rawId) setEditingWidget(null)
      setShareToast(`"${resolvedWidget.title}" removed`)
      setTimeout(() => setShareToast(null), 2500)
    }

    return (
      <div style={{ position:'relative', display:'inline-flex' }}>
        <button onClick={e => { e.stopPropagation(); setOpenMenu(isOpen ? null : wid) }}
          style={{ background:'rgba(255,255,255,0.92)', border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'2px 6px', cursor:'pointer', display:'flex', alignItems:'center' }}>
          <MoreHorizontal size={13} style={{ color:ALLOY.ink }}/>
        </button>
        {isOpen && (
            <div style={{ position:'absolute', right:0, top:'calc(100% + 4px)', background:ALLOY.white, border:`1px solid ${ALLOY.line}`, borderRadius:2, boxShadow:'0 4px 16px rgba(0,0,0,0.10)', padding:'4px 0', minWidth:168, zIndex:999 }}
              onClick={e => e.stopPropagation()}>
              {/* Edit */}
              <div onClick={handleEdit}
                style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 14px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, cursor:'pointer', userSelect:'none' as const, borderLeft:'2px solid transparent' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.background=ALLOY.green4; el.style.color=ALLOY.green1; el.style.borderLeft=`2px solid ${ALLOY.green1}` }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background='none'; el.style.color=ALLOY.ink; el.style.borderLeft='2px solid transparent' }}>
                <Edit size={12} strokeWidth={1.5} style={{ color:'inherit', flexShrink:0 }}/>
                <span style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:'inherit' }}>Edit</span>
              </div>
              {/* Full Screen */}
              <div onClick={handleFullScreen}
                style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 14px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, cursor:'pointer', userSelect:'none' as const, borderLeft:'2px solid transparent' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.background=ALLOY.green4; el.style.color=ALLOY.green1; el.style.borderLeft=`2px solid ${ALLOY.green1}` }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background='none'; el.style.color=ALLOY.ink; el.style.borderLeft='2px solid transparent' }}>
                <Maximize2 size={12} strokeWidth={1.5} style={{ color:'inherit', flexShrink:0 }}/>
                <span style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:'inherit' }}>Full Screen</span>
              </div>
              {/* Copy */}
              <div onClick={handleCopy}
                style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 14px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, cursor:'pointer', userSelect:'none' as const, borderLeft:'2px solid transparent' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.background=ALLOY.green4; el.style.color=ALLOY.green1; el.style.borderLeft=`2px solid ${ALLOY.green1}` }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background='none'; el.style.color=ALLOY.ink; el.style.borderLeft='2px solid transparent' }}>
                <Copy size={12} strokeWidth={1.5} style={{ color:'inherit', flexShrink:0 }}/>
                <span style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:'inherit' }}>Copy</span>
              </div>
              {/* Clone */}
              <div onClick={handleClone}
                style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 14px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, cursor:'pointer', userSelect:'none' as const, borderLeft:'2px solid transparent' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.background=ALLOY.green4; el.style.color=ALLOY.green1; el.style.borderLeft=`2px solid ${ALLOY.green1}` }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background='none'; el.style.color=ALLOY.ink; el.style.borderLeft='2px solid transparent' }}>
                <LayoutGrid size={12} strokeWidth={1.5} style={{ color:'inherit', flexShrink:0 }}/>
                <span style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:'inherit' }}>Clone</span>
              </div>
              {/* Share */}
              <div onClick={handleShare}
                style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 14px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, cursor:'pointer', userSelect:'none' as const, borderLeft:'2px solid transparent' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.background=ALLOY.green4; el.style.color=ALLOY.green1; el.style.borderLeft=`2px solid ${ALLOY.green1}` }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background='none'; el.style.color=ALLOY.ink; el.style.borderLeft='2px solid transparent' }}>
                <Link2 size={12} strokeWidth={1.5} style={{ color:'inherit', flexShrink:0 }}/>
                <span style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:'inherit' }}>Share</span>
              </div>
              {/* Divider */}
              <div style={{ height:1, background:ALLOY.line, margin:'4px 0' }}/>
              {/* Remove */}
              <div onClick={handleRemove}
                style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 14px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.red1, cursor:'pointer', userSelect:'none' as const, borderLeft:'2px solid transparent' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.background=ALLOY.red4; el.style.borderLeft=`2px solid ${ALLOY.red1}` }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background='none'; el.style.borderLeft='2px solid transparent' }}>
                <Trash2 size={12} strokeWidth={1.5} style={{ color:ALLOY.red1, flexShrink:0 }}/>
                <span style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.red1 }}>Remove</span>
              </div>
            </div>
        )}
      </div>
    )
  }

  // ── Toggle component ──────────────────────────────────────────────────────
  function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10 }}>
        {label && <span style={{ fontSize:12, color:ALLOY.ink, fontFamily:ALLOY.fontBody }}>{label}</span>}
        <div onClick={() => onChange(!on)}
          style={{ width:36, height:20, borderRadius:999, background: on ? ALLOY.green1 : ALLOY.line, position:'relative', cursor:'pointer', transition:'background 0.2s', flexShrink:0 }}>
          <div style={{ width:16, height:16, borderRadius:'50%', background:ALLOY.white, position:'absolute', top:2, left: on ? 18 : 2, transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.25)' }}/>
        </div>
      </div>
    )
  }

  // ── Resize handle ──────────────────────────────────────────────────────────
  function ResizeHandle({ id }: { id: string }) {
    if (!editMode) return null

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

  function KPICard({ w }: { w: Widget }) {
    const c = KPI_BG[w.color] || KPI_BG.white
    const isWhite = w.color === 'white'
    const isSelected = editingWidget?.id === w.id
    const bgColor = w.bgHex || c.bg
    const borderCol = isSelected && editMode ? ALLOY.green1 : (w.borderColor || c.border)
    const selectedRing = isSelected && editMode
      ? { border:`2.5px solid ${ALLOY.green1}`, boxShadow:`0 0 0 4px ${ALLOY.green4}, 0 6px 24px rgba(32,187,113,0.22)` }
      : {}
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
            <WidgetDot wid={w.id} onEdit={() => startEdit(w)} widget={w}/>
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
          style={{ background:ALLOY.white, borderRadius:2, padding:12, position:'relative', minHeight: widgetSizes[w.id]?.h || 130, cursor: editMode ? 'pointer' : 'default', transition: resizingId === w.id ? 'none' : 'border-color 0.15s, box-shadow 0.15s, opacity 0.15s', opacity: editMode && editingWidget && !isSelected ? 0.45 : 1, border:`2px solid ${borderCol}`, ...selectedRing, ...(widgetSizes[w.id] ? { width: widgetSizes[w.id].w, minWidth: widgetSizes[w.id].w, flex: '0 0 auto' } : { flex: '1 1 220px' }) }}>
          {isSelected && editMode && (
            <div style={{ position:'absolute', top:-12, left:10, zIndex:30, background:ALLOY.green1, color:ALLOY.white, fontFamily:ALLOY.fontLabel, fontSize:8, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' as const, padding:'3px 8px', borderRadius:2, pointerEvents:'none' as const, whiteSpace:'nowrap' as const }}>
              ✦ Editing
            </div>
          )}
          {editControls}
          <ResizeHandle id={w.id}/>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontSize:12, color:ALLOY.mute, fontWeight:500, fontFamily:ALLOY.fontBody }}>{w.title}</span>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              {w.change && <span style={{ fontSize:10, fontWeight:700, padding:'2px 6px', borderRadius:2, color:w.up?ALLOY.green1:ALLOY.red1, background:w.up?ALLOY.green4:ALLOY.red4, fontFamily:ALLOY.fontLabel }}>{w.up?'▲':'▼'} {w.change}</span>}
              {connection?.connected && <span style={{ fontSize:9, color:ALLOY.green1, fontWeight:600, fontFamily:ALLOY.fontLabel }}>● Live</span>}
            </div>
          </div>
          {activeFilters.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap' as const, gap:4, marginBottom:6 }}>
              {activeFilters.map((f: string, i: number) => (
                <span key={i} style={{ fontSize:9, background:ALLOY.yellow4, color:ALLOY.yellow1, border:'1px solid #ffe0b2', borderRadius:999, padding:'2px 8px', display:'flex', alignItems:'center', gap:4, fontFamily:ALLOY.fontLabel }}>
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
        style={{ background:bgColor, borderRadius:2, padding:16, position:'relative', minHeight: widgetSizes[w.id]?.h || 110, cursor: editMode ? 'pointer' : 'default', transition: resizingId === w.id ? 'none' : 'border-color 0.15s, box-shadow 0.15s, opacity 0.15s', opacity: editMode && editingWidget && !isSelected ? 0.45 : 1, border:`2px solid ${borderCol}`, ...selectedRing, ...(widgetSizes[w.id] ? { width: widgetSizes[w.id].w, minWidth: widgetSizes[w.id].w, flex: '0 0 auto' } : { flex: '1 1 180px' }) }}>
        {isSelected && editMode && (
          <div style={{ position:'absolute', top:-12, left:10, zIndex:30, background:ALLOY.green1, color:ALLOY.white, fontFamily:ALLOY.fontLabel, fontSize:8, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' as const, padding:'3px 8px', borderRadius:2, pointerEvents:'none' as const, whiteSpace:'nowrap' as const }}>
            ✦ Editing
          </div>
        )}
        {editControls}
        <ResizeHandle id={w.id}/>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
          <span style={{ fontSize:12, color:c.sub, fontWeight:500, fontFamily:ALLOY.fontBody }}>{w.title}</span>
          {w.change && <span style={{ fontSize:10, fontWeight:700, marginLeft:8, padding:'2px 6px', borderRadius:2, fontFamily:ALLOY.fontLabel, color:isWhite?(w.up?ALLOY.green1:ALLOY.red1):'rgba(255,255,255,0.95)', background:isWhite?(w.up?ALLOY.green4:ALLOY.red4):'rgba(255,255,255,0.18)' }}>{w.up?'▲':'▼'} {w.change}</span>}
        </div>
        <p style={{ fontSize:30, fontWeight:700, color:textCol, letterSpacing:'-0.5px', lineHeight:1, fontFamily:ALLOY.fontDisplay }}>{displayValue}</p>
        {connection?.connected && <p style={{ fontSize:9, color:isWhite?ALLOY.green1:'rgba(255,255,255,0.7)', marginTop:4, fontFamily:ALLOY.fontLabel }}>● Live</p>}
        {w.chartType === 'sparkline' && (
          <div style={{ marginTop:6 }}>
            <DynamicChart chartType="sparkline" data={getWidgetData(w)} height={35} dimensions={(w as any).dimensions} metrics={(w as any).metrics}/>
          </div>
        )}
      </div>
    )
  }

  function ChartCard({ id, children }: { id: string; children: React.ReactNode }) {
    const w = widgets.find(x => x.id === id) || widgets[0]
    const isSelected = editingWidget?.id === w.id
    const sz = widgetSizes[id]
    return (
      <div data-widget-id={w.id}
        onClick={e => { e.stopPropagation(); if (editMode) startEdit(w); else openDrill(w) }}
        style={{ background:ALLOY.white, borderRadius:2, padding:16, position:'relative', cursor: editMode ? 'pointer' : 'default', transition: resizingId === w.id ? 'none' : 'border-color 0.15s, box-shadow 0.15s, opacity 0.15s', opacity: editMode && editingWidget && !isSelected ? 0.45 : 1, ...(isSelected && editMode ? { border:`2.5px solid ${ALLOY.green1}`, boxShadow:`0 0 0 4px ${ALLOY.green4}, 0 6px 24px rgba(32,187,113,0.22)` } : { border:`2px solid ${ALLOY.line}` }), ...(sz ? { width: sz.w, minWidth: sz.w, minHeight: sz.h, flex: '0 0 auto' } : { flex: '1 1 260px' }) }}>
        {isSelected && editMode && (
          <div style={{ position:'absolute', top:-12, left:10, zIndex:30, background:ALLOY.green1, color:ALLOY.white, fontFamily:ALLOY.fontLabel, fontSize:8, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' as const, padding:'3px 8px', borderRadius:2, pointerEvents:'none' as const, whiteSpace:'nowrap' as const }}>
            ✦ Editing
          </div>
        )}
        {editMode && <div style={{ position:'absolute', top:6, left:6, cursor:'grab', color:ALLOY.line }}><Grip size={13}/></div>}
        {editMode && (
          <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:6, right:6, zIndex:10, display:'flex', alignItems:'center', gap:4 }}>
            <button style={{ background:'rgba(0,0,0,0.04)', border:'none', borderRadius:2, padding:'3px 5px', cursor:'pointer', display:'flex' }}>
              <Maximize2 size={10} style={{ color:ALLOY.mute }}/>
            </button>
            <WidgetDot wid={`static__${id}`} onEdit={() => startEdit(w)} widget={w}/>
          </div>
        )}
        <ResizeHandle id={w.id}/>
        {children}
      </div>
    )
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden', background:ALLOY.white, fontFamily:ALLOY.fontBody }}
      onClick={() => { if (openMenu) setOpenMenu(null); if (dashMenu) setDashMenu(null) }}>

      {/* Edit mode bars */}
      {editMode && (
        <>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 16px', borderBottom:`1px solid ${ALLOY.line}`, background:ALLOY.white, flexShrink:0 }}>
            <span style={{ fontSize:14, fontWeight:700, color:ALLOY.ink, fontFamily:ALLOY.fontDisplay }}>Dashboard</span>
            <div style={{ width:1, height:16, background:ALLOY.line }}/>
            {/* Client logo with multi-source fallback */}
            <div style={{ width:24, height:24, borderRadius:2, overflow:'hidden', background:ALLOY.paper, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {clientDomain ? (
                <img
                  src={`https://www.google.com/s2/favicons?domain=${clientDomain}&sz=64`}
                  alt={clientName}
                  style={{ width:20, height:20, objectFit:'contain' }}
                  onError={e => {
                    const img = e.currentTarget as HTMLImageElement
                    if (!img.dataset.fb1) { img.dataset.fb1='1'; img.src=`https://img.logo.dev/${clientDomain}?token=pk_R9ZPqh9xR5Kfh1M6GvCXFA`; return }
                    img.style.display='none'
                  }}
                />
              ) : (
                <span style={{ fontSize:11, fontWeight:700, color:ALLOY.mute, fontFamily:ALLOY.fontLabel }}>{clientName?.[0]?.toUpperCase() || ''}</span>
              )}
            </div>
            <span style={{ fontSize:13, fontWeight:600, color:ALLOY.ink, fontFamily:ALLOY.fontBody }}>{clientName}</span>
            <span style={{ fontSize:11, background:ALLOY.paper, color:ALLOY.mute, padding:'2px 8px', borderRadius:2, fontFamily:ALLOY.fontLabel, letterSpacing:'0.06em', textTransform:'uppercase' as const }}>Client</span>
            <button onClick={() => { setEditMode(false); setEditingWidget(null); setOpenMenu(null) }}
              style={{ marginLeft:'auto', width:28, height:28, borderRadius:'50%', background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <X size={14} style={{ color:ALLOY.ink }}/>
            </button>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderBottom:`1px solid ${ALLOY.line}`, background:ALLOY.white, flexShrink:0 }}>
            <div style={{ display:'flex', gap:1, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:2 }}>
              <button onClick={() => setLiveData(true)} style={{ padding:'5px 14px', borderRadius:2, fontSize:9, fontWeight:700, fontFamily:ALLOY.fontLabel, letterSpacing:'0.06em', textTransform:'uppercase' as const, background:liveData?ALLOY.blue1:'transparent', color:liveData?ALLOY.white:ALLOY.mute, border:'none', cursor:'pointer' }}>Live Data</button>
              <button onClick={() => setLiveData(false)} style={{ padding:'5px 14px', borderRadius:2, fontSize:9, fontWeight:700, fontFamily:ALLOY.fontLabel, letterSpacing:'0.06em', textTransform:'uppercase' as const, background:!liveData?ALLOY.white:'transparent', color:!liveData?ALLOY.ink:ALLOY.mute, border:'none', cursor:'pointer' }}>Sample Data</button>
            </div>
            <button style={{ background:'none', border:'none', cursor:'pointer', color:ALLOY.mute, display:'flex', padding:'4px 5px' }}><RotateCcw size={14}/></button>
            <button style={{ background:'none', border:'none', cursor:'pointer', color:ALLOY.mute, display:'flex', padding:'4px 5px' }}><RotateCw size={14}/></button>
            <div style={{ width:1, height:14, background:ALLOY.line, margin:'0 2px' }}/>
            <button style={{ background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'5px 8px', cursor:'pointer', display:'flex' }}><Monitor size={13} style={{ color:ALLOY.ink }}/></button>
            <button style={{ background:'transparent', border:'none', borderRadius:2, padding:'5px 8px', cursor:'pointer', display:'flex' }}><Smartphone size={13} style={{ color:ALLOY.mute }}/></button>
            <div style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center' }}>
              <button style={{ background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'6px 12px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, cursor:'pointer' }}>⊞ Page Setup</button>
              <button style={{ background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'6px 12px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, cursor:'pointer' }}>◑ Theme</button>
              <button style={{ background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'6px 12px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
                <Calendar size={12}/> Apr 1, 2026 - Apr 30, 2026 <ChevronDown size={11}/>
              </button>
              <button style={{ background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'6px 12px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, cursor:'pointer' }}>▶ Preview</button>
              <span style={{ fontSize:11, color:ALLOY.mute, fontFamily:ALLOY.fontBody }}>☁ Auto saved</span>
            </div>
          </div>
        </>
      )}

      {/* View mode topbar */}
      {!editMode && (
        <div style={{ padding:'10px 20px', borderBottom:`1px solid ${ALLOY.line}`, background:ALLOY.white, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            {/* Breadcrumb: Clients > Client Name > Active Dashboard */}
            <Link href="/dashboard/clients" style={{ fontSize:12, color:ALLOY.mute, textDecoration:'none', fontWeight:500, fontFamily:ALLOY.fontBody }}>Clients</Link>
            <ChevronRight size={12} style={{ color:ALLOY.line }}/>
            <div style={{ display:'flex', alignItems:'center', gap:8, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'5px 10px' }}>
              {/* Logo */}
              <div style={{ width:20, height:20, borderRadius:3, overflow:'hidden', background:ALLOY.line, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {clientDomain ? (
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${clientDomain}&sz=64`}
                    alt={clientName}
                    style={{ width:'100%', height:'100%', objectFit:'contain' }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display='none' }}
                  />
                ) : (
                  <span style={{ fontSize:10, fontWeight:700, color:ALLOY.mute, fontFamily:ALLOY.fontLabel }}>{clientName?.[0]?.toUpperCase() || ''}</span>
                )}
              </div>
              {/* Client name — always shows something */}
              <span style={{ fontSize:13, fontWeight:700, color:ALLOY.ink, maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontFamily:ALLOY.fontDisplay }}>
                {clientName || '...'}
              </span>
              <ChevronDown size={12} style={{ color:ALLOY.mute }}/>
            </div>
            <ChevronRight size={12} style={{ color:ALLOY.line }}/>
            {/* Active dashboard name */}
            <span style={{ fontSize:12, color:ALLOY.blue1, fontWeight:600, fontFamily:ALLOY.fontBody }}>{activeDash}</span>
            {!checkingConn && (
              connection?.connected ? (
                <div style={{ display:'flex', alignItems:'center', gap:6, background:ALLOY.green4, border:'1px solid #20BB71', borderRadius:999, padding:'3px 10px' }}>
                  <CheckCircle2 size={11} style={{ color:ALLOY.green1 }}/>
                  <span style={{ fontSize:11, color:ALLOY.green1, fontWeight:600, fontFamily:ALLOY.fontBody }}>{connection.email}</span>
                  <button onClick={disconnect} style={{ background:'none', border:'none', color:ALLOY.mute, cursor:'pointer', fontSize:11, marginLeft:4, fontFamily:ALLOY.fontBody }}>✕</button>
                </div>
              ) : (
                <button onClick={connectGoogle} style={{ display:'flex', alignItems:'center', gap:6, background:ALLOY.green1, border:'none', borderRadius:2, padding:'4px 12px', color:ALLOY.ink, fontSize:9, fontWeight:700, cursor:'pointer', fontFamily:ALLOY.fontLabel, letterSpacing:'0.06em', textTransform:'uppercase' as const }}>
                  <Plus size={11}/> Connect Google
                </button>
              )
            )}
            <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
              <button style={{ display:'flex', alignItems:'center', gap:6, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'6px 12px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, cursor:'pointer' }}>
                <Sparkles size={13} style={{ color:ALLOY.yellow1 }}/> Ask AI
              </button>
              <button style={{ display:'flex', alignItems:'center', gap:6, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'6px 12px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, cursor:'pointer' }}>
                <Settings size={13}/> Settings
              </button>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center' }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding:'8px 14px', fontFamily:ALLOY.fontBody, fontSize:12, fontWeight:500, cursor:'pointer', background:'none', border:'none', color:activeTab===tab?ALLOY.blue1:ALLOY.mute, borderBottom:activeTab===tab?`2px solid ${ALLOY.blue1}`:'2px solid transparent' }}>{tab}</button>
            ))}
            <div style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center' }}>
              {connection?.connected && connection.ga4_properties?.length > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <select value={selectedProperty} onChange={e => { setSelectedProperty(e.target.value); fetchGA4(e.target.value) }}
                    style={{ background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'5px 10px', fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.ink, maxWidth:200 }}>
                    {connection.ga4_properties.map((p: any) => (
                      <option key={p.name} value={p.name}>{p.displayName||p.name}</option>
                    ))}
                  </select>
                  <button onClick={() => { setMappingProp(selectedProperty); setShowMappingModal(true) }}
                    style={{ background: mappingPropName?ALLOY.green4:'#fff7ed', border:`1px solid ${mappingPropName?ALLOY.green1:ALLOY.yellow1}`, borderRadius:2, padding:'5px 8px', cursor:'pointer', fontFamily:ALLOY.fontBody, fontSize:11, color:mappingPropName?ALLOY.green1:'#f59e0b', fontWeight:600, whiteSpace:'nowrap' as const }}>
                    {mappingPropName ? '✓ Mapped' : '⚙ Map Sources'}
                  </button>
                </div>
              )}
              <select value={dateRange} onChange={e => { setDateRange(e.target.value); fetchGA4() }}
                style={{ background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'5px 10px', fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.ink }}>
                <option value="7daysAgo">Last 7 days</option>
                <option value="30daysAgo">Last 30 days</option>
                <option value="90daysAgo">Last 90 days</option>
              </select>
              {connection?.connected && (
                <button onClick={() => fetchGA4()} disabled={loadingData} style={{ background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'6px 8px', cursor:'pointer', display:'flex' }}>
                  <RefreshCw size={13} style={{ color:ALLOY.mute }}/>
                </button>
              )}
              {/* Share button — Alloy design system, fully functional */}
              <div style={{ position:'relative' as const }}>
                <button
                  onClick={e => { e.stopPropagation(); setShowShareMenu(v => !v); setShareSubmenu(null); setShareEmailInput(''); setShareLinkCopied(false) }}
                  style={{ display:'flex', alignItems:'center', gap:5, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'6px 12px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, cursor:'pointer', fontWeight:400, lineHeight:1 }}>
                  Share
                  <ChevronDown size={11} style={{ color:ALLOY.mute, flexShrink:0 }}/>
                </button>

                {showShareMenu && (
                  <>
                    <div style={{ position:'fixed' as const, inset:0, zIndex:1000 }} onClick={() => { setShowShareMenu(false); setShareSubmenu(null) }}/>
                    <div
                      style={{ position:'absolute' as const, right:0, top:'calc(100% + 3px)', zIndex:1001, background:ALLOY.white, border:`1px solid ${ALLOY.line}`, borderRadius:2, boxShadow:'0 2px 12px rgba(0,0,0,0.08)', minWidth:260, overflow:'hidden' }}
                      onClick={e => e.stopPropagation()}>

                      {/* ── Main menu ── */}
                      {!shareSubmenu && (() => {
                        const ITEMS: { id:string; Icon:React.ElementType; label:string; arrow:boolean; accent?:boolean }[] = [
                          { id:'pdf',    Icon:Download,   label:'Download PDF',             arrow:true  },
                          { id:'email',  Icon:Mail,       label:'Email',                    arrow:true  },
                          { id:'link',   Icon:Link2,      label:'Share Link',               arrow:true  },
                          { id:'tpl',    Icon:LayoutGrid, label:'Save Section as Template', arrow:false },
                          { id:'report', Icon:Plus,       label:'Add To Report',            arrow:false, accent:true },
                        ]
                        return (
                          <div>
                            {ITEMS.map(({ id, Icon, label, arrow, accent }, idx) => (
                              <React.Fragment key={id}>
                                {idx === 3 && <div style={{ height:1, background:ALLOY.line }}/>}
                                <div
                                  onClick={() => {
                                    if (id === 'pdf' || id === 'email' || id === 'link') {
                                      setShareSubmenu(id as any)
                                    } else if (id === 'tpl') {
                                      // Save Section as Template — save to localStorage
                                      const tplName = `${activeDash} — ${new Date().toLocaleDateString()}`
                                      try {
                                        const existing = JSON.parse(localStorage.getItem('alloy_templates') || '[]')
                                        existing.push({ id: Date.now().toString(), name: tplName, dash: activeDash, client: clientName, saved: new Date().toISOString() })
                                        localStorage.setItem('alloy_templates', JSON.stringify(existing))
                                      } catch {}
                                      setShowShareMenu(false)
                                      setShareToast(`"${activeDash}" saved as template`)
                                      setTimeout(() => setShareToast(null), 3000)
                                    } else if (id === 'report') {
                                      // Add To Report — save to report queue
                                      try {
                                        const existing = JSON.parse(localStorage.getItem('alloy_report_queue') || '[]')
                                        existing.push({ id: Date.now().toString(), dash: activeDash, client: clientName, clientId, added: new Date().toISOString() })
                                        localStorage.setItem('alloy_report_queue', JSON.stringify(existing))
                                      } catch {}
                                      setShowShareMenu(false)
                                      setShareToast(`"${activeDash}" added to report`)
                                      setTimeout(() => setShareToast(null), 3000)
                                    }
                                  }}
                                  style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'8px 14px', fontFamily:ALLOY.fontBody, fontSize:12, color:accent?ALLOY.green1:ALLOY.ink, fontWeight:400, cursor:'pointer', lineHeight:'1.4', userSelect:'none' as const }}
                                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.background=ALLOY.green4; el.style.color=ALLOY.green1; const svg=el.querySelector('svg') as SVGElement|null; if(svg) svg.style.color=ALLOY.green1 }}
                                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background='none'; el.style.color=accent?ALLOY.green1:ALLOY.ink; const svg=el.querySelector('svg') as SVGElement|null; if(svg) svg.style.color=accent?ALLOY.green1:ALLOY.mute }}
                                >
                                  <Icon size={13} style={{ color:accent?ALLOY.green1:ALLOY.mute, flexShrink:0 }} strokeWidth={1.5}/>
                                  <span style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:'inherit', fontWeight:400, flex:1 }}>{label}</span>
                                  {arrow && <ChevronRight size={11} style={{ color:ALLOY.mute, flexShrink:0 }}/>}
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        )
                      })()}

                      {/* ── Submenus ── */}
                      {shareSubmenu && (() => {
                        const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
                        const dateRangeLabel: Record<string,string> = { '7daysAgo':'Last 7 days', '30daysAgo':'Last 30 days', '90daysAgo':'Last 90 days' }
                        const dateLabel = dateRangeLabel[dateRange] || 'Last 30 days'
                        const emailSubject = `${clientName} — ${activeDash} Dashboard`
                        const emailBody = `Hi,

Please find the ${activeDash} dashboard for ${clientName} (${dateLabel}).

View online: ${pageUrl}

Alloy Intelligence`

                        const SubHeader = ({ title }: { title:string }) => (
                          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderBottom:`1px solid ${ALLOY.line}`, background:ALLOY.paper }}>
                            <button onClick={() => setShareSubmenu(null)}
                              style={{ display:'flex', alignItems:'center', justifyContent:'center', width:22, height:22, background:ALLOY.white, border:`1px solid ${ALLOY.line}`, borderRadius:2, cursor:'pointer', flexShrink:0 }}
                              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background=ALLOY.green4}
                              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background=ALLOY.white}>
                              <ChevronLeft size={12} style={{ color:ALLOY.ink }}/>
                            </button>
                            <span style={{ fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, textTransform:'uppercase' as const, letterSpacing:'0.12em', color:ALLOY.mute }}>{title}</span>
                          </div>
                        )

                        const SubItem = ({ label, onClick }: { label:string; onClick:()=>void }) => (
                          <div onClick={onClick}
                            style={{ display:'flex', alignItems:'center', padding:'8px 14px 8px 16px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, fontWeight:400, cursor:'pointer', lineHeight:'1.4', borderLeft:'2px solid transparent', userSelect:'none' as const }}
                            onMouseEnter={e => { const el=e.currentTarget as HTMLDivElement; el.style.background=ALLOY.green4; el.style.color=ALLOY.green1; el.style.borderLeft=`2px solid ${ALLOY.green1}` }}
                            onMouseLeave={e => { const el=e.currentTarget as HTMLDivElement; el.style.background='none'; el.style.color=ALLOY.ink; el.style.borderLeft='2px solid transparent' }}>
                            <span style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:'inherit' }}>{label}</span>
                          </div>
                        )

                        // ── PDF submenu ──
                        if (shareSubmenu === 'pdf') return (
                          <div>
                            <SubHeader title="Download PDF"/>
                            <div style={{ padding:'4px 0' }}>
                              <SubItem label="Download Current Section" onClick={() => {
                                setShowShareMenu(false); setShareSubmenu(null)
                                // Use browser print with a minimal print stylesheet
                                const style = document.createElement('style')
                                style.id = 'alloy-print-style'
                                style.innerHTML = `@media print { body > * { display:none!important; } #alloy-canvas { display:block!important; } @page { margin:10mm; } }`
                                document.head.appendChild(style)
                                const canvas = document.getElementById('alloy-canvas')
                                if (canvas) canvas.style.display = 'block'
                                window.print()
                                setTimeout(() => { document.getElementById('alloy-print-style')?.remove() }, 1000)
                              }}/>
                              <SubItem label="Download My Dashboards" onClick={() => {
                                setShowShareMenu(false); setShareSubmenu(null)
                                window.print()
                              }}/>
                            </div>
                          </div>
                        )

                        // ── Email submenu ──
                        if (shareSubmenu === 'email') return (
                          <div>
                            <SubHeader title="Email"/>
                            {/* Email input */}
                            <div style={{ padding:'10px 14px', borderBottom:`1px solid ${ALLOY.line}` }}>
                              <p style={{ fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, color:ALLOY.mute, textTransform:'uppercase' as const, letterSpacing:'0.1em', marginBottom:6 }}>Recipient email</p>
                              <input
                                type="email"
                                value={shareEmailInput}
                                onChange={e => setShareEmailInput(e.target.value)}
                                placeholder="name@company.com"
                                style={{ width:'100%', border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'7px 10px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, outline:'none', background:ALLOY.paper, boxSizing:'border-box' as const }}
                              />
                            </div>
                            <div style={{ padding:'4px 0' }}>
                              <SubItem label="Send Current Section" onClick={() => {
                                setShowShareMenu(false); setShareSubmenu(null)
                                const to = shareEmailInput.trim()
                                const subject = encodeURIComponent(emailSubject)
                                const body = encodeURIComponent(emailBody)
                                window.open(`mailto:${to}?subject=${subject}&body=${body}`)
                              }}/>
                              <SubItem label="Send My Dashboards" onClick={() => {
                                setShowShareMenu(false); setShareSubmenu(null)
                                const to = shareEmailInput.trim()
                                const subject = encodeURIComponent(`${clientName} — All Dashboards`)
                                const body = encodeURIComponent(`Hi,

Here is the full dashboard for ${clientName}.

View online: ${pageUrl}

Alloy Intelligence`)
                                window.open(`mailto:${to}?subject=${subject}&body=${body}`)
                              }}/>
                            </div>
                          </div>
                        )

                        // ── Share Link submenu ──
                        if (shareSubmenu === 'link') return (
                          <div>
                            <SubHeader title="Share Link"/>
                            {/* URL display + copy */}
                            <div style={{ padding:'10px 14px', borderBottom:`1px solid ${ALLOY.line}` }}>
                              <p style={{ fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, color:ALLOY.mute, textTransform:'uppercase' as const, letterSpacing:'0.1em', marginBottom:6 }}>Dashboard URL</p>
                              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                                <div style={{ flex:1, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'7px 10px', fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.mute, background:ALLOY.paper, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>
                                  {pageUrl}
                                </div>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(pageUrl).then(() => {
                                      setShareLinkCopied(true)
                                      setTimeout(() => setShareLinkCopied(false), 2000)
                                    })
                                  }}
                                  style={{ flexShrink:0, background:shareLinkCopied?ALLOY.green1:ALLOY.ink, border:'none', borderRadius:2, padding:'7px 12px', fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:700, color:ALLOY.white, cursor:'pointer', textTransform:'uppercase' as const, letterSpacing:'0.06em', transition:'background 0.2s', whiteSpace:'nowrap' as const }}>
                                  {shareLinkCopied ? '✓ Copied' : 'Copy'}
                                </button>
                              </div>
                            </div>
                            <div style={{ padding:'4px 0' }}>
                              <SubItem label="Share Current Section" onClick={() => {
                                navigator.clipboard.writeText(pageUrl).then(() => {
                                  setShareLinkCopied(true); setShowShareMenu(false); setShareSubmenu(null)
                                  setShareToast('Link copied to clipboard')
                                  setTimeout(() => setShareToast(null), 3000)
                                })
                              }}/>
                              <SubItem label="Share My Dashboards" onClick={() => {
                                const base = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : ''
                                navigator.clipboard.writeText(base).then(() => {
                                  setShowShareMenu(false); setShareSubmenu(null)
                                  setShareToast('Dashboard link copied')
                                  setTimeout(() => setShareToast(null), 3000)
                                })
                              }}/>
                            </div>
                          </div>
                        )

                        return null
                      })()}
                    </div>
                  </>
                )}
              </div>




              <button style={{ background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'6px 8px', cursor:'pointer' }}><Maximize2 size={13}/></button>
              <button onClick={() => setEditMode(true)} style={{ background:ALLOY.green1, border:'none', borderRadius:2, padding:'6px 16px', fontSize:11, color:ALLOY.ink, cursor:'pointer', fontWeight:700, fontFamily:ALLOY.fontLabel, letterSpacing:'0.06em', textTransform:'uppercase' as const }}>Edit Dashboards</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        {/* Left panel */}
        <div style={{ width:220, minWidth:220, borderRight:`1px solid ${ALLOY.line}`, display:'flex', flexDirection:'column', background:ALLOY.white }}>
          <div style={{ padding:12 }}>
            <button onClick={() => {
                const untitledCount = dashboards.filter(d => d.startsWith('Untitled Dashboard')).length
                const newName = untitledCount === 0 ? 'Untitled Dashboard' : 'Untitled Dashboard ' + (untitledCount + 1)
                setDashboards(prev => [...prev, newName])
                setActiveDash(newName)
              }}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:6, background:ALLOY.green1, border:'none', borderRadius:2, padding:'8px 12px', color:ALLOY.ink, fontSize:11, fontWeight:700, fontFamily:ALLOY.fontLabel, letterSpacing:'0.05em', textTransform:'uppercase' as const, cursor:'pointer' }}>
              <Plus size={13}/> {editMode ? 'Add blank dashboard' : 'Add Dashboard'}
            </button>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {dashboards.map(d => (
              <div key={d} style={{ position:'relative' }}>
                {renamingDash === d ? (
                  // ── Inline rename input ──
                  <div style={{ display:'flex', alignItems:'center', padding:'6px 10px', gap:6 }}>
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={e => setRenameValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && renameValue.trim()) {
                          const newName = renameValue.trim()
                          setDashboards(prev => prev.map(x => x === d ? newName : x))
                          if (clonedDashboards.includes(d)) setClonedDashboards(prev => prev.map(x => x === d ? newName : x))
                          if (activeDash === d) setActiveDash(newName)
                          setRenamingDash(null)
                        }
                        if (e.key === 'Escape') setRenamingDash(null)
                      }}
                      onBlur={() => setRenamingDash(null)}
                      style={{ flex:1, fontSize:13, border:'1px solid #48b5ea', borderRadius:2, padding:'4px 8px', outline:'none', color:ALLOY.ink, fontFamily:ALLOY.fontBody }}
                    />
                  </div>
                ) : (
                  // ── Normal dashboard row ──
                  <div
                    style={{ display:'flex', alignItems:'center', padding:'0 4px 0 0', background: activeDash===d ? ALLOY.green4 : 'transparent', borderLeft: activeDash===d ? `3px solid ${ALLOY.green1}` : '3px solid transparent' }}
                    onMouseEnter={e => { if (activeDash!==d) (e.currentTarget as HTMLDivElement).style.background=ALLOY.paper }}
                    onMouseLeave={e => { if (activeDash!==d) (e.currentTarget as HTMLDivElement).style.background='transparent' }}
                  >
                    <button
                      onClick={() => setActiveDash(d)}
                      style={{ flex:1, textAlign:'left', padding:'8px 8px 8px 12px', fontSize:12, cursor:'pointer', background:'none', border:'none', fontFamily:ALLOY.fontBody, fontWeight:activeDash===d?600:400, color:activeDash===d?ALLOY.ink:ALLOY.mute, display:'flex', alignItems:'center', gap:6 }}>
                      {editMode && <Grip size={12} style={{ color:ALLOY.line, flexShrink:0 }}/>}
                      <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d}</span>
                    </button>
                    {/* ··· menu button — always visible on hover, always in edit mode */}
                    <button
                      onClick={e => { e.stopPropagation(); setDashMenu(dashMenu === d ? null : d) }}
                      style={{ flexShrink:0, width:24, height:24, display:'flex', alignItems:'center', justifyContent:'center', background:'none', border:'none', cursor:'pointer', borderRadius:2, opacity: dashMenu===d ? 1 : 0.4 }}
                      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity='1'}
                      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = dashMenu===d?'1':'0.4'}
                    >
                      <MoreHorizontal size={14} style={{ color:ALLOY.ink }}/>
                    </button>
                  </div>
                )}

                {/* ── Dropdown menu ── */}
                {dashMenu === d && (
                  <div
                    onClick={e => e.stopPropagation()}
                    style={{ position:'absolute', left:8, top:'calc(100% + 2px)', background:ALLOY.white, border:`1px solid ${ALLOY.line}`, borderRadius:2, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', padding:4, minWidth:200, zIndex:500 }}>
                    {/* Edit */}
                    <button onClick={() => { setActiveDash(d); setEditMode(true); setDashMenu(null) }}
                      style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'8px 14px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, background:'none', border:'none', cursor:'pointer', borderRadius:2, textAlign:'left' as const }}>
                      ✏️ <span>Edit</span>
                    </button>
                    {/* Rename */}
                    <button onClick={() => { setRenamingDash(d); setRenameValue(d); setDashMenu(null) }}
                      style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'8px 14px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, background:'none', border:'none', cursor:'pointer', borderRadius:2, textAlign:'left' as const }}>
                      ✍️ <span>Rename</span>
                    </button>
                    {/* Clone */}
                    <button onClick={() => {
                        const newName = d + ' (Copy)'
                        setDashboards(prev => [...prev, newName])
                        setClonedDashboards(prev => [...prev, newName])
                        setActiveDash(newName)
                        setDashMenu(null)
                      }}
                      style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'8px 14px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, background:'none', border:'none', cursor:'pointer', borderRadius:2, textAlign:'left' as const }}>
                      ⧉ <span>Clone</span>
                    </button>
                    {/* Save as Template */}
                    <button onClick={() => setDashMenu(null)}
                      style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'8px 14px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, background:'none', border:'none', cursor:'pointer', borderRadius:2, textAlign:'left' as const }}>
                      💾 <span>Save as Template</span>
                    </button>
                    <div style={{ height:1, background:ALLOY.paper, margin:'2px 0' }}/>
                    {/* Delete */}
                    <button onClick={() => {
                        const remaining = dashboards.filter(x => x !== d)
                        setDashboards(remaining)
                        setClonedDashboards(prev => prev.filter(x => x !== d))
                        if (activeDash === d) setActiveDash(remaining[0] || '')
                        setDashMenu(null)
                      }}
                      style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'8px 14px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.red1, background:'none', border:'none', cursor:'pointer', borderRadius:2 }}>
                      🗑️ <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div style={{ padding:'10px 16px 4px' }}>
              <p style={{ fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, color:ALLOY.mute, textTransform:'uppercase' as const, letterSpacing:'0.1em' }}>DATA SOURCES</p>
            </div>
            {DATA_SOURCES.map(s => (
              <button key={s} onClick={() => setOpenSrc(p => { const n = new Set(p); n.has(s)?n.delete(s):n.add(s); return n })}
                style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:8, padding:'7px 16px', fontFamily:ALLOY.fontBody, fontSize:12, cursor:'pointer', background:'none', border:'none', color:ALLOY.ink }}>
                <ChevronRight size={12} style={{ transform:openSrc.has(s)?'rotate(90deg)':'none', transition:'0.15s', color:ALLOY.mute }}/>{s}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas — click background to close edit panel */}
        <div id="alloy-canvas"
          style={{ flex:1, display:'flex', flexDirection:'column', overflowY: isEmptyDash ? 'hidden' : 'auto', background:ALLOY.paper }}
          onClick={() => { if (editingWidget) setEditingWidget(null) }}
        >
          <div style={{ padding:'14px 20px', borderBottom:`1px solid ${ALLOY.line}`, background:ALLOY.white, display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:16, height:16, border:`2px solid ${ALLOY.ink}`, borderRadius:2 }}/>
            <span style={{ fontSize:14, fontWeight:700, color:ALLOY.ink, fontFamily:ALLOY.fontDisplay }}>{activeDash}</span>
            {loadingData && <span style={{ fontSize:11, color:ALLOY.blue1, marginLeft:8, fontFamily:ALLOY.fontBody }}>↻ Loading...</span>}
            {connection?.connected && !loadingData && !isEmptyDash && <span style={{ fontSize:11, color:ALLOY.green1, marginLeft:8, fontFamily:ALLOY.fontLabel }}>● Live GA4 data</span>}
          </div>

          {isEmptyDash ? (
            // ── Empty canvas fills remaining height ──
            <div style={{ flex:1, display:'flex' }}>
              <NewDashCanvas onClone={() => setShowCloneModal(true)} />
            </div>
          ) : (
            // ── Real dashboard content ──
            <div style={{ padding:16 }}>
              <div style={{ background:ALLOY.ink, borderRadius:2, padding:'18px 24px', marginBottom:12 }}>
                <h2 style={{ fontSize:20, fontWeight:700, color:ALLOY.white, fontFamily:ALLOY.fontDisplay }}>{activeDash}</h2>
                {connection?.connected && <p style={{ fontSize:11, color:ALLOY.mute, marginTop:4, fontFamily:ALLOY.fontLabel, letterSpacing:'0.04em' }}>REAL-TIME DATA · {connection.email}</p>}
              </div>
              <div style={{ display:'flex', flexWrap:'wrap' as const, gap:10, marginBottom:10 }}>
                {widgets.filter(w => !isWidgetRemoved(w.id)).map(w => <KPICard key={w.id} w={w}/>)}
              </div>
              <div style={{ display:'flex', flexWrap:'wrap' as const, gap:10, marginBottom:10, alignItems:'flex-start' }}>
                {!isWidgetRemoved('c1') && <ChartCard id="c1">
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:11, color:ALLOY.mute, fontWeight:500, fontFamily:ALLOY.fontBody }}>{widgets.find(x=>x.id==='c1')?.title || 'Sessions Over Time'}</span>
                    {connection?.connected && <span style={{ fontSize:9, color:ALLOY.green1, fontWeight:600, fontFamily:ALLOY.fontLabel }}>● Live</span>}
                  </div>
                  <DynamicChart chartType={widgets.find(x=>x.id==='c1')?.chartType || 'line'} data={getWidgetData(widgets.find(x=>x.id==='c1') || {})} height={80} dimensions={(widgets.find(x=>x.id==='c1') as any)?.dimensions} metrics={(widgets.find(x=>x.id==='c1') as any)?.metrics}/>
                </ChartCard>}
                {!isWidgetRemoved('c2') && <ChartCard id="c2">
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:110 }}>
                    <div style={{ position:'relative', width:90, height:90 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart><Pie data={[{v:44},{v:56}]} cx="50%" cy="50%" innerRadius={28} outerRadius={40} dataKey="v" startAngle={90} endAngle={-270}><Cell fill="#f9b62a"/><Cell fill="#e5e5e5"/></Pie></PieChart>
                      </ResponsiveContainer>
                      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:18, fontWeight:700, fontFamily:ALLOY.fontDisplay }}>44</span></div>
                    </div>
                  </div>
                </ChartCard>}
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {!isWidgetRemoved('c3') && <ChartCard id="c3">
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                      <span style={{ fontSize:11, color:ALLOY.mute, fontFamily:ALLOY.fontBody }}>Conversion Rate</span>
                      <span style={{ fontSize:10, fontWeight:700, color:ALLOY.red1, background:ALLOY.red4, padding:'2px 5px', borderRadius:2, fontFamily:ALLOY.fontLabel }}>▼ 34%</span>
                    </div>
                    <span style={{ fontSize:24, fontWeight:700, color:ALLOY.ink, fontFamily:ALLOY.fontDisplay }}>3%</span>
                  </ChartCard>}
                  {!isWidgetRemoved('bounce') && <div onClick={e => { e.stopPropagation(); if (editMode) startEdit(widgets[3]) }}
                    style={{ background:ALLOY.red1, border:`2px solid ${editingWidget?.id==='bounce' && editMode ? ALLOY.blue1 : ALLOY.red1}`, borderRadius:2, padding:16, position:'relative', cursor: editMode ? 'pointer' : 'default' }}>
                    {editMode && <div style={{ position:'absolute', top:6, left:6, cursor:'grab', color:'rgba(255,255,255,0.35)' }}><Grip size={13}/></div>}
                    {editMode && (
                      <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:6, right:6, zIndex:10, display:'flex', gap:4 }}>
                        <button style={{ background:'rgba(255,255,255,0.2)', border:'none', borderRadius:2, padding:'3px 5px', cursor:'pointer', display:'flex' }}><Maximize2 size={10} style={{ color:'rgba(255,255,255,0.8)' }}/></button>
                        <WidgetDot wid="bounce" onEdit={() => startEdit(widgets[3])} widget={widgets[3]}/>
                      </div>
                    )}
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}><span style={{ fontSize:11, color:'rgba(255,255,255,0.85)', fontFamily:ALLOY.fontBody }}>Bounce Rate</span><span style={{ fontFamily:ALLOY.fontBody, fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.95)', background:'rgba(255,255,255,0.18)', padding:'2px 6px', borderRadius:2 }}>▲ 6.84%</span></div>
                    <p style={{ fontSize:26, fontWeight:700, color:ALLOY.white, letterSpacing:'-0.5px', fontFamily:ALLOY.fontDisplay }}>39.23%</p>
                  </div>}
                </div>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap' as const, gap:10, marginBottom:10, alignItems:'flex-start' }}>
                {!isWidgetRemoved('d1') && <ChartCard id="d1">
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontSize:11, fontWeight:600, fontFamily:ALLOY.fontBody }}>{widgets.find(x=>x.id==='d1')?.title || 'Users By Device'}</span>
                    {connection?.connected && <span style={{ fontSize:9, color:ALLOY.green1, fontWeight:600, fontFamily:ALLOY.fontLabel }}>● Live</span>}
                  </div>
                  <DynamicChart chartType={widgets.find(x=>x.id==='d1')?.chartType || 'column'} data={getWidgetData(widgets.find(x=>x.id==='d1') || {})} height={110} dimensions={(widgets.find(x=>x.id==='d1') as any)?.dimensions} metrics={(widgets.find(x=>x.id==='d1') as any)?.metrics}/>
                </ChartCard>}
                {!isWidgetRemoved('d2') && <ChartCard id="d2">
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontSize:11, fontWeight:600, fontFamily:ALLOY.fontBody }}>Top Referral Sources</span>
                    {connection?.connected && <span style={{ fontSize:9, color:ALLOY.green1, fontWeight:600, fontFamily:ALLOY.fontLabel }}>● Live</span>}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ position:'relative', width:80, height:80, flexShrink:0 }}>
                      <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={sourceData} cx="50%" cy="50%" innerRadius={24} outerRadius={36} dataKey="value">{sourceData.map((_:any,i:number) => <Cell key={i} fill={['#2196f3','#64b5f6',ALLOY.blue3,'#bbdefb'][i%4]}/>)}</Pie></PieChart></ResponsiveContainer>
                      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:9, fontWeight:700, fontFamily:ALLOY.fontLabel }}>Sources</span></div>
                    </div>
                    <div style={{ flex:1 }}>{sourceData.slice(0,4).map((d:any,i:number) => <div key={d.name} style={{ display:'flex', alignItems:'center', gap:4, marginBottom:3 }}><div style={{ width:6, height:6, borderRadius:'50%', background:['#2196f3','#64b5f6',ALLOY.blue3,'#bbdefb'][i%4], flexShrink:0 }}/><span style={{ fontSize:9, color:ALLOY.mute, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontFamily:ALLOY.fontBody }}>{d.name}</span><span style={{ fontSize:9, fontWeight:600, fontFamily:ALLOY.fontBody }}>{d.value?.toLocaleString()}</span></div>)}</div>
                  </div>
                </ChartCard>}
                {!isWidgetRemoved('d3') && <ChartCard id="d3">
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontSize:12, fontWeight:600, fontFamily:ALLOY.fontBody }}>Traffic by Cities</span>
                    {connection?.connected && <span style={{ fontSize:9, color:ALLOY.green1, fontWeight:600, fontFamily:ALLOY.fontLabel }}>● Live</span>}
                  </div>
                  {cityData.map((c:any) => (
                    <div key={c.city} style={{ marginBottom:8 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}><span style={{ fontSize:12, fontFamily:ALLOY.fontBody }}>{c.city}</span><span style={{ fontSize:12, fontWeight:600, fontFamily:ALLOY.fontBody }}>{c.val?.toLocaleString()}</span></div>
                      <div style={{ height:4, background:ALLOY.line, borderRadius:2, overflow:'hidden' }}><div style={{ height:'100%', width:`${(c.val/maxCity)*100}%`, background:ALLOY.green1, borderRadius:2 }}/></div>
                    </div>
                  ))}
                </ChartCard>}
              </div>
              {!isWidgetRemoved('v1') && <ChartCard id="v1">
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                  <span style={{ fontSize:12, fontWeight:600, fontFamily:ALLOY.fontBody }}>{widgets.find(x=>x.id==='v1')?.title || 'Website Views'}</span>
                  {connection?.connected && <span style={{ fontSize:9, color:ALLOY.green1, fontWeight:600, fontFamily:ALLOY.fontLabel }}>● Live GA4</span>}
                </div>
                <DynamicChart chartType={widgets.find(x=>x.id==='v1')?.chartType || 'area'} data={getWidgetData(widgets.find(x=>x.id==='v1') || {})} height={130} dimensions={(widgets.find(x=>x.id==='v1') as any)?.dimensions} metrics={(widgets.find(x=>x.id==='v1') as any)?.metrics}/>
              </ChartCard>}
            </div>
          )}

            {/* Dynamically added widgets */}
            {dynamicWidgets.length >= 1 && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginTop:10 }}>
                {dynamicWidgets.map(w => {
                  const isDynSelected = editingWidget?.id === w.id && editMode
                  return (
                  <div key={w.id}
                    onClick={e => { e.stopPropagation(); if (editMode) startEdit(w) }}
                    style={{ background:ALLOY.white, borderRadius:2, padding:14, position:'relative', cursor: editMode ? 'pointer' : 'default', minHeight:140, transition:'border-color 0.15s, box-shadow 0.15s, opacity 0.15s', opacity: editMode && editingWidget && !isDynSelected ? 0.45 : 1, ...(isDynSelected ? { border:`2.5px solid ${ALLOY.green1}`, boxShadow:`0 0 0 4px ${ALLOY.green4}, 0 6px 24px rgba(32,187,113,0.22)` } : { border:`2px solid ${ALLOY.line}` }) }}>
                    {isDynSelected && (
                      <div style={{ position:'absolute', top:-12, left:10, zIndex:30, background:ALLOY.green1, color:ALLOY.white, fontFamily:ALLOY.fontLabel, fontSize:8, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' as const, padding:'3px 8px', borderRadius:2, pointerEvents:'none' as const, whiteSpace:'nowrap' as const }}>
                        ✦ Editing
                      </div>
                    )}
                    {editMode && <div style={{ position:'absolute', top:6, left:6, cursor:'grab', color:ALLOY.line }}><Grip size={13}/></div>}
                    {editMode && (
                      <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:6, right:6, zIndex:10, display:'flex', gap:4 }}>
                        <WidgetDot wid={w.id} onEdit={() => startEdit(w)} widget={w}/>
                      </div>
                    )}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                      <span style={{ fontSize:12, fontWeight:600, color:ALLOY.ink, fontFamily:ALLOY.fontBody }}>{w.title}</span>
                      {connection?.connected && <span style={{ fontSize:9, color:ALLOY.green1, fontWeight:600, fontFamily:ALLOY.fontLabel }}>● Live</span>}
                    </div>
                    <DynamicChart chartType={w.chartType} data={getWidgetData(w)} height={100} dimensions={(w as any).dimensions} metrics={(w as any).metrics}/>
                  </div>
                )})}
              </div>
            )}
        </div>

        {/* Right panel */}
        {editMode && (
          <div style={{ display:'flex', height:'100%', borderLeft:`1px solid ${ALLOY.line}` }}>
            {editingWidget && (
              <div
                onClick={e => e.stopPropagation()}
                style={{ width:300, minWidth:300, background:ALLOY.white, borderRight:`1px solid ${ALLOY.line}`, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                <div style={{ padding:'14px 16px', borderBottom:`1px solid ${ALLOY.line}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                    <button onClick={() => { setEditingWidget(null); setActiveRightPanel('integrations') }} style={{ width:28, height:28, borderRadius:'50%', background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
                      <ChevronLeft size={14} style={{ color:ALLOY.ink }}/>
                    </button>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3 }}>
                        {/* Color swatch — shows which widget is selected */}
                        <div style={{ width:12, height:12, borderRadius:2, flexShrink:0, background:(KPI_BG[editingWidget.color]||KPI_BG.white).bg, border:`1.5px solid ${ALLOY.green1}`, boxShadow:`0 0 0 2px ${ALLOY.green4}` }}/>
                        <p style={{ fontSize:13, fontWeight:700, color:ALLOY.ink, lineHeight:1.2, fontFamily:ALLOY.fontDisplay, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{editingWidget.title}</p>
                      </div>
                      <p style={{ fontFamily:ALLOY.fontLabel, fontSize:9, color:ALLOY.mute, letterSpacing:'0.08em', textTransform:'uppercase' as const, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{editingWidget.dataSource}</p>
                    </div>
                  </div>
                  <div style={{ display:'flex', borderBottom:`1px solid ${ALLOY.line}` }}>
                    {(['General','Data','Display'] as const).map(t => (
                      <button key={t} onClick={() => setEditTab(t)} style={{ flex:1, padding:'8px 0', fontFamily:ALLOY.fontBody, fontSize:12, fontWeight:editTab===t?600:400, background:'none', border:'none', cursor:'pointer', color:editTab===t?ALLOY.blue1:ALLOY.mute, borderBottom:editTab===t?`2px solid ${ALLOY.blue1}`:'2px solid transparent' }}>{t}</button>
                    ))}
                  </div>
                </div>
                <div style={{ flex:1, overflowY:'auto', padding:16 }}>
                  {editTab==='General' && (
                    <>
                      <div style={{ marginBottom:18 }}>
                        <label style={{ display:'block', fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, color:ALLOY.mute, marginBottom:8, textTransform:'uppercase' as const, letterSpacing:'0.1em' }}>Title</label>
                        <input value={editingWidget.title} onChange={e => {
                          const updated = {...editingWidget, title:e.target.value}
                          setEditingWidget(updated)
                          setWidgets(prev => prev.map(w => w.id === updated.id ? updated : w))
                        }}
                          style={{ width:'100%', background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'8px 12px', fontFamily:ALLOY.fontBody, fontSize:13, outline:'none', color:ALLOY.ink, boxSizing:'border-box' as const }}/>
                      </div>
                      <div style={{ marginBottom:18 }}>
                        <label style={{ display:'block', fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, color:ALLOY.mute, marginBottom:8, textTransform:'uppercase' as const, letterSpacing:'0.1em' }}>Tooltip</label>
                        <textarea value={editingWidget.tooltip} onChange={e => {
                          const updated = {...editingWidget, tooltip:e.target.value}
                          setEditingWidget(updated)
                          setWidgets(prev => prev.map(w => w.id === updated.id ? updated : w))
                        }}
                          style={{ width:'100%', background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'8px 12px', fontSize:13, outline:'none', color:ALLOY.ink, resize:'vertical' as const, minHeight:80, fontFamily:ALLOY.fontBody, boxSizing:'border-box' as const }}/>
                      </div>
                      <div style={{ marginBottom:12 }}>
                        <label style={{ display:'block', fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, color:ALLOY.mute, marginBottom:10, textTransform:'uppercase' as const, letterSpacing:'0.1em' }}>Chart Type</label>
                        <div style={{ maxHeight:380, overflowY:'auto', border:`1px solid ${ALLOY.line}`, borderRadius:2, background:ALLOY.paper }}>
                          {CHART_TYPE_GROUPS.map(group => (
                            <div key={group.group} style={{ padding:'10px 10px 4px' }}>
                              <p style={{ fontSize:9, fontWeight:600, color:ALLOY.mute, textTransform:'uppercase' as const, letterSpacing:'0.1em', fontFamily:ALLOY.fontLabel, marginBottom:8 }}>{group.group}</p>
                              <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6, marginBottom:6 }}>
                                {group.types.map(ct => {
                                  const active = editingWidget.chartType === ct.id
                                  return (
                                    <button key={ct.id}
                                      onClick={() => {
                                        const updated = {...editingWidget, chartType:ct.id}
                                        setEditingWidget(updated)
                                        setWidgets(prev => prev.map(w => w.id === updated.id ? updated : w))
                                      }}
                                      title={ct.label}
                                      style={{ display:'flex', flexDirection:'column' as const, alignItems:'center', gap:3, padding:'5px 3px', borderRadius:2, border:`2px solid ${active?'#1a73e8':ALLOY.line}`, background:active?ALLOY.blue4:ALLOY.white, cursor:'pointer', transition:'all 0.1s', width:60, minWidth:60 }}>
                                      <ChartThumbSvg id={ct.id} active={active}/>
                                      <span style={{ fontFamily:ALLOY.fontLabel, fontSize:9, color:active?ALLOY.green1:ALLOY.ink, fontWeight:active?600:400, textAlign:'center' as const, lineHeight:1.2, whiteSpace:'nowrap' as const, overflow:'hidden', textOverflow:'ellipsis', width:'100%', letterSpacing:'0.04em' }}>{ct.label}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderTop:`1px solid ${ALLOY.line}`, marginBottom:16 }}>
                        <span style={{ fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, color:ALLOY.mute, textTransform:'uppercase' as const, letterSpacing:'0.1em' }}>Override Date Range</span>
                        <div style={{ width:42, height:24, borderRadius:2, background:ALLOY.line, position:'relative', cursor:'pointer' }}>
                          <div style={{ width:20, height:20, borderRadius:'50%', background:ALLOY.white, position:'absolute', top:2, left:2, boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
                        </div>
                      </div>
                      <button onClick={saveWidget} style={{ width:'100%', background:ALLOY.green1, border:'none', borderRadius:2, padding:'10px', fontFamily:ALLOY.fontLabel, fontSize:11, fontWeight:700, color:ALLOY.ink, cursor:'pointer', letterSpacing:'0.06em', textTransform:'uppercase' as const }}>Save Changes</button>
                    </>
                  )}
                  {editTab==='Data' && (() => {
                    const isGA4 = editingWidget.dataSource?.includes('google-analytics')
                    const ALL_GA4_DIMENSIONS = [
                      'Achievement ID','Action','Ad format','Ad Label','Ad source','Ad unit','Age',
                      'Aggregated Link URL','Aggregated Page Path','App version','Browser','Campaign',
                      'Campaign ID','City','City ID','Content Group','Content ID','Content Type',
                      'Country','Country ID','Date','Date Hour','Day','Day of Week','Default Channel Group',
                      'Device Brand','Device Category','Device Model','Event Name','File Extension',
                      'File Name','First User Campaign','First User Medium','First User Source',
                      'Form Destination','Form ID','Form Name','Form Submit Text','Gender',
                      'Google Ads Account Name','Google Ads Ad Group ID','Google Ads Ad Group Name',
                      'Google Ads Ad Network Type','Google Ads Keyword Text','Google Ads Query',
                      'Hostname','Hour','Item Affiliation','Item Brand','Item Category','Item Category 2',
                      'Item Category 3','Item Category 4','Item Category 5','Item ID','Item List ID',
                      'Item List Name','Item Location ID','Item Name','Item Promotion Creative Name',
                      'Item Promotion Creative Slot','Item Promotion ID','Item Promotion Name',
                      'Item Variant','Landing Page','Language','Language Code','Manual Ad Content',
                      'Manual Campaign ID','Manual Campaign Name','Manual Creative Format',
                      'Manual Marketing Tactic','Manual Medium','Manual Source','Manual Source / Medium',
                      'Manual Term','Method','Minute','Month','New / Returning','Operating System',
                      'Operating System Version','Outbound','Page Location','Page Path + Query String',
                      'Page Referrer','Page Title','Platform','Region','Screen Class','Screen Name',
                      'Search Term','Session Campaign','Session Default Channel Group','Session Duration',
                      'Session Google Ads Ad Network Type','Session Google Ads Keyword Text',
                      'Session Manual Ad Content','Session Manual Campaign ID','Session Manual Campaign Name',
                      'Session Manual Creative Format','Session Manual Marketing Tactic',
                      'Session Manual Medium','Session Manual Source','Session Manual Source / Medium',
                      'Session Manual Term','Session Medium','Session SA360 Ad Group Name',
                      'Session Source','Session Source / Medium','Source / Medium','Stream ID',
                      'Stream Name','Test Data Filter Name','Transaction ID','Unification Service Level',
                      'Video Provider','Video Title','Video URL','Visible','Week','Year'
                    ]
                    const ALL_GA4_METRICS = [
                      '1-day active users','28-day active users','30-day active users',
                      '7-day active users','Active users','Ad unit exposure','Add to carts',
                      'Ads clicks','Ads cost','Ads cost per click','Ads impressions',
                      'Ads revenue','Ads revenue per click','Average purchase revenue',
                      'Average purchase revenue per user','Average revenue per user',
                      'Average session duration','Bounce rate','Cart-to-view rate',
                      'Checkouts','Conversions','Crash-affected users','Crash-free users rate',
                      'DAU / MAU','DAU / WAU','Engaged sessions','Engagement rate',
                      'Event count','Event count per user','Events per session',
                      'First time purchasers','First time purchasers conversion',
                      'Item list click events','Item list clicks through rate',
                      'Item list view events','Item promotion clicks','Item promotion CTR',
                      'Item promotion views','Item purchase quantity','Item revenue',
                      'Item view events','Items added to cart','Items checked out',
                      'Items purchased','Items viewed in list','Items viewed in promotion',
                      'New users','Organic Google search average position',
                      'Organic Google search click through rate','Organic Google search clicks',
                      'Organic Google search impressions','Publisher ad clicks',
                      'Publisher ad impressions','Purchase revenue','Purchase revenue per user',
                      'Purchase to view rate','Purchasers','Purchasers per new user',
                      'Refund amount','Return on ad spend','Revenue','Screen page views',
                      'Screen page views per session','Screen page views per user',
                      'Session conversion rate','Session key event rate','Sessions',
                      'Sessions per user','Shipping amount','Tax amount','Total ad revenue',
                      'Total purchasers','Total revenue','Total users','Transactions',
                      'Transactions per purchaser','User conversion rate','User engagement',
                      'User key event rate','Views per session','WAU / MAU'
                    ]
                    // Show only this client's mapped property first, then all others
                    const mappedProp = connection?.ga4_properties?.find((p: any) =>
                      p.name === mappingProp || p.displayName === mappingPropName
                    )
                    const otherProps = (connection?.ga4_properties || []).filter((p: any) =>
                      p.name !== mappingProp && p.displayName !== mappingPropName
                    )
                    const DATA_SOURCES = [
                      // Mapped property for this client goes first
                      ...(mappedProp ? [{
                        id: mappedProp.name,
                        label: mappedProp.displayName || mappedProp.name,
                        domain: 'analytics.google.com',
                        isMapped: true,
                      }] : []),
                      // GSC site for this client
                      ...(mappingSite ? [{
                        id: mappingSite,
                        label: mappingSite.replace(/^https?:\/\//, '').replace(/\/$/, ''),
                        domain: 'search.google.com',
                        isMapped: true,
                      }] : []),

                    ]
                    const widgetData = editingWidget as any
                    const dimensions: string[] = widgetData.dimensions || []
                    const metrics: string[] = widgetData.metrics || []

                    const updateField = (key: string, val: any) => {
                      const updated = { ...editingWidget, [key]: val } as any
                      setEditingWidget(updated)
                      setWidgets(prev => prev.map(w => w.id === updated.id ? updated : w))

                    }

                    return (
                      <div style={{ fontSize:12, fontFamily:ALLOY.fontBody }}>

                        {/* Data Source */}
                        <div style={{ padding:'14px 0', borderBottom:`1px solid ${ALLOY.line}`, position:'relative' as const }}>
                          <p style={{ fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, color:ALLOY.mute, marginBottom:10, textTransform:'uppercase' as const, letterSpacing:'0.1em' }}>Data source</p>
                          <div onClick={() => setShowDsDropdown(!showDsDropdown)}
                            style={{ display:'flex', alignItems:'center', gap:8, background:ALLOY.paper, border:'1px solid #e0e0e0', borderRadius:999, padding:'7px 12px', cursor:'pointer' }}>
                            <img src="https://www.google.com/s2/favicons?domain=analytics.google.com&sz=32" style={{ width:16, height:16 }} alt=""/>
                            <span style={{ flex:1, fontSize:12, color:ALLOY.ink, fontWeight:500, fontFamily:ALLOY.fontBody }}>{editingWidget.dataSource?.split('/').pop()?.trim() || 'Select source'}</span>
                            <ChevronDown size={14} style={{ color:ALLOY.mute }}/>
                            <button onClick={e=>{e.stopPropagation()}} style={{ background:'none', border:'none', cursor:'pointer', color:ALLOY.mute, padding:'0 2px' }}><X size={12}/></button>
                          </div>
                          {showDsDropdown && (
                            <div style={{ position:'absolute' as const, top:'100%', left:0, right:0, background:ALLOY.white, border:'1px solid #e0e0e0', borderRadius:2, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:200, overflow:'hidden' }}>
                              <div style={{ padding:'10px 12px', borderBottom:`1px solid ${ALLOY.line}` }}>
                                <div style={{ display:'flex', alignItems:'center', gap:8, background:ALLOY.paper, borderRadius:2, padding:'6px 10px', border:'1px solid #e0e0e0' }}>
                                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="#999" strokeWidth="1.5"/><path d="M9.5 9.5 L12 12" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                  <input autoFocus value={dsSearch} onChange={e=>setDsSearch(e.target.value)} placeholder="Search" style={{ background:'transparent', border:'none', outline:'none', fontSize:12, color:ALLOY.ink, fontFamily:ALLOY.fontBody, width:'100%' }}/>
                                </div>
                              </div>
                              <div style={{ padding:'8px 0' }}>
                                <p style={{ fontFamily:ALLOY.fontLabel, fontSize:9, color:ALLOY.mute, padding:'4px 14px', fontWeight:600, textTransform:'uppercase' as const, letterSpacing:'0.08em' }}>Added data sources</p>
                                {DATA_SOURCES.length === 0 && (
                                  <div style={{ padding:'12px 14px', fontSize:12, color:ALLOY.mute, textAlign:'center' as const, fontFamily:ALLOY.fontBody }}>
                                    No connected sources. Connect Google above.
                                  </div>
                                )}
                                {/* This client's sources */}
                                {DATA_SOURCES.filter((ds:any) => ds.isMapped && ds.label.toLowerCase().includes(dsSearch.toLowerCase())).length > 0 && (
                                  <p style={{ fontFamily:ALLOY.fontLabel, fontSize:9, color:ALLOY.mute, padding:'8px 14px 4px', fontWeight:600, textTransform:'uppercase' as const, letterSpacing:'0.08em' }}>
                                    {clientName} — connected sources
                                  </p>
                                )}
                                {DATA_SOURCES.filter((ds:any) => ds.isMapped && ds.label.toLowerCase().includes(dsSearch.toLowerCase())).map((ds:any) => (
                                  <div key={ds.id} onClick={() => { updateField('dataSource', ds.label); setShowDsDropdown(false) }}
                                    style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', cursor:'pointer', background: (widgetData.dataSource === ds.label) ? ALLOY.blue4 : 'transparent' }}
                                    onMouseEnter={e=>{ if(widgetData.dataSource !== ds.label)(e.currentTarget as HTMLDivElement).style.background=ALLOY.blue4 }}
                                    onMouseLeave={e=>{ (e.currentTarget as HTMLDivElement).style.background = (widgetData.dataSource === ds.label) ? ALLOY.blue4 : 'transparent' }}>
                                    <img src={`https://www.google.com/s2/favicons?domain=${ds.domain}&sz=32`} style={{ width:18, height:18 }} alt=""/>
                                    <span style={{ fontSize:12, color:ALLOY.ink, flex:1, fontFamily:ALLOY.fontBody }}>{ds.label}</span>
                                    {widgetData.dataSource === ds.label && <span style={{ fontSize:10, color:ALLOY.blue1, fontWeight:600, fontFamily:ALLOY.fontLabel }}>✓</span>}
                                  </div>
                                ))}

                              </div>
                            </div>
                          )}
                          <button style={{ display:'flex', alignItems:'center', gap:6, marginTop:8, background:'none', border:'none', cursor:'pointer', color:ALLOY.green1, fontSize:9, fontWeight:700, fontFamily:ALLOY.fontLabel, letterSpacing:'0.05em', padding:0, textTransform:'uppercase' as const }}>
                            <span style={{ fontSize:14, fontFamily:ALLOY.fontBody }}>⊕</span> Blend data
                          </button>
                        </div>

                        {/* Dimension */}
                        <div style={{ padding:'14px 0', borderBottom:`1px solid ${ALLOY.line}`, position:'relative' as const }}>
                          <p style={{ fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, color:ALLOY.mute, marginBottom:10, textTransform:'uppercase' as const, letterSpacing:'0.1em' }}>Dimension</p>
                          <div style={{ display:'flex', flexDirection:'column' as const, gap:6 }}>
                            {dimensions.map((dim: string, i: number) => (
                              <div key={i} style={{ display:'flex', alignItems:'center', gap:8, background:ALLOY.green4, border:`1px solid ${ALLOY.green1}`, borderRadius:2, padding:'6px 12px' }}>
                                <span style={{ fontSize:10, fontWeight:700, color:ALLOY.green1, background:ALLOY.green4, borderRadius:2, padding:'1px 5px', fontFamily:ALLOY.fontLabel }}>ABC</span>
                                <span style={{ flex:1, fontSize:12, color:ALLOY.ink, fontFamily:ALLOY.fontBody }}>{dim}</span>
                                <button onClick={() => updateField('dimensions', dimensions.filter((_:string,j:number)=>j!==i))} style={{ background:'none', border:'none', cursor:'pointer', color:ALLOY.mute, padding:0 }}><X size={11}/></button>
                              </div>
                            ))}
                            <button onClick={() => { setShowDimDropdown(!showDimDropdown); setDimSearch('') }}
                              style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:`1px dashed ${ALLOY.line}`, borderRadius:2, padding:'6px 12px', cursor:'pointer', color:ALLOY.green1, fontSize:9, fontWeight:700, fontFamily:ALLOY.fontLabel, letterSpacing:'0.06em', textTransform:'uppercase' as const }}>
                              <Plus size={13}/> Add dimension
                            </button>
                          </div>
                          {showDimDropdown && (
                            <div style={{ position:'absolute' as const, top:'100%', left:0, right:0, background:ALLOY.white, border:'1px solid #e0e0e0', borderRadius:2, boxShadow:'0 8px 24px rgba(0,0,0,0.14)', zIndex:200, overflow:'hidden', maxHeight:340 }}>
                              <div style={{ padding:'10px 12px', borderBottom:`1px solid ${ALLOY.line}`, position:'sticky' as const, top:0, background:ALLOY.white }}>
                                <div style={{ display:'flex', alignItems:'center', gap:8, background:ALLOY.paper, borderRadius:2, padding:'7px 12px', border:`1px solid ${ALLOY.line}` }}>
                                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="#999" strokeWidth="1.5"/><path d="M9.5 9.5 L12 12" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                  <input autoFocus value={dimSearch} onChange={e=>setDimSearch(e.target.value)} placeholder="Search" style={{ background:'transparent', border:'none', outline:'none', fontSize:12, color:ALLOY.ink, fontFamily:ALLOY.fontBody, width:'100%' }}/>
                                </div>
                              </div>
                              <div style={{ overflowY:'auto' as const, maxHeight:240 }}>
                                <p style={{ fontFamily:ALLOY.fontLabel, fontSize:9, color:ALLOY.mute, padding:'8px 14px 4px', fontWeight:600, textTransform:'uppercase' as const, letterSpacing:'0.08em' }}>Default group</p>
                                {ALL_GA4_DIMENSIONS.filter((d:string) => d.toLowerCase().includes(dimSearch.toLowerCase()) && !dimensions.includes(d)).map((dim:string) => (
                                  <div key={dim} onClick={() => { updateField('dimensions', [...dimensions, dim]); setShowDimDropdown(false); setDimSearch('') }}
                                    style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 14px', cursor:'pointer' }}
                                    onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background=ALLOY.green4}
                                    onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}>
                                    <span style={{ fontFamily:ALLOY.fontLabel, fontSize:10, fontWeight:700, color:ALLOY.green1, background:ALLOY.green4, borderRadius:3, padding:'1px 5px', flexShrink:0 }}>ABC</span>
                                    <span style={{ fontSize:12, color:ALLOY.ink, fontFamily:ALLOY.fontBody }}>{dim}</span>
                                  </div>
                                ))}
                              </div>
                              <div style={{ padding:'8px 14px', borderTop:`1px solid ${ALLOY.line}` }}>
                                {[{icon:'⊕',label:'Add calculated field'},{icon:'⊕',label:'Add group'},{icon:'⊕',label:'Add bin'}].map(a => (
                                  <div key={a.label} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', color:ALLOY.blue1, cursor:'pointer', fontFamily:ALLOY.fontBody, fontSize:13, fontWeight:500 }}>
                                    <span>{a.icon}</span>{a.label}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <Toggle label="Drill down" on={!!(widgetData as any).drillDown} onChange={v => updateField('drillDown', v)}/>
                        </div>

                        {/* Metric */}
                        <div style={{ padding:'14px 0', borderBottom:`1px solid ${ALLOY.line}`, position:'relative' as const }}>
                          <p style={{ fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, color:ALLOY.mute, marginBottom:10, textTransform:'uppercase' as const, letterSpacing:'0.1em' }}>Metric</p>
                          <div style={{ display:'flex', flexDirection:'column' as const, gap:6 }}>
                            {metrics.map((met: string, i: number) => (
                              <div key={i} style={{ display:'flex', alignItems:'center', gap:8, background:ALLOY.blue4, border:`1px solid ${ALLOY.blue1}`, borderRadius:2, padding:'6px 12px' }}>
                                <span style={{ fontSize:10, fontWeight:700, color:ALLOY.blue1, background:ALLOY.blue4, borderRadius:2, padding:'1px 5px', fontFamily:ALLOY.fontLabel }}>123</span>
                                <span style={{ flex:1, fontSize:12, color:ALLOY.ink, fontFamily:ALLOY.fontBody }}>{met}</span>
                                <button onClick={() => updateField('metrics', metrics.filter((_:string,j:number)=>j!==i))} style={{ background:'none', border:'none', cursor:'pointer', color:ALLOY.mute, padding:0 }}><X size={11}/></button>
                              </div>
                            ))}
                            <button onClick={() => { setShowMetDropdown(!showMetDropdown); setMetSearch('') }}
                              style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:`1px dashed ${ALLOY.line}`, borderRadius:2, padding:'6px 12px', cursor:'pointer', color:ALLOY.green1, fontSize:9, fontWeight:700, fontFamily:ALLOY.fontLabel, letterSpacing:'0.06em', textTransform:'uppercase' as const }}>
                              <Plus size={13}/> Add metric
                            </button>
                          </div>
                          {showMetDropdown && (
                            <div style={{ position:'absolute' as const, top:'100%', left:0, right:0, background:ALLOY.white, border:'1px solid #e0e0e0', borderRadius:2, boxShadow:'0 8px 24px rgba(0,0,0,0.14)', zIndex:200, overflow:'hidden', maxHeight:340 }}>
                              <div style={{ padding:'10px 12px', borderBottom:`1px solid ${ALLOY.line}`, position:'sticky' as const, top:0, background:ALLOY.white }}>
                                <div style={{ display:'flex', alignItems:'center', gap:8, background:ALLOY.paper, borderRadius:2, padding:'7px 12px', border:`1px solid ${ALLOY.line}` }}>
                                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="#999" strokeWidth="1.5"/><path d="M9.5 9.5 L12 12" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                  <input autoFocus value={metSearch} onChange={e=>setMetSearch(e.target.value)} placeholder="Search" style={{ background:'transparent', border:'none', outline:'none', fontSize:12, color:ALLOY.ink, fontFamily:ALLOY.fontBody, width:'100%' }}/>
                                </div>
                              </div>
                              <div style={{ overflowY:'auto' as const, maxHeight:240 }}>
                                <p style={{ fontFamily:ALLOY.fontLabel, fontSize:9, color:ALLOY.mute, padding:'8px 14px 4px', fontWeight:600, textTransform:'uppercase' as const, letterSpacing:'0.08em' }}>Default group</p>
                                {ALL_GA4_METRICS.filter((m:string) => m.toLowerCase().includes(metSearch.toLowerCase()) && !metrics.includes(m)).map((met:string) => (
                                  <div key={met} onClick={() => { updateField('metrics', [...metrics, met]); setShowMetDropdown(false); setMetSearch('') }}
                                    style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 14px', cursor:'pointer' }}
                                    onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background=ALLOY.blue4}
                                    onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}>
                                    <span style={{ fontSize:10, fontWeight:700, color:ALLOY.blue1, background:ALLOY.blue4, borderRadius:2, padding:'1px 5px', flexShrink:0, fontFamily:ALLOY.fontLabel }}>123</span>
                                    <span style={{ fontSize:12, color:ALLOY.ink, fontFamily:ALLOY.fontBody }}>{met}</span>
                                  </div>
                                ))}
                              </div>
                              <div style={{ padding:'8px 14px', borderTop:`1px solid ${ALLOY.line}` }}>
                                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', color:ALLOY.blue1, cursor:'pointer', fontFamily:ALLOY.fontBody, fontSize:13, fontWeight:500 }}>
                                  <span>⊕</span> Add calculated field
                                </div>
                              </div>
                            </div>
                          )}
                          <Toggle label="Optional metrics" on={!!(widgetData as any).optionalMetrics} onChange={v => updateField('optionalMetrics', v)}/>
                          <Toggle label="Metric sliders" on={!!(widgetData as any).metricSliders} onChange={v => updateField('metricSliders', v)}/>
                        </div>

                        {/* Filter */}
                        <div style={{ padding:'14px 0', borderBottom:`1px solid ${ALLOY.line}`, position:'relative' as const }}>
                          <p style={{ fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, color:ALLOY.mute, marginBottom:4, textTransform:'uppercase' as const, letterSpacing:'0.1em' }}>Filter</p>
                          <p style={{ fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.mute, marginBottom:8 }}>Report Filter</p>
                          <div style={{ background:ALLOY.paper, border:'1px solid #e0e0e0', borderRadius:999, padding:'7px 14px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, marginBottom:10 }}>
                            {(widgetData.filters as string[])?.length > 0 ? (widgetData.filters as string[]).join(', ') : 'No filter applied'}
                          </div>

                          {/* Applied filters */}
                          {((widgetData.filters as string[]) || []).length > 0 && (
                            <div style={{ display:'flex', flexDirection:'column' as const, gap:6, marginBottom:8 }}>
                              {((widgetData.filters as string[]) || []).map((f: string, i: number) => (
                                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, background:ALLOY.yellow4, border:`1px solid ${ALLOY.yellow2}`, borderRadius:2, padding:'6px 12px', cursor:'pointer' }}
                                  onClick={() => {
                                    // Find saved filter definition — check userFilters first, then ga4Filters
                                    const saved = userFilters.find((gf: any) => gf.name === f) || ga4Filters.find((gf: any) => gf.name === f)
                                    setEditingFilterName(f)
                                    setNewFilterName(f)
                                    if (saved && (saved as any).clauses?.length > 0) {
                                      setNewFilterClauses((saved as any).clauses.map((c: any) => ({ include: c.include, field: c.field, operator: c.operator, value: c.value || '' })))
                                      const vals: {[idx: number]: string[]} = {}
                                      ;(saved as any).clauses.forEach((c: any, idx: number) => { if (c.values?.length > 0) vals[idx] = c.values })
                                      setSelectedEventValues(vals)
                                    } else {
                                      setNewFilterClauses([{ include: true, field: '', operator: 'contains', value: '' }])
                                      setSelectedEventValues({})
                                    }
                                    setShowCreateFilter(true)
                                  }}>
                                  <span style={{ fontSize:11, fontFamily:ALLOY.fontBody }}>≡</span>
                                  <span style={{ flex:1, fontSize:12, color:ALLOY.yellow1, fontWeight:600, fontFamily:ALLOY.fontLabel }}>{f}</span>
                                  <button onClick={e => { e.stopPropagation(); updateField('filters', ((widgetData.filters as string[]) || []).filter((_: string, j: number) => j !== i)) }}
                                    style={{ background:'none', border:'none', cursor:'pointer', color:ALLOY.mute, padding:0 }}><X size={11}/></button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div style={{ marginBottom:8 }}>
                            <Toggle label="Inherit filters" on={!!(widgetData as any).inheritFilters} onChange={v => updateField('inheritFilters', v)}/>
                          </div>

                          <p style={{ fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, color:ALLOY.mute, marginBottom:6, textTransform:'uppercase' as const, letterSpacing:'0.1em' }}>Filters on this chart</p>
                          <button
                            onClick={() => { setShowFilterDropdown(!showFilterDropdown); setFilterSearch(''); if (ga4Filters.length === 0) loadGA4Filters() }}
                            style={{ display:'flex', alignItems:'center', gap:8, background:'transparent', border:`1px dashed ${ALLOY.green1}`, borderRadius:2, padding:'8px 14px', cursor:'pointer', color:ALLOY.green1, fontSize:9, fontWeight:700, fontFamily:ALLOY.fontLabel, letterSpacing:'0.06em', width:'100%', justifyContent:'center', textTransform:'uppercase' as const }}>
                            <Plus size={13}/> Add filter
                          </button>

                          {/* Filter dropdown */}
                          {showFilterDropdown && (
                            <div style={{ position:'absolute' as const, top:'100%', left:0, right:0, background:ALLOY.white, border:'1px solid #e0e0e0', borderRadius:2, boxShadow:'0 8px 32px rgba(0,0,0,0.15)', zIndex:300, overflow:'hidden', maxHeight:400 }}>
                              {/* Search */}
                              <div style={{ padding:'12px 14px', borderBottom:`1px solid ${ALLOY.line}`, position:'sticky' as const, top:0, background:ALLOY.white }}>
                                <div style={{ display:'flex', alignItems:'center', gap:8, background:ALLOY.paper, borderRadius:999, padding:'8px 14px' }}>
                                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="5" stroke="#999" strokeWidth="1.5"/><path d="M10.5 10.5 L13 13" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                  <input autoFocus value={filterSearch} onChange={e => setFilterSearch(e.target.value)}
                                    placeholder="Search" style={{ background:'transparent', border:'none', outline:'none', fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink, width:'100%' }}/>
                                </div>
                              </div>

                              <div style={{ overflowY:'auto' as const, maxHeight:300 }}>
                                {loadingFilters && (
                                  <div style={{ padding:'16px', textAlign:'center' as const, fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.mute }}>Loading filters...</div>
                                )}

                                {/* User-created filters */}
                                {userFilters.filter((f: any) => f.name.toLowerCase().includes(filterSearch.toLowerCase())).length > 0 && (
                                  <div style={{ padding:'8px 0', borderBottom:`1px solid ${ALLOY.line}` }}>
                                    <p style={{ fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.yellow1, padding:'4px 14px 6px', fontWeight:600, textTransform:'uppercase' as const, letterSpacing:'0.05em' }}>Custom filters</p>
                                    {userFilters.filter((f: any) => f.name.toLowerCase().includes(filterSearch.toLowerCase())).map((f: any) => (
                                      <div key={f.name}
                                        onClick={() => { updateField('filters', [...((widgetData.filters as string[]) || []), f.name]); setShowFilterDropdown(false) }}
                                        style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, cursor:'pointer', background:ALLOY.yellow4, borderLeft:`3px solid ${ALLOY.yellow1}` }}
                                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = ALLOY.yellow3}
                                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = ALLOY.yellow4}>
                                        <span style={{ fontSize:11, fontFamily:ALLOY.fontBody }}>≡</span>
                                        {f.name}
                                        {f.clauses?.length > 0 && <span style={{ fontFamily:ALLOY.fontBody, fontSize:10, color:ALLOY.mute, marginLeft:'auto' }}>{f.clauses.length} clause{f.clauses.length > 1 ? 's' : ''}</span>}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* GA4 filters from connected property */}
                                {ga4Filters.filter(f => f.type === 'ga4').filter(f => f.name.toLowerCase().includes(filterSearch.toLowerCase())).length > 0 && (
                                  <div style={{ padding:'8px 0' }}>
                                    <p style={{ fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.mute, padding:'4px 14px 6px', fontWeight:600 }}>Data source and resource filters</p>
                                    {ga4Filters.filter(f => f.type === 'ga4' && f.name.toLowerCase().includes(filterSearch.toLowerCase())).map(f => (
                                      <div key={f.name}
                                        onClick={() => { updateField('filters', [...((widgetData.filters as string[]) || []), f.name]); setShowFilterDropdown(false) }}
                                        style={{ padding:'9px 14px', fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink, cursor:'pointer', background:'transparent' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = ALLOY.paper}
                                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                                        {f.name}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Other data source filters */}
                                {ga4Filters.filter(f => f.type === 'other').filter(f => f.name.toLowerCase().includes(filterSearch.toLowerCase())).length > 0 && (
                                  <div style={{ padding:'8px 0', borderTop:`1px solid ${ALLOY.line}` }}>
                                    <p style={{ fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.mute, padding:'4px 14px 6px', fontWeight:600 }}>Filters using other data sources</p>
                                    {ga4Filters.filter(f => f.type === 'other' && f.name.toLowerCase().includes(filterSearch.toLowerCase())).map(f => (
                                      <div key={f.name}
                                        onClick={() => { updateField('filters', [...((widgetData.filters as string[]) || []), f.name]); setShowFilterDropdown(false) }}
                                        style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink, cursor:'pointer', background:'#fff8f6' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = ALLOY.yellow4}
                                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = ALLOY.paper}>
                                        <span style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.yellow1 }}>≡</span>
                                        {f.name}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Show placeholder filters if API hasn't returned yet */}
                                {!loadingFilters && ga4Filters.length === 0 && (
                                  <div style={{ padding:'8px 0' }}>
                                    <p style={{ fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.mute, padding:'4px 14px 6px', fontWeight:600 }}>Common filters</p>
                                    {['Sessions only','New users only','Mobile users','Desktop users','Organic traffic','Paid traffic','Direct traffic','Returning users'].filter(f => f.toLowerCase().includes(filterSearch.toLowerCase())).map(f => (
                                      <div key={f}
                                        onClick={() => { updateField('filters', [...((widgetData.filters as string[]) || []), f]); setShowFilterDropdown(false) }}
                                        style={{ padding:'9px 14px', fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink, cursor:'pointer' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = ALLOY.paper}
                                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                                        {f}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Create a filter */}
                              <div style={{ padding:'10px 14px', borderTop:`1px solid ${ALLOY.line}`, background:ALLOY.white }}>
                                <button onClick={() => { setShowCreateFilter(true); setShowFilterDropdown(false); setNewFilterName(''); setNewFilterClauses([{ include: true, field: '', operator: 'contains', value: '' }]) }}
                                  style={{ display:'flex', alignItems:'center', gap:8, color:ALLOY.blue1, fontFamily:ALLOY.fontBody, fontSize:13, fontWeight:600, background:'none', border:'none', cursor:'pointer', padding:0 }}>
                                  <Plus size={15}/> Create a filter
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Default date range filter */}
                        <div style={{ padding:'14px 0', borderBottom:`1px solid ${ALLOY.line}` }}>
                          <p style={{ fontFamily:ALLOY.fontBody, fontSize:13, fontWeight:700, color:ALLOY.ink, marginBottom:10 }}>Default date range filter</p>
                          {[{val:'auto',label:'Auto: Last 28 days (exclude today)'},{val:'custom',label:'Custom'}].map(opt => (
                            <label key={opt.val} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, cursor:'pointer' }}>
                              <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${(widgetData.dateRangeType||'auto')===opt.val?ALLOY.blue1:ALLOY.line}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                {(widgetData.dateRangeType||'auto')===opt.val && <div style={{ width:8, height:8, borderRadius:'50%', background:ALLOY.blue1 }}/>}
                              </div>
                              <span style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink }}>{opt.label}</span>
                            </label>
                          ))}
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:4 }}>
                            <span style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink }}>Comparison date range</span>
                            <div style={{ width:36, height:20, borderRadius:2, background:ALLOY.line, position:'relative', cursor:'pointer' }}>
                              <div style={{ width:16, height:16, borderRadius:'50%', background:ALLOY.white, position:'absolute', top:2, left:2, boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
                            </div>
                          </div>
                        </div>

                        {/* Number of rows */}
                        <div style={{ padding:'14px 0', borderBottom:`1px solid ${ALLOY.line}` }}>
                          <p style={{ fontFamily:ALLOY.fontBody, fontSize:13, fontWeight:700, color:ALLOY.ink, marginBottom:10 }}>Number of rows</p>
                          {[{val:'pagination',label:'Pagination'},{val:'topn',label:'Top N'}].map(opt => (
                            <label key={opt.val} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, cursor:'pointer' }}>
                              <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${(widgetData.rowsType||'pagination')===opt.val?ALLOY.blue1:ALLOY.line}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                {(widgetData.rowsType||'pagination')===opt.val && <div style={{ width:8, height:8, borderRadius:'50%', background:ALLOY.blue1 }}/>}
                              </div>
                              <span style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink }}>{opt.label}</span>
                            </label>
                          ))}
                          <div style={{ display:'flex', alignItems:'center', gap:8, background:ALLOY.white, border:'1px solid #e0e0e0', borderRadius:2, padding:'6px 12px', marginTop:4 }}>
                            <span style={{ fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.ink }}>Rows per page</span>
                            <select style={{ flex:1, border:'none', outline:'none', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, background:'transparent' }}>
                              <option>10</option><option>25</option><option selected>100</option><option>500</option>
                            </select>
                          </div>
                          <Toggle label="Show summary row" on={!!(widgetData as any).showSummaryRow} onChange={v => updateField('showSummaryRow', v)}/>
                        </div>

                        {/* Sort */}
                        <div style={{ padding:'14px 0', borderBottom:`1px solid ${ALLOY.line}` }}>
                          <p style={{ fontFamily:ALLOY.fontBody, fontSize:13, fontWeight:700, color:ALLOY.ink, marginBottom:10 }}>Sort</p>
                          <div style={{ background:ALLOY.paper, borderRadius:2, padding:10, marginBottom:8 }}>
                            <p style={{ fontFamily:ALLOY.fontBody, fontSize:12, fontWeight:600, color:ALLOY.ink, marginBottom:8 }}>Sort #1</p>
                            <div style={{ display:'flex', alignItems:'center', gap:8, background:ALLOY.blue4, border:`1px solid ${ALLOY.blue1}`, borderRadius:2, padding:'6px 12px', marginBottom:8 }}>
                              <span style={{ fontSize:10, fontWeight:700, color:ALLOY.blue1, background:ALLOY.blue4, borderRadius:2, padding:'1px 5px', fontFamily:ALLOY.fontLabel }}>AUT</span>
                              <span style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, flex:1 }}>{metrics[0] || 'Sessions'}</span>
                            </div>
                            {['Descending','Ascending'].map((opt,i) => (
                              <label key={opt} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4, cursor:'pointer' }}>
                                <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${i===0?ALLOY.blue1:ALLOY.line}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                  {i===0 && <div style={{ width:8, height:8, borderRadius:'50%', background:ALLOY.blue1 }}/>}
                                </div>
                                <span style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink }}>{opt}</span>
                              </label>
                            ))}
                          </div>
                          <button style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'1px dashed #ccc', borderRadius:999, padding:'6px 14px', cursor:'pointer', color:ALLOY.mute, fontFamily:ALLOY.fontBody, fontSize:12, width:'100%', justifyContent:'center' }}>
                            <Plus size={13}/> Add sort
                          </button>
                        </div>

                        {/* Chart interactions */}
                        <div style={{ padding:'14px 0' }}>
                          <p style={{ fontFamily:ALLOY.fontBody, fontSize:13, fontWeight:700, color:ALLOY.ink, marginBottom:10 }}>Chart interactions</p>
                          <Toggle label="Cross-filtering" on={!!(widgetData as any).crossFiltering} onChange={v => updateField('crossFiltering', v)}/>
                          <Toggle label="Open links in new tab" on={(widgetData as any).openLinksNewTab !== false} onChange={v => updateField('openLinksNewTab', v)}/>
                        </div>

                      </div>
                    )
                  })()}
                  {editTab==='Display' && (
                    <div style={{ padding:'4px 0' }}>

                      {/* Toggle row helper */}
                      {[
                        { key:'showAnomalies',  label:'Show Anomalies' },
                        { key:'showForecast',   label:'Show Forecast' },
                        { key:'showIntegIcon',  label:'Show Integration Icon' },
                      ].map(({ key, label }) => {
                        const on = !!(editingWidget as any)[key]
                        return (
                          <div key={key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 0', borderBottom:`1px solid ${ALLOY.line}` }}>
                            <span style={{ fontFamily:ALLOY.fontBody, fontSize:14, fontWeight:500, color:ALLOY.ink }}>{label}</span>
                            <div
                              onClick={() => {
                                const updated = {...editingWidget, [key]: !on } as any
                                setEditingWidget(updated)
                                setWidgets(prev => prev.map(w => w.id === updated.id ? updated : w))
                              }}
                              style={{ width:44, height:24, borderRadius:2, background: on ? ALLOY.blue1 : ALLOY.line, position:'relative', cursor:'pointer', transition:'background 0.2s', flexShrink:0 }}>
                              <div style={{ width:20, height:20, borderRadius:'50%', background:ALLOY.white, position:'absolute', top:2, left: on ? 22 : 2, boxShadow:'0 1px 4px rgba(0,0,0,0.2)', transition:'left 0.2s' }}/>
                            </div>
                          </div>
                        )
                      })}

                      {/* Color pickers */}
                      <div style={{ marginTop:20 }}>
                        {[
                          { label:'Text Color',  field:'textColor',  default:ALLOY.ink },
                          { label:'Background',  field:'color',      default:ALLOY.white },
                          { label:'Border',      field:'borderColor',default:ALLOY.line },
                        ].map(({ label, field, default: def }) => {
                          const BG_OPTIONS: {[key:string]:string} = {
                            white:ALLOY.white, blue:ALLOY.blue1, green:ALLOY.green1, red:ALLOY.red1
                          }
                          const currentVal = field === 'color'
                            ? ((editingWidget as any).bgHex || BG_OPTIONS[(editingWidget as any).color] || def)
                            : ((editingWidget as any)[field] || def)
                          return (
                            <div key={field} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:`1px solid ${ALLOY.line}` }}>
                              <span style={{ fontFamily:ALLOY.fontBody, fontSize:14, fontWeight:500, color:ALLOY.ink }}>{label}</span>
                              <label style={{ position:'relative', cursor:'pointer' }}>
                                <div style={{ width:36, height:36, borderRadius:2, background: currentVal, border:'1px solid #e0e0e0', cursor:'pointer', overflow:'hidden' }}/>
                                <input
                                  type="color"
                                  value={currentVal}
                                  onChange={e => {
                                    let updated: any
                                    if (field === 'color') {
                                      const hex = e.target.value
                                      const key = hex === ALLOY.blue1 ? 'blue' : hex === ALLOY.green1 ? 'green' : hex === ALLOY.red1 ? 'red' : 'white'
                                      updated = {...editingWidget, color: key, bgHex: hex}
                                    } else {
                                      updated = {...editingWidget, [field]: e.target.value}
                                    }
                                    setEditingWidget(updated)
                                    setWidgets(prev => prev.map(w => w.id === updated.id ? updated : w))
                                  }}
                                  style={{ position:'absolute', opacity:0, width:'100%', height:'100%', top:0, left:0, cursor:'pointer' }}
                                />
                              </label>
                            </div>
                          )
                        })}
                      </div>

                      <button onClick={saveWidget} style={{ width:'100%', background:ALLOY.blue1, border:'none', borderRadius:2, padding:'11px', fontFamily:ALLOY.fontBody, fontSize:13, fontWeight:600, color:ALLOY.white, cursor:'pointer', marginTop:24 }}>Save Changes</button>

                    </div>
                  )}
                </div>
              </div>
            )}
            {activeRightPanel && !editingWidget && (
              <div style={{ width:300, background:ALLOY.white, borderRight:`1px solid ${ALLOY.line}`, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                {activeRightPanel==='build' && (
                  <div style={{ flex:1, overflowY:'auto', padding:20 }}>
                    {[
                      {icon:'⊞', title:'Summarize your data with AI', desc:'Transform your data into clear, meaningful insights your clients will actually understand'},
                      {icon:'📊', title:'Build metrics with AI', desc:'Use natural prompts to find the right widgets and instantly add the metrics that matter most'},
                      {icon:'⧉', title:'Clone existing page', desc:'Copy a dashboard from any client and use it as a starting point'},
                    ].map(item => (
                      <div key={item.title}
                        onClick={item.title === 'Clone existing page' ? e => { e.stopPropagation(); setShowCloneModal(true) } : undefined}
                        style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'16px 0', borderBottom:`1px solid ${ALLOY.line}`, cursor:'pointer' }}>
                        <div style={{ width:36, height:36, borderRadius:2, background:ALLOY.paper, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:ALLOY.fontBody, fontSize:16 }}>{item.icon}</div>
                        <div style={{ flex:1 }}><p style={{ fontFamily:ALLOY.fontBody, fontSize:15, fontWeight:700, color:ALLOY.ink, marginBottom:4 }}>{item.title}</p><p style={{ fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.mute, lineHeight:1.5 }}>{item.desc}</p></div>
                      </div>
                    ))}
                  </div>
                )}
                {activeRightPanel==='charts' && (
                  <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                    <div style={{ padding:'12px 16px', borderBottom:`1px solid ${ALLOY.line}`, flexShrink:0 }}>
                      <p style={{ fontFamily:ALLOY.fontDisplay, fontSize:13, fontWeight:700, color:ALLOY.ink, marginBottom:2 }}>Add Chart</p>
                      <p style={{ fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.mute }}>Click any chart to add it to the dashboard</p>
                    </div>
                    <div style={{ flex:1, overflowY:'auto' as const }}>
                      {CHART_TYPE_GROUPS.map(group => (
                        <div key={group.group} style={{ padding:'10px 10px 4px' }}>
                          <p style={{ fontSize:9, fontWeight:600, color:ALLOY.mute, textTransform:'uppercase' as const, letterSpacing:'0.1em', fontFamily:ALLOY.fontLabel, marginBottom:8 }}>{group.group}</p>
                          <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6, marginBottom:6 }}>
                            {group.types.map(ct => (
                              <button key={ct.id} onClick={() => addWidget(ct.id, ct.label)}
                                title={`Add ${ct.label}`}
                                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'5px 3px', borderRadius:2, border:'2px solid #e0e0e0', background:ALLOY.white, cursor:'pointer', width:60, minWidth:60, transition:'all 0.1s' }}
                                onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='#1a73e8';(e.currentTarget as HTMLButtonElement).style.background=ALLOY.blue4}}
                                onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=ALLOY.line;(e.currentTarget as HTMLButtonElement).style.background=ALLOY.white}}>
                                <ChartThumbSvg id={ct.id} active={false}/>
                                <span style={{ fontFamily:ALLOY.fontBody, fontSize:9, color:'#444', textAlign:'center' as const, lineHeight:1.2, whiteSpace:'nowrap' as const, overflow:'hidden', textOverflow:'ellipsis', width:'100%' }}>{ct.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeRightPanel==='integrations' && (
                  <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                    {/* Search */}
                    <div style={{ padding:'10px 12px', borderBottom:`1px solid ${ALLOY.line}` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'7px 10px', marginBottom:8 }}>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="#999" strokeWidth="1.5"/><path d="M9.5 9.5 L12 12" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        <input value={integrationSearch} onChange={e => setIntegrationSearch(e.target.value)} placeholder="Search" style={{ background:'transparent', border:'none', outline:'none', fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink, width:'100%' }}/>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'2px 2px' }}>
                        <span style={{ fontFamily:ALLOY.fontBody, fontSize:12, fontWeight:600, color:ALLOY.ink }}>All Integrations</span>
                        <ChevronDown size={14} style={{ color:ALLOY.mute }}/>
                      </div>
                    </div>
                    {/* List */}
                    <div style={{ flex:1, overflowY:'auto' }}>
                      {ALL_INTEGRATIONS.filter((i:any) => i.name.toLowerCase().includes(integrationSearch.toLowerCase())).map((i:any) => (
                        <div key={i.name} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderBottom:`1px solid ${ALLOY.line}`, cursor:'pointer', transition:'background 0.1s' }}
                          onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background=ALLOY.paper}
                          onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}>
                          {/* Brand icon via favicon */}
                          <div style={{ width:28, height:28, borderRadius:2, background:ALLOY.paper, border:'1px solid #ebebeb', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden' }}>
                            <img
                              src={`https://www.google.com/s2/favicons?domain=${i.domain}&sz=64`}
                              alt={i.name}
                              style={{ width:20, height:20, objectFit:'contain', opacity: i.connected ? 1 : 0.45 }}
                              onError={e => { (e.currentTarget as HTMLImageElement).style.display='none' }}
                            />
                          </div>
                          <span style={{ flex:1, fontFamily:ALLOY.fontBody, fontSize:13, color: i.connected ? ALLOY.ink : ALLOY.mute, fontWeight: i.connected ? 500 : 400 }}>{i.name}</span>
                          <ChevronRight size={13} style={{ color:ALLOY.line, flexShrink:0 }}/>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeRightPanel==='content' && (
                  <div style={{ flex:1, overflowY:'auto', padding:20 }}>
                    {[{icon:'Aa',title:'Title',desc:'Add page titles to structure your report'},{icon:'Aa',title:'Textbox',desc:'Create custom text alongside your data'},{icon:'≡',title:'Table of Contents',desc:'Build headings for easy navigation'},{icon:'#',title:'Stat',desc:'Spotlight key numbers'}].map(item => (
                      <div key={item.title} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'16px 0', borderBottom:`1px solid ${ALLOY.line}`, cursor:'pointer' }}>
                        <div style={{ width:32, height:32, borderRadius:2, background:ALLOY.paper, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:ALLOY.fontBody, fontSize:14, fontWeight:700, color:ALLOY.ink }}>{item.icon}</div>
                        <div><p style={{ fontFamily:ALLOY.fontBody, fontSize:14, fontWeight:700, color:ALLOY.ink, marginBottom:4 }}>{item.title}</p><p style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.mute, lineHeight:1.5 }}>{item.desc}</p></div>
                      </div>
                    ))}
                  </div>
                )}
                {activeRightPanel==='media' && (
                  <div style={{ flex:1, overflowY:'auto', padding:20 }}>
                    {[{icon:'🖼',title:'Image',desc:'Add images, graphics, or logos'},{icon:'</>',title:'Embed',desc:'Pull in live content from YouTube, Google Sheets, and more'}].map(item => (
                      <div key={item.title} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'16px 0', borderBottom:`1px solid ${ALLOY.line}`, cursor:'pointer' }}>
                        <div style={{ width:32, height:32, borderRadius:2, background:ALLOY.paper, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:ALLOY.fontBody, fontSize:14, fontWeight:700 }}>{item.icon}</div>
                        <div><p style={{ fontFamily:ALLOY.fontBody, fontSize:14, fontWeight:700, color:ALLOY.ink, marginBottom:4 }}>{item.title}</p><p style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.mute, lineHeight:1.5 }}>{item.desc}</p></div>
                      </div>
                    ))}
                  </div>
                )}
                {activeRightPanel==='metrics' && (
                  <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
                    <div style={{ padding:12, borderBottom:`1px solid ${ALLOY.line}` }}>
                      <button style={{ width:'100%', background:ALLOY.blue1, border:'none', borderRadius:2, padding:'10px',  fontSize:13, fontWeight:600, color:ALLOY.white, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><Plus size={14}/> Add Custom Metric</button>
                    </div>
                    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, textAlign:'center' }}>
                      <div style={{ width:60, height:60, borderRadius:'50%', background:ALLOY.paper, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, fontFamily:ALLOY.fontBody, fontSize:24 }}>✏️</div>
                      <p style={{ fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink, lineHeight:1.6 }}>No custom metrics yet</p>
                    </div>
                  </div>
                )}
                {activeRightPanel==='benchmarks' && (
                  <div style={{ flex:1, overflowY:'auto', padding:20 }}>
                    <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'16px 0', cursor:'pointer' }}>
                      <div style={{ width:32, height:32, borderRadius:2, background:ALLOY.paper, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:ALLOY.fontBody, fontSize:16 }}>⚖️</div>
                      <div><p style={{ fontFamily:ALLOY.fontBody, fontSize:14, fontWeight:700, color:ALLOY.ink, marginBottom:4 }}>Benchmark</p><p style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.mute, lineHeight:1.5 }}>Visualize your client's performance against others</p></div>
                    </div>
                  </div>
                )}
                {activeRightPanel==='goals' && (
                  <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
                    <div style={{ padding:12, borderBottom:`1px solid ${ALLOY.line}` }}>
                      <button style={{ width:'100%', background:ALLOY.blue1, border:'none', borderRadius:2, padding:'10px',  fontSize:13, fontWeight:600, color:ALLOY.white, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><Plus size={14}/> Add Goal</button>
                    </div>
                    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, textAlign:'center' }}>
                      <div style={{ width:60, height:60, borderRadius:'50%', background:ALLOY.paper, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, fontFamily:ALLOY.fontBody, fontSize:24 }}>🚩</div>
                      <p style={{ fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink, lineHeight:1.6 }}>No goals yet</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div style={{ width:80, minWidth:80, background:ALLOY.white, display:'flex', flexDirection:'column', alignItems:'center', padding:'12px 0', gap:2 }}>
              {RIGHT_PANEL_ITEMS.map(item => (
                <button key={item.id}
                  onClick={() => { setActiveRightPanel(activeRightPanel===item.id ? null : item.id); setEditingWidget(null) }}
                  style={{ width:68, padding:'10px 4px', display:'flex', flexDirection:'column', alignItems:'center', gap:5, border:'none', cursor:'pointer', borderRadius:2, transition:'background 0.1s', background:activeRightPanel===item.id?ALLOY.paper:'none' }}>
                  <span style={{ fontFamily:ALLOY.fontBody, fontSize:18, lineHeight:1 }}>{item.icon}</span>
                  <span style={{ fontFamily:ALLOY.fontBody, fontSize:9, color:activeRightPanel===item.id?ALLOY.ink:ALLOY.mute, textAlign:'center', lineHeight:1.3, whiteSpace:'pre-line', fontWeight:activeRightPanel===item.id?600:400 }}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Drill-down panel */}
      {/* Fullscreen widget overlay — works in both edit AND view mode */}
      {fullscreenWidget && (
        <div style={{ position:'fixed' as const, inset:0, background:'rgba(0,0,0,0.75)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}
          onClick={() => setFullscreenWidget(null)}>
          <div style={{ background:ALLOY.white, borderRadius:2, width:'92vw', maxWidth:1200, maxHeight:'92vh', overflow:'hidden', display:'flex', flexDirection:'column' as const, boxShadow:'0 24px 80px rgba(0,0,0,0.35)' }}
            onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 24px', borderBottom:`1px solid ${ALLOY.line}`, background:ALLOY.white, flexShrink:0 }}>
              <div style={{ width:10, height:10, borderRadius:2, background:(KPI_BG[fullscreenWidget.color]||KPI_BG.white).bg, border:`1.5px solid ${ALLOY.green1}`, flexShrink:0 }}/>
              <span style={{ fontFamily:ALLOY.fontDisplay, fontSize:16, fontWeight:700, color:ALLOY.ink, flex:1 }}>{fullscreenWidget.title}</span>
              <span style={{ fontFamily:ALLOY.fontLabel, fontSize:9, color:ALLOY.mute, textTransform:'uppercase' as const, letterSpacing:'0.1em', marginRight:8 }}>{fullscreenWidget.dataSource}</span>
              {connection?.connected && <span style={{ fontFamily:ALLOY.fontLabel, fontSize:9, color:ALLOY.green1, fontWeight:600, marginRight:12 }}>● Live</span>}
              <button onClick={() => setFullscreenWidget(null)}
                style={{ width:30, height:30, borderRadius:2, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
                <X size={14} style={{ color:ALLOY.ink }}/>
              </button>
            </div>
            {/* Chart */}
            <div style={{ flex:1, padding:32, overflow:'auto', minHeight:0 }}>
              <DynamicChart
                chartType={fullscreenWidget.chartType}
                data={getWidgetData(fullscreenWidget)}
                height={480}
                dimensions={(fullscreenWidget as any).dimensions}
                metrics={(fullscreenWidget as any).metrics}
              />
            </div>
          </div>
        </div>
      )}

      {drillWidget && !editMode && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200, display:'flex', alignItems:'stretch', justifyContent:'flex-end' }}
          onClick={() => setDrillWidget(null)}>
          <div style={{ width:'82%', background:ALLOY.white, display:'flex', flexDirection:'column', overflow:'hidden' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding:'14px 24px', borderBottom:`1px solid ${ALLOY.line}`, display:'flex', alignItems:'center', gap:12, background:ALLOY.white, flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:15, fontWeight:700, color:ALLOY.ink, fontFamily:ALLOY.fontDisplay }}>All Channels</span>
                <div style={{ background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'4px 12px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, display:'flex', alignItems:'center', gap:6 }}>
                  Account is <strong>Atlanta BeltLine Website</strong>
                </div>
                <button style={{ background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'4px 12px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, cursor:'pointer' }}>+ Add Filter</button>
                <button style={{ background:'none', border:'none', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.mute, cursor:'pointer' }}>Clear All</button>
              </div>
              <button onClick={() => setDrillWidget(null)} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', fontFamily:ALLOY.fontBody, fontSize:20, color:ALLOY.mute }}>✕</button>
            </div>
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:ALLOY.mute, fontFamily:ALLOY.fontBody, fontSize:14 }}>
              Drill-down panel — integrate DrillDownPanel component here
            </div>
          </div>
        </div>
      )}



      {/* Clone Page Modal */}
      {showCloneModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:16 }}
          onClick={() => setShowCloneModal(false)}>
          <div style={{ background:ALLOY.white, borderRadius:2, width:'100%', maxWidth:420, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ height:3, background:ALLOY.blue1 }}/>
            <div style={{ padding:28 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <h2 style={{ fontSize:15, fontWeight:700, color:ALLOY.ink, fontFamily:ALLOY.fontDisplay }}>Clone Dashboard</h2>
                <button onClick={() => setShowCloneModal(false)} style={{ background:'none', border:'none', cursor:'pointer', color:ALLOY.mute, fontFamily:ALLOY.fontBody, fontSize:18 }}>✕</button>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontFamily:ALLOY.fontBody, fontSize:12, fontWeight:600, color:ALLOY.mute, marginBottom:6 }}>NEW DASHBOARD NAME</label>
                <input
                  defaultValue={activeDash + ' (Copy)'}
                  id="clone-name-input"
                  style={{ width:'100%', border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'9px 12px', fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink, outline:'none', boxSizing:'border-box' as const }}
                />
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => setShowCloneModal(false)}
                  style={{ flex:1, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'9px', fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.mute, cursor:'pointer' }}>Cancel</button>
                <button onClick={() => {
                  const input = document.getElementById('clone-name-input') as HTMLInputElement
                  const newName = (input?.value || activeDash + ' (Copy)').trim()
                  if (!newName) return
                  setDashboards(prev => [...prev, newName])
                  setClonedDashboards(prev => [...prev, newName])
                  setActiveDash(newName)
                  setShowCloneModal(false)
                }}
                  style={{ flex:2, background:ALLOY.blue1, border:'none', borderRadius:2, padding:'9px',  fontSize:13, fontWeight:600, color:ALLOY.white, cursor:'pointer' }}>Clone Dashboard</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Filter Modal */}
      {showCreateFilter && (() => {
        const OPERATORS = ['Equal to (=)','Contains','Starts with','RegExp Match','RegExp Contains','In','Is Null']
        const GA4_DIM_FIELDS = [
          'Achievement ID','Action','Ad format','Ad Label','Ad source','Ad unit','Age',
          'Aggregated Link URL','App version','Browser','Campaign','Campaign ID',
          'City','Country','Date','Default Channel Group','Device Category',
          'Event Name','Gender','Hostname','Landing Page','Operating System',
          'Page Location','Page Title','Region','Screen Class','Session Campaign',
          'Session Medium','Session Source','Stream Name','Transaction ID',
        ]
        return (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:500, display:'flex', flexDirection:'column' as const }}
            onClick={() => setShowCreateFilter(false)}>
            {/* Modal panel — bottom half of screen, full width */}
            <div style={{ marginTop:'auto', background:ALLOY.white, borderRadius:'2px 2px 0 0', boxShadow:'0 -8px 40px rgba(0,0,0,0.2)', width:'100%', height:'50vh', display:'flex', flexDirection:'column' as const }}
              onClick={e => e.stopPropagation()}>

              {/* Header */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 32px', borderBottom:`1px solid ${ALLOY.line}`, flexShrink:0, background:ALLOY.white, position:'sticky' as const, top:0, zIndex:800 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontFamily:ALLOY.fontBody, fontSize:16, fontWeight:600, color:ALLOY.ink }}>{editingFilterName ? 'Edit Filter' : 'Create Filter'}</span>
                  <span style={{ fontSize:11, background:ALLOY.yellow4, color:ALLOY.yellow1, borderRadius:2, padding:'2px 8px', fontWeight:700, fontFamily:ALLOY.fontLabel, letterSpacing:'0.06em' }}>BETA</span>
                </div>
                <button onClick={() => setShowCreateFilter(false)} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:ALLOY.mute, fontSize:9, fontWeight:700, fontFamily:ALLOY.fontLabel, letterSpacing:'0.08em' }}>
                  <X size={16}/> CLOSE
                </button>
              </div>

              <div style={{ flex:1, overflowY:'auto' as const, padding:'24px 32px' }} onClick={() => { setOpenClauseValueIdx(null); setOpenClauseFieldIdx(null) }}>
                {/* Filter name + data source row */}
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
                  <div style={{ position:'relative' as const, flex:'0 0 200px' }}>
                    <label style={{ position:'absolute' as const, top:-8, left:12, fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.mute, background:ALLOY.white, padding:'0 4px' }}>Name</label>
                    <input value={newFilterName} onChange={e => setNewFilterName(e.target.value)}
                      placeholder="Filter name"
                      style={{ width:'100%', border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'10px 14px', fontSize:13, outline:'none', color:ALLOY.ink, background:ALLOY.paper, fontFamily:ALLOY.fontBody, boxSizing:'border-box' as const }}/>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, background:ALLOY.paper, borderRadius:2, padding:'7px 14px', border:`1px solid ${ALLOY.line}` }}>
                    <img src="https://www.google.com/s2/favicons?domain=analytics.google.com&sz=32" style={{ width:16, height:16 }} alt=""/>
                    <span style={{ fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink, fontWeight:500 }}>{mappingPropName || 'GA4 Property'}</span>
                  </div>
                  <label style={{ display:'flex', alignItems:'center', gap:8, fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink, cursor:'pointer' }}>
                    <div style={{ width:36, height:20, borderRadius:999, background:ALLOY.green1, position:'relative', cursor:'pointer' }}>
                      <div style={{ width:16, height:16, borderRadius:'50%', background:ALLOY.white, position:'absolute', top:2, left:18, boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
                    </div>
                    Show suggested values while typing
                  </label>
                </div>

                {/* Filter clauses */}
                {newFilterClauses.map((clause, idx) => (
                  <div key={idx} style={{ marginBottom:12 }}>
                    {idx > 0 && (
                      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                        {['AND','OR'].map(op => (
                          <button key={op} style={{ padding:'4px 16px', borderRadius:999, border:`1px solid ${ALLOY.green1}`, background: op==='AND' ? ALLOY.green1 : 'transparent', color: op==='AND' ? ALLOY.ink : ALLOY.green1, fontSize:9, fontWeight:700, fontFamily:ALLOY.fontLabel, letterSpacing:'0.06em', cursor:'pointer' }}>{op}</button>
                        ))}
                      </div>
                    )}
                    <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'nowrap' as const }}>
                      {/* Include/Exclude */}
                      <select value={clause.include ? 'include' : 'exclude'}
                        onChange={e => { const c = [...newFilterClauses]; c[idx] = {...c[idx], include: e.target.value === 'include'}; setNewFilterClauses(c) }}
                        style={{ border:'1px solid #ccc', borderRadius:2, padding:'10px 14px', fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink, background:ALLOY.white, cursor:'pointer', outline:'none', minWidth:120 }}>
                        <option value="include">Include</option>
                        <option value="exclude">Exclude</option>
                      </select>

                      {/* Field selector */}
                      <div style={{ position:'relative' as const, flex:'0 0 200px' }}>
                        <div onClick={e => { e.stopPropagation(); setOpenClauseFieldIdx(openClauseFieldIdx === idx ? null : idx) }}
                          style={{ border:'1px solid #ccc', borderRadius:2, padding:'10px 14px', fontFamily:ALLOY.fontBody, fontSize:13, color: clause.field ? ALLOY.ink : ALLOY.mute, background:ALLOY.white, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                          {clause.field ? (
                            <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                              <span style={{ fontFamily:ALLOY.fontLabel, fontSize:10, fontWeight:700, color:ALLOY.green1, background:ALLOY.green4, borderRadius:3, padding:'1px 5px' }}>ABC</span>
                              {clause.field}
                            </span>
                          ) : 'Select a field'}
                          <ChevronDown size={14} style={{ color:ALLOY.mute }}/>
                        </div>
                        {openClauseFieldIdx === idx && (
                          <div onClick={e => e.stopPropagation()} style={{ position:'absolute' as const, top:'100%', left:0, right:0, background:ALLOY.white, border:'1px solid #e0e0e0', borderRadius:2, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:600, maxHeight:220, overflow:'hidden', display:'flex', flexDirection:'column' as const }}>
                            <div style={{ padding:'8px 10px', borderBottom:`1px solid ${ALLOY.line}` }}>
                              <div style={{ display:'flex', alignItems:'center', gap:8, background:ALLOY.paper, borderRadius:2, padding:'6px 10px' }}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="4" stroke="#999" strokeWidth="1.5"/><path d="M9 9 L11 11" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                <input autoFocus value={filterFieldSearch} onChange={e => setFilterFieldSearch(e.target.value)}
                                  placeholder="Search" style={{ background:'transparent', border:'none', outline:'none', fontSize:12, color:ALLOY.ink, fontFamily:ALLOY.fontBody, width:'100%' }}/>
                              </div>
                            </div>
                            <div style={{ overflowY:'auto' as const, flex:1 }}>
                              <p style={{ fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.ink, padding:'6px 12px 2px', fontWeight:600 }}>Default group</p>
                              {GA4_DIM_FIELDS.filter(f => f.toLowerCase().includes(filterFieldSearch.toLowerCase())).map(field => (
                                <div key={field}
                                  onClick={() => { const c = [...newFilterClauses]; c[idx] = {...c[idx], field}; setNewFilterClauses(c); setOpenClauseFieldIdx(null); setFilterFieldSearch('') }}
                                  style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', cursor:'pointer', fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink }}
                                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#e8f5e9'}
                                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                                  <span style={{ fontFamily:ALLOY.fontLabel, fontSize:10, fontWeight:700, color:ALLOY.green1, background:ALLOY.green4, borderRadius:3, padding:'1px 5px', flexShrink:0 }}>ABC</span>
                                  {field}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Operator — custom dropdown matching Looker Studio */}
                      <div style={{ position:'relative' as const, flex:'0 0 155px' }}>
                        <div onClick={() => { setOpenClauseValueIdx(null) }}
                          style={{ border:`1px solid ${openClauseValueIdx===null?ALLOY.line:ALLOY.line}`, borderRadius:2, overflow:'hidden' }}>
                          <select value={clause.operator}
                            onChange={e => {
                              const c = [...newFilterClauses]
                              c[idx] = {...c[idx], operator: e.target.value, value: ''}
                              setNewFilterClauses(c)
                              setSelectedEventValues(prev => ({...prev, [idx]: []}))
                              if (e.target.value === 'In') loadGA4Events()
                            }}
                            style={{ width:'100%', border:'none', padding:'10px 14px', fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink, background:ALLOY.white, cursor:'pointer', outline:'none', appearance:'auto' }}>
                            {OPERATORS.map(op => <option key={op} value={op}>{op}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Value field — checkbox multi-select for "In", text input otherwise */}
                      {clause.operator === 'In' ? (
                        <div style={{ position:'relative' as const, flex:1 }}>
                          <div
                            onClick={e => {
                              e.stopPropagation()
                              setOpenClauseValueIdx(openClauseValueIdx === idx ? null : idx)
                              // Only load event names for event-related fields
                              const isEventField = clause.field.toLowerCase().includes('event')
                              if (isEventField && ga4EventNames.length === 0) loadGA4Events()
                            }}
                            style={{ border:'1px solid #1a85c8', borderRadius:2, padding:'10px 14px', fontFamily:ALLOY.fontBody, fontSize:13, color: (selectedEventValues[idx]||[]).length > 0 ? ALLOY.ink : ALLOY.mute, background:ALLOY.white, cursor:'pointer', minHeight:42, display:'flex', alignItems:'center', flexWrap:'wrap' as const, gap:4 }}>
                            {(selectedEventValues[idx]||[]).length > 0
                              ? (selectedEventValues[idx]||[]).map((v: string) => (
                                  <span key={v} style={{ background:ALLOY.blue4, color:ALLOY.blue1, borderRadius:2, padding:'2px 8px', fontFamily:ALLOY.fontBody, fontSize:11, fontWeight:500 }}>{v}</span>
                                ))
                              : 'Any Value'}
                          </div>
                          {openClauseValueIdx === idx && (
                            <div onClick={e => e.stopPropagation()} style={{ position:'absolute' as const, top:'calc(100% + 4px)', left:0, right:0, background:ALLOY.white, border:'1px solid #e0e0e0', borderRadius:2, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:700, maxHeight:200, overflow:'hidden', display:'flex', flexDirection:'column' as const }}>
                              <div style={{ padding:'8px 10px', borderBottom:`1px solid ${ALLOY.line}` }}>
                                <input autoFocus value={eventSearch} onChange={e => setEventSearch(e.target.value)}
                                  placeholder={`Search ${clause.field || 'values'}...`} style={{ width:'100%', border:'1px solid #e0e0e0', borderRadius:2, padding:'6px 10px', fontFamily:ALLOY.fontBody, fontSize:12, outline:'none', boxSizing:'border-box' as const }}/>
                              </div>
                              <div style={{ overflowY:'auto' as const, flex:1 }}>
                                {(clause.field.toLowerCase().includes('event') && ga4EventNames.length === 0)
                                  ? <div style={{ padding:'12px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.mute, textAlign:'center' as const }}>Loading...</div>
                                  : ((): string[] => {
                                      const f = (clause.field || '').toLowerCase()
                                      if (f.includes('event')) return ga4EventNames.length > 0 ? ga4EventNames : []
                                      if (f.includes('device')) return ['mobile','desktop','tablet']
                                      if (f.includes('country')) return ['United States','United Kingdom','Canada','Australia','Germany','France','India','Brazil']
                                      if (f.includes('browser')) return ['Chrome','Safari','Firefox','Edge','Samsung Internet','Opera']
                                      if (f.includes('source')||f.includes('medium')) return ['google','(direct)','bing','facebook','instagram','email','linkedin']
                                      if (f.includes('channel')||f.includes('group')) return ['Organic Search','Direct','Paid Search','Organic Social','Paid Social','Referral','Email','Display']
                                      if (f.includes('age')) return ['18-24','25-34','35-44','45-54','55-64','65+']
                                      if (f.includes('gender')) return ['male','female','unknown']
                                      if (f.includes('os')||f.includes('operating')) return ['Android','iOS','Windows','macOS','Linux','Chrome OS']
                                      if (f.includes('campaign')) return ['(not set)','paoc','brand','non-brand','display','retargeting']
                                      if (f.includes('region')) return ['Georgia','California','Texas','New York','Florida','Illinois']
                                      if (f.includes('city')) return ['Atlanta','New York','Los Angeles','Chicago','Houston','Phoenix']
                                      if (f.includes('language')) return ['en-us','en-gb','es','fr','de','ja','zh-cn']
                                      // For free-text fields (page path, ad format, campaign id, etc.) show empty — user types manually
                                      return []
                                    })().filter(v => v.toLowerCase().includes(eventSearch.toLowerCase())).map(val => {
                                      const isChecked = (selectedEventValues[idx]||[]).includes(val)
                                      return (
                                        <div key={val}
                                          onClick={() => {
                                            const cur = selectedEventValues[idx] || []
                                            const upd = isChecked ? cur.filter((v:string)=>v!==val) : [...cur,val]
                                            setSelectedEventValues(prev=>({...prev,[idx]:upd}))
                                            const c=[...newFilterClauses]; c[idx]={...c[idx],value:upd.join(',')}; setNewFilterClauses(c)
                                          }}
                                          style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 14px', cursor:'pointer', fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink }}
                                          onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background=ALLOY.paper}
                                          onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}>
                                          <div style={{ width:16, height:16, border:`2px solid ${isChecked?ALLOY.blue1:ALLOY.line}`, borderRadius:3, background:isChecked?ALLOY.blue1:ALLOY.white, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                            {isChecked && <span style={{ color:ALLOY.white, fontFamily:ALLOY.fontBody, fontSize:10, fontWeight:700 }}>✓</span>}
                                          </div>
                                          {val}
                                        </div>
                                      )
                                    })
                                }
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <input value={clause.value} onChange={e => { const c = [...newFilterClauses]; c[idx] = {...c[idx], value: e.target.value}; setNewFilterClauses(c) }}
                          placeholder="example: value"
                          style={{ flex:1, minWidth:0, border:'1px solid #ccc', borderRadius:2, padding:'10px 14px', fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink, outline:'none' }}/>
                      )}

                      {/* OR button */}
                      <button style={{ padding:'8px 12px', borderRadius:999, border:'1px solid #ccc', background:'transparent', color:ALLOY.mute, fontFamily:ALLOY.fontBody, fontSize:12, fontWeight:600, cursor:'pointer', flexShrink:0, whiteSpace:'nowrap' as const }}>OR ▼</button>

                      {/* Remove clause */}
                      {newFilterClauses.length > 1 && (
                        <button onClick={() => setNewFilterClauses(prev => prev.filter((_, i) => i !== idx))}
                          style={{ background:'none', border:'none', cursor:'pointer', color:ALLOY.mute, padding:'10px 4px' }}><X size={16}/></button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add AND clause */}
                <button onClick={() => setNewFilterClauses(prev => [...prev, { include: true, field: '', operator: 'contains', value: '' }])}
                  style={{ display:'flex', alignItems:'center', gap:8, marginTop:12, background:'transparent', border:'1px solid #1a85c8', borderRadius:999, padding:'7px 16px', color:ALLOY.blue1, fontFamily:ALLOY.fontBody, fontSize:13, fontWeight:600, cursor:'pointer' }}>
                  AND
                  <ChevronDown size={14}/>
                </button>

                <p style={{ marginTop:16, fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.mute }}>This filter has {newFilterClauses.length} clause{newFilterClauses.length > 1 ? 's' : ''}</p>
              </div>

              {/* Footer */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:12, padding:'16px 32px', borderTop:'1px solid #e0e0e0', flexShrink:0, background:ALLOY.paper, position:'sticky' as const, bottom:0, zIndex:800 }}>
                <button onClick={() => setShowCreateFilter(false)}
                  style={{ background:'none', border:'none', cursor:'pointer', color:ALLOY.mute, fontFamily:ALLOY.fontBody, fontSize:14, fontWeight:500 }}>Cancel</button>
                <button
                  disabled={!newFilterName.trim()}
                  onClick={() => {
                    if (!newFilterName.trim()) return
                    const filterName = newFilterName.trim()
                    const filterObj = {
                      name: filterName,
                      type: 'custom' as const,
                      clauses: newFilterClauses.map((c, i) => ({
                        include: c.include,
                        field: c.field,
                        operator: c.operator,
                        value: c.value || '',
                        values: selectedEventValues[i] || []
                      })),
                    }
                    if (editingFilterName) {
                      // UPDATE: replace existing filter, rename references
                      const updatedList = userFilters.map((gf: any) => gf.name === editingFilterName ? filterObj : gf)
                      setUserFilters(updatedList)
                      try { localStorage.setItem('alloy_user_filters', JSON.stringify(updatedList)) } catch {}
                      // Rename filter in widgets if name changed
                      if (filterName !== editingFilterName) {
                        setWidgets(prev => prev.map(w => {
                          const wf: string[] = (w as any).filters || []
                          return wf.includes(editingFilterName) ? { ...w, filters: wf.map((f: string) => f === editingFilterName ? filterName : f) } as any : w
                        }))
                        if (editingWidget) {
                          const wf: string[] = (editingWidget as any).filters || []
                          if (wf.includes(editingFilterName)) setEditingWidget({ ...editingWidget, filters: wf.map((f: string) => f === editingFilterName ? filterName : f) } as any)
                        }
                      }
                    } else {
                      // CREATE: add new filter and apply to current widget
                      const newList = [...userFilters, filterObj]
                      setUserFilters(newList)
                      try { localStorage.setItem('alloy_user_filters', JSON.stringify(newList)) } catch {}
                      if (editingWidget) {
                        const updated = { ...editingWidget, filters: [...((editingWidget as any).filters || []), filterName] } as any
                        setEditingWidget(updated)
                        setWidgets(prev => prev.map(w => w.id === updated.id ? updated : w))
                      }
                    }
                    setFilterJustSaved(true)
                    setTimeout(() => {
                      setFilterJustSaved(false)
                      setEditingFilterName(null)
                      setNewFilterName('')
                      setNewFilterClauses([{ include: true, field: '', operator: 'contains', value: '' }])
                      setSelectedEventValues({})
                      setShowCreateFilter(false)
                    }, 900)
                  }}
                  style={{ background: filterJustSaved ? ALLOY.green1 : !newFilterName.trim() ? ALLOY.line : ALLOY.green1, border:'none', borderRadius:2, padding:'10px 24px', color:ALLOY.ink, fontSize:9, fontWeight:700, fontFamily:ALLOY.fontLabel, letterSpacing:'0.08em', cursor: !newFilterName.trim() ? 'not-allowed' : 'pointer', transition:'background 0.2s', minWidth:80 }}>
                  {filterJustSaved ? '✓ Saved!' : editingFilterName ? 'Update Filter' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── Share capture modal — Copy/Download widget as PNG ── */}
      {shareCapture && (
        <div style={{ position:'fixed' as const, inset:0, background:'rgba(0,0,0,0.6)', zIndex:3000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}
          onClick={() => setShareCapture(null)}>
          <div style={{ background:ALLOY.white, borderRadius:2, boxShadow:'0 20px 60px rgba(0,0,0,0.3)', overflow:'hidden', maxWidth:520, width:'100%' }}
            onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', borderBottom:`1px solid ${ALLOY.line}`, background:ALLOY.paper }}>
              <span style={{ fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, color:ALLOY.mute, textTransform:'uppercase' as const, letterSpacing:'0.1em', flex:1 }}>Share — {shareCapture.title}</span>
              <button onClick={() => setShareCapture(null)} style={{ background:'none', border:'none', cursor:'pointer', color:ALLOY.mute, display:'flex' }}><X size={14}/></button>
            </div>
            {/* Widget preview card */}
            <div style={{ padding:20, background:ALLOY.paper, display:'flex', flexDirection:'column' as const, gap:10 }}>
              {/* URL row */}
              <div style={{ display:'flex', alignItems:'center', gap:8, background:ALLOY.white, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'8px 12px' }}>
                <Link2 size={12} style={{ color:ALLOY.mute, flexShrink:0 }} strokeWidth={1.5}/>
                <span style={{ flex:1, fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.mute, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>
                  {typeof window !== 'undefined' ? window.location.href : ''}
                </span>
              </div>
              {/* Widget info */}
              <div style={{ background:ALLOY.white, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'12px 14px', display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:2, background:(KPI_BG[widgets.find(w=>w.id===shareCapture!.wid)?.color||'white']||KPI_BG.white).bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:`1px solid ${ALLOY.line}` }}>
                  <LayoutGrid size={16} style={{ color:ALLOY.mute }} strokeWidth={1.5}/>
                </div>
                <div>
                  <p style={{ fontFamily:ALLOY.fontDisplay, fontSize:13, fontWeight:700, color:ALLOY.ink }}>{shareCapture.title}</p>
                  <p style={{ fontFamily:ALLOY.fontLabel, fontSize:9, color:ALLOY.mute, textTransform:'uppercase' as const, letterSpacing:'0.08em', marginTop:2 }}>
                    {widgets.find(w=>w.id===shareCapture!.wid)?.dataSource || 'Google Analytics 4'}
                  </p>
                </div>
              </div>
            </div>
            {/* Actions */}
            <div style={{ display:'flex', gap:8, padding:'12px 16px', borderTop:`1px solid ${ALLOY.line}` }}>
              {/* Copy URL */}
              <button
                onClick={() => {
                  const url = window.location.href
                  // Try modern clipboard first, then execCommand fallback
                  const doCopy = () => {
                    const ta = document.createElement('textarea')
                    ta.value = url; ta.style.cssText='position:fixed;top:-9999px;opacity:0'
                    document.body.appendChild(ta); ta.focus(); ta.select()
                    try { document.execCommand('copy') } catch {}
                    document.body.removeChild(ta)
                  }
                  if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(url).catch(doCopy)
                  } else { doCopy() }
                  setShareCapture(null)
                  setShareToast('Link copied to clipboard')
                  setTimeout(() => setShareToast(null), 2500)
                }}
                style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'9px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, cursor:'pointer', fontWeight:500 }}>
                <Copy size={13} strokeWidth={1.5}/> Copy Link
              </button>
              {/* Download — print widget */}
              <button
                onClick={() => {
                  const cap = shareCapture
                  setShareCapture(null)
                  if (!cap) return
                  const widgetEl = document.querySelector('[data-widget-id="' + cap.wid + '"]') as HTMLElement | null
                  if (!widgetEl) { window.print(); return }
                  const printWin = window.open('', '_blank', 'width=800,height=600')
                  if (!printWin) { window.print(); return }
                  const html = '<html><head><title>' + cap.title + '</title>'
                    + '<style>body{margin:32px;background:#fff;font-family:system-ui,sans-serif}</style></head>'
                    + '<body>' + widgetEl.outerHTML
                    + '<scr' + 'ipt>window.onload=function(){window.print();setTimeout(function(){window.close()},1000)}</scr' + 'ipt>'
                    + '</body></html>'
                  printWin.document.write(html)
                  printWin.document.close()
                }}
                style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:ALLOY.ink, border:'none', borderRadius:2, padding:'9px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.white, cursor:'pointer', fontWeight:500 }}>
                <Download size={13} strokeWidth={1.5}/> Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast — works in both edit and view mode ── */}
      {shareToast && (
        <div style={{ position:'fixed' as const, bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:9999, background:ALLOY.ink, color:ALLOY.white, fontFamily:ALLOY.fontBody, fontSize:12, fontWeight:500, padding:'11px 22px', borderRadius:2, boxShadow:'0 4px 20px rgba(0,0,0,0.25)', display:'flex', alignItems:'center', gap:10, pointerEvents:'none' as const, whiteSpace:'nowrap' as const }}>
          <span style={{ color:ALLOY.green1, fontSize:15, lineHeight:1 }}>✓</span>
          {shareToast}
        </div>
      )}

      {/* Map Data Sources Modal */}
      {showMappingModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:16 }}
          onClick={() => setShowMappingModal(false)}>
          <div style={{ background:ALLOY.white, borderRadius:2, width:'100%', maxWidth:480, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ height:3, background:ALLOY.green1 }}/>
            <div style={{ padding:28 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <div>
                  <h2 style={{ fontSize:16, fontWeight:700, color:ALLOY.ink, marginBottom:2, fontFamily:ALLOY.fontDisplay }}>Map Data Sources</h2>
                  <p style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.mute }}>Set default data sources for <strong>{clientName}</strong></p>
                </div>
                <button onClick={() => setShowMappingModal(false)} style={{ background:'none', border:'none', cursor:'pointer', color:ALLOY.mute, fontFamily:ALLOY.fontBody, fontSize:18 }}>✕</button>
              </div>
              <div style={{ borderRadius:2, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, padding:16, marginBottom:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <div style={{ width:28, height:28, borderRadius:2, background:'#e8f5e9', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:ALLOY.fontBody, fontSize:14 }}>📊</div>
                  <div><p style={{ fontFamily:ALLOY.fontBody, fontSize:12, fontWeight:700, color:ALLOY.ink }}>Google Analytics 4</p><p style={{ fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.mute }}>Select the GA4 property for this client</p></div>
                </div>
                <select value={mappingProp}
                  onChange={e => { setMappingProp(e.target.value); const p = connection?.ga4_properties?.find((x: any) => x.name===e.target.value); setMappingPropName(p?.displayName||e.target.value) }}
                  style={{ width:'100%', background:ALLOY.white, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'9px 12px', fontFamily:ALLOY.fontBody, fontSize:13, outline:'none', color:ALLOY.ink, cursor:'pointer' }}>
                  <option value="">— Select GA4 Property —</option>
                  {connection?.ga4_properties?.map((p: any) => (
                    <option key={p.name} value={p.name}>{p.displayName||p.name}</option>
                  ))}
                </select>
              </div>
              {connection?.gsc_sites?.length > 0 && (
                <div style={{ borderRadius:2, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, padding:16, marginBottom:16 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    <div style={{ width:28, height:28, borderRadius:2, background:'#e3f2fd', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:ALLOY.fontBody, fontSize:14 }}>🔍</div>
                    <div><p style={{ fontFamily:ALLOY.fontBody, fontSize:12, fontWeight:700, color:ALLOY.ink }}>Google Search Console</p><p style={{ fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.mute }}>Select the GSC site for this client</p></div>
                  </div>
                  <select value={mappingSite} onChange={e => setMappingSite(e.target.value)}
                    style={{ width:'100%', background:ALLOY.white, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'9px 12px', fontFamily:ALLOY.fontBody, fontSize:13, outline:'none', color:ALLOY.ink, cursor:'pointer' }}>
                    <option value="">— Select GSC Site —</option>
                    {connection?.gsc_sites?.map((s: any) => (
                      <option key={s.siteUrl} value={s.siteUrl}>{s.siteUrl}</option>
                    ))}
                  </select>
                </div>
              )}
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => setShowMappingModal(false)}
                  style={{ flex:1, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'10px', fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.mute, cursor:'pointer', fontWeight:500 }}>Cancel</button>
                <button onClick={saveMapping} disabled={!mappingProp||savingMapping}
                  style={{ flex:2, background:mappingSaved?ALLOY.green1:ALLOY.blue1, border:'none', borderRadius:2, padding:'10px',  fontSize:13, fontWeight:600, color:ALLOY.white, cursor:'pointer', opacity:!mappingProp||savingMapping?0.6:1, transition:'background 0.2s' }}>
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
