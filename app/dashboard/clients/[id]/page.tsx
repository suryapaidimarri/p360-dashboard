'use client'
import React, { useState, useEffect } from 'react'
import { ChevronRight, Sparkles, Settings, Calendar, ChevronDown, Plus, MoreHorizontal, Maximize2, X, Grip, RotateCcw, RotateCw, Monitor, Smartphone, ChevronLeft, RefreshCw, CheckCircle2, Download, Mail, Link2, LayoutGrid, Edit, Copy, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ScatterChart, Scatter as ScatterPlot, ZAxis } from 'recharts'

// ── Alloy Design System tokens ──────────────────────────────────────────────
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
  sp1: 4, sp2: 8, sp3: 12, sp4: 16, sp5: 24, sp6: 32, sp7: 48,
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
  { group:'Table', types:[{id:'table',label:'Table'},{id:'pivot',label:'Pivot'}]},
  { group:'Scorecard', types:[{id:'scorecard',label:'Scorecard'},{id:'scorecard2',label:'Scorecard'}]},
  { group:'Time Series', types:[{id:'timeseries',label:'Smooth'},{id:'timeseries2',label:'Jagged'},{id:'sparkline',label:'Sparkline'}]},
  { group:'Bar', types:[{id:'column',label:'Column'},{id:'bar',label:'Bar'},{id:'stackedbar',label:'Stacked'},{id:'combo',label:'Line+Bar'},{id:'hbar',label:'H.Bar'},{id:'hstacked',label:'H.Stack'}]},
  { group:'Line', types:[{id:'line',label:'Line'},{id:'multiline',label:'Multi'},{id:'smoothline',label:'Smooth'},{id:'waveline',label:'Wave'},{id:'candlestick',label:'Candle'},{id:'ohlc',label:'OHLC'}]},
  { group:'Area', types:[{id:'area',label:'Area'},{id:'stackarea',label:'Stacked'},{id:'steparea',label:'Step'}]},
  { group:'Pie', types:[{id:'pie',label:'Pie'},{id:'donut',label:'Donut'}]},
  { group:'Scatter', types:[{id:'scatter',label:'Scatter'},{id:'bubble',label:'Bubble'}]},
  { group:'Other', types:[{id:'treemap',label:'Treemap'},{id:'funnel',label:'Funnel'},{id:'gauge',label:'Gauge'},{id:'waterfall',label:'Waterfall'},{id:'timeline',label:'Timeline'},{id:'map',label:'Geo Map'},{id:'histogram',label:'Histogram'},{id:'bullet',label:'Bullet'}]},
]
const CHART_TYPES = CHART_TYPE_GROUPS.flatMap(g => g.types)
const ALL_INTEGRATIONS = [
  { name:'Bing Webmaster Tools',  domain:'bing.com',          connected:true  },
  { name:'Facebook Ads',          domain:'facebook.com',       connected:true  },
  { name:'Google Ads',            domain:'ads.google.com',     connected:true  },
  { name:'Google Analytics 4',    domain:'analytics.google.com', connected:true },
  { name:'Google Search Console', domain:'search.google.com',  connected:true  },
  { name:'LinkedIn Ads',          domain:'linkedin.com',       connected:true  },
  { name:'Semrush - Backlinks',   domain:'semrush.com',        connected:true  },
  { name:'ActiveCampaign',        domain:'activecampaign.com', connected:false },
  { name:'AdRoll',                domain:'adroll.com',         connected:false },
  { name:'Ahrefs',                domain:'ahrefs.com',         connected:false },
  { name:'HubSpot',               domain:'hubspot.com',        connected:false },
  { name:'Mailchimp',             domain:'mailchimp.com',      connected:false },
  { name:'Shopify',               domain:'shopify.com',        connected:false },
  { name:'TikTok',                domain:'tiktok.com',         connected:false },
]

// ── Built-in page templates ──────────────────────────────────────────────────
const BUILTIN_TEMPLATES = [
  {
    id:'tpl-web', name:'Website Performance',
    desc:'Sessions, users, bounce rate, top pages, traffic sources',
    color: ALLOY.blue1,
    icon:'🌐',
    widgets:['Total Sessions','Total Users','Bounce Rate','Engagement Rate','Sessions Over Time','Traffic by Source','Users by Device','Top Cities'],
  },
  {
    id:'tpl-paid', name:'Paid Media',
    desc:'Impressions, clicks, CPC, ROAS, ad spend breakdown',
    color: ALLOY.yellow1,
    icon:'💰',
    widgets:['Impressions','Clicks','CPC','ROAS','Ad Spend Over Time','Campaign Performance','Conversions by Channel'],
  },
  {
    id:'tpl-seo', name:'Organic + AI Search',
    desc:'Clicks, impressions, CTR, average position, top queries',
    color: ALLOY.green1,
    icon:'🔍',
    widgets:['Organic Clicks','Impressions','CTR','Avg Position','Clicks Over Time','Top Queries','Top Pages'],
  },
  {
    id:'tpl-ecom', name:'E-commerce',
    desc:'Revenue, transactions, conversion rate, average order value',
    color:'#9c27b0',
    icon:'🛒',
    widgets:['Revenue','Transactions','Conversion Rate','AOV','Revenue Over Time','Top Products','Cart Abandonment'],
  },
  {
    id:'tpl-social', name:'Social Media',
    desc:'Reach, engagement rate, follower growth, top posts',
    color:'#e91e63',
    icon:'📱',
    widgets:['Reach','Engagement Rate','Followers','Impressions','Engagement Over Time','Top Posts','Platform Breakdown'],
  },
  {
    id:'tpl-email', name:'Email Marketing',
    desc:'Open rate, click rate, unsubscribes, deliverability',
    color:'#ff5722',
    icon:'📧',
    widgets:['Open Rate','Click Rate','Unsubscribes','Deliverability','Opens Over Time','Top Campaigns','List Growth'],
  },
  {
    id:'tpl-donations', name:'Donations & Fundraising',
    desc:'Total donations, donors, average gift, campaign performance',
    color: ALLOY.green1,
    icon:'❤️',
    widgets:['Total Donations','Donors','Avg Gift','Recurring Rate','Donations Over Time','Campaign Performance','Donor Retention'],
  },
  {
    id:'tpl-exec', name:'Executive Summary',
    desc:'High-level KPIs across all channels for leadership reporting',
    color: ALLOY.ink,
    icon:'📊',
    widgets:['Total Revenue','Total Sessions','Conversions','ROI','Performance Over Time','Channel Mix','Goal Progress'],
  },
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

// ── DynamicChart ─────────────────────────────────────────────────────────────
function DynamicChart({ chartType, data, height = 80, dimensions = ['Date'], metrics = ['Sessions'], opts = {} }: { chartType: string; data: any[]; height?: number; dimensions?: string[]; metrics?: string[]; opts?: any }) {
  const colors = ['#4285f4','#ea8600','#a142f4','#34a853','#ea4335','#24c1e0']
  const c = colors[0]
  if (!data || data.length === 0) return null
  if (chartType === 'line' || chartType === 'timeseries' || chartType === 'sparkline' || chartType === 'smoothline') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <XAxis dataKey="d" hide={chartType==='sparkline'} axisLine={false} tickLine={false} tick={{fontSize:9,fill:ALLOY.mute}}/>
          <Line type="monotone" dataKey="v" stroke={c} strokeWidth={2} dot={false}/>
          <Tooltip contentStyle={{fontSize:10,borderRadius:2}} formatter={(v:number)=>[v.toLocaleString(),metrics[0]||'Sessions']}/>
        </LineChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'area' || chartType === 'stackarea' || chartType === 'steparea') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs><linearGradient id="dcg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={c} stopOpacity={0.3}/><stop offset="95%" stopColor={c} stopOpacity={0}/></linearGradient></defs>
          <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:9,fill:ALLOY.mute}}/>
          <Area type={chartType==='steparea'?'step':'monotone'} dataKey="v" stroke={c} fill="url(#dcg)" strokeWidth={2} dot={false}/>
          <Tooltip contentStyle={{fontSize:10,borderRadius:2}} formatter={(v:number)=>[v.toLocaleString(),metrics[0]||'Value']}/>
        </AreaChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'column' || chartType === 'bar' || chartType === 'histogram' || chartType === 'stackedbar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} barSize={18}>
          <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:9,fill:ALLOY.mute}}/>
          <YAxis hide/>
          <Tooltip contentStyle={{fontSize:10,borderRadius:2}} formatter={(v:number)=>[v.toLocaleString(),metrics[0]||'Value']}/>
          <Bar dataKey="v" radius={[3,3,0,0]}>{data.map((_:any,i:number)=><Cell key={i} fill={colors[i%colors.length]}/>)}</Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart><Pie data={data} dataKey="v" cx="50%" cy="50%" outerRadius={height/2-8}>{data.map((_:any,i:number)=><Cell key={i} fill={colors[i%colors.length]}/>)}</Pie><Tooltip contentStyle={{fontSize:10,borderRadius:2}}/></PieChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'donut') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart><Pie data={data} dataKey="v" cx="50%" cy="50%" innerRadius={height/4-4} outerRadius={height/2-8}>{data.map((_:any,i:number)=><Cell key={i} fill={colors[i%colors.length]}/>)}</Pie><Tooltip contentStyle={{fontSize:10,borderRadius:2}}/></PieChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'scorecard') {
    const total = data.reduce((s:number,d:any)=>s+(d.v||0),0)
    return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height}}><span style={{fontSize:32,fontWeight:700,color:c,letterSpacing:'-1px'}}>{total>=1000000?(total/1000000).toFixed(1)+'M':total>=1000?(total/1000).toFixed(1)+'K':total}</span></div>
  }
  if (chartType === 'table') {
    return (
      <div style={{height,overflowY:'auto' as const}}>
        <table style={{width:'100%',fontSize:11,borderCollapse:'collapse'}}>
          <thead><tr style={{background:ALLOY.paper}}><th style={{padding:'4px 8px',textAlign:'left',fontWeight:600,color:ALLOY.mute,borderBottom:`2px solid ${ALLOY.line}`}}>{dimensions[0]||'Dimension'}</th>{metrics.map((m,i)=><th key={i} style={{padding:'4px 8px',textAlign:'right',fontWeight:600,color:ALLOY.mute,borderBottom:`2px solid ${ALLOY.line}`}}>{m}</th>)}</tr></thead>
          <tbody>{data.slice(0,Math.floor(height/22)||6).map((d:any,i:number)=><tr key={i} style={{borderBottom:`1px solid ${ALLOY.line}`,background:i%2===0?ALLOY.white:ALLOY.paper}}><td style={{padding:'4px 8px',color:'#444',fontWeight:500}}>{d.d}</td>{metrics.map((_,mi)=><td key={mi} style={{padding:'4px 8px',textAlign:'right',fontWeight:600,color:ALLOY.ink}}>{d.v?.toLocaleString()}</td>)}</tr>)}</tbody>
        </table>
      </div>
    )
  }
  if (chartType === 'funnel') {
    const maxV = Math.max(...data.map((d:any)=>d.v))
    return (
      <div style={{height,display:'flex',flexDirection:'column',justifyContent:'center',gap:3,padding:'0 8px'}}>
        {data.slice(0,5).map((d:any,i:number)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:6}}>
            <div style={{height:14,borderRadius:2,background:colors[i%colors.length],width:`${Math.max(20,(d.v/maxV)*100)}%`}}/>
            <span style={{fontSize:9,color:ALLOY.mute,whiteSpace:'nowrap'}}>{d.d}</span>
          </div>
        ))}
      </div>
    )
  }
  if (chartType === 'gauge') {
    const maxV = Math.max(...data.map((d:any)=>d.v),1)
    const pct = Math.min((data[data.length-1]?.v||0)/maxV,1)
    return (
      <div style={{height,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <svg width={height*2} height={height} viewBox={`0 0 ${height*2} ${height}`}>
          <path d={`M ${height*0.15} ${height*0.9} A ${height*0.7} ${height*0.7} 0 0 1 ${height*1.85} ${height*0.9}`} stroke="#e0e0e0" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d={`M ${height*0.15} ${height*0.9} A ${height*0.7} ${height*0.7} 0 0 1 ${height*1.85} ${height*0.9}`} stroke={c} strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={`${pct*2.19*(height*0.7)} 999`}/>
          <circle cx={height} cy={height*0.9} r="3" fill="#333"/>
        </svg>
      </div>
    )
  }
  if (chartType === 'map') {
    return (
      <div style={{height,display:'flex',alignItems:'center',justifyContent:'center',background:ALLOY.blue4,borderRadius:2,position:'relative',overflow:'hidden'}}>
        <svg width="100%" height="100%" viewBox="0 0 200 120">
          <ellipse cx="100" cy="60" rx="90" ry="55" fill="#c8e6f5" stroke="#90caf9" strokeWidth="1"/>
          <circle cx="80" cy="50" r="5" fill="#4285f4" opacity="0.8"/>
          <circle cx="120" cy="65" r="4" fill="#ea4335" opacity="0.8"/>
          <circle cx="60" cy="70" r="3" fill="#34a853" opacity="0.8"/>
        </svg>
      </div>
    )
  }
  if (chartType === 'hbar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" barSize={12}>
          <XAxis type="number" hide/>
          <YAxis type="category" dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:9,fill:ALLOY.mute}} width={30}/>
          <Tooltip contentStyle={{fontSize:10,borderRadius:2}}/>
          <Bar dataKey="v" radius={[0,3,3,0]}>{data.map((_:any,i:number)=><Cell key={i} fill={colors[i%colors.length]}/>)}</Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'waterfall') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} barSize={16}>
          <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:9,fill:ALLOY.mute}}/>
          <YAxis hide/>
          <Tooltip contentStyle={{fontSize:10,borderRadius:2}}/>
          <Bar dataKey="v" radius={[3,3,0,0]}>{data.map((d:any,i:number)=><Cell key={i} fill={i===data.length-1?'#ea4335':i%2===0?c:'#34a853'}/>)}</Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }
  if (chartType === 'treemap') {
    return (
      <div style={{height,display:'grid',gridTemplateColumns:'1fr 1fr',gridTemplateRows:'1fr 1fr',gap:2,padding:'4px'}}>
        {data.slice(0,4).map((d:any,i:number)=>(
          <div key={i} style={{background:colors[i%colors.length],borderRadius:3,display:'flex',alignItems:'center',justifyContent:'center',opacity:0.8}}>
            <span style={{fontSize:9,color:ALLOY.white,fontWeight:600}}>{d.d}</span>
          </div>
        ))}
      </div>
    )
  }
  if (chartType === 'bullet') {
    const maxV = Math.max(...data.map((d:any)=>d.v),1)
    return (
      <div style={{height,display:'flex',flexDirection:'column',justifyContent:'center',padding:'0 8px',gap:8}}>
        {data.slice(0,3).map((d:any,i:number)=>(
          <div key={i}>
            <div style={{height:12,background:ALLOY.line,borderRadius:2,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',left:0,top:2,height:8,width:`${(d.v/maxV)*80}%`,background:ALLOY.line,borderRadius:2}}/>
              <div style={{position:'absolute',left:0,top:3,height:6,width:`${(d.v/maxV)*60}%`,background:c,borderRadius:2}}/>
            </div>
          </div>
        ))}
      </div>
    )
  }
  // combo / multiline / scatter / bubble / candlestick / timeline / histogram / pivot / scorecard2 / hstacked / ohlc / stackarea / steparea / waveline
  if (chartType==='combo') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} barSize={14}>
          <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:9,fill:ALLOY.mute}}/>
          <YAxis hide/><Tooltip contentStyle={{fontSize:10,borderRadius:2}}/>
          <Bar dataKey="v" fill={c} fillOpacity={0.4} radius={[2,2,0,0]}/>
          <Line type="monotone" dataKey="v" stroke="#ea8600" strokeWidth={2} dot={false}/>
        </BarChart>
      </ResponsiveContainer>
    )
  }
  if (chartType==='multiline'||chartType==='waveline'||chartType==='timeseries2') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <Line type={chartType==='waveline'?'basis':'monotone'} dataKey="v" stroke={c} strokeWidth={2} dot={false}/>
          <Tooltip contentStyle={{fontSize:10,borderRadius:2}}/>
        </LineChart>
      </ResponsiveContainer>
    )
  }
  if (chartType==='scatter'||chartType==='bubble') {
    const sd=data.map((d:any,i:number)=>({x:i*10,y:d.v,z:chartType==='bubble'?Math.max(10,(d.v%500)+20):20}))
    return (
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{top:4,right:4,bottom:4,left:4}}>
          <XAxis type="number" dataKey="x" hide/>
          <YAxis type="number" dataKey="y" hide/>
          {chartType==='bubble'&&<ZAxis type="number" dataKey="z" range={[20,80]}/>}
          <Tooltip contentStyle={{fontSize:10,borderRadius:2}}/>
          <ScatterPlot data={sd} fill={c}/>
        </ScatterChart>
      </ResponsiveContainer>
    )
  }
  // Default fallback
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}><Line type="monotone" dataKey="v" stroke={c} strokeWidth={2} dot={false}/><Tooltip contentStyle={{fontSize:10,borderRadius:2}}/></LineChart>
    </ResponsiveContainer>
  )
}

