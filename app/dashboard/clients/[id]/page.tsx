'use client'
import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronRight, Sparkles, Settings, Calendar, ChevronDown, Plus, MoreHorizontal, Maximize2, X, Grip, RotateCcw, RotateCw, Monitor, Smartphone, ChevronLeft, RefreshCw, CheckCircle2, Download, Mail, Link2, LayoutGrid, Edit, Copy, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ScatterChart, Scatter as ScatterPlot, ZAxis } from 'recharts'

// ── Alloy Design System tokens ─────────────────────────────────────────────
const ALLOY = {
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
  fontDisplay: "'Aeonik','DM Sans',system-ui,sans-serif",
  fontBody:    "'DM Sans',system-ui,sans-serif",
  fontLabel:   "'Barlow','DM Sans',system-ui,sans-serif",
  label: { fontFamily:"'Barlow','DM Sans',system-ui,sans-serif", fontSize:9, fontWeight:600, textTransform:'uppercase' as const, letterSpacing:'0.1em', color:'#6B6B6B' },
} as const

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
  { group:'Table', types:[{ id:'table', label:'Table' },{ id:'pivot', label:'Pivot' }]},
  { group:'Scorecard', types:[{ id:'scorecard', label:'Scorecard' },{ id:'scorecard2', label:'Scorecard' }]},
  { group:'Time Series', types:[{ id:'timeseries', label:'Smooth' },{ id:'timeseries2', label:'Jagged' },{ id:'sparkline', label:'Sparkline' }]},
  { group:'Bar', types:[{ id:'column', label:'Column' },{ id:'bar', label:'Bar' },{ id:'stackedbar', label:'Stacked' },{ id:'combo', label:'Line+Bar' },{ id:'hbar', label:'H.Bar' },{ id:'hstacked', label:'H.Stack' }]},
  { group:'Line', types:[{ id:'line', label:'Line' },{ id:'multiline', label:'Multi' },{ id:'smoothline', label:'Smooth' },{ id:'waveline', label:'Wave' },{ id:'candlestick', label:'Candle' },{ id:'ohlc', label:'OHLC' }]},
  { group:'Area', types:[{ id:'area', label:'Area' },{ id:'stackarea', label:'Stacked' },{ id:'steparea', label:'Step' }]},
  { group:'Pie', types:[{ id:'pie', label:'Pie' },{ id:'donut', label:'Donut' }]},
  { group:'Scatter', types:[{ id:'scatter', label:'Scatter' },{ id:'bubble', label:'Bubble' }]},
  { group:'Other', types:[{ id:'treemap', label:'Treemap' },{ id:'funnel', label:'Funnel' },{ id:'sankey', label:'Sankey' },{ id:'gauge', label:'Gauge' },{ id:'waterfall', label:'Waterfall' },{ id:'timeline', label:'Timeline' },{ id:'map', label:'Geo Map' },{ id:'histogram', label:'Histogram' },{ id:'bullet', label:'Bullet' }]},
]
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
  { name:'Ahrefs',                domain:'ahrefs.com',         connected:false },
  { name:'Amazon Ads',            domain:'advertising.amazon.com', connected:false },
  { name:'HubSpot',               domain:'hubspot.com',        connected:false },
  { name:'Instagram',             domain:'instagram.com',      connected:false },
  { name:'Klaviyo',               domain:'klaviyo.com',        connected:false },
  { name:'Mailchimp',             domain:'mailchimp.com',      connected:false },
  { name:'Pinterest',             domain:'pinterest.com',      connected:false },
  { name:'Shopify',               domain:'shopify.com',        connected:false },
  { name:'TikTok',                domain:'tiktok.com',         connected:false },
  { name:'YouTube',               domain:'youtube.com',        connected:false },
]

const STATIC_SESSIONS = [{d:'1A',v:8000},{d:'6A',v:19000},{d:'13A',v:10000},{d:'20A',v:11000},{d:'27A',v:7000},{d:'4M',v:7000},{d:'11M',v:7500},{d:'18M',v:8000},{d:'25M',v:7000}]
const STATIC_DEVICES = [{name:'Mobile',v:56564},{name:'Desktop',v:31740},{name:'Tablet',v:785}]
const STATIC_DONUT = [{name:'Organic Search',value:68639,color:'#2196f3'},{name:'Direct',value:30294,color:'#64b5f6'},{name:'Paid Social',value:8288,color:ALLOY.blue3},{name:'Organic Social',value:6570,color:'#bbdefb'}]
const STATIC_CITIES = [{city:'Atlanta',val:25348,pct:92},{city:'(not set)',val:7210,pct:26},{city:'Singapore',val:1689,pct:6},{city:'Marietta',val:1558,pct:6}]

const KPI_BG: {[key:string]:{bg:string;border:string;text:string;sub:string}} = {
  white:{bg:ALLOY.white,border:ALLOY.line,text:ALLOY.ink,sub:ALLOY.mute},
  blue:{bg:ALLOY.blue1,border:'transparent',text:ALLOY.white,sub:'rgba(255,255,255,0.85)'},
  green:{bg:ALLOY.green1,border:'transparent',text:ALLOY.white,sub:'rgba(255,255,255,0.85)'},
  red:{bg:ALLOY.red1,border:'transparent',text:ALLOY.white,sub:'rgba(255,255,255,0.85)'},
}

// All static widget IDs in their default render order
const ALL_STATIC_IDS_ORDERED = ['w1','w2','w3','w4','c1','c2','c3','bounce','d1','d2','d3','v1']

interface Widget { id:string; title:string; dataSource:string; chartType:string; tooltip:string; color:string; value:string; change:string; up:boolean; textColor?:string; borderColor?:string; bgHex?:string; showAnomalies?:boolean; showForecast?:boolean; showIntegIcon?:boolean; metrics?:string[]; dimensions?:string[]; filters?:string[] }

function formatNum(n: number) {
  if (n>=1000000) return (n/1000000).toFixed(1)+'M'
  if (n>=1000) return (n/1000).toFixed(1)+'K'
  return n.toString()
}

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
    const dimLabel   = dimensions[0] || 'Dimension'
    const showHeader = opts.tableShowHeader !== false
    const showRowNum = opts.tableRowNumbers === true
    const tFontSize  = opts.tableFontSize   || '11px'
    const tFontFam   = opts.tableFontFamily || ALLOY.fontBody
    const headerBg   = opts.tableHeaderBg   || ALLOY.paper
    const oddBg      = opts.tableOddRow     || ALLOY.white
    const evenBg     = opts.tableEvenRow    || ALLOY.paper
    const cellBorder = opts.tableCellBorder || ALLOY.line
    const missing    = opts.tableMissingData || 'Show "null"'
    const dimAligns  = (opts.dimAlign as string[]) || dimensions.map(() => 'left')
    const fmtVal     = (v: any) => {
      if (v == null || v === '') return missing === 'Show "0"' ? '0' : missing === 'Hide row' ? null : 'null'
      return typeof v === 'number' ? v.toLocaleString() : String(v)
    }
    return (
      <div style={{ height, overflowY:'auto' as const }}>
        <table style={{ width:'100%', fontSize:tFontSize, borderCollapse:'collapse', fontFamily:tFontFam }}>
          {showHeader && (
            <thead>
              <tr style={{ background:headerBg }}>
                {showRowNum && <th style={{ padding:'4px 6px', fontWeight:600, color:ALLOY.mute, borderBottom:`2px solid ${cellBorder}`, width:28, textAlign:'center' as const }}>#</th>}
                <th style={{ padding:'5px 8px', textAlign:(dimAligns[0]||'left') as any, fontWeight:600, color:ALLOY.mute, borderBottom:`2px solid ${cellBorder}` }}>{dimLabel}</th>
                {metrics.map((m, i) => <th key={i} style={{ padding:'5px 8px', textAlign:'right', fontWeight:600, color:ALLOY.mute, borderBottom:`2px solid ${cellBorder}` }}>{m}</th>)}
              </tr>
            </thead>
          )}
          <tbody>
            {data.slice(0, Math.floor(height/22) || 6).map((d:any, i:number) => {
              const fv = fmtVal(d.v)
              if (fv === null) return null
              return (
                <tr key={i} style={{ borderBottom:`1px solid ${cellBorder}`, background: i%2===0 ? oddBg : evenBg }}>
                  {showRowNum && <td style={{ padding:'4px 6px', color:ALLOY.mute, textAlign:'center' as const, fontSize:'9px' }}>{i+1}</td>}
                  <td style={{ padding:'4px 8px', color:'#444', fontWeight:500, textAlign:(dimAligns[0]||'left') as any }}>{d.d}</td>
                  {metrics.map((_, mi) => <td key={mi} style={{ padding:'4px 8px', textAlign:'right', fontWeight:600, color:ALLOY.ink }}>{fv}</td>)}
                </tr>
              )
            })}
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
            <div style={{ height:14, borderRadius:2, background:colors[i%colors.length], width:`${Math.max(20,(d.v/maxV)*100)}%`}}/>
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
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="v" stroke={c} strokeWidth={2} dot={false}/>
        <Tooltip contentStyle={{ fontSize:10, borderRadius:2, fontFamily:ALLOY.fontBody }}/>
      </LineChart>
    </ResponsiveContainer>
  )
}

