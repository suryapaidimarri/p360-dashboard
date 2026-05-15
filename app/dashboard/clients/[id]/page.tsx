'use client'
import React, { useState, useEffect } from 'react'
import ClonePageModal from '@/components/dashboard/ClonePageModal'
import { ChevronRight, Sparkles, Settings, Calendar, ChevronDown, Plus, MoreHorizontal, Maximize2, X, Grip, RotateCcw, RotateCw, Monitor, Smartphone, ChevronLeft, RefreshCw, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ScatterChart, Scatter as ScatterPlot, ZAxis } from 'recharts'

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
const STATIC_DONUT = [{name:'Organic Search',value:68639,color:'#2196f3'},{name:'Direct',value:30294,color:'#64b5f6'},{name:'Paid Social',value:8288,color:'#90caf9'},{name:'Organic Social',value:6570,color:'#bbdefb'}]
const STATIC_CITIES = [{city:'Atlanta',val:25348,pct:92},{city:'(not set)',val:7210,pct:26},{city:'Singapore',val:1689,pct:6},{city:'Marietta',val:1558,pct:6}]

const KPI_BG: {[key:string]:{bg:string;border:string;text:string;sub:string}} = {
  white:{bg:'#fff',border:'#e5e5e5',text:'#1a1a1a',sub:'#666'},
  blue:{bg:'#48b5ea',border:'#48b5ea',text:'#fff',sub:'rgba(255,255,255,0.85)'},
  green:{bg:'#4caf82',border:'#4caf82',text:'#fff',sub:'rgba(255,255,255,0.85)'},
  red:{bg:'#ef5350',border:'#ef5350',text:'#fff',sub:'rgba(255,255,255,0.85)'},
}

interface Widget { id:string; title:string; dataSource:string; chartType:string; tooltip:string; color:string; value:string; change:string; up:boolean; textColor?:string; borderColor?:string; bgHex?:string; showAnomalies?:boolean; showForecast?:boolean; showIntegIcon?:boolean; metrics?:string[]; dimensions?:string[]; filters?:string[] }

function formatNum(n: number) {
  if (n>=1000000) return (n/1000000).toFixed(1)+'M'
  if (n>=1000) return (n/1000).toFixed(1)+'K'
  return n.toString()
}