// ── ChartThumbSvg ─────────────────────────────────────────────────────────────
function ChartThumbSvg({ id, active }: { id: string; active: boolean }) {
  const B=active?'#1a73e8':'#4285f4', O='#ea8600', B3=active?'#669df6':'#a142f4'
  const G='#34a853', R='#ea4335'
  const s={width:44,height:30} as const
  if(id==='table') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect width="44" height="7" rx="2" fill="#e8f0fe"/><line x1="0" y1="7" x2="44" y2="7" stroke="#e0e0e0"/><line x1="0" y1="15" x2="44" y2="15" stroke="#e0e0e0"/><line x1="0" y1="23" x2="44" y2="23" stroke="#e0e0e0"/><line x1="15" y1="0" x2="15" y2="30" stroke="#e0e0e0"/><line x1="30" y1="0" x2="30" y2="30" stroke="#e0e0e0"/></svg>
  if(id==='pivot') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect width="44" height="7" rx="2" fill="#e8eaf6"/><rect x="0" y="0" width="15" height="30" fill="#e8eaf6" fillOpacity="0.5"/><line x1="0" y1="7" x2="44" y2="7" stroke="#e0e0e0"/><line x1="0" y1="15" x2="44" y2="15" stroke="#e0e0e0"/><line x1="15" y1="0" x2="15" y2="30" stroke="#e0e0e0"/></svg>
  if(id==='scorecard'||id==='scorecard2') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><text x="6" y="12" fontSize="6" fill="#777" fontFamily="sans-serif">Total</text><text x="6" y="24" fontSize="11" fontWeight="bold" fill="#222" fontFamily="sans-serif">1,168</text></svg>
  if(id==='timeseries'||id==='smoothline') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><polyline points="2,24 10,16 18,20 26,10 34,14 42,8" stroke={B} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
  if(id==='timeseries2'||id==='waveline'||id==='multiline') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><polyline points="2,24 10,16 18,20 26,10 34,14 42,8" stroke={B} strokeWidth="1.5" fill="none" strokeLinecap="round"/><polyline points="2,26 10,20 18,22 26,14 34,18 42,10" stroke={O} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
  if(id==='sparkline') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><polyline points="2,24 10,18 18,22 26,12 34,16 42,10" stroke={B} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
  if(id==='column') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="3" y="18" width="6" height="10" fill={B}/><rect x="11" y="10" width="6" height="18" fill={B}/><rect x="19" y="14" width="6" height="14" fill={B}/><rect x="27" y="8" width="6" height="20" fill={B}/><rect x="35" y="16" width="6" height="12" fill={B}/></svg>
  if(id==='bar') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="3" y="18" width="6" height="10" fill={B}/><rect x="11" y="10" width="6" height="18" fill={O}/><rect x="19" y="14" width="6" height="14" fill={B}/><rect x="27" y="8" width="6" height="20" fill={O}/></svg>
  if(id==='stackedbar') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="3" y="22" width="6" height="6" fill={B}/><rect x="3" y="16" width="6" height="6" fill={O}/><rect x="11" y="18" width="6" height="10" fill={B}/><rect x="11" y="12" width="6" height="6" fill={O}/><rect x="19" y="20" width="6" height="8" fill={B}/><rect x="19" y="14" width="6" height="6" fill={O}/></svg>
  if(id==='combo') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="3" y="18" width="6" height="10" fill={B} fillOpacity="0.7"/><rect x="11" y="12" width="6" height="16" fill={B} fillOpacity="0.7"/><polyline points="6,14 14,8 22,12 30,6 38,10" stroke={O} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
  if(id==='hbar') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="2" y="3" width="22" height="5" rx="1" fill={B}/><rect x="2" y="10" width="30" height="5" rx="1" fill={O}/><rect x="2" y="17" width="18" height="5" rx="1" fill={B3}/><rect x="2" y="24" width="26" height="5" rx="1" fill={B}/></svg>
  if(id==='hstacked') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="2" y="3" width="18" height="5" rx="1" fill={B}/><rect x="20" y="3" width="12" height="5" rx="1" fill={O}/><rect x="2" y="10" width="22" height="5" rx="1" fill={B}/></svg>
  if(id==='histogram') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="2" y="22" width="5" height="6" fill={B} fillOpacity="0.5"/><rect x="8" y="16" width="5" height="12" fill={B} fillOpacity="0.7"/><rect x="14" y="10" width="5" height="18" fill={B}/><rect x="20" y="14" width="5" height="14" fill={B} fillOpacity="0.8"/><rect x="26" y="18" width="5" height="10" fill={B} fillOpacity="0.6"/></svg>
  if(id==='line') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><polyline points="2,22 10,14 18,18 26,8 34,12 42,6" stroke={B} strokeWidth="2" fill="none" strokeLinecap="round"/><polyline points="2,26 10,20 18,22 26,14 34,18 42,10" stroke={O} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
  if(id==='candlestick') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><line x1="7" y1="3" x2="7" y2="27" stroke="#888" strokeWidth="1"/><rect x="4" y="8" width="6" height="12" rx="1" fill={G}/><line x1="18" y1="5" x2="18" y2="25" stroke="#888" strokeWidth="1"/><rect x="15" y="12" width="6" height="8" rx="1" fill={R}/></svg>
  if(id==='ohlc') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><line x1="8" y1="5" x2="8" y2="25" stroke={G} strokeWidth="2"/><line x1="4" y1="12" x2="8" y2="12" stroke={G} strokeWidth="2"/><line x1="8" y1="20" x2="12" y2="20" stroke={G} strokeWidth="2"/></svg>
  if(id==='area') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><path d="M2 30 L2 22 L10 14 L18 18 L26 8 L34 12 L42 6 L42 30 Z" fill={B3} fillOpacity="0.3"/><polyline points="2,22 10,14 18,18 26,8 34,12 42,6" stroke={B3} strokeWidth="1.5" fill="none"/></svg>
  if(id==='stackarea') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><path d="M2 30 L42 30 L42 18 L34 22 L26 16 L18 20 L10 24 L2 22 Z" fill={O} fillOpacity="0.5"/><path d="M2 22 L10 24 L18 20 L26 16 L34 22 L42 18 L42 8 L34 12 L26 6 L18 10 L10 14 L2 12 Z" fill={B3} fillOpacity="0.4"/></svg>
  if(id==='steparea') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><path d="M2 30 L2 22 L12 22 L12 14 L22 14 L22 10 L32 10 L32 18 L42 18 L42 30 Z" fill={B3} fillOpacity="0.3"/><polyline points="2,22 12,22 12,14 22,14 22,10 32,10 32,18 42,18" stroke={B3} strokeWidth="1.5" fill="none"/></svg>
  if(id==='pie') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><circle cx="22" cy="15" r="12" fill="#e0e0e0"/><path d="M22 15 L22 3 A12 12 0 0 1 34 15 Z" fill={B}/><path d="M22 15 L34 15 A12 12 0 0 1 18 26.4 Z" fill={R}/><path d="M22 15 L18 26.4 A12 12 0 0 1 22 3 Z" fill={B3}/></svg>
  if(id==='donut') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><circle cx="22" cy="15" r="12" fill="none" stroke={B} strokeWidth="7" strokeDasharray="30 48"/><circle cx="22" cy="15" r="12" fill="none" stroke={O} strokeWidth="7" strokeDasharray="20 58" strokeDashoffset="-30"/><circle cx="22" cy="15" r="5" fill="white"/></svg>
  if(id==='scatter') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><circle cx="8" cy="24" r="2" fill={B}/><circle cx="14" cy="14" r="2" fill={B}/><circle cx="22" cy="20" r="2" fill={B}/><circle cx="28" cy="10" r="2" fill={B}/><circle cx="12" cy="8" r="2" fill={O}/><circle cx="36" cy="22" r="2" fill={O}/></svg>
  if(id==='bubble') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><circle cx="10" cy="22" r="5" fill={B} fillOpacity="0.7"/><circle cx="22" cy="12" r="8" fill={B} fillOpacity="0.5"/><circle cx="36" cy="20" r="6" fill={O} fillOpacity="0.6"/></svg>
  if(id==='treemap') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="1" y="1" width="24" height="18" rx="1" fill={B}/><rect x="27" y="1" width="16" height="8" rx="1" fill={O}/><rect x="27" y="11" width="16" height="8" rx="1" fill={B3}/><rect x="1" y="21" width="11" height="8" rx="1" fill={G}/></svg>
  if(id==='funnel') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="2" y="2" width="40" height="7" rx="2" fill={B}/><rect x="6" y="11" width="32" height="6" rx="2" fill={O}/><rect x="11" y="19" width="22" height="5" rx="2" fill={B3}/><rect x="16" y="26" width="12" height="3" rx="1.5" fill={G}/></svg>
  if(id==='gauge') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><path d="M6 26 A16 16 0 0 1 38 26" stroke="#e0e0e0" strokeWidth="5" fill="none" strokeLinecap="round"/><path d="M6 26 A16 16 0 0 1 30 12" stroke={B} strokeWidth="5" fill="none" strokeLinecap="round"/><circle cx="22" cy="26" r="2.5" fill="#333"/></svg>
  if(id==='waterfall') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="2" y="18" width="7" height="10" rx="1" fill={B}/><rect x="11" y="12" width="7" height="6" rx="1" fill={G}/><rect x="20" y="8" width="7" height="4" rx="1" fill={G}/><rect x="29" y="12" width="7" height="16" rx="1" fill={R}/></svg>
  if(id==='timeline') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="3" y="5" width="22" height="6" rx="2" fill={B}/><rect x="12" y="13" width="26" height="6" rx="2" fill={O}/><rect x="2" y="21" width="16" height="6" rx="2" fill={B3}/></svg>
  if(id==='histogram') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="2" y="22" width="5" height="6" fill={B} fillOpacity="0.5"/><rect x="8" y="16" width="5" height="12" fill={B} fillOpacity="0.7"/><rect x="14" y="10" width="5" height="18" fill={B}/></svg>
  if(id==='bullet') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="2" y="8" width="40" height="14" rx="1" fill="#e0e0e0"/><rect x="2" y="11" width="28" height="8" rx="1" fill="#bdbdbd"/><rect x="2" y="13" width="20" height="4" rx="1" fill={B}/></svg>
  if(id==='map') return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><ellipse cx="22" cy="15" rx="18" ry="12" stroke="#e0e0e0" strokeWidth="1" fill="#e3f2fd"/><circle cx="24" cy="11" r="4" fill={B} fillOpacity="0.5"/><circle cx="16" cy="18" r="3" fill={B} fillOpacity="0.7"/></svg>
  return <svg {...s} viewBox="0 0 44 30"><rect width="44" height="30" rx="2" fill="white" stroke="#e0e0e0"/><rect x="4" y="4" width="36" height="22" rx="2" stroke="#d0d0d0" strokeWidth="1.5" fill="none"/></svg>
}