function NewDashCanvas({ onClone }: { onClone: () => void }) {
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', background:ALLOY.paper }}>
      <p style={{ fontSize:15, color:ALLOY.ink, marginBottom:2, fontFamily:ALLOY.fontDisplay }}>Start building by dragging widgets</p>
      <p style={{ fontSize:13, color:ALLOY.mute, marginBottom:20, fontFamily:ALLOY.fontBody }}>or</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, width:520 }}>
        <button style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'30px 24px', background:ALLOY.white, border:'1px solid #e8e8e8', borderRadius:2, cursor:'pointer', textAlign:'center' as const }}>
          <div style={{ width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="4" width="12" height="12" rx="2" fill="#D0D0D0"/><rect x="20" y="4" width="12" height="12" rx="2" fill="#D0D0D0"/><rect x="4" y="20" width="12" height="7" rx="1.5" fill="#E8E8E8"/><rect x="20" y="20" width="12" height="7" rx="1.5" fill="#E8E8E8"/><circle cx="10" cy="30" r="2.5" fill="#48b5ea"/></svg>
          </div>
          <div>
            <p style={{ fontSize:14, fontWeight:500, color:ALLOY.ink, marginBottom:6, fontFamily:ALLOY.fontBody }}>Add a page template</p>
            <p style={{ fontSize:12, color:ALLOY.mute, lineHeight:1.6, fontFamily:ALLOY.fontBody }}>Choose from a ready-made template or one of your saved pages</p>
          </div>
        </button>
        <button style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'30px 24px', background:ALLOY.white, border:'1px solid #e8e8e8', borderRadius:2, cursor:'pointer', textAlign:'center' as const }}>
          <div style={{ width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="12" stroke="#D0D0D0" strokeWidth="2"/><circle cx="18" cy="10" r="3" fill="#D0D0D0"/><path d="M14 18 L17 21 L23 15" stroke="#48b5ea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M26 10 L28 14 L32 12" stroke="#D0D0D0" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <div>
            <p style={{ fontSize:14, fontWeight:500, color:ALLOY.ink, marginBottom:6, fontFamily:ALLOY.fontBody }}>Build a page using AI</p>
            <p style={{ fontSize:12, color:ALLOY.mute, lineHeight:1.6, fontFamily:ALLOY.fontBody }}>Tell AI what you're trying to achieve, and watch it build your page</p>
          </div>
        </button>
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClone(); }}
          style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'30px 24px', background:ALLOY.white, border:'1px solid #e8e8e8', borderRadius:2, cursor:'pointer', textAlign:'center' as const }}>
          <div style={{ width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="5" y="8" width="18" height="22" rx="2" stroke="#D0D0D0" strokeWidth="2"/><rect x="13" y="6" width="18" height="22" rx="2" stroke="#D0D0D0" strokeWidth="2" fill="#FAFAFA"/><path d="M18 13 h8" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round"/><path d="M18 17 h6" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round"/><path d="M18 21 h7" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <div>
            <p style={{ fontSize:14, fontWeight:500, color:ALLOY.ink, marginBottom:6, fontFamily:ALLOY.fontBody }}>Clone existing page</p>
            <p style={{ fontSize:12, color:ALLOY.mute, lineHeight:1.6, fontFamily:ALLOY.fontBody }}>Copy a page from another page</p>
          </div>
        </button>
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
  if (id==='timeseries2') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><polyline points="2,24 6,12 10,20 14,8 18,18 22,10 26,22 30,6 34,16 38,8 42,14" stroke={B} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
  if (id==='sparkline')   return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><polyline points="2,24 10,18 18,22 26,12 34,16 42,10" stroke={B} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
  if (id==='column')      return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="3" y="18" width="6" height="10" fill={B}/><rect x="11" y="10" width="6" height="18" fill={B}/><rect x="19" y="14" width="6" height="14" fill={B}/><rect x="27" y="8" width="6" height="20" fill={B}/><rect x="35" y="16" width="6" height="12" fill={B}/></svg>
  if (id==='bar')         return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="3" y="18" width="6" height="10" fill={B}/><rect x="11" y="10" width="6" height="18" fill={O}/><rect x="19" y="14" width="6" height="14" fill={B}/><rect x="27" y="8" width="6" height="20" fill={O}/><rect x="35" y="16" width="6" height="12" fill={B}/></svg>
  if (id==='stackedbar')  return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="3" y="22" width="6" height="6" fill={B}/><rect x="3" y="16" width="6" height="6" fill={O}/><rect x="11" y="18" width="6" height="10" fill={B}/><rect x="11" y="12" width="6" height="6" fill={O}/><rect x="19" y="20" width="6" height="8" fill={B}/><rect x="27" y="16" width="6" height="12" fill={B}/><rect x="35" y="20" width="6" height="8" fill={B}/></svg>
  if (id==='combo')       return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="3" y="18" width="6" height="10" fill={B} fillOpacity="0.7"/><rect x="11" y="12" width="6" height="16" fill={B} fillOpacity="0.7"/><rect x="19" y="16" width="6" height="12" fill={B} fillOpacity="0.7"/><rect x="27" y="10" width="6" height="18" fill={B} fillOpacity="0.7"/><polyline points="6,14 14,8 22,12 30,6 38,10" stroke={O} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
  if (id==='hbar')        return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="2" y="3" width="22" height="5" rx="1" fill={B}/><rect x="2" y="10" width="30" height="5" rx="1" fill={O}/><rect x="2" y="17" width="18" height="5" rx="1" fill={B3}/><rect x="2" y="24" width="26" height="5" rx="1" fill={B}/></svg>
  if (id==='hstacked')    return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="2" y="3" width="18" height="5" rx="1" fill={B}/><rect x="20" y="3" width="12" height="5" rx="1" fill={O}/><rect x="2" y="10" width="22" height="5" rx="1" fill={B}/><rect x="24" y="10" width="10" height="5" rx="1" fill={O}/><rect x="2" y="17" width="16" height="5" rx="1" fill={B}/><rect x="2" y="24" width="20" height="5" rx="1" fill={B}/></svg>
  if (id==='histogram')   return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="2" y="22" width="5" height="6" fill={B} fillOpacity="0.5"/><rect x="8" y="16" width="5" height="12" fill={B} fillOpacity="0.7"/><rect x="14" y="10" width="5" height="18" fill={B}/><rect x="20" y="14" width="5" height="14" fill={B} fillOpacity="0.8"/><rect x="26" y="18" width="5" height="10" fill={B} fillOpacity="0.6"/><rect x="32" y="22" width="5" height="6" fill={B} fillOpacity="0.4"/><rect x="38" y="24" width="4" height="4" fill={B} fillOpacity="0.3"/></svg>
  if (id==='line')        return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><polyline points="2,22 10,14 18,18 26,8 34,12 42,6" stroke={B} strokeWidth="2" fill="none" strokeLinecap="round"/><polyline points="2,26 10,20 18,22 26,16 34,18 42,14" stroke={O} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
  if (id==='multiline')   return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><polyline points="2,22 10,14 18,18 26,8 34,12 42,6" stroke={B} strokeWidth="1.5" fill="none" strokeLinecap="round"/><polyline points="2,26 10,20 18,22 26,14 34,18 42,10" stroke={O} strokeWidth="1.5" fill="none" strokeLinecap="round"/><polyline points="2,28 10,24 18,26 26,20 34,22 42,16" stroke={B3} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
  if (id==='smoothline')  return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><path d="M2 22 C8 16 14 20 22 10 S34 8 42 6" stroke={O} strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M2 26 C8 20 14 24 22 16 S34 14 42 12" stroke={B} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
  if (id==='waveline')    return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><path d="M2 18 C6 12 10 24 16 16 S24 8 30 14 S38 20 42 14" stroke={O} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
  if (id==='candlestick') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><line x1="7" y1="3" x2="7" y2="27" stroke="#888" strokeWidth="1"/><rect x="4" y="8" width="6" height="12" rx="1" fill={G}/><line x1="18" y1="5" x2="18" y2="25" stroke="#888" strokeWidth="1"/><rect x="15" y="12" width="6" height="8" rx="1" fill={R}/><line x1="29" y1="7" x2="29" y2="23" stroke="#888" strokeWidth="1"/><rect x="26" y="10" width="6" height="8" rx="1" fill={G}/><line x1="40" y1="9" x2="40" y2="27" stroke="#888" strokeWidth="1"/><rect x="37" y="16" width="6" height="8" rx="1" fill={R}/></svg>
  if (id==='ohlc')        return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><line x1="8" y1="5" x2="8" y2="25" stroke={G} strokeWidth="2"/><line x1="4" y1="12" x2="8" y2="12" stroke={G} strokeWidth="2"/><line x1="8" y1="20" x2="12" y2="20" stroke={G} strokeWidth="2"/><line x1="20" y1="7" x2="20" y2="23" stroke={R} strokeWidth="2"/><line x1="32" y1="9" x2="32" y2="25" stroke={G} strokeWidth="2"/></svg>
  if (id==='area')        return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><path d="M2 30 L2 22 L10 14 L18 18 L26 8 L34 12 L42 6 L42 30 Z" fill={B3} fillOpacity="0.3"/><polyline points="2,22 10,14 18,18 26,8 34,12 42,6" stroke={B3} strokeWidth="1.5" fill="none"/></svg>
  if (id==='stackarea')   return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><path d="M2 30 L42 30 L42 18 L34 22 L26 16 L18 20 L10 24 L2 22 Z" fill={O} fillOpacity="0.5"/><path d="M2 22 L10 24 L18 20 L26 16 L34 22 L42 18 L42 8 L34 12 L26 6 L18 10 L10 14 L2 12 Z" fill={B3} fillOpacity="0.4"/></svg>
  if (id==='steparea')    return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><path d="M2 30 L2 22 L12 22 L12 14 L22 14 L22 10 L32 10 L32 18 L42 18 L42 30 Z" fill={B3} fillOpacity="0.3"/><polyline points="2,22 12,22 12,14 22,14 22,10 32,10 32,18 42,18" stroke={B3} strokeWidth="1.5" fill="none"/></svg>
  if (id==='pie')         return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><circle cx="22" cy="15" r="12" fill="#e0e0e0"/><path d="M22 15 L22 3 A12 12 0 0 1 34 15 Z" fill={B}/><path d="M22 15 L34 15 A12 12 0 0 1 18 26.4 Z" fill={R}/><path d="M22 15 L18 26.4 A12 12 0 0 1 22 3 Z" fill={B3}/></svg>
  if (id==='donut')       return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><circle cx="22" cy="15" r="12" fill="none" stroke={B} strokeWidth="7" strokeDasharray="30 48"/><circle cx="22" cy="15" r="12" fill="none" stroke={O} strokeWidth="7" strokeDasharray="20 58" strokeDashoffset="-30"/><circle cx="22" cy="15" r="5" fill="white"/></svg>
  if (id==='scatter')     return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><circle cx="8" cy="24" r="2" fill={B}/><circle cx="14" cy="14" r="2" fill={B}/><circle cx="22" cy="20" r="2" fill={B}/><circle cx="28" cy="10" r="2" fill={B}/><circle cx="36" cy="22" r="2" fill={O}/><circle cx="34" cy="6" r="2" fill={O}/></svg>
  if (id==='bubble')      return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><circle cx="10" cy="22" r="5" fill={B} fillOpacity="0.7"/><circle cx="22" cy="12" r="8" fill={B} fillOpacity="0.5"/><circle cx="36" cy="20" r="6" fill={O} fillOpacity="0.6"/></svg>
  if (id==='treemap')     return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="1" y="1" width="24" height="18" rx="1" fill={B}/><rect x="27" y="1" width="16" height="8" rx="1" fill={O}/><rect x="27" y="11" width="16" height="8" rx="1" fill={B3}/><rect x="1" y="21" width="11" height="8" rx="1" fill={G}/><rect x="14" y="21" width="29" height="8" rx="1" fill={R} fillOpacity="0.7"/></svg>
  if (id==='funnel')      return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="2" y="2" width="40" height="7" rx="2" fill={B}/><rect x="6" y="11" width="32" height="6" rx="2" fill={O}/><rect x="11" y="19" width="22" height="5" rx="2" fill={B3}/><rect x="16" y="26" width="12" height="3" rx="1.5" fill={G}/></svg>
  if (id==='sankey')      return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="1" y="3" width="5" height="24" rx="1" fill={B}/><rect x="38" y="2" width="5" height="12" rx="1" fill={O}/><rect x="38" y="17" width="5" height="11" rx="1" fill={B3}/><path d="M6 8 C18 8 26 6 38 6" stroke={B} strokeWidth="5" fill="none" opacity="0.4"/></svg>
  if (id==='gauge')       return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><path d="M6 26 A16 16 0 0 1 38 26" stroke="#e0e0e0" strokeWidth="5" fill="none" strokeLinecap="round"/><path d="M6 26 A16 16 0 0 1 30 12" stroke={B} strokeWidth="5" fill="none" strokeLinecap="round"/><line x1="22" y1="26" x2="30" y2="12" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/><circle cx="22" cy="26" r="2.5" fill="#333"/></svg>
  if (id==='waterfall')   return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="2" y="18" width="7" height="10" rx="1" fill={B}/><rect x="11" y="12" width="7" height="6" rx="1" fill={G}/><rect x="20" y="8" width="7" height="4" rx="1" fill={G}/><rect x="29" y="12" width="7" height="16" rx="1" fill={R}/></svg>
  if (id==='timeline')    return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="3" y="5" width="22" height="6" rx="2" fill={B}/><rect x="12" y="13" width="26" height="6" rx="2" fill={O}/><rect x="2" y="21" width="16" height="6" rx="2" fill={B3}/></svg>
  if (id==='bullet')      return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="2" y="8" width="40" height="14" rx="1" fill="#e0e0e0"/><rect x="2" y="11" width="28" height="8" rx="1" fill="#bdbdbd"/><rect x="2" y="13" width="20" height="4" rx="1" fill={B}/><line x1="32" y1="5" x2="32" y2="25" stroke="#333" strokeWidth="2" strokeLinecap="round"/></svg>
  if (id==='map')         return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><ellipse cx="22" cy="15" rx="18" ry="12" stroke="#e0e0e0" strokeWidth="1" fill="#e3f2fd"/><circle cx="24" cy="11" r="4" fill={B} fillOpacity="0.5"/><circle cx="16" cy="18" r="3" fill={B} fillOpacity="0.7"/><circle cx="30" cy="17" r="5" fill={B} fillOpacity="0.3"/></svg>
  return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="4" y="4" width="36" height="22" rx="2" stroke="#d0d0d0" strokeWidth="1.5" fill="none"/></svg>
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
  const [menuPos, setMenuPos] = useState<{top:number;left:number}>({top:0,left:0})
  const [activeRightPanel, setActiveRightPanel] = useState<string|null>(null)
  const [integrationSearch, setIntegrationSearch] = useState('')
  const [connection, setConnection] = useState<any>(null)
  const [checkingConn, setCheckingConn] = useState(true)
  const [ga4Data, setGa4Data] = useState<any>(null)
  const [loadingData, setLoadingData] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState('')
  const [selectedSite, setSelectedSite] = useState('')
  const [dateRange, setDateRange] = useState('30daysAgo')

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
    try { const v = localStorage.getItem(`alloy_widget_sizes_${clientId}`); return v ? JSON.parse(v) : {} } catch { return {} }
  })
  const [resizingId, setResizingId] = useState<string|null>(null)
  const [draggingId, setDraggingId] = useState<string|null>(null)
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

  const LS_DATE_KEY = `alloy_custom_date_${clientId}`
  const [activeFetchStart, setActiveFetchStart] = useState<string|null>(() => {
    try { const v = localStorage.getItem(`alloy_custom_date_${clientId}`); return v ? JSON.parse(v).start || null : null } catch { return null }
  })
  const [activeFetchEnd, setActiveFetchEnd] = useState<string|null>(() => {
    try { const v = localStorage.getItem(`alloy_custom_date_${clientId}`); return v ? JSON.parse(v).end || null : null } catch { return null }
  })
  const [showCalendarPicker, setShowCalendarPicker] = useState(false)
  const [calAnchorRef, setCalAnchorRef] = useState<{top:number;left:number}|null>(null)
  const [calStartView, setCalStartView] = useState(new Date(2026, 3, 1))
  const [calEndView,   setCalEndView]   = useState(new Date(2026, 4, 1))
  const [calTempStart, setCalTempStart] = useState('')
  const [calTempEnd,   setCalTempEnd]   = useState('')
  const [calClickCount, setCalClickCount] = useState(0)
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
  const [showCloneModal, setShowCloneModal] = useState(false)
  const [dashMenu, setDashMenu] = useState<string|null>(null)
  const [renamingDash, setRenamingDash] = useState<string|null>(null)
  const [renameValue, setRenameValue] = useState('')

  const LS_KEY = `alloy_dashboards_${clientId}`
  const LS_CLONED_KEY = `alloy_cloned_dashboards_${clientId}`
  const LS_WIDGETS_KEY = `alloy_widgets_${clientId}`
  const LS_ORDER_KEY = `alloy_widget_order_${clientId}`

  const [dashboards, setDashboards] = useState<string[]>(() => {
    if (typeof window === 'undefined') return INITIAL_DASHBOARDS
    try { const saved = localStorage.getItem(LS_KEY); return saved ? JSON.parse(saved) : INITIAL_DASHBOARDS } catch { return INITIAL_DASHBOARDS }
  })

  const [clonedDashboards, setClonedDashboards] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try { const saved = localStorage.getItem(LS_CLONED_KEY); return saved ? JSON.parse(saved) : [] } catch { return [] }
  })

  const DEFAULT_WIDGETS: Widget[] = [
    {id:'w1',title:'Total Sessions',dataSource:'google-analytics-4 / traffic-analytics',chartType:'sparkline',tooltip:'Total sessions during the selected period.',color:'white',value:'120.5 K',change:'29%',up:true},
    {id:'w2',title:'Total Conversions',dataSource:'google-analytics-4 / conversions',chartType:'column',tooltip:'Total conversions tracked.',color:'blue',value:'3,610',change:'16%',up:false},
    {id:'w3',title:'Referring Domains',dataSource:'google-analytics-4 / referring',chartType:'line',tooltip:'Unique domains sending traffic.',color:'white',value:'6,961',change:'',up:true},
    {id:'w4',title:'Engagement Rate',dataSource:'google-analytics-4 / engagement',chartType:'area',tooltip:'Percentage of engaged sessions.',color:'green',value:'60.77%',change:'3.97%',up:false},
    {id:'c1',title:'Sessions Over Time',dataSource:'google-analytics-4 / sessions',chartType:'line',tooltip:'Sessions over time.',color:'white',value:'',change:'',up:true},
    {id:'c2',title:'Engagement Score',dataSource:'google-analytics-4 / engagement',chartType:'donut',tooltip:'Engagement score gauge.',color:'white',value:'',change:'',up:true},
    {id:'c3',title:'Conversion Rate',dataSource:'google-analytics-4 / conversions',chartType:'scorecard',tooltip:'Conversion rate.',color:'white',value:'3%',change:'34%',up:false},
    {id:'bounce',title:'Bounce Rate',dataSource:'google-analytics-4 / bounce',chartType:'scorecard',tooltip:'Bounce rate.',color:'red',value:'39.23%',change:'6.84%',up:true},
    {id:'d1',title:'Users By Device',dataSource:'google-analytics-4 / devices',chartType:'column',tooltip:'Users by device category.',color:'white',value:'',change:'',up:true},
    {id:'d2',title:'Top Referral Sources',dataSource:'google-analytics-4 / sources',chartType:'donut',tooltip:'Traffic by referral source.',color:'white',value:'',change:'',up:true},
    {id:'d3',title:'Traffic by Cities',dataSource:'google-analytics-4 / cities',chartType:'bar',tooltip:'Traffic by city.',color:'white',value:'',change:'',up:true},
    {id:'v1',title:'Website Views',dataSource:'google-analytics-4 / views',chartType:'area',tooltip:'Website views over time.',color:'white',value:'',change:'',up:true},
  ]

  const [widgets, setWidgets] = useState<Widget[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_WIDGETS
    try {
      const saved = localStorage.getItem(LS_WIDGETS_KEY)
      if (saved) {
        const parsed: Widget[] = JSON.parse(saved)
        const defaults = DEFAULT_WIDGETS.map(def => {
          const saved_w = parsed.find((s: Widget) => s.id === def.id)
          if (!saved_w) return def
          return { ...def, ...saved_w, color: def.color, borderColor: undefined, bgHex: undefined, value: def.value, change: def.change, up: def.up }
        })
        const defaultIds = new Set(DEFAULT_WIDGETS.map(d => d.id))
        const dynamic = parsed.filter((s: Widget) => !defaultIds.has(s.id))
        return [...defaults, ...dynamic]
      }
    } catch {}
    return DEFAULT_WIDGETS
  })

  // ── Unified widget order — single source of truth for ALL widget positions ──
  const [widgetOrder, setWidgetOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`alloy_widget_order_${clientId}`)
      if (saved) return JSON.parse(saved)
    } catch {}
    return ALL_STATIC_IDS_ORDERED
  })

  // Keep widgetOrder in sync when dynamic widgets are added/removed
  useEffect(() => {
    setWidgetOrder(prev => {
      const dynamicIds = widgets
        .filter(w => !ALL_STATIC_IDS_ORDERED.includes(w.id))
        .map(w => w.id)
      const allIds = [...ALL_STATIC_IDS_ORDERED, ...dynamicIds]
      const existing = prev.filter(id => allIds.includes(id))
      const newIds = allIds.filter(id => !prev.includes(id))
      return [...existing, ...newIds]
    })
  }, [widgets])

  const LS_REMOVED_KEY = `alloy_removed_widgets_${clientId}`
  const [removedWidgetIds, setRemovedWidgetIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(`alloy_removed_widgets_${clientId}`)
      return saved ? new Set(JSON.parse(saved) as string[]) : new Set<string>()
    } catch { return new Set() }
  })

  const isWidgetRemoved = (id: string) => removedWidgetIds.has(id)
  const isEmptyDash = !REAL_DASHBOARDS.includes(activeDash) && !clonedDashboards.includes(activeDash)
  const STATIC_IDS = ['w1','w2','w3','w4','c1','c2','c3','d1','d2','d3','v1','bounce']

  // All IDs that are "chart cards" (not KPI scorecards)
  const CHART_CARD_IDS = ['c1','c2','c3','d1','d2','d3','v1']

  useEffect(() => {
    if (!clientName) {
      const urlParams = new URLSearchParams(window.location.search)
      const urlName = urlParams.get('name')
      const urlDomain = urlParams.get('domain')
      if (urlName) { setClientName(urlName); try { localStorage.setItem(`alloy_client_name_${clientId}`, urlName) } catch {} }
      else { const cached = localStorage.getItem(`alloy_client_name_${clientId}`); if (cached) setClientName(cached) }
      if (urlDomain) { setClientDomain(urlDomain); try { localStorage.setItem(`alloy_client_domain_${clientId}`, urlDomain) } catch {} }
      else { const cachedDomain = localStorage.getItem(`alloy_client_domain_${clientId}`); if (cachedDomain) setClientDomain(cachedDomain) }
    }
  }, [])

  async function saveSizesToDB(sizes: {[id:string]:{w:number;h:number}}) {
    try { localStorage.setItem(`alloy_widget_sizes_${clientId}`, JSON.stringify(sizes)) } catch {}
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const sb = createClient()
      await sb.from('dashboard_layouts').upsert({ client_id: clientId, key: 'widget_sizes', value: sizes, updated_at: new Date().toISOString() }, { onConflict: 'client_id,key' })
    } catch {}
  }

  function connectGoogle() { window.location.href = `/api/auth/google?state=${clientId}` }
  async function disconnect() {
    await fetch(`/api/connection?client_id=${clientId}`, { method: 'DELETE' })
    setConnection({ connected: false }); setGa4Data(null)
  }

  async function fetchGA4(propertyId?: string, startOverride?: string, endOverride?: string) {
    const pid = propertyId || selectedProperty
    if (!pid) return
    setLoadingData(true)
    try {
      const sd = startOverride || activeFetchStart || dateRange
      const ed = endOverride || activeFetchEnd || 'today'
      const res = await fetch(`/api/ga4?client_id=${clientId}&property_id=${pid}&start_date=${sd}&end_date=${ed}`)
      const data = await res.json()
      if (data.connected) {
        setGa4Data(data)
        const totalsRow = data.timeSeries?.totals?.[0]
        const sessions = parseInt(totalsRow?.metricValues?.[0]?.value || '0')
        const users = parseInt(totalsRow?.metricValues?.[1]?.value || '0')
        const conversions = parseInt(totalsRow?.metricValues?.[2]?.value || '0')
        const engagementRate = parseFloat(totalsRow?.metricValues?.[4]?.value || '0')
        setWidgets(prev => prev.map(w => {
          if (w.id === 'w1') return { ...w, value: formatNum(sessions) }
          if (w.id === 'w2') return { ...w, value: formatNum(conversions) }
          if (w.id === 'w3') return { ...w, value: formatNum(users) }
          if (w.id === 'w4') return { ...w, value: (engagementRate * 100).toFixed(2) + '%' }
          return w
        }))
      }
    } catch {}
    finally { setLoadingData(false) }
  }

  async function saveMapping() {
    setSavingMapping(true)
    try {
      await fetch('/api/mapping', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ client_id: clientId, ga4_property_id: mappingProp, ga4_property_name: mappingPropName, gsc_site_url: mappingSite }) })
      setSelectedProperty(mappingProp); fetchGA4(mappingProp)
      setMappingSaved(true)
      setTimeout(() => { setMappingSaved(false); setShowMappingModal(false) }, 1500)
    } catch {}
    setSavingMapping(false)
  }

  async function loadClientInfo() {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const sb = createClient()
      const { data } = await sb.from('clients').select('name,domain').eq('id', clientId).single()
      if (data) {
        setClientName(data.name); setClientDomain(data.domain || '')
        try { localStorage.setItem(`alloy_client_name_${clientId}`, data.name) } catch {}
        try { localStorage.setItem(`alloy_client_domain_${clientId}`, data.domain || '') } catch {}
      }
    } catch {}
  }

  async function checkConnection(): Promise<void> {
    setCheckingConn(true)
    try {
      const res = await fetch(`/api/connection?client_id=${clientId}`)
      const data = await res.json()
      setConnection(data)
      if (data.connected && data.ga4_properties?.length > 0) setSelectedProperty(data.ga4_properties[0].name)
    } catch { setConnection({ connected: false }) }
    finally { setCheckingConn(false) }
  }

  async function loadMapping() {
    try {
      const res = await fetch(`/api/mapping?client_id=${clientId}`)
      const data = await res.json()
      if (data.ga4_property_id) {
        setSelectedProperty(data.ga4_property_id); setMappingProp(data.ga4_property_id)
        setMappingPropName(data.ga4_property_name || ''); setMappingSite(data.gsc_site_url || '')
        fetchGA4(data.ga4_property_id)
      } else { fetchGA4() }
    } catch { fetchGA4() }
  }

  async function loadSizesFromDB() {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const sb = createClient()
      const { data } = await sb.from('dashboard_layouts').select('value').eq('client_id', clientId).eq('key', 'widget_sizes').single()
      if (data?.value) setWidgetSizes(prev => ({ ...data.value, ...prev }))
    } catch {}
  }

  async function loadGA4Events(startDate?: string, endDate?: string) {
    if (!connection?.connected || !selectedProperty) return
    const sd = startDate ?? activeFetchStart ?? dateRange
    const ed = endDate ?? activeFetchEnd ?? 'today'
    try {
      const res = await fetch(`/api/ga4/custom?client_id=${clientId}&property_id=${selectedProperty}&dimensions=eventName&metrics=eventCount&start_date=${sd}&end_date=${ed}`)
      const data = await res.json()
      if (data.rows) {
        setGa4EventRows(data.rows.map((r: any) => ({ d: r.dimensionValues?.[0]?.value, v: parseInt(r.metricValues?.[0]?.value || '0') })))
        setGa4EventNames(data.rows.map((r: any) => r.dimensionValues?.[0]?.value).filter(Boolean))
      }
    } catch {}
  }

  async function loadGA4Filters() {
    setLoadingFilters(true)
    try {
      if (connection?.connected && selectedProperty) {
        const res = await fetch(`/api/ga4/custom?client_id=${clientId}&property_id=${selectedProperty}&dimensions=sessionDefaultChannelGroup&metrics=sessions&start_date=${dateRange}&end_date=today`)
        const data = await res.json()
        if (data.rows) setGa4Filters(data.rows.map((r: any) => ({ name: r.dimensionValues?.[0]?.value, type: 'ga4' as const })))
      }
    } catch {}
    setLoadingFilters(false)
  }

  useEffect(() => {
    loadClientInfo(); checkConnection().then(() => loadMapping()); loadSizesFromDB()
  }, [clientId])

  useEffect(() => {
    if (editMode) document.body.classList.add('dashboard-edit-mode')
    else document.body.classList.remove('dashboard-edit-mode')
    return () => { document.body.classList.remove('dashboard-edit-mode') }
  }, [editMode])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try { localStorage.setItem(LS_KEY, JSON.stringify(dashboards)) } catch {}
  }, [dashboards])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try { localStorage.setItem(LS_CLONED_KEY, JSON.stringify(clonedDashboards)) } catch {}
  }, [clonedDashboards])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const toSave = widgets.map(w => ({
        id: w.id, title: w.title, tooltip: w.tooltip, chartType: w.chartType,
        color: w.color, textColor: w.textColor, borderColor: w.borderColor,
        bgHex: w.bgHex, showAnomalies: w.showAnomalies, showForecast: w.showForecast,
        showIntegIcon: w.showIntegIcon, showTitle: (w as any).showTitle,
        chartHeaderMode: (w as any).chartHeaderMode, headerFontColor: (w as any).headerFontColor,
        borderShadow: (w as any).borderShadow, borderWeight: (w as any).borderWeight,
        borderStyle: (w as any).borderStyle, borderRadius: (w as any).borderRadius,
        tableShowHeader: (w as any).tableShowHeader, tableRowNumbers: (w as any).tableRowNumbers,
        tableMissingData: (w as any).tableMissingData, tableFontSize: (w as any).tableFontSize,
        tableFontFamily: (w as any).tableFontFamily, tableHeaderBg: (w as any).tableHeaderBg,
        tableOddRow: (w as any).tableOddRow, tableEvenRow: (w as any).tableEvenRow,
        tableCellBorder: (w as any).tableCellBorder, dimAlign: (w as any).dimAlign,
        dimensions: (w as any).dimensions, metrics: (w as any).metrics, filters: (w as any).filters,
        dataSource: w.dataSource,
      }))
      localStorage.setItem(LS_WIDGETS_KEY, JSON.stringify(toSave))
    } catch {}
  }, [widgets])

  // Persist widget order
  useEffect(() => {
    if (typeof window === 'undefined') return
    try { localStorage.setItem(LS_ORDER_KEY, JSON.stringify(widgetOrder)) } catch {}
  }, [widgetOrder])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      if (activeFetchStart && activeFetchEnd) localStorage.setItem(LS_DATE_KEY, JSON.stringify({ start: activeFetchStart, end: activeFetchEnd }))
      else localStorage.removeItem(LS_DATE_KEY)
    } catch {}
  }, [activeFetchStart, activeFetchEnd])

  useEffect(() => {
    if (connection?.connected && selectedProperty && ga4EventRows.length === 0) {
      const needsEvents = widgets.some(w => { const dims: string[] = (w as any).dimensions || []; return dims.includes('Event Name') || dims.includes('eventName') })
      if (needsEvents) loadGA4Events(activeFetchStart ?? undefined, activeFetchEnd ?? undefined)
    }
  }, [widgets, connection, selectedProperty])

  useEffect(() => {
    function onDown(e: MouseEvent) {
      const t = e.target as HTMLElement
      if (!t.closest('.alloy-dropdown')) { setOpenMenu(null); setDashMenu(null) }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  // Computed GA4 data with static fallbacks
  const sessionData = ga4Data?.timeSeries?.rows?.map((r: any) => ({ d: r.dimensionValues[0].value.slice(4), v: parseInt(r.metricValues[0].value) })) || STATIC_SESSIONS
  const deviceData = ga4Data?.devices?.rows?.map((r: any) => ({ name: r.dimensionValues[0].value, v: parseInt(r.metricValues[0].value) })) || STATIC_DEVICES
  const sourceData = ga4Data?.sources?.rows?.map((r: any, i: number) => ({ name: r.dimensionValues[0].value, value: parseInt(r.metricValues[0].value), color: ['#2196f3','#64b5f6',ALLOY.blue3,'#bbdefb','#e3f2fd'][i%5] })) || STATIC_DONUT
  const cityData = ga4Data?.cities?.rows?.map((r: any) => ({ city: r.dimensionValues[0].value, val: parseInt(r.metricValues[0].value), pct: 100 })) || STATIC_CITIES
  const maxCity = Math.max(...cityData.map((c: any) => c.val), 1)

  function getWidgetData(w: Partial<Widget>): any[] {
    const ds = (w.dataSource || '').toLowerCase()
    const dims: string[] = (w as any).dimensions || []
    if (!ga4Data) return sessionData
    if (ds.includes('device') || dims.includes('Device Category') || dims.includes('deviceCategory')) return deviceData
    if (ds.includes('source') || ds.includes('channel') || dims.includes('Session Default Channel Group')) return sourceData
    if (ds.includes('city') || dims.includes('City')) return cityData.map((c: any) => ({ d: c.city, v: c.val }))
    if (ds.includes('event') || dims.includes('Event Name') || dims.includes('eventName')) return ga4EventRows
    if (ga4Data?.timeSeries?.rows) return sessionData
    return sessionData
  }

  const cloningRef = React.useRef(false)

  function startEdit(w: Widget) { setEditingWidget({...w}); setEditTab('General'); setOpenMenu(null); setActiveRightPanel(null) }
  function openDrill(w: Widget) { if (!editMode) { setDrillWidget(w); setDrillChannel('All') } }

  function cloneWidget(resolvedWidget: Widget) {
    if (cloningRef.current) return
    cloningRef.current = true
    setTimeout(() => { cloningRef.current = false }, 500)
    const cloneId = `w${Date.now()}`
    const cloned: Widget = { ...resolvedWidget, id: cloneId, title: `${resolvedWidget.title} (Copy)` }
    setWidgets(prev => {
      if (prev.some(w => w.id === cloneId)) return prev
      const updated = [...prev, cloned]
      try { localStorage.setItem(LS_WIDGETS_KEY, JSON.stringify(updated.map(w => ({ ...w, value: undefined, change: undefined, up: undefined })))) } catch {}
      return updated
    })
    setOpenMenu(null)
    setShareToast(`"${resolvedWidget.title}" cloned`)
    setTimeout(() => setShareToast(null), 2500)
    setTimeout(() => startEdit(cloned), 50)
  }

  // ── Unified Drag & Drop ──────────────────────────────────────────────────
  const dragSrcId = React.useRef<string|null>(null)

  function onDragStart(e: React.DragEvent, dragId: string) {
    if (!editMode) return
    dragSrcId.current = dragId
    setDraggingId(dragId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', dragId)
    setTimeout(() => {
      const card = document.querySelector(`[data-widget-id="${dragId}"]`) as HTMLElement | null
      if (card) { card.style.opacity = '0.3'; card.style.outline = `2px dashed ${ALLOY.green1}`; card.style.outlineOffset = '3px' }
    }, 0)
  }

  function onDragEnd(e: React.DragEvent) {
    // Clean up all highlights
    document.querySelectorAll('[data-widget-id]').forEach((el: Element) => {
      const h = el as HTMLElement
      h.style.opacity = ''; h.style.outline = ''; h.style.outlineOffset = ''; h.style.transform = ''; h.style.transition = ''
    })
    dragSrcId.current = null
    setDraggingId(null)
  }

  function onDragOver(e: React.DragEvent, overId: string) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (!dragSrcId.current || dragSrcId.current === overId) return
    const el = e.currentTarget as HTMLElement
    el.style.outline = `3px dashed ${ALLOY.green1}`
    el.style.outlineOffset = '3px'
    el.style.transform = 'scale(0.97)'
    el.style.transition = 'transform 0.1s'
  }

  function onDragLeave(e: React.DragEvent) {
    const el = e.currentTarget as HTMLElement
    el.style.outline = ''; el.style.outlineOffset = ''; el.style.transform = ''; el.style.transition = ''
  }

  function onDrop(e: React.DragEvent, toId: string) {
    e.preventDefault()
    const fromId = dragSrcId.current
    if (!fromId || fromId === toId) return
    const el = e.currentTarget as HTMLElement
    el.style.outline = ''; el.style.outlineOffset = ''; el.style.transform = ''; el.style.transition = ''

    // Update the unified widgetOrder array
    setWidgetOrder(prev => {
      const next = [...prev]
      const fi = next.indexOf(fromId)
      const ti = next.indexOf(toId)
      if (fi === -1 || ti === -1) return prev
      next.splice(fi, 1)
      next.splice(ti, 0, fromId)
      try { localStorage.setItem(LS_ORDER_KEY, JSON.stringify(next)) } catch {}
      return next
    })

    // Also reorder in widgets array (for dynamic widgets persistence)
    setWidgets(prev => {
      const ids = prev.map(w => w.id)
      const fi = ids.indexOf(fromId)
      const ti = ids.indexOf(toId)
      if (fi === -1 || ti === -1) return prev
      const next = [...ids]
      next.splice(fi, 1)
      next.splice(ti, 0, fromId)
      return next.map(id => prev.find(w => w.id === id)!).filter(Boolean)
    })
  }

  function addWidget(chartType: string, label: string) {
    const newId = `w${Date.now()}`
    const newWidget: Widget = {
      id: newId, title: label, dataSource: 'google-analytics-4 / sessions',
      chartType, tooltip: `${label} from Google Analytics`, color: 'white', value: '—', change: '', up: true,
    }
    setWidgets(prev => {
      const updated = [...prev, newWidget]
      try { localStorage.setItem(LS_WIDGETS_KEY, JSON.stringify(updated.map(w => ({ ...w, value: undefined, change: undefined, up: undefined })))) } catch {}
      return updated
    })
    setEditingWidget(newWidget); setEditTab('General')
  }

  function saveWidget() {
    if (!editingWidget) return
    setWidgets(prev => {
      const updated = prev.map(w => w.id===editingWidget.id ? editingWidget : w)
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

  // ── ResizeHandle ────────────────────────────────────────────────────────
  function ResizeHandle({ id }: { id: string }) {
    if (!editMode) return null
    const isResizing = resizingId === id
    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault(); e.stopPropagation()
      const el = (e.currentTarget as HTMLElement).closest('[data-widget-id]') as HTMLElement
      if (!el) return
      const rect = el.getBoundingClientRect()
      const startX = e.clientX, startY = e.clientY
      const startW = rect.width, startH = rect.height
      const overlay = document.createElement('div')
      overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;cursor:se-resize;user-select:none;'
      document.body.appendChild(overlay)
      const ghost = document.createElement('div')
      ghost.style.cssText = `position:fixed;border:2px dashed ${ALLOY.green1};background:rgba(32,187,113,0.05);border-radius:2px;pointer-events:none;z-index:99998;`
      ghost.innerHTML = `<div id="rz-label" style="position:absolute;bottom:8px;right:8px;font-size:10px;font-weight:700;color:${ALLOY.green1};background:rgba(255,255,255,0.96);padding:3px 7px;border-radius:2px;font-family:Barlow,sans-serif;letter-spacing:0.06em;"></div>`
      document.body.appendChild(ghost)
      const MIN_W = 180, MIN_H = 100
      const update = (mx: number, my: number) => {
        const nw = Math.max(MIN_W, startW + mx - startX)
        const nh = Math.max(MIN_H, startH + my - startY)
        ghost.style.left = rect.left + 'px'; ghost.style.top = rect.top + 'px'
        ghost.style.width = nw + 'px'; ghost.style.height = nh + 'px'
        const lbl = ghost.querySelector('#rz-label') as HTMLElement
        if (lbl) lbl.textContent = `${Math.round(nw)}w × ${Math.round(nh)}h`
        el.style.width = nw + 'px'; el.style.minWidth = nw + 'px'
        el.style.height = nh + 'px'; el.style.minHeight = nh + 'px'; el.style.flex = '0 0 auto'
      }
      update(startX, startY)
      setResizingId(id)
      const onMove = (mv: MouseEvent) => update(mv.clientX, mv.clientY)
      const onUp = (mv: MouseEvent) => {
        const nw = Math.max(MIN_W, startW + mv.clientX - startX)
        const nh = Math.max(MIN_H, startH + mv.clientY - startY)
        setWidgetSizes(prev => { const next = { ...prev, [id]: { w: nw, h: nh } }; saveSizesToDB(next); return next })
        setResizingId(null)
        document.body.removeChild(overlay); document.body.removeChild(ghost)
        window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp)
    }
    return (
      <div onMouseDown={handleMouseDown} title="Drag to resize"
        style={{ position:'absolute', bottom:0, right:0, width:28, height:28, cursor:'se-resize', zIndex:30, display:'flex', alignItems:'flex-end', justifyContent:'flex-end', padding:'5px', opacity: isResizing ? 1 : 0, transition:'opacity 0.15s' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
        onMouseLeave={e => { if (resizingId !== id) (e.currentTarget as HTMLElement).style.opacity = '0' }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 11 L11 1" stroke={isResizing ? ALLOY.green1 : ALLOY.mute} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M5 11 L11 5" stroke={isResizing ? ALLOY.green1 : ALLOY.mute} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M9 11 L11 9" stroke={isResizing ? ALLOY.green1 : ALLOY.mute} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    )
  }

  // ── Toggle ──────────────────────────────────────────────────────────────
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

  // ── WidgetDot (⋯ context menu) ──────────────────────────────────────────
  function WidgetDot({ wid, onEdit, onClone, widget }: { wid: string; onEdit: () => void; onClone: () => void; widget?: Widget }) {
    const isOpen = openMenu === wid
    const resolvedWidget: Widget | undefined = widget || (() => {
      const rawId = wid.startsWith('static__') ? wid.replace('static__', '') : wid
      return widgets.find(w => w.id === rawId)
    })()

    const handleEdit = () => { onEdit(); setOpenMenu(null) }
    const handleFullScreen = () => { setOpenMenu(null); if (resolvedWidget) setFullscreenWidget(resolvedWidget) }
    const handleCopy = () => {
      if (!resolvedWidget) return
      const text = JSON.stringify({ title: resolvedWidget.title, chartType: resolvedWidget.chartType, dataSource: resolvedWidget.dataSource, color: resolvedWidget.color, dimensions: (resolvedWidget as any).dimensions, metrics: (resolvedWidget as any).metrics, filters: (resolvedWidget as any).filters }, null, 2)
      const widgetTitle = resolvedWidget.title
      const doCopy = () => {
        const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText='position:fixed;top:-9999px;opacity:0'
        document.body.appendChild(ta); ta.focus(); ta.select()
        try { document.execCommand('copy') } catch {}
        document.body.removeChild(ta)
      }
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(() => { setOpenMenu(null); setShareToast(`"${widgetTitle}" config copied`); setTimeout(() => setShareToast(null), 2500) }).catch(doCopy)
      else { doCopy(); setOpenMenu(null); setShareToast(`"${widgetTitle}" config copied`); setTimeout(() => setShareToast(null), 2500) }
    }
    const handleClone = (e: React.MouseEvent) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); onClone() }
    const handleShare = () => {
      setOpenMenu(null)
      if (!resolvedWidget) return
      const rawId = wid.startsWith('static__') ? wid.replace('static__', '') : wid
      setShareCapture({ wid: rawId, title: resolvedWidget.title })
    }
    const handleRemove = () => {
      setOpenMenu(null)
      if (!resolvedWidget) return
      const rawId = wid.startsWith('static__') ? wid.replace('static__', '') : wid
      const isStatic = ALL_STATIC_IDS_ORDERED.includes(rawId)
      if (isStatic) {
        setRemovedWidgetIds(prev => { const next = new Set(Array.from(prev).concat(rawId)); try { localStorage.setItem(LS_REMOVED_KEY, JSON.stringify(Array.from(next))) } catch {}; return next })
      } else {
        setWidgets(prev => { const updated = prev.filter(w => w.id !== rawId); try { localStorage.setItem(LS_WIDGETS_KEY, JSON.stringify(updated.map(w => ({ ...w, value: undefined, change: undefined, up: undefined })))) } catch {}; return updated })
      }
      if (editingWidget?.id === rawId) setEditingWidget(null)
      setShareToast(`"${resolvedWidget.title}" removed`); setTimeout(() => setShareToast(null), 2500)
    }
    const openDrop = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      if (isOpen) { setOpenMenu(null); return }
      const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()
      const menuHeight = 260
      const spaceBelow = window.innerHeight - rect.bottom
      const top = spaceBelow < menuHeight ? rect.top - menuHeight + 4 : rect.bottom + 4
      setMenuPos({ top, left: Math.max(4, rect.right - 168) })
      setOpenMenu(wid)
    }

    const menuItemStyle = { display:'flex', alignItems:'center', gap:9, padding:'8px 14px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, cursor:'pointer', userSelect:'none' as const, borderLeft:'2px solid transparent' }
    const menuItemHover = (e: React.MouseEvent, color: string = ALLOY.green1) => { const el = e.currentTarget as HTMLDivElement; el.style.background=color==='red'?ALLOY.red4:ALLOY.green4; el.style.color=color==='red'?ALLOY.red1:ALLOY.green1; el.style.borderLeft=`2px solid ${color==='red'?ALLOY.red1:ALLOY.green1}` }
    const menuItemLeave = (e: React.MouseEvent, color: string = ALLOY.ink) => { const el = e.currentTarget as HTMLDivElement; el.style.background='none'; el.style.color=color; el.style.borderLeft='2px solid transparent' }

    return (
      <div style={{ position:'relative', display:'inline-flex' }}>
        <button onClick={openDrop} style={{ background:'rgba(255,255,255,0.92)', border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'2px 6px', cursor:'pointer', display:'flex', alignItems:'center' }}>
          <MoreHorizontal size={13} style={{ color:ALLOY.ink }}/>
        </button>
        {isOpen && typeof document !== 'undefined' && createPortal(
          <div className="alloy-dropdown" style={{ position:'fixed', top:menuPos.top, left:menuPos.left, background:ALLOY.white, border:`1px solid ${ALLOY.line}`, borderRadius:2, boxShadow:'0 4px 16px rgba(0,0,0,0.15)', padding:'4px 0', minWidth:168, zIndex:99999 }} onClick={e => e.stopPropagation()}>
            <div onClick={handleEdit} style={menuItemStyle} onMouseEnter={menuItemHover} onMouseLeave={menuItemLeave}><Edit size={12} strokeWidth={1.5} style={{ color:'inherit', flexShrink:0 }}/><span style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:'inherit' }}>Edit</span></div>
            <div onClick={handleFullScreen} style={menuItemStyle} onMouseEnter={menuItemHover} onMouseLeave={menuItemLeave}><Maximize2 size={12} strokeWidth={1.5} style={{ color:'inherit', flexShrink:0 }}/><span style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:'inherit' }}>Full Screen</span></div>
            <div onClick={handleCopy} style={menuItemStyle} onMouseEnter={menuItemHover} onMouseLeave={menuItemLeave}><Copy size={12} strokeWidth={1.5} style={{ color:'inherit', flexShrink:0 }}/><span style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:'inherit' }}>Copy</span></div>
            <div onClick={handleClone} style={menuItemStyle} onMouseEnter={menuItemHover} onMouseLeave={menuItemLeave}><LayoutGrid size={12} strokeWidth={1.5} style={{ color:'inherit', flexShrink:0 }}/><span style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:'inherit' }}>Clone</span></div>
            <div onClick={handleShare} style={menuItemStyle} onMouseEnter={menuItemHover} onMouseLeave={menuItemLeave}><Link2 size={12} strokeWidth={1.5} style={{ color:'inherit', flexShrink:0 }}/><span style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:'inherit' }}>Share</span></div>
            <div style={{ height:1, background:ALLOY.line, margin:'4px 0' }}/>
            <div onClick={handleRemove} style={{ ...menuItemStyle, color:ALLOY.red1 }} onMouseEnter={e => menuItemHover(e,'red')} onMouseLeave={e => menuItemLeave(e,ALLOY.red1)}><Trash2 size={12} strokeWidth={1.5} style={{ color:ALLOY.red1, flexShrink:0 }}/><span style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.red1 }}>Remove</span></div>
          </div>
        , document.body)}
      </div>
    )
  }

  // ── KPICard ─────────────────────────────────────────────────────────────
  function KPICard({ w }: { w: Widget }) {
    const c = KPI_BG[w.color] || KPI_BG.white
    const isWhite = w.color === 'white'
    const isSelected = editingWidget?.id === w.id
    const bgColor = w.bgHex || c.bg
    const borderCol = !editMode ? ALLOY.line : isSelected ? ALLOY.green1 : (w.borderColor || c.border)
    const selectedRing = isSelected && editMode ? { border:`2.5px solid ${ALLOY.green1}`, boxShadow:`0 0 0 4px ${ALLOY.green4}, 0 6px 24px rgba(32,187,113,0.22)` } : {}
    const textCol = w.textColor || c.text
    const isKpiType = !w.chartType || w.chartType === 'scorecard' || w.chartType === 'sparkline'

    const editControls = editMode ? (
      <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:6, right:6, zIndex:10, display:'flex', alignItems:'center', gap:4 }}>
        <button style={{ background:isWhite?'rgba(0,0,0,0.05)':'rgba(255,255,255,0.15)', border:'none', borderRadius:2, padding:'3px 5px', cursor:'pointer', display:'flex' }}>
          <Maximize2 size={10} style={{ color:isWhite?ALLOY.mute:'rgba(255,255,255,0.7)' }}/>
        </button>
        <WidgetDot wid={w.id} onEdit={() => startEdit(w)} onClone={() => cloneWidget(w)} widget={w}/>
      </div>
    ) : null

    // ── Grip handle — only in edit mode ──
    const gripHandle = editMode ? (
      <div style={{ position:'absolute', top:6, left:6, zIndex:5, opacity:0.4, pointerEvents:'none' }}>
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
          <circle cx="3" cy="3" r="1.2" fill={isWhite?ALLOY.mute:'rgba(255,255,255,0.6)'}/>
          <circle cx="7" cy="3" r="1.2" fill={isWhite?ALLOY.mute:'rgba(255,255,255,0.6)'}/>
          <circle cx="3" cy="7" r="1.2" fill={isWhite?ALLOY.mute:'rgba(255,255,255,0.6)'}/>
          <circle cx="7" cy="7" r="1.2" fill={isWhite?ALLOY.mute:'rgba(255,255,255,0.6)'}/>
          <circle cx="3" cy="11" r="1.2" fill={isWhite?ALLOY.mute:'rgba(255,255,255,0.6)'}/>
          <circle cx="7" cy="11" r="1.2" fill={isWhite?ALLOY.mute:'rgba(255,255,255,0.6)'}/>
        </svg>
      </div>
    ) : null

    if (!isKpiType) {
      const activeFilters: string[] = (w as any).filters || []
      const chartBorder = isSelected && editMode ? `2.5px solid ${ALLOY.green1}` : editMode ? `2px solid ${w.borderColor || ALLOY.line}` : `1px solid ${ALLOY.line}`
      return (
        <div data-widget-id={w.id}
          draggable={editMode}
          onDragStart={e => onDragStart(e, w.id)}
          onDragEnd={onDragEnd}
          onDragOver={e => onDragOver(e, w.id)}
          onDragLeave={onDragLeave}
          onDrop={e => onDrop(e, w.id)}
          onClick={e => { e.stopPropagation(); if (editMode) startEdit(w); else openDrill(w) }}
          style={{ background:ALLOY.white, borderRadius:2, padding:12, position:'relative', cursor: editMode ? 'grab' : 'default', transition: resizingId === w.id ? 'none' : 'border-color 0.15s, box-shadow 0.15s, opacity 0.15s', opacity: editMode && editingWidget && !isSelected ? 0.45 : 1, border: chartBorder, ...(isSelected && editMode ? { boxShadow:`0 0 0 4px ${ALLOY.green4}, 0 6px 24px rgba(32,187,113,0.22)` } : {}), ...(widgetSizes[w.id] ? { width: widgetSizes[w.id].w, minHeight: widgetSizes[w.id].h } : { width: 'calc(33.333% - 8px)', minWidth: 220 }) }}>
          {isSelected && editMode && <div className="alloy-editing-badge" style={{ position:'absolute', top:-12, left:10, zIndex:30, background:ALLOY.green1, color:ALLOY.white, fontFamily:ALLOY.fontLabel, fontSize:8, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', padding:'3px 8px', borderRadius:2, pointerEvents:'none', whiteSpace:'nowrap' }}>✦ Editing</div>}
          {gripHandle}
          {editControls}
          <ResizeHandle id={w.id}/>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
            {(w as any).chartHeaderMode !== 'Never show' && <span style={{ fontSize:12, color:(w as any).headerFontColor || ALLOY.mute, fontWeight:500, fontFamily:ALLOY.fontBody }}>{w.title}</span>}
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              {w.change && <span style={{ fontSize:10, fontWeight:700, padding:'2px 6px', borderRadius:2, color:w.up?ALLOY.green1:ALLOY.red1, background:w.up?ALLOY.green4:ALLOY.red4, fontFamily:ALLOY.fontLabel }}>{w.up?'▲':'▼'} {w.change}</span>}
              {connection?.connected && <span style={{ fontSize:9, color:ALLOY.green1, fontWeight:600, fontFamily:ALLOY.fontLabel }}>● Live</span>}
            </div>
          </div>
          {activeFilters.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:6 }}>
              {activeFilters.map((f: string, i: number) => <span key={i} style={{ fontSize:9, background:ALLOY.yellow4, color:ALLOY.yellow1, border:'1px solid #ffe0b2', borderRadius:999, padding:'2px 8px', display:'flex', alignItems:'center', gap:4, fontFamily:ALLOY.fontLabel }}><span>≡</span> {f}</span>)}
            </div>
          )}
          <DynamicChart chartType={w.chartType} data={getWidgetData(w)} height={activeFilters.length > 0 ? 80 : 90} dimensions={(w as any).dimensions} metrics={(w as any).metrics}/>
        </div>
      )
    }

    const wData = getWidgetData(w as any)
    const computedValue = wData.length > 0 ? wData.reduce((sum: number, d: any) => sum + (d.v || 0), 0) : null
    const displayValue = w.value && w.value !== '—' ? w.value : computedValue !== null ? (computedValue >= 1000000 ? (computedValue/1000000).toFixed(1)+'M' : computedValue >= 1000 ? (computedValue/1000).toFixed(1)+'K' : computedValue.toFixed(0)) : '—'

    return (
      <div data-widget-id={w.id} className={editMode ? '' : 'alloy-card-hover'}
        draggable={editMode}
        onDragStart={e => onDragStart(e, w.id)}
        onDragEnd={onDragEnd}
        onDragOver={e => onDragOver(e, w.id)}
        onDragLeave={onDragLeave}
        onDrop={e => onDrop(e, w.id)}
        onClick={e => { e.stopPropagation(); if (editMode) startEdit(w); else openDrill(w) }}
        style={{ background:bgColor, borderRadius:2, padding:16, position:'relative', cursor: editMode ? 'grab' : 'default', transition: resizingId === w.id ? 'none' : 'border-color 0.15s, box-shadow 0.15s, opacity 0.15s', opacity: editMode && editingWidget && !isSelected ? 0.45 : 1, border: editMode ? `2px solid ${borderCol}` : isWhite ? `1px solid ${ALLOY.line}` : '2px solid transparent', ...selectedRing, ...(widgetSizes[w.id] ? { width: widgetSizes[w.id].w, minHeight: widgetSizes[w.id].h } : { width: 'calc(25% - 8px)', minWidth: 180 }) }}>
        {isSelected && editMode && <div className="alloy-editing-badge" style={{ position:'absolute', top:-12, left:10, zIndex:30, background:ALLOY.green1, color:ALLOY.white, fontFamily:ALLOY.fontLabel, fontSize:8, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', padding:'3px 8px', borderRadius:2, pointerEvents:'none', whiteSpace:'nowrap' }}>✦ Editing</div>}
        {gripHandle}
        {editControls}
        <ResizeHandle id={w.id}/>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
          <span style={{ fontSize:12, color:c.sub, fontWeight:500, fontFamily:ALLOY.fontBody }}>{w.title}</span>
          {w.change && <span style={{ fontSize:10, fontWeight:700, marginLeft:8, padding:'2px 6px', borderRadius:2, fontFamily:ALLOY.fontLabel, color:isWhite?(w.up?ALLOY.green1:ALLOY.red1):'rgba(255,255,255,0.95)', background:isWhite?(w.up?ALLOY.green4:ALLOY.red4):'rgba(255,255,255,0.18)' }}>{w.up?'▲':'▼'} {w.change}</span>}
        </div>
        <p style={{ fontSize:30, fontWeight:700, color:textCol, letterSpacing:'-0.5px', lineHeight:1, fontFamily:ALLOY.fontDisplay }}>{displayValue}</p>
        {connection?.connected && <p style={{ fontSize:9, color:isWhite?ALLOY.green1:'rgba(255,255,255,0.7)', marginTop:4, fontFamily:ALLOY.fontLabel }}>● Live</p>}
        {w.chartType === 'sparkline' && <div style={{ marginTop:6 }}><DynamicChart chartType="sparkline" data={getWidgetData(w)} height={35} dimensions={(w as any).dimensions} metrics={(w as any).metrics}/></div>}
      </div>
    )
  }

  // ── ChartCard — now uses unified drag handlers ──────────────────────────
  function ChartCard({ id, children }: { id: string; children: React.ReactNode }) {
    const w = widgets.find(x => x.id === id) ?? { id, title: id, chartType: 'line', color: 'white', tooltip: '', dataSource: '', value: '', change: '', up: true } as Widget
    const isSelected = editingWidget?.id === id
    const sz = widgetSizes[id]
    return (
      <div data-widget-id={id}
        draggable={editMode}
        onDragStart={e => onDragStart(e, id)}
        onDragEnd={onDragEnd}
        onDragOver={e => onDragOver(e, id)}
        onDragLeave={onDragLeave}
        onDrop={e => onDrop(e, id)}
        onClick={e => { e.stopPropagation(); if (editMode) startEdit(w); else openDrill(w) }}
        style={{ background:ALLOY.white, borderRadius:2, padding:16, position:'relative', cursor: editMode ? 'grab' : 'default', transition: resizingId === id ? 'none' : 'border-color 0.15s, box-shadow 0.15s, opacity 0.15s', opacity: editMode && editingWidget && !isSelected ? 0.45 : 1, ...(isSelected && editMode ? { border:`2.5px solid ${ALLOY.green1}`, boxShadow:`0 0 0 4px ${ALLOY.green4}, 0 6px 24px rgba(32,187,113,0.22)` } : { border:`2px solid ${ALLOY.line}` }), ...(sz ? { width: sz.w, minHeight: sz.h } : { width: 'calc(33.333% - 8px)', minWidth: 220 }) }}>
        {isSelected && editMode && <div className="alloy-editing-badge" style={{ position:'absolute', top:-12, left:10, zIndex:30, background:ALLOY.green1, color:ALLOY.white, fontFamily:ALLOY.fontLabel, fontSize:8, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', padding:'3px 8px', borderRadius:2, pointerEvents:'none', whiteSpace:'nowrap' }}>✦ Editing</div>}
        {/* Grip icon */}
        {editMode && (
          <div style={{ position:'absolute', top:6, left:6, zIndex:5, opacity:0.4, pointerEvents:'none' }}>
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
              <circle cx="3" cy="3" r="1.2" fill={ALLOY.mute}/><circle cx="7" cy="3" r="1.2" fill={ALLOY.mute}/>
              <circle cx="3" cy="7" r="1.2" fill={ALLOY.mute}/><circle cx="7" cy="7" r="1.2" fill={ALLOY.mute}/>
              <circle cx="3" cy="11" r="1.2" fill={ALLOY.mute}/><circle cx="7" cy="11" r="1.2" fill={ALLOY.mute}/>
            </svg>
          </div>
        )}
        {editMode && (
          <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:6, right:6, zIndex:10, display:'flex', alignItems:'center', gap:4 }}>
            <button style={{ background:'rgba(0,0,0,0.04)', border:'none', borderRadius:2, padding:'3px 5px', cursor:'pointer', display:'flex' }}><Maximize2 size={10} style={{ color:ALLOY.mute }}/></button>
            <WidgetDot wid={id} onEdit={() => startEdit(w)} onClone={() => cloneWidget(w)} widget={w}/>
          </div>
        )}
        <ResizeHandle id={id}/>
        {children}
      </div>
    )
  }

  return (
    <>
    <style>{`
      @keyframes alloy-fadein    { from { opacity:0 } to { opacity:1 } }
      @keyframes alloy-slideup   { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
      @keyframes alloy-slidedown { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:translateY(0) } }
      @keyframes alloy-slidein-right { from { opacity:0; transform:translateX(18px) } to { opacity:1; transform:translateX(0) } }
      @keyframes alloy-slidein-left  { from { opacity:0; transform:translateX(-18px) } to { opacity:1; transform:translateX(0) } }
      @keyframes alloy-scalein   { from { opacity:0; transform:scale(0.96) } to { opacity:1; transform:scale(1) } }
      @keyframes alloy-toast     { from { opacity:0; transform:translateX(-50%) translateY(12px) } to { opacity:1; transform:translateX(-50%) translateY(0) } }
      @keyframes alloy-spin      { to { transform:rotate(360deg) } }

      .alloy-fadein       { animation: alloy-fadein       0.18s ease both }
      .alloy-slideup      { animation: alloy-slideup      0.22s cubic-bezier(0.16,1,0.3,1) both }
      .alloy-slidedown    { animation: alloy-slidedown    0.18s ease both }
      .alloy-slidein-r    { animation: alloy-slidein-right 0.22s cubic-bezier(0.16,1,0.3,1) both }
      .alloy-scalein      { animation: alloy-scalein      0.18s cubic-bezier(0.16,1,0.3,1) both }
      .alloy-toast-in     { animation: alloy-toast        0.28s cubic-bezier(0.16,1,0.3,1) both }
      .alloy-card-hover { transition: box-shadow 0.18s ease, transform 0.18s ease, opacity 0.18s ease, border-color 0.15s ease !important }
      .alloy-card-hover:hover:not([data-editing]) { box-shadow: 0 4px 16px rgba(0,0,0,0.10) !important; transform: translateY(-1px) }
      .alloy-nav-item { transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease !important }
      .alloy-btn { transition: background 0.15s ease, opacity 0.15s ease, transform 0.1s ease !important }
      .alloy-btn:active { transform: scale(0.97) !important }
      .alloy-tab { transition: color 0.15s ease, border-bottom-color 0.15s ease !important }
      .alloy-dropdown { animation: alloy-slidedown 0.16s cubic-bezier(0.16,1,0.3,1) both }
      .alloy-modal-bg { animation: alloy-fadein 0.18s ease both }
      .alloy-modal-card { animation: alloy-scalein 0.22s cubic-bezier(0.16,1,0.3,1) both }
      .alloy-editing-badge { animation: alloy-scalein 0.2s cubic-bezier(0.16,1,0.3,1) both }
      @keyframes alloy-pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
      .alloy-loading { animation: alloy-pulse 1.2s ease-in-out infinite }
      .alloy-spin { animation: alloy-spin 0.8s linear infinite }

      /* ── Drag & Drop ── */
      [data-widget-id][draggable="true"] { cursor: grab !important; user-select: none; }
      [data-widget-id][draggable="true"]:active { cursor: grabbing !important; }

      /* Drag over target highlight */
      .alloy-drag-over { outline: 3px dashed ${ALLOY.green1} !important; outline-offset: 3px; background: rgba(32,187,113,0.04) !important; }

      /* Grip icon fades in on hover in edit mode */
      .dashboard-edit-mode [data-widget-id] > svg.grip-icon { opacity: 0; transition: opacity 0.15s; }
      .dashboard-edit-mode [data-widget-id]:hover > svg.grip-icon { opacity: 0.6; }

      /* Show resize handle on hover */
      [data-widget-id]:hover > div[title="Drag to resize"] { opacity: 0.6 !important }
      [data-widget-id]:hover > div[title="Drag to resize"]:hover { opacity: 1 !important }

      /* Edit mode: dim non-selected widgets */
      .dashboard-edit-mode [data-widget-id] { transition: opacity 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease; }
    `}</style>

    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden', background:ALLOY.white, fontFamily:ALLOY.fontBody }}>

      {/* ── Edit mode top bars ── */}
      {editMode && (
        <>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 16px', borderBottom:`1px solid ${ALLOY.line}`, background:ALLOY.white, flexShrink:0 }}>
            <span style={{ fontSize:14, fontWeight:700, color:ALLOY.ink, fontFamily:ALLOY.fontDisplay }}>Dashboard</span>
            <div style={{ width:1, height:16, background:ALLOY.line }}/>
            <div style={{ width:24, height:24, borderRadius:2, overflow:'hidden', background:ALLOY.paper, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {clientDomain ? <img src={`https://www.google.com/s2/favicons?domain=${clientDomain}&sz=64`} alt={clientName} style={{ width:20, height:20, objectFit:'contain' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display='none' }}/> : <span style={{ fontSize:11, fontWeight:700, color:ALLOY.mute, fontFamily:ALLOY.fontLabel }}>{clientName?.[0]?.toUpperCase() || ''}</span>}
            </div>
            <span style={{ fontSize:13, fontWeight:600, color:ALLOY.ink, fontFamily:ALLOY.fontBody }}>{clientName}</span>
            <span style={{ fontSize:11, background:ALLOY.paper, color:ALLOY.mute, padding:'2px 8px', borderRadius:2, fontFamily:ALLOY.fontLabel, letterSpacing:'0.06em', textTransform:'uppercase' }}>Client</span>
            <button onClick={() => { setEditMode(false); setEditingWidget(null); setOpenMenu(null) }}
              style={{ marginLeft:'auto', width:28, height:28, borderRadius:'50%', background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <X size={14} style={{ color:ALLOY.ink }}/>
            </button>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderBottom:`1px solid ${ALLOY.line}`, background:ALLOY.white, flexShrink:0 }}>
            <div style={{ display:'flex', gap:1, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:2 }}>
              <button onClick={() => setLiveData(true)} style={{ padding:'5px 14px', borderRadius:2, fontSize:9, fontWeight:700, fontFamily:ALLOY.fontLabel, letterSpacing:'0.06em', textTransform:'uppercase', background:liveData?ALLOY.blue1:'transparent', color:liveData?ALLOY.white:ALLOY.mute, border:'none', cursor:'pointer' }}>Live Data</button>
              <button onClick={() => setLiveData(false)} style={{ padding:'5px 14px', borderRadius:2, fontSize:9, fontWeight:700, fontFamily:ALLOY.fontLabel, letterSpacing:'0.06em', textTransform:'uppercase', background:!liveData?ALLOY.white:'transparent', color:!liveData?ALLOY.ink:ALLOY.mute, border:'none', cursor:'pointer' }}>Sample Data</button>
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

      {/* ── View mode topbar ── */}
      {!editMode && (
        <div style={{ padding:'10px 20px', borderBottom:`1px solid ${ALLOY.line}`, background:ALLOY.white, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <Link href="/dashboard/clients" style={{ fontSize:12, color:ALLOY.mute, textDecoration:'none', fontWeight:500, fontFamily:ALLOY.fontBody }}>Clients</Link>
            <ChevronRight size={12} style={{ color:ALLOY.line }}/>
            <div style={{ display:'flex', alignItems:'center', gap:8, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'5px 10px' }}>
              <div style={{ width:20, height:20, borderRadius:3, overflow:'hidden', background:ALLOY.line, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {clientDomain ? <img src={`https://www.google.com/s2/favicons?domain=${clientDomain}&sz=64`} alt={clientName} style={{ width:'100%', height:'100%', objectFit:'contain' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display='none' }}/> : <span style={{ fontSize:10, fontWeight:700, color:ALLOY.mute, fontFamily:ALLOY.fontLabel }}>{clientName?.[0]?.toUpperCase() || ''}</span>}
              </div>
              <span style={{ fontSize:13, fontWeight:700, color:ALLOY.ink, maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontFamily:ALLOY.fontDisplay }}>{clientName || '...'}</span>
              <ChevronDown size={12} style={{ color:ALLOY.mute }}/>
            </div>
            <ChevronRight size={12} style={{ color:ALLOY.line }}/>
            <span style={{ fontSize:12, color:ALLOY.blue1, fontWeight:600, fontFamily:ALLOY.fontBody }}>{activeDash}</span>
            {!checkingConn && (
              connection?.connected ? (
                <div style={{ display:'flex', alignItems:'center', gap:6, background:ALLOY.green4, border:'1px solid #20BB71', borderRadius:999, padding:'3px 10px' }}>
                  <CheckCircle2 size={11} style={{ color:ALLOY.green1 }}/>
                  <span style={{ fontSize:11, color:ALLOY.green1, fontWeight:600, fontFamily:ALLOY.fontBody }}>{connection.email}</span>
                  <button onClick={disconnect} style={{ background:'none', border:'none', color:ALLOY.mute, cursor:'pointer', fontSize:11, marginLeft:4, fontFamily:ALLOY.fontBody }}>✕</button>
                </div>
              ) : (
                <button onClick={connectGoogle} style={{ display:'flex', alignItems:'center', gap:6, background:ALLOY.green1, border:'none', borderRadius:2, padding:'4px 12px', color:ALLOY.ink, fontSize:9, fontWeight:700, cursor:'pointer', fontFamily:ALLOY.fontLabel, letterSpacing:'0.06em', textTransform:'uppercase' }}>
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
              <button key={tab} onClick={() => setActiveTab(tab)} className="alloy-tab" style={{ padding:'8px 14px', fontFamily:ALLOY.fontBody, fontSize:12, fontWeight:500, cursor:'pointer', background:'none', border:'none', color:activeTab===tab?ALLOY.blue1:ALLOY.mute, borderBottom:activeTab===tab?`2px solid ${ALLOY.blue1}`:'2px solid transparent' }}>{tab}</button>
            ))}
            <div style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center' }}>
              {connection?.connected && connection.ga4_properties?.length > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <select value={selectedProperty} onChange={e => { setSelectedProperty(e.target.value); fetchGA4(e.target.value) }}
                    style={{ background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'5px 10px', fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.ink, maxWidth:200 }}>
                    {connection.ga4_properties.map((p: any) => <option key={p.name} value={p.name}>{p.displayName||p.name}</option>)}
                  </select>
                  <button onClick={() => { setMappingProp(selectedProperty); setShowMappingModal(true) }}
                    style={{ background: mappingPropName?ALLOY.green4:'#fff7ed', border:`1px solid ${mappingPropName?ALLOY.green1:ALLOY.yellow1}`, borderRadius:2, padding:'5px 8px', cursor:'pointer', fontFamily:ALLOY.fontBody, fontSize:11, color:mappingPropName?ALLOY.green1:'#f59e0b', fontWeight:600, whiteSpace:'nowrap' }}>
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
              {connection?.connected && <button onClick={() => fetchGA4()} disabled={loadingData} style={{ background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'6px 8px', cursor:'pointer', display:'flex' }}><RefreshCw size={13} style={{ color:ALLOY.mute }}/></button>}
              {/* Share button */}
              <div style={{ position:'relative' }}>
                <button onClick={e => { e.stopPropagation(); setShowShareMenu(v => !v); setShareSubmenu(null); setShareEmailInput(''); setShareLinkCopied(false) }}
                  style={{ display:'flex', alignItems:'center', gap:5, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'6px 12px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, cursor:'pointer' }}>
                  Share <ChevronDown size={11} style={{ color:ALLOY.mute }}/>
                </button>
                {showShareMenu && (
                  <>
                    <div style={{ position:'fixed', inset:0, zIndex:1000 }} onClick={() => { setShowShareMenu(false); setShareSubmenu(null) }}/>
                    <div className="alloy-dropdown" style={{ position:'absolute', right:0, top:'calc(100% + 3px)', zIndex:1001, background:ALLOY.white, border:`1px solid ${ALLOY.line}`, borderRadius:2, boxShadow:'0 2px 12px rgba(0,0,0,0.08)', minWidth:260, overflow:'hidden' }} onClick={e => e.stopPropagation()}>
                      {!shareSubmenu && (
                        <div>
                          {[{id:'pdf',Icon:Download,label:'Download PDF',arrow:true},{id:'email',Icon:Mail,label:'Email',arrow:true},{id:'link',Icon:Link2,label:'Share Link',arrow:true},{id:'tpl',Icon:LayoutGrid,label:'Save Section as Template',arrow:false},{id:'report',Icon:Plus,label:'Add To Report',arrow:false,accent:true}].map(({ id, Icon, label, arrow, accent }, idx) => (
                            <React.Fragment key={id}>
                              {idx === 3 && <div style={{ height:1, background:ALLOY.line }}/>}
                              <div onClick={() => {
                                if (id === 'pdf' || id === 'email' || id === 'link') { setShareSubmenu(id as any) }
                                else { setShowShareMenu(false); setShareToast(`"${activeDash}" ${id === 'tpl' ? 'saved as template' : 'added to report'}`); setTimeout(() => setShareToast(null), 3000) }
                              }}
                                style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'8px 14px', fontFamily:ALLOY.fontBody, fontSize:12, color:accent?ALLOY.green1:ALLOY.ink, cursor:'pointer', userSelect:'none' }}
                                onMouseEnter={e => { const el=e.currentTarget as HTMLDivElement; el.style.background=ALLOY.green4; el.style.color=ALLOY.green1 }}
                                onMouseLeave={e => { const el=e.currentTarget as HTMLDivElement; el.style.background='none'; el.style.color=accent?ALLOY.green1:ALLOY.ink }}>
                                <Icon size={13} style={{ color:accent?ALLOY.green1:ALLOY.mute, flexShrink:0 }} strokeWidth={1.5}/>
                                <span style={{ flex:1 }}>{label}</span>
                                {arrow && <ChevronRight size={11} style={{ color:ALLOY.mute }}/>}
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                      {shareSubmenu && (
                        <div>
                          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderBottom:`1px solid ${ALLOY.line}`, background:ALLOY.paper }}>
                            <button onClick={() => setShareSubmenu(null)} style={{ display:'flex', alignItems:'center', justifyContent:'center', width:22, height:22, background:ALLOY.white, border:`1px solid ${ALLOY.line}`, borderRadius:2, cursor:'pointer' }}><ChevronLeft size={12} style={{ color:ALLOY.ink }}/></button>
                            <span style={{ fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.12em', color:ALLOY.mute }}>{shareSubmenu === 'pdf' ? 'Download PDF' : shareSubmenu === 'email' ? 'Email' : 'Share Link'}</span>
                          </div>
                          {shareSubmenu === 'link' && (
                            <div style={{ padding:'10px 14px' }}>
                              <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:8 }}>
                                <div style={{ flex:1, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'7px 10px', fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.mute, background:ALLOY.paper, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{typeof window !== 'undefined' ? window.location.href : ''}</div>
                                <button onClick={() => { navigator.clipboard.writeText(window.location.href).then(() => { setShareLinkCopied(true); setTimeout(() => setShareLinkCopied(false), 2000) }) }} style={{ flexShrink:0, background:shareLinkCopied?ALLOY.green1:ALLOY.ink, border:'none', borderRadius:2, padding:'7px 12px', fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:700, color:ALLOY.white, cursor:'pointer', whiteSpace:'nowrap' }}>{shareLinkCopied ? '✓ Copied' : 'Copy'}</button>
                              </div>
                            </div>
                          )}
                          {shareSubmenu === 'email' && (
                            <div style={{ padding:'10px 14px' }}>
                              <input type="email" value={shareEmailInput} onChange={e => setShareEmailInput(e.target.value)} placeholder="name@company.com" style={{ width:'100%', border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'7px 10px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, outline:'none', background:ALLOY.paper, boxSizing:'border-box', marginBottom:8 }}/>
                              <button onClick={() => { const url=window.location.href; window.open(`mailto:${shareEmailInput}?subject=${encodeURIComponent(`${clientName} — ${activeDash}`)}&body=${encodeURIComponent(`View: ${url}`)}`); setShowShareMenu(false) }} style={{ width:'100%', background:ALLOY.blue1, border:'none', borderRadius:2, padding:'8px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.white, cursor:'pointer', fontWeight:600 }}>Send Email</button>
                            </div>
                          )}
                          {shareSubmenu === 'pdf' && (
                            <div style={{ padding:'4px 0' }}>
                              {['Download Current Section','Download My Dashboards'].map(label => (
                                <div key={label} onClick={() => { setShowShareMenu(false); setShareSubmenu(null); window.print() }} style={{ padding:'8px 14px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, cursor:'pointer' }} onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background=ALLOY.green4} onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background='none'}>{label}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              <button style={{ background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'6px 8px', cursor:'pointer' }}><Maximize2 size={13}/></button>
              <button onClick={() => setEditMode(true)} style={{ background:ALLOY.green1, border:'none', borderRadius:2, padding:'6px 16px', fontSize:11, color:ALLOY.ink, cursor:'pointer', fontWeight:700, fontFamily:ALLOY.fontLabel, letterSpacing:'0.06em', textTransform:'uppercase' }}>Edit Dashboards</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        {/* ── Left sidebar ── */}
        <div style={{ width:220, minWidth:220, borderRight:`1px solid ${ALLOY.line}`, display:'flex', flexDirection:'column', background:ALLOY.white }}>
          <div style={{ padding:12 }}>
            <button onClick={() => {
                const untitledCount = dashboards.filter(d => d.startsWith('Untitled Dashboard')).length
                const newName = untitledCount === 0 ? 'Untitled Dashboard' : 'Untitled Dashboard ' + (untitledCount + 1)
                setDashboards(prev => [...prev, newName]); setActiveDash(newName)
              }}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:6, background:ALLOY.green1, border:'none', borderRadius:2, padding:'8px 12px', color:ALLOY.ink, fontSize:11, fontWeight:700, fontFamily:ALLOY.fontLabel, letterSpacing:'0.05em', textTransform:'uppercase', cursor:'pointer' }}>
              <Plus size={13}/> {editMode ? 'Add blank dashboard' : 'Add Dashboard'}
            </button>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {dashboards.map(d => (
              <div key={d} style={{ position:'relative' }}>
                {renamingDash === d ? (
                  <div style={{ display:'flex', alignItems:'center', padding:'6px 10px', gap:6 }}>
                    <input autoFocus value={renameValue} onChange={e => setRenameValue(e.target.value)}
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
                      style={{ flex:1, fontSize:13, border:'1px solid #48b5ea', borderRadius:2, padding:'4px 8px', outline:'none', color:ALLOY.ink, fontFamily:ALLOY.fontBody }}/>
                  </div>
                ) : (
                  <div style={{ display:'flex', alignItems:'center', padding:'0 4px 0 0', background: activeDash===d ? ALLOY.green4 : 'transparent', borderLeft: activeDash===d ? `3px solid ${ALLOY.green1}` : '3px solid transparent' }}
                    onMouseEnter={e => { if (activeDash!==d) (e.currentTarget as HTMLDivElement).style.background=ALLOY.paper }}
                    onMouseLeave={e => { if (activeDash!==d) (e.currentTarget as HTMLDivElement).style.background='transparent' }}>
                    <button onClick={() => setActiveDash(d)} style={{ flex:1, textAlign:'left', padding:'8px 8px 8px 12px', fontSize:12, cursor:'pointer', background:'none', border:'none', fontFamily:ALLOY.fontBody, fontWeight:activeDash===d?600:400, color:activeDash===d?ALLOY.ink:ALLOY.mute, display:'flex', alignItems:'center', gap:6 }}>
                      {editMode && <Grip size={12} style={{ color:ALLOY.line, flexShrink:0 }}/>}
                      <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d}</span>
                    </button>
                    <button onClick={e => { e.stopPropagation(); setDashMenu(dashMenu === d ? null : d) }}
                      style={{ flexShrink:0, width:24, height:24, display:'flex', alignItems:'center', justifyContent:'center', background:'none', border:'none', cursor:'pointer', borderRadius:2, opacity:0.4 }}
                      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity='1'}
                      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = dashMenu===d?'1':'0.4'}>
                      <MoreHorizontal size={14} style={{ color:ALLOY.ink }}/>
                    </button>
                  </div>
                )}
                {dashMenu === d && (
                  <div onClick={e => e.stopPropagation()} style={{ position:'absolute', left:8, top:'calc(100% + 2px)', background:ALLOY.white, border:`1px solid ${ALLOY.line}`, borderRadius:2, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', padding:4, minWidth:200, zIndex:500 }}>
                    {[{icon:'✏️',label:'Edit',action:()=>{setActiveDash(d);setEditMode(true);setDashMenu(null)}},{icon:'✍️',label:'Rename',action:()=>{setRenamingDash(d);setRenameValue(d);setDashMenu(null)}},{icon:'⧉',label:'Clone',action:()=>{const n=d+' (Copy)';setDashboards(prev=>[...prev,n]);setClonedDashboards(prev=>[...prev,n]);setActiveDash(n);setDashMenu(null)}},{icon:'💾',label:'Save as Template',action:()=>setDashMenu(null)}].map(item => (
                      <button key={item.label} onClick={item.action} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'8px 14px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, background:'none', border:'none', cursor:'pointer', borderRadius:2, textAlign:'left' }}>
                        {item.icon} <span>{item.label}</span>
                      </button>
                    ))}
                    <div style={{ height:1, background:ALLOY.paper, margin:'2px 0' }}/>
                    <button onClick={() => { const remaining=dashboards.filter(x=>x!==d); setDashboards(remaining); setClonedDashboards(prev=>prev.filter(x=>x!==d)); if(activeDash===d) setActiveDash(remaining[0]||''); setDashMenu(null) }}
                      style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'8px 14px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.red1, background:'none', border:'none', cursor:'pointer', borderRadius:2 }}>
                      🗑️ <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div style={{ padding:'10px 16px 4px' }}>
              <p style={{ fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, color:ALLOY.mute, textTransform:'uppercase', letterSpacing:'0.1em' }}>DATA SOURCES</p>
            </div>
            {DATA_SOURCES.map(s => (
              <button key={s} onClick={() => setOpenSrc(p => { const n = new Set(p); n.has(s)?n.delete(s):n.add(s); return n })}
                style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:8, padding:'7px 16px', fontFamily:ALLOY.fontBody, fontSize:12, cursor:'pointer', background:'none', border:'none', color:ALLOY.ink }}>
                <ChevronRight size={12} style={{ transform:openSrc.has(s)?'rotate(90deg)':'none', transition:'0.15s', color:ALLOY.mute }}/>{s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main canvas ── */}
        <div id="alloy-canvas"
          style={{ flex:1, display:'flex', flexDirection:'column', overflowY: isEmptyDash ? 'hidden' : 'auto', background:ALLOY.paper }}
          onClick={() => { if (editingWidget) setEditingWidget(null) }}>
          <div style={{ padding:'14px 20px', borderBottom:`1px solid ${ALLOY.line}`, background:ALLOY.white, display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:16, height:16, border:`2px solid ${ALLOY.ink}`, borderRadius:2 }}/>
            <span style={{ fontSize:14, fontWeight:700, color:ALLOY.ink, fontFamily:ALLOY.fontDisplay }}>{activeDash}</span>
            {loadingData && <span style={{ fontSize:11, color:ALLOY.blue1, marginLeft:8, fontFamily:ALLOY.fontBody }}>↻ Loading...</span>}
            {connection?.connected && !loadingData && !isEmptyDash && <span style={{ fontSize:11, color:ALLOY.green1, marginLeft:8, fontFamily:ALLOY.fontLabel }}>● Live GA4 data</span>}
            {editMode && !isEmptyDash && (
              <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6, background:ALLOY.green4, border:`1px solid ${ALLOY.green1}`, borderRadius:2, padding:'4px 10px' }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="3" cy="2" r="1" fill={ALLOY.green1}/><circle cx="7" cy="2" r="1" fill={ALLOY.green1}/>
                  <circle cx="3" cy="6" r="1" fill={ALLOY.green1}/><circle cx="7" cy="6" r="1" fill={ALLOY.green1}/>
                  <circle cx="3" cy="10" r="1" fill={ALLOY.green1}/><circle cx="7" cy="10" r="1" fill={ALLOY.green1}/>
                </svg>
                <span style={{ fontSize:9, fontWeight:700, color:ALLOY.green1, fontFamily:ALLOY.fontLabel, letterSpacing:'0.08em' }}>DRAG TO REORDER WIDGETS</span>
              </div>
            )}
          </div>

          {isEmptyDash ? (
            <div style={{ flex:1, display:'flex' }}>
              <NewDashCanvas onClone={() => setShowCloneModal(true)} />
            </div>
          ) : (
            <div style={{ padding:16 }}>
              <div style={{ background:ALLOY.ink, borderRadius:2, padding:'18px 24px', marginBottom:12 }}>
                <h2 style={{ fontSize:20, fontWeight:700, color:ALLOY.white, fontFamily:ALLOY.fontDisplay }}>{activeDash}</h2>
                {connection?.connected && <p style={{ fontSize:11, color:ALLOY.mute, marginTop:4, fontFamily:ALLOY.fontLabel, letterSpacing:'0.04em' }}>REAL-TIME DATA · {connection.email}</p>}
              </div>

              {/* ── UNIFIED DRAG-AND-DROP CANVAS ── */}
              {/* All widgets rendered from single widgetOrder array */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                {widgetOrder
                  .filter(id => !isWidgetRemoved(id))
                  .map(id => {
                    // ── KPI scorecard widgets (w1, w2, w3, w4) ──
                    if (['w1','w2','w3','w4'].includes(id)) {
                      const w = widgets.find(x => x.id === id)
                      if (!w) return null
                      return <KPICard key={id} w={w}/>
                    }

                    // ── Sessions Over Time ──
                    if (id === 'c1') {
                      const w = widgets.find(x => x.id === 'c1')
                      return (
                        <ChartCard key="c1" id="c1">
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                            <span style={{ fontSize:11, color:ALLOY.mute, fontWeight:500, fontFamily:ALLOY.fontBody }}>{w?.title || 'Sessions Over Time'}</span>
                            {connection?.connected && <span style={{ fontSize:9, color:ALLOY.green1, fontWeight:600, fontFamily:ALLOY.fontLabel }}>● Live</span>}
                          </div>
                          <DynamicChart chartType={w?.chartType || 'line'} data={getWidgetData(w || {})} height={80} dimensions={(w as any)?.dimensions} metrics={(w as any)?.metrics}/>
                        </ChartCard>
                      )
                    }

                    // ── Donut gauge ──
                    if (id === 'c2') {
                      return (
                        <ChartCard key="c2" id="c2">
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:110 }}>
                            <div style={{ position:'relative', width:90, height:90 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart><Pie data={[{v:44},{v:56}]} cx="50%" cy="50%" innerRadius={28} outerRadius={40} dataKey="v" startAngle={90} endAngle={-270}><Cell fill="#f9b62a"/><Cell fill="#e5e5e5"/></Pie></PieChart>
                              </ResponsiveContainer>
                              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:18, fontWeight:700, fontFamily:ALLOY.fontDisplay }}>44</span></div>
                            </div>
                          </div>
                        </ChartCard>
                      )
                    }

                    // ── Conversion Rate ──
                    if (id === 'c3') {
                      return (
                        <ChartCard key="c3" id="c3">
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                            <span style={{ fontSize:11, color:ALLOY.mute, fontFamily:ALLOY.fontBody }}>Conversion Rate</span>
                            <span style={{ fontSize:10, fontWeight:700, color:ALLOY.red1, background:ALLOY.red4, padding:'2px 5px', borderRadius:2, fontFamily:ALLOY.fontLabel }}>▼ 34%</span>
                          </div>
                          <span style={{ fontSize:24, fontWeight:700, color:ALLOY.ink, fontFamily:ALLOY.fontDisplay }}>3%</span>
                        </ChartCard>
                      )
                    }

                    // ── Bounce Rate ──
                    if (id === 'bounce') {
                      const isSel = editingWidget?.id === 'bounce' && editMode
                      const bounceWidget = widgets[3]
                      return (
                        <div key="bounce" data-widget-id="bounce"
                          draggable={editMode}
                          onDragStart={e => onDragStart(e, 'bounce')}
                          onDragEnd={onDragEnd}
                          onDragOver={e => onDragOver(e, 'bounce')}
                          onDragLeave={onDragLeave}
                          onDrop={e => onDrop(e, 'bounce')}
                          onClick={e => { e.stopPropagation(); if (editMode && bounceWidget) startEdit(bounceWidget) }}
                          style={{ background:ALLOY.red1, border:`2px solid ${isSel ? ALLOY.blue1 : ALLOY.red1}`, borderRadius:2, padding:16, position:'relative', cursor: editMode ? 'grab' : 'default', width: widgetSizes['bounce'] ? widgetSizes['bounce'].w : 'calc(25% - 8px)', minWidth:180 }}>
                          {isSel && <div className="alloy-editing-badge" style={{ position:'absolute', top:-12, left:10, zIndex:30, background:ALLOY.green1, color:ALLOY.white, fontFamily:ALLOY.fontLabel, fontSize:8, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', padding:'3px 8px', borderRadius:2, pointerEvents:'none', whiteSpace:'nowrap' }}>✦ Editing</div>}
                          {/* Grip icon */}
                          {editMode && (
                            <div style={{ position:'absolute', top:6, left:6, zIndex:5, opacity:0.5, pointerEvents:'none' }}>
                              <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
                                <circle cx="3" cy="3" r="1.2" fill="rgba(255,255,255,0.7)"/><circle cx="7" cy="3" r="1.2" fill="rgba(255,255,255,0.7)"/>
                                <circle cx="3" cy="7" r="1.2" fill="rgba(255,255,255,0.7)"/><circle cx="7" cy="7" r="1.2" fill="rgba(255,255,255,0.7)"/>
                                <circle cx="3" cy="11" r="1.2" fill="rgba(255,255,255,0.7)"/><circle cx="7" cy="11" r="1.2" fill="rgba(255,255,255,0.7)"/>
                              </svg>
                            </div>
                          )}
                          {editMode && (
                            <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:6, right:6, zIndex:10, display:'flex', gap:4 }}>
                              <button style={{ background:'rgba(255,255,255,0.2)', border:'none', borderRadius:2, padding:'3px 5px', cursor:'pointer', display:'flex' }}><Maximize2 size={10} style={{ color:'rgba(255,255,255,0.8)' }}/></button>
                              {bounceWidget && <WidgetDot wid="bounce" onEdit={() => startEdit(bounceWidget)} onClone={() => cloneWidget(bounceWidget)} widget={bounceWidget}/>}
                            </div>
                          )}
                          <ResizeHandle id="bounce"/>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                            <span style={{ fontSize:11, color:'rgba(255,255,255,0.85)', fontFamily:ALLOY.fontBody }}>Bounce Rate</span>
                            <span style={{ fontFamily:ALLOY.fontBody, fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.95)', background:'rgba(255,255,255,0.18)', padding:'2px 6px', borderRadius:2 }}>▲ 6.84%</span>
                          </div>
                          <p style={{ fontSize:26, fontWeight:700, color:ALLOY.white, letterSpacing:'-0.5px', fontFamily:ALLOY.fontDisplay }}>39.23%</p>
                        </div>
                      )
                    }

                    // ── Users By Device ──
                    if (id === 'd1') {
                      const w = widgets.find(x => x.id === 'd1')
                      return (
                        <ChartCard key="d1" id="d1">
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                            <span style={{ fontSize:11, fontWeight:600, fontFamily:ALLOY.fontBody }}>{w?.title || 'Users By Device'}</span>
                            {connection?.connected && <span style={{ fontSize:9, color:ALLOY.green1, fontWeight:600, fontFamily:ALLOY.fontLabel }}>● Live</span>}
                          </div>
                          <DynamicChart chartType={w?.chartType || 'column'} data={getWidgetData(w || {})} height={110} dimensions={(w as any)?.dimensions} metrics={(w as any)?.metrics}/>
                        </ChartCard>
                      )
                    }

                    // ── Top Referral Sources ──
                    if (id === 'd2') {
                      return (
                        <ChartCard key="d2" id="d2">
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
                        </ChartCard>
                      )
                    }

                    // ── Traffic by Cities ──
                    if (id === 'd3') {
                      return (
                        <ChartCard key="d3" id="d3">
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
                        </ChartCard>
                      )
                    }

                    // ── Website Views ──
                    if (id === 'v1') {
                      const w = widgets.find(x => x.id === 'v1')
                      return (
                        <ChartCard key="v1" id="v1">
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                            <span style={{ fontSize:12, fontWeight:600, fontFamily:ALLOY.fontBody }}>{w?.title || 'Website Views'}</span>
                            {connection?.connected && <span style={{ fontSize:9, color:ALLOY.green1, fontWeight:600, fontFamily:ALLOY.fontLabel }}>● Live GA4</span>}
                          </div>
                          <DynamicChart chartType={w?.chartType || 'area'} data={getWidgetData(w || {})} height={130} dimensions={(w as any)?.dimensions} metrics={(w as any)?.metrics}/>
                        </ChartCard>
                      )
                    }

                    // ── Dynamic / cloned widgets ──
                    const dynWidget = widgets.find(w => w.id === id && !ALL_STATIC_IDS_ORDERED.includes(w.id))
                    if (dynWidget) {
                      const isDynSelected = editingWidget?.id === dynWidget.id && editMode
                      return (
                        <div key={id} data-widget-id={id}
                          draggable={editMode}
                          onDragStart={e => onDragStart(e, id)}
                          onDragEnd={onDragEnd}
                          onDragOver={e => onDragOver(e, id)}
                          onDragLeave={onDragLeave}
                          onDrop={e => onDrop(e, id)}
                          onClick={e => { e.stopPropagation(); if (editMode) startEdit(dynWidget) }}
                          style={{ background:ALLOY.white, borderRadius:2, padding:14, position:'relative', cursor: editMode ? 'grab' : 'default', transition:'border-color 0.15s, box-shadow 0.15s, opacity 0.15s', opacity: editMode && editingWidget && !isDynSelected ? 0.45 : 1, ...(isDynSelected ? { border:`2.5px solid ${ALLOY.green1}`, boxShadow:`0 0 0 4px ${ALLOY.green4}, 0 6px 24px rgba(32,187,113,0.22)` } : { border:`2px solid ${ALLOY.line}` }), ...(widgetSizes[id] ? { width: widgetSizes[id].w, minHeight: widgetSizes[id].h } : { width: 'calc(33.333% - 8px)', minWidth: 220, minHeight: 140 }) }}>
                          {isDynSelected && <div className="alloy-editing-badge" style={{ position:'absolute', top:-12, left:10, zIndex:30, background:ALLOY.green1, color:ALLOY.white, fontFamily:ALLOY.fontLabel, fontSize:8, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', padding:'3px 8px', borderRadius:2, pointerEvents:'none', whiteSpace:'nowrap' }}>✦ Editing</div>}
                          {/* Grip icon */}
                          {editMode && (
                            <div style={{ position:'absolute', top:6, left:6, zIndex:5, opacity:0.4, pointerEvents:'none' }}>
                              <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
                                <circle cx="3" cy="3" r="1.2" fill={ALLOY.mute}/><circle cx="7" cy="3" r="1.2" fill={ALLOY.mute}/>
                                <circle cx="3" cy="7" r="1.2" fill={ALLOY.mute}/><circle cx="7" cy="7" r="1.2" fill={ALLOY.mute}/>
                                <circle cx="3" cy="11" r="1.2" fill={ALLOY.mute}/><circle cx="7" cy="11" r="1.2" fill={ALLOY.mute}/>
                              </svg>
                            </div>
                          )}
                          {editMode && (
                            <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:6, right:6, zIndex:10, display:'flex', gap:4 }}>
                              <WidgetDot wid={id} onEdit={() => startEdit(dynWidget)} onClone={() => cloneWidget(dynWidget)} widget={dynWidget}/>
                            </div>
                          )}
                          <ResizeHandle id={id}/>
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                            <span style={{ fontSize:12, fontWeight:600, color:ALLOY.ink, fontFamily:ALLOY.fontBody }}>{dynWidget.title}</span>
                            {connection?.connected && <span style={{ fontSize:9, color:ALLOY.green1, fontWeight:600, fontFamily:ALLOY.fontLabel }}>● Live</span>}
                          </div>
                          <DynamicChart chartType={dynWidget.chartType} data={getWidgetData(dynWidget)} height={100} dimensions={(dynWidget as any).dimensions} metrics={(dynWidget as any).metrics}/>
                        </div>
                      )
                    }

                    return null
                  })}
              </div>
              {/* ── End unified canvas ── */}
            </div>
          )}
        </div>

        {/* ── Right panel ── */}
        {editMode && (
          <div style={{ display:'flex', height:'100%', borderLeft:`1px solid ${ALLOY.line}` }}>
            {editingWidget && (
              <div onClick={e => e.stopPropagation()} style={{ width:300, minWidth:300, background:ALLOY.white, borderRight:`1px solid ${ALLOY.line}`, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                <div style={{ padding:'14px 16px', borderBottom:`1px solid ${ALLOY.line}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                    <button onClick={() => { setEditingWidget(null); setActiveRightPanel('integrations') }} style={{ width:28, height:28, borderRadius:'50%', background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
                      <ChevronLeft size={14} style={{ color:ALLOY.ink }}/>
                    </button>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3 }}>
                        <div style={{ width:12, height:12, borderRadius:2, flexShrink:0, background:(KPI_BG[editingWidget.color]||KPI_BG.white).bg, border:`1.5px solid ${ALLOY.green1}`, boxShadow:`0 0 0 2px ${ALLOY.green4}` }}/>
                        <p style={{ fontSize:13, fontWeight:700, color:ALLOY.ink, lineHeight:1.2, fontFamily:ALLOY.fontDisplay, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{editingWidget.title}</p>
                      </div>
                      <p style={{ fontFamily:ALLOY.fontLabel, fontSize:9, color:ALLOY.mute, letterSpacing:'0.08em', textTransform:'uppercase', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{editingWidget.dataSource}</p>
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
                        <label style={{ display:'block', fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, color:ALLOY.mute, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.1em' }}>Title</label>
                        <input value={editingWidget.title} onChange={e => { const u={...editingWidget,title:e.target.value}; setEditingWidget(u); setWidgets(prev=>prev.map(w=>w.id===u.id?u:w)) }}
                          style={{ width:'100%', background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'8px 12px', fontFamily:ALLOY.fontBody, fontSize:13, outline:'none', color:ALLOY.ink, boxSizing:'border-box' }}/>
                      </div>
                      <div style={{ marginBottom:18 }}>
                        <label style={{ display:'block', fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, color:ALLOY.mute, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.1em' }}>Tooltip</label>
                        <textarea value={editingWidget.tooltip} onChange={e => { const u={...editingWidget,tooltip:e.target.value}; setEditingWidget(u); setWidgets(prev=>prev.map(w=>w.id===u.id?u:w)) }}
                          style={{ width:'100%', background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'8px 12px', fontSize:13, outline:'none', color:ALLOY.ink, resize:'vertical', minHeight:80, fontFamily:ALLOY.fontBody, boxSizing:'border-box' }}/>
                      </div>
                      <div style={{ marginBottom:12 }}>
                        <label style={{ display:'block', fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, color:ALLOY.mute, marginBottom:10, textTransform:'uppercase', letterSpacing:'0.1em' }}>Chart Type</label>
                        <div style={{ maxHeight:380, overflowY:'auto', border:`1px solid ${ALLOY.line}`, borderRadius:2, background:ALLOY.paper }}>
                          {CHART_TYPE_GROUPS.map(group => (
                            <div key={group.group} style={{ padding:'10px 10px 4px' }}>
                              <p style={{ fontSize:9, fontWeight:600, color:ALLOY.mute, textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:ALLOY.fontLabel, marginBottom:8 }}>{group.group}</p>
                              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:6 }}>
                                {group.types.map(ct => {
                                  const active = editingWidget.chartType === ct.id
                                  return (
                                    <button key={ct.id}
                                      onClick={() => { const u={...editingWidget,chartType:ct.id}; setEditingWidget(u); setWidgets(prev=>prev.map(w=>w.id===u.id?u:w)) }}
                                      title={ct.label}
                                      style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'5px 3px', borderRadius:2, border:`2px solid ${active?'#1a73e8':ALLOY.line}`, background:active?ALLOY.blue4:ALLOY.white, cursor:'pointer', width:60, minWidth:60 }}>
                                      <ChartThumbSvg id={ct.id} active={active}/>
                                      <span style={{ fontFamily:ALLOY.fontLabel, fontSize:9, color:active?ALLOY.green1:ALLOY.ink, fontWeight:active?600:400, textAlign:'center', lineHeight:1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', width:'100%', letterSpacing:'0.04em' }}>{ct.label}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button onClick={saveWidget} style={{ width:'100%', background:ALLOY.green1, border:'none', borderRadius:2, padding:'10px', fontFamily:ALLOY.fontLabel, fontSize:11, fontWeight:700, color:ALLOY.ink, cursor:'pointer', letterSpacing:'0.06em', textTransform:'uppercase' }}>Save Changes</button>
                    </>
                  )}
                  {editTab==='Data' && (
                    <div style={{ padding:'8px 0', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.mute, textAlign:'center' }}>
                      Data configuration panel
                      <br/><br/>
                      <button onClick={saveWidget} style={{ background:ALLOY.green1, border:'none', borderRadius:2, padding:'8px 16px', fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:700, color:ALLOY.ink, cursor:'pointer', letterSpacing:'0.06em', textTransform:'uppercase' }}>Save</button>
                    </div>
                  )}
                  {editTab==='Display' && (
                    <div style={{ padding:'8px 0' }}>
                      {(() => {
                        const dw = editingWidget as any
                        const BG_MAP: Record<string,string> = { white:ALLOY.white, blue:ALLOY.blue1, green:ALLOY.green1, red:ALLOY.red1 }
                        const updateField = (key: string, val: any) => {
                          setEditingWidget(prev => { if (!prev) return prev; const updated = { ...prev, [key]: val } as any; setWidgets(ws => ws.map(w => w.id === updated.id ? updated : w)); return updated })
                        }
                        const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', borderBottom:`1px solid ${ALLOY.line}` }}>
                            <span style={{ fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink }}>{label}</span>
                            {children}
                          </div>
                        )
                        const Tog = ({ field }: { field: string }) => {
                          const on = !!dw[field]
                          return <div onClick={() => updateField(field, !on)} style={{ width:40, height:22, borderRadius:11, background: on ? ALLOY.green1 : ALLOY.line, position:'relative', cursor:'pointer', transition:'background 0.2s', flexShrink:0 }}><div style={{ width:18, height:18, borderRadius:'50%', background:ALLOY.white, position:'absolute', top:2, left: on ? 20 : 2, transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.25)' }}/></div>
                        }
                        const ColorPick = ({ field, def }: { field: string; def: string }) => {
                          const val = field === 'bgColor' ? (dw.bgHex || BG_MAP[dw.color] || def) : (dw[field] || def)
                          return (
                            <label style={{ cursor:'pointer', position:'relative' }}>
                              <div style={{ width:32, height:32, borderRadius:2, background:val, border:`1px solid ${ALLOY.line}` }}/>
                              <input type="color" value={val} onChange={e => { if (field === 'bgColor') { const hex=e.target.value; const key=hex===ALLOY.blue1?'blue':hex===ALLOY.green1?'green':hex===ALLOY.red1?'red':'white'; setEditingWidget(prev => { if (!prev) return prev; const u={...prev,color:key,bgHex:hex} as any; setWidgets(ws=>ws.map(w=>w.id===u.id?u:w)); return u }) } else updateField(field, e.target.value) }} style={{ position:'absolute', opacity:0, inset:0, cursor:'pointer' }}/>
                            </label>
                          )
                        }
                        return (
                          <>
                            <div style={{ padding:'14px 16px 8px', borderBottom:`1px solid ${ALLOY.line}`, background:ALLOY.paper }}><span style={{ fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:700, color:ALLOY.mute, textTransform:'uppercase', letterSpacing:'0.12em' }}>Display</span></div>
                            <Row label="Show Anomalies"><Tog field="showAnomalies"/></Row>
                            <Row label="Show Forecast"><Tog field="showForecast"/></Row>
                            <Row label="Show Integration Icon"><Tog field="showIntegIcon"/></Row>
                            <div style={{ padding:'14px 16px 8px', borderBottom:`1px solid ${ALLOY.line}`, background:ALLOY.paper, marginTop:8 }}><span style={{ fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:700, color:ALLOY.mute, textTransform:'uppercase', letterSpacing:'0.12em' }}>Background & border</span></div>
                            <Row label="Background"><ColorPick field="bgColor" def={ALLOY.white}/></Row>
                            <Row label="Text Color"><ColorPick field="textColor" def={ALLOY.ink}/></Row>
                            <Row label="Border color"><ColorPick field="borderColor" def={ALLOY.line}/></Row>
                            <Row label="Add border shadow"><Tog field="borderShadow"/></Row>
                            <div style={{ padding:16 }}>
                              <button onClick={saveWidget} style={{ width:'100%', background:ALLOY.green1, border:'none', borderRadius:2, padding:'10px', fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:700, color:ALLOY.ink, cursor:'pointer', letterSpacing:'0.06em', textTransform:'uppercase' }}>Save Changes</button>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeRightPanel && !editingWidget && (
              <div style={{ width:300, background:ALLOY.white, borderRight:`1px solid ${ALLOY.line}`, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                {activeRightPanel==='charts' && (
                  <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                    <div style={{ padding:'12px 16px', borderBottom:`1px solid ${ALLOY.line}`, flexShrink:0 }}>
                      <p style={{ fontFamily:ALLOY.fontDisplay, fontSize:13, fontWeight:700, color:ALLOY.ink, marginBottom:2 }}>Add Chart</p>
                      <p style={{ fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.mute }}>Click any chart to add it to the dashboard</p>
                    </div>
                    <div style={{ flex:1, overflowY:'auto' }}>
                      {CHART_TYPE_GROUPS.map(group => (
                        <div key={group.group} style={{ padding:'10px 10px 4px' }}>
                          <p style={{ fontSize:9, fontWeight:600, color:ALLOY.mute, textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:ALLOY.fontLabel, marginBottom:8 }}>{group.group}</p>
                          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:6 }}>
                            {group.types.map(ct => (
                              <button key={ct.id} onClick={() => addWidget(ct.id, ct.label)} title={`Add ${ct.label}`}
                                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'5px 3px', borderRadius:2, border:'2px solid #e0e0e0', background:ALLOY.white, cursor:'pointer', width:60, minWidth:60 }}
                                onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='#1a73e8';(e.currentTarget as HTMLButtonElement).style.background=ALLOY.blue4}}
                                onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=ALLOY.line;(e.currentTarget as HTMLButtonElement).style.background=ALLOY.white}}>
                                <ChartThumbSvg id={ct.id} active={false}/>
                                <span style={{ fontFamily:ALLOY.fontBody, fontSize:9, color:'#444', textAlign:'center', lineHeight:1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', width:'100%' }}>{ct.label}</span>
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
                    <div style={{ padding:'10px 12px', borderBottom:`1px solid ${ALLOY.line}` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'7px 10px', marginBottom:8 }}>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="#999" strokeWidth="1.5"/><path d="M9.5 9.5 L12 12" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        <input value={integrationSearch} onChange={e => setIntegrationSearch(e.target.value)} placeholder="Search" style={{ background:'transparent', border:'none', outline:'none', fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink, width:'100%' }}/>
                      </div>
                    </div>
                    <div style={{ flex:1, overflowY:'auto' }}>
                      {ALL_INTEGRATIONS.filter(i => i.name.toLowerCase().includes(integrationSearch.toLowerCase())).map(i => (
                        <div key={i.name} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderBottom:`1px solid ${ALLOY.line}`, cursor:'pointer' }}
                          onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background=ALLOY.paper}
                          onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}>
                          <div style={{ width:28, height:28, borderRadius:2, background:ALLOY.paper, border:'1px solid #ebebeb', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden' }}>
                            <img src={`https://www.google.com/s2/favicons?domain=${i.domain}&sz=64`} alt={i.name} style={{ width:20, height:20, objectFit:'contain', opacity: i.connected ? 1 : 0.45 }} onError={e => { (e.currentTarget as HTMLImageElement).style.display='none' }}/>
                          </div>
                          <span style={{ flex:1, fontFamily:ALLOY.fontBody, fontSize:13, color: i.connected ? ALLOY.ink : ALLOY.mute, fontWeight: i.connected ? 500 : 400 }}>{i.name}</span>
                          <ChevronRight size={13} style={{ color:ALLOY.line, flexShrink:0 }}/>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeRightPanel==='build' && (
                  <div style={{ flex:1, overflowY:'auto', padding:20 }}>
                    {[{icon:'⊞',title:'Summarize your data with AI',desc:'Transform your data into clear, meaningful insights'},{icon:'📊',title:'Build metrics with AI',desc:'Use natural prompts to find the right widgets'},{icon:'⧉',title:'Clone existing page',desc:'Copy a dashboard from any client'}].map(item => (
                      <div key={item.title} onClick={item.title==='Clone existing page'?()=>setShowCloneModal(true):undefined} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'16px 0', borderBottom:`1px solid ${ALLOY.line}`, cursor:'pointer' }}>
                        <div style={{ width:36, height:36, borderRadius:2, background:ALLOY.paper, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:16 }}>{item.icon}</div>
                        <div style={{ flex:1 }}><p style={{ fontFamily:ALLOY.fontBody, fontSize:15, fontWeight:700, color:ALLOY.ink, marginBottom:4 }}>{item.title}</p><p style={{ fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.mute, lineHeight:1.5 }}>{item.desc}</p></div>
                      </div>
                    ))}
                  </div>
                )}
                {(activeRightPanel==='content'||activeRightPanel==='media'||activeRightPanel==='metrics'||activeRightPanel==='benchmarks'||activeRightPanel==='goals') && (
                  <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, textAlign:'center' }}>
                    <div style={{ width:60, height:60, borderRadius:'50%', background:ALLOY.paper, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, fontSize:24 }}>
                      {activeRightPanel==='content'?'Aa':activeRightPanel==='media'?'🖼':activeRightPanel==='metrics'?'⊕':activeRightPanel==='benchmarks'?'⚖':'🚩'}
                    </div>
                    <p style={{ fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink, lineHeight:1.6, marginBottom:16, textTransform:'capitalize' }}>{activeRightPanel} panel</p>
                    <button style={{ background:ALLOY.blue1, border:'none', borderRadius:2, padding:'8px 16px', color:ALLOY.white, cursor:'pointer', fontFamily:ALLOY.fontBody, fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}><Plus size={14}/> Add {activeRightPanel}</button>
                  </div>
                )}
              </div>
            )}

            {/* Right icon rail */}
            <div style={{ width:80, minWidth:80, background:ALLOY.white, display:'flex', flexDirection:'column', alignItems:'center', padding:'12px 0', gap:2 }}>
              {RIGHT_PANEL_ITEMS.map(item => (
                <button key={item.id} onClick={() => { setActiveRightPanel(activeRightPanel===item.id ? null : item.id); setEditingWidget(null) }}
                  style={{ width:68, padding:'10px 4px', display:'flex', flexDirection:'column', alignItems:'center', gap:5, border:'none', cursor:'pointer', borderRadius:2, background:activeRightPanel===item.id?ALLOY.paper:'none' }}>
                  <span style={{ fontSize:18, lineHeight:1 }}>{item.icon}</span>
                  <span style={{ fontFamily:ALLOY.fontBody, fontSize:9, color:activeRightPanel===item.id?ALLOY.ink:ALLOY.mute, textAlign:'center', lineHeight:1.3, whiteSpace:'pre-line', fontWeight:activeRightPanel===item.id?600:400 }}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Fullscreen widget ── */}
      {fullscreenWidget && (
        <div className="alloy-modal-bg" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }} onClick={() => setFullscreenWidget(null)}>
          <div className="alloy-modal-card" style={{ background:ALLOY.white, borderRadius:2, width:'92vw', maxWidth:1200, maxHeight:'92vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 24px 80px rgba(0,0,0,0.35)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 24px', borderBottom:`1px solid ${ALLOY.line}`, background:ALLOY.white, flexShrink:0 }}>
              <div style={{ width:10, height:10, borderRadius:2, background:(KPI_BG[fullscreenWidget.color]||KPI_BG.white).bg, border:`1.5px solid ${ALLOY.green1}`, flexShrink:0 }}/>
              <span style={{ fontFamily:ALLOY.fontDisplay, fontSize:16, fontWeight:700, color:ALLOY.ink, flex:1 }}>{fullscreenWidget.title}</span>
              {connection?.connected && <span style={{ fontFamily:ALLOY.fontLabel, fontSize:9, color:ALLOY.green1, fontWeight:600, marginRight:12 }}>● Live</span>}
              <button onClick={() => setFullscreenWidget(null)} style={{ width:30, height:30, borderRadius:2, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}><X size={14} style={{ color:ALLOY.ink }}/></button>
            </div>
            <div style={{ flex:1, padding:32, overflow:'auto', minHeight:0 }}>
              <DynamicChart chartType={fullscreenWidget.chartType} data={getWidgetData(fullscreenWidget)} height={480} dimensions={(fullscreenWidget as any).dimensions} metrics={(fullscreenWidget as any).metrics}/>
            </div>
          </div>
        </div>
      )}

      {/* ── Drill-down panel ── */}
      {drillWidget && !editMode && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200, display:'flex', alignItems:'stretch', justifyContent:'flex-end' }} onClick={() => setDrillWidget(null)}>
          <div style={{ width:'82%', background:ALLOY.white, display:'flex', flexDirection:'column', overflow:'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding:'14px 24px', borderBottom:`1px solid ${ALLOY.line}`, display:'flex', alignItems:'center', gap:12, background:ALLOY.white, flexShrink:0 }}>
              <span style={{ fontSize:15, fontWeight:700, color:ALLOY.ink, fontFamily:ALLOY.fontDisplay }}>All Channels</span>
              <button onClick={() => setDrillWidget(null)} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', fontSize:20, color:ALLOY.mute }}>✕</button>
            </div>
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:ALLOY.mute, fontFamily:ALLOY.fontBody, fontSize:14 }}>Drill-down panel</div>
          </div>
        </div>
      )}

      {/* ── Clone Dashboard Modal ── */}
      {showCloneModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:16 }} onClick={() => setShowCloneModal(false)}>
          <div style={{ background:ALLOY.white, borderRadius:2, width:'100%', maxWidth:420, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <div style={{ height:3, background:ALLOY.blue1 }}/>
            <div style={{ padding:28 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <h2 style={{ fontSize:15, fontWeight:700, color:ALLOY.ink, fontFamily:ALLOY.fontDisplay }}>Clone Dashboard</h2>
                <button onClick={() => setShowCloneModal(false)} style={{ background:'none', border:'none', cursor:'pointer', color:ALLOY.mute, fontSize:18 }}>✕</button>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontFamily:ALLOY.fontBody, fontSize:12, fontWeight:600, color:ALLOY.mute, marginBottom:6 }}>NEW DASHBOARD NAME</label>
                <input defaultValue={activeDash + ' (Copy)'} id="clone-name-input" style={{ width:'100%', border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'9px 12px', fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink, outline:'none', boxSizing:'border-box' }}/>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => setShowCloneModal(false)} style={{ flex:1, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'9px', fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.mute, cursor:'pointer' }}>Cancel</button>
                <button onClick={() => {
                  const input = document.getElementById('clone-name-input') as HTMLInputElement
                  const newName = (input?.value || activeDash + ' (Copy)').trim()
                  if (!newName) return
                  setDashboards(prev => [...prev, newName]); setClonedDashboards(prev => [...prev, newName]); setActiveDash(newName); setShowCloneModal(false)
                }} style={{ flex:2, background:ALLOY.blue1, border:'none', borderRadius:2, padding:'9px', fontSize:13, fontWeight:600, color:ALLOY.white, cursor:'pointer' }}>Clone Dashboard</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Map Data Sources Modal ── */}
      {showMappingModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:16 }} onClick={() => setShowMappingModal(false)}>
          <div style={{ background:ALLOY.white, borderRadius:2, width:'100%', maxWidth:480, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ height:3, background:ALLOY.green1 }}/>
            <div style={{ padding:28 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <div>
                  <h2 style={{ fontSize:16, fontWeight:700, color:ALLOY.ink, marginBottom:2, fontFamily:ALLOY.fontDisplay }}>Map Data Sources</h2>
                  <p style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.mute }}>Set default data sources for <strong>{clientName}</strong></p>
                </div>
                <button onClick={() => setShowMappingModal(false)} style={{ background:'none', border:'none', cursor:'pointer', color:ALLOY.mute, fontSize:18 }}>✕</button>
              </div>
              <div style={{ borderRadius:2, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, padding:16, marginBottom:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <div style={{ width:28, height:28, borderRadius:2, background:'#e8f5e9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>📊</div>
                  <div><p style={{ fontFamily:ALLOY.fontBody, fontSize:12, fontWeight:700, color:ALLOY.ink }}>Google Analytics 4</p><p style={{ fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.mute }}>Select the GA4 property for this client</p></div>
                </div>
                <select value={mappingProp} onChange={e => { setMappingProp(e.target.value); const p = connection?.ga4_properties?.find((x: any) => x.name===e.target.value); setMappingPropName(p?.displayName||e.target.value) }}
                  style={{ width:'100%', background:ALLOY.white, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'9px 12px', fontFamily:ALLOY.fontBody, fontSize:13, outline:'none', color:ALLOY.ink, cursor:'pointer' }}>
                  <option value="">— Select GA4 Property —</option>
                  {connection?.ga4_properties?.map((p: any) => <option key={p.name} value={p.name}>{p.displayName||p.name}</option>)}
                </select>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => setShowMappingModal(false)} style={{ flex:1, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'10px', fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.mute, cursor:'pointer', fontWeight:500 }}>Cancel</button>
                <button onClick={saveMapping} disabled={!mappingProp||savingMapping}
                  style={{ flex:2, background:mappingSaved?ALLOY.green1:ALLOY.blue1, border:'none', borderRadius:2, padding:'10px', fontSize:13, fontWeight:600, color:ALLOY.white, cursor:'pointer', opacity:!mappingProp||savingMapping?0.6:1 }}>
                  {mappingSaved ? '✓ Saved!' : savingMapping ? 'Saving...' : 'Save & Apply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Share capture modal ── */}
      {shareCapture && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:3000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }} onClick={() => setShareCapture(null)}>
          <div className="alloy-modal-card" style={{ background:ALLOY.white, borderRadius:2, boxShadow:'0 20px 60px rgba(0,0,0,0.3)', overflow:'hidden', maxWidth:520, width:'100%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', borderBottom:`1px solid ${ALLOY.line}`, background:ALLOY.paper }}>
              <span style={{ fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, color:ALLOY.mute, textTransform:'uppercase', letterSpacing:'0.1em', flex:1 }}>Share — {shareCapture.title}</span>
              <button onClick={() => setShareCapture(null)} style={{ background:'none', border:'none', cursor:'pointer', color:ALLOY.mute, display:'flex' }}><X size={14}/></button>
            </div>
            <div style={{ padding:20, background:ALLOY.paper }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, background:ALLOY.white, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'8px 12px', marginBottom:8 }}>
                <Link2 size={12} style={{ color:ALLOY.mute }} strokeWidth={1.5}/>
                <span style={{ flex:1, fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.mute, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{typeof window !== 'undefined' ? window.location.href : ''}</span>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, padding:'12px 16px', borderTop:`1px solid ${ALLOY.line}` }}>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); setShareCapture(null); setShareToast('Link copied'); setTimeout(()=>setShareToast(null),2500) }}
                style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'9px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, cursor:'pointer', fontWeight:500 }}>
                <Copy size={13} strokeWidth={1.5}/> Copy Link
              </button>
              <button onClick={() => { setShareCapture(null); window.print() }}
                style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:ALLOY.ink, border:'none', borderRadius:2, padding:'9px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.white, cursor:'pointer', fontWeight:500 }}>
                <Download size={13} strokeWidth={1.5}/> Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {shareToast && (
        <div className="alloy-toast" style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:9999, background:ALLOY.ink, color:ALLOY.white, fontFamily:ALLOY.fontBody, fontSize:12, fontWeight:500, padding:'11px 22px', borderRadius:2, boxShadow:'0 4px 20px rgba(0,0,0,0.25)', display:'flex', alignItems:'center', gap:10, pointerEvents:'none', whiteSpace:'nowrap' }}>
          <span style={{ color:ALLOY.green1, fontSize:15, lineHeight:1 }}>✓</span>
          {shareToast}
        </div>
      )}
    </div>
    </>
  )
}