// ── DynamicChart: renders the right chart based on widget.chartType ────────────
function DynamicChart({ chartType, data, height = 80, dimensions = ['Date'], metrics = ['Sessions'] }: { chartType: string; data: any[]; height?: number; dimensions?: string[]; metrics?: string[] }) {
  const colors = ['#4285f4','#ea8600','#a142f4','#34a853','#ea4335','#24c1e0']
  const c = colors[0]
  if (!data || data.length === 0) return null

  if (chartType === 'line' || chartType === 'timeseries' || chartType === 'sparkline' || chartType === 'smoothline') {
    const metLabel = metrics[0] || 'Sessions'
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <XAxis dataKey="d" hide={chartType === 'sparkline'} axisLine={false} tickLine={false} tick={{ fontSize:9, fill:'#999' }}/>
          <Line type="monotone" dataKey="v" stroke={c} strokeWidth={2} dot={false} name={metLabel}/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:4 }} formatter={(v:number) => [v.toLocaleString(), metLabel]}/>
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
          <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:'#999' }}/>
          <Area type={chartType === 'steparea' ? 'step' : 'monotone'} dataKey="v" stroke={c} fill="url(#dcg)" strokeWidth={2} dot={false} name={metLabel}/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:4 }} formatter={(v:number) => [v.toLocaleString(), metLabel]}/>
        </AreaChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'column' || chartType === 'bar' || chartType === 'histogram' || chartType === 'stackedbar') {
    const metLabel = metrics[0] || 'Value'
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} barSize={18}>
          <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:'#999' }}/>
          <YAxis hide/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:4 }} formatter={(v:number) => [v.toLocaleString(), metLabel]}/>
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
          <Tooltip contentStyle={{ fontSize:10, borderRadius:4 }}/>
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
          <Tooltip contentStyle={{ fontSize:10, borderRadius:4 }}/>
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
            <tr style={{ background:'#f5f5f5' }}>
              <th style={{ padding:'5px 8px', textAlign:'left', fontWeight:600, color:'#555', borderBottom:'2px solid #e0e0e0' }}>{dimLabel}</th>
              {metrics.map((m, i) => <th key={i} style={{ padding:'5px 8px', textAlign:'right', fontWeight:600, color:'#555', borderBottom:'2px solid #e0e0e0' }}>{m}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, Math.floor(height/22) || 6).map((d:any, i:number) => (
              <tr key={i} style={{ borderBottom:'1px solid #f5f5f5', background: i%2===0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding:'4px 8px', color:'#444', fontWeight:500 }}>{d.d}</td>
                {metrics.map((_, mi) => <td key={mi} style={{ padding:'4px 8px', textAlign:'right', fontWeight:600, color:'#333' }}>{d.v?.toLocaleString()}</td>)}
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
          <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:'#999' }}/>
          <YAxis hide/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:4 }}/>
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
          <Tooltip contentStyle={{ fontSize:10, borderRadius:4 }}/>
        </LineChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'hbar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" barSize={12}>
          <XAxis type="number" hide/>
          <YAxis type="category" dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:'#999' }} width={30}/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:4 }}/>
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
          <YAxis type="category" dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:'#999' }} width={30}/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:4 }}/>
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
          <Tooltip contentStyle={{ fontSize:10, borderRadius:4 }} formatter={(v:number) => [v.toLocaleString(),'']}/>
          <ScatterPlot data={scatterData} fill={c}/>
        </ScatterChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'candlestick' || chartType === 'ohlc') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} barSize={6}>
          <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:'#999' }}/>
          <YAxis hide/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:4 }}/>
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
          <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize:9, fill:'#999' }}/>
          <YAxis hide/>
          <Tooltip contentStyle={{ fontSize:10, borderRadius:4 }}/>
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
            <span style={{ fontSize:9, color:'#666', whiteSpace:'nowrap' }}>{d.d}</span>
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
            <span style={{ fontSize:9, color:'#fff', fontWeight:600 }}>{d.d}</span>
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
            <span style={{ fontSize:9, color:'#666' }}>{d.d}</span>
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
            <div style={{ height:12, background:'#e0e0e0', borderRadius:2, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', left:0, top:2, height:8, width:`${(d.v/maxV)*80}%`, background:'#bdbdbd', borderRadius:2 }}/>
              <div style={{ position:'absolute', left:0, top:3, height:6, width:`${(d.v/maxV)*60}%`, background:c, borderRadius:2 }}/>
            </div>
          </div>
        ))}
      </div>
    )
  }
  if (chartType === 'map') {
    return (
      <div style={{ height, display:'flex', alignItems:'center', justifyContent:'center', background:'#e8f4fd', borderRadius:6, position:'relative', overflow:'hidden' }}>
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
            <tr style={{ background:'#e8eaf6' }}>
              <th style={{ padding:'4px 8px', textAlign:'left', fontWeight:600, color:'#555', borderBottom:'2px solid #c5cae9' }}>{dimLabel}</th>
              {metrics.map((m, i) => <th key={i} style={{ padding:'4px 8px', textAlign:'right', fontWeight:600, color:'#555', borderBottom:'2px solid #c5cae9' }}>{m}</th>)}
              <th style={{ padding:'4px 8px', textAlign:'right', fontWeight:600, color:'#888', borderBottom:'2px solid #c5cae9' }}>Avg/Day</th>
            </tr>
          </thead>
          <tbody>{data.slice(0,6).map((d:any,i:number) => (
            <tr key={i} style={{ borderBottom:'1px solid #f0f0f0', background: i%2===0?'#fff':'#fafafa' }}>
              <td style={{ padding:'4px 8px', color:'#444', fontWeight:500 }}>{d.d}</td>
              {metrics.map((_,mi) => <td key={mi} style={{ padding:'4px 8px', textAlign:'right', fontWeight:600, color:'#333' }}>{d.v?.toLocaleString()}</td>)}
              <td style={{ padding:'4px 8px', textAlign:'right', color:'#888' }}>{Math.round(d.v/30).toLocaleString()}</td>
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
        <Tooltip contentStyle={{ fontSize:10, borderRadius:4 }}/>
      </LineChart>
    </ResponsiveContainer>
  )
}

// ── Empty canvas shown for any dashboard not in REAL_DASHBOARDS ──────────────
function NewDashCanvas({ onClone }: { onClone: () => void }) {
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', background:'#f8f9fa' }}>
      <p style={{ fontSize:15, color:'#555', marginBottom:2 }}>Start building by dragging widgets</p>
      <p style={{ fontSize:13, color:'#bbb', marginBottom:20 }}>or</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, width:520 }}>

        {/* Add a page template */}
        <button style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'30px 24px', background:'#fff', border:'1px solid #e8e8e8', borderRadius:8, cursor:'pointer', textAlign:'center' as const }}>
          <div style={{ width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="4" width="12" height="12" rx="2" fill="#D0D0D0"/><rect x="20" y="4" width="12" height="12" rx="2" fill="#D0D0D0"/><rect x="4" y="20" width="12" height="7" rx="1.5" fill="#E8E8E8"/><rect x="20" y="20" width="12" height="7" rx="1.5" fill="#E8E8E8"/><circle cx="10" cy="30" r="2.5" fill="#48b5ea"/></svg>
          </div>
          <div>
            <p style={{ fontSize:14, fontWeight:500, color:'#1a1a1a', marginBottom:6 }}>Add a page template</p>
            <p style={{ fontSize:12, color:'#aaa', lineHeight:1.6 }}>Choose from a ready-made template or one of your saved pages</p>
          </div>
        </button>

        {/* Build a page using AI */}
        <button style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'30px 24px', background:'#fff', border:'1px solid #e8e8e8', borderRadius:8, cursor:'pointer', textAlign:'center' as const }}>
          <div style={{ width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="12" stroke="#D0D0D0" strokeWidth="2"/><circle cx="18" cy="10" r="3" fill="#D0D0D0"/><path d="M14 18 L17 21 L23 15" stroke="#48b5ea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M26 10 L28 14 L32 12" stroke="#D0D0D0" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <div>
            <p style={{ fontSize:14, fontWeight:500, color:'#1a1a1a', marginBottom:6 }}>Build a page using AI</p>
            <p style={{ fontSize:12, color:'#aaa', lineHeight:1.6 }}>Tell AI what you're trying to achieve, and watch it build your page</p>
          </div>
        </button>

        {/* Clone existing page */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClone(); }}
          style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'30px 24px', background:'#fff', border:'1px solid #e8e8e8', borderRadius:8, cursor:'pointer', textAlign:'center' as const }}>
          <div style={{ width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="5" y="8" width="18" height="22" rx="2" stroke="#D0D0D0" strokeWidth="2"/><rect x="13" y="6" width="18" height="22" rx="2" stroke="#D0D0D0" strokeWidth="2" fill="#FAFAFA"/><path d="M18 13 h8" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round"/><path d="M18 17 h6" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round"/><path d="M18 21 h7" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <div>
            <p style={{ fontSize:14, fontWeight:500, color:'#1a1a1a', marginBottom:6 }}>Clone existing page</p>
            <p style={{ fontSize:12, color:'#aaa', lineHeight:1.6 }}>Copy a page from another page</p>
          </div>
        </button>

        {/* Smart Dashboard */}
        <button style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'30px 24px', background:'#fff', border:'1px solid #e8e8e8', borderRadius:8, cursor:'pointer', textAlign:'center' as const }}>
          <div style={{ width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="9" width="28" height="18" rx="2" stroke="#D0D0D0" strokeWidth="2"/><path d="M4 15 h28" stroke="#D0D0D0" strokeWidth="1.5"/><rect x="8" y="19" width="7" height="5" rx="1" fill="#E0E0E0"/><rect x="20" y="19" width="7" height="5" rx="1" fill="#48b5ea" fillOpacity="0.35"/><rect x="14" y="27" width="8" height="2" rx="1" fill="#D0D0D0"/></svg>
          </div>
          <div>
            <p style={{ fontSize:14, fontWeight:500, color:'#1a1a1a', marginBottom:6 }}>Smart Dashboard</p>
            <p style={{ fontSize:12, color:'#aaa', lineHeight:1.6 }}>Generate a dashboard from your connected integrations</p>
          </div>
        </button>

      </div>
    </div>
  )
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
  const [newFilterName, setNewFilterName] = useState('')
  const [newFilterClauses, setNewFilterClauses] = useState([{ include: true, field: '', operator: 'contains', value: '' }])
  const [filterFieldSearch, setFilterFieldSearch] = useState('')
  const [openClauseFieldIdx, setOpenClauseFieldIdx] = useState<number|null>(null)
  const [filterSearch, setFilterSearch] = useState('')
  const [ga4Filters, setGa4Filters] = useState<{name:string; type:'ga4'|'other'}[]>([])
  const [loadingFilters, setLoadingFilters] = useState(false)
  const [showDimDropdown, setShowDimDropdown] = useState(false)
  const [showMetDropdown, setShowMetDropdown] = useState(false)
  const [dsSearch, setDsSearch] = useState('')
  const [dimSearch, setDimSearch] = useState('')
  const [metSearch, setMetSearch] = useState('')
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
  const sourceData = ga4Data?.sources?.rows?.map((r: any, i: number) => ({ name: r.dimensionValues[0].value, value: parseInt(r.metricValues[0].value), color: ['#2196f3','#64b5f6','#90caf9','#bbdefb','#e3f2fd'][i%5] })) || STATIC_DONUT
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
    const bgColor = w.bgHex || c.bg
    const borderCol = isSelected && editMode ? '#48b5ea' : (w.borderColor || c.border)
    const textCol = w.textColor || c.text

    // KPI types — show number scorecard layout
    const isKpiType = !w.chartType || w.chartType === 'scorecard' || w.chartType === 'sparkline'

    const editControls = (
      <>
        {editMode && <div style={{ position:'absolute', top:6, left:6, cursor:'grab', color:isWhite?'#d0d0d0':'rgba(255,255,255,0.35)', zIndex:5 }}><Grip size={13}/></div>}
        {editMode && (
          <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:6, right:6, zIndex:10, display:'flex', alignItems:'center', gap:4 }}>
            <button style={{ background:isWhite?'rgba(0,0,0,0.05)':'rgba(255,255,255,0.15)', border:'none', borderRadius:4, padding:'3px 5px', cursor:'pointer', display:'flex' }}>
              <Maximize2 size={10} style={{ color:isWhite?'#666':'rgba(255,255,255,0.7)' }}/>
            </button>
            <WidgetDot wid={w.id} onEdit={() => startEdit(w)}/>
          </div>
        )}
      </>
    )

    if (!isKpiType) {
      // ── Full chart mode: replaces entire card with chart ──
      const activeFilters: string[] = (w as any).filters || []
      return (
        <div onClick={e => { e.stopPropagation(); if (editMode) startEdit(w); else openDrill(w) }}
          style={{ background:'#fff', border:`2px solid ${borderCol}`, borderRadius:8, padding:12, position:'relative', minHeight:130, cursor: editMode ? 'pointer' : 'default', transition:'border-color 0.15s' }}>
          {editControls}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontSize:12, color:'#666', fontWeight:500 }}>{w.title}</span>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              {w.change && <span style={{ fontSize:10, fontWeight:700, padding:'2px 6px', borderRadius:4, color:w.up?'#22c55e':'#ef4444', background:w.up?'#f0fdf4':'#fef2f2' }}>{w.up?'▲':'▼'} {w.change}</span>}
              {connection?.connected && <span style={{ fontSize:9, color:'#20BB71', fontWeight:600 }}>● Live</span>}
            </div>
          </div>
          {activeFilters.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap' as const, gap:4, marginBottom:6 }}>
              {activeFilters.map((f: string, i: number) => (
                <span key={i} style={{ fontSize:9, background:'#fff3e0', color:'#e65100', border:'1px solid #ffe0b2', borderRadius:20, padding:'2px 8px', display:'flex', alignItems:'center', gap:4 }}>
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
      <div onClick={e => { e.stopPropagation(); if (editMode) startEdit(w); else openDrill(w) }}
        style={{ background:bgColor, border:`2px solid ${borderCol}`, borderRadius:8, padding:16, position:'relative', minHeight:110, cursor: editMode ? 'pointer' : 'default', transition:'border-color 0.15s' }}>
        {editControls}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
          <span style={{ fontSize:12, color:c.sub, fontWeight:500 }}>{w.title}</span>
          {w.change && <span style={{ fontSize:10, fontWeight:700, marginLeft:8, padding:'2px 6px', borderRadius:4, color:isWhite?(w.up?'#22c55e':'#ef4444'):'rgba(255,255,255,0.95)', background:isWhite?(w.up?'#f0fdf4':'#fef2f2'):'rgba(255,255,255,0.18)' }}>{w.up?'▲':'▼'} {w.change}</span>}
        </div>
        <p style={{ fontSize:30, fontWeight:700, color:textCol, letterSpacing:'-0.5px', lineHeight:1 }}>{displayValue}</p>
        {connection?.connected && <p style={{ fontSize:9, color:isWhite?'#22c55e':'rgba(255,255,255,0.7)', marginTop:4 }}>● Live</p>}
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
    const isSelected = editingWidget?.id === id
    return (
      <div onClick={e => { e.stopPropagation(); if (editMode) startEdit(w); else openDrill(w) }}
        style={{ background:'#fff', border:`2px solid ${isSelected && editMode ? '#48b5ea' : '#e5e5e5'}`, borderRadius:8, padding:16, position:'relative', cursor: editMode ? 'pointer' : 'default', transition:'border-color 0.15s' }}>
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
      onClick={() => { if (openMenu) setOpenMenu(null); if (dashMenu) setDashMenu(null) }}>

      {/* Edit mode bars */}
      {editMode && (
        <>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 16px', borderBottom:'1px solid #e5e5e5', background:'#fff', flexShrink:0 }}>
            <span style={{ fontSize:14, fontWeight:700, color:'#1a1a1a' }}>Dashboard</span>
            <div style={{ width:1, height:16, background:'#e5e5e5' }}/>
            {/* Client logo with multi-source fallback */}
            <div style={{ width:24, height:24, borderRadius:4, overflow:'hidden', background:'#f0f0f0', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
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
                <span style={{ fontSize:11, fontWeight:700, color:'#666' }}>{clientName?.[0]?.toUpperCase() || ''}</span>
              )}
            </div>
            <span style={{ fontSize:13, fontWeight:600, color:'#1a1a1a' }}>{clientName}</span>
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
        <div style={{ padding:'10px 20px', borderBottom:'1px solid #e5e5e5', background:'#fff', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            {/* Breadcrumb: Clients > Client Name > Active Dashboard */}
            <Link href="/dashboard/clients" style={{ fontSize:12, color:'#999', textDecoration:'none', fontWeight:500 }}>Clients</Link>
            <ChevronRight size={12} style={{ color:'#ccc' }}/>
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f8f9fa', border:'1px solid #e5e5e5', borderRadius:6, padding:'5px 10px' }}>
              {/* Logo */}
              <div style={{ width:20, height:20, borderRadius:3, overflow:'hidden', background:'#e8e8e8', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {clientDomain ? (
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${clientDomain}&sz=64`}
                    alt={clientName}
                    style={{ width:'100%', height:'100%', objectFit:'contain' }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display='none' }}
                  />
                ) : (
                  <span style={{ fontSize:10, fontWeight:700, color:'#999' }}>{clientName?.[0]?.toUpperCase() || ''}</span>
                )}
              </div>
              {/* Client name — always shows something */}
              <span style={{ fontSize:13, fontWeight:700, color:'#1a1a1a', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {clientName || '...'}
              </span>
              <ChevronDown size={12} style={{ color:'#999' }}/>
            </div>
            <ChevronRight size={12} style={{ color:'#ccc' }}/>
            {/* Active dashboard name */}
            <span style={{ fontSize:12, color:'#48b5ea', fontWeight:600 }}>{activeDash}</span>
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
                const untitledCount = dashboards.filter(d => d.startsWith('Untitled Dashboard')).length
                const newName = untitledCount === 0 ? 'Untitled Dashboard' : 'Untitled Dashboard ' + (untitledCount + 1)
                setDashboards(prev => [...prev, newName])
                setActiveDash(newName)
              }}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:6, background:'#48b5ea', border:'none', borderRadius:6, padding:'8px 12px', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>
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
                      style={{ flex:1, fontSize:13, border:'1px solid #48b5ea', borderRadius:4, padding:'4px 8px', outline:'none', color:'#1a1a1a' }}
                    />
                  </div>
                ) : (
                  // ── Normal dashboard row ──
                  <div
                    style={{ display:'flex', alignItems:'center', padding:'0 4px 0 0', background: activeDash===d ? '#f0f9ff' : 'transparent', borderLeft: activeDash===d ? '3px solid #48b5ea' : '3px solid transparent' }}
                    onMouseEnter={e => { if (activeDash!==d) (e.currentTarget as HTMLDivElement).style.background='#f8f9fa' }}
                    onMouseLeave={e => { if (activeDash!==d) (e.currentTarget as HTMLDivElement).style.background='transparent' }}
                  >
                    <button
                      onClick={() => setActiveDash(d)}
                      style={{ flex:1, textAlign:'left', padding:'9px 8px 9px 12px', fontSize:13, cursor:'pointer', background:'none', border:'none', fontWeight:activeDash===d?700:400, color:activeDash===d?'#1a1a1a':'#555', display:'flex', alignItems:'center', gap:6 }}>
                      {editMode && <Grip size={12} style={{ color:'#ccc', flexShrink:0 }}/>}
                      <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d}</span>
                    </button>
                    {/* ··· menu button — always visible on hover, always in edit mode */}
                    <button
                      onClick={e => { e.stopPropagation(); setDashMenu(dashMenu === d ? null : d) }}
                      style={{ flexShrink:0, width:24, height:24, display:'flex', alignItems:'center', justifyContent:'center', background:'none', border:'none', cursor:'pointer', borderRadius:4, opacity: dashMenu===d ? 1 : 0.4 }}
                      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity='1'}
                      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = dashMenu===d?'1':'0.4'}
                    >
                      <MoreHorizontal size={14} style={{ color:'#555' }}/>
                    </button>
                  </div>
                )}

                {/* ── Dropdown menu ── */}
                {dashMenu === d && (
                  <div
                    onClick={e => e.stopPropagation()}
                    style={{ position:'absolute', left:8, top:'calc(100% + 2px)', background:'#fff', border:'1px solid #e5e5e5', borderRadius:8, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', padding:4, minWidth:200, zIndex:500 }}>
                    {/* Edit */}
                    <button onClick={() => { setActiveDash(d); setEditMode(true); setDashMenu(null) }}
                      style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:'#1a1a1a', background:'none', border:'none', cursor:'pointer', borderRadius:4, textAlign:'left' as const }}>
                      ✏️ <span>Edit</span>
                    </button>
                    {/* Rename */}
                    <button onClick={() => { setRenamingDash(d); setRenameValue(d); setDashMenu(null) }}
                      style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:'#1a1a1a', background:'none', border:'none', cursor:'pointer', borderRadius:4, textAlign:'left' as const }}>
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
                      style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:'#1a1a1a', background:'none', border:'none', cursor:'pointer', borderRadius:4, textAlign:'left' as const }}>
                      ⧉ <span>Clone</span>
                    </button>
                    {/* Save as Template */}
                    <button onClick={() => setDashMenu(null)}
                      style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:'#1a1a1a', background:'none', border:'none', cursor:'pointer', borderRadius:4, textAlign:'left' as const }}>
                      💾 <span>Save as Template</span>
                    </button>
                    <div style={{ height:1, background:'#f0f0f0', margin:'2px 0' }}/>
                    {/* Delete */}
                    <button onClick={() => {
                        const remaining = dashboards.filter(x => x !== d)
                        setDashboards(remaining)
                        setClonedDashboards(prev => prev.filter(x => x !== d))
                        if (activeDash === d) setActiveDash(remaining[0] || '')
                        setDashMenu(null)
                      }}
                      style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 14px', fontSize:13, color:'#ef4444', background:'none', border:'none', cursor:'pointer', borderRadius:4 }}>
                      🗑️ <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
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

        {/* Canvas — click background to close edit panel */}
        <div
          style={{ flex:1, display:'flex', flexDirection:'column', overflowY: isEmptyDash ? 'hidden' : 'auto', background:'#f8f9fa' }}
          onClick={() => { if (editingWidget) setEditingWidget(null) }}
        >
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #e5e5e5', background:'#fff', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:16, height:16, border:'2px solid #333', borderRadius:2 }}/>
            <span style={{ fontSize:14, fontWeight:700, color:'#1a1a1a' }}>{activeDash}</span>
            {loadingData && <span style={{ fontSize:11, color:'#48b5ea', marginLeft:8 }}>↻ Loading...</span>}
            {connection?.connected && !loadingData && !isEmptyDash && <span style={{ fontSize:11, color:'#20BB71', marginLeft:8 }}>● Live GA4 data</span>}
          </div>

          {isEmptyDash ? (
            // ── Empty canvas fills remaining height ──
            <div style={{ flex:1, display:'flex' }}>
              <NewDashCanvas onClone={() => setShowCloneModal(true)} />
            </div>
          ) : (
            // ── Real dashboard content ──
            <div style={{ padding:16 }}>
              <div style={{ background:'#48b5ea', borderRadius:8, padding:'18px 24px', marginBottom:12 }}>
                <h2 style={{ fontSize:20, fontWeight:700, color:'#fff' }}>Website Performance</h2>
                {connection?.connected && <p style={{ fontSize:11, color:'rgba(255,255,255,0.8)', marginTop:4 }}>Real-time data from {connection.email}</p>}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:10 }}>
                {widgets.map(w => <KPICard key={w.id} w={w}/>)}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:10 }}>
                <ChartCard id="c1">
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:11, color:'#666', fontWeight:500 }}>{widgets.find(x=>x.id==='c1')?.title || 'Sessions Over Time'}</span>
                    {connection?.connected && <span style={{ fontSize:9, color:'#20BB71', fontWeight:600 }}>● Live</span>}
                  </div>
                  <DynamicChart chartType={widgets.find(x=>x.id==='c1')?.chartType || 'line'} data={getWidgetData(widgets.find(x=>x.id==='c1') || {})} height={80} dimensions={(widgets.find(x=>x.id==='c1') as any)?.dimensions} metrics={(widgets.find(x=>x.id==='c1') as any)?.metrics}/>
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
                  <div onClick={e => { e.stopPropagation(); if (editMode) startEdit(widgets[3]) }}
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
                    <span style={{ fontSize:11, fontWeight:600 }}>{widgets.find(x=>x.id==='d1')?.title || 'Users By Device'}</span>
                    {connection?.connected && <span style={{ fontSize:9, color:'#20BB71', fontWeight:600 }}>● Live</span>}
                  </div>
                  <DynamicChart chartType={widgets.find(x=>x.id==='d1')?.chartType || 'column'} data={getWidgetData(widgets.find(x=>x.id==='d1') || {})} height={110} dimensions={(widgets.find(x=>x.id==='d1') as any)?.dimensions} metrics={(widgets.find(x=>x.id==='d1') as any)?.metrics}/>
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
                  <span style={{ fontSize:12, fontWeight:600 }}>{widgets.find(x=>x.id==='v1')?.title || 'Website Views'}</span>
                  {connection?.connected && <span style={{ fontSize:9, color:'#20BB71', fontWeight:600 }}>● Live GA4</span>}
                </div>
                <DynamicChart chartType={widgets.find(x=>x.id==='v1')?.chartType || 'area'} data={getWidgetData(widgets.find(x=>x.id==='v1') || {})} height={130} dimensions={(widgets.find(x=>x.id==='v1') as any)?.dimensions} metrics={(widgets.find(x=>x.id==='v1') as any)?.metrics}/>
              </ChartCard>
            </div>
          )}

            {/* Dynamically added widgets */}
            {dynamicWidgets.length >= 1 && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginTop:10 }}>
                {dynamicWidgets.map(w => (
                  <div key={w.id}
                    onClick={e => { e.stopPropagation(); if (editMode) startEdit(w) }}
                    style={{ background:'#fff', border:`2px solid ${editingWidget?.id===w.id && editMode?'#48b5ea':'#e5e5e5'}`, borderRadius:8, padding:14, position:'relative', cursor: editMode ? 'pointer' : 'default', minHeight:140 }}>
                    {editMode && <div style={{ position:'absolute', top:6, left:6, cursor:'grab', color:'#d0d0d0' }}><Grip size={13}/></div>}
                    {editMode && (
                      <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:6, right:6, zIndex:10, display:'flex', gap:4 }}>
                        <WidgetDot wid={w.id} onEdit={() => startEdit(w)}/>
                      </div>
                    )}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                      <span style={{ fontSize:12, fontWeight:600, color:'#333' }}>{w.title}</span>
                      {connection?.connected && <span style={{ fontSize:9, color:'#20BB71', fontWeight:600 }}>● Live</span>}
                    </div>
                    <DynamicChart chartType={w.chartType} data={getWidgetData(w)} height={100} dimensions={(w as any).dimensions} metrics={(w as any).metrics}/>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Right panel */}
        {editMode && (
          <div style={{ display:'flex', height:'100%', borderLeft:'1px solid #e5e5e5' }}>
            {editingWidget && (
              <div
                onClick={e => e.stopPropagation()}
                style={{ width:300, minWidth:300, background:'#fff', borderRight:'1px solid #e5e5e5', display:'flex', flexDirection:'column', overflow:'hidden' }}>
                <div style={{ padding:'14px 16px', borderBottom:'1px solid #e5e5e5' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                    <button onClick={() => { setEditingWidget(null); setActiveRightPanel('integrations') }} style={{ width:28, height:28, borderRadius:'50%', background:'#f5f5f5', border:'1px solid #e5e5e5', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
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
                        <input value={editingWidget.title} onChange={e => {
                          const updated = {...editingWidget, title:e.target.value}
                          setEditingWidget(updated)
                          setWidgets(prev => prev.map(w => w.id === updated.id ? updated : w))
                        }}
                          style={{ width:'100%', background:'#fafafa', border:'1px solid #e5e5e5', borderRadius:6, padding:'8px 12px', fontSize:13, outline:'none', color:'#333', boxSizing:'border-box' as const }}/>
                      </div>
                      <div style={{ marginBottom:18 }}>
                        <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#1a1a1a', marginBottom:8 }}>Tooltip</label>
                        <textarea value={editingWidget.tooltip} onChange={e => {
                          const updated = {...editingWidget, tooltip:e.target.value}
                          setEditingWidget(updated)
                          setWidgets(prev => prev.map(w => w.id === updated.id ? updated : w))
                        }}
                          style={{ width:'100%', background:'#fafafa', border:'1px solid #e5e5e5', borderRadius:6, padding:'8px 12px', fontSize:13, outline:'none', color:'#333', resize:'vertical' as const, minHeight:80, fontFamily:'system-ui,sans-serif', boxSizing:'border-box' as const }}/>
                      </div>
                      <div style={{ marginBottom:12 }}>
                        <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#1a1a1a', marginBottom:10 }}>Chart Type</label>
                        <div style={{ maxHeight:380, overflowY:'auto', border:'1px solid #e5e5e5', borderRadius:8, background:'#fafafa' }}>
                          {CHART_TYPE_GROUPS.map(group => (
                            <div key={group.group} style={{ padding:'10px 10px 4px' }}>
                              <p style={{ fontSize:10, fontWeight:700, color:'#999', textTransform:'uppercase' as const, letterSpacing:'0.06em', marginBottom:8 }}>{group.group}</p>
                              <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6, marginBottom:6 }}>
                                {group.types.map(ct => {
                                  const active = editingWidget.chartType === ct.id
                                  const ac = active ? '#1a85c8' : '#888'
                                  const ChartThumb = () => {
                                    const s = { width:48, height:36 }
                                    const B='#4285f4', O='#ea8600', P='#a142f4', G='#34a853', R='#ea4335', T='#24c1e0'
                                    if (ct.id==='table')      return <svg {...s} viewBox="0 0 48 36" fill="none"><rect x="1" y="1" width="46" height="34" rx="2" fill="white" stroke="#e0e0e0"/><rect x="1" y="1" width="46" height="8" rx="2" fill="#e8f0fe"/><line x1="1" y1="9" x2="47" y2="9" stroke="#e0e0e0"/><line x1="1" y1="17" x2="47" y2="17" stroke="#e0e0e0"/><line x1="1" y1="25" x2="47" y2="25" stroke="#e0e0e0"/><line x1="16" y1="1" x2="16" y2="35" stroke="#e0e0e0"/><line x1="32" y1="1" x2="32" y2="35" stroke="#e0e0e0"/><rect x="2" y="10" width="13" height="6" fill={B} fillOpacity="0.15" rx="1"/><rect x="18" y="18" width="13" height="6" fill={B} fillOpacity="0.2" rx="1"/></svg>
                                    if (ct.id==='pivot')      return <svg {...s} viewBox="0 0 48 36" fill="none"><rect x="1" y="1" width="46" height="34" rx="2" fill="white" stroke="#e0e0e0"/><rect x="1" y="1" width="46" height="8" rx="2" fill="#e8eaf6"/><line x1="1" y1="9" x2="47" y2="9" stroke="#e0e0e0"/><line x1="1" y1="17" x2="47" y2="17" stroke="#e0e0e0"/><line x1="1" y1="25" x2="47" y2="25" stroke="#e0e0e0"/><line x1="16" y1="1" x2="16" y2="35" stroke="#e0e0e0"/><rect x="2" y="2" width="13" height="6" fill={P} fillOpacity="0.3" rx="1"/><rect x="2" y="10" width="13" height="6" fill={P} fillOpacity="0.2" rx="1"/><rect x="18" y="10" width="28" height="6" fill={B} fillOpacity="0.15" rx="1"/><rect x="18" y="18" width="28" height="6" fill={B} fillOpacity="0.1" rx="1"/></svg>
                                    if (ct.id==='scorecard'||ct.id==='scorecard2')  return <svg {...s} viewBox="0 0 48 36" fill="none"><rect x="1" y="1" width="46" height="34" rx="2" fill="white" stroke="#e0e0e0"/><rect x="6" y="8" width="18" height="4" rx="1" fill="#ccc"/><rect x="6" y="16" width="28" height="8" rx="1" fill="#202124" fillOpacity="0.7"/><rect x="6" y="26" width="14" height="4" rx="1" fill="#4285f4" fillOpacity="0.5"/></svg>
                                    if (ct.id==='timeseries') return <svg {...s} viewBox="0 0 48 36" fill="none"><polyline points="2,30 10,22 18,25 26,14 34,18 42,10" stroke={B} strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
                                    if (ct.id==='timeseries2')return <svg {...s} viewBox="0 0 48 36" fill="none"><polyline points="2,20 6,26 10,18 14,24 18,16 22,22 26,14 30,20 34,12 38,18 42,10 46,16" stroke={B} strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
                                    if (ct.id==='sparkline')  return <svg {...s} viewBox="0 0 48 36" fill="none"><polyline points="2,28 8,20 14,24 20,12 26,18 32,8 38,14 44,6" stroke={B} strokeWidth="2.5" strokeLinecap="round" fill="none"/></svg>
                                    if (ct.id==='column')     return <svg {...s} viewBox="0 0 48 36" fill="none"><rect x="3" y="20" width="8" height="14" rx="1" fill={B}/><rect x="14" y="14" width="8" height="20" rx="1" fill={O}/><rect x="25" y="8" width="8" height="26" rx="1" fill={B} fillOpacity="0.7"/><rect x="36" y="16" width="8" height="18" rx="1" fill={O} fillOpacity="0.7"/></svg>
                                    if (ct.id==='bar')        return <svg {...s} viewBox="0 0 48 36" fill="none"><rect x="3" y="20" width="8" height="14" rx="1" fill={B}/><rect x="14" y="14" width="8" height="20" rx="1" fill={O}/><rect x="25" y="6" width="8" height="28" rx="1" fill={P}/><rect x="36" y="12" width="8" height="22" rx="1" fill={G}/></svg>
                                    if (ct.id==='stackedbar') return <svg {...s} viewBox="0 0 48 36" fill="none"><rect x="3" y="22" width="8" height="12" rx="1" fill={B}/><rect x="3" y="14" width="8" height="8" rx="1" fill={O}/><rect x="14" y="18" width="8" height="16" rx="1" fill={B}/><rect x="14" y="10" width="8" height="8" rx="1" fill={O}/><rect x="25" y="20" width="8" height="14" rx="1" fill={B}/><rect x="25" y="8" width="8" height="12" rx="1" fill={O}/><rect x="36" y="16" width="8" height="18" rx="1" fill={B}/><rect x="36" y="6" width="8" height="10" rx="1" fill={O}/></svg>
                                    if (ct.id==='combo')      return <svg {...s} viewBox="0 0 48 36" fill="none"><rect x="3" y="20" width="8" height="14" rx="1" fill={B} fillOpacity="0.5"/><rect x="14" y="14" width="8" height="20" rx="1" fill={B} fillOpacity="0.5"/><rect x="25" y="18" width="8" height="16" rx="1" fill={B} fillOpacity="0.5"/><rect x="36" y="10" width="8" height="24" rx="1" fill={B} fillOpacity="0.5"/><polyline points="7,16 18,10 29,14 40,6" stroke={O} strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
                                    if (ct.id==='hbar')       return <svg {...s} viewBox="0 0 48 36" fill="none"><rect x="2" y="4" width="28" height="7" rx="1" fill={B}/><rect x="2" y="14" width="20" height="7" rx="1" fill={O}/><rect x="2" y="24" width="34" height="7" rx="1" fill={P}/></svg>
                                    if (ct.id==='hstacked')   return <svg {...s} viewBox="0 0 48 36" fill="none"><rect x="2" y="4" width="20" height="7" rx="1" fill={B}/><rect x="22" y="4" width="12" height="7" rx="1" fill={O}/><rect x="2" y="14" width="16" height="7" rx="1" fill={B}/><rect x="18" y="14" width="16" height="7" rx="1" fill={O}/><rect x="2" y="24" width="24" height="7" rx="1" fill={B}/><rect x="26" y="24" width="8" height="7" rx="1" fill={O}/></svg>
                                    if (ct.id==='line')       return <svg {...s} viewBox="0 0 48 36" fill="none"><polyline points="2,28 12,18 22,22 32,10 42,16" stroke={B} strokeWidth="2.5" strokeLinecap="round" fill="none"/><polyline points="2,32 12,24 22,28 32,18 42,22" stroke={O} strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
                                    if (ct.id==='multiline')  return <svg {...s} viewBox="0 0 48 36" fill="none"><polyline points="2,26 12,16 22,20 32,8 42,14" stroke={B} strokeWidth="2" strokeLinecap="round" fill="none"/><polyline points="2,30 12,22 22,26 32,16 42,20" stroke={O} strokeWidth="2" strokeLinecap="round" fill="none"/><polyline points="2,34 12,28 22,30 32,22 42,26" stroke={P} strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
                                    if (ct.id==='smoothline') return <svg {...s} viewBox="0 0 48 36" fill="none"><path d="M2 28 C10 20 16 24 24 14 S38 10 46 8" stroke={O} strokeWidth="2.5" fill="none" strokeLinecap="round"/><path d="M2 32 C10 26 16 28 24 20 S38 16 46 14" stroke={B} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
                                    if (ct.id==='waveline')   return <svg {...s} viewBox="0 0 48 36" fill="none"><path d="M2 20 C8 14 12 26 18 18 S28 10 34 16 S42 22 46 16" stroke={O} strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
                                    if (ct.id==='candlestick')return <svg {...s} viewBox="0 0 48 36" fill="none"><line x1="8" y1="4" x2="8" y2="32" stroke="#888" strokeWidth="1"/><rect x="5" y="10" width="6" height="14" rx="1" fill={G}/><line x1="20" y1="6" x2="20" y2="30" stroke="#888" strokeWidth="1"/><rect x="17" y="14" width="6" height="10" rx="1" fill={R}/><line x1="32" y1="8" x2="32" y2="28" stroke="#888" strokeWidth="1"/><rect x="29" y="12" width="6" height="10" rx="1" fill={G}/><line x1="44" y1="10" x2="44" y2="32" stroke="#888" strokeWidth="1"/><rect x="41" y="18" width="6" height="10" rx="1" fill={R}/></svg>
                                    if (ct.id==='ohlc')       return <svg {...s} viewBox="0 0 48 36" fill="none"><line x1="10" y1="6" x2="10" y2="30" stroke={G} strokeWidth="2"/><line x1="6" y1="14" x2="10" y2="14" stroke={G} strokeWidth="2"/><line x1="10" y1="22" x2="14" y2="22" stroke={G} strokeWidth="2"/><line x1="26" y1="8" x2="26" y2="28" stroke={R} strokeWidth="2"/><line x1="22" y1="16" x2="26" y2="16" stroke={R} strokeWidth="2"/><line x1="26" y1="20" x2="30" y2="20" stroke={R} strokeWidth="2"/><line x1="40" y1="10" x2="40" y2="30" stroke={G} strokeWidth="2"/><line x1="36" y1="18" x2="40" y2="18" stroke={G} strokeWidth="2"/><line x1="40" y1="24" x2="44" y2="24" stroke={G} strokeWidth="2"/></svg>
                                    if (ct.id==='area')       return <svg {...s} viewBox="0 0 48 36" fill="none"><path d="M2 34 L10 22 L18 26 L26 14 L34 18 L42 10 L46 12 L46 34 Z" fill={P} fillOpacity="0.25"/><polyline points="2,34 10,22 18,26 26,14 34,18 42,10 46,12" stroke={P} strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
                                    if (ct.id==='stackarea')  return <svg {...s} viewBox="0 0 48 36" fill="none"><path d="M2 34 L46 34 L46 20 L34 24 L22 18 L10 26 Z" fill={O} fillOpacity="0.4"/><path d="M2 34 L10 26 L22 18 L34 24 L46 20 L46 10 L34 14 L22 8 L10 16 L2 24 Z" fill={P} fillOpacity="0.35"/><polyline points="2,24 10,16 22,8 34,14 46,10" stroke={P} strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
                                    if (ct.id==='steparea')   return <svg {...s} viewBox="0 0 48 36" fill="none"><path d="M2 34 L2 26 L14 26 L14 18 L26 18 L26 12 L38 12 L38 20 L46 20 L46 34 Z" fill={P} fillOpacity="0.3"/><polyline points="2,26 14,26 14,18 26,18 26,12 38,12 38,20 46,20" stroke={P} strokeWidth="2" fill="none"/></svg>
                                    if (ct.id==='pie')        return <svg {...s} viewBox="0 0 48 36" fill="none"><path d="M24 18 L24 6 A12 12 0 0 1 36 18 Z" fill={B}/><path d="M24 18 L36 18 A12 12 0 0 1 18 29 Z" fill={R}/><path d="M24 18 L18 29 A12 12 0 0 1 24 6 Z" fill={G}/></svg>
                                    if (ct.id==='donut')      return <svg {...s} viewBox="0 0 48 36" fill="none"><circle cx="24" cy="18" r="12" stroke={B} strokeWidth="6" strokeDasharray="38 37" fill="none"/><circle cx="24" cy="18" r="12" stroke={R} strokeWidth="6" strokeDasharray="20 55" strokeDashoffset="-38" fill="none"/><circle cx="24" cy="18" r="12" stroke={G} strokeWidth="6" strokeDasharray="17 58" strokeDashoffset="-58" fill="none"/></svg>
                                    if (ct.id==='scatter')    return <svg {...s} viewBox="0 0 48 36" fill="none"><circle cx="10" cy="28" r="2" fill={B}/><circle cx="18" cy="16" r="2" fill={B}/><circle cx="28" cy="22" r="2" fill={B}/><circle cx="36" cy="10" r="2" fill={B}/><circle cx="14" cy="8" r="2" fill={B}/><circle cx="40" cy="26" r="2" fill={B}/><circle cx="24" cy="30" r="2" fill={B}/></svg>
                                    if (ct.id==='bubble')     return <svg {...s} viewBox="0 0 48 36" fill="none"><circle cx="12" cy="26" r="4" fill={B} fillOpacity="0.7"/><circle cx="24" cy="14" r="7" fill={B} fillOpacity="0.5"/><circle cx="38" cy="22" r="5" fill={O} fillOpacity="0.6"/><circle cx="20" cy="30" r="2.5" fill={G} fillOpacity="0.7"/></svg>
                                    if (ct.id==='treemap')    return <svg {...s} viewBox="0 0 48 36" fill="none"><rect x="1" y="1" width="28" height="20" rx="1" fill={B}/><rect x="31" y="1" width="16" height="9" rx="1" fill={O}/><rect x="31" y="12" width="16" height="9" rx="1" fill={P}/><rect x="1" y="23" width="13" height="12" rx="1" fill={G}/><rect x="16" y="23" width="31" height="12" rx="1" fill={R} fillOpacity="0.7"/></svg>
                                    if (ct.id==='funnel')     return <svg {...s} viewBox="0 0 48 36" fill="none"><rect x="4" y="2" width="40" height="8" rx="2" fill={B}/><rect x="8" y="12" width="32" height="7" rx="2" fill={O}/><rect x="14" y="21" width="20" height="7" rx="2" fill={P}/><rect x="18" y="30" width="12" height="5" rx="2" fill={G}/></svg>
                                    if (ct.id==='sankey')     return <svg {...s} viewBox="0 0 48 36" fill="none"><rect x="1" y="4" width="6" height="28" rx="1" fill={B}/><rect x="41" y="2" width="6" height="14" rx="1" fill={O}/><rect x="41" y="20" width="6" height="14" rx="1" fill={P}/><path d="M7 8 C20 8 28 6 41 6" stroke={B} strokeWidth="6" fill="none" opacity="0.4"/><path d="M7 24 C20 24 28 22 41 24" stroke={O} strokeWidth="5" fill="none" opacity="0.4"/></svg>
                                    if (ct.id==='gauge')      return <svg {...s} viewBox="0 0 48 36" fill="none"><path d="M6 30 A18 18 0 0 1 42 30" stroke="#e0e0e0" strokeWidth="5" fill="none" strokeLinecap="round"/><path d="M6 30 A18 18 0 0 1 30 13" stroke={B} strokeWidth="5" fill="none" strokeLinecap="round"/><line x1="24" y1="30" x2="32" y2="14" stroke="#333" strokeWidth="2" strokeLinecap="round"/><circle cx="24" cy="30" r="3" fill="#333"/></svg>
                                    if (ct.id==='waterfall')  return <svg {...s} viewBox="0 0 48 36" fill="none"><rect x="3" y="22" width="7" height="12" rx="1" fill={B}/><rect x="13" y="16" width="7" height="6" rx="1" fill={G}/><rect x="23" y="10" width="7" height="6" rx="1" fill={G}/><rect x="33" y="16" width="7" height="18" rx="1" fill={R}/><line x1="10" y1="22" x2="13" y2="22" stroke="#888" strokeWidth="1" strokeDasharray="2 1"/><line x1="20" y1="16" x2="23" y2="16" stroke="#888" strokeWidth="1" strokeDasharray="2 1"/></svg>
                                    if (ct.id==='timeline')   return <svg {...s} viewBox="0 0 48 36" fill="none"><rect x="4" y="5" width="24" height="7" rx="2" fill={B}/><rect x="14" y="15" width="28" height="7" rx="2" fill={O}/><rect x="2" y="25" width="18" height="7" rx="2" fill={P}/></svg>
                                    if (ct.id==='histogram')  return <svg {...s} viewBox="0 0 48 36" fill="none"><rect x="2" y="24" width="6" height="10" fill={B} fillOpacity="0.5"/><rect x="9" y="16" width="6" height="18" fill={B} fillOpacity="0.7"/><rect x="16" y="10" width="6" height="24" fill={B}/><rect x="23" y="14" width="6" height="20" fill={B} fillOpacity="0.8"/><rect x="30" y="20" width="6" height="14" fill={B} fillOpacity="0.6"/><rect x="37" y="26" width="6" height="8" fill={B} fillOpacity="0.4"/><path d="M5 24 C11 16 18 10 25 14 S36 20 43 26" stroke={T} strokeWidth="1.5" fill="none"/></svg>
                                    if (ct.id==='bullet')     return <svg {...s} viewBox="0 0 48 36" fill="none"><rect x="2" y="10" width="44" height="16" rx="1" fill="#e0e0e0"/><rect x="2" y="13" width="30" height="10" rx="1" fill="#bdbdbd"/><rect x="2" y="15" width="22" height="6" rx="1" fill={B}/><line x1="34" y1="7" x2="34" y2="29" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/></svg>
                                    if (ct.id==='map')        return <svg {...s} viewBox="0 0 48 36" fill="none"><ellipse cx="24" cy="18" rx="20" ry="15" stroke="#e0e0e0" strokeWidth="1" fill="#e8f4fd"/><path d="M4 18 Q12 14 24 18 Q36 22 44 18" stroke="#90caf9" strokeWidth="1" fill="none"/><path d="M4 18 Q12 22 24 24 Q36 26 44 22" stroke="#90caf9" strokeWidth="1" fill="none" opacity="0.5"/><line x1="24" y1="3" x2="24" y2="33" stroke="#90caf9" strokeWidth="1"/><circle cx="28" cy="14" r="3" fill={R} fillOpacity="0.8"/><circle cx="18" cy="22" r="2" fill={B} fillOpacity="0.8"/></svg>
                                    return <svg {...s} viewBox="0 0 48 36" fill="none"><rect x="4" y="4" width="40" height="28" rx="2" stroke="#e0e0e0" strokeWidth="1.5" fill="none"/></svg>
                                  }
                                  return (
                                    <button key={ct.id}
                                      onClick={() => {
                                        const updated = {...editingWidget, chartType:ct.id}
                                        setEditingWidget(updated)
                                        // Auto-apply immediately to canvas
                                        setWidgets(prev => prev.map(w => w.id === updated.id ? updated : w))
                                      }}
                                      title={ct.label}
                                      style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'4px', borderRadius:6, border:`2px solid ${active?'#48b5ea':'#e5e5e5'}`, background:active?'#ebf7ff':'#fff', cursor:'pointer', transition:'all 0.1s', width:62 }}>
                                      <ChartThumb/>
                                      <span style={{ fontSize:9, color:active?'#1a85c8':'#666', fontWeight:active?600:400, textAlign:'center' as const, lineHeight:1.2, whiteSpace:'nowrap' as const, overflow:'hidden', textOverflow:'ellipsis', width:'100%' }}>{ct.label}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
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
                      <div style={{ fontSize:13 }}>

                        {/* Data Source */}
                        <div style={{ padding:'14px 0', borderBottom:'1px solid #f0f0f0', position:'relative' as const }}>
                          <p style={{ fontSize:13, fontWeight:700, color:'#1a1a1a', marginBottom:10 }}>Data source</p>
                          <div onClick={() => setShowDsDropdown(!showDsDropdown)}
                            style={{ display:'flex', alignItems:'center', gap:8, background:'#f5f5f5', border:'1px solid #e0e0e0', borderRadius:20, padding:'7px 12px', cursor:'pointer' }}>
                            <img src="https://www.google.com/s2/favicons?domain=analytics.google.com&sz=32" style={{ width:16, height:16 }} alt=""/>
                            <span style={{ flex:1, fontSize:12, color:'#333', fontWeight:500 }}>{editingWidget.dataSource?.split('/').pop()?.trim() || 'Select source'}</span>
                            <ChevronDown size={14} style={{ color:'#666' }}/>
                            <button onClick={e=>{e.stopPropagation()}} style={{ background:'none', border:'none', cursor:'pointer', color:'#999', padding:'0 2px' }}><X size={12}/></button>
                          </div>
                          {showDsDropdown && (
                            <div style={{ position:'absolute' as const, top:'100%', left:0, right:0, background:'#fff', border:'1px solid #e0e0e0', borderRadius:8, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:200, overflow:'hidden' }}>
                              <div style={{ padding:'10px 12px', borderBottom:'1px solid #f0f0f0' }}>
                                <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f5f5f5', borderRadius:6, padding:'6px 10px', border:'1px solid #e0e0e0' }}>
                                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="#999" strokeWidth="1.5"/><path d="M9.5 9.5 L12 12" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                  <input autoFocus value={dsSearch} onChange={e=>setDsSearch(e.target.value)} placeholder="Search" style={{ background:'transparent', border:'none', outline:'none', fontSize:12, color:'#333', width:'100%' }}/>
                                </div>
                              </div>
                              <div style={{ padding:'8px 0' }}>
                                <p style={{ fontSize:11, color:'#888', padding:'4px 14px', fontWeight:500 }}>Added data sources</p>
                                {DATA_SOURCES.length === 0 && (
                                  <div style={{ padding:'12px 14px', fontSize:12, color:'#999', textAlign:'center' as const }}>
                                    No connected sources. Connect Google above.
                                  </div>
                                )}
                                {/* This client's sources */}
                                {DATA_SOURCES.filter((ds:any) => ds.isMapped && ds.label.toLowerCase().includes(dsSearch.toLowerCase())).length > 0 && (
                                  <p style={{ fontSize:11, color:'#888', padding:'8px 14px 4px', fontWeight:500 }}>
                                    {clientName} — connected sources
                                  </p>
                                )}
                                {DATA_SOURCES.filter((ds:any) => ds.isMapped && ds.label.toLowerCase().includes(dsSearch.toLowerCase())).map((ds:any) => (
                                  <div key={ds.id} onClick={() => { updateField('dataSource', ds.label); setShowDsDropdown(false) }}
                                    style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', cursor:'pointer', background: (widgetData.dataSource === ds.label) ? '#e8f0fe' : 'transparent' }}
                                    onMouseEnter={e=>{ if(widgetData.dataSource !== ds.label)(e.currentTarget as HTMLDivElement).style.background='#f0f7ff' }}
                                    onMouseLeave={e=>{ (e.currentTarget as HTMLDivElement).style.background = (widgetData.dataSource === ds.label) ? '#e8f0fe' : 'transparent' }}>
                                    <img src={`https://www.google.com/s2/favicons?domain=${ds.domain}&sz=32`} style={{ width:18, height:18 }} alt=""/>
                                    <span style={{ fontSize:13, color:'#1a1a1a', flex:1 }}>{ds.label}</span>
                                    {widgetData.dataSource === ds.label && <span style={{ fontSize:10, color:'#1a85c8', fontWeight:600 }}>✓</span>}
                                  </div>
                                ))}

                              </div>
                            </div>
                          )}
                          <button style={{ display:'flex', alignItems:'center', gap:6, marginTop:8, background:'none', border:'none', cursor:'pointer', color:'#1a85c8', fontSize:12, fontWeight:600, padding:0 }}>
                            <span style={{ fontSize:14 }}>⊕</span> Blend data
                          </button>
                        </div>

                        {/* Dimension */}
                        <div style={{ padding:'14px 0', borderBottom:'1px solid #f0f0f0', position:'relative' as const }}>
                          <p style={{ fontSize:13, fontWeight:700, color:'#1a1a1a', marginBottom:10 }}>Dimension</p>
                          <div style={{ display:'flex', flexDirection:'column' as const, gap:6 }}>
                            {dimensions.map((dim: string, i: number) => (
                              <div key={i} style={{ display:'flex', alignItems:'center', gap:8, background:'#e8f5e9', border:'1px solid #c8e6c9', borderRadius:20, padding:'5px 12px' }}>
                                <span style={{ fontSize:10, fontWeight:700, color:'#388e3c', background:'#c8e6c9', borderRadius:3, padding:'1px 4px' }}>ABC</span>
                                <span style={{ flex:1, fontSize:12, color:'#1a1a1a' }}>{dim}</span>
                                <button onClick={() => updateField('dimensions', dimensions.filter((_:string,j:number)=>j!==i))} style={{ background:'none', border:'none', cursor:'pointer', color:'#999', padding:0 }}><X size={11}/></button>
                              </div>
                            ))}
                            <button onClick={() => { setShowDimDropdown(!showDimDropdown); setDimSearch('') }}
                              style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'1px dashed #ccc', borderRadius:20, padding:'5px 12px', cursor:'pointer', color:'#1a85c8', fontSize:12, fontWeight:600 }}>
                              <Plus size={13}/> Add dimension
                            </button>
                          </div>
                          {showDimDropdown && (
                            <div style={{ position:'absolute' as const, top:'100%', left:0, right:0, background:'#fff', border:'1px solid #e0e0e0', borderRadius:8, boxShadow:'0 8px 24px rgba(0,0,0,0.14)', zIndex:200, overflow:'hidden', maxHeight:340 }}>
                              <div style={{ padding:'10px 12px', borderBottom:'1px solid #f0f0f0', position:'sticky' as const, top:0, background:'#fff' }}>
                                <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f5f5f5', borderRadius:20, padding:'7px 12px', border:'1px solid #e0e0e0' }}>
                                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="#999" strokeWidth="1.5"/><path d="M9.5 9.5 L12 12" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                  <input autoFocus value={dimSearch} onChange={e=>setDimSearch(e.target.value)} placeholder="Search" style={{ background:'transparent', border:'none', outline:'none', fontSize:12, color:'#333', width:'100%' }}/>
                                </div>
                              </div>
                              <div style={{ overflowY:'auto' as const, maxHeight:240 }}>
                                <p style={{ fontSize:11, color:'#555', padding:'8px 14px 4px', fontWeight:600 }}>Default group</p>
                                {ALL_GA4_DIMENSIONS.filter((d:string) => d.toLowerCase().includes(dimSearch.toLowerCase()) && !dimensions.includes(d)).map((dim:string) => (
                                  <div key={dim} onClick={() => { updateField('dimensions', [...dimensions, dim]); setShowDimDropdown(false); setDimSearch('') }}
                                    style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 14px', cursor:'pointer' }}
                                    onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#e8f5e9'}
                                    onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}>
                                    <span style={{ fontSize:10, fontWeight:700, color:'#388e3c', background:'#c8e6c9', borderRadius:3, padding:'1px 5px', flexShrink:0 }}>ABC</span>
                                    <span style={{ fontSize:13, color:'#1a1a1a' }}>{dim}</span>
                                  </div>
                                ))}
                              </div>
                              <div style={{ padding:'8px 14px', borderTop:'1px solid #f0f0f0' }}>
                                {[{icon:'⊕',label:'Add calculated field'},{icon:'⊕',label:'Add group'},{icon:'⊕',label:'Add bin'}].map(a => (
                                  <div key={a.label} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', color:'#1a85c8', cursor:'pointer', fontSize:13, fontWeight:500 }}>
                                    <span>{a.icon}</span>{a.label}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10 }}>
                            <span style={{ fontSize:12, color:'#555' }}>Drill down</span>
                            <div style={{ width:36, height:20, borderRadius:10, background:'#e0e0e0', position:'relative', cursor:'pointer' }}>
                              <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff', position:'absolute', top:2, left:2, boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
                            </div>
                          </div>
                        </div>

                        {/* Metric */}
                        <div style={{ padding:'14px 0', borderBottom:'1px solid #f0f0f0', position:'relative' as const }}>
                          <p style={{ fontSize:13, fontWeight:700, color:'#1a1a1a', marginBottom:10 }}>Metric</p>
                          <div style={{ display:'flex', flexDirection:'column' as const, gap:6 }}>
                            {metrics.map((met: string, i: number) => (
                              <div key={i} style={{ display:'flex', alignItems:'center', gap:8, background:'#e3f2fd', border:'1px solid #bbdefb', borderRadius:20, padding:'5px 12px' }}>
                                <span style={{ fontSize:10, fontWeight:700, color:'#1565c0', background:'#bbdefb', borderRadius:3, padding:'1px 4px' }}>123</span>
                                <span style={{ flex:1, fontSize:12, color:'#1a1a1a' }}>{met}</span>
                                <button onClick={() => updateField('metrics', metrics.filter((_:string,j:number)=>j!==i))} style={{ background:'none', border:'none', cursor:'pointer', color:'#999', padding:0 }}><X size={11}/></button>
                              </div>
                            ))}
                            <button onClick={() => { setShowMetDropdown(!showMetDropdown); setMetSearch('') }}
                              style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'1px dashed #ccc', borderRadius:20, padding:'5px 12px', cursor:'pointer', color:'#1a85c8', fontSize:12, fontWeight:600 }}>
                              <Plus size={13}/> Add metric
                            </button>
                          </div>
                          {showMetDropdown && (
                            <div style={{ position:'absolute' as const, top:'100%', left:0, right:0, background:'#fff', border:'1px solid #e0e0e0', borderRadius:8, boxShadow:'0 8px 24px rgba(0,0,0,0.14)', zIndex:200, overflow:'hidden', maxHeight:340 }}>
                              <div style={{ padding:'10px 12px', borderBottom:'1px solid #f0f0f0', position:'sticky' as const, top:0, background:'#fff' }}>
                                <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f5f5f5', borderRadius:20, padding:'7px 12px', border:'1px solid #e0e0e0' }}>
                                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="#999" strokeWidth="1.5"/><path d="M9.5 9.5 L12 12" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                  <input autoFocus value={metSearch} onChange={e=>setMetSearch(e.target.value)} placeholder="Search" style={{ background:'transparent', border:'none', outline:'none', fontSize:12, color:'#333', width:'100%' }}/>
                                </div>
                              </div>
                              <div style={{ overflowY:'auto' as const, maxHeight:240 }}>
                                <p style={{ fontSize:11, color:'#555', padding:'8px 14px 4px', fontWeight:600 }}>Default group</p>
                                {ALL_GA4_METRICS.filter((m:string) => m.toLowerCase().includes(metSearch.toLowerCase()) && !metrics.includes(m)).map((met:string) => (
                                  <div key={met} onClick={() => { updateField('metrics', [...metrics, met]); setShowMetDropdown(false); setMetSearch('') }}
                                    style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 14px', cursor:'pointer' }}
                                    onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#e3f2fd'}
                                    onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}>
                                    <span style={{ fontSize:10, fontWeight:700, color:'#1565c0', background:'#bbdefb', borderRadius:3, padding:'1px 5px', flexShrink:0 }}>123</span>
                                    <span style={{ fontSize:13, color:'#1a1a1a' }}>{met}</span>
                                  </div>
                                ))}
                              </div>
                              <div style={{ padding:'8px 14px', borderTop:'1px solid #f0f0f0' }}>
                                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', color:'#1a85c8', cursor:'pointer', fontSize:13, fontWeight:500 }}>
                                  <span>⊕</span> Add calculated field
                                </div>
                              </div>
                            </div>
                          )}
                          {[{label:'Optional metrics'},{label:'Metric sliders'}].map(row => (
                            <div key={row.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10 }}>
                              <span style={{ fontSize:12, color:'#555' }}>{row.label}</span>
                              <div style={{ width:36, height:20, borderRadius:10, background:'#e0e0e0', position:'relative', cursor:'pointer' }}>
                                <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff', position:'absolute', top:2, left:2, boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Filter */}
                        <div style={{ padding:'14px 0', borderBottom:'1px solid #f0f0f0', position:'relative' as const }}>
                          <p style={{ fontSize:13, fontWeight:700, color:'#1a1a1a', marginBottom:4 }}>Filter</p>
                          <p style={{ fontSize:11, color:'#999', marginBottom:8 }}>Report Filter</p>
                          <div style={{ background:'#f5f5f5', border:'1px solid #e0e0e0', borderRadius:20, padding:'7px 14px', fontSize:12, color:'#555', marginBottom:10 }}>
                            {(widgetData.filters as string[])?.length > 0 ? (widgetData.filters as string[]).join(', ') : 'No filter applied'}
                          </div>

                          {/* Applied filters */}
                          {((widgetData.filters as string[]) || []).length > 0 && (
                            <div style={{ display:'flex', flexDirection:'column' as const, gap:6, marginBottom:8 }}>
                              {((widgetData.filters as string[]) || []).map((f: string, i: number) => (
                                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, background:'#fff3e0', border:'1px solid #ffe0b2', borderRadius:20, padding:'5px 12px' }}>
                                  <span style={{ fontSize:11 }}>≡</span>
                                  <span style={{ flex:1, fontSize:12, color:'#e65100' }}>{f}</span>
                                  <button onClick={() => updateField('filters', ((widgetData.filters as string[]) || []).filter((_: string, j: number) => j !== i))}
                                    style={{ background:'none', border:'none', cursor:'pointer', color:'#999', padding:0 }}><X size={11}/></button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                            <span style={{ fontSize:12, color:'#555' }}>Inherit filters</span>
                            <div style={{ width:36, height:20, borderRadius:10, background:'#e0e0e0', position:'relative', cursor:'pointer' }}>
                              <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff', position:'absolute', top:2, left:2, boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
                            </div>
                          </div>

                          <p style={{ fontSize:12, color:'#555', marginBottom:6 }}>Filters on this chart</p>
                          <button
                            onClick={() => { setShowFilterDropdown(!showFilterDropdown); setFilterSearch(''); if (ga4Filters.length === 0) loadGA4Filters() }}
                            style={{ display:'flex', alignItems:'center', gap:8, background:'#f0f7ff', border:'1px dashed #90caf9', borderRadius:20, padding:'6px 14px', cursor:'pointer', color:'#1a85c8', fontSize:12, width:'100%', justifyContent:'center' }}>
                            <Plus size={13}/> Add filter
                          </button>

                          {/* Filter dropdown */}
                          {showFilterDropdown && (
                            <div style={{ position:'absolute' as const, top:'100%', left:0, right:0, background:'#fff', border:'1px solid #e0e0e0', borderRadius:12, boxShadow:'0 8px 32px rgba(0,0,0,0.15)', zIndex:300, overflow:'hidden', maxHeight:400 }}>
                              {/* Search */}
                              <div style={{ padding:'12px 14px', borderBottom:'1px solid #f0f0f0', position:'sticky' as const, top:0, background:'#fff' }}>
                                <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f5f5f5', borderRadius:20, padding:'8px 14px' }}>
                                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="5" stroke="#999" strokeWidth="1.5"/><path d="M10.5 10.5 L13 13" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                  <input autoFocus value={filterSearch} onChange={e => setFilterSearch(e.target.value)}
                                    placeholder="Search" style={{ background:'transparent', border:'none', outline:'none', fontSize:13, color:'#333', width:'100%' }}/>
                                </div>
                              </div>

                              <div style={{ overflowY:'auto' as const, maxHeight:300 }}>
                                {loadingFilters && (
                                  <div style={{ padding:'16px', textAlign:'center' as const, fontSize:12, color:'#999' }}>Loading filters...</div>
                                )}

                                {/* GA4 filters from connected property */}
                                {ga4Filters.filter(f => f.type === 'ga4').filter(f => f.name.toLowerCase().includes(filterSearch.toLowerCase())).length > 0 && (
                                  <div style={{ padding:'8px 0' }}>
                                    <p style={{ fontSize:11, color:'#888', padding:'4px 14px 6px', fontWeight:600 }}>Data source and resource filters</p>
                                    {ga4Filters.filter(f => f.type === 'ga4' && f.name.toLowerCase().includes(filterSearch.toLowerCase())).map(f => (
                                      <div key={f.name}
                                        onClick={() => { updateField('filters', [...((widgetData.filters as string[]) || []), f.name]); setShowFilterDropdown(false) }}
                                        style={{ padding:'9px 14px', fontSize:13, color:'#1a1a1a', cursor:'pointer', background:'transparent' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#f5f5f5'}
                                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                                        {f.name}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Other data source filters */}
                                {ga4Filters.filter(f => f.type === 'other').filter(f => f.name.toLowerCase().includes(filterSearch.toLowerCase())).length > 0 && (
                                  <div style={{ padding:'8px 0', borderTop:'1px solid #f5f5f5' }}>
                                    <p style={{ fontSize:11, color:'#888', padding:'4px 14px 6px', fontWeight:600 }}>Filters using other data sources</p>
                                    {ga4Filters.filter(f => f.type === 'other' && f.name.toLowerCase().includes(filterSearch.toLowerCase())).map(f => (
                                      <div key={f.name}
                                        onClick={() => { updateField('filters', [...((widgetData.filters as string[]) || []), f.name]); setShowFilterDropdown(false) }}
                                        style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', fontSize:13, color:'#1a1a1a', cursor:'pointer', background:'#fff8f6' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#ffede8'}
                                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = '#fff8f6'}>
                                        <span style={{ fontSize:12, color:'#e65100' }}>≡</span>
                                        {f.name}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Show placeholder filters if API hasn't returned yet */}
                                {!loadingFilters && ga4Filters.length === 0 && (
                                  <div style={{ padding:'8px 0' }}>
                                    <p style={{ fontSize:11, color:'#888', padding:'4px 14px 6px', fontWeight:600 }}>Common filters</p>
                                    {['Sessions only','New users only','Mobile users','Desktop users','Organic traffic','Paid traffic','Direct traffic','Returning users'].filter(f => f.toLowerCase().includes(filterSearch.toLowerCase())).map(f => (
                                      <div key={f}
                                        onClick={() => { updateField('filters', [...((widgetData.filters as string[]) || []), f]); setShowFilterDropdown(false) }}
                                        style={{ padding:'9px 14px', fontSize:13, color:'#1a1a1a', cursor:'pointer' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#f5f5f5'}
                                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                                        {f}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Create a filter */}
                              <div style={{ padding:'10px 14px', borderTop:'1px solid #f0f0f0', background:'#fff' }}>
                                <button onClick={() => { setShowCreateFilter(true); setShowFilterDropdown(false); setNewFilterName(''); setNewFilterClauses([{ include: true, field: '', operator: 'contains', value: '' }]) }}
                                  style={{ display:'flex', alignItems:'center', gap:8, color:'#1a85c8', fontSize:13, fontWeight:600, background:'none', border:'none', cursor:'pointer', padding:0 }}>
                                  <Plus size={15}/> Create a filter
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Default date range filter */}
                        <div style={{ padding:'14px 0', borderBottom:'1px solid #f0f0f0' }}>
                          <p style={{ fontSize:13, fontWeight:700, color:'#1a1a1a', marginBottom:10 }}>Default date range filter</p>
                          {[{val:'auto',label:'Auto: Last 28 days (exclude today)'},{val:'custom',label:'Custom'}].map(opt => (
                            <label key={opt.val} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, cursor:'pointer' }}>
                              <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${(widgetData.dateRangeType||'auto')===opt.val?'#1a85c8':'#ccc'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                {(widgetData.dateRangeType||'auto')===opt.val && <div style={{ width:8, height:8, borderRadius:'50%', background:'#1a85c8' }}/>}
                              </div>
                              <span style={{ fontSize:12, color:'#333' }}>{opt.label}</span>
                            </label>
                          ))}
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:4 }}>
                            <span style={{ fontSize:12, color:'#555' }}>Comparison date range</span>
                            <div style={{ width:36, height:20, borderRadius:10, background:'#e0e0e0', position:'relative', cursor:'pointer' }}>
                              <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff', position:'absolute', top:2, left:2, boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
                            </div>
                          </div>
                        </div>

                        {/* Number of rows */}
                        <div style={{ padding:'14px 0', borderBottom:'1px solid #f0f0f0' }}>
                          <p style={{ fontSize:13, fontWeight:700, color:'#1a1a1a', marginBottom:10 }}>Number of rows</p>
                          {[{val:'pagination',label:'Pagination'},{val:'topn',label:'Top N'}].map(opt => (
                            <label key={opt.val} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, cursor:'pointer' }}>
                              <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${(widgetData.rowsType||'pagination')===opt.val?'#1a85c8':'#ccc'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                {(widgetData.rowsType||'pagination')===opt.val && <div style={{ width:8, height:8, borderRadius:'50%', background:'#1a85c8' }}/>}
                              </div>
                              <span style={{ fontSize:12, color:'#333' }}>{opt.label}</span>
                            </label>
                          ))}
                          <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', border:'1px solid #e0e0e0', borderRadius:6, padding:'6px 12px', marginTop:4 }}>
                            <span style={{ fontSize:11, color:'#555' }}>Rows per page</span>
                            <select style={{ flex:1, border:'none', outline:'none', fontSize:12, color:'#333', background:'transparent' }}>
                              <option>10</option><option>25</option><option selected>100</option><option>500</option>
                            </select>
                          </div>
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10 }}>
                            <span style={{ fontSize:12, color:'#555' }}>Show summary row</span>
                            <div style={{ width:36, height:20, borderRadius:10, background:'#e0e0e0', position:'relative', cursor:'pointer' }}>
                              <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff', position:'absolute', top:2, left:2, boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
                            </div>
                          </div>
                        </div>

                        {/* Sort */}
                        <div style={{ padding:'14px 0', borderBottom:'1px solid #f0f0f0' }}>
                          <p style={{ fontSize:13, fontWeight:700, color:'#1a1a1a', marginBottom:10 }}>Sort</p>
                          <div style={{ background:'#f5f5f5', borderRadius:8, padding:10, marginBottom:8 }}>
                            <p style={{ fontSize:12, fontWeight:600, color:'#333', marginBottom:8 }}>Sort #1</p>
                            <div style={{ display:'flex', alignItems:'center', gap:8, background:'#e3f2fd', border:'1px solid #bbdefb', borderRadius:20, padding:'5px 12px', marginBottom:8 }}>
                              <span style={{ fontSize:10, fontWeight:700, color:'#1565c0', background:'#bbdefb', borderRadius:3, padding:'1px 4px' }}>AUT</span>
                              <span style={{ fontSize:12, color:'#1a1a1a', flex:1 }}>{metrics[0] || 'Sessions'}</span>
                            </div>
                            {['Descending','Ascending'].map((opt,i) => (
                              <label key={opt} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4, cursor:'pointer' }}>
                                <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${i===0?'#1a85c8':'#ccc'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                  {i===0 && <div style={{ width:8, height:8, borderRadius:'50%', background:'#1a85c8' }}/>}
                                </div>
                                <span style={{ fontSize:12, color:'#333' }}>{opt}</span>
                              </label>
                            ))}
                          </div>
                          <button style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'1px dashed #ccc', borderRadius:20, padding:'6px 14px', cursor:'pointer', color:'#666', fontSize:12, width:'100%', justifyContent:'center' }}>
                            <Plus size={13}/> Add sort
                          </button>
                        </div>

                        {/* Chart interactions */}
                        <div style={{ padding:'14px 0' }}>
                          <p style={{ fontSize:13, fontWeight:700, color:'#1a1a1a', marginBottom:10 }}>Chart interactions</p>
                          {[{label:'Cross-filtering', on:false},{label:'Open links in new tab', on:true}].map(row => (
                            <div key={row.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                              <span style={{ fontSize:12, color:'#555' }}>{row.label}</span>
                              <div style={{ width:36, height:20, borderRadius:10, background:row.on?'#1a85c8':'#e0e0e0', position:'relative', cursor:'pointer' }}>
                                <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff', position:'absolute', top:2, left:row.on?18:2, boxShadow:'0 1px 3px rgba(0,0,0,0.2)', transition:'left 0.2s' }}/>
                              </div>
                            </div>
                          ))}
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
                          <div key={key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 0', borderBottom:'1px solid #f5f5f5' }}>
                            <span style={{ fontSize:14, fontWeight:500, color:'#1a1a1a' }}>{label}</span>
                            <div
                              onClick={() => {
                                const updated = {...editingWidget, [key]: !on } as any
                                setEditingWidget(updated)
                                setWidgets(prev => prev.map(w => w.id === updated.id ? updated : w))
                              }}
                              style={{ width:44, height:24, borderRadius:12, background: on ? '#48b5ea' : '#e0e0e0', position:'relative', cursor:'pointer', transition:'background 0.2s', flexShrink:0 }}>
                              <div style={{ width:20, height:20, borderRadius:'50%', background:'#fff', position:'absolute', top:2, left: on ? 22 : 2, boxShadow:'0 1px 4px rgba(0,0,0,0.2)', transition:'left 0.2s' }}/>
                            </div>
                          </div>
                        )
                      })}

                      {/* Color pickers */}
                      <div style={{ marginTop:20 }}>
                        {[
                          { label:'Text Color',  field:'textColor',  default:'#1a1a1a' },
                          { label:'Background',  field:'color',      default:'#ffffff' },
                          { label:'Border',      field:'borderColor',default:'#e5e5e5' },
                        ].map(({ label, field, default: def }) => {
                          const BG_OPTIONS: {[key:string]:string} = {
                            white:'#ffffff', blue:'#48b5ea', green:'#4caf82', red:'#ef5350'
                          }
                          const currentVal = field === 'color'
                            ? ((editingWidget as any).bgHex || BG_OPTIONS[(editingWidget as any).color] || def)
                            : ((editingWidget as any)[field] || def)
                          return (
                            <div key={field} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #f5f5f5' }}>
                              <span style={{ fontSize:14, fontWeight:500, color:'#1a1a1a' }}>{label}</span>
                              <label style={{ position:'relative', cursor:'pointer' }}>
                                <div style={{ width:36, height:36, borderRadius:6, background: currentVal, border:'1px solid #e0e0e0', cursor:'pointer', overflow:'hidden' }}/>
                                <input
                                  type="color"
                                  value={currentVal}
                                  onChange={e => {
                                    let updated: any
                                    if (field === 'color') {
                                      const hex = e.target.value
                                      const key = hex === '#48b5ea' ? 'blue' : hex === '#4caf82' ? 'green' : hex === '#ef5350' ? 'red' : 'white'
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

                      <button onClick={saveWidget} style={{ width:'100%', background:'#48b5ea', border:'none', borderRadius:6, padding:'11px', fontSize:13, fontWeight:600, color:'#fff', cursor:'pointer', marginTop:24 }}>Save Changes</button>

                    </div>
                  )}
                </div>
              </div>
            )}
            {activeRightPanel && !editingWidget && (
              <div style={{ width:300, background:'#fff', borderRight:'1px solid #e5e5e5', display:'flex', flexDirection:'column', overflow:'hidden' }}>
                {activeRightPanel==='build' && (
                  <div style={{ flex:1, overflowY:'auto', padding:20 }}>
                    {[
                      {icon:'⊞', title:'Summarize your data with AI', desc:'Transform your data into clear, meaningful insights your clients will actually understand'},
                      {icon:'📊', title:'Build metrics with AI', desc:'Use natural prompts to find the right widgets and instantly add the metrics that matter most'},
                      {icon:'⧉', title:'Clone existing page', desc:'Copy a dashboard from any client and use it as a starting point'},
                    ].map(item => (
                      <div key={item.title}
                        onClick={item.title === 'Clone existing page' ? e => { e.stopPropagation(); setShowCloneModal(true) } : undefined}
                        style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'16px 0', borderBottom:'1px solid #f0f0f0', cursor:'pointer' }}>
                        <div style={{ width:36, height:36, borderRadius:8, background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:16 }}>{item.icon}</div>
                        <div style={{ flex:1 }}><p style={{ fontSize:15, fontWeight:700, color:'#1a1a1a', marginBottom:4 }}>{item.title}</p><p style={{ fontSize:13, color:'#666', lineHeight:1.5 }}>{item.desc}</p></div>
                      </div>
                    ))}
                  </div>
                )}
                {activeRightPanel==='charts' && (
                  <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                    <div style={{ padding:'12px 16px', borderBottom:'1px solid #f0f0f0', flexShrink:0 }}>
                      <p style={{ fontSize:13, fontWeight:700, color:'#1a1a1a', marginBottom:2 }}>Add Chart</p>
                      <p style={{ fontSize:11, color:'#999' }}>Click any chart to add it to the dashboard</p>
                    </div>
                    <div style={{ flex:1, overflowY:'auto' as const }}>
                      {CHART_TYPE_GROUPS.map(group => (
                        <div key={group.group} style={{ padding:'10px 10px 4px' }}>
                          <p style={{ fontSize:10, fontWeight:700, color:'#999', textTransform:'uppercase' as const, letterSpacing:'0.06em', marginBottom:8 }}>{group.group}</p>
                          <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6, marginBottom:6 }}>
                            {group.types.map(ct => (
                              <button key={ct.id} onClick={() => addWidget(ct.id, ct.label)}
                                title={`Add ${ct.label}`}
                                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'4px', borderRadius:6, border:'2px solid #e5e5e5', background:'#fff', cursor:'pointer', width:62, transition:'all 0.1s' }}
                                onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='#48b5ea';(e.currentTarget as HTMLButtonElement).style.background='#ebf7ff'}}
                                onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='#e5e5e5';(e.currentTarget as HTMLButtonElement).style.background='#fff'}}>
                                <div style={{ width:48, height:36, background:'#f8f9fa', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
                                  {ct.id==='table'||ct.id==='pivot' ? '⊞' :
                                   ct.id==='scorecard'||ct.id==='scorecard2' ? '🔢' :
                                   ct.id==='column'||ct.id==='bar'||ct.id==='stackedbar'||ct.id==='combo'||ct.id==='hbar'||ct.id==='hstacked' ? '📊' :
                                   ct.id==='line'||ct.id==='multiline'||ct.id==='smoothline'||ct.id==='waveline'||ct.id==='timeseries'||ct.id==='timeseries2' ? '📈' :
                                   ct.id==='area'||ct.id==='stackarea'||ct.id==='steparea' ? '📉' :
                                   ct.id==='pie'||ct.id==='donut' ? '🥧' :
                                   ct.id==='scatter'||ct.id==='bubble' ? '⚬' :
                                   ct.id==='sparkline' ? '〰' :
                                   ct.id==='treemap' ? '▦' :
                                   ct.id==='funnel' ? '⊽' :
                                   ct.id==='gauge' ? '◔' :
                                   ct.id==='map' ? '🌐' :
                                   ct.id==='waterfall' ? '⬇' :
                                   ct.id==='candlestick'||ct.id==='ohlc' ? '🕯' : '📋'}
                                </div>
                                <span style={{ fontSize:9, color:'#666', textAlign:'center' as const, lineHeight:1.2, whiteSpace:'nowrap' as const, overflow:'hidden', textOverflow:'ellipsis', width:'100%' }}>{ct.label}</span>
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
                    <div style={{ padding:'10px 12px', borderBottom:'1px solid #f0f0f0' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'7px 10px', marginBottom:8 }}>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="#999" strokeWidth="1.5"/><path d="M9.5 9.5 L12 12" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        <input value={integrationSearch} onChange={e => setIntegrationSearch(e.target.value)} placeholder="Search" style={{ background:'transparent', border:'none', outline:'none', fontSize:13, color:'#333', width:'100%' }}/>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'2px 2px' }}>
                        <span style={{ fontSize:12, fontWeight:600, color:'#333' }}>All Integrations</span>
                        <ChevronDown size={14} style={{ color:'#999' }}/>
                      </div>
                    </div>
                    {/* List */}
                    <div style={{ flex:1, overflowY:'auto' }}>
                      {ALL_INTEGRATIONS.filter((i:any) => i.name.toLowerCase().includes(integrationSearch.toLowerCase())).map((i:any) => (
                        <div key={i.name} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderBottom:'1px solid #f5f5f5', cursor:'pointer', transition:'background 0.1s' }}
                          onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#f8f9fa'}
                          onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}>
                          {/* Brand icon via favicon */}
                          <div style={{ width:28, height:28, borderRadius:6, background:'#f5f5f5', border:'1px solid #ebebeb', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden' }}>
                            <img
                              src={`https://www.google.com/s2/favicons?domain=${i.domain}&sz=64`}
                              alt={i.name}
                              style={{ width:20, height:20, objectFit:'contain', opacity: i.connected ? 1 : 0.45 }}
                              onError={e => { (e.currentTarget as HTMLImageElement).style.display='none' }}
                            />
                          </div>
                          <span style={{ flex:1, fontSize:13, color: i.connected ? '#1a1a1a' : '#aaa', fontWeight: i.connected ? 500 : 400 }}>{i.name}</span>
                          <ChevronRight size={13} style={{ color:'#ccc', flexShrink:0 }}/>
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



      {/* Clone Page Modal */}
      {showCloneModal && (
        <ClonePageModal
          onClose={() => setShowCloneModal(false)}
          onClone={(source, newName) => {
            setDashboards(prev => [...prev, newName])
            setClonedDashboards(prev => [...prev, newName])
            setActiveDash(newName)
            setShowCloneModal(false)
          }}
        />
      )}

      {/* Create Filter Modal */}
      {showCreateFilter && (() => {
        const OPERATORS = ['contains','exactly matches','starts with','ends with','is greater than','is less than','matches regex','is null']
        const GA4_DIM_FIELDS = [
          'Achievement ID','Action','Ad format','Ad Label','Ad source','Ad unit','Age',
          'Aggregated Link URL','App version','Browser','Campaign','Campaign ID',
          'City','Country','Date','Default Channel Group','Device Category',
          'Event Name','Gender','Hostname','Landing Page','Operating System',
          'Page Location','Page Title','Region','Screen Class','Session Campaign',
          'Session Medium','Session Source','Stream Name','Transaction ID',
        ]
        return (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:500, display:'flex', flexDirection:'column' as const }}
            onClick={() => setShowCreateFilter(false)}>
            {/* Modal panel — bottom sheet style like Looker Studio */}
            <div style={{ marginTop:'auto', background:'#fff', borderRadius:'12px 12px 0 0', boxShadow:'0 -8px 40px rgba(0,0,0,0.15)', maxHeight:'80vh', display:'flex', flexDirection:'column' as const }}
              onClick={e => e.stopPropagation()}>

              {/* Header */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 24px', borderBottom:'1px solid #e0e0e0', flexShrink:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:16, fontWeight:600, color:'#1a1a1a' }}>Create Filter</span>
                  <span style={{ fontSize:11, background:'#e8eaf6', color:'#3949ab', borderRadius:4, padding:'2px 8px', fontWeight:600 }}>BETA</span>
                </div>
                <button onClick={() => setShowCreateFilter(false)} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:'#666', fontSize:13, fontWeight:500 }}>
                  <X size={16}/> CLOSE
                </button>
              </div>

              <div style={{ flex:1, overflowY:'auto' as const, padding:'20px 24px' }}>
                {/* Filter name + data source row */}
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
                  <div style={{ position:'relative' as const, flex:'0 0 200px' }}>
                    <label style={{ position:'absolute' as const, top:-8, left:12, fontSize:11, color:'#666', background:'#fff', padding:'0 4px' }}>Name</label>
                    <input value={newFilterName} onChange={e => setNewFilterName(e.target.value)}
                      placeholder="Filter name"
                      style={{ width:'100%', border:'1px solid #ccc', borderRadius:6, padding:'10px 14px', fontSize:13, outline:'none', color:'#333', boxSizing:'border-box' as const }}/>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f5f5f5', borderRadius:20, padding:'7px 14px', border:'1px solid #e0e0e0' }}>
                    <img src="https://www.google.com/s2/favicons?domain=analytics.google.com&sz=32" style={{ width:16, height:16 }} alt=""/>
                    <span style={{ fontSize:13, color:'#333', fontWeight:500 }}>{mappingPropName || 'GA4 Property'}</span>
                  </div>
                  <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#333', cursor:'pointer' }}>
                    <div style={{ width:36, height:20, borderRadius:10, background:'#1a85c8', position:'relative', cursor:'pointer' }}>
                      <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff', position:'absolute', top:2, left:18, boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
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
                          <button key={op} style={{ padding:'4px 16px', borderRadius:20, border:'1px solid #1a85c8', background: op==='AND' ? '#1a85c8' : 'transparent', color: op==='AND' ? '#fff' : '#1a85c8', fontSize:12, fontWeight:600, cursor:'pointer' }}>{op}</button>
                        ))}
                      </div>
                    )}
                    <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                      {/* Include/Exclude */}
                      <select value={clause.include ? 'include' : 'exclude'}
                        onChange={e => { const c = [...newFilterClauses]; c[idx] = {...c[idx], include: e.target.value === 'include'}; setNewFilterClauses(c) }}
                        style={{ border:'1px solid #ccc', borderRadius:6, padding:'10px 14px', fontSize:13, color:'#333', background:'#fff', cursor:'pointer', outline:'none', minWidth:120 }}>
                        <option value="include">Include</option>
                        <option value="exclude">Exclude</option>
                      </select>

                      {/* Field selector */}
                      <div style={{ position:'relative' as const, flex:'0 0 220px' }}>
                        <div onClick={() => setOpenClauseFieldIdx(openClauseFieldIdx === idx ? null : idx)}
                          style={{ border:'1px solid #ccc', borderRadius:6, padding:'10px 14px', fontSize:13, color: clause.field ? '#333' : '#999', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                          {clause.field ? (
                            <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                              <span style={{ fontSize:10, fontWeight:700, color:'#388e3c', background:'#c8e6c9', borderRadius:3, padding:'1px 5px' }}>ABC</span>
                              {clause.field}
                            </span>
                          ) : 'Select a field'}
                          <ChevronDown size={14} style={{ color:'#666' }}/>
                        </div>
                        {openClauseFieldIdx === idx && (
                          <div style={{ position:'absolute' as const, top:'100%', left:0, right:0, background:'#fff', border:'1px solid #e0e0e0', borderRadius:8, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:600, maxHeight:280, overflow:'hidden', display:'flex', flexDirection:'column' as const }}>
                            <div style={{ padding:'8px 10px', borderBottom:'1px solid #f0f0f0' }}>
                              <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f5f5f5', borderRadius:6, padding:'6px 10px' }}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="4" stroke="#999" strokeWidth="1.5"/><path d="M9 9 L11 11" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                <input autoFocus value={filterFieldSearch} onChange={e => setFilterFieldSearch(e.target.value)}
                                  placeholder="Search" style={{ background:'transparent', border:'none', outline:'none', fontSize:12, color:'#333', width:'100%' }}/>
                              </div>
                            </div>
                            <div style={{ overflowY:'auto' as const, flex:1 }}>
                              <p style={{ fontSize:11, color:'#555', padding:'6px 12px 2px', fontWeight:600 }}>Default group</p>
                              {GA4_DIM_FIELDS.filter(f => f.toLowerCase().includes(filterFieldSearch.toLowerCase())).map(field => (
                                <div key={field}
                                  onClick={() => { const c = [...newFilterClauses]; c[idx] = {...c[idx], field}; setNewFilterClauses(c); setOpenClauseFieldIdx(null); setFilterFieldSearch('') }}
                                  style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', cursor:'pointer', fontSize:13, color:'#1a1a1a' }}
                                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#e8f5e9'}
                                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                                  <span style={{ fontSize:10, fontWeight:700, color:'#388e3c', background:'#c8e6c9', borderRadius:3, padding:'1px 5px', flexShrink:0 }}>ABC</span>
                                  {field}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Operator */}
                      <select value={clause.operator}
                        onChange={e => { const c = [...newFilterClauses]; c[idx] = {...c[idx], operator: e.target.value}; setNewFilterClauses(c) }}
                        style={{ border:'1px solid #ccc', borderRadius:6, padding:'10px 14px', fontSize:13, color:'#333', background:'#fff', cursor:'pointer', outline:'none', flex:1 }}>
                        {OPERATORS.map(op => <option key={op} value={op}>{op}</option>)}
                      </select>

                      {/* Value input */}
                      <input value={clause.value} onChange={e => { const c = [...newFilterClauses]; c[idx] = {...c[idx], value: e.target.value}; setNewFilterClauses(c) }}
                        placeholder="Value"
                        style={{ flex:1, border:'1px solid #ccc', borderRadius:6, padding:'10px 14px', fontSize:13, color:'#333', outline:'none' }}/>

                      {/* OR button */}
                      <button style={{ padding:'10px 16px', borderRadius:20, border:'1px solid #ccc', background:'transparent', color:'#666', fontSize:12, fontWeight:600, cursor:'pointer', flexShrink:0 }}>OR</button>

                      {/* Remove clause */}
                      {newFilterClauses.length > 1 && (
                        <button onClick={() => setNewFilterClauses(prev => prev.filter((_, i) => i !== idx))}
                          style={{ background:'none', border:'none', cursor:'pointer', color:'#999', padding:'10px 4px' }}><X size={16}/></button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add AND clause */}
                <button onClick={() => setNewFilterClauses(prev => [...prev, { include: true, field: '', operator: 'contains', value: '' }])}
                  style={{ display:'flex', alignItems:'center', gap:8, marginTop:12, background:'transparent', border:'1px solid #1a85c8', borderRadius:20, padding:'7px 16px', color:'#1a85c8', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                  AND
                  <ChevronDown size={14}/>
                </button>

                <p style={{ marginTop:16, fontSize:12, color:'#999' }}>This filter has {newFilterClauses.length} clause{newFilterClauses.length > 1 ? 's' : ''}</p>
              </div>

              {/* Footer */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:12, padding:'14px 24px', borderTop:'1px solid #e0e0e0', flexShrink:0 }}>
                <button onClick={() => setShowCreateFilter(false)}
                  style={{ background:'none', border:'none', cursor:'pointer', color:'#666', fontSize:14, fontWeight:500 }}>Cancel</button>
                <button
                  disabled={!newFilterName.trim() || newFilterClauses.some(c => !c.field)}
                  onClick={() => {
                    if (!newFilterName.trim()) return
                    // Save filter to ga4Filters list and apply to widget
                    setGa4Filters(prev => [...prev, { name: newFilterName.trim(), type: 'ga4' as const }])
                    updateField('filters', [...((editingWidget as any)?.filters || []), newFilterName.trim()])
                    setShowCreateFilter(false)
                  }}
                  style={{ background: (!newFilterName.trim() || newFilterClauses.some(c => !c.field)) ? '#ccc' : '#1a85c8', border:'none', borderRadius:6, padding:'10px 24px', color:'#fff', fontSize:14, fontWeight:600, cursor: (!newFilterName.trim() || newFilterClauses.some(c => !c.field)) ? 'not-allowed' : 'pointer' }}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )
      })()}

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