// ── NewDashCanvas — empty state with all 4 options wired up ─────────────────
function NewDashCanvas({
  onClone,
  onTemplate,
  onAI,
  onSmart,
}: {
  onClone: () => void
  onTemplate: () => void
  onAI: () => void
  onSmart: () => void
}) {
  const [hovered, setHovered] = useState<string|null>(null)
  const cards = [
    {
      id: 'template',
      onClick: onTemplate,
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect x="4" y="4" width="12" height="12" rx="2" fill="#D0D0D0"/>
          <rect x="20" y="4" width="12" height="12" rx="2" fill="#D0D0D0"/>
          <rect x="4" y="20" width="12" height="7" rx="1.5" fill="#E8E8E8"/>
          <rect x="20" y="20" width="12" height="7" rx="1.5" fill="#E8E8E8"/>
          <circle cx="10" cy="30" r="2.5" fill="#48b5ea"/>
        </svg>
      ),
      title: 'Add a page template',
      desc: 'Choose from a ready-made template or one of your saved pages',
    },
    {
      id: 'ai',
      onClick: onAI,
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="12" stroke="#D0D0D0" strokeWidth="2"/>
          <circle cx="18" cy="10" r="3" fill="#D0D0D0"/>
          <path d="M14 18 L17 21 L23 15" stroke="#48b5ea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M26 10 L28 14 L32 12" stroke="#D0D0D0" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Build a page using AI',
      desc: 'Tell AI what you\'re trying to achieve, and watch it build your page',
    },
    {
      id: 'clone',
      onClick: onClone,
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect x="5" y="8" width="18" height="22" rx="2" stroke="#D0D0D0" strokeWidth="2"/>
          <rect x="13" y="6" width="18" height="22" rx="2" stroke="#D0D0D0" strokeWidth="2" fill="#FAFAFA"/>
          <path d="M18 13 h8" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M18 17 h6" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M18 21 h7" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Clone existing page',
      desc: 'Copy a page from another dashboard',
    },
    {
      id: 'smart',
      onClick: onSmart,
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect x="4" y="9" width="28" height="18" rx="2" stroke="#D0D0D0" strokeWidth="2"/>
          <path d="M4 15 h28" stroke="#D0D0D0" strokeWidth="1.5"/>
          <rect x="8" y="19" width="7" height="5" rx="1" fill="#E0E0E0"/>
          <rect x="20" y="19" width="7" height="5" rx="1" fill="#48b5ea" fillOpacity="0.35"/>
          <rect x="14" y="27" width="8" height="2" rx="1" fill="#D0D0D0"/>
        </svg>
      ),
      title: 'Smart Dashboard',
      desc: 'Generate a dashboard from your connected integrations',
    },
  ]

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', background:ALLOY.paper }}>
      <p style={{ fontSize:15, color:ALLOY.ink, marginBottom:2, fontFamily:ALLOY.fontDisplay, fontWeight:500 }}>Start building by dragging widgets</p>
      <p style={{ fontSize:13, color:ALLOY.mute, marginBottom:24, fontFamily:ALLOY.fontBody }}>or</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, width:560 }}>
        {cards.map(card => (
          <button
            key={card.id}
            onClick={e => { e.preventDefault(); e.stopPropagation(); card.onClick() }}
            onMouseEnter={() => setHovered(card.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display:'flex', flexDirection:'column', alignItems:'center', gap:14,
              padding:'30px 24px',
              background: hovered===card.id ? ALLOY.blue4 : ALLOY.white,
              border: `1px solid ${hovered===card.id ? ALLOY.blue1 : '#e8e8e8'}`,
              borderRadius:2,
              cursor:'pointer',
              textAlign:'center' as const,
              transition:'all 0.15s ease',
              boxShadow: hovered===card.id ? '0 4px 16px rgba(72,181,234,0.15)' : 'none',
            }}>
            <div style={{ width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {card.icon}
            </div>
            <div>
              <p style={{ fontSize:14, fontWeight:600, color: hovered===card.id ? ALLOY.blue1 : ALLOY.ink, marginBottom:6, fontFamily:ALLOY.fontBody }}>{card.title}</p>
              <p style={{ fontSize:12, color:ALLOY.mute, lineHeight:1.6, fontFamily:ALLOY.fontBody }}>{card.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Template Modal ────────────────────────────────────────────────────────────
function TemplateModal({
  onClose,
  onSelect,
}: {
  onClose: () => void
  onSelect: (name: string) => void
}) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string|null>(null)
  const savedTemplates: any[] = (() => {
    try { return JSON.parse(localStorage.getItem('alloy_templates')||'[]') } catch { return [] }
  })()
  const allTemplates = [...BUILTIN_TEMPLATES, ...savedTemplates.map((t:any) => ({ ...t, icon:'💾', desc: t.desc || 'User-saved template', color: ALLOY.mute }))]
  const filtered = allTemplates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || (t.desc||'').toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="alloy-modal-bg"
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:16 }}
      onClick={onClose}>
      <div className="alloy-modal-card"
        style={{ background:ALLOY.white, borderRadius:2, width:'100%', maxWidth:680, maxHeight:'85vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}
        onClick={e => e.stopPropagation()}>
        {/* Top accent */}
        <div style={{ height:3, background:ALLOY.blue1 }}/>
        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:`1px solid ${ALLOY.line}`, display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ flex:1 }}>
            <h2 style={{ fontFamily:ALLOY.fontDisplay, fontSize:16, fontWeight:700, color:ALLOY.ink, marginBottom:2 }}>Choose a template</h2>
            <p style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.mute }}>Start from a ready-made dashboard or one of your saved pages</p>
          </div>
          {/* Search */}
          <div style={{ display:'flex', alignItems:'center', gap:8, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'7px 12px', minWidth:200 }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="#999" strokeWidth="1.5"/><path d="M9.5 9.5 L12 12" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search templates..." style={{ background:'transparent', border:'none', outline:'none', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.ink, width:'100%' }}/>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:ALLOY.mute, display:'flex' }}><X size={16}/></button>
        </div>
        {/* Grid */}
        <div style={{ flex:1, overflowY:'auto', padding:20 }}>
          {savedTemplates.length > 0 && (
            <div style={{ marginBottom:16 }}>
              <p style={{ fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, color:ALLOY.mute, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12 }}>Your saved pages</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                {savedTemplates.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).map((tpl:any) => (
                  <button key={tpl.id}
                    onClick={() => setSelected(tpl.name)}
                    style={{ textAlign:'left', padding:'14px 16px', background: selected===tpl.name ? ALLOY.blue4 : ALLOY.white, border:`2px solid ${selected===tpl.name?ALLOY.blue1:ALLOY.line}`, borderRadius:2, cursor:'pointer', transition:'all 0.12s' }}
                    onMouseEnter={e => { if(selected!==tpl.name)(e.currentTarget as HTMLButtonElement).style.borderColor=ALLOY.blue1 }}
                    onMouseLeave={e => { if(selected!==tpl.name)(e.currentTarget as HTMLButtonElement).style.borderColor=ALLOY.line }}>
                    <div style={{ fontSize:20, marginBottom:8 }}>💾</div>
                    <p style={{ fontFamily:ALLOY.fontBody, fontSize:12, fontWeight:600, color:ALLOY.ink, marginBottom:3 }}>{tpl.name}</p>
                    <p style={{ fontFamily:ALLOY.fontBody, fontSize:10, color:ALLOY.mute, lineHeight:1.4 }}>{tpl.desc||'User-saved template'}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          <p style={{ fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:600, color:ALLOY.mute, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12 }}>Built-in templates</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {filtered.filter(t => !savedTemplates.find((s:any)=>s.name===t.name)).map(tpl => (
              <button key={tpl.id}
                onClick={() => setSelected(tpl.name)}
                style={{ textAlign:'left', padding:'16px', background: selected===tpl.name ? ALLOY.blue4 : ALLOY.white, border:`2px solid ${selected===tpl.name?ALLOY.blue1:ALLOY.line}`, borderRadius:2, cursor:'pointer', transition:'all 0.12s', position:'relative' as const, overflow:'hidden' }}
                onMouseEnter={e => { if(selected!==tpl.name){ (e.currentTarget as HTMLButtonElement).style.borderColor=ALLOY.blue1; (e.currentTarget as HTMLButtonElement).style.background=ALLOY.blue4 }}}
                onMouseLeave={e => { if(selected!==tpl.name){ (e.currentTarget as HTMLButtonElement).style.borderColor=ALLOY.line; (e.currentTarget as HTMLButtonElement).style.background=ALLOY.white }}}>
                {/* Color accent strip */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:(tpl as any).color||ALLOY.blue1 }}/>
                <div style={{ fontSize:22, marginBottom:10, marginTop:4 }}>{(tpl as any).icon||'📊'}</div>
                <p style={{ fontFamily:ALLOY.fontBody, fontSize:13, fontWeight:600, color: selected===tpl.name?ALLOY.blue1:ALLOY.ink, marginBottom:4 }}>{tpl.name}</p>
                <p style={{ fontFamily:ALLOY.fontBody, fontSize:11, color:ALLOY.mute, lineHeight:1.5, marginBottom:10 }}>{tpl.desc}</p>
                {(tpl as any).widgets && (
                  <div style={{ display:'flex', flexWrap:'wrap' as const, gap:4 }}>
                    {((tpl as any).widgets||[]).slice(0,4).map((w:string) => (
                      <span key={w} style={{ fontFamily:ALLOY.fontLabel, fontSize:8, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'2px 6px', color:ALLOY.mute, textTransform:'uppercase', letterSpacing:'0.04em' }}>{w}</span>
                    ))}
                    {((tpl as any).widgets||[]).length > 4 && <span style={{ fontFamily:ALLOY.fontLabel, fontSize:8, color:ALLOY.mute }}>+{((tpl as any).widgets||[]).length-4} more</span>}
                  </div>
                )}
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ padding:'40px 0', textAlign:'center' as const, color:ALLOY.mute, fontFamily:ALLOY.fontBody, fontSize:13 }}>
              No templates match "{search}"
            </div>
          )}
        </div>
        {/* Footer */}
        <div style={{ padding:'14px 24px', borderTop:`1px solid ${ALLOY.line}`, display:'flex', alignItems:'center', justifyContent:'flex-end', gap:10, background:ALLOY.paper }}>
          <button onClick={onClose} style={{ background:'transparent', border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'8px 16px', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.mute, cursor:'pointer' }}>Cancel</button>
          <button
            disabled={!selected}
            onClick={() => { if(selected) onSelect(selected) }}
            style={{ background: selected?ALLOY.blue1:ALLOY.line, border:'none', borderRadius:2, padding:'8px 20px', fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:700, color: selected?ALLOY.white:ALLOY.mute, cursor: selected?'pointer':'not-allowed', letterSpacing:'0.08em', textTransform:'uppercase' as const, transition:'background 0.15s' }}>
            Use Template
          </button>
        </div>
      </div>
    </div>
  )
}

// ── AI Build Modal ────────────────────────────────────────────────────────────
function AIBuildModal({ onClose, onGenerate, clientName }: { onClose:()=>void; onGenerate:(name:string)=>void; clientName:string }) {
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [step, setStep] = useState<'input'|'thinking'|'done'>('input')
  const suggestions = [
    'Show me website performance with sessions, bounce rate, and top pages',
    'Build a paid media dashboard with ROAS, clicks, and spend over time',
    'Create an executive summary with key KPIs across all channels',
    'Show organic search performance with clicks and impressions by page',
  ]
  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setStep('thinking')
    setGenerating(true)
    // Simulate AI thinking
    await new Promise(r => setTimeout(r, 2200))
    setGenerating(false)
    setStep('done')
    await new Promise(r => setTimeout(r, 600))
    const dashName = prompt.length > 40 ? prompt.slice(0,40)+'…' : prompt
    onGenerate(dashName)
  }

  return (
    <div className="alloy-modal-bg"
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:16 }}
      onClick={step==='input'?onClose:undefined}>
      <div className="alloy-modal-card"
        style={{ background:ALLOY.white, borderRadius:2, width:'100%', maxWidth:520, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}
        onClick={e=>e.stopPropagation()}>
        <div style={{ height:3, background:'linear-gradient(90deg,#20BB71,#48B5EA,#F9B62A)' }}/>
        <div style={{ padding:28 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <Sparkles size={16} style={{ color:ALLOY.yellow1 }}/>
                <h2 style={{ fontFamily:ALLOY.fontDisplay, fontSize:16, fontWeight:700, color:ALLOY.ink }}>Build with AI</h2>
              </div>
              <p style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.mute }}>Describe what you want to see for <strong>{clientName}</strong></p>
            </div>
            {step==='input' && <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:ALLOY.mute }}><X size={16}/></button>}
          </div>

          {step==='input' && (
            <>
              <textarea
                value={prompt}
                onChange={e=>setPrompt(e.target.value)}
                placeholder="e.g. Show me website performance with sessions, bounce rate, and top traffic sources for the last 30 days…"
                autoFocus
                rows={4}
                style={{ width:'100%', border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'12px 14px', fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink, outline:'none', resize:'none', background:ALLOY.paper, boxSizing:'border-box' as const }}
              />
              <p style={{ fontFamily:ALLOY.fontLabel, fontSize:9, color:ALLOY.mute, marginTop:12, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.1em' }}>Try these examples</p>
              <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:20 }}>
                {suggestions.map(s => (
                  <button key={s} onClick={()=>setPrompt(s)}
                    style={{ textAlign:'left', background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'8px 12px', cursor:'pointer', fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.mute, transition:'all 0.1s' }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=ALLOY.blue1;(e.currentTarget as HTMLButtonElement).style.color=ALLOY.blue1}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=ALLOY.line;(e.currentTarget as HTMLButtonElement).style.color=ALLOY.mute}}>
                    {s}
                  </button>
                ))}
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={onClose} style={{ flex:1, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'10px', fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.mute, cursor:'pointer' }}>Cancel</button>
                <button onClick={handleGenerate} disabled={!prompt.trim()}
                  style={{ flex:2, background:prompt.trim()?ALLOY.green1:ALLOY.line, border:'none', borderRadius:2, padding:'10px', fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:700, color:prompt.trim()?ALLOY.ink:ALLOY.mute, cursor:prompt.trim()?'pointer':'not-allowed', letterSpacing:'0.08em', textTransform:'uppercase' as const, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                  <Sparkles size={12}/> Generate Dashboard
                </button>
              </div>
            </>
          )}

          {step==='thinking' && (
            <div style={{ padding:'32px 0', textAlign:'center' as const }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:ALLOY.green4, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <Sparkles size={22} style={{ color:ALLOY.green1 }}/>
              </div>
              <p style={{ fontFamily:ALLOY.fontDisplay, fontSize:14, fontWeight:600, color:ALLOY.ink, marginBottom:8 }}>Building your dashboard…</p>
              <p style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.mute, marginBottom:20 }}>Analyzing your data sources and creating widgets</p>
              <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
                {['Selecting metrics','Picking chart types','Arranging layout'].map((s,i) => (
                  <span key={s} style={{ fontFamily:ALLOY.fontLabel, fontSize:8, background:ALLOY.green4, color:ALLOY.green1, borderRadius:999, padding:'4px 10px', fontWeight:600, letterSpacing:'0.06em', animation:`alloy-pulse ${1+i*0.3}s ease-in-out infinite` }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {step==='done' && (
            <div style={{ padding:'24px 0', textAlign:'center' as const }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:ALLOY.green4, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                <CheckCircle2 size={24} style={{ color:ALLOY.green1 }}/>
              </div>
              <p style={{ fontFamily:ALLOY.fontDisplay, fontSize:14, fontWeight:600, color:ALLOY.green1 }}>Dashboard ready!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Smart Dashboard Modal ─────────────────────────────────────────────────────
function SmartDashModal({ onClose, onGenerate, clientName, connection }: { onClose:()=>void; onGenerate:(name:string)=>void; clientName:string; connection:any }) {
  const [generating, setGenerating] = useState(false)
  const [step, setStep] = useState<'select'|'thinking'|'done'>('select')
  const [selectedInteg, setSelectedInteg] = useState<string[]>(['Google Analytics 4'])
  const connected = ALL_INTEGRATIONS.filter(i => i.connected)

  const handleGenerate = async () => {
    setStep('thinking')
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2500))
    setGenerating(false)
    setStep('done')
    await new Promise(r => setTimeout(r, 600))
    onGenerate(`Smart Dashboard — ${selectedInteg[0]||'All Channels'}`)
  }

  return (
    <div className="alloy-modal-bg"
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:16 }}
      onClick={step==='select'?onClose:undefined}>
      <div className="alloy-modal-card"
        style={{ background:ALLOY.white, borderRadius:2, width:'100%', maxWidth:480, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}
        onClick={e=>e.stopPropagation()}>
        <div style={{ height:3, background:ALLOY.blue1 }}/>
        <div style={{ padding:28 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
            <div>
              <h2 style={{ fontFamily:ALLOY.fontDisplay, fontSize:16, fontWeight:700, color:ALLOY.ink, marginBottom:2 }}>Smart Dashboard</h2>
              <p style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.mute }}>Auto-generate from your connected integrations for <strong>{clientName}</strong></p>
            </div>
            {step==='select' && <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:ALLOY.mute }}><X size={16}/></button>}
          </div>

          {step==='select' && (
            <>
              <p style={{ fontFamily:ALLOY.fontLabel, fontSize:9, color:ALLOY.mute, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:10 }}>Select integrations to include</p>
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20, maxHeight:260, overflowY:'auto' }}>
                {connected.map(integ => {
                  const on = selectedInteg.includes(integ.name)
                  return (
                    <div key={integ.name} onClick={() => setSelectedInteg(prev => on ? prev.filter(x=>x!==integ.name) : [...prev, integ.name])}
                      style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', border:`1px solid ${on?ALLOY.green1:ALLOY.line}`, borderRadius:2, cursor:'pointer', background:on?ALLOY.green4:ALLOY.white, transition:'all 0.12s' }}>
                      <div style={{ width:22, height:22, borderRadius:3, border:`2px solid ${on?ALLOY.green1:ALLOY.line}`, background:on?ALLOY.green1:ALLOY.white, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.12s' }}>
                        {on && <span style={{ color:ALLOY.white, fontSize:11, fontWeight:700 }}>✓</span>}
                      </div>
                      <img src={`https://www.google.com/s2/favicons?domain=${integ.domain}&sz=32`} style={{ width:18, height:18, objectFit:'contain', flexShrink:0 }} alt=""/>
                      <span style={{ fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.ink, flex:1 }}>{integ.name}</span>
                      <span style={{ fontFamily:ALLOY.fontLabel, fontSize:8, color:ALLOY.green1, background:ALLOY.green4, borderRadius:999, padding:'2px 7px', fontWeight:700, letterSpacing:'0.05em' }}>CONNECTED</span>
                    </div>
                  )
                })}
                {connected.length === 0 && (
                  <div style={{ padding:'20px', textAlign:'center' as const, color:ALLOY.mute, fontFamily:ALLOY.fontBody, fontSize:13, border:`1px dashed ${ALLOY.line}`, borderRadius:2 }}>
                    No connected integrations. Connect Google or other platforms first.
                  </div>
                )}
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={onClose} style={{ flex:1, background:ALLOY.paper, border:`1px solid ${ALLOY.line}`, borderRadius:2, padding:'10px', fontFamily:ALLOY.fontBody, fontSize:13, color:ALLOY.mute, cursor:'pointer' }}>Cancel</button>
                <button onClick={handleGenerate} disabled={selectedInteg.length===0}
                  style={{ flex:2, background:selectedInteg.length>0?ALLOY.blue1:ALLOY.line, border:'none', borderRadius:2, padding:'10px', fontFamily:ALLOY.fontLabel, fontSize:9, fontWeight:700, color:selectedInteg.length>0?ALLOY.white:ALLOY.mute, cursor:selectedInteg.length>0?'pointer':'not-allowed', letterSpacing:'0.08em', textTransform:'uppercase' as const }}>
                  Generate Dashboard
                </button>
              </div>
            </>
          )}

          {step==='thinking' && (
            <div style={{ padding:'32px 0', textAlign:'center' as const }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:ALLOY.blue4, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <RefreshCw size={22} style={{ color:ALLOY.blue1, animation:'alloy-spin 0.8s linear infinite' }}/>
              </div>
              <p style={{ fontFamily:ALLOY.fontDisplay, fontSize:14, fontWeight:600, color:ALLOY.ink, marginBottom:8 }}>Generating your smart dashboard…</p>
              <p style={{ fontFamily:ALLOY.fontBody, fontSize:12, color:ALLOY.mute }}>Pulling data from {selectedInteg.length} integration{selectedInteg.length!==1?'s':''}</p>
            </div>
          )}

          {step==='done' && (
            <div style={{ padding:'24px 0', textAlign:'center' as const }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:ALLOY.blue4, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                <CheckCircle2 size={24} style={{ color:ALLOY.blue1 }}/>
              </div>
              <p style={{ fontFamily:ALLOY.fontDisplay, fontSize:14, fontWeight:600, color:ALLOY.blue1 }}>Dashboard generated!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
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
  const [mappingProp, setMappingProp] = useState('')
  const [mappingPropName, setMappingPropName] = useState('')
  const [mappingSite, setMappingSite] = useState('')
  const [savingMapping, setSavingMapping] = useState(false)
  const [mappingSaved, setMappingSaved] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [shareToast, setShareToast] = useState<string|null>(null)
  const [fullscreenWidget, setFullscreenWidget] = useState<Widget|null>(null)
  const [shareCapture, setShareCapture] = useState<{wid:string;title:string}|null>(null)
  const [shareEmailInput, setShareEmailInput] = useState('')
  const [shareLinkCopied, setShareLinkCopied] = useState(false)
  const [shareSubmenu, setShareSubmenu] = useState<'pdf'|'email'|'link'|null>(null)

  // ── NEW: empty-canvas modal states ──
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showAIBuildModal, setShowAIBuildModal] = useState(false)
  const [showSmartDashModal, setShowSmartDashModal] = useState(false)
  const [showCloneModal, setShowCloneModal] = useState(false)

  const LS_KEY        = `alloy_dashboards_${clientId}`
  const LS_CLONED_KEY = `alloy_cloned_dashboards_${clientId}`
  const LS_WIDGETS_KEY= `alloy_widgets_${clientId}`
  const LS_ORDER_KEY  = `alloy_widget_order_${clientId}`
  const LS_REMOVED_KEY= `alloy_removed_widgets_${clientId}`

  const [dashboards, setDashboards] = useState<string[]>(() => {
    if(typeof window==='undefined') return INITIAL_DASHBOARDS
    try { const s=localStorage.getItem(LS_KEY); return s?JSON.parse(s):INITIAL_DASHBOARDS } catch { return INITIAL_DASHBOARDS }
  })
  const [clonedDashboards, setClonedDashboards] = useState<string[]>(() => {
    if(typeof window==='undefined') return []
    try { const s=localStorage.getItem(LS_CLONED_KEY); return s?JSON.parse(s):[] } catch { return [] }
  })
  const [dashMenu, setDashMenu] = useState<string|null>(null)
  const [renamingDash, setRenamingDash] = useState<string|null>(null)
  const [renameValue, setRenameValue] = useState('')

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
    if(typeof window==='undefined') return DEFAULT_WIDGETS
    try {
      const s=localStorage.getItem(LS_WIDGETS_KEY)
      if(s) {
        const parsed: Widget[]=JSON.parse(s)
        const defaults=DEFAULT_WIDGETS.map(def => { const sw=parsed.find((x:Widget)=>x.id===def.id); return sw?{...def,...sw,value:def.value,change:def.change,up:def.up}:def })
        const defaultIds=new Set(DEFAULT_WIDGETS.map(d=>d.id))
        const dynamic=parsed.filter((x:Widget)=>!defaultIds.has(x.id))
        return [...defaults,...dynamic]
      }
    } catch {}
    return DEFAULT_WIDGETS
  })
  const [removedWidgetIds, setRemovedWidgetIds] = useState<Set<string>>(() => {
    try { const s=localStorage.getItem(LS_REMOVED_KEY); return s?new Set(JSON.parse(s) as string[]):new Set<string>() } catch { return new Set() }
  })
  const [widgetOrder, setWidgetOrder] = useState<string[]>(() => {
    try { const s=localStorage.getItem(LS_ORDER_KEY); return s?JSON.parse(s):[] } catch { return [] }
  })
  const [widgetSizes, setWidgetSizes] = useState<{[id:string]:{w:number;h:number}}>({})
  const [dragId, setDragId] = useState<string|null>(null)
  const [dragOver, setDragOver] = useState<string|null>(null)
  const [resizingId, setResizingId] = useState<string|null>(null)
  const dragIdRef = React.useRef<string|null>(null)
  const justDroppedRef = React.useRef(false)

  const isWidgetRemoved = (id: string) => removedWidgetIds.has(id)
  const isEmptyDash = !REAL_DASHBOARDS.includes(activeDash) && !clonedDashboards.includes(activeDash)

  // Persist dashboards
  useEffect(() => { try { localStorage.setItem(LS_KEY, JSON.stringify(dashboards)) } catch {} }, [dashboards])
  useEffect(() => { try { localStorage.setItem(LS_CLONED_KEY, JSON.stringify(clonedDashboards)) } catch {} }, [clonedDashboards])
  useEffect(() => {
    try {
      const toSave=widgets.map(w=>({...w,value:undefined,change:undefined,up:undefined}))
      localStorage.setItem(LS_WIDGETS_KEY, JSON.stringify(toSave))
    } catch {}
  }, [widgets])

  useEffect(() => { loadClientInfo(); checkConnection().then(()=>loadMapping()) }, [clientId])

  async function loadClientInfo() {
    if(clientName) return
    try {
      const {createClient}=await import('@/lib/supabase/client')
      const sb=createClient()
      const {data}=await sb.from('clients').select('name,domain').eq('id',clientId).single()
      if(data?.name) { setClientName(data.name); setClientDomain((data.domain||'').replace(/^https?:\/\//,'').replace(/^www\./,'').split('/')[0]) }
    } catch {}
  }
  async function checkConnection() {
    setCheckingConn(true)
    try {
      const res=await fetch(`/api/connection?client_id=${clientId}`)
      const data=await res.json()
      setConnection(data)
      if(data.connected && data.ga4_properties?.length>0) setSelectedProperty(data.ga4_properties[0].name)
    } catch { setConnection({connected:false}) }
    finally { setCheckingConn(false) }
  }
  async function loadMapping() {
    try {
      const res=await fetch(`/api/mapping?client_id=${clientId}`)
      const data=await res.json()
      if(data.ga4_property_id) { setSelectedProperty(data.ga4_property_id); setMappingProp(data.ga4_property_id); setMappingPropName(data.ga4_property_name||''); setMappingSite(data.gsc_site_url||''); fetchGA4(data.ga4_property_id) }
      else fetchGA4()
    } catch { fetchGA4() }
  }
  async function fetchGA4(propertyId?: string) {
    const pid=propertyId||selectedProperty
    if(!pid) return
    setLoadingData(true)
    try {
      const res=await fetch(`/api/ga4?client_id=${clientId}&property_id=${pid}&start_date=${dateRange}&end_date=today`)
      const data=await res.json()
      if(data.connected) {
        setGa4Data(data)
        const totals=data.timeSeries?.totals?.[0]
        const sessions=parseInt(totals?.metricValues?.[0]?.value||'0')
        const users=parseInt(totals?.metricValues?.[1]?.value||'0')
        const conversions=parseInt(totals?.metricValues?.[2]?.value||'0')
        const eng=parseFloat(totals?.metricValues?.[4]?.value||'0')
        setWidgets(prev=>prev.map(w=>{
          if(w.id==='w1') return {...w,value:formatNum(sessions)}
          if(w.id==='w2') return {...w,value:formatNum(conversions)}
          if(w.id==='w3') return {...w,value:formatNum(users)}
          if(w.id==='w4') return {...w,value:(eng*100).toFixed(2)+'%'}
          return w
        }))
      }
    } catch {}
    finally { setLoadingData(false) }
  }
  async function saveMapping() {
    setSavingMapping(true)
    try {
      await fetch('/api/mapping',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({client_id:clientId,ga4_property_id:mappingProp,ga4_property_name:mappingPropName,gsc_site_url:mappingSite})})
      setSelectedProperty(mappingProp); fetchGA4(mappingProp); setMappingSaved(true)
      setTimeout(()=>{ setMappingSaved(false); setShowMappingModal(false) },1500)
    } catch {}
    setSavingMapping(false)
  }
  function connectGoogle() { window.location.href=`/api/auth/google?state=${clientId}` }
  async function disconnect() { await fetch(`/api/connection?client_id=${clientId}`,{method:'DELETE'}); setConnection({connected:false}); setGa4Data(null) }

  const sessionData=ga4Data?.timeSeries?.rows?.map((r:any)=>({d:r.dimensionValues[0].value.slice(4),v:parseInt(r.metricValues[0].value)}))||STATIC_SESSIONS
  const deviceData=ga4Data?.devices?.rows?.map((r:any)=>({name:r.dimensionValues[0].value,v:parseInt(r.metricValues[0].value)}))||STATIC_DEVICES
  const sourceData=ga4Data?.sources?.rows?.map((r:any,i:number)=>({name:r.dimensionValues[0].value,value:parseInt(r.metricValues[0].value),color:['#2196f3','#64b5f6',ALLOY.blue3,'#bbdefb','#e3f2fd'][i%5]}))||STATIC_DONUT
  const cityData=ga4Data?.cities?.rows?.map((r:any)=>({city:r.dimensionValues[0].value,val:parseInt(r.metricValues[0].value),pct:100}))||STATIC_CITIES
  const maxCity=Math.max(...cityData.map((c:any)=>c.val),1)

  function getWidgetData(w: any): {d:string;v:number}[] {
    const dims:string[]=(w.dimensions?.length>0?w.dimensions:null)||['Date']
    const mets:string[]=(w.metrics?.length>0?w.metrics:null)||['Sessions']
    const metIdx:Record<string,number>={'Sessions':0,'Total Users':1,'Conversions':2,'Bounce Rate':3,'Engagement Rate':4,'Average Session Duration':5}
    const mi=metIdx[mets[0]]??0
    if(dims[0]==='Device Category') return ga4Data?.devices?.rows?.map((r:any)=>({d:r.dimensionValues?.[0]?.value||'',v:parseFloat(r.metricValues?.[0]?.value||'0')}))||STATIC_DEVICES.map(d=>({d:d.name,v:d.v}))
    if(dims[0]==='City') return ga4Data?.cities?.rows?.map((r:any)=>({d:r.dimensionValues?.[0]?.value||'',v:parseFloat(r.metricValues?.[0]?.value||'0')}))||STATIC_CITIES.map(c=>({d:c.city,v:c.val}))
    if(dims[0]==='Session Source'||dims[0]==='Default Channel Group'||dims[0]==='Session Medium') return ga4Data?.sources?.rows?.map((r:any)=>({d:r.dimensionValues?.[0]?.value||'',v:parseFloat(r.metricValues?.[0]?.value||'0')}))||STATIC_DONUT.map(d=>({d:d.name,v:d.value}))
    if(!ga4Data) return STATIC_SESSIONS
    const rows=ga4Data.timeSeries?.rows||[]
    if(rows.length===0) return STATIC_SESSIONS
    return rows.map((r:any)=>({d:r.dimensionValues?.[0]?.value?.length===8?r.dimensionValues[0].value.slice(4):(r.dimensionValues?.[0]?.value||''),v:parseFloat(r.metricValues?.[mi]?.value||r.metricValues?.[0]?.value||'0')}))
  }

  const STATIC_IDS=['w1','w2','w3','w4','c1','c2','c3','d1','d2','d3','v1','bounce']
  const dynamicWidgets=widgets.filter(w=>!STATIC_IDS.includes(w.id))

  function handleDragStart(id:string,e?:React.DragEvent){if(!editMode)return;dragIdRef.current=id;setDragId(id);if(e?.dataTransfer){e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',id)}}
  function handleDragEnd(){setDragId(null);setDragOver(null)}
  function handleDrop(e:React.DragEvent,targetId:string){
    e.preventDefault();e.stopPropagation()
    const srcId=dragIdRef.current;dragIdRef.current=null;setDragId(null);setDragOver(null)
    justDroppedRef.current=true;setTimeout(()=>{justDroppedRef.current=false},300)
    if(!editMode||!srcId||srcId===targetId)return
    const allIds=[...widgets.filter(w=>!isWidgetRemoved(w.id)).map(w=>w.id),...['c1','c2','c3','d1','d2','d3','v1','bounce'].filter(id=>!isWidgetRemoved(id)),...dynamicWidgets.filter(w=>!isWidgetRemoved(w.id)).map(w=>w.id)]
    let order=widgetOrder.length?[...widgetOrder]:[...allIds]
    allIds.forEach(id=>{if(!order.includes(id))order.push(id)})
    const fi=order.indexOf(srcId),ti=order.indexOf(targetId)
    if(fi<0||ti<0)return
    const next=[...order];next.splice(fi,1);next.splice(ti,0,srcId)
    setWidgetOrder(next);try{localStorage.setItem(LS_ORDER_KEY,JSON.stringify(next))}catch{}
  }

  function startEdit(w:Widget){setEditingWidget({...w});setEditTab('General');setOpenMenu(null);setActiveRightPanel(null)}
  function saveWidget(){
    if(!editingWidget)return
    setWidgets(prev=>prev.map(w=>w.id===editingWidget.id?editingWidget:w))
    setEditingWidget(null)
  }
  function addWidget(chartType:string,label:string){
    const newId=`w${Date.now()}`
    const nw:Widget={id:newId,title:label,dataSource:'google-analytics-4 / sessions',chartType,tooltip:`${label} from Google Analytics`,color:'white',value:'—',change:'',up:true}
    setWidgets(prev=>[...prev,nw])
    setEditingWidget(nw);setEditTab('General')
  }

  // ── Handler: template selected ──────────────────────────────────────────────
  function handleTemplateSelect(name: string) {
    setShowTemplateModal(false)
    // If this is already a real dashboard, just navigate to it
    if(REAL_DASHBOARDS.includes(name)) { setActiveDash(name); return }
    // Otherwise create a new cloned entry
    const newName = dashboards.includes(name) ? name+' (2)' : name
    setDashboards(prev=>prev.includes(newName)?prev:[...prev,newName])
    setClonedDashboards(prev=>prev.includes(newName)?prev:[...prev,newName])
    setActiveDash(newName)
    setShareToast(`"${newName}" created from template`)
    setTimeout(()=>setShareToast(null),2500)
  }

  // ── Handler: AI dashboard generated ────────────────────────────────────────
  function handleAIGenerate(name: string) {
    setShowAIBuildModal(false)
    const newName = dashboards.includes(name) ? name+' (AI)' : name
    setDashboards(prev=>prev.includes(newName)?prev:[...prev,newName])
    setClonedDashboards(prev=>prev.includes(newName)?prev:[...prev,newName])
    setActiveDash(newName)
    setShareToast(`"${newName}" built with AI`)
    setTimeout(()=>setShareToast(null),2500)
  }

  // ── Handler: Smart dashboard generated ─────────────────────────────────────
  function handleSmartGenerate(name: string) {
    setShowSmartDashModal(false)
    const newName = dashboards.includes(name) ? name+' (2)' : name
    setDashboards(prev=>prev.includes(newName)?prev:[...prev,newName])
    setClonedDashboards(prev=>prev.includes(newName)?prev:[...prev,newName])
    setActiveDash(newName)
    setShareToast(`"${newName}" generated`)
    setTimeout(()=>setShareToast(null),2500)
  }

  function WidgetDot({ wid, onEdit, widget }: { wid:string; onEdit:()=>void; widget?:Widget }) {
    const isOpen=openMenu===wid
    const resolvedWidget:Widget|undefined=widget||widgets.find(w=>w.id===(wid.startsWith('static__')?wid.replace('static__',''):wid))
    return (
      <div style={{position:'relative',display:'inline-flex'}}>
        <button onClick={e=>{e.stopPropagation();setOpenMenu(isOpen?null:wid)}} style={{background:'rgba(255,255,255,0.92)',border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'2px 6px',cursor:'pointer',display:'flex',alignItems:'center'}}>
          <MoreHorizontal size={13} style={{color:ALLOY.ink}}/>
        </button>
        {isOpen && (
          <div className="alloy-dropdown" style={{position:'absolute',right:0,top:'calc(100% + 4px)',background:ALLOY.white,border:`1px solid ${ALLOY.line}`,borderRadius:2,boxShadow:'0 4px 16px rgba(0,0,0,0.10)',padding:'4px 0',minWidth:168,zIndex:999}} onClick={e=>e.stopPropagation()}>
            {[
              {icon:<Edit size={12} strokeWidth={1.5}/>,label:'Edit',action:()=>{onEdit();setOpenMenu(null)}},
              {icon:<Maximize2 size={12} strokeWidth={1.5}/>,label:'Full Screen',action:()=>{setOpenMenu(null);if(resolvedWidget)setFullscreenWidget(resolvedWidget)}},
              {icon:<Copy size={12} strokeWidth={1.5}/>,label:'Copy',action:()=>{setOpenMenu(null);if(resolvedWidget)navigator.clipboard?.writeText(resolvedWidget.title||'').catch(()=>{})}},
              {icon:<LayoutGrid size={12} strokeWidth={1.5}/>,label:'Clone',action:()=>{
                setOpenMenu(null)
                if(!resolvedWidget)return
                const cloneId=`w${Date.now()}`
                const cloned:Widget={...resolvedWidget,id:cloneId,title:resolvedWidget.title+' (Copy)'}
                setWidgets(prev=>[...prev,cloned])
                setShareToast(`"${resolvedWidget.title}" cloned`)
                setTimeout(()=>setShareToast(null),2500)
              }},
            ].map(item=>(
              <div key={item.label} onClick={item.action} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 14px',fontFamily:ALLOY.fontBody,fontSize:12,color:ALLOY.ink,cursor:'pointer',borderLeft:'2px solid transparent'}} onMouseEnter={e=>{const el=e.currentTarget as HTMLDivElement;el.style.background=ALLOY.green4;el.style.borderLeft=`2px solid ${ALLOY.green1}`}} onMouseLeave={e=>{const el=e.currentTarget as HTMLDivElement;el.style.background='none';el.style.borderLeft='2px solid transparent'}}>
                {item.icon}<span>{item.label}</span>
              </div>
            ))}
            <div style={{height:1,background:ALLOY.line,margin:'4px 0'}}/>
            <div onClick={()=>{
              setOpenMenu(null)
              if(!resolvedWidget)return
              const rawId=wid.startsWith('static__')?wid.replace('static__',''):wid
              if(STATIC_IDS.includes(rawId)){setRemovedWidgetIds(prev=>{const next=new Set(Array.from(prev).concat(rawId));try{localStorage.setItem(LS_REMOVED_KEY,JSON.stringify(Array.from(next)))}catch{};return next})}
              else{setWidgets(prev=>prev.filter(w=>w.id!==rawId))}
              if(editingWidget?.id===rawId)setEditingWidget(null)
            }} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 14px',fontFamily:ALLOY.fontBody,fontSize:12,color:ALLOY.red1,cursor:'pointer',borderLeft:'2px solid transparent'}} onMouseEnter={e=>{const el=e.currentTarget as HTMLDivElement;el.style.background=ALLOY.red4;el.style.borderLeft=`2px solid ${ALLOY.red1}`}} onMouseLeave={e=>{const el=e.currentTarget as HTMLDivElement;el.style.background='none';el.style.borderLeft='2px solid transparent'}}>
              <Trash2 size={12} strokeWidth={1.5}/><span>Remove</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  function ResizeHandle({ id }: { id: string }) {
    if(!editMode) return null
    const handleMouseDown=(e:React.MouseEvent)=>{
      e.preventDefault();e.stopPropagation()
      const el=(e.currentTarget as HTMLElement).closest('[data-widget-id]') as HTMLElement
      if(!el)return
      const rect=el.getBoundingClientRect(),startX=e.clientX,startY=e.clientY,startW=rect.width,startH=rect.height
      const overlay=document.createElement('div');overlay.style.cssText='position:fixed;inset:0;z-index:99999;cursor:se-resize;'
      document.body.appendChild(overlay);setResizingId(id)
      const onMove=(mv:MouseEvent)=>{const nw=Math.max(160,startW+mv.clientX-startX),nh=Math.max(100,startH+mv.clientY-startY);el.style.width=nw+'px';el.style.minWidth=nw+'px';el.style.height=nh+'px'}
      const onUp=(mv:MouseEvent)=>{const nw=Math.max(160,startW+mv.clientX-startX),nh=Math.max(100,startH+mv.clientY-startY);setWidgetSizes(prev=>({...prev,[id]:{w:nw,h:nh}}));setResizingId(null);document.body.removeChild(overlay);window.removeEventListener('mousemove',onMove);window.removeEventListener('mouseup',onUp)}
      window.addEventListener('mousemove',onMove);window.addEventListener('mouseup',onUp)
    }
    return (
      <div onMouseDown={handleMouseDown} style={{position:'absolute',bottom:0,right:0,width:20,height:20,cursor:'se-resize',zIndex:30,display:'flex',alignItems:'flex-end',justifyContent:'flex-end',padding:'3px',opacity:0.35}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.opacity='1'} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.opacity='0.35'}>
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 10 L10 2" stroke={ALLOY.mute} strokeWidth="1.5" strokeLinecap="round"/><path d="M5.5 10 L10 5.5" stroke={ALLOY.mute} strokeWidth="1.5" strokeLinecap="round"/><path d="M9 10 L10 9" stroke={ALLOY.mute} strokeWidth="1.5" strokeLinecap="round"/></svg>
      </div>
    )
  }

  function KPICard({ w }: { w: Widget }) {
    const c=KPI_BG[w.color]||KPI_BG.white,isWhite=w.color==='white',isSelected=editingWidget?.id===w.id
    const bgColor=w.bgHex||c.bg,borderCol=isSelected&&editMode?ALLOY.green1:(w.borderColor||c.border),textCol=w.textColor||c.text
    const isKpiType=!w.chartType||w.chartType==='scorecard'||w.chartType==='sparkline'
    const selectedRing=isSelected&&editMode?{border:`2.5px solid ${ALLOY.green1}`,boxShadow:`0 0 0 4px ${ALLOY.green4}`}:{}
    if(!isKpiType){
      return(
        <div data-widget-id={w.id} onClick={e=>{e.stopPropagation();if(justDroppedRef.current)return;if(editMode)startEdit(w)}} style={{background:ALLOY.white,borderRadius:2,padding:12,position:'relative',minHeight:widgetSizes[w.id]?.h||130,cursor:editMode?'pointer':'default',transition:'border-color 0.15s,opacity 0.15s',opacity:editMode&&editingWidget&&!isSelected?0.45:1,border:`2px solid ${borderCol}`,...selectedRing,...(widgetSizes[w.id]?{width:widgetSizes[w.id].w,minWidth:widgetSizes[w.id].w,flex:'0 0 auto'}:{flex:'1 1 220px'})}}>
          {editMode&&<div style={{position:'absolute',top:6,left:6,cursor:'grab',color:ALLOY.line}}><Grip size={13}/></div>}
          {editMode&&<div onClick={e=>e.stopPropagation()} style={{position:'absolute',top:6,right:6,zIndex:10,display:'flex',gap:4}}><WidgetDot wid={w.id} onEdit={()=>startEdit(w)} widget={w}/></div>}
          <ResizeHandle id={w.id}/>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
            <span style={{fontSize:11,color:ALLOY.mute,fontWeight:500,fontFamily:ALLOY.fontBody}}>{w.title}</span>
            {connection?.connected&&<span style={{fontSize:9,color:ALLOY.green1,fontWeight:600,fontFamily:ALLOY.fontLabel}}>● Live</span>}
          </div>
          <DynamicChart chartType={w.chartType} data={getWidgetData(w)} height={90} dimensions={(w as any).dimensions} metrics={(w as any).metrics}/>
        </div>
      )
    }
    return(
      <div data-widget-id={w.id} onClick={e=>{e.stopPropagation();if(justDroppedRef.current)return;if(editMode)startEdit(w)}} style={{background:bgColor,borderRadius:2,padding:16,position:'relative',minHeight:widgetSizes[w.id]?.h||110,cursor:editMode?'pointer':'default',transition:'border-color 0.15s,opacity 0.15s',opacity:editMode&&editingWidget&&!isSelected?0.45:1,border:`2px solid ${borderCol}`,...selectedRing,...(widgetSizes[w.id]?{width:widgetSizes[w.id].w,minWidth:widgetSizes[w.id].w,flex:'0 0 auto'}:{flex:'1 1 180px'})}}>
        {editMode&&<div style={{position:'absolute',top:6,left:6,cursor:'grab',color:isWhite?ALLOY.line:'rgba(255,255,255,0.35)'}}><Grip size={13}/></div>}
        {editMode&&<div onClick={e=>e.stopPropagation()} style={{position:'absolute',top:6,right:6,zIndex:10,display:'flex',gap:4}}><WidgetDot wid={w.id} onEdit={()=>startEdit(w)} widget={w}/></div>}
        <ResizeHandle id={w.id}/>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10}}>
          <span style={{fontSize:12,color:c.sub,fontWeight:500,fontFamily:ALLOY.fontBody}}>{w.title}</span>
          {w.change&&<span style={{fontSize:10,fontWeight:700,padding:'2px 6px',borderRadius:2,fontFamily:ALLOY.fontLabel,color:isWhite?(w.up?ALLOY.green1:ALLOY.red1):'rgba(255,255,255,0.95)',background:isWhite?(w.up?ALLOY.green4:ALLOY.red4):'rgba(255,255,255,0.18)'}}>{w.up?'▲':'▼'} {w.change}</span>}
        </div>
        <p style={{fontSize:30,fontWeight:700,color:textCol,letterSpacing:'-0.5px',lineHeight:1,fontFamily:ALLOY.fontDisplay}}>{w.value||'—'}</p>
        {connection?.connected&&<p style={{fontSize:9,color:isWhite?ALLOY.green1:'rgba(255,255,255,0.7)',marginTop:4,fontFamily:ALLOY.fontLabel}}>● Live</p>}
        {w.chartType==='sparkline'&&<div style={{marginTop:6}}><DynamicChart chartType="sparkline" data={getWidgetData(w)} height={35} dimensions={(w as any).dimensions} metrics={(w as any).metrics}/></div>}
      </div>
    )
  }

  function ChartCard({ id, children }: { id:string; children:React.ReactNode }) {
    const w=widgets.find(x=>x.id===id)||widgets[0],isSelected=editingWidget?.id===w.id,sz=widgetSizes[id]
    return(
      <div data-widget-id={w.id} onClick={e=>{e.stopPropagation();if(justDroppedRef.current)return;if(editMode)startEdit(w)}} style={{background:ALLOY.white,borderRadius:2,padding:16,position:'relative',cursor:editMode?'pointer':'default',transition:'border-color 0.15s,opacity 0.15s',opacity:editMode&&editingWidget&&!isSelected?0.45:1,...(isSelected&&editMode?{border:`2.5px solid ${ALLOY.green1}`,boxShadow:`0 0 0 4px ${ALLOY.green4}`}:{border:`2px solid ${ALLOY.line}`}),...(sz?{width:sz.w,minWidth:sz.w,minHeight:sz.h,flex:'0 0 auto'}:{flex:'1 1 260px'})}}>
        {editMode&&<div style={{position:'absolute',top:6,left:6,cursor:'grab',color:ALLOY.line}}><Grip size={13}/></div>}
        {editMode&&<div onClick={e=>e.stopPropagation()} style={{position:'absolute',top:6,right:6,zIndex:10,display:'flex',gap:4}}><WidgetDot wid={`static__${id}`} onEdit={()=>startEdit(w)} widget={w}/></div>}
        <ResizeHandle id={w.id}/>
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
      @keyframes alloy-scalein   { from { opacity:0; transform:scale(0.96) } to { opacity:1; transform:scale(1) } }
      @keyframes alloy-spin      { to { transform:rotate(360deg) } }
      @keyframes alloy-pulse     { 0%,100%{opacity:1} 50%{opacity:0.45} }
      .alloy-fadein    { animation: alloy-fadein  0.18s ease both }
      .alloy-modal-bg  { animation: alloy-fadein  0.18s ease both }
      .alloy-modal-card{ animation: alloy-scalein 0.22s cubic-bezier(0.16,1,0.3,1) both }
      .alloy-dropdown  { animation: alloy-slidedown 0.16s cubic-bezier(0.16,1,0.3,1) both }
    `}</style>
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden',background:ALLOY.white,fontFamily:ALLOY.fontBody}}
      onClick={()=>{if(openMenu)setOpenMenu(null);if(dashMenu)setDashMenu(null);if(showShareMenu)setShowShareMenu(false)}}>

      {/* ── Edit mode topbar ── */}
      {editMode && (
        <>
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 16px',borderBottom:`1px solid ${ALLOY.line}`,background:ALLOY.white,flexShrink:0}}>
            <span style={{fontSize:14,fontWeight:700,color:ALLOY.ink,fontFamily:ALLOY.fontDisplay}}>Dashboard</span>
            <div style={{width:1,height:16,background:ALLOY.line}}/>
            <div style={{width:24,height:24,borderRadius:2,overflow:'hidden',background:ALLOY.paper,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
              {clientDomain?<img src={`https://www.google.com/s2/favicons?domain=${clientDomain}&sz=64`} alt={clientName} style={{width:20,height:20,objectFit:'contain'}} onError={e=>(e.currentTarget as HTMLImageElement).style.display='none'}/>:<span style={{fontSize:11,fontWeight:700,color:ALLOY.mute,fontFamily:ALLOY.fontLabel}}>{clientName?.[0]?.toUpperCase()||''}</span>}
            </div>
            <span style={{fontSize:13,fontWeight:600,color:ALLOY.ink,fontFamily:ALLOY.fontBody}}>{clientName}</span>
            <span style={{fontSize:11,background:ALLOY.paper,color:ALLOY.mute,padding:'2px 8px',borderRadius:2,fontFamily:ALLOY.fontLabel,letterSpacing:'0.06em',textTransform:'uppercase' as const}}>Client</span>
            <button onClick={()=>{setEditMode(false);setEditingWidget(null);setOpenMenu(null)}} style={{marginLeft:'auto',width:28,height:28,borderRadius:'50%',background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><X size={14} style={{color:ALLOY.ink}}/></button>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:6,padding:'8px 16px',borderBottom:`1px solid ${ALLOY.line}`,background:ALLOY.white,flexShrink:0}}>
            <div style={{display:'flex',gap:1,background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:2}}>
              <button onClick={()=>setLiveData(true)} style={{padding:'5px 14px',borderRadius:2,fontSize:9,fontWeight:700,fontFamily:ALLOY.fontLabel,letterSpacing:'0.06em',textTransform:'uppercase' as const,background:liveData?ALLOY.blue1:'transparent',color:liveData?ALLOY.white:ALLOY.mute,border:'none',cursor:'pointer'}}>Live Data</button>
              <button onClick={()=>setLiveData(false)} style={{padding:'5px 14px',borderRadius:2,fontSize:9,fontWeight:700,fontFamily:ALLOY.fontLabel,letterSpacing:'0.06em',textTransform:'uppercase' as const,background:!liveData?ALLOY.white:'transparent',color:!liveData?ALLOY.ink:ALLOY.mute,border:'none',cursor:'pointer'}}>Sample Data</button>
            </div>
            <button style={{background:'none',border:'none',cursor:'pointer',color:ALLOY.mute,display:'flex',padding:'4px 5px'}}><RotateCcw size={14}/></button>
            <button style={{background:'none',border:'none',cursor:'pointer',color:ALLOY.mute,display:'flex',padding:'4px 5px'}}><RotateCw size={14}/></button>
            <div style={{width:1,height:14,background:ALLOY.line,margin:'0 2px'}}/>
            <button style={{background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'5px 8px',cursor:'pointer',display:'flex'}}><Monitor size={13} style={{color:ALLOY.ink}}/></button>
            <button style={{background:'transparent',border:'none',borderRadius:2,padding:'5px 8px',cursor:'pointer',display:'flex'}}><Smartphone size={13} style={{color:ALLOY.mute}}/></button>
            <div style={{marginLeft:'auto',display:'flex',gap:8,alignItems:'center'}}>
              <button style={{background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'6px 12px',fontFamily:ALLOY.fontBody,fontSize:12,color:ALLOY.ink,cursor:'pointer'}}>⊞ Page Setup</button>
              <button style={{background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'6px 12px',fontFamily:ALLOY.fontBody,fontSize:12,color:ALLOY.ink,cursor:'pointer'}}>◑ Theme</button>
              <button style={{background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'6px 12px',fontFamily:ALLOY.fontBody,fontSize:12,color:ALLOY.ink,cursor:'pointer',display:'flex',alignItems:'center',gap:5}}><Calendar size={12}/> Apr 1, 2026 - Apr 30, 2026 <ChevronDown size={11}/></button>
              <button style={{background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'6px 12px',fontFamily:ALLOY.fontBody,fontSize:12,color:ALLOY.ink,cursor:'pointer'}}>▶ Preview</button>
              <span style={{fontSize:11,color:ALLOY.mute,fontFamily:ALLOY.fontBody}}>☁ Auto saved</span>
            </div>
          </div>
        </>
      )}

      {/* ── View mode topbar ── */}
      {!editMode && (
        <div style={{padding:'10px 20px',borderBottom:`1px solid ${ALLOY.line}`,background:ALLOY.white,flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <Link href="/dashboard/clients" style={{fontSize:12,color:ALLOY.mute,textDecoration:'none',fontWeight:500,fontFamily:ALLOY.fontBody}}>Clients</Link>
            <ChevronRight size={12} style={{color:ALLOY.line}}/>
            <div style={{display:'flex',alignItems:'center',gap:8,background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'5px 10px'}}>
              <div style={{width:20,height:20,borderRadius:3,overflow:'hidden',background:ALLOY.line,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                {clientDomain?<img src={`https://www.google.com/s2/favicons?domain=${clientDomain}&sz=64`} alt={clientName} style={{width:'100%',height:'100%',objectFit:'contain'}} onError={e=>(e.currentTarget as HTMLImageElement).style.display='none'}/>:<span style={{fontSize:10,fontWeight:700,color:ALLOY.mute,fontFamily:ALLOY.fontLabel}}>{clientName?.[0]?.toUpperCase()||''}</span>}
              </div>
              <span style={{fontSize:13,fontWeight:700,color:ALLOY.ink,maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontFamily:ALLOY.fontDisplay}}>{clientName||'...'}</span>
              <ChevronDown size={12} style={{color:ALLOY.mute}}/>
            </div>
            <ChevronRight size={12} style={{color:ALLOY.line}}/>
            <span style={{fontSize:12,color:ALLOY.blue1,fontWeight:600,fontFamily:ALLOY.fontBody}}>{activeDash}</span>
            {!checkingConn && (connection?.connected?(
              <div style={{display:'flex',alignItems:'center',gap:6,background:ALLOY.green4,border:`1px solid ${ALLOY.green1}`,borderRadius:999,padding:'3px 10px'}}>
                <CheckCircle2 size={11} style={{color:ALLOY.green1}}/>
                <span style={{fontSize:11,color:ALLOY.green1,fontWeight:600,fontFamily:ALLOY.fontBody}}>{connection.email}</span>
                <button onClick={disconnect} style={{background:'none',border:'none',color:ALLOY.mute,cursor:'pointer',fontSize:11,marginLeft:4}}>✕</button>
              </div>
            ):(
              <button onClick={connectGoogle} style={{display:'flex',alignItems:'center',gap:6,background:ALLOY.green1,border:'none',borderRadius:2,padding:'4px 12px',color:ALLOY.ink,fontSize:9,fontWeight:700,cursor:'pointer',fontFamily:ALLOY.fontLabel,letterSpacing:'0.06em',textTransform:'uppercase' as const}}><Plus size={11}/> Connect Google</button>
            ))}
            <div style={{marginLeft:'auto',display:'flex',gap:8}}>
              <button style={{display:'flex',alignItems:'center',gap:6,background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'6px 12px',fontFamily:ALLOY.fontBody,fontSize:12,color:ALLOY.ink,cursor:'pointer'}}><Sparkles size={13} style={{color:ALLOY.yellow1}}/> Ask AI</button>
              <button style={{display:'flex',alignItems:'center',gap:6,background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'6px 12px',fontFamily:ALLOY.fontBody,fontSize:12,color:ALLOY.ink,cursor:'pointer'}}><Settings size={13}/> Settings</button>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center'}}>
            {TABS.map(tab=>(
              <button key={tab} onClick={()=>setActiveTab(tab)} style={{padding:'8px 14px',fontFamily:ALLOY.fontBody,fontSize:12,fontWeight:500,cursor:'pointer',background:'none',border:'none',color:activeTab===tab?ALLOY.blue1:ALLOY.mute,borderBottom:activeTab===tab?`2px solid ${ALLOY.blue1}`:'2px solid transparent'}}>{tab}</button>
            ))}
            <div style={{marginLeft:'auto',display:'flex',gap:8,alignItems:'center'}}>
              {connection?.connected&&connection.ga4_properties?.length>0&&(
                <div style={{display:'flex',alignItems:'center',gap:4}}>
                  <select value={selectedProperty} onChange={e=>{setSelectedProperty(e.target.value);fetchGA4(e.target.value)}} style={{background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'5px 10px',fontFamily:ALLOY.fontBody,fontSize:11,color:ALLOY.ink,maxWidth:200}}>
                    {connection.ga4_properties.map((p:any)=><option key={p.name} value={p.name}>{p.displayName||p.name}</option>)}
                  </select>
                  <button onClick={()=>{setMappingProp(selectedProperty);setShowMappingModal(true)}} style={{background:mappingPropName?ALLOY.green4:'#fff7ed',border:`1px solid ${mappingPropName?ALLOY.green1:ALLOY.yellow1}`,borderRadius:2,padding:'5px 8px',cursor:'pointer',fontFamily:ALLOY.fontBody,fontSize:11,color:mappingPropName?ALLOY.green1:'#f59e0b',fontWeight:600,whiteSpace:'nowrap' as const}}>{mappingPropName?'✓ Mapped':'⚙ Map Sources'}</button>
                </div>
              )}
              <select value={dateRange} onChange={e=>{setDateRange(e.target.value);fetchGA4(undefined)}} style={{background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'5px 10px',fontFamily:ALLOY.fontBody,fontSize:11,color:ALLOY.ink}}>
                <option value="7daysAgo">Last 7 days</option>
                <option value="30daysAgo">Last 30 days</option>
                <option value="90daysAgo">Last 90 days</option>
              </select>
              {connection?.connected&&<button onClick={()=>fetchGA4()} disabled={loadingData} style={{background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'6px 8px',cursor:'pointer',display:'flex'}}><RefreshCw size={13} style={{color:ALLOY.mute}}/></button>}
              <button style={{background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'6px 12px',fontFamily:ALLOY.fontBody,fontSize:12,color:ALLOY.ink,cursor:'pointer'}}>Share</button>
              <button style={{background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'6px 8px',cursor:'pointer'}}><Maximize2 size={13}/></button>
              <button onClick={()=>setEditMode(true)} style={{background:ALLOY.green1,border:'none',borderRadius:2,padding:'6px 16px',fontSize:11,color:ALLOY.ink,cursor:'pointer',fontWeight:700,fontFamily:ALLOY.fontLabel,letterSpacing:'0.06em',textTransform:'uppercase' as const}}>Edit Dashboards</button>
            </div>
          </div>
        </div>
      )}

      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* Left panel */}
        <div style={{width:220,minWidth:220,borderRight:`1px solid ${ALLOY.line}`,display:'flex',flexDirection:'column',background:ALLOY.white}}>
          <div style={{padding:12}}>
            <button onClick={()=>{const n=dashboards.filter(d=>d.startsWith('Untitled Dashboard')).length;const nm=n===0?'Untitled Dashboard':'Untitled Dashboard '+(n+1);setDashboards(prev=>[...prev,nm]);setActiveDash(nm)}} style={{width:'100%',display:'flex',alignItems:'center',gap:6,background:ALLOY.green1,border:'none',borderRadius:2,padding:'8px 12px',color:ALLOY.ink,fontSize:11,fontWeight:700,fontFamily:ALLOY.fontLabel,letterSpacing:'0.05em',textTransform:'uppercase' as const,cursor:'pointer'}}>
              <Plus size={13}/> {editMode?'Add blank dashboard':'Add Dashboard'}
            </button>
          </div>
          <div style={{flex:1,overflowY:'auto'}}>
            {dashboards.map(d=>(
              <div key={d} style={{position:'relative'}}>
                {renamingDash===d?(
                  <div style={{display:'flex',alignItems:'center',padding:'6px 10px',gap:6}}>
                    <input autoFocus value={renameValue} onChange={e=>setRenameValue(e.target.value)}
                      onKeyDown={e=>{if(e.key==='Enter'&&renameValue.trim()){const nn=renameValue.trim();setDashboards(prev=>prev.map(x=>x===d?nn:x));setClonedDashboards(prev=>prev.map(x=>x===d?nn:x));if(activeDash===d)setActiveDash(nn);setRenamingDash(null)}if(e.key==='Escape')setRenamingDash(null)}}
                      onBlur={()=>setRenamingDash(null)}
                      style={{flex:1,fontSize:13,border:`1px solid ${ALLOY.blue1}`,borderRadius:2,padding:'4px 8px',outline:'none',color:ALLOY.ink,fontFamily:ALLOY.fontBody}}/>
                  </div>
                ):(
                  <div style={{display:'flex',alignItems:'center',padding:'0 4px 0 0',background:activeDash===d?ALLOY.green4:'transparent',borderLeft:activeDash===d?`3px solid ${ALLOY.green1}`:'3px solid transparent'}} onMouseEnter={e=>{if(activeDash!==d)(e.currentTarget as HTMLDivElement).style.background=ALLOY.paper}} onMouseLeave={e=>{if(activeDash!==d)(e.currentTarget as HTMLDivElement).style.background='transparent'}}>
                    <button onClick={()=>setActiveDash(d)} style={{flex:1,textAlign:'left',padding:'8px 8px 8px 12px',fontSize:12,cursor:'pointer',background:'none',border:'none',fontFamily:ALLOY.fontBody,fontWeight:activeDash===d?600:400,color:activeDash===d?ALLOY.ink:ALLOY.mute,display:'flex',alignItems:'center',gap:6}}>
                      {editMode&&<Grip size={12} style={{color:ALLOY.line,flexShrink:0}}/>}
                      <span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d}</span>
                    </button>
                    <button onClick={e=>{e.stopPropagation();setDashMenu(dashMenu===d?null:d)}} style={{flexShrink:0,width:24,height:24,display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:'none',cursor:'pointer',borderRadius:2,opacity:0.4}} onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.opacity='1'} onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.opacity=dashMenu===d?'1':'0.4'}>
                      <MoreHorizontal size={14} style={{color:ALLOY.ink}}/>
                    </button>
                  </div>
                )}
                {dashMenu===d&&(
                  <div onClick={e=>e.stopPropagation()} style={{position:'absolute',left:8,top:'calc(100% + 2px)',background:ALLOY.white,border:`1px solid ${ALLOY.line}`,borderRadius:2,boxShadow:'0 8px 24px rgba(0,0,0,0.12)',padding:4,minWidth:200,zIndex:500}}>
                    {[{emoji:'✏️',label:'Edit',action:()=>{setActiveDash(d);setEditMode(true);setDashMenu(null)}},{emoji:'✍️',label:'Rename',action:()=>{setRenamingDash(d);setRenameValue(d);setDashMenu(null)}},{emoji:'⧉',label:'Clone',action:()=>{const nn=d+' (Copy)';setDashboards(prev=>[...prev,nn]);setClonedDashboards(prev=>[...prev,nn]);setActiveDash(nn);setDashMenu(null)}},{emoji:'💾',label:'Save as Template',action:()=>{try{const ex=JSON.parse(localStorage.getItem('alloy_templates')||'[]');ex.push({id:Date.now().toString(),name:d,desc:`Saved from ${clientName}`,client:clientName,saved:new Date().toISOString()});localStorage.setItem('alloy_templates',JSON.stringify(ex))}catch{};setDashMenu(null);setShareToast(`"${d}" saved as template`);setTimeout(()=>setShareToast(null),2500)}}].map(item=>(
                      <button key={item.label} onClick={item.action} style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'8px 14px',fontFamily:ALLOY.fontBody,fontSize:12,color:ALLOY.ink,background:'none',border:'none',cursor:'pointer',borderRadius:2,textAlign:'left' as const}}>{item.emoji} <span>{item.label}</span></button>
                    ))}
                    <div style={{height:1,background:ALLOY.paper,margin:'2px 0'}}/>
                    <button onClick={()=>{const rem=dashboards.filter(x=>x!==d);setDashboards(rem);setClonedDashboards(prev=>prev.filter(x=>x!==d));if(activeDash===d)setActiveDash(rem[0]||'');setDashMenu(null)}} style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'8px 14px',fontFamily:ALLOY.fontBody,fontSize:12,color:ALLOY.red1,background:'none',border:'none',cursor:'pointer',borderRadius:2}}>🗑️ <span>Delete</span></button>
                  </div>
                )}
              </div>
            ))}
            <div style={{padding:'10px 16px 4px'}}><p style={{fontFamily:ALLOY.fontLabel,fontSize:9,fontWeight:600,color:ALLOY.mute,textTransform:'uppercase' as const,letterSpacing:'0.1em'}}>DATA SOURCES</p></div>
            {DATA_SOURCES.map(s=>(
              <button key={s} onClick={()=>setOpenSrc(p=>{const n=new Set(p);n.has(s)?n.delete(s):n.add(s);return n})} style={{width:'100%',textAlign:'left',display:'flex',alignItems:'center',gap:8,padding:'7px 16px',fontFamily:ALLOY.fontBody,fontSize:12,cursor:'pointer',background:'none',border:'none',color:ALLOY.ink}}>
                <ChevronRight size={12} style={{transform:openSrc.has(s)?'rotate(90deg)':'none',transition:'0.15s',color:ALLOY.mute}}/>{s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Canvas ── */}
        <div id="alloy-canvas" style={{flex:1,display:'flex',flexDirection:'column',overflowY:isEmptyDash?'hidden':'auto',background:ALLOY.paper}} onClick={()=>{if(editingWidget)setEditingWidget(null)}}>
          <div style={{padding:'14px 20px',borderBottom:`1px solid ${ALLOY.line}`,background:ALLOY.white,display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:16,height:16,border:`2px solid ${ALLOY.ink}`,borderRadius:2}}/>
            <span style={{fontSize:14,fontWeight:700,color:ALLOY.ink,fontFamily:ALLOY.fontDisplay}}>{activeDash}</span>
            {loadingData&&<span style={{fontSize:11,color:ALLOY.blue1,marginLeft:8,fontFamily:ALLOY.fontBody}}>↻ Loading...</span>}
            {connection?.connected&&!loadingData&&!isEmptyDash&&<span style={{fontSize:11,color:ALLOY.green1,marginLeft:8,fontFamily:ALLOY.fontLabel}}>● Live GA4 data</span>}
          </div>

          {isEmptyDash ? (
            <div style={{flex:1,display:'flex'}}>
              <NewDashCanvas
                onTemplate={() => setShowTemplateModal(true)}
                onAI={() => setShowAIBuildModal(true)}
                onClone={() => setShowCloneModal(true)}
                onSmart={() => setShowSmartDashModal(true)}
              />
            </div>
          ) : (
            <div style={{padding:16}}>
              <div style={{background:ALLOY.ink,borderRadius:2,padding:'18px 24px',marginBottom:12}}>
                <h2 style={{fontSize:20,fontWeight:700,color:ALLOY.white,fontFamily:ALLOY.fontDisplay}}>{activeDash}</h2>
                {connection?.connected&&<p style={{fontSize:11,color:ALLOY.mute,marginTop:4,fontFamily:ALLOY.fontLabel,letterSpacing:'0.04em'}}>REAL-TIME DATA · {connection.email}</p>}
              </div>
              {editMode&&<p style={{fontFamily:ALLOY.fontLabel,fontSize:9,color:ALLOY.green1,letterSpacing:'0.08em',textTransform:'uppercase' as const,marginBottom:8,marginTop:4}}>↕ Drag widgets to reorder</p>}
              {(() => {
                const kpiIds=widgets.filter(w=>!isWidgetRemoved(w.id)).map(w=>w.id)
                const chartIds=['c1','c2','c3','d1','d2','d3','v1','bounce'].filter(id=>!isWidgetRemoved(id))
                const dynIds=dynamicWidgets.filter(w=>!isWidgetRemoved(w.id)).map(w=>w.id)
                const allIds=[...kpiIds,...chartIds,...dynIds]
                let ordered=widgetOrder.length?[...widgetOrder.filter((id:string)=>allIds.includes(id)),...allIds.filter(id=>!widgetOrder.includes(id))]:allIds
                let preview=[...ordered]
                if(dragId&&dragOver&&dragId!==dragOver){const fi=preview.indexOf(dragId),ti=preview.indexOf(dragOver);if(fi>=0&&ti>=0){preview.splice(fi,1);preview.splice(ti,0,dragId)}}
                const renderContent=(id:string)=>{
                  const kpiW=widgets.find(w=>w.id===id&&!['c1','c2','c3','d1','d2','d3','v1','bounce'].includes(w.id))
                  if(kpiW)return<KPICard w={kpiW}/>
                  if(id==='c1')return<ChartCard id="c1"><div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{fontSize:11,color:ALLOY.mute,fontWeight:500,fontFamily:ALLOY.fontBody}}>{widgets.find(x=>x.id==='c1')?.title||'Sessions Over Time'}</span>{connection?.connected&&<span style={{fontSize:9,color:ALLOY.green1,fontWeight:600,fontFamily:ALLOY.fontLabel}}>● Live</span>}</div><DynamicChart chartType={widgets.find(x=>x.id==='c1')?.chartType||'line'} data={getWidgetData(widgets.find(x=>x.id==='c1')||{})} height={80} dimensions={(widgets.find(x=>x.id==='c1') as any)?.dimensions} metrics={(widgets.find(x=>x.id==='c1') as any)?.metrics}/></ChartCard>
                  if(id==='c2')return<ChartCard id="c2"><div style={{display:'flex',alignItems:'center',justifyContent:'center',height:110}}><div style={{position:'relative',width:90,height:90}}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{v:44},{v:56}]} cx="50%" cy="50%" innerRadius={28} outerRadius={40} dataKey="v" startAngle={90} endAngle={-270}><Cell fill="#f9b62a"/><Cell fill="#e5e5e5"/></Pie></PieChart></ResponsiveContainer><div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:18,fontWeight:700,fontFamily:ALLOY.fontDisplay}}>44</span></div></div></div></ChartCard>
                  if(id==='c3')return<ChartCard id="c3"><div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{fontSize:11,color:ALLOY.mute,fontFamily:ALLOY.fontBody}}>Conversion Rate</span><span style={{fontSize:10,fontWeight:700,color:ALLOY.red1,background:ALLOY.red4,padding:'2px 5px',borderRadius:2,fontFamily:ALLOY.fontLabel}}>▼ 34%</span></div><span style={{fontSize:24,fontWeight:700,color:ALLOY.ink,fontFamily:ALLOY.fontDisplay}}>3%</span></ChartCard>
                  if(id==='bounce')return<div onClick={e=>{e.stopPropagation();if(editMode)startEdit(widgets[3])}} style={{background:ALLOY.red1,border:`2px solid ${ALLOY.red1}`,borderRadius:2,padding:16,position:'relative',cursor:editMode?'grab':'default',flex:'1 1 180px',minHeight:110}}>{editMode&&<div style={{position:'absolute',top:6,left:6,cursor:'grab',color:'rgba(255,255,255,0.35)'}}><Grip size={13}/></div>}{editMode&&<div onClick={e=>e.stopPropagation()} style={{position:'absolute',top:6,right:6,zIndex:10,display:'flex',gap:4}}><WidgetDot wid="bounce" onEdit={()=>startEdit(widgets[3])} widget={widgets[3]}/></div>}<div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{fontSize:11,color:'rgba(255,255,255,0.85)',fontFamily:ALLOY.fontBody}}>Bounce Rate</span><span style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.95)',background:'rgba(255,255,255,0.18)',padding:'2px 6px',borderRadius:2}}>▲ 6.84%</span></div><p style={{fontSize:26,fontWeight:700,color:ALLOY.white,letterSpacing:'-0.5px',fontFamily:ALLOY.fontDisplay}}>39.23%</p></div>
                  if(id==='d1')return<ChartCard id="d1"><div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:11,fontWeight:600,fontFamily:ALLOY.fontBody}}>{widgets.find(x=>x.id==='d1')?.title||'Users By Device'}</span>{connection?.connected&&<span style={{fontSize:9,color:ALLOY.green1,fontWeight:600,fontFamily:ALLOY.fontLabel}}>● Live</span>}</div><DynamicChart chartType={widgets.find(x=>x.id==='d1')?.chartType||'column'} data={getWidgetData(widgets.find(x=>x.id==='d1')||{})} height={110} dimensions={(widgets.find(x=>x.id==='d1') as any)?.dimensions} metrics={(widgets.find(x=>x.id==='d1') as any)?.metrics}/></ChartCard>
                  if(id==='d2')return<ChartCard id="d2"><div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:11,fontWeight:600,fontFamily:ALLOY.fontBody}}>Top Referral Sources</span>{connection?.connected&&<span style={{fontSize:9,color:ALLOY.green1,fontWeight:600,fontFamily:ALLOY.fontLabel}}>● Live</span>}</div><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{position:'relative',width:80,height:80,flexShrink:0}}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={sourceData} cx="50%" cy="50%" innerRadius={24} outerRadius={36} dataKey="value">{sourceData.map((_:any,i:number)=><Cell key={i} fill={['#2196f3','#64b5f6',ALLOY.blue3,'#bbdefb'][i%4]}/>)}</Pie></PieChart></ResponsiveContainer><div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:9,fontWeight:700,fontFamily:ALLOY.fontLabel}}>Sources</span></div></div><div style={{flex:1}}>{sourceData.slice(0,4).map((d:any,i:number)=><div key={d.name} style={{display:'flex',alignItems:'center',gap:4,marginBottom:3}}><div style={{width:6,height:6,borderRadius:'50%',background:['#2196f3','#64b5f6',ALLOY.blue3,'#bbdefb'][i%4],flexShrink:0}}/><span style={{fontSize:9,color:ALLOY.mute,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontFamily:ALLOY.fontBody}}>{d.name}</span><span style={{fontSize:9,fontWeight:600,fontFamily:ALLOY.fontBody}}>{d.value?.toLocaleString()}</span></div>)}</div></div></ChartCard>
                  if(id==='d3')return<ChartCard id="d3"><div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:12,fontWeight:600,fontFamily:ALLOY.fontBody}}>Traffic by Cities</span>{connection?.connected&&<span style={{fontSize:9,color:ALLOY.green1,fontWeight:600,fontFamily:ALLOY.fontLabel}}>● Live</span>}</div>{cityData.map((c:any)=><div key={c.city} style={{marginBottom:8}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}><span style={{fontSize:12,fontFamily:ALLOY.fontBody}}>{c.city}</span><span style={{fontSize:12,fontWeight:600,fontFamily:ALLOY.fontBody}}>{c.val?.toLocaleString()}</span></div><div style={{height:4,background:ALLOY.line,borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:`${(c.val/maxCity)*100}%`,background:ALLOY.green1,borderRadius:2}}/></div></div>)}</ChartCard>
                  if(id==='v1')return<ChartCard id="v1"><div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}><span style={{fontSize:12,fontWeight:600,fontFamily:ALLOY.fontBody}}>{widgets.find(x=>x.id==='v1')?.title||'Website Views'}</span>{connection?.connected&&<span style={{fontSize:9,color:ALLOY.green1,fontWeight:600,fontFamily:ALLOY.fontLabel}}>● Live GA4</span>}</div><DynamicChart chartType={widgets.find(x=>x.id==='v1')?.chartType||'area'} data={getWidgetData(widgets.find(x=>x.id==='v1')||{})} height={130} dimensions={(widgets.find(x=>x.id==='v1') as any)?.dimensions} metrics={(widgets.find(x=>x.id==='v1') as any)?.metrics}/></ChartCard>
                  const dynW=dynamicWidgets.find(w=>w.id===id)
                  if(dynW){const isDynSelected=editingWidget?.id===id&&editMode;return<div onClick={e=>{e.stopPropagation();if(justDroppedRef.current)return;if(editMode)startEdit(dynW)}} style={{background:ALLOY.white,borderRadius:2,padding:14,position:'relative',cursor:editMode?'grab':'default',minHeight:140,transition:'border-color 0.15s,opacity 0.15s',opacity:editMode&&editingWidget&&!isDynSelected?0.45:1,...(isDynSelected?{border:`2.5px solid ${ALLOY.green1}`,boxShadow:`0 0 0 4px ${ALLOY.green4}`}:{border:`2px solid ${ALLOY.line}`})}}>{editMode&&<div style={{position:'absolute',top:6,left:6,cursor:'grab',color:ALLOY.line}}><Grip size={13}/></div>}{editMode&&<div onClick={e=>e.stopPropagation()} style={{position:'absolute',top:6,right:6,zIndex:10,display:'flex',gap:4}}><WidgetDot wid={dynW.id} onEdit={()=>startEdit(dynW)} widget={dynW}/></div>}<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:12,fontWeight:600,color:ALLOY.ink,fontFamily:ALLOY.fontBody}}>{dynW.title}</span>{connection?.connected&&<span style={{fontSize:9,color:ALLOY.green1,fontWeight:600,fontFamily:ALLOY.fontLabel}}>● Live</span>}</div><DynamicChart chartType={dynW.chartType} data={getWidgetData(dynW)} height={100} dimensions={(dynW as any).dimensions} metrics={(dynW as any).metrics}/></div>}
                  return null
                }
                return(
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,alignItems:'start'}} onDragOver={e=>e.preventDefault()}>
                    {preview.map((id:string)=>{
                      const isBeingDragged=id===dragId,isDropTarget=id===dragOver&&dragId!==id
                      return(
                        <div key={id} draggable={editMode}
                          onDragStart={e=>{e.stopPropagation();handleDragStart(id,e)}}
                          onDragOver={e=>{e.preventDefault();e.stopPropagation();e.dataTransfer.dropEffect='move';if(editMode&&dragIdRef.current!==id)setDragOver(id)}}
                          onDragEnter={e=>{e.preventDefault();if(editMode&&dragIdRef.current!==id)setDragOver(id)}}
                          onDragEnd={handleDragEnd}
                          onDrop={e=>handleDrop(e,id)}
                          style={{gridColumn:id==='v1'?'1 / -1':undefined,opacity:isBeingDragged?0.25:1,transform:isDropTarget?'scale(1.02)':'scale(1)',transition:'opacity 0.12s ease,transform 0.15s ease',borderRadius:4,boxShadow:isDropTarget?`0 0 0 2.5px ${ALLOY.green1}`:undefined,cursor:editMode?'grab':'default'}}>
                          {renderContent(id)}
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </div>
          )}
        </div>

        {/* Right panel (edit mode) */}
        {editMode && (
          <div style={{display:'flex',height:'100%',borderLeft:`1px solid ${ALLOY.line}`}}>
            {editingWidget&&(
              <div onClick={e=>e.stopPropagation()} style={{width:300,minWidth:300,background:ALLOY.white,borderRight:`1px solid ${ALLOY.line}`,display:'flex',flexDirection:'column',overflow:'hidden'}}>
                <div style={{padding:'14px 16px',borderBottom:`1px solid ${ALLOY.line}`}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                    <button onClick={()=>{setEditingWidget(null);setActiveRightPanel('integrations')}} style={{width:28,height:28,borderRadius:'50%',background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}><ChevronLeft size={14} style={{color:ALLOY.ink}}/></button>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontSize:13,fontWeight:700,color:ALLOY.ink,lineHeight:1.2,fontFamily:ALLOY.fontDisplay,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>{editingWidget.title}</p>
                      <p style={{fontFamily:ALLOY.fontLabel,fontSize:9,color:ALLOY.mute,letterSpacing:'0.08em',textTransform:'uppercase' as const,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>{editingWidget.dataSource}</p>
                    </div>
                  </div>
                  <div style={{display:'flex',borderBottom:`1px solid ${ALLOY.line}`}}>
                    {(['General','Data','Display'] as const).map(t=>(
                      <button key={t} onClick={()=>setEditTab(t)} style={{flex:1,padding:'8px 0',fontFamily:ALLOY.fontBody,fontSize:12,fontWeight:editTab===t?600:400,background:'none',border:'none',cursor:'pointer',color:editTab===t?ALLOY.blue1:ALLOY.mute,borderBottom:editTab===t?`2px solid ${ALLOY.blue1}`:'2px solid transparent'}}>{t}</button>
                    ))}
                  </div>
                </div>
                <div style={{flex:1,overflowY:'auto',padding:16}}>
                  {editTab==='General'&&(
                    <>
                      <div style={{marginBottom:18}}>
                        <label style={{display:'block',fontFamily:ALLOY.fontLabel,fontSize:9,fontWeight:600,color:ALLOY.mute,marginBottom:8,textTransform:'uppercase' as const,letterSpacing:'0.1em'}}>Title</label>
                        <input value={editingWidget.title} onChange={e=>{const u={...editingWidget,title:e.target.value};setEditingWidget(u);setWidgets(prev=>prev.map(w=>w.id===u.id?u:w))}} style={{width:'100%',background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'8px 12px',fontFamily:ALLOY.fontBody,fontSize:13,outline:'none',color:ALLOY.ink,boxSizing:'border-box' as const}}/>
                      </div>
                      <div style={{marginBottom:18}}>
                        <label style={{display:'block',fontFamily:ALLOY.fontLabel,fontSize:9,fontWeight:600,color:ALLOY.mute,marginBottom:8,textTransform:'uppercase' as const,letterSpacing:'0.1em'}}>Tooltip</label>
                        <textarea value={editingWidget.tooltip} onChange={e=>{const u={...editingWidget,tooltip:e.target.value};setEditingWidget(u);setWidgets(prev=>prev.map(w=>w.id===u.id?u:w))}} style={{width:'100%',background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'8px 12px',fontSize:13,outline:'none',color:ALLOY.ink,resize:'vertical' as const,minHeight:80,fontFamily:ALLOY.fontBody,boxSizing:'border-box' as const}}/>
                      </div>
                      <div style={{marginBottom:12}}>
                        <label style={{display:'block',fontFamily:ALLOY.fontLabel,fontSize:9,fontWeight:600,color:ALLOY.mute,marginBottom:10,textTransform:'uppercase' as const,letterSpacing:'0.1em'}}>Chart Type</label>
                        <div style={{maxHeight:380,overflowY:'auto',border:`1px solid ${ALLOY.line}`,borderRadius:2,background:ALLOY.paper}}>
                          {CHART_TYPE_GROUPS.map(group=>(
                            <div key={group.group} style={{padding:'10px 10px 4px'}}>
                              <p style={{fontSize:9,fontWeight:600,color:ALLOY.mute,textTransform:'uppercase' as const,letterSpacing:'0.1em',fontFamily:ALLOY.fontLabel,marginBottom:8}}>{group.group}</p>
                              <div style={{display:'flex',flexWrap:'wrap' as const,gap:6,marginBottom:6}}>
                                {group.types.map(ct=>{
                                  const active=editingWidget.chartType===ct.id
                                  return(
                                    <button key={ct.id} onClick={()=>{const u={...editingWidget,chartType:ct.id};setEditingWidget(u);setWidgets(prev=>prev.map(w=>w.id===u.id?u:w))}} title={ct.label} style={{display:'flex',flexDirection:'column' as const,alignItems:'center',gap:3,padding:'5px 3px',borderRadius:2,border:`2px solid ${active?'#1a73e8':ALLOY.line}`,background:active?ALLOY.blue4:ALLOY.white,cursor:'pointer',width:60,minWidth:60}}>
                                      <ChartThumbSvg id={ct.id} active={active}/>
                                      <span style={{fontFamily:ALLOY.fontLabel,fontSize:9,color:active?ALLOY.green1:ALLOY.ink,fontWeight:active?600:400,textAlign:'center' as const,lineHeight:1.2,whiteSpace:'nowrap' as const,overflow:'hidden',textOverflow:'ellipsis',width:'100%',letterSpacing:'0.04em'}}>{ct.label}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button onClick={saveWidget} style={{width:'100%',background:ALLOY.green1,border:'none',borderRadius:2,padding:'10px',fontFamily:ALLOY.fontLabel,fontSize:11,fontWeight:700,color:ALLOY.ink,cursor:'pointer',letterSpacing:'0.06em',textTransform:'uppercase' as const}}>Save Changes</button>
                    </>
                  )}
                  {editTab==='Data'&&<div style={{padding:'8px 0',fontFamily:ALLOY.fontBody,fontSize:12,color:ALLOY.mute}}>Data configuration panel — connect your metrics and dimensions here.</div>}
                  {editTab==='Display'&&(
                    <div>
                      <label style={{display:'block',fontFamily:ALLOY.fontLabel,fontSize:9,fontWeight:600,color:ALLOY.mute,marginBottom:10,textTransform:'uppercase' as const,letterSpacing:'0.1em'}}>Background Color</label>
                      <div style={{display:'flex',gap:8,marginBottom:20}}>
                        {[{col:ALLOY.white,key:'white'},{col:ALLOY.blue1,key:'blue'},{col:ALLOY.green1,key:'green'},{col:ALLOY.red1,key:'red'}].map(({col,key})=>(
                          <div key={key} onClick={()=>{const u={...editingWidget,color:key};setEditingWidget(u);setWidgets(prev=>prev.map(w=>w.id===u.id?u:w))}} style={{width:30,height:30,borderRadius:6,background:col,border:`3px solid ${editingWidget.color===key?ALLOY.ink:ALLOY.line}`,cursor:'pointer'}}/>
                        ))}
                      </div>
                      <button onClick={saveWidget} style={{width:'100%',background:ALLOY.green1,border:'none',borderRadius:2,padding:'10px',fontFamily:ALLOY.fontLabel,fontSize:11,fontWeight:700,color:ALLOY.ink,cursor:'pointer',letterSpacing:'0.06em',textTransform:'uppercase' as const}}>Save Changes</button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeRightPanel&&!editingWidget&&(
              <div style={{width:300,background:ALLOY.white,borderRight:`1px solid ${ALLOY.line}`,display:'flex',flexDirection:'column',overflow:'hidden'}}>
                {activeRightPanel==='charts'&&(
                  <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
                    <div style={{padding:'12px 16px',borderBottom:`1px solid ${ALLOY.line}`,flexShrink:0}}>
                      <p style={{fontFamily:ALLOY.fontDisplay,fontSize:13,fontWeight:700,color:ALLOY.ink,marginBottom:2}}>Add Chart</p>
                      <p style={{fontFamily:ALLOY.fontBody,fontSize:11,color:ALLOY.mute}}>Click any chart to add it to the dashboard</p>
                    </div>
                    <div style={{flex:1,overflowY:'auto' as const}}>
                      {CHART_TYPE_GROUPS.map(group=>(
                        <div key={group.group} style={{padding:'10px 10px 4px'}}>
                          <p style={{fontSize:9,fontWeight:600,color:ALLOY.mute,textTransform:'uppercase' as const,letterSpacing:'0.1em',fontFamily:ALLOY.fontLabel,marginBottom:8}}>{group.group}</p>
                          <div style={{display:'flex',flexWrap:'wrap' as const,gap:6,marginBottom:6}}>
                            {group.types.map(ct=>(
                              <button key={ct.id} onClick={()=>addWidget(ct.id,ct.label)} title={`Add ${ct.label}`} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,padding:'5px 3px',borderRadius:2,border:`2px solid ${ALLOY.line}`,background:ALLOY.white,cursor:'pointer',width:60,minWidth:60,transition:'all 0.1s'}} onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='#1a73e8';(e.currentTarget as HTMLButtonElement).style.background=ALLOY.blue4}} onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=ALLOY.line;(e.currentTarget as HTMLButtonElement).style.background=ALLOY.white}}>
                                <ChartThumbSvg id={ct.id} active={false}/>
                                <span style={{fontFamily:ALLOY.fontBody,fontSize:9,color:'#444',textAlign:'center' as const,lineHeight:1.2,whiteSpace:'nowrap' as const,overflow:'hidden',textOverflow:'ellipsis',width:'100%'}}>{ct.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeRightPanel==='build'&&(
                  <div style={{flex:1,overflowY:'auto',padding:20}}>
                    {[{icon:'⊞',title:'Summarize your data with AI',desc:'Transform your data into clear, meaningful insights',onClick:()=>setShowAIBuildModal(true)},{icon:'📊',title:'Build metrics with AI',desc:'Use natural prompts to find the right widgets and add the metrics that matter most',onClick:()=>setShowAIBuildModal(true)},{icon:'⧉',title:'Clone existing page',desc:'Copy a dashboard from any client as a starting point',onClick:()=>setShowCloneModal(true)},{icon:'🎨',title:'Choose a template',desc:'Start from a ready-made dashboard',onClick:()=>setShowTemplateModal(true)},{icon:'⚡',title:'Smart Dashboard',desc:'Auto-generate from your connected integrations',onClick:()=>setShowSmartDashModal(true)}].map(item=>(
                      <div key={item.title} onClick={item.onClick} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'16px 0',borderBottom:`1px solid ${ALLOY.line}`,cursor:'pointer'}} onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background=ALLOY.green4} onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}>
                        <div style={{width:36,height:36,borderRadius:2,background:ALLOY.paper,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:16}}>{item.icon}</div>
                        <div style={{flex:1}}><p style={{fontFamily:ALLOY.fontBody,fontSize:14,fontWeight:700,color:ALLOY.ink,marginBottom:4}}>{item.title}</p><p style={{fontFamily:ALLOY.fontBody,fontSize:12,color:ALLOY.mute,lineHeight:1.5}}>{item.desc}</p></div>
                      </div>
                    ))}
                  </div>
                )}
                {activeRightPanel==='integrations'&&(
                  <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
                    <div style={{padding:'10px 12px',borderBottom:`1px solid ${ALLOY.line}`}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'7px 10px',marginBottom:8}}>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="#999" strokeWidth="1.5"/><path d="M9.5 9.5 L12 12" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        <input value={integrationSearch} onChange={e=>setIntegrationSearch(e.target.value)} placeholder="Search" style={{background:'transparent',border:'none',outline:'none',fontFamily:ALLOY.fontBody,fontSize:13,color:ALLOY.ink,width:'100%'}}/>
                      </div>
                    </div>
                    <div style={{flex:1,overflowY:'auto'}}>
                      {ALL_INTEGRATIONS.filter(i=>i.name.toLowerCase().includes(integrationSearch.toLowerCase())).map(i=>(
                        <div key={i.name} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',borderBottom:`1px solid ${ALLOY.line}`,cursor:'pointer'}} onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background=ALLOY.paper} onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}>
                          <div style={{width:28,height:28,borderRadius:2,background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,overflow:'hidden'}}>
                            <img src={`https://www.google.com/s2/favicons?domain=${i.domain}&sz=64`} alt={i.name} style={{width:20,height:20,objectFit:'contain',opacity:i.connected?1:0.45}} onError={e=>(e.currentTarget as HTMLImageElement).style.display='none'}/>
                          </div>
                          <span style={{flex:1,fontFamily:ALLOY.fontBody,fontSize:13,color:i.connected?ALLOY.ink:ALLOY.mute,fontWeight:i.connected?500:400}}>{i.name}</span>
                          {i.connected&&<span style={{fontFamily:ALLOY.fontLabel,fontSize:8,color:ALLOY.green1,background:ALLOY.green4,borderRadius:999,padding:'2px 7px',fontWeight:700}}>ON</span>}
                          <ChevronRight size={13} style={{color:ALLOY.line,flexShrink:0}}/>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeRightPanel==='content'&&<div style={{flex:1,overflowY:'auto',padding:20}}>{[{icon:'Aa',title:'Title',desc:'Add page titles to structure your report'},{icon:'Aa',title:'Textbox',desc:'Create custom text alongside your data'},{icon:'≡',title:'Table of Contents',desc:'Build headings for easy navigation'}].map(item=><div key={item.title} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'16px 0',borderBottom:`1px solid ${ALLOY.line}`,cursor:'pointer'}}><div style={{width:32,height:32,borderRadius:2,background:ALLOY.paper,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontFamily:ALLOY.fontBody,fontSize:14,fontWeight:700,color:ALLOY.ink}}>{item.icon}</div><div><p style={{fontFamily:ALLOY.fontBody,fontSize:14,fontWeight:700,color:ALLOY.ink,marginBottom:4}}>{item.title}</p><p style={{fontFamily:ALLOY.fontBody,fontSize:12,color:ALLOY.mute,lineHeight:1.5}}>{item.desc}</p></div></div>)}</div>}
                {activeRightPanel==='media'&&<div style={{flex:1,overflowY:'auto',padding:20}}>{[{icon:'🖼',title:'Image',desc:'Add images, graphics, or logos'},{icon:'</>',title:'Embed',desc:'Pull in live content from YouTube, Google Sheets, and more'}].map(item=><div key={item.title} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'16px 0',borderBottom:`1px solid ${ALLOY.line}`,cursor:'pointer'}}><div style={{width:32,height:32,borderRadius:2,background:ALLOY.paper,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:14}}>{item.icon}</div><div><p style={{fontFamily:ALLOY.fontBody,fontSize:14,fontWeight:700,color:ALLOY.ink,marginBottom:4}}>{item.title}</p><p style={{fontFamily:ALLOY.fontBody,fontSize:12,color:ALLOY.mute,lineHeight:1.5}}>{item.desc}</p></div></div>)}</div>}
                {activeRightPanel==='metrics'&&<div style={{flex:1,display:'flex',flexDirection:'column'}}><div style={{padding:12,borderBottom:`1px solid ${ALLOY.line}`}}><button style={{width:'100%',background:ALLOY.blue1,border:'none',borderRadius:2,padding:'10px',fontSize:13,fontWeight:600,color:ALLOY.white,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}><Plus size={14}/> Add Custom Metric</button></div><div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,textAlign:'center' as const}}><div style={{width:60,height:60,borderRadius:'50%',background:ALLOY.paper,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12,fontSize:24}}>✏️</div><p style={{fontFamily:ALLOY.fontBody,fontSize:13,color:ALLOY.ink,lineHeight:1.6}}>No custom metrics yet</p></div></div>}
                {activeRightPanel==='benchmarks'&&<div style={{flex:1,overflowY:'auto',padding:20}}><div style={{display:'flex',alignItems:'flex-start',gap:12,padding:'16px 0',cursor:'pointer'}}><div style={{width:32,height:32,borderRadius:2,background:ALLOY.paper,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:16}}>⚖️</div><div><p style={{fontFamily:ALLOY.fontBody,fontSize:14,fontWeight:700,color:ALLOY.ink,marginBottom:4}}>Benchmark</p><p style={{fontFamily:ALLOY.fontBody,fontSize:12,color:ALLOY.mute,lineHeight:1.5}}>Visualize your client's performance against others</p></div></div></div>}
                {activeRightPanel==='goals'&&<div style={{flex:1,display:'flex',flexDirection:'column'}}><div style={{padding:12,borderBottom:`1px solid ${ALLOY.line}`}}><button style={{width:'100%',background:ALLOY.blue1,border:'none',borderRadius:2,padding:'10px',fontSize:13,fontWeight:600,color:ALLOY.white,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}><Plus size={14}/> Add Goal</button></div><div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,textAlign:'center' as const}}><div style={{width:60,height:60,borderRadius:'50%',background:ALLOY.paper,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12,fontSize:24}}>🚩</div><p style={{fontFamily:ALLOY.fontBody,fontSize:13,color:ALLOY.ink,lineHeight:1.6}}>No goals yet</p></div></div>}
              </div>
            )}
            {/* Icon strip */}
            <div style={{width:80,minWidth:80,background:ALLOY.white,display:'flex',flexDirection:'column',alignItems:'center',padding:'12px 0',gap:2}}>
              {RIGHT_PANEL_ITEMS.map(item=>(
                <button key={item.id} onClick={()=>{setActiveRightPanel(activeRightPanel===item.id?null:item.id);setEditingWidget(null)}} style={{width:68,padding:'10px 4px',display:'flex',flexDirection:'column',alignItems:'center',gap:5,border:'none',cursor:'pointer',borderRadius:2,background:activeRightPanel===item.id?ALLOY.paper:'none'}}>
                  <span style={{fontFamily:ALLOY.fontBody,fontSize:18,lineHeight:1}}>{item.icon}</span>
                  <span style={{fontFamily:ALLOY.fontBody,fontSize:9,color:activeRightPanel===item.id?ALLOY.ink:ALLOY.mute,textAlign:'center',lineHeight:1.3,whiteSpace:'pre-line',fontWeight:activeRightPanel===item.id?600:400}}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Fullscreen widget overlay ── */}
      {fullscreenWidget&&(
        <div className="alloy-modal-bg" style={{position:'fixed' as const,inset:0,background:'rgba(0,0,0,0.75)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center',padding:24}} onClick={()=>setFullscreenWidget(null)}>
          <div className="alloy-modal-card" style={{background:ALLOY.white,borderRadius:2,width:'92vw',maxWidth:1200,maxHeight:'92vh',overflow:'hidden',display:'flex',flexDirection:'column' as const,boxShadow:'0 24px 80px rgba(0,0,0,0.35)'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',alignItems:'center',gap:12,padding:'14px 24px',borderBottom:`1px solid ${ALLOY.line}`,background:ALLOY.white,flexShrink:0}}>
              <span style={{fontFamily:ALLOY.fontDisplay,fontSize:16,fontWeight:700,color:ALLOY.ink,flex:1}}>{fullscreenWidget.title}</span>
              {connection?.connected&&<span style={{fontFamily:ALLOY.fontLabel,fontSize:9,color:ALLOY.green1,fontWeight:600,marginRight:12}}>● Live</span>}
              <button onClick={()=>setFullscreenWidget(null)} style={{width:30,height:30,borderRadius:2,background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}><X size={14} style={{color:ALLOY.ink}}/></button>
            </div>
            <div style={{flex:1,padding:32,overflow:'auto',minHeight:0}}>
              <DynamicChart chartType={fullscreenWidget.chartType} data={getWidgetData(fullscreenWidget)} height={480} dimensions={(fullscreenWidget as any).dimensions} metrics={(fullscreenWidget as any).metrics}/>
            </div>
          </div>
        </div>
      )}

      {/* ── Clone Modal ── */}
      {showCloneModal&&(
        <div className="alloy-modal-bg" style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:16}} onClick={()=>setShowCloneModal(false)}>
          <div className="alloy-modal-card" style={{background:ALLOY.white,borderRadius:2,width:'100%',maxWidth:420,overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,0.15)'}} onClick={e=>e.stopPropagation()}>
            <div style={{height:3,background:ALLOY.blue1}}/>
            <div style={{padding:28}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
                <h2 style={{fontSize:15,fontWeight:700,color:ALLOY.ink,fontFamily:ALLOY.fontDisplay}}>Clone Dashboard</h2>
                <button onClick={()=>setShowCloneModal(false)} style={{background:'none',border:'none',cursor:'pointer',color:ALLOY.mute,fontSize:18}}>✕</button>
              </div>
              <div style={{marginBottom:8}}>
                <label style={{display:'block',fontFamily:ALLOY.fontLabel,fontSize:9,fontWeight:600,color:ALLOY.mute,marginBottom:6,textTransform:'uppercase' as const,letterSpacing:'0.1em'}}>Source Dashboard</label>
                <select id="clone-source-select" defaultValue={activeDash} style={{width:'100%',border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'9px 12px',fontFamily:ALLOY.fontBody,fontSize:13,color:ALLOY.ink,outline:'none',boxSizing:'border-box' as const,marginBottom:12,background:ALLOY.white}}>
                  {REAL_DASHBOARDS.map(d=><option key={d} value={d}>{d}</option>)}
                  {clonedDashboards.map(d=><option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div style={{marginBottom:16}}>
                <label style={{display:'block',fontFamily:ALLOY.fontLabel,fontSize:9,fontWeight:600,color:ALLOY.mute,marginBottom:6,textTransform:'uppercase' as const,letterSpacing:'0.1em'}}>New Dashboard Name</label>
                <input defaultValue={activeDash+' (Copy)'} id="clone-name-input" style={{width:'100%',border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'9px 12px',fontFamily:ALLOY.fontBody,fontSize:13,color:ALLOY.ink,outline:'none',boxSizing:'border-box' as const}}/>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>setShowCloneModal(false)} style={{flex:1,background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'9px',fontFamily:ALLOY.fontBody,fontSize:13,color:ALLOY.mute,cursor:'pointer'}}>Cancel</button>
                <button onClick={()=>{
                  const input=document.getElementById('clone-name-input') as HTMLInputElement
                  const newName=(input?.value||(activeDash+' (Copy)')).trim()
                  if(!newName)return
                  setDashboards(prev=>prev.includes(newName)?prev:[...prev,newName])
                  setClonedDashboards(prev=>prev.includes(newName)?prev:[...prev,newName])
                  setActiveDash(newName)
                  setShowCloneModal(false)
                  setShareToast(`"${newName}" created`)
                  setTimeout(()=>setShareToast(null),2500)
                }} style={{flex:2,background:ALLOY.blue1,border:'none',borderRadius:2,padding:'9px',fontFamily:ALLOY.fontLabel,fontSize:9,fontWeight:700,color:ALLOY.white,cursor:'pointer',letterSpacing:'0.08em',textTransform:'uppercase' as const}}>Clone Dashboard</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Mapping Modal ── */}
      {showMappingModal&&(
        <div className="alloy-modal-bg" style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:16}} onClick={()=>setShowMappingModal(false)}>
          <div className="alloy-modal-card" style={{background:ALLOY.white,borderRadius:2,width:'100%',maxWidth:480,overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,0.2)'}} onClick={e=>e.stopPropagation()}>
            <div style={{height:3,background:ALLOY.green1}}/>
            <div style={{padding:28}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                <div>
                  <h2 style={{fontSize:16,fontWeight:700,color:ALLOY.ink,marginBottom:2,fontFamily:ALLOY.fontDisplay}}>Map Data Sources</h2>
                  <p style={{fontFamily:ALLOY.fontBody,fontSize:12,color:ALLOY.mute}}>Set default data sources for <strong>{clientName}</strong></p>
                </div>
                <button onClick={()=>setShowMappingModal(false)} style={{background:'none',border:'none',cursor:'pointer',color:ALLOY.mute,fontSize:18}}>✕</button>
              </div>
              <div style={{borderRadius:2,background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,padding:16,marginBottom:12}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                  <div style={{width:28,height:28,borderRadius:2,background:'#e8f5e9',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>📊</div>
                  <div><p style={{fontFamily:ALLOY.fontBody,fontSize:12,fontWeight:700,color:ALLOY.ink}}>Google Analytics 4</p><p style={{fontFamily:ALLOY.fontBody,fontSize:11,color:ALLOY.mute}}>Select the GA4 property for this client</p></div>
                </div>
                <select value={mappingProp} onChange={e=>{setMappingProp(e.target.value);const p=connection?.ga4_properties?.find((x:any)=>x.name===e.target.value);setMappingPropName(p?.displayName||e.target.value)}} style={{width:'100%',background:ALLOY.white,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'9px 12px',fontFamily:ALLOY.fontBody,fontSize:13,outline:'none',color:ALLOY.ink,cursor:'pointer'}}>
                  <option value="">— Select GA4 Property —</option>
                  {connection?.ga4_properties?.map((p:any)=><option key={p.name} value={p.name}>{p.displayName||p.name}</option>)}
                </select>
              </div>
              {connection?.gsc_sites?.length>0&&(
                <div style={{borderRadius:2,background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,padding:16,marginBottom:16}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                    <div style={{width:28,height:28,borderRadius:2,background:'#e3f2fd',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>🔍</div>
                    <div><p style={{fontFamily:ALLOY.fontBody,fontSize:12,fontWeight:700,color:ALLOY.ink}}>Google Search Console</p><p style={{fontFamily:ALLOY.fontBody,fontSize:11,color:ALLOY.mute}}>Select the GSC site for this client</p></div>
                  </div>
                  <select value={mappingSite} onChange={e=>setMappingSite(e.target.value)} style={{width:'100%',background:ALLOY.white,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'9px 12px',fontFamily:ALLOY.fontBody,fontSize:13,outline:'none',color:ALLOY.ink,cursor:'pointer'}}>
                    <option value="">— Select GSC Site —</option>
                    {connection?.gsc_sites?.map((s:any)=><option key={s.siteUrl} value={s.siteUrl}>{s.siteUrl}</option>)}
                  </select>
                </div>
              )}
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>setShowMappingModal(false)} style={{flex:1,background:ALLOY.paper,border:`1px solid ${ALLOY.line}`,borderRadius:2,padding:'10px',fontFamily:ALLOY.fontBody,fontSize:13,color:ALLOY.mute,cursor:'pointer',fontWeight:500}}>Cancel</button>
                <button onClick={saveMapping} disabled={!mappingProp||savingMapping} style={{flex:2,background:mappingSaved?ALLOY.green1:ALLOY.blue1,border:'none',borderRadius:2,padding:'10px',fontFamily:ALLOY.fontLabel,fontSize:9,fontWeight:700,color:ALLOY.white,cursor:'pointer',opacity:!mappingProp||savingMapping?0.6:1,transition:'background 0.2s',letterSpacing:'0.08em',textTransform:'uppercase' as const}}>
                  {mappingSaved?'✓ Saved!':savingMapping?'Saving...':'Save & Apply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Template Modal ── */}
      {showTemplateModal && (
        <TemplateModal
          onClose={() => setShowTemplateModal(false)}
          onSelect={handleTemplateSelect}
        />
      )}

      {/* ── AI Build Modal ── */}
      {showAIBuildModal && (
        <AIBuildModal
          onClose={() => setShowAIBuildModal(false)}
          onGenerate={handleAIGenerate}
          clientName={clientName}
        />
      )}

      {/* ── Smart Dashboard Modal ── */}
      {showSmartDashModal && (
        <SmartDashModal
          onClose={() => setShowSmartDashModal(false)}
          onGenerate={handleSmartGenerate}
          clientName={clientName}
          connection={connection}
        />
      )}

      {/* ── Toast ── */}
      {shareToast&&(
        <div style={{position:'fixed' as const,bottom:28,left:'50%',transform:'translateX(-50%)',zIndex:9999,background:ALLOY.ink,color:ALLOY.white,fontFamily:ALLOY.fontBody,fontSize:12,fontWeight:500,padding:'11px 22px',borderRadius:2,boxShadow:'0 4px 20px rgba(0,0,0,0.25)',display:'flex',alignItems:'center',gap:10,pointerEvents:'none' as const,whiteSpace:'nowrap' as const}}>
          <span style={{color:ALLOY.green1,fontSize:15,lineHeight:1}}>✓</span>
          {shareToast}
        </div>
      )}
    </div>
    </>
  )
}
