'use client'
import { useState } from 'react'
import { X, Plus, MoreHorizontal, ChevronRight, ChevronDown } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

interface DrillDownPanelProps {
  clientName?: string
  ga4Data?: any
  sessionData?: any[]
  sourceData?: any[]
  onClose: () => void
}

const TIME_DATA = [
  {d:'1 Apr',v:9200,v2:8100},{d:'3 Apr',v:8800,v2:8400},{d:'5 Apr',v:9600,v2:8900},
  {d:'7 Apr',v:10200,v2:9400},{d:'9 Apr',v:9800,v2:9200},{d:'11 Apr',v:10500,v2:9600},
  {d:'13 Apr',v:8800,v2:9200},{d:'15 Apr',v:11200,v2:10800},{d:'17 Apr',v:9600,v2:8900},
  {d:'19 Apr',v:10800,v2:10200},{d:'21 Apr',v:12400,v2:11200},{d:'23 Apr',v:11800,v2:10500},
  {d:'25 Apr',v:10200,v2:9100},{d:'27 Apr',v:8900,v2:7600},{d:'29 Apr',v:7800,v2:7200},
]

const CHANNELS = [
  { id:'all', label:'All' },
  { id:'organic-search', label:'Organic Search' },
  { id:'paid-search', label:'Paid Search' },
  { id:'direct', label:'Direct' },
  { id:'social', label:'Social' },
  { id:'referral', label:'Referral' },
  { id:'display', label:'Display' },
  { id:'email', label:'Email' },
  { id:'video', label:'Video' },
  { id:'paid-social', label:'Paid Social' },
]

const AUDIENCE_ITEMS = [
  { id:'aud-location', label:'Location' },
  { id:'aud-language', label:'Language' },
  { id:'aud-age', label:'Age' },
  { id:'aud-gender', label:'Gender' },
  { id:'aud-devices', label:'Devices' },
  { id:'aud-browser', label:'Browser' },
  { id:'aud-os', label:'Operating System' },
  { id:'aud-interests', label:'Interests' },
  { id:'aud-new-returning', label:'New vs Returning' },
]

const CONVERSION_ITEMS = [
  { id:'conv-campaigns', label:'Campaigns' },
  { id:'conv-ecommerce', label:'Ecommerce' },
]

const ALL_CHANNEL_ROWS = [
  { channel:'Organic Search',  sessions:68639,  sessChange:'7.11%',  sessUp:true,  users:44985, usersChange:'7.64%',  usersUp:true,  engagement:'44d 8h 39m 25s', engChange:'4.75%',  engUp:true,  views:152328, viewsChange:'5.26%', viewsUp:true,  keyEvents:2368,  keyChange:'11%',   keyUp:false, eventCount:998510, evtChange:'5.00%', evtUp:true,  purchasers:'0.00', pct:'0%' },
  { channel:'Direct',          sessions:30294,  sessChange:'15%',    sessUp:false, users:24614, usersChange:'16%',    usersUp:false, engagement:'12d 21h 3m 39s',  engChange:'7.43%',  engUp:false, views:50441,  viewsChange:'9.86%', viewsUp:false, keyEvents:596,   keyChange:'26%',   keyUp:false, eventCount:295939, evtChange:'9.10%', evtUp:false, purchasers:'0.00', pct:'0%' },
  { channel:'Paid Social',     sessions:8288,   sessChange:'7.62%',  sessUp:true,  users:7972,  usersChange:'22%',    usersUp:true,  engagement:'5h 37m 40s',      engChange:'89%',    engUp:false, views:7921,   viewsChange:'39%',   viewsUp:false, keyEvents:9,     keyChange:'97%',   keyUp:false, eventCount:36718,  evtChange:'53%',   evtUp:false, purchasers:'0.00', pct:'0%' },
  { channel:'Organic Social',  sessions:6570,   sessChange:'24%',    sessUp:true,  users:5587,  usersChange:'21%',    usersUp:true,  engagement:'2d 13h 51m 18s',  engChange:'11%',    engUp:true,  views:10032,  viewsChange:'7.43%', viewsUp:false, keyEvents:179,   keyChange:'25%',   keyUp:false, eventCount:63071,  evtChange:'13%',   evtUp:false, purchasers:'0.00', pct:'0%' },
  { channel:'Referral',        sessions:4379,   sessChange:'13%',    sessUp:false, users:3029,  usersChange:'11%',    usersUp:false, engagement:'2d 10h 24m 6s',   engChange:'24%',    engUp:false, views:8653,   viewsChange:'16%',   viewsUp:false, keyEvents:247,   keyChange:'29%',   keyUp:false, eventCount:55416,  evtChange:'19%',   evtUp:false, purchasers:'0.00', pct:'0%' },
  { channel:'Paid Search',     sessions:3874,   sessChange:'0.16%',  sessUp:true,  users:2931,  usersChange:'2.30%',  usersUp:false, engagement:'3d 20h 50s',      engChange:'8.72%',  engUp:true,  views:11350,  viewsChange:'3.23%', viewsUp:true,  keyEvents:163,   keyChange:'9.40%', keyUp:true,  eventCount:78019,  evtChange:'3.76%', evtUp:true,  purchasers:'0.00', pct:'0%' },
  { channel:'Unassigned',      sessions:768,    sessChange:'3.36%',  sessUp:true,  users:666,   usersChange:'2.06%',  usersUp:false, engagement:'9h 41m 34s',      engChange:'1.51%',  engUp:true,  views:1311,   viewsChange:'2.26%', viewsUp:true,  keyEvents:41,    keyChange:'6.82%', keyUp:false, eventCount:8001,   evtChange:'0.76%', evtUp:true,  purchasers:'0.00', pct:'0%' },
  { channel:'Email',           sessions:364,    sessChange:'32%',    sessUp:true,  users:309,   usersChange:'76%',    usersUp:true,  engagement:'3h 30m 40s',      engChange:'4.12%',  engUp:false, views:733,    viewsChange:'38%',   viewsUp:true,  keyEvents:6,     keyChange:'20%',   keyUp:true,  eventCount:3498,   evtChange:'21%',   evtUp:true,  purchasers:'0.00', pct:'0%' },
  { channel:'Cross-network',   sessions:35,     sessChange:'52%',    sessUp:true,  users:34,    usersChange:'62%',    usersUp:true,  engagement:'30m 47s',          engChange:'53%',    engUp:false, views:113,    viewsChange:'2.73%', viewsUp:true,  keyEvents:0,     keyChange:'100%',  keyUp:false, eventCount:661,    evtChange:'7.29%', evtUp:false, purchasers:'0.00', pct:'0%' },
  { channel:'Paid Other',      sessions:9,      sessChange:'800%',   sessUp:true,  users:9,     usersChange:'800%',   usersUp:true,  engagement:'1m',               engChange:'100%',   engUp:true,  views:7,      viewsChange:'600%',  viewsUp:true,  keyEvents:0,     keyChange:'0%',    keyUp:true,  eventCount:47,     evtChange:'1467%', evtUp:true,  purchasers:'0.00', pct:'0%' },
  { channel:'Organic Video',   sessions:7,      sessChange:'133%',   sessUp:true,  users:6,     usersChange:'500%',   usersUp:true,  engagement:'1m 50s',           engChange:'100%',   engUp:true,  views:11,     viewsChange:'1000%', viewsUp:true,  keyEvents:1,     keyChange:'100%',  keyUp:true,  eventCount:86,     evtChange:'856%',  evtUp:true,  purchasers:'0.00', pct:'0%' },
  { channel:'Affiliates',      sessions:1,      sessChange:'100%',   sessUp:true,  users:1,     usersChange:'100%',   usersUp:true,  engagement:'—',               engChange:'0%',     engUp:true,  views:1,      viewsChange:'100%',  viewsUp:true,  keyEvents:0,     keyChange:'0%',    keyUp:true,  eventCount:8,      evtChange:'100%',  evtUp:true,  purchasers:'0.00', pct:'0%' },
]

type TimeEntry = { d:string; v:number; v2:number }
interface ChannelData {
  views:number; viewsChange:string; viewsUp:boolean
  sessions:number; sessChange:string; sessUp:boolean
  users:number; usersChange:string; usersUp:boolean
  engagement:string; engChange:string; engUp:boolean
  keyEvents:number; keyChange:string; keyUp:boolean
  eventCount:string; evtChange:string; evtUp:boolean
  chartType:'donut'|'bar'
  donutData?:{name:string;value:number;color:string}[]
  barData?:{name:string;value:number;color:string}[]
  timeData:TimeEntry[]
}

const CHANNEL_DATA: Record<string,ChannelData> = {
  all:{views:242900,viewsChange:'1.91%',viewsUp:false,sessions:120500,sessChange:'0.35%',sessUp:false,users:88069,usersChange:'0.69%',usersUp:true,engagement:'66d 21h 22m 49s',engChange:'1.65%',engUp:false,keyEvents:3610,keyChange:'21%',keyUp:false,eventCount:'1.54 M',evtChange:'2.67%',evtUp:false,chartType:'donut',donutData:[{name:'Organic Search',value:152328,color:'#4DA6FF'},{name:'Direct',value:50441,color:'#4CAF82'},{name:'Paid Search',value:11350,color:'#F9B62A'},{name:'Organic Social',value:10032,color:'#A8D8FF'},{name:'Referral',value:8653,color:'#CE93D8'},{name:'Paid Social',value:7921,color:'#FFB74D'},{name:'Unassigned',value:1311,color:'#B0BEC5'},{name:'Email',value:733,color:'#80CBC4'}],timeData:TIME_DATA},
  'organic-search':{views:152300,viewsChange:'5.26%',viewsUp:true,sessions:68639,sessChange:'7.11%',sessUp:true,users:44985,usersChange:'7.64%',usersUp:true,engagement:'44d 8h 39m 25s',engChange:'4.75%',engUp:true,keyEvents:2368,keyChange:'11%',keyUp:false,eventCount:'998.5 K',evtChange:'5.00%',evtUp:true,chartType:'donut',donutData:[{name:'google',value:143000,color:'#4DA6FF'},{name:'bing',value:5866,color:'#4CAF82'},{name:'duckduckgo',value:1621,color:'#F9B62A'},{name:'yahoo',value:1564,color:'#A8D8FF'},{name:'ecosia.org',value:299,color:'#CE93D8'},{name:'br.search.yahoo.com',value:73,color:'#FFB74D'},{name:'msn.com',value:53,color:'#B0BEC5'},{name:'cn.bing.com',value:32,color:'#80CBC4'}],timeData:TIME_DATA.map(t=>({...t,v:Math.round(t.v*0.62),v2:Math.round(t.v2*0.60)}))},
  'paid-search':{views:11350,viewsChange:'3.23%',viewsUp:true,sessions:3874,sessChange:'0.16%',sessUp:true,users:2931,usersChange:'2.30%',usersUp:false,engagement:'3d 20h 50s',engChange:'8.72%',engUp:true,keyEvents:163,keyChange:'9.40%',keyUp:true,eventCount:'78,019',evtChange:'3.76%',evtUp:true,chartType:'donut',donutData:[{name:'google',value:11350,color:'#4DA6FF'}],timeData:TIME_DATA.map(t=>({...t,v:Math.round(t.v*0.04),v2:Math.round(t.v2*0.038)}))},
  direct:{views:50441,viewsChange:'9.86%',viewsUp:false,sessions:30294,sessChange:'15%',sessUp:false,users:24614,usersChange:'16%',usersUp:false,engagement:'12d 21h 3m 39s',engChange:'7.43%',engUp:false,keyEvents:596,keyChange:'26%',keyUp:false,eventCount:'295.9 K',evtChange:'9.10%',evtUp:false,chartType:'bar',barData:[{name:'/visit/',value:7800,color:'#4DA6FF'},{name:'/events/',value:5900,color:'#4CAF82'},{name:'/map/',value:3800,color:'#F9B62A'},{name:'/blog/atl...',value:1400,color:'#A8D8FF'},{name:'/parks-t...',value:1100,color:'#CE93D8'},{name:'/blog/',value:900,color:'#FFB74D'},{name:'/blog/at2...',value:700,color:'#B0BEC5'},{name:'/live/',value:500,color:'#80CBC4'}],timeData:TIME_DATA.map(t=>({...t,v:Math.round(t.v*0.38),v2:Math.round(t.v2*0.42)}))},
  social:{views:10032,viewsChange:'7.43%',viewsUp:false,sessions:6570,sessChange:'24%',sessUp:true,users:5587,usersChange:'21%',usersUp:true,engagement:'2d 13h 51m 18s',engChange:'11%',engUp:true,keyEvents:179,keyChange:'25%',keyUp:false,eventCount:'63,071',evtChange:'13%',evtUp:false,chartType:'bar',barData:[{name:'later-lin...',value:1820,color:'#4DA6FF'},{name:'m.faceb...',value:1780,color:'#4CAF82'},{name:'faceboo...',value:1100,color:'#F9B62A'},{name:'reddit.c...',value:1080,color:'#A8D8FF'},{name:'l.facebo...',value:920,color:'#CE93D8'},{name:'linkedin...',value:860,color:'#FFB74D'},{name:'l.instag...',value:620,color:'#B0BEC5'},{name:'t.co',value:480,color:'#80CBC4'}],timeData:TIME_DATA.map(t=>({...t,v:Math.round(t.v*0.05),v2:Math.round(t.v2*0.06)}))},
  referral:{views:8653,viewsChange:'3.00%',viewsUp:false,sessions:4079,sessChange:'8%',sessUp:false,users:3200,usersChange:'5%',usersUp:false,engagement:'1d 4h 20m',engChange:'2%',engUp:true,keyEvents:124,keyChange:'18%',keyUp:false,eventCount:'55,440',evtChange:'4%',evtUp:false,chartType:'bar',barData:[{name:'beltline.org',value:2200,color:'#4DA6FF'},{name:'atlanta.gov',value:1400,color:'#4CAF82'},{name:'ajc.com',value:980,color:'#F9B62A'},{name:'yelp.com',value:720,color:'#A8D8FF'},{name:'tripadvi...',value:540,color:'#CE93D8'}],timeData:TIME_DATA.map(t=>({...t,v:Math.round(t.v*0.03),v2:Math.round(t.v2*0.035)}))},
  display:{views:2100,viewsChange:'5%',viewsUp:true,sessions:980,sessChange:'3%',sessUp:true,users:810,usersChange:'4%',usersUp:true,engagement:'8h 22m',engChange:'2%',engUp:true,keyEvents:18,keyChange:'10%',keyUp:false,eventCount:'12,400',evtChange:'5%',evtUp:true,chartType:'donut',donutData:[{name:'google',value:2100,color:'#4DA6FF'}],timeData:TIME_DATA.map(t=>({...t,v:Math.round(t.v*0.009),v2:Math.round(t.v2*0.01)}))},
  email:{views:733,viewsChange:'38%',viewsUp:true,sessions:364,sessChange:'32%',sessUp:true,users:309,usersChange:'76%',usersUp:true,engagement:'3h 30m 40s',engChange:'4.12%',engUp:false,keyEvents:6,keyChange:'20%',keyUp:true,eventCount:'3,498',evtChange:'21%',evtUp:true,chartType:'donut',donutData:[{name:'mailchimp',value:600,color:'#4DA6FF'},{name:'other',value:133,color:'#4CAF82'}],timeData:TIME_DATA.map(t=>({...t,v:Math.round(t.v*0.003),v2:Math.round(t.v2*0.004)}))},
  video:{views:540,viewsChange:'1%',viewsUp:true,sessions:290,sessChange:'2%',sessUp:true,users:240,usersChange:'1%',usersUp:true,engagement:'2h 44m',engChange:'3%',engUp:true,keyEvents:4,keyChange:'0%',keyUp:true,eventCount:'2,100',evtChange:'1%',evtUp:true,chartType:'donut',donutData:[{name:'youtube',value:540,color:'#4DA6FF'}],timeData:TIME_DATA.map(t=>({...t,v:Math.round(t.v*0.002),v2:Math.round(t.v2*0.002)}))},
  'paid-social':{views:7921,viewsChange:'39%',viewsUp:false,sessions:8288,sessChange:'7.62%',sessUp:true,users:7972,usersChange:'22%',usersUp:true,engagement:'5h 37m 40s',engChange:'89%',engUp:false,keyEvents:9,keyChange:'97%',keyUp:false,eventCount:'36,718',evtChange:'53%',evtUp:false,chartType:'bar',barData:[{name:'facebook',value:4200,color:'#4DA6FF'},{name:'instagram',value:2800,color:'#4CAF82'},{name:'linkedin',value:620,color:'#F9B62A'},{name:'twitter',value:301,color:'#A8D8FF'}],timeData:TIME_DATA.map(t=>({...t,v:Math.round(t.v*0.03),v2:Math.round(t.v2*0.035)}))},
}

const SHARED_KPI: ChannelData = {sessions:120500,sessChange:'0.35%',sessUp:false,users:88069,usersChange:'0.69%',usersUp:true,engagement:'66d 21h 22m 49s',engChange:'1.65%',engUp:false,views:242900,viewsChange:'1.91%',viewsUp:false,keyEvents:3610,keyChange:'21%',keyUp:false,eventCount:'1.54 M',evtChange:'2.67%',evtUp:false,chartType:'donut',timeData:[]}

function fmt(n:number){if(n>=1000000)return(n/1000000).toFixed(2)+' M';if(n>=1000)return(n/1000).toFixed(1)+' K';return n.toLocaleString()}
function Change({val,up}:{val:string;up:boolean}){return <span style={{fontSize:11,fontWeight:700,color:up?'#22c55e':'#ef4444'}}>{up?'▲':'▼'} {val}</span>}

function KPICards({cd,altCards}:{cd:ChannelData;altCards?:React.ReactNode[]}){
  const row1=[
    {label:'Sessions',val:cd.sessions>=1000?fmt(cd.sessions):cd.sessions.toLocaleString(),change:cd.sessChange,up:cd.sessUp,hl:false},
    {label:altCards?'New Users':'Total Users',val:altCards?'82,033':cd.users>=1000?fmt(cd.users):cd.users.toLocaleString(),change:altCards?'0.37%':cd.usersChange,up:altCards?true:cd.usersUp,hl:false},
    {label:'Total Users',val:cd.users>=1000?fmt(cd.users):cd.users.toLocaleString(),change:cd.usersChange,up:cd.usersUp,hl:true},
    {label:'User Engagement',val:cd.engagement,change:cd.engChange,up:cd.engUp,hl:false},
  ]
  const row2=[
    {label:'Views',val:fmt(cd.views),change:cd.viewsChange,up:cd.viewsUp,hl:false},
    {label:altCards?'Conversions':'Event Count',val:altCards?cd.keyEvents.toLocaleString():cd.eventCount,change:altCards?cd.keyChange:cd.evtChange,up:altCards?cd.keyUp:cd.evtUp,hl:altCards?true:false},
    {label:'Event Count',val:cd.eventCount,change:cd.evtChange,up:cd.evtUp,hl:false},
    {label:'Total Purchasers',val:'0',change:'0%',up:true,hl:false,badge:true},
  ]
  if(altCards){
    return(
      <>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:12}}>
          {[
            {label:'Sessions',val:fmt(cd.sessions),change:cd.sessChange,up:cd.sessUp,hl:false},
            {label:'New Users',val:'82,033',change:'0.37%',up:true,hl:false},
            {label:'Total Users',val:fmt(cd.users),change:cd.usersChange,up:cd.usersUp,hl:true},
            {label:'User Engagement',val:cd.engagement,change:cd.engChange,up:cd.engUp,hl:false},
          ].map(k=>(
            <div key={k.label} style={{background:'#fff',border:`${k.hl?2:1}px solid ${k.hl?'#48b5ea':'#e5e5e5'}`,borderRadius:8,padding:'16px 20px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                <span style={{fontSize:13,color:'#555'}}>{k.label}</span>
                {k.hl?<button style={{background:'none',border:'none',cursor:'pointer',color:'#bbb'}}><MoreHorizontal size={14}/></button>:<Change val={k.change} up={k.up}/>}
              </div>
              <p style={{fontSize:28,fontWeight:700,color:'#1a1a1a',letterSpacing:'-0.5px',lineHeight:1.2}}>{k.val}</p>
              {k.hl&&<div style={{marginTop:6}}><Change val={k.change} up={k.up}/></div>}
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
          {[
            {label:'Views',val:fmt(cd.views),change:cd.viewsChange,up:cd.viewsUp,hl:false},
            {label:'Conversions',val:cd.keyEvents.toLocaleString(),change:cd.keyChange,up:cd.keyUp,hl:true},
            {label:'Event Count',val:cd.eventCount,change:cd.evtChange,up:cd.evtUp,hl:false},
            {label:'Total Purchasers',val:'0',change:'0%',up:true,hl:false,badge:true},
          ].map(k=>(
            <div key={k.label} style={{background:'#fff',border:`${k.hl?2:1}px solid ${k.hl?'#48b5ea':'#e5e5e5'}`,borderRadius:8,padding:'16px 20px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                <span style={{fontSize:13,color:'#555'}}>{k.label}</span>
                {(k as any).badge?<span style={{fontSize:11,fontWeight:600,color:'#999',background:'#f0f0f0',padding:'2px 6px',borderRadius:4}}>0%</span>:(k.hl?<button style={{background:'none',border:'none',cursor:'pointer',color:'#bbb'}}><MoreHorizontal size={14}/></button>:<Change val={k.change} up={k.up}/>)}
              </div>
              <p style={{fontSize:28,fontWeight:700,color:'#1a1a1a',letterSpacing:'-0.5px',lineHeight:1.2}}>{k.val}</p>
              {k.hl&&<div style={{marginTop:6}}><Change val={k.change} up={k.up}/></div>}
            </div>
          ))}
        </div>
      </>
    )
  }
  return(
    <>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:12}}>
        {[
          {label:'Sessions',val:cd.sessions>=1000?fmt(cd.sessions):cd.sessions.toLocaleString(),change:cd.sessChange,up:cd.sessUp,hl:false},
          {label:'Total Users',val:cd.users>=1000?fmt(cd.users):cd.users.toLocaleString(),change:cd.usersChange,up:cd.usersUp,hl:false},
          {label:'User Engagement',val:cd.engagement,change:cd.engChange,up:cd.engUp,hl:false},
          {label:'Views',val:fmt(cd.views),change:cd.viewsChange,up:cd.viewsUp,hl:true},
        ].map(k=>(
          <div key={k.label} style={{background:'#fff',border:`${k.hl?2:1}px solid ${k.hl?'#48b5ea':'#e5e5e5'}`,borderRadius:8,padding:'16px 20px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <span style={{fontSize:13,color:'#555'}}>{k.label}</span>
              {k.hl?<button style={{background:'none',border:'none',cursor:'pointer',color:'#bbb'}}><MoreHorizontal size={14}/></button>:<Change val={k.change} up={k.up}/>}
            </div>
            <p style={{fontSize:28,fontWeight:700,color:'#1a1a1a',letterSpacing:'-0.5px',lineHeight:1.2}}>{k.val}</p>
            {k.hl&&<div style={{marginTop:6}}><Change val={k.change} up={k.up}/></div>}
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
        {[
          {label:'Key Events',val:cd.keyEvents>=1000?fmt(cd.keyEvents):cd.keyEvents.toLocaleString(),change:cd.keyChange,up:cd.keyUp,badge:false},
          {label:'Event Count',val:cd.eventCount,change:cd.evtChange,up:cd.evtUp,badge:false},
          {label:'Total Purchasers',val:'0',change:'0%',up:true,badge:true},
        ].map(k=>(
          <div key={k.label} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:'16px 20px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <span style={{fontSize:13,color:'#555'}}>{k.label}</span>
              {k.badge?<span style={{fontSize:11,fontWeight:600,color:'#999',background:'#f0f0f0',padding:'2px 6px',borderRadius:4}}>0%</span>:<Change val={k.change} up={k.up}/>}
            </div>
            <p style={{fontSize:28,fontWeight:700,color:'#1a1a1a',letterSpacing:'-0.5px'}}>{k.val}</p>
          </div>
        ))}
      </div>
    </>
  )
}

// ── Shared area chart (left) ──────────────────────────────────────────────────
function LeftAreaChart({data,metric,value,change,up}:{data:TimeEntry[];metric:string;value:string;change:string;up:boolean}){
  return(
    <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
        <span style={{fontSize:13,color:'#555'}}>{metric}</span>
        <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:16,fontWeight:700}}>{value}</span><Change val={change} up={up}/></div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="lac1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#48b5ea" stopOpacity={0.2}/><stop offset="95%" stopColor="#48b5ea" stopOpacity={0}/></linearGradient>
            <linearGradient id="lac2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a8d8ff" stopOpacity={0.15}/><stop offset="95%" stopColor="#a8d8ff" stopOpacity={0}/></linearGradient>
          </defs>
          <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/>
          <YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#999'}} tickFormatter={(v:number)=>v>=1000?(v/1000)+'K':String(v)}/>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
          <Tooltip contentStyle={{fontSize:11,borderRadius:6}}/>
          <Area type="monotone" dataKey="v" stroke="#48b5ea" fill="url(#lac1)" strokeWidth={2} name="This period"/>
          <Area type="monotone" dataKey="v2" stroke="#a8d8ff" fill="url(#lac2)" strokeWidth={1.5} strokeDasharray="4 2" name="Prev period"/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Acquisition right chart ───────────────────────────────────────────────────
function AcqRightChart({cd}:{cd:ChannelData}){
  if(cd.chartType==='donut'&&cd.donutData){
    const total=cd.donutData.reduce((s,d)=>s+d.value,0)
    return(
      <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
          <span style={{fontSize:13,color:'#555'}}>Views</span>
          <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:16,fontWeight:700}}>{fmt(cd.views)}</span><Change val={cd.viewsChange} up={cd.viewsUp}/></div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:20}}>
          <div style={{position:'relative',width:170,height:170,flexShrink:0}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={cd.donutData} cx="50%" cy="50%" innerRadius={52} outerRadius={80} dataKey="value">{cd.donutData.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip contentStyle={{fontSize:11,borderRadius:6}} formatter={(v:number)=>[v.toLocaleString(),'']}/></PieChart>
            </ResponsiveContainer>
            <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <span style={{fontSize:18,fontWeight:700}}>{fmt(total)}</span>
              <span style={{fontSize:10,color:'#999'}}>Views</span>
            </div>
          </div>
          <div style={{flex:1}}>{cd.donutData.map(d=>(
            <div key={d.name} style={{display:'flex',alignItems:'center',gap:8,marginBottom:7}}>
              <div style={{width:9,height:9,borderRadius:'50%',background:d.color,flexShrink:0}}/>
              <span style={{fontSize:12,color:'#333',flex:1}}>{d.name}</span>
              <span style={{fontSize:12,fontWeight:600}}>{d.value>=1000?fmt(d.value):d.value.toLocaleString()}</span>
            </div>
          ))}</div>
        </div>
      </div>
    )
  }
  if(cd.chartType==='bar'&&cd.barData){
    return(
      <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
          <span style={{fontSize:13,color:'#555'}}>Views</span>
          <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:16,fontWeight:700}}>{fmt(cd.views)}</span><Change val={cd.viewsChange} up={cd.viewsUp}/><button style={{background:'none',border:'none',cursor:'pointer',color:'#bbb'}}><MoreHorizontal size={14}/></button></div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={cd.barData} barSize={26}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/>
            <YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#999'}} tickFormatter={(v:number)=>v>=1000?(v/1000)+'K':String(v)}/>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
            <Tooltip contentStyle={{fontSize:11,borderRadius:6}} formatter={(v:number)=>[v.toLocaleString(),'Views']}/>
            <Bar dataKey="value" radius={[3,3,0,0]}>{cd.barData.map((d,i)=><Cell key={i} fill={d.color}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }
  return null
}

// ── Generic data table ────────────────────────────────────────────────────────
function DataTable({colLabel,rows,search,onSearch,rowCount,totalCount}:{colLabel:string;rows:any[];search:string;onSearch:(v:string)=>void;rowCount:number;totalCount:number}){
  return(
    <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,overflow:'hidden',marginTop:16}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px',borderBottom:'1px solid #f0f0f0'}}>
        <span style={{fontSize:12,color:'#666'}}>Showing {rowCount} of {totalCount} Rows</span>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <input value={search} onChange={e=>onSearch(e.target.value)} placeholder="Search" style={{background:'#fafafa',border:'1px solid #e5e5e5',borderRadius:6,padding:'5px 10px',fontSize:12,outline:'none',width:160}}/>
          <button style={{background:'none',border:'none',cursor:'pointer',color:'#bbb'}}><MoreHorizontal size={14}/></button>
        </div>
      </div>
      <div style={{overflowX:'auto' as const}}>
        <table style={{width:'100%',borderCollapse:'collapse' as const,fontSize:12}}>
          <thead><tr style={{borderBottom:'1px solid #f0f0f0',background:'#fafafa'}}>
            {[colLabel,'SESSIONS ↓','TOTAL USERS','USER ENGAGEMENT','VIEWS','KEY EVENTS','EVENT COUNT','TOTAL PURCHASERS'].map(h=>(
              <th key={h} style={{padding:'9px 14px',textAlign:h===colLabel?'left':'right' as any,fontSize:11,fontWeight:600,color:'#888',whiteSpace:'nowrap' as const}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {rows.map((row,i)=>(
              <tr key={i} style={{borderBottom:'1px solid #f8f8f8',background:i%2===0?'#fff':'#fafafa'}}>
                <td style={{padding:'11px 14px',fontWeight:500,color:'#1a1a1a'}}>{row.label||row.channel}</td>
                <td style={{padding:'11px 14px',textAlign:'right' as const}}><div style={{fontWeight:500}}>{typeof row.sessions==='number'?row.sessions.toLocaleString():row.sessions}</div><Change val={row.sessChange} up={row.sessUp}/></td>
                <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{typeof row.users==='number'?row.users.toLocaleString():row.users}</div><Change val={row.usersChange} up={row.usersUp}/></td>
                <td style={{padding:'11px 14px',textAlign:'right' as const,fontSize:12,color:'#555'}}><div>{row.engagement}</div><Change val={row.engChange} up={row.engUp}/></td>
                <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{typeof row.views==='number'?row.views.toLocaleString():row.views}</div><Change val={row.viewsChange} up={row.viewsUp}/></td>
                <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{typeof row.keyEvents==='number'?row.keyEvents.toFixed(2):row.keyEvents}</div><Change val={row.keyChange} up={row.keyUp}/></td>
                <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{typeof row.eventCount==='number'?row.eventCount.toLocaleString():row.eventCount}</div><Change val={row.evtChange} up={row.evtUp}/></td>
                <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{row.purchasers||'0.00'}</div><span style={{fontSize:10,fontWeight:600,color:'#999',background:'#f0f0f0',padding:'1px 5px',borderRadius:3}}>{row.pct||'0%'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── CONVERSIONS: Campaigns ────────────────────────────────────────────────────
const CAMPAIGN_ROWS = [
  {label:'(organic)',              sessions:66118, sessChange:'8.34%',sessUp:true,  users:43681,usersChange:'7.75%',usersUp:true, engagement:'42d 14h 19m 28s',engChange:'6.75%',engUp:true,  views:146073,viewsChange:'5.29%',viewsUp:true,  keyEvents:2164,keyChange:'11%',keyUp:false,eventCount:957626, evtChange:'4.99%',evtUp:true,  purchasers:'0.00',pct:'0%'},
  {label:'(direct)',               sessions:34637, sessChange:'13%',  sessUp:false, users:25454,usersChange:'15%',  usersUp:false,engagement:'15d 10h 38m 53s',engChange:'12%',  engUp:false, views:59636, viewsChange:'9.35%',viewsUp:false, keyEvents:872, keyChange:'24%',keyUp:false,eventCount:351990, evtChange:'8.99%',evtUp:false, purchasers:'0.00',pct:'0%'},
  {label:'(referral)',             sessions:8946,  sessChange:'15%',  sessUp:true,  users:7136, usersChange:'16%',  usersUp:true, engagement:'3d 20h 46m 59s', engChange:'5.77%',engUp:true,  views:14349, viewsChange:'2.03%',viewsUp:true,  keyEvents:324, keyChange:'25%',keyUp:false,eventCount:92427,  evtChange:'2.65%',evtUp:false, purchasers:'0.00',pct:'0%'},
  {label:'120245163449890736',     sessions:3761,  sessChange:'100%', sessUp:true,  users:3614, usersChange:'100%', usersUp:true, engagement:'1h 14m 40s',      engChange:'100%', engUp:true,  views:3905,  viewsChange:'100%', viewsUp:true,  keyEvents:0,   keyChange:'0%', keyUp:true, eventCount:14079,  evtChange:'100%', evtUp:true,  purchasers:'0.00',pct:'0%'},
  {label:'ABP|Google|Search|All|Main',sessions:3884,sessChange:'1.27%',sessUp:false,users:2728,usersChange:'2.26%',usersUp:false,engagement:'3d 16h 49m 29s', engChange:'10%',  engUp:true,  views:10905, viewsChange:'3.76%',viewsUp:true,  keyEvents:159, keyChange:'2.58%',keyUp:true,eventCount:75157,  evtChange:'4.43%',evtUp:true,  purchasers:'0.00',pct:'0%'},
  {label:'120244341746720736',     sessions:1772,  sessChange:'2010%',sessUp:true,  users:1747, usersChange:'1980%',usersUp:true, engagement:'12m 10s',          engChange:'87%',  engUp:true,  views:1846,  viewsChange:'2697%',viewsUp:true,  keyEvents:0,   keyChange:'0%', keyUp:true, eventCount:6077,   evtChange:'1153%',evtUp:true,  purchasers:'0.00',pct:'0%'},
  {label:'120245595562860736',     sessions:920,   sessChange:'100%', sessUp:true,  users:854,  usersChange:'100%', usersUp:true, engagement:'1h 19m 19s',       engChange:'100%', engUp:true,  views:625,   viewsChange:'100%', viewsUp:true,  keyEvents:4,   keyChange:'100%',keyUp:true,eventCount:5443,   evtChange:'100%', evtUp:true,  purchasers:'0.00',pct:'0%'},
  {label:'120243712244710736',     sessions:765,   sessChange:'243%', sessUp:true,  users:752,  usersChange:'240%', usersUp:true, engagement:'14m 30s',           engChange:'41%',  engUp:false, views:395,   viewsChange:'142%', viewsUp:true,  keyEvents:0,   keyChange:'0%', keyUp:true, eventCount:3437,   evtChange:'176%', evtUp:true,  purchasers:'0.00',pct:'0%'},
  {label:'button_list_VisitOurWebsite',sessions:521,sessChange:'54%',sessUp:false,users:467,usersChange:'52%',usersUp:false,engagement:'10h 8m 56s',engChange:'57%',engUp:false,views:1692,viewsChange:'58%',viewsUp:false,keyEvents:41,keyChange:'24%',keyUp:false,eventCount:11998,evtChange:'57%',evtUp:false,purchasers:'0.00',pct:'0%'},
  {label:'(not set)',              sessions:416,   sessChange:'13%',  sessUp:true,  users:321,  usersChange:'1.83%',usersUp:false,engagement:'5h 34m 16s',        engChange:'46%',  engUp:true,  views:733,   viewsChange:'17%',  viewsUp:true,  keyEvents:16,  keyChange:'27%',keyUp:false,eventCount:4958,   evtChange:'24%',  evtUp:true,  purchasers:'0.00',pct:'0%'},
]

function ConversionsCampaigns({search,onSearch}:{search:string;onSearch:(v:string)=>void}){
  const campaignBarData=[
    {name:'(organic)',v:43681,color:'#4DA6FF'},{name:'(direct)',v:25454,color:'#9CCC65'},
    {name:'(referral)',v:7136,color:'#F9B62A'},{name:'120245163434...',v:3614,color:'#A8D8FF'},
    {name:'ABP|Google|S...',v:2728,color:'#CE93D8'},{name:'120244341174...',v:1747,color:'#FFB74D'},
    {name:'120244559556...',v:854,color:'#B0BEC5'},{name:'120243712244...',v:752,color:'#80CBC4'},
  ]
  const campaignKPI:ChannelData={...SHARED_KPI}
  return(
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        <LeftAreaChart data={TIME_DATA.map(t=>({...t,v:Math.round(t.v*0.55),v2:Math.round(t.v2*0.52)}))} metric="Total Users" value="88,069" change="0.69%" up={true}/>
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
            <span style={{fontSize:13,color:'#555'}}>Total Users</span>
            <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:16,fontWeight:700}}>88,069</span><Change val="0.69%" up={true}/></div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={campaignBarData} barSize={26}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/>
              <YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#999'}} tickFormatter={(v:number)=>v>=1000?(v/1000)+'K':String(v)}/>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
              <Tooltip contentStyle={{fontSize:11,borderRadius:6}} formatter={(v:number)=>[v.toLocaleString(),'Users']}/>
              <Bar dataKey="v" radius={[3,3,0,0]}>{campaignBarData.map((d,i)=><Cell key={i} fill={d.color}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <KPICards cd={campaignKPI} altCards={[]}/>
      {/* Campaign table with extra NEW USERS column */}
      <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,overflow:'hidden',marginTop:16}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px',borderBottom:'1px solid #f0f0f0'}}>
          <span style={{fontSize:12,color:'#666'}}>Showing {CAMPAIGN_ROWS.filter(r=>r.label.toLowerCase().includes(search.toLowerCase())).length} of 63 Rows</span>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <input value={search} onChange={e=>onSearch(e.target.value)} placeholder="Search" style={{background:'#fafafa',border:'1px solid #e5e5e5',borderRadius:6,padding:'5px 10px',fontSize:12,outline:'none',width:160}}/>
            <button style={{background:'none',border:'none',cursor:'pointer',color:'#bbb'}}><MoreHorizontal size={14}/></button>
          </div>
        </div>
        <div style={{overflowX:'auto' as const}}>
          <table style={{width:'100%',borderCollapse:'collapse' as const,fontSize:12}}>
            <thead><tr style={{borderBottom:'1px solid #f0f0f0',background:'#fafafa'}}>
              {['CAMPAIGN','SESSIONS','NEW USERS','TOTAL USERS ↓','USER ENGAGEMENT','VIEWS','CONVERSIONS','EVENT COUNT','TOTAL PURCHASERS'].map(h=>(
                <th key={h} style={{padding:'9px 12px',textAlign:h==='CAMPAIGN'?'left':'right' as any,fontSize:11,fontWeight:600,color:'#888',whiteSpace:'nowrap' as const}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {CAMPAIGN_ROWS.filter(r=>r.label.toLowerCase().includes(search.toLowerCase())).map((row,i)=>(
                <tr key={i} style={{borderBottom:'1px solid #f8f8f8',background:i%2===0?'#fff':'#fafafa'}}>
                  <td style={{padding:'10px 12px',fontWeight:500,color:'#1a1a1a',maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>{row.label}</td>
                  <td style={{padding:'10px 12px',textAlign:'right' as const}}><div>{row.sessions.toLocaleString()}</div><Change val={row.sessChange} up={row.sessUp}/></td>
                  <td style={{padding:'10px 12px',textAlign:'right' as const}}><div>{Math.round(row.sessions*0.62).toLocaleString()}</div><Change val={row.sessChange} up={row.sessUp}/></td>
                  <td style={{padding:'10px 12px',textAlign:'right' as const}}><div>{row.users.toLocaleString()}</div><Change val={row.usersChange} up={row.usersUp}/></td>
                  <td style={{padding:'10px 12px',textAlign:'right' as const,fontSize:12,color:'#555'}}><div>{row.engagement}</div><Change val={row.engChange} up={row.engUp}/></td>
                  <td style={{padding:'10px 12px',textAlign:'right' as const}}><div>{row.views.toLocaleString()}</div><Change val={row.viewsChange} up={row.viewsUp}/></td>
                  <td style={{padding:'10px 12px',textAlign:'right' as const}}><div>{row.keyEvents.toFixed(2)}</div><Change val={row.keyChange} up={row.keyUp}/></td>
                  <td style={{padding:'10px 12px',textAlign:'right' as const}}><div>{row.eventCount.toLocaleString()}</div><Change val={row.evtChange} up={row.evtUp}/></td>
                  <td style={{padding:'10px 12px',textAlign:'right' as const}}><div>{row.purchasers}</div><span style={{fontSize:10,fontWeight:600,color:'#999',background:'#f0f0f0',padding:'1px 5px',borderRadius:3}}>0%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

// ── CONVERSIONS: Ecommerce ────────────────────────────────────────────────────
function ConversionsEcommerce(){
  const [ecomTab,setEcomTab]=useState<'Product Name'|'Brand'|'Category'|'Item List ID'|'Item List Name'>('Product Name')
  return(
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        {['Items Viewed','Items Viewed'].map((label,i)=>(
          <div key={i} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <span style={{fontSize:13,color:'#555'}}>{label}</span>
              <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:16,fontWeight:700}}>0</span><span style={{fontSize:11,fontWeight:600,color:'#999',background:'#f0f0f0',padding:'2px 6px',borderRadius:4}}>0%</span></div>
            </div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:160,color:'#bbb',fontSize:13}}>No Items Viewed found for your date range</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        {[
          {label:'Items Viewed',val:'0',hl:true},{label:'Item Revenue',val:'$0.00',hl:false},
          {label:'Total Purchasers',val:'0',hl:false},{label:'Items Purchased',val:'0',hl:false},
        ].map(k=>(
          <div key={k.label} style={{background:'#fff',border:`${k.hl?2:1}px solid ${k.hl?'#48b5ea':'#e5e5e5'}`,borderRadius:8,padding:'16px 20px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <span style={{fontSize:13,color:'#555'}}>{k.label}</span>
              <span style={{fontSize:11,fontWeight:600,color:'#999',background:'#f0f0f0',padding:'2px 6px',borderRadius:4}}>0%</span>
            </div>
            <p style={{fontSize:28,fontWeight:700,color:'#1a1a1a',letterSpacing:'-0.5px'}}>{k.val}</p>
          </div>
        ))}
      </div>
      <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,overflow:'hidden'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px',borderBottom:'1px solid #f0f0f0'}}>
          <div style={{display:'flex',gap:4,alignItems:'center'}}>
            {(['Product Name','Brand','Category','Item List ID','Item List Name'] as const).map(t=>(
              <button key={t} onClick={()=>setEcomTab(t)} style={{padding:'5px 12px',fontSize:12,borderRadius:6,cursor:'pointer',border:'none',background:ecomTab===t?'#48b5ea':'#f0f0f0',color:ecomTab===t?'#fff':'#555',fontWeight:ecomTab===t?600:400,whiteSpace:'nowrap' as const}}>{t}</button>
            ))}
            <span style={{fontSize:12,color:'#999',marginLeft:8}}>No results</span>
          </div>
          <input placeholder="Search" style={{background:'#fafafa',border:'1px solid #e5e5e5',borderRadius:6,padding:'5px 10px',fontSize:12,outline:'none',width:160}}/>
        </div>
        <table style={{width:'100%',borderCollapse:'collapse' as const,fontSize:12}}>
          <thead><tr style={{borderBottom:'1px solid #f0f0f0',background:'#fafafa'}}>
            {['ITEM NAME','ITEMS VIEWED ↓','ITEM REVENUE','TOTAL PURCHASERS','ITEMS PURCHASED'].map(h=>(
              <th key={h} style={{padding:'9px 14px',textAlign:h==='ITEM NAME'?'left':'right' as any,fontSize:11,fontWeight:600,color:'#888',whiteSpace:'nowrap' as const}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            <tr><td colSpan={5} style={{padding:'60px 20px',textAlign:'center' as const}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12,color:'#bbb'}}>
                <div style={{width:44,height:44,borderRadius:'50%',background:'#f0f0f0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>📄</div>
                <span style={{fontSize:13}}>No data available in the table</span>
              </div>
            </td></tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

// ── AUDIENCE views (abbreviated — same as before) ─────────────────────────────
function AudienceLocation({search,onSearch}:{search:string;onSearch:(v:string)=>void}){
  const [locTab,setLocTab]=useState<'Country'|'Region'|'City'>('Country')
  const countryBarData=[{name:'United States',v:234751},{name:'Singapore',v:2800},{name:'United King...',v:1890},{name:'Canada',v:1450},{name:'Germany',v:820},{name:'India',v:740},{name:'Netherlands',v:595},{name:'China',v:620}]
  const tableRows=[
    {label:'United States',sessions:115468,users:83759,engagement:'65d 14h 23m 35s',views:234751,keyEvents:3520,eventCount:1490758,purchasers:'0.00',sessChange:'4.11%',sessUp:true,usersChange:'7.88%',usersUp:true,engChange:'1.37%',engUp:false,viewsChange:'0.32%',viewsUp:true,keyChange:'21%',keyUp:false,evtChange:'0.68%',evtUp:true,pct:'0%'},
    {label:'Singapore',sessions:1689,users:1420,engagement:'18h 12m',views:3200,keyEvents:45,eventCount:9900,purchasers:'0.00',sessChange:'3%',sessUp:true,usersChange:'2%',usersUp:true,engChange:'1%',engUp:true,viewsChange:'2%',viewsUp:true,keyChange:'5%',keyUp:true,evtChange:'3%',evtUp:true,pct:'0%'},
    {label:'United Kingdom',sessions:980,users:820,engagement:'12h 44m',views:1890,keyEvents:32,eventCount:5400,purchasers:'0.00',sessChange:'2%',sessUp:true,usersChange:'1%',usersUp:true,engChange:'0%',engUp:true,viewsChange:'1%',viewsUp:true,keyChange:'3%',keyUp:true,evtChange:'2%',evtUp:true,pct:'0%'},
    {label:'Canada',sessions:760,users:640,engagement:'9h 22m',views:1450,keyEvents:28,eventCount:3900,purchasers:'0.00',sessChange:'1%',sessUp:true,usersChange:'1%',usersUp:true,engChange:'0%',engUp:true,viewsChange:'1%',viewsUp:true,keyChange:'2%',keyUp:true,evtChange:'1%',evtUp:true,pct:'0%'},
  ]
  return(
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:13,color:'#555'}}>Views</span><div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:16,fontWeight:700}}>243 K</span><Change val="1.91%" up={false}/></div></div>
          <div style={{position:'relative',width:'100%',height:220,background:'#f8f9fa',borderRadius:6,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg viewBox="0 0 800 400" style={{width:'100%',height:'100%'}}>
              <path d="M 80 80 L 190 70 L 225 105 L 215 185 L 172 225 L 118 205 L 78 162 Z" fill="#4DA6FF" opacity="0.85"/>
              <path d="M 148 245 L 202 232 L 222 305 L 202 375 L 160 385 L 138 322 Z" fill="#c8e6ff" opacity="0.6"/>
              <path d="M 338 58 L 422 52 L 444 102 L 402 132 L 350 122 L 330 90 Z" fill="#c8e6ff" opacity="0.5"/>
              <path d="M 358 148 L 422 138 L 452 222 L 432 325 L 380 335 L 348 252 L 338 182 Z" fill="#c8e6ff" opacity="0.4"/>
              <path d="M 448 48 L 652 42 L 682 132 L 602 202 L 478 192 L 438 132 Z" fill="#c8e6ff" opacity="0.35"/>
              <path d="M 598 258 L 682 252 L 702 322 L 662 352 L 598 342 L 578 292 Z" fill="#c8e6ff" opacity="0.4"/>
            </svg>
            <div style={{position:'absolute',bottom:10,right:10,background:'rgba(0,0,0,0.72)',color:'#fff',padding:'3px 8px',borderRadius:4,fontSize:11}}>United States · Views 234,751</div>
          </div>
        </div>
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:13,color:'#555'}}>Views</span><div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:16,fontWeight:700}}>243 K</span><Change val="1.91%" up={false}/><button style={{background:'none',border:'none',cursor:'pointer',color:'#bbb'}}><MoreHorizontal size={14}/></button></div></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={countryBarData} barSize={28}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/>
              <YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#999'}} tickFormatter={(v:number)=>v>=1000?(v/1000)+'K':String(v)}/>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
              <Tooltip contentStyle={{fontSize:11,borderRadius:6}} formatter={(v:number)=>[v.toLocaleString(),'Views']}/>
              <Bar dataKey="v" radius={[3,3,0,0]}>{countryBarData.map((_,i)=><Cell key={i} fill={i===0?'#4DA6FF':'#c8e6ff'}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <KPICards cd={SHARED_KPI}/>
      <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,overflow:'hidden',marginTop:16}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px',borderBottom:'1px solid #f0f0f0'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            {(['Country','Region','City'] as const).map(t=>(
              <button key={t} onClick={()=>setLocTab(t)} style={{padding:'5px 14px',fontSize:12,borderRadius:6,cursor:'pointer',border:'none',background:locTab===t?'#48b5ea':'#f0f0f0',color:locTab===t?'#fff':'#555',fontWeight:locTab===t?600:400}}>{t}</button>
            ))}
            <span style={{fontSize:12,color:'#999',marginLeft:8}}>Showing 50 of 133 Rows</span>
          </div>
          <input value={search} onChange={e=>onSearch(e.target.value)} placeholder="Search" style={{background:'#fafafa',border:'1px solid #e5e5e5',borderRadius:6,padding:'5px 10px',fontSize:12,outline:'none',width:160}}/>
        </div>
        <div style={{overflowX:'auto' as const}}>
          <table style={{width:'100%',borderCollapse:'collapse' as const,fontSize:12}}>
            <thead><tr style={{borderBottom:'1px solid #f0f0f0',background:'#fafafa'}}>
              {[locTab.toUpperCase(),'SESSIONS ↓','TOTAL USERS','USER ENGAGEMENT','VIEWS','KEY EVENTS','EVENT COUNT','TOTAL PURCHASERS'].map(h=>(
                <th key={h} style={{padding:'9px 14px',textAlign:h===locTab.toUpperCase()?'left':'right' as any,fontSize:11,fontWeight:600,color:'#888',whiteSpace:'nowrap' as const}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{tableRows.filter(r=>r.label.toLowerCase().includes(search.toLowerCase())).map((row,i)=>(
              <tr key={i} style={{borderBottom:'1px solid #f8f8f8',background:i%2===0?'#fff':'#fafafa'}}>
                <td style={{padding:'11px 14px',fontWeight:500}}>{row.label}</td>
                <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{row.sessions.toLocaleString()}</div><Change val={row.sessChange} up={row.sessUp}/></td>
                <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{row.users.toLocaleString()}</div><Change val={row.usersChange} up={row.usersUp}/></td>
                <td style={{padding:'11px 14px',textAlign:'right' as const,fontSize:12,color:'#555'}}>{row.engagement}</td>
                <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{row.views.toLocaleString()}</div><Change val={row.viewsChange} up={row.viewsUp}/></td>
                <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{row.keyEvents.toFixed(2)}</div><Change val={row.keyChange} up={row.keyUp}/></td>
                <td style={{padding:'11px 14px',textAlign:'right' as const}}>{row.eventCount.toLocaleString()}</td>
                <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{row.purchasers}</div><span style={{fontSize:10,background:'#f0f0f0',color:'#999',padding:'1px 5px',borderRadius:3}}>0%</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function SimpleAudienceView({leftChart,rightChart,kpi}:{leftChart:React.ReactNode;rightChart:React.ReactNode;kpi:ChannelData}){
  return(
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>{leftChart}{rightChart}</div>
      <KPICards cd={kpi}/>
    </>
  )
}

function AudienceAge(){
  const ageBarData=[{name:'unknown',v:220000,color:'#4DA6FF'},{name:'25-34',v:9800,color:'#4CAF82'},{name:'35-44',v:6200,color:'#F9B62A'},{name:'45-54',v:3100,color:'#FFB74D'},{name:'18-24',v:1800,color:'#A8D8FF'},{name:'55-64',v:1400,color:'#CE93D8'},{name:'65+',v:600,color:'#B0BEC5'}]
  const ageLineData=TIME_DATA.map(t=>({d:t.d,views:t.v,'25-34':Math.round(t.v*0.04),'35-44':Math.round(t.v*0.025),'45-54':Math.round(t.v*0.012),'65+':Math.round(t.v*0.003),'18-24':Math.round(t.v*0.008),'55-64':Math.round(t.v*0.006)}))
  return(
    <SimpleAudienceView kpi={SHARED_KPI}
      leftChart={<div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}><span style={{fontSize:13,color:'#555'}}>Views</span><ResponsiveContainer width="100%" height={220}><BarChart data={ageBarData} barSize={30}><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#999'}} tickFormatter={(v:number)=>v>=1000?(v/1000)+'K':String(v)}/><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/><Tooltip contentStyle={{fontSize:11,borderRadius:6}} formatter={(v:number)=>[v.toLocaleString(),'Views']}/><Bar dataKey="v" radius={[3,3,0,0]}>{ageBarData.map((d,i)=><Cell key={i} fill={d.color}/>)}</Bar></BarChart></ResponsiveContainer></div>}
      rightChart={<div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:13,color:'#555'}}>Views</span><div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:16,fontWeight:700}}>243 K</span><Change val="1.91%" up={false}/></div></div><ResponsiveContainer width="100%" height={200}><LineChart data={ageLineData}><XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#999'}} tickFormatter={(v:number)=>v>=1000?(v/1000)+'K':String(v)}/><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><Tooltip contentStyle={{fontSize:11,borderRadius:6}}/><Legend wrapperStyle={{fontSize:10}}/>{['views','25-34','35-44','45-54','65+','18-24','55-64'].map((k,i)=>(<Line key={k} type="monotone" dataKey={k} stroke={['#48b5ea','#4CAF82','#F9B62A','#FFB74D','#A8D8FF','#CE93D8','#B0BEC5'][i]} dot={false} strokeWidth={k==='views'?2:1.5}/>))}</LineChart></ResponsiveContainer></div>}
    />
  )
}

function AudienceGender(){
  const donutData=[{name:'unknown',value:193000,color:'#4DA6FF'},{name:'Female',value:24951,color:'#f06292'},{name:'Male',value:24674,color:'#a8d8ff'}]
  const lineData=TIME_DATA.map(t=>({d:t.d,Views:t.v,Male:Math.round(t.v*0.1),Female:Math.round(t.v*0.1)}))
  return(
    <SimpleAudienceView kpi={SHARED_KPI}
      leftChart={<div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:13,color:'#555'}}>Views</span><Change val="1.91%" up={false}/></div><div style={{display:'flex',alignItems:'center',gap:24}}><div style={{position:'relative',width:180,height:180,flexShrink:0}}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={donutData} cx="50%" cy="50%" innerRadius={54} outerRadius={82} dataKey="value">{donutData.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip contentStyle={{fontSize:11,borderRadius:6}} formatter={(v:number)=>[v.toLocaleString(),'']}/></PieChart></ResponsiveContainer><div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:18,fontWeight:700}}>242.9 K</span><span style={{fontSize:10,color:'#999'}}>Views</span></div></div><div>{donutData.map(d=><div key={d.name} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}><div style={{width:10,height:10,borderRadius:'50%',background:d.color}}/><span style={{fontSize:12,color:'#333',flex:1}}>{d.name}</span><span style={{fontSize:12,fontWeight:600}}>{d.value>=1000?fmt(d.value):d.value.toLocaleString()}</span></div>)}</div></div></div>}
      rightChart={<div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:13,color:'#555'}}>Views</span><div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:16,fontWeight:700}}>243 K</span><Change val="1.91%" up={false}/></div></div><ResponsiveContainer width="100%" height={200}><LineChart data={lineData}><XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#999'}} tickFormatter={(v:number)=>v>=1000?(v/1000)+'K':String(v)}/><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><Tooltip contentStyle={{fontSize:11,borderRadius:6}}/><Legend wrapperStyle={{fontSize:10}}/><Line type="monotone" dataKey="Views" stroke="#48b5ea" dot={false} strokeWidth={2}/><Line type="monotone" dataKey="Male" stroke="#a8d8ff" dot={false} strokeWidth={1.5}/><Line type="monotone" dataKey="Female" stroke="#f06292" dot={false} strokeWidth={1.5}/></LineChart></ResponsiveContainer></div>}
    />
  )
}

function AudienceDevices({search,onSearch}:{search:string;onSearch:(v:string)=>void}){
  const donutData=[{name:'Mobile',value:148000,color:'#9CCC65'},{name:'Desktop',value:92405,color:'#4DA6FF'},{name:'Tablet',value:2479,color:'#F9B62A'}]
  const lineData=TIME_DATA.map(t=>({d:t.d,Desktop:Math.round(t.v*0.38),Mobile:Math.round(t.v*0.61),Tablet:Math.round(t.v*0.01)}))
  const rows=[{label:'(not set)',sessions:113078,users:81242,engagement:'61d 13h 54m 21s',views:223993,keyEvents:3399,eventCount:1422396,purchasers:'0.00',sessChange:'0.86%',sessUp:false,usersChange:'0.28%',usersUp:false,engChange:'1.99%',engUp:false,viewsChange:'2.30%',viewsUp:false,keyChange:'20%',keyUp:false,evtChange:'2.98%',evtUp:false,pct:'0%'},{label:'Galaxy S25 Ultra',sessions:673,users:529,engagement:'9h 52m 50s',views:1574,keyEvents:18,eventCount:9903,purchasers:'0.00',sessChange:'15%',sessUp:true,usersChange:'15%',usersUp:true,engChange:'25%',engUp:true,viewsChange:'12%',viewsUp:true,keyChange:'40%',keyUp:true,evtChange:'9.80%',evtUp:true,pct:'0%'}]
  return(
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:13,color:'#555'}}>Views</span><Change val="1.91%" up={false}/></div>
          <div style={{display:'flex',alignItems:'center',gap:24}}>
            <div style={{position:'relative',width:180,height:180,flexShrink:0}}>
              <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={donutData} cx="50%" cy="50%" innerRadius={54} outerRadius={82} dataKey="value">{donutData.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip contentStyle={{fontSize:11,borderRadius:6}} formatter={(v:number)=>[v.toLocaleString(),'']}/></PieChart></ResponsiveContainer>
              <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:18,fontWeight:700}}>242.9 K</span><span style={{fontSize:10,color:'#999'}}>Views</span></div>
            </div>
            <div>{donutData.map(d=><div key={d.name} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}><div style={{width:10,height:10,borderRadius:'50%',background:d.color}}/><span style={{fontSize:12,color:'#333',flex:1}}>{d.name}</span><span style={{fontSize:12,fontWeight:600}}>{d.value>=1000?fmt(d.value):d.value.toLocaleString()}</span></div>)}</div>
          </div>
        </div>
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:13,color:'#555'}}>Views</span><div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:16,fontWeight:700}}>243 K</span><Change val="1.91%" up={false}/></div></div>
          <ResponsiveContainer width="100%" height={200}><LineChart data={lineData}><XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#999'}} tickFormatter={(v:number)=>v>=1000?(v/1000)+'K':String(v)}/><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><Tooltip contentStyle={{fontSize:11,borderRadius:6}}/><Legend wrapperStyle={{fontSize:10}}/><Line type="monotone" dataKey="Desktop" stroke="#4DA6FF" dot={false} strokeWidth={2}/><Line type="monotone" dataKey="Mobile" stroke="#9CCC65" dot={false} strokeWidth={2}/><Line type="monotone" dataKey="Tablet" stroke="#F9B62A" dot={false} strokeWidth={1.5}/></LineChart></ResponsiveContainer>
        </div>
      </div>
      <KPICards cd={SHARED_KPI}/>
      <DataTable colLabel="MOBILE DEVICE INFO" rows={rows} search={search} onSearch={onSearch} rowCount={rows.length} totalCount={291}/>
    </>
  )
}

function AudienceLanguage({search,onSearch}:{search:string;onSearch:(v:string)=>void}){
  const barData=[{name:'en-us',v:235063},{name:'en-gb',v:2385},{name:'es-us',v:625},{name:'zh-cn',v:548},{name:'en-ca',v:496},{name:'de-de',v:385},{name:'en',v:356},{name:'pt-br',v:280}]
  const rows=[{label:'en-us',sessions:115755,users:85020,engagement:'65d 3h 36m 23s',views:235063,keyEvents:3487,eventCount:1491210,purchasers:'0.00',sessChange:'0.92%',sessUp:false,usersChange:'1.21%',usersUp:true,engChange:'1.43%',engUp:false,viewsChange:'1.81%',viewsUp:false,keyChange:'22%',keyUp:false,evtChange:'2.58%',evtUp:false,pct:'0%'},{label:'en-gb',sessions:1285,users:854,engagement:'13h 40m 29s',views:2385,keyEvents:36,eventCount:15097,purchasers:'0.00',sessChange:'6.34%',sessUp:false,usersChange:'12%',usersUp:false,engChange:'15%',engUp:false,viewsChange:'15%',viewsUp:false,keyChange:'71%',keyUp:true,evtChange:'16%',evtUp:false,pct:'0%'},{label:'es-us',sessions:413,users:362,engagement:'2h 10m 49s',views:625,keyEvents:2,eventCount:3379,purchasers:'0.00',sessChange:'115%',sessUp:true,usersChange:'145%',usersUp:true,engChange:'52%',engUp:true,viewsChange:'66%',viewsUp:true,keyChange:'80%',keyUp:false,evtChange:'46%',evtUp:true,pct:'0%'}]
  return(
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
          <span style={{fontSize:13,color:'#555',marginBottom:8,display:'block'}}>Views</span>
          <ResponsiveContainer width="100%" height={220}><BarChart data={barData} barSize={28}><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#999'}} tickFormatter={(v:number)=>v>=1000?(v/1000)+'K':String(v)}/><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/><Tooltip contentStyle={{fontSize:11,borderRadius:6}} formatter={(v:number)=>[v.toLocaleString(),'Views']}/><Bar dataKey="v" radius={[3,3,0,0]}>{barData.map((_,i)=><Cell key={i} fill={i===0?'#4DA6FF':'#c8e6ff'}/>)}</Bar></BarChart></ResponsiveContainer>
        </div>
        <LeftAreaChart data={TIME_DATA} metric="Views" value="243 K" change="1.91%" up={false}/>
      </div>
      <KPICards cd={SHARED_KPI}/>
      <DataTable colLabel="LANGUAGE" rows={rows} search={search} onSearch={onSearch} rowCount={rows.length} totalCount={101}/>
    </>
  )
}

function AudienceBrowser({search,onSearch}:{search:string;onSearch:(v:string)=>void}){
  const barData=[{name:'Safari',v:114365,color:'#9CCC65'},{name:'Chrome',v:107687,color:'#4DA6FF'},{name:'Edge',v:12179,color:'#A8D8FF'},{name:'Android Webv...',v:5200,color:'#F9B62A'},{name:'Firefox',v:2100,color:'#CE93D8'},{name:'Safari (in-app)',v:1800,color:'#FFB74D'},{name:'Samsung Inter...',v:1200,color:'#B0BEC5'},{name:'Opera',v:800,color:'#80CBC4'}]
  const rows=[{label:'Safari',sessions:59329,users:43480,engagement:'26d 2h 18m 33s',views:114365,keyEvents:1101,eventCount:695247,purchasers:'0.00',sessChange:'4.31%',sessUp:true,usersChange:'11%',usersUp:true,engChange:'3.38%',engUp:false,viewsChange:'0.03%',viewsUp:false,keyChange:'30%',keyUp:false,evtChange:'2.56%',evtUp:false,pct:'0%'},{label:'Chrome',sessions:51872,users:36755,engagement:'33d 5h 46m 24s',views:107687,keyEvents:1993,eventCount:701552,purchasers:'0.00',sessChange:'5.26%',sessUp:false,usersChange:'9.38%',usersUp:false,engChange:'0.80%',engUp:true,viewsChange:'2.66%',viewsUp:false,keyChange:'16%',keyUp:false,evtChange:'1.75%',evtUp:false,pct:'0%'},{label:'Edge',sessions:5385,users:3434,engagement:'5d 13h 42m 34s',views:12179,keyEvents:408,eventCount:90926,purchasers:'0.00',sessChange:'0.79%',sessUp:false,usersChange:'0.50%',usersUp:true,engChange:'10%',engUp:true,viewsChange:'2.71%',viewsUp:true,keyChange:'13%',keyUp:true,evtChange:'5.47%',evtUp:true,pct:'0%'}]
  return(
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}><span style={{fontSize:13,color:'#555',marginBottom:8,display:'block'}}>Views</span><ResponsiveContainer width="100%" height={220}><BarChart data={barData} barSize={26}><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#999'}} tickFormatter={(v:number)=>v>=1000?(v/1000)+'K':String(v)}/><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/><Tooltip contentStyle={{fontSize:11,borderRadius:6}} formatter={(v:number)=>[v.toLocaleString(),'Views']}/><Bar dataKey="v" radius={[3,3,0,0]}>{barData.map((d,i)=><Cell key={i} fill={d.color}/>)}</Bar></BarChart></ResponsiveContainer></div>
        <LeftAreaChart data={TIME_DATA} metric="Views" value="243 K" change="1.91%" up={false}/>
      </div>
      <KPICards cd={SHARED_KPI}/>
      <DataTable colLabel="BROWSER" rows={rows} search={search} onSearch={onSearch} rowCount={rows.length} totalCount={16}/>
    </>
  )
}

function AudienceOS({search,onSearch}:{search:string;onSearch:(v:string)=>void}){
  const barData=[{name:'iOS',v:122069,color:'#CE93D8'},{name:'Windows',v:55444,color:'#9CCC65'},{name:'Macintosh',v:33924,color:'#F9B62A'},{name:'Android',v:28000,color:'#4DA6FF'},{name:'Chrome OS',v:2100,color:'#A8D8FF'},{name:'Linux',v:1200,color:'#FFB74D'},{name:'(not set)',v:800,color:'#B0BEC5'},{name:'Tizen',v:200,color:'#80CBC4'}]
  const rows=[{label:'iOS',sessions:64158,users:46886,engagement:'25d 19h 2m 44s',views:122069,keyEvents:1026,eventCount:732802,purchasers:'0.00',sessChange:'6.03%',sessUp:true,usersChange:'13%',usersUp:true,engChange:'2.35%',engUp:false,viewsChange:'0.97%',viewsUp:true,keyChange:'33%',keyUp:false,evtChange:'1.47%',evtUp:false,pct:'0%'},{label:'Windows',sessions:26964,users:19400,engagement:'20d 12h 12m 11s',views:55444,keyEvents:1473,eventCount:378826,purchasers:'0.00',sessChange:'17%',sessUp:false,usersChange:'21%',usersUp:false,engChange:'0.46%',engUp:true,viewsChange:'9.17%',viewsUp:false,keyChange:'7.47%',keyUp:false,evtChange:'6.86%',evtUp:false,pct:'0%'},{label:'Macintosh',sessions:15353,users:10683,engagement:'11d 15h 18m 39s',views:33924,keyEvents:753,eventCount:232357,purchasers:'0.00',sessChange:'6.13%',sessUp:false,usersChange:'0.87%',usersUp:true,engChange:'5.07%',engUp:false,viewsChange:'1.59%',viewsUp:false,keyChange:'21%',keyUp:true,evtChange:'0.97%',evtUp:true,pct:'0%'}]
  return(
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}><span style={{fontSize:13,color:'#555',marginBottom:8,display:'block'}}>Views</span><ResponsiveContainer width="100%" height={220}><BarChart data={barData} barSize={26}><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#999'}} tickFormatter={(v:number)=>v>=1000?(v/1000)+'K':String(v)}/><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/><Tooltip contentStyle={{fontSize:11,borderRadius:6}} formatter={(v:number)=>[v.toLocaleString(),'Views']}/><Bar dataKey="v" radius={[3,3,0,0]}>{barData.map((d,i)=><Cell key={i} fill={d.color}/>)}</Bar></BarChart></ResponsiveContainer></div>
        <LeftAreaChart data={TIME_DATA} metric="Views" value="243 K" change="1.91%" up={false}/>
      </div>
      <KPICards cd={SHARED_KPI}/>
      <DataTable colLabel="OPERATING SYSTEM" rows={rows} search={search} onSearch={onSearch} rowCount={rows.length} totalCount={8}/>
    </>
  )
}

function AudienceInterests({search,onSearch}:{search:string;onSearch:(v:string)=>void}){
  const barData=[{name:'News & Politic...',v:256,color:'#4DA6FF'},{name:'News & Politic...',v:204,color:'#9CCC65'},{name:'News & Politic...',v:162,color:'#F9B62A'},{name:'Sports & Fitne...',v:140,color:'#A8D8FF'},{name:'Media & Enter...',v:120,color:'#CE93D8'},{name:'Food & Dining/...',v:98,color:'#FFB74D'},{name:'Technology/Te...',v:85,color:'#B0BEC5'},{name:'Media & Enter...',v:72,color:'#80CBC4'}]
  const rows=[{label:'News & Politics/Avid News Readers/Entertainment',sessions:119,users:79,engagement:'2h 32m 39s',views:256,keyEvents:6,eventCount:1681,purchasers:'0.00',sessChange:'93%',sessUp:false,usersChange:'93%',usersUp:false,engChange:'92%',engUp:false,viewsChange:'93%',viewsUp:false,keyChange:'93%',keyUp:false,evtChange:'93%',evtUp:false,pct:'0%'},{label:'News & Politics/Avid News Readers',sessions:93,users:72,engagement:'1h 59m 30s',views:204,keyEvents:9,eventCount:1405,purchasers:'0.00',sessChange:'94%',sessUp:false,usersChange:'93%',usersUp:false,engChange:'94%',engUp:false,viewsChange:'95%',viewsUp:false,keyChange:'91%',keyUp:false,evtChange:'95%',evtUp:false,pct:'0%'}]
  const interestKPI:ChannelData={...SHARED_KPI,views:4067,viewsChange:'96%',viewsUp:false,sessions:377,sessChange:'94%',sessUp:false,users:262,usersChange:'93%',usersUp:false,engagement:'1d 10h 19m 15s',engChange:'96%',engUp:false,keyEvents:119,keyChange:'94%',keyUp:false,eventCount:'27,385',evtChange:'96%',evtUp:false}
  return(
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}><span style={{fontSize:13,color:'#555',marginBottom:8,display:'block'}}>Views</span><ResponsiveContainer width="100%" height={220}><BarChart data={barData} barSize={26}><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#999'}}/><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/><Tooltip contentStyle={{fontSize:11,borderRadius:6}} formatter={(v:number)=>[v.toLocaleString(),'Views']}/><Bar dataKey="v" radius={[3,3,0,0]}>{barData.map((d,i)=><Cell key={i} fill={d.color}/>)}</Bar></BarChart></ResponsiveContainer></div>
        <LeftAreaChart data={TIME_DATA} metric="Views" value="243 K" change="1.91%" up={false}/>
      </div>
      <KPICards cd={interestKPI}/>
      <DataTable colLabel="INTEREST" rows={rows} search={search} onSearch={onSearch} rowCount={rows.length} totalCount={57}/>
    </>
  )
}

function AudienceNewReturning({search,onSearch}:{search:string;onSearch:(v:string)=>void}){
  const donutData=[{name:'New',value:172000,color:'#4DA6FF'},{name:'Returning',value:62925,color:'#9CCC65'},{name:'Unknown',value:7821,color:'#F9B62A'}]
  const lineData=TIME_DATA.map(t=>({d:t.d,Views:t.v,New:Math.round(t.v*0.7),Returning:Math.round(t.v*0.25),Unknown:Math.round(t.v*0.03)}))
  const rows=[{label:'New',sessions:80602,users:81502,engagement:'48d 6h 59m 26s',views:172155,keyEvents:2019,eventCount:1122311,purchasers:'0.00',sessChange:'0.58%',sessUp:true,usersChange:'0.14%',usersUp:true,engChange:'1.11%',engUp:false,viewsChange:'2.85%',viewsUp:false,keyChange:'25%',keyUp:false,evtChange:'3.48%',evtUp:false,pct:'0%'},{label:'Returning',sessions:31994,users:17693,engagement:'18d 14h 23m 23s',views:62925,keyEvents:1591,eventCount:390273,purchasers:'0.00',sessChange:'1.20%',sessUp:true,usersChange:'2.22%',usersUp:true,engChange:'3.03%',engUp:false,viewsChange:'0.00%',viewsUp:false,keyChange:'14%',keyUp:false,evtChange:'0.73%',evtUp:false,pct:'0%'},{label:'Unknown',sessions:9422,users:7099,engagement:'—',views:7821,keyEvents:0,eventCount:27390,purchasers:'0.00',sessChange:'4.16%',sessUp:false,usersChange:'7.64%',usersUp:true,engChange:'0%',engUp:true,viewsChange:'4.46%',viewsUp:true,keyChange:'100%',keyUp:false,evtChange:'4.11%',evtUp:true,pct:'0%'}]
  return(
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:13,color:'#555'}}>Views</span><Change val="1.91%" up={false}/></div>
          <div style={{display:'flex',alignItems:'center',gap:24}}>
            <div style={{position:'relative',width:180,height:180,flexShrink:0}}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={donutData} cx="50%" cy="50%" innerRadius={54} outerRadius={82} dataKey="value">{donutData.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip contentStyle={{fontSize:11,borderRadius:6}} formatter={(v:number)=>[v.toLocaleString(),'']}/></PieChart></ResponsiveContainer><div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:18,fontWeight:700}}>242.9 K</span><span style={{fontSize:10,color:'#999'}}>Views</span></div></div>
            <div>{donutData.map(d=><div key={d.name} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}><div style={{width:10,height:10,borderRadius:'50%',background:d.color}}/><span style={{fontSize:12,color:'#333',flex:1}}>{d.name}</span><span style={{fontSize:12,fontWeight:600}}>{d.value>=1000?fmt(d.value):d.value.toLocaleString()}</span></div>)}</div>
          </div>
        </div>
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:13,color:'#555'}}>Views</span><div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:16,fontWeight:700}}>243 K</span><Change val="1.91%" up={false}/></div></div>
          <ResponsiveContainer width="100%" height={200}><LineChart data={lineData}><XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#999'}} tickFormatter={(v:number)=>v>=1000?(v/1000)+'K':String(v)}/><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><Tooltip contentStyle={{fontSize:11,borderRadius:6}}/><Legend wrapperStyle={{fontSize:10}}/><Line type="monotone" dataKey="Views" stroke="#48b5ea" dot={false} strokeWidth={2}/><Line type="monotone" dataKey="New" stroke="#4DA6FF" dot={false} strokeWidth={1.5}/><Line type="monotone" dataKey="Returning" stroke="#9CCC65" dot={false} strokeWidth={1.5}/><Line type="monotone" dataKey="Unknown" stroke="#F9B62A" dot={false} strokeWidth={1.5}/></LineChart></ResponsiveContainer>
        </div>
      </div>
      <KPICards cd={SHARED_KPI}/>
      <DataTable colLabel="NEW VS RETURNING" rows={rows} search={search} onSearch={onSearch} rowCount={rows.length} totalCount={3}/>
    </>
  )
}

// ── PAGES items ───────────────────────────────────────────────────────────────
const PAGES_ITEMS = [
  { id:'pages-all',     label:'All' },
  { id:'pages-landing', label:'Landing Pages' },
  { id:'pages-path',    label:'Path' },
  { id:'pages-title',   label:'Title' },
  { id:'pages-content', label:'Content Group' },
]

const ALL_PAGES_ROWS = [
  {label:'/visit/',           sessions:34188,sessChange:'0.70%',sessUp:true,  users:28476,usersChange:'1.81%',usersUp:true,  engagement:'7d 8h 14m 38s', engChange:'3.10%',engUp:false,views:44050, viewsChange:'0.93%',viewsUp:true,  keyEvents:47,   keyChange:'24%',  keyUp:true,  eventCount:259177,evtChange:'0.04%',evtUp:false, purchasers:'0.00',pct:'0%'},
  {label:'/map/',             sessions:21739,sessChange:'4.88%',sessUp:true,  users:15572,usersChange:'5.21%',usersUp:true,  engagement:'13d 11h 37m 43s',engChange:'5.04%',engUp:true,  views:30287, viewsChange:'4.84%',viewsUp:true,  keyEvents:18,   keyChange:'5.26%',keyUp:true,  eventCount:203302,evtChange:'2.64%',evtUp:true,  purchasers:'0.00',pct:'0%'},
  {label:'/events/',          sessions:15491,sessChange:'9.67%',sessUp:false, users:12508,usersChange:'10%',  usersUp:false, engagement:'5d 3h 3m 55s',   engChange:'25%',  engUp:false, views:17207, viewsChange:'18%',  viewsUp:false, keyEvents:13,   keyChange:'86%',  keyUp:false, eventCount:119255,evtChange:'16%',  evtUp:false, purchasers:'0.00',pct:'0%'},
  {label:'/parks-trails/',    sessions:6808, sessChange:'7.48%',sessUp:true,  users:6224, usersChange:'9.21%',usersUp:true,  engagement:'2d 6h 7m 49s',   engChange:'1.73%',engUp:true,  views:9943,  viewsChange:'8.25%',viewsUp:true,  keyEvents:1,    keyChange:'0%',   keyUp:true,  eventCount:65120, evtChange:'9.00%',evtUp:true,  purchasers:'0.00',pct:'0%'},
  {label:'/things-to-do/shopping-dining/',sessions:5319,sessChange:'3.89%',sessUp:false,users:4362,usersChange:'0.32%',usersUp:false,engagement:'2d 9h 53m 4s',engChange:'3.16%',engUp:true,views:6435,viewsChange:'0.09%',viewsUp:true,keyEvents:5,keyChange:'69%',keyUp:false,eventCount:49760,evtChange:'0.57%',evtUp:false,purchasers:'0.00',pct:'0%'},
  {label:'/things-to-do/',    sessions:4279, sessChange:'5.94%',sessUp:false, users:3929, usersChange:'2.24%',usersUp:false, engagement:'23h 13m 49s',     engChange:'1.68%',engUp:false, views:5639,  viewsChange:'2.20%',viewsUp:false, keyEvents:3,    keyChange:'57%',  keyUp:false, eventCount:35428, evtChange:'2.77%',evtUp:false, purchasers:'0.00',pct:'0%'},
  {label:'/events/69748c4576a962dcab2ff934/',sessions:4111,sessChange:'6106%',sessUp:true,users:3910,usersChange:'6106%',usersUp:true,engagement:'2h 12m 59s',engChange:'159%',engUp:true,views:4244,viewsChange:'4616%',viewsUp:true,keyEvents:22,keyChange:'633%',keyUp:true,eventCount:15914,evtChange:'3014%',evtUp:true,purchasers:'0.00',pct:'0%'},
  {label:'/visitor-information/',sessions:2327,sessChange:'11%',sessUp:true,users:2169,usersChange:'9.55%',usersUp:true,engagement:'12h 6m 17s',engChange:'46%',engUp:true,views:3254,viewsChange:'8.36%',viewsUp:true,keyEvents:1,keyChange:'0%',keyUp:true,eventCount:20583,evtChange:'17%',evtUp:true,purchasers:'0.00',pct:'0%'},
  {label:'/parks-trails/shirley-clarke-franklin-park/',sessions:2505,sessChange:'14%',sessUp:true,users:2114,usersChange:'24%',usersUp:true,engagement:'18h 45m 33s',engChange:'22%',engUp:true,views:3084,viewsChange:'15%',viewsUp:true,keyEvents:1,keyChange:'0%',keyUp:true,eventCount:22238,evtChange:'19%',evtUp:true,purchasers:'0.00',pct:'0%'},
  {label:'/live/',             sessions:2676, sessChange:'0%',   sessUp:true,  users:2567, usersChange:'1.34%',usersUp:true,  engagement:'12h 34m 44s',     engChange:'8.14%',engUp:false, views:2985,  viewsChange:'0.95%',viewsUp:true,  keyEvents:2,    keyChange:'50%',  keyUp:false, eventCount:16918, evtChange:'10%',  evtUp:true,  purchasers:'0.00',pct:'0%'},
]

const LANDING_PAGES_ROWS = [
  {label:'/visit',  sessions:29039,sessChange:'1.66%',sessUp:false,users:25103,usersChange:'0.94%',usersUp:true,  engagement:'23d 7h 6m 47s', engChange:'2.14%',engUp:true,  views:84876,viewsChange:'0.18%',viewsUp:false,keyEvents:905, keyChange:'2.14%',keyUp:true,  eventCount:537634,evtChange:'0.59%',evtUp:false, purchasers:'0.00',pct:'0%'},
  {label:'/map',    sessions:11037,sessChange:'1.00%',sessUp:false,users:8102, usersChange:'2.95%',usersUp:false, engagement:'7d 9h 50m 57s',  engChange:'9.88%',engUp:false, views:23220,viewsChange:'4.31%',viewsUp:true,  keyEvents:138, keyChange:'6.12%',keyUp:true,  eventCount:148199,evtChange:'5.87%',evtUp:false, purchasers:'0.00',pct:'0%'},
  {label:'/events', sessions:8934, sessChange:'12%',  sessUp:false,users:7541, usersChange:'9%',   usersUp:false, engagement:'4d 12h 22m',     engChange:'20%',  engUp:false, views:12610,viewsChange:'14%',  viewsUp:false, keyEvents:12,  keyChange:'80%',  keyUp:false, eventCount:89500, evtChange:'12%',  evtUp:false, purchasers:'0.00',pct:'0%'},
  {label:'/things-to-do',sessions:4190,sessChange:'4%',sessUp:false,users:3890,usersChange:'2%',usersUp:false,engagement:'19h 20m',engChange:'2%',engUp:false,views:5817,viewsChange:'3%',viewsUp:false,keyEvents:4,keyChange:'60%',keyUp:false,eventCount:38200,evtChange:'3%',evtUp:false,purchasers:'0.00',pct:'0%'},
  {label:'/events/69748c4576a962dcab2ff934',sessions:3950,sessChange:'5800%',sessUp:true,users:3780,usersChange:'5800%',usersUp:true,engagement:'2h 5m',engChange:'150%',engUp:true,views:4286,viewsChange:'4400%',viewsUp:true,keyEvents:21,keyChange:'600%',keyUp:true,eventCount:14900,evtChange:'2900%',evtUp:true,purchasers:'0.00',pct:'0%'},
]

const TITLE_ROWS = [
  {label:'Visit the Atlanta Beltline | Places To Go in Atlanta, GA', sessions:34188,sessChange:'0.70%',sessUp:true,users:28476,usersChange:'1.81%',usersUp:true,engagement:'7d 8h 11m 8s',engChange:'3.03%',engUp:false,views:44050,viewsChange:'0.94%',viewsUp:true,keyEvents:47,keyChange:'24%',keyUp:true,eventCount:259130,evtChange:'0.02%',evtUp:false,purchasers:'0.00',pct:'0%'},
  {label:'Interactive Map | Beltline',                               sessions:21700,sessChange:'5.27%',sessUp:true,users:15535,usersChange:'5.10%',usersUp:true,engagement:'13d 11h 17m 24s',engChange:'4.89%',engUp:true,views:30201,viewsChange:'4.89%',viewsUp:true,keyEvents:18,keyChange:'5.26%',keyUp:true,eventCount:202497,evtChange:'2.64%',evtUp:true,purchasers:'0.00',pct:'0%'},
  {label:'Atlanta Beltline',                                         sessions:10200,sessChange:'8%',sessUp:false,users:8900,usersChange:'7%',usersUp:false,engagement:'4d 12h 30m',engChange:'20%',engUp:false,views:20192,viewsChange:'15%',viewsUp:false,keyEvents:12,keyChange:'72%',keyUp:false,eventCount:95000,evtChange:'14%',evtUp:false,purchasers:'0.00',pct:'0%'},
  {label:'Events | Beltline',                                        sessions:6400, sessChange:'11%',sessUp:false,users:5800,usersChange:'9%',usersUp:false,engagement:'3d 5h 20m',engChange:'22%',engUp:false,views:17887,viewsChange:'16%',viewsUp:false,keyEvents:10,keyChange:'82%',keyUp:false,eventCount:58000,evtChange:'14%',evtUp:false,purchasers:'0.00',pct:'0%'},
  {label:'Parks & Trails | Atlanta Beltline',                        sessions:6808, sessChange:'7.48%',sessUp:true,users:6224,usersChange:'9.21%',usersUp:true,engagement:'2d 6h 7m 49s',engChange:'1.73%',engUp:true,views:9936,viewsChange:'8.25%',viewsUp:true,keyEvents:1,keyChange:'0%',keyUp:true,eventCount:65120,evtChange:'9%',evtUp:true,purchasers:'0.00',pct:'0%'},
]

// Horizontal bar chart for right panel (Pages views)
function HorizontalBarList({items}:{items:{label:string;value:number;maxVal:number}[]}){
  return(
    <div style={{padding:'12px 0'}}>
      {items.map((item)=>(
        <div key={item.label} style={{marginBottom:12}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span style={{fontSize:12,color:'#333',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const,paddingRight:16}}>{item.label}</span>
            <span style={{fontSize:12,fontWeight:600,color:'#1a1a1a',flexShrink:0}}>{item.value.toLocaleString()}</span>
          </div>
          <div style={{height:4,background:'#f0f0f0',borderRadius:2,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${(item.value/item.maxVal)*100}%`,background:'#48b5ea',borderRadius:2}}/>
          </div>
        </div>
      ))}
    </div>
  )
}

function PagesGeneric({
  subLabel, rightItems, tableColLabel, tableRows, totalRows, search, onSearch,
  hlCard, kpiOverride
}:{
  subLabel:string; rightItems:{label:string;value:number;maxVal:number}[];
  tableColLabel:string; tableRows:any[]; totalRows:number;
  search:string; onSearch:(v:string)=>void;
  hlCard?:'total-users'|'total-purchasers'|'event-count'|'key-events';
  kpiOverride?:Partial<ChannelData>;
}){
  const kpi={...SHARED_KPI,...(kpiOverride||{})}
  const maxVal=rightItems[0]?.maxVal||1

  // KPI row 1: Sessions, Total Users, User Engagement, Views
  // highlighted card changes per sub-page
  const row1=[
    {label:'Sessions',        val:fmt(kpi.sessions),                change:kpi.sessChange,  up:kpi.sessUp,  hl:false},
    {label:'Total Users',     val:fmt(kpi.users),                   change:kpi.usersChange, up:kpi.usersUp, hl:hlCard==='total-users'},
    {label:'User Engagement', val:kpi.engagement,                   change:kpi.engChange,   up:kpi.engUp,   hl:false},
    {label:'Views',           val:fmt(kpi.views),                   change:kpi.viewsChange, up:kpi.viewsUp, hl:false},
  ]
  const row2=[
    {label:'Key Events',       val:kpi.keyEvents>=1000?fmt(kpi.keyEvents):kpi.keyEvents.toLocaleString(), change:kpi.keyChange,up:kpi.keyUp,hl:hlCard==='key-events',badge:false},
    {label:'Event Count',      val:kpi.eventCount,                                                         change:kpi.evtChange,up:kpi.evtUp,hl:hlCard==='event-count',badge:false},
    {label:'Total Purchasers', val:'0',                                                                     change:'0%',up:true,hl:hlCard==='total-purchasers',badge:true},
  ]
  // default highlighted: Views (row1[3]) unless override
  if(!hlCard){row1[3].hl=true}

  return(
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        {/* Left: area chart */}
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span style={{fontSize:13,color:'#555'}}>Views</span>
            <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:16,fontWeight:700}}>243 K</span><Change val="1.91%" up={false}/></div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={TIME_DATA}>
              <defs>
                <linearGradient id="pg1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#48b5ea" stopOpacity={0.2}/><stop offset="95%" stopColor="#48b5ea" stopOpacity={0}/></linearGradient>
                <linearGradient id="pg2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a8d8ff" stopOpacity={0.15}/><stop offset="95%" stopColor="#a8d8ff" stopOpacity={0}/></linearGradient>
              </defs>
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/>
              <YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#999'}} tickFormatter={(v:number)=>v>=1000?(v/1000)+'K':String(v)}/>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <Tooltip contentStyle={{fontSize:11,borderRadius:6}}/>
              <Area type="monotone" dataKey="v" stroke="#48b5ea" fill="url(#pg1)" strokeWidth={2} name="This period"/>
              <Area type="monotone" dataKey="v2" stroke="#a8d8ff" fill="url(#pg2)" strokeWidth={1.5} strokeDasharray="4 2" name="Prev period"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Right: horizontal bar list */}
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
            <span style={{fontSize:13,color:'#555'}}>Views</span>
          </div>
          <HorizontalBarList items={rightItems}/>
        </div>
      </div>

      {/* KPI row 1 */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:12}}>
        {row1.map(k=>(
          <div key={k.label} style={{background:'#fff',border:`${k.hl?2:1}px solid ${k.hl?'#48b5ea':'#e5e5e5'}`,borderRadius:8,padding:'16px 20px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <span style={{fontSize:13,color:'#555'}}>{k.label}</span>
              {k.hl?<button style={{background:'none',border:'none',cursor:'pointer',color:'#bbb'}}><MoreHorizontal size={14}/></button>:<Change val={k.change} up={k.up}/>}
            </div>
            <p style={{fontSize:28,fontWeight:700,color:'#1a1a1a',letterSpacing:'-0.5px',lineHeight:1.2}}>{k.val}</p>
            {k.hl&&<div style={{marginTop:6}}><Change val={k.change} up={k.up}/></div>}
          </div>
        ))}
      </div>

      {/* KPI row 2 */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
        {row2.map(k=>(
          <div key={k.label} style={{background:'#fff',border:`${k.hl?2:1}px solid ${k.hl?'#48b5ea':'#e5e5e5'}`,borderRadius:8,padding:'16px 20px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <span style={{fontSize:13,color:'#555'}}>{k.label}</span>
              {k.badge?<span style={{fontSize:11,fontWeight:600,color:'#999',background:'#f0f0f0',padding:'2px 6px',borderRadius:4}}>0%</span>:(k.hl?<button style={{background:'none',border:'none',cursor:'pointer',color:'#bbb'}}><MoreHorizontal size={14}/></button>:<Change val={k.change} up={k.up}/>)}
            </div>
            <p style={{fontSize:28,fontWeight:700,color:'#1a1a1a',letterSpacing:'-0.5px'}}>{k.val}</p>
            {k.hl&&<div style={{marginTop:6}}><Change val={k.change} up={k.up}/></div>}
          </div>
        ))}
      </div>

      {/* Data table */}
      <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,overflow:'hidden',marginTop:16}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px',borderBottom:'1px solid #f0f0f0'}}>
          <span style={{fontSize:12,color:'#666'}}>Showing {tableRows.filter(r=>(r.label||'').toLowerCase().includes(search.toLowerCase())).length} of {totalRows.toLocaleString()} Rows</span>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <input value={search} onChange={e=>onSearch(e.target.value)} placeholder="Search" style={{background:'#fafafa',border:'1px solid #e5e5e5',borderRadius:6,padding:'5px 10px',fontSize:12,outline:'none',width:160}}/>
            <button style={{background:'none',border:'none',cursor:'pointer',color:'#bbb'}}><MoreHorizontal size={14}/></button>
          </div>
        </div>
        <div style={{overflowX:'auto' as const}}>
          <table style={{width:'100%',borderCollapse:'collapse' as const,fontSize:12}}>
            <thead><tr style={{borderBottom:'1px solid #f0f0f0',background:'#fafafa'}}>
              {[tableColLabel,'SESSIONS','TOTAL USERS','USER ENGAGEMENT','VIEWS ↓','KEY EVENTS','EVENT COUNT','TOTAL PURCHASERS'].map(h=>(
                <th key={h} style={{padding:'9px 14px',textAlign:h===tableColLabel?'left':'right' as any,fontSize:11,fontWeight:600,color:'#888',whiteSpace:'nowrap' as const}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {tableRows.filter(r=>(r.label||'').toLowerCase().includes(search.toLowerCase())).map((row,i)=>(
                <tr key={i} style={{borderBottom:'1px solid #f8f8f8',background:i%2===0?'#fff':'#fafafa'}}>
                  <td style={{padding:'11px 14px',fontWeight:500,color:'#1a1a1a',maxWidth:260,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>{row.label}</td>
                  <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{row.sessions.toLocaleString()}</div><Change val={row.sessChange} up={row.sessUp}/></td>
                  <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{row.users.toLocaleString()}</div><Change val={row.usersChange} up={row.usersUp}/></td>
                  <td style={{padding:'11px 14px',textAlign:'right' as const,fontSize:12,color:'#555'}}><div>{row.engagement}</div><Change val={row.engChange} up={row.engUp}/></td>
                  <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{row.views.toLocaleString()}</div><Change val={row.viewsChange} up={row.viewsUp}/></td>
                  <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{typeof row.keyEvents==='number'?row.keyEvents.toFixed(2):row.keyEvents}</div><Change val={row.keyChange} up={row.keyUp}/></td>
                  <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{typeof row.eventCount==='number'?row.eventCount.toLocaleString():row.eventCount}</div><Change val={row.evtChange} up={row.evtUp}/></td>
                  <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{row.purchasers}</div><span style={{fontSize:10,background:'#f0f0f0',color:'#999',padding:'1px 5px',borderRadius:3}}>{row.pct||'0%'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function PagesAll({search,onSearch}:{search:string;onSearch:(v:string)=>void}){
  const maxVal=44050
  return <PagesGeneric subLabel="All Pages" rightItems={[{label:'/visit/',value:44050,maxVal},{label:'/map/',value:30287,maxVal},{label:'/events/',value:17207,maxVal},{label:'/parks-trails/',value:9943,maxVal},{label:'/things-to-do/shopping-dining/',value:6435,maxVal}]} tableColLabel="PAGE" tableRows={ALL_PAGES_ROWS} totalRows={1556} search={search} onSearch={onSearch}/>
}

function PagesLanding({search,onSearch}:{search:string;onSearch:(v:string)=>void}){
  const maxVal=84876
  return <PagesGeneric subLabel="Landing Pages" rightItems={[{label:'/visit',value:84876,maxVal},{label:'/map',value:23220,maxVal},{label:'/events',value:12610,maxVal},{label:'/things-to-do',value:5817,maxVal},{label:'/events/69748c4576a962dcab2ff934',value:4286,maxVal}]} tableColLabel="LANDING PAGE" tableRows={LANDING_PAGES_ROWS} totalRows={1374} search={search} onSearch={onSearch} hlCard="total-purchasers"/>
}

function PagesPath({search,onSearch}:{search:string;onSearch:(v:string)=>void}){
  const maxVal=44050
  return <PagesGeneric subLabel="Path" rightItems={[{label:'/visit/',value:44050,maxVal},{label:'/map/',value:30287,maxVal},{label:'/events/',value:17207,maxVal},{label:'/parks-trails/',value:9943,maxVal},{label:'/things-to-do/shopping-dining/',value:6435,maxVal}]} tableColLabel="PAGE PATH AND SCREEN CLASS" tableRows={ALL_PAGES_ROWS} totalRows={1556} search={search} onSearch={onSearch} hlCard="event-count"/>
}

function PagesTitle({search,onSearch}:{search:string;onSearch:(v:string)=>void}){
  const maxVal=44050
  return <PagesGeneric subLabel="Title" rightItems={[{label:'Visit the Atlanta Beltline | Places To Go in Atlanta, GA',value:44050,maxVal},{label:'Interactive Map | Beltline',value:30201,maxVal},{label:'Atlanta Beltline',value:20192,maxVal},{label:'Events | Beltline',value:17887,maxVal},{label:'Parks & Trails | Atlanta Beltline',value:9936,maxVal}]} tableColLabel="PAGE TITLE AND SCREEN CLASS" tableRows={TITLE_ROWS} totalRows={1456} search={search} onSearch={onSearch}/>
}

function PagesContentGroup({search,onSearch}:{search:string;onSearch:(v:string)=>void}){
  const maxVal=242901
  const contentRows=[{label:'(not set)',sessions:120520,sessChange:'0.35%',sessUp:false,users:88069,usersChange:'0.69%',usersUp:true,engagement:'66d 21h 22m 49s',engChange:'1.65%',engUp:false,views:242901,viewsChange:'1.91%',viewsUp:false,keyEvents:3610,keyChange:'21%',keyUp:false,eventCount:1539974,evtChange:'2.67%',evtUp:false,purchasers:'0.00',pct:'0%'}]
  return <PagesGeneric subLabel="Content Group" rightItems={[{label:'(not set)',value:242901,maxVal}]} tableColLabel="CONTENT GROUP" tableRows={contentRows} totalRows={1} search={search} onSearch={onSearch} hlCard="key-events"/>
}


// ── EVENTS: Event Name ────────────────────────────────────────────────────────
const EVENT_ROWS = [
  {name:'page_view',      users:86610, usersChange:'0.45%', usersUp:false, engagement:'6s',              engChange:'100%', engUp:false, conversions:0, convChange:'0%', convUp:true, eventCount:242901, evtChange:'1.91%', evtUp:false},
  {name:'10% Scroll',     users:74794, usersChange:'4.49%', usersUp:false, engagement:'2d 18h 50m 15s',  engChange:'3.18%',engUp:false, conversions:0, convChange:'0%', convUp:true, eventCount:212058, evtChange:'2.73%', evtUp:false},
  {name:'25% Scroll',     users:62887, usersChange:'7.10%', usersUp:false, engagement:'8d 7h 40m 36s',   engChange:'2.47%',engUp:false, conversions:0, convChange:'0%', convUp:true, eventCount:166203, evtChange:'3.79%', evtUp:false},
  {name:'session_start',  users:87756, usersChange:'0.66%', usersUp:true,  engagement:'—',               engChange:'0%',   engUp:true,  conversions:0, convChange:'0%', convUp:true, eventCount:123408, evtChange:'1.09%', evtUp:true},
  {name:'link_click',     users:33644, usersChange:'1.07%', usersUp:false, engagement:'—',               engChange:'0%',   engUp:true,  conversions:0, convChange:'0%', convUp:true, eventCount:119652, evtChange:'3.22%', evtUp:false},
  {name:'internal_click', users:29800, usersChange:'2.10%', usersUp:false, engagement:'—',               engChange:'0%',   engUp:true,  conversions:0, convChange:'0%', convUp:true, eventCount:98400,  evtChange:'2.50%', evtUp:false},
  {name:'50% Scroll',     users:47200, usersChange:'5.80%', usersUp:false, engagement:'5d 12h 22m 10s',  engChange:'1.90%',engUp:false, conversions:0, convChange:'0%', convUp:true, eventCount:87300,  evtChange:'4.10%', evtUp:false},
  {name:'all_clicks_non_interaction',users:22100,usersChange:'1.50%',usersUp:false,engagement:'—',engChange:'0%',engUp:true,conversions:0,convChange:'0%',convUp:true,eventCount:74200,evtChange:'2.10%',evtUp:false},
  {name:'75% Scroll',     users:38600, usersChange:'6.20%', usersUp:false, engagement:'3d 9h 15m 42s',   engChange:'2.10%',engUp:false, conversions:0, convChange:'0%', convUp:true, eventCount:68900,  evtChange:'4.30%', evtUp:false},
  {name:'scroll',         users:41200, usersChange:'3.40%', usersUp:false, engagement:'—',               engChange:'0%',   engUp:true,  conversions:0, convChange:'0%', convUp:true, eventCount:62100,  evtChange:'1.80%', evtUp:false},
  {name:'user_engagement',users:35800, usersChange:'1.20%', usersUp:false, engagement:'—',               engChange:'0%',   engUp:true,  conversions:0, convChange:'0%', convUp:true, eventCount:54300,  evtChange:'1.40%', evtUp:false},
  {name:'click',          users:18900, usersChange:'2.80%', usersUp:false, engagement:'—',               engChange:'0%',   engUp:true,  conversions:0, convChange:'0%', convUp:true, eventCount:48700,  evtChange:'2.20%', evtUp:false},
  {name:'first_visit',    users:63200, usersChange:'0.80%', usersUp:true,  engagement:'—',               engChange:'0%',   engUp:true,  conversions:0, convChange:'0%', convUp:true, eventCount:46800,  evtChange:'0.90%', evtUp:true},
  {name:'100% Scroll',    users:26400, usersChange:'8.10%', usersUp:false, engagement:'2d 1h 8m 22s',    engChange:'1.80%',engUp:false, conversions:0, convChange:'0%', convUp:true, eventCount:38200,  evtChange:'5.20%', evtUp:false},
  {name:'view_item_list', users:12300, usersChange:'3.10%', usersUp:false, engagement:'—',               engChange:'0%',   engUp:true,  conversions:0, convChange:'0%', convUp:true, eventCount:32100,  evtChange:'2.40%', evtUp:false},
]

const EVENT_BAR_COLORS = ['#4DA6FF','#9CCC65','#F9B62A','#A8D8FF','#CE93D8','#FFB74D','#B0BEC5','#80CBC4']

function EventsEventName({search,onSearch}:{search:string;onSearch:(v:string)=>void}){
  const eventBarData=EVENT_ROWS.slice(0,8).map((r,i)=>({name:r.name,v:r.eventCount,color:EVENT_BAR_COLORS[i]}))
  // time data scaled to event counts
  const evtTimeData=TIME_DATA.map(t=>({d:t.d,v:Math.round(t.v*5.8),v2:Math.round(t.v2*5.6)}))
  const filtered=EVENT_ROWS.filter(r=>r.name.toLowerCase().includes(search.toLowerCase()))

  return(
    <>
      {/* Top two charts */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        {/* Area chart */}
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span style={{fontSize:13,color:'#555'}}>Event Count</span>
            <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:16,fontWeight:700}}>1.54 M</span><Change val="2.67%" up={false}/></div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={evtTimeData}>
              <defs>
                <linearGradient id="ev1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#48b5ea" stopOpacity={0.2}/><stop offset="95%" stopColor="#48b5ea" stopOpacity={0}/></linearGradient>
                <linearGradient id="ev2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a8d8ff" stopOpacity={0.15}/><stop offset="95%" stopColor="#a8d8ff" stopOpacity={0}/></linearGradient>
              </defs>
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/>
              <YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#999'}} tickFormatter={(v:number)=>v>=1000?(v/1000)+'K':String(v)}/>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <Tooltip contentStyle={{fontSize:11,borderRadius:6}}/>
              <Area type="monotone" dataKey="v"  stroke="#48b5ea" fill="url(#ev1)" strokeWidth={2} name="This period"/>
              <Area type="monotone" dataKey="v2" stroke="#a8d8ff" fill="url(#ev2)" strokeWidth={1.5} strokeDasharray="4 2" name="Prev period"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Bar chart by event */}
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
            <span style={{fontSize:13,color:'#555'}}>Event Count</span>
            <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:16,fontWeight:700}}>1.54 M</span><Change val="2.67%" up={false}/></div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={eventBarData} barSize={26}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/>
              <YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#999'}} tickFormatter={(v:number)=>v>=1000?(v/1000)+'K':String(v)}/>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
              <Tooltip contentStyle={{fontSize:11,borderRadius:6}} formatter={(v:number)=>[v.toLocaleString(),'Event Count']}/>
              <Bar dataKey="v" radius={[3,3,0,0]}>{eventBarData.map((d,i)=><Cell key={i} fill={d.color}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* KPI cards — 4 cards: Total Users, User Engagement, Conversions, Event Count (highlighted) */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        {[
          {label:'Total Users',     val:'88,069', change:'0.69%', up:true,  hl:false},
          {label:'User Engagement', val:'66d 21h 22m 49s', change:'1.65%', up:false, hl:false},
          {label:'Conversions',     val:'3,610',  change:'21%',   up:false, hl:false},
          {label:'Event Count',     val:'1.54 M', change:'2.67%', up:false, hl:true},
        ].map(k=>(
          <div key={k.label} style={{background:'#fff',border:`${k.hl?2:1}px solid ${k.hl?'#48b5ea':'#e5e5e5'}`,borderRadius:8,padding:'16px 20px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <span style={{fontSize:13,color:'#555'}}>{k.label}</span>
              {k.hl?<button style={{background:'none',border:'none',cursor:'pointer',color:'#bbb'}}><MoreHorizontal size={14}/></button>:<Change val={k.change} up={k.up}/>}
            </div>
            <p style={{fontSize:28,fontWeight:700,color:'#1a1a1a',letterSpacing:'-0.5px',lineHeight:1.2}}>{k.val}</p>
            {k.hl&&<div style={{marginTop:6}}><Change val={k.change} up={k.up}/></div>}
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,overflow:'hidden'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px',borderBottom:'1px solid #f0f0f0'}}>
          <span style={{fontSize:12,color:'#666'}}>Showing {filtered.length} of 45 Rows</span>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <input value={search} onChange={e=>onSearch(e.target.value)} placeholder="Search" style={{background:'#fafafa',border:'1px solid #e5e5e5',borderRadius:6,padding:'5px 10px',fontSize:12,outline:'none',width:160}}/>
            <button style={{background:'none',border:'none',cursor:'pointer',color:'#bbb'}}><MoreHorizontal size={14}/></button>
          </div>
        </div>
        <div style={{overflowX:'auto' as const}}>
          <table style={{width:'100%',borderCollapse:'collapse' as const,fontSize:12}}>
            <thead><tr style={{borderBottom:'1px solid #f0f0f0',background:'#fafafa'}}>
              {['EVENT NAME','TOTAL USERS','USER ENGAGEMENT','CONVERSIONS','EVENT COUNT ↓'].map(h=>(
                <th key={h} style={{padding:'9px 14px',textAlign:h==='EVENT NAME'?'left':'right' as any,fontSize:11,fontWeight:600,color:'#888',whiteSpace:'nowrap' as const}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((row,i)=>(
                <tr key={row.name} style={{borderBottom:'1px solid #f8f8f8',background:i%2===0?'#fff':'#fafafa'}}>
                  <td style={{padding:'11px 14px',fontWeight:500,color:'#1a1a1a'}}>{row.name}</td>
                  <td style={{padding:'11px 14px',textAlign:'right' as const}}>
                    <div>{row.users.toLocaleString()}</div>
                    <Change val={row.usersChange} up={row.usersUp}/>
                  </td>
                  <td style={{padding:'11px 14px',textAlign:'right' as const,fontSize:12}}>
                    <div style={{color:'#333'}}>{row.engagement}</div>
                    {row.engagement!=='—'&&<Change val={row.engChange} up={row.engUp}/>}
                    {row.engagement==='—'&&<span style={{fontSize:10,fontWeight:600,color:'#999',background:'#f0f0f0',padding:'1px 5px',borderRadius:3}}>0%</span>}
                  </td>
                  <td style={{padding:'11px 14px',textAlign:'right' as const}}>
                    <div>{row.conversions.toFixed(2)}</div>
                    <span style={{fontSize:10,fontWeight:600,color:'#999',background:'#f0f0f0',padding:'1px 5px',borderRadius:3}}>0%</span>
                  </td>
                  <td style={{padding:'11px 14px',textAlign:'right' as const}}>
                    <div>{row.eventCount.toLocaleString()}</div>
                    <Change val={row.evtChange} up={row.evtUp}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

// ── SOCIAL: Facebook sub-items ────────────────────────────────────────────────
const FACEBOOK_ITEMS = [
  { id:'fb-page',       label:'Page' },
  { id:'fb-engagement', label:'Engagement' },
  { id:'fb-posts',      label:'Posts' },
  { id:'fb-reels',      label:'Reels' },
]

const FB_TIME = [
  {d:'1 Apr',follows:100200,views:380},{d:'3 Apr',follows:100400,views:420},
  {d:'5 Apr',follows:100600,views:340},{d:'7 Apr',follows:100900,views:460},
  {d:'9 Apr',follows:101100,views:280},{d:'11 Apr',follows:101400,views:520},
  {d:'13 Apr',follows:101800,views:380},{d:'15 Apr',follows:102200,views:440},
  {d:'17 Apr',follows:102600,views:360},{d:'19 Apr',follows:102900,views:300},
  {d:'21 Apr',follows:103200,views:280},{d:'23 Apr',follows:103500,views:320},
  {d:'25 Apr',follows:103700,views:260},{d:'27 Apr',follows:103900,views:240},
  {d:'29 Apr',follows:104100,views:220},
]

const FB_POSTS = [
  {
    date:'Apr 30, 2026',
    image:'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80',
    text:'Due to inclement weather, Big Tigger\'s Beltline BikeFest has moved indoors & the community bike ride has been canceled.',
    caption:'Unfortunately, due to heavy rain forecasted for Saturday, Big Tigger\'s Beltline BikeFest has been moved indoors and the community bike ride has been canceled. For those who pre-registered for the kids\' bike giveaway, pickup will take place indoors at 929 Lee Street from 11 a.m.-1 p.m., with celebrity captains on-site for photos from 12-1 p.m.',
    impressions:4895, likes:8, clicks:84,
    bgColor:'#c0392b',
  },
  {
    date:'Apr 24, 2026',
    image:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    text:'Join us for the Atlanta BeltLine 5K!',
    caption:'Lace up your running shoes and join the Atlanta BeltLine community for our annual 5K run along the trail. Register now to secure your spot!',
    impressions:6240, likes:142, clicks:231,
    bgColor:'#2980b9',
  },
]

const FB_REELS = [
  {
    date:'Apr 23, 2026',
    image:'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80',
    text:'Atlanta Beltline Market is now open at the airport!',
    caption:'Check out the new Atlanta BeltLine Market at Hartsfield-Jackson Atlanta International Airport, Gate B27. Pick up local artisan goods and BeltLine merchandise before your next flight.',
    impressions:12400, likes:389, clicks:156,
  },
  {
    date:'Apr 18, 2026',
    image:'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&q=80',
    text:'Spring on the BeltLine Trail',
    caption:'The cherry blossoms are in full bloom along the Atlanta BeltLine Eastside Trail. Come enjoy the beautiful spring scenery!',
    impressions:8700, likes:512, clicks:98,
  },
]

function SocialFacebookPage(){
  const followsGrowthData = FB_TIME.map(t=>({
    d:t.d.replace(' Apr',''),
    nonPaid:Math.round(Math.random()*40+40),
    paid:Math.round(Math.random()*8+2),
    lost:Math.round(Math.random()*8+2)*-1,
  }))
  const impressionsData = FB_TIME.map(t=>({
    d:t.d.replace(' Apr',''), nonPaid:Math.round(t.views*120+10000), paid:Math.round(t.views*8)
  }))

  return(
    <div style={{flex:1,overflowY:'auto',padding:20,background:'#f8f9fa'}}>
      {/* Top two charts */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span style={{fontSize:13,color:'#555'}}>Page Follows</span>
            <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:16,fontWeight:700}}>104 K</span><Change val="1.39%" up={true}/></div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={FB_TIME}>
              <defs>
                <linearGradient id="fbf1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#48b5ea" stopOpacity={0.2}/><stop offset="95%" stopColor="#48b5ea" stopOpacity={0}/></linearGradient>
                <linearGradient id="fbf2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a8d8ff" stopOpacity={0.15}/><stop offset="95%" stopColor="#a8d8ff" stopOpacity={0}/></linearGradient>
              </defs>
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/>
              <YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#999'}} tickFormatter={(v:number)=>v>=1000?(v/1000).toFixed(0)+'K':String(v)} domain={[99000,105000]}/>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <Tooltip contentStyle={{fontSize:11,borderRadius:6}} formatter={(v:number)=>[v.toLocaleString(),'Follows']}/>
              <Area type="monotone" dataKey="follows" stroke="#48b5ea" fill="url(#fbf1)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span style={{fontSize:13,color:'#555'}}>Page Views</span>
            <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:16,fontWeight:700}}>7,077</span><Change val="30%" up={false}/></div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={FB_TIME}>
              <defs>
                <linearGradient id="fbv1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#48b5ea" stopOpacity={0.2}/><stop offset="95%" stopColor="#48b5ea" stopOpacity={0}/></linearGradient>
                <linearGradient id="fbv2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a8d8ff" stopOpacity={0.15}/><stop offset="95%" stopColor="#a8d8ff" stopOpacity={0}/></linearGradient>
              </defs>
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/>
              <YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#999'}}/>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <Tooltip contentStyle={{fontSize:11,borderRadius:6}} formatter={(v:number)=>[v.toLocaleString(),'Views']}/>
              <Area type="monotone" dataKey="views" stroke="#48b5ea" fill="url(#fbv1)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        {[
          {label:'New Page Follows',val:'1,506',change:'32%',up:false},
          {label:'Page Media Views',val:'197.1 K',change:'58%',up:false},
          {label:'Unique Page Impressions',val:'999.7 K',change:'8.49%',up:true},
          {label:'Page Views',val:'7,077',change:'30%',up:false},
        ].map(k=>(
          <div key={k.label} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:'16px 20px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <span style={{fontSize:13,color:'#555'}}>{k.label}</span>
              <Change val={k.change} up={k.up}/>
            </div>
            <p style={{fontSize:26,fontWeight:700,color:'#1a1a1a',letterSpacing:'-0.5px'}}>{k.val}</p>
          </div>
        ))}
      </div>

      {/* Bottom row: 3 charts */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16,marginBottom:16}}>
        {/* Page Follows Growth stacked bar */}
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span style={{fontSize:13,color:'#555'}}>Page Follows Growth</span>
            <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:14,fontWeight:700}}>1,425</span><Change val="33%" up={false}/></div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={followsGrowthData} barSize={10} stackOffset="sign">
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:8,fill:'#999'}}/>
              <YAxis axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
              <Tooltip contentStyle={{fontSize:11,borderRadius:6}}/>
              <Legend wrapperStyle={{fontSize:9}} iconSize={8}/>
              <Bar dataKey="nonPaid" name="Non-Paid" stackId="a" fill="#9CCC65" radius={[2,2,0,0]}/>
              <Bar dataKey="paid" name="Paid" stackId="a" fill="#F9B62A"/>
              <Bar dataKey="lost" name="Lost" stackId="a" fill="#ef5350"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Unique Page Impressions area */}
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span style={{fontSize:13,color:'#555'}}>Unique Page Impressions</span>
            <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:14,fontWeight:700}}>1,000 K</span><Change val="8.49%" up={true}/><button style={{background:'none',border:'none',cursor:'pointer',color:'#bbb'}}><MoreHorizontal size={12}/></button></div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={impressionsData}>
              <defs>
                <linearGradient id="imp1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#48b5ea" stopOpacity={0.3}/><stop offset="95%" stopColor="#48b5ea" stopOpacity={0}/></linearGradient>
              </defs>
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:8,fill:'#999'}}/>
              <YAxis axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}} tickFormatter={(v:number)=>v>=1000?(v/1000)+'K':String(v)}/>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <Tooltip contentStyle={{fontSize:11,borderRadius:6}}/>
              <Area type="monotone" dataKey="nonPaid" stroke="#48b5ea" fill="url(#imp1)" strokeWidth={2} name="Non-Paid"/>
              <Area type="monotone" dataKey="paid" stroke="#a8d8ff" fill="none" strokeWidth={1.5} name="Paid"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Unique Page Impressions donut */}
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20,display:'flex',flexDirection:'column'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
            <span style={{fontSize:13,color:'#555'}}>Unique Page Impressions</span>
            <Change val="8.49%" up={true}/>
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:20,flex:1}}>
            <div style={{position:'relative',width:130,height:130,flexShrink:0}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={[{name:'Non-Paid',value:955000,color:'#9CCC65'},{name:'Paid',value:44292,color:'#F9B62A'}]} cx="50%" cy="50%" innerRadius={38} outerRadius={58} dataKey="value">{[{color:'#9CCC65'},{color:'#F9B62A'}].map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip contentStyle={{fontSize:11,borderRadius:6}} formatter={(v:number)=>[v.toLocaleString(),'']}/></PieChart>
              </ResponsiveContainer>
              <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <span style={{fontSize:13,fontWeight:700}}>999.7 K</span>
                <span style={{fontSize:8,color:'#999',textAlign:'center'}}>Unique Page Impressions</span>
              </div>
            </div>
            <div>
              {[{name:'Non-Paid',val:'955 K',color:'#9CCC65'},{name:'Paid',val:'44,292',color:'#F9B62A'}].map(d=>(
                <div key={d.name} style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
                  <div style={{width:10,height:10,borderRadius:'50%',background:d.color}}/>
                  <span style={{fontSize:12,color:'#333'}}>{d.name}</span>
                  <span style={{fontSize:12,fontWeight:600,marginLeft:4}}>{d.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Countries / Top Cities */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        {[
          {title:'Top Countries',items:[{name:'United States',flag:'🇺🇸',val:102662,change:'1.30%',up:true},{name:'Canada',flag:'🇨🇦',val:4820,change:'2.10%',up:false},{name:'United Kingdom',flag:'🇬🇧',val:2940,change:'0.80%',up:true},{name:'Brazil',flag:'🇧🇷',val:1820,change:'3.40%',up:false}]},
          {title:'Top Cities',items:[{name:'Atlanta, GA',flag:'📍',val:25107,change:'2.36%',up:false},{name:'Birmingham, AL',flag:'📍',val:4820,change:'1.10%',up:true},{name:'Nashville, TN',flag:'📍',val:3940,change:'0.90%',up:true},{name:'Charlotte, NC',flag:'📍',val:2180,change:'1.20%',up:false}]},
        ].map(section=>(
          <div key={section.title} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
            <h3 style={{fontSize:13,fontWeight:600,color:'#333',marginBottom:12}}>{section.title}</h3>
            {section.items.map(item=>(
              <div key={item.name} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid #f5f5f5'}}>
                <span style={{fontSize:16}}>{item.flag}</span>
                <span style={{fontSize:13,color:'#333',flex:1}}>{item.name}</span>
                <div style={{textAlign:'right' as const}}>
                  <div style={{fontSize:13,fontWeight:600}}>{item.val.toLocaleString()}</div>
                  <Change val={item.change} up={item.up}/>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function SocialFacebookEngagement(){
  const postEngData = FB_TIME.map(t=>({d:t.d.replace(' Apr',''), v:Math.round(t.views*2.8+800), v2:Math.round(t.views*5.5+1200)}))
  const mediaViewsData = FB_TIME.map(t=>({d:t.d.replace(' Apr',''), v:Math.round(t.views*55)}))
  const videoViewsData = FB_TIME.map(t=>({d:t.d.replace(' Apr',''), nonPaid:Math.round(t.views*1.4), paid:0}))

  return(
    <div style={{flex:1,overflowY:'auto',padding:20,background:'#f8f9fa'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span style={{fontSize:13,color:'#555'}}>Post Engagement</span>
            <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:16,fontWeight:700}}>41,591</span><Change val="55%" up={false}/></div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={postEngData}>
              <defs><linearGradient id="peg1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#48b5ea" stopOpacity={0.2}/><stop offset="95%" stopColor="#48b5ea" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/>
              <YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#999'}} tickFormatter={(v:number)=>v>=1000?(v/1000)+'K':String(v)}/>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <Tooltip contentStyle={{fontSize:11,borderRadius:6}}/>
              <Area type="monotone" dataKey="v" stroke="#48b5ea" fill="url(#peg1)" strokeWidth={2} name="This period"/>
              <Area type="monotone" dataKey="v2" stroke="#a8d8ff" fill="none" strokeWidth={1.5} strokeDasharray="4 2" name="Prev period"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span style={{fontSize:13,color:'#555'}}>Page Follows</span>
            <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:16,fontWeight:700}}>104 K</span><Change val="1.39%" up={true}/></div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={FB_TIME}>
              <defs><linearGradient id="pfl1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4DA6FF" stopOpacity={0.4}/><stop offset="95%" stopColor="#4DA6FF" stopOpacity={0.1}/></linearGradient></defs>
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/>
              <YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#999'}} tickFormatter={(v:number)=>v>=1000?(v/1000).toFixed(0)+'K':String(v)} domain={[0,130000]}/>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <Tooltip contentStyle={{fontSize:11,borderRadius:6}} formatter={(v:number)=>[v.toLocaleString(),'Follows']}/>
              <Area type="monotone" dataKey="follows" stroke="#4DA6FF" fill="url(#pfl1)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        {[
          {label:'Post Engagement Rate',val:'1.35%',change:'54%',up:false},
          {label:'Post Media Views',val:'101.0 K',change:'41%',up:false},
          {label:'New Page Follows',val:'1,506',change:'32%',up:false},
          {label:'Page Unfollows',val:'81',change:'13%',up:false},
        ].map(k=>(
          <div key={k.label} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:'16px 20px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <span style={{fontSize:13,color:'#555'}}>{k.label}</span>
              <Change val={k.change} up={k.up}/>
            </div>
            <p style={{fontSize:24,fontWeight:700,color:'#1a1a1a',letterSpacing:'-0.5px'}}>{k.val}</p>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span style={{fontSize:13,color:'#555'}}>Post Media Views</span>
            <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:14,fontWeight:700}}>101 K</span><Change val="41%" up={false}/><button style={{background:'none',border:'none',cursor:'pointer',color:'#bbb'}}><MoreHorizontal size={12}/></button></div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={mediaViewsData}>
              <defs><linearGradient id="pmv1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#48b5ea" stopOpacity={0.2}/><stop offset="95%" stopColor="#48b5ea" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:8,fill:'#999'}}/>
              <YAxis axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}} tickFormatter={(v:number)=>v>=1000?(v/1000)+'K':String(v)}/>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <Tooltip contentStyle={{fontSize:11,borderRadius:6}}/>
              <Area type="monotone" dataKey="v" stroke="#48b5ea" fill="url(#pmv1)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span style={{fontSize:13,color:'#555'}}>Video Views</span>
            <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:14,fontWeight:700}}>10,016</span><Change val="8.65%" up={true}/></div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={videoViewsData}>
              <defs>
                <linearGradient id="vv1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#48b5ea" stopOpacity={0.3}/><stop offset="95%" stopColor="#48b5ea" stopOpacity={0}/></linearGradient>
              </defs>
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:8,fill:'#999'}}/>
              <YAxis axisLine={false} tickLine={false} tick={{fontSize:9,fill:'#999'}}/>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <Tooltip contentStyle={{fontSize:11,borderRadius:6}}/>
              <Area type="monotone" dataKey="nonPaid" stroke="#48b5ea" fill="url(#vv1)" strokeWidth={2} name="Non-Paid"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:20,display:'flex',flexDirection:'column'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
            <span style={{fontSize:13,color:'#555'}}>Video Views</span>
            <Change val="8.65%" up={true}/>
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:16,flex:1}}>
            <div style={{position:'relative',width:120,height:120,flexShrink:0}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={[{name:'Non-Paid',value:10016,color:'#9CCC65'},{name:'Paid',value:1,color:'#F9B62A'}]} cx="50%" cy="50%" innerRadius={35} outerRadius={52} dataKey="value">{[{color:'#9CCC65'},{color:'#F9B62A'}].map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie></PieChart>
              </ResponsiveContainer>
              <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <span style={{fontSize:12,fontWeight:700}}>10,016</span>
                <span style={{fontSize:8,color:'#999'}}>Video Views</span>
              </div>
            </div>
            <div>
              {[{name:'Non-Paid',val:'10,016',color:'#9CCC65'},{name:'Paid',val:'0',color:'#F9B62A'}].map(d=>(
                <div key={d.name} style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
                  <div style={{width:10,height:10,borderRadius:'50%',background:d.color}}/>
                  <span style={{fontSize:12,color:'#333'}}>{d.name}</span>
                  <span style={{fontSize:12,fontWeight:600,marginLeft:4}}>{d.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SocialPostCard({post}:{post:typeof FB_POSTS[0]}){
  return(
    <div style={{maxWidth:480,margin:'0 auto 24px',background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,overflow:'hidden'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#20BB71,#48b5ea)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🌿</div>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:'#1a1a1a'}}>Atlanta Beltline</div>
            <div style={{fontSize:11,color:'#999'}}>@Atlanta Beltline</div>
          </div>
        </div>
        <span style={{fontSize:12,color:'#999'}}>{post.date}</span>
      </div>
      <div style={{width:'100%',height:280,background:post.bgColor||'#f0f0f0',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
        <img src={post.image} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>
      </div>
      <div style={{padding:'12px 16px'}}>
        <p style={{fontSize:13,color:'#333',lineHeight:1.5,marginBottom:12}}>{post.caption}</p>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:10,borderTop:'1px solid #f0f0f0'}}>
          <span style={{fontSize:12,color:'#48b5ea',fontWeight:600,cursor:'pointer'}}>Comments</span>
          <div style={{display:'flex',gap:8}}>
            <span style={{background:'#f0f0f0',padding:'4px 10px',borderRadius:4,fontSize:11,fontWeight:600,color:'#555'}}>{post.impressions.toLocaleString()} POST IMPRESSIONS UNIQUE</span>
            <span style={{background:'#f0f0f0',padding:'4px 10px',borderRadius:4,fontSize:11,fontWeight:600,color:'#555'}}>{post.likes} LIKES</span>
            <span style={{background:'#f0f0f0',padding:'4px 10px',borderRadius:4,fontSize:11,fontWeight:600,color:'#555'}}>{post.clicks} CLICKS</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SocialFacebookPosts(){
  return(
    <div style={{flex:1,overflowY:'auto',padding:20,background:'#f8f9fa'}}>
      {FB_POSTS.map((post,i)=><SocialPostCard key={i} post={post}/>)}
    </div>
  )
}

function SocialFacebookReels(){
  return(
    <div style={{flex:1,overflowY:'auto',padding:20,background:'#f8f9fa'}}>
      {FB_REELS.map((reel,i)=>(
        <div key={i} style={{maxWidth:480,margin:'0 auto 24px',background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,overflow:'hidden'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#20BB71,#48b5ea)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🌿</div>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:'#1a1a1a'}}>Atlanta Beltline</div>
                <div style={{fontSize:11,color:'#999'}}>@Atlanta Beltline</div>
              </div>
            </div>
            <span style={{fontSize:12,color:'#999'}}>{reel.date}</span>
          </div>
          <div style={{width:'100%',height:380,background:'#1a1a1a',overflow:'hidden',position:'relative'}}>
            <img src={reel.image} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>
            <div style={{position:'absolute',bottom:12,right:12,background:'rgba(0,0,0,0.6)',borderRadius:4,padding:'4px 8px',fontSize:11,color:'#fff',display:'flex',alignItems:'center',gap:4}}>
              <span>▶</span> Reel
            </div>
          </div>
          <div style={{padding:'12px 16px'}}>
            <p style={{fontSize:13,color:'#333',lineHeight:1.5,marginBottom:12}}>{reel.caption}</p>
            <div style={{display:'flex',gap:8,paddingTop:10,borderTop:'1px solid #f0f0f0',flexWrap:'wrap' as const}}>
              <span style={{background:'#f0f0f0',padding:'4px 10px',borderRadius:4,fontSize:11,fontWeight:600,color:'#555'}}>{reel.impressions.toLocaleString()} IMPRESSIONS</span>
              <span style={{background:'#f0f0f0',padding:'4px 10px',borderRadius:4,fontSize:11,fontWeight:600,color:'#555'}}>{reel.likes} LIKES</span>
              <span style={{background:'#f0f0f0',padding:'4px 10px',borderRadius:4,fontSize:11,fontWeight:600,color:'#555'}}>{reel.clicks} CLICKS</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


// ── Main export ───────────────────────────────────────────────────────────────
export default function DrillDownPanel({clientName='Atlanta BeltLine Website',onClose}:DrillDownPanelProps){
  const [activeNav,setActiveNav]=useState('all')
  const [expandedGroups,setExpandedGroups]=useState<Set<string>>(new Set(['ga4','Acquisition']))
  const [tableSearch,setTableSearch]=useState('')

  function toggleGroup(key:string){setExpandedGroups(prev=>{const n=new Set(prev);n.has(key)?n.delete(key):n.add(key);return n})}

  const isAudience=AUDIENCE_ITEMS.some(a=>a.id===activeNav)
  const isConversion=CONVERSION_ITEMS.some(c=>c.id===activeNav)
  const isPages=PAGES_ITEMS.some(p=>p.id===activeNav)
  const isEvents=activeNav==='events-name'
  const isSocial=FACEBOOK_ITEMS.some(f=>f.id===activeNav)
  const cd=CHANNEL_DATA[activeNav]||CHANNEL_DATA['all']
  const activeLabel=[...CHANNELS,...AUDIENCE_ITEMS,...CONVERSION_ITEMS,...PAGES_ITEMS,{id:'events-name',label:'Event Name'},...FACEBOOK_ITEMS].find(c=>c.id===activeNav)?.label||'All Channels'

  function LeftNav(){
    return(
      <div style={{flex:1,overflowY:'auto',paddingBottom:16}}>
        <button onClick={()=>toggleGroup('ga4')} style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'10px 16px',background:'none',border:'none',cursor:'pointer',textAlign:'left' as const}}>
          <span style={{fontSize:14}}>📊</span><span style={{fontSize:13,fontWeight:600,color:'#1a1a1a',flex:1}}>Google Analytics 4</span>
          <ChevronDown size={12} style={{color:'#999',transform:expandedGroups.has('ga4')?'rotate(0deg)':'rotate(-90deg)',transition:'0.15s'}}/>
        </button>
        {expandedGroups.has('ga4')&&<>
          {/* Acquisition */}
          <button onClick={()=>toggleGroup('Acquisition')} style={{width:'100%',display:'flex',alignItems:'center',gap:6,padding:'7px 16px 7px 28px',background:'none',border:'none',cursor:'pointer',textAlign:'left' as const}}>
            <ChevronDown size={11} style={{color:'#888',transform:expandedGroups.has('Acquisition')?'rotate(0deg)':'rotate(-90deg)',transition:'0.15s'}}/><span style={{fontSize:13,fontWeight:500,color:'#333'}}>Acquisition</span>
          </button>
          {expandedGroups.has('Acquisition')&&CHANNELS.map(ch=>(
            <button key={ch.id} onClick={()=>setActiveNav(ch.id)} style={{width:'100%',textAlign:'left' as const,padding:'7px 16px 7px 44px',fontSize:13,cursor:'pointer',border:'none',borderLeft:activeNav===ch.id?'2px solid #48b5ea':'2px solid transparent',background:activeNav===ch.id?'#f0f7ff':'transparent',color:activeNav===ch.id?'#1a85c8':'#555',fontWeight:activeNav===ch.id?600:400}}>{ch.label}</button>
          ))}
          {/* Audience */}
          <button onClick={()=>toggleGroup('Audience')} style={{width:'100%',display:'flex',alignItems:'center',gap:6,padding:'7px 16px 7px 28px',background:'none',border:'none',cursor:'pointer',textAlign:'left' as const}}>
            <ChevronDown size={11} style={{color:'#888',transform:expandedGroups.has('Audience')?'rotate(0deg)':'rotate(-90deg)',transition:'0.15s'}}/><span style={{fontSize:13,fontWeight:500,color:'#333'}}>Audience</span>
          </button>
          {expandedGroups.has('Audience')&&AUDIENCE_ITEMS.map(item=>(
            <button key={item.id} onClick={()=>setActiveNav(item.id)} style={{width:'100%',textAlign:'left' as const,padding:'7px 16px 7px 44px',fontSize:13,cursor:'pointer',border:'none',borderLeft:activeNav===item.id?'2px solid #48b5ea':'2px solid transparent',background:activeNav===item.id?'#f0f7ff':'transparent',color:activeNav===item.id?'#1a85c8':'#555',fontWeight:activeNav===item.id?600:400}}>{item.label}</button>
          ))}
          {/* Conversions */}
          <button onClick={()=>toggleGroup('Conversions')} style={{width:'100%',display:'flex',alignItems:'center',gap:6,padding:'7px 16px 7px 28px',background:'none',border:'none',cursor:'pointer',textAlign:'left' as const}}>
            <ChevronDown size={11} style={{color:'#888',transform:expandedGroups.has('Conversions')?'rotate(0deg)':'rotate(-90deg)',transition:'0.15s'}}/><span style={{fontSize:13,fontWeight:500,color:'#333'}}>Conversions</span>
          </button>
          {expandedGroups.has('Conversions')&&CONVERSION_ITEMS.map(item=>(
            <button key={item.id} onClick={()=>setActiveNav(item.id)} style={{width:'100%',textAlign:'left' as const,padding:'7px 16px 7px 44px',fontSize:13,cursor:'pointer',border:'none',borderLeft:activeNav===item.id?'2px solid #48b5ea':'2px solid transparent',background:activeNav===item.id?'#f0f7ff':'transparent',color:activeNav===item.id?'#1a85c8':'#555',fontWeight:activeNav===item.id?600:400}}>{item.label}</button>
          ))}
          {/* Pages */}
          <button onClick={()=>toggleGroup('Pages')} style={{width:'100%',display:'flex',alignItems:'center',gap:6,padding:'7px 16px 7px 28px',background:'none',border:'none',cursor:'pointer',textAlign:'left' as const}}>
            <ChevronDown size={11} style={{color:'#888',transform:expandedGroups.has('Pages')?'rotate(0deg)':'rotate(-90deg)',transition:'0.15s'}}/><span style={{fontSize:13,fontWeight:500,color:'#333'}}>Pages</span>
          </button>
          {expandedGroups.has('Pages')&&PAGES_ITEMS.map(item=>(
            <button key={item.id} onClick={()=>setActiveNav(item.id)} style={{width:'100%',textAlign:'left' as const,padding:'7px 16px 7px 44px',fontSize:13,cursor:'pointer',border:'none',borderLeft:activeNav===item.id?'2px solid #48b5ea':'2px solid transparent',background:activeNav===item.id?'#f0f7ff':'transparent',color:activeNav===item.id?'#1a85c8':'#555',fontWeight:activeNav===item.id?600:400}}>{item.label}</button>
          ))}
          {/* Events */}
          <button onClick={()=>toggleGroup('Events')} style={{width:'100%',display:'flex',alignItems:'center',gap:6,padding:'7px 16px 7px 28px',background:'none',border:'none',cursor:'pointer',textAlign:'left' as const}}>
            <ChevronDown size={11} style={{color:'#888',transform:expandedGroups.has('Events')?'rotate(0deg)':'rotate(-90deg)',transition:'0.15s'}}/><span style={{fontSize:13,fontWeight:500,color:'#333'}}>Events</span>
          </button>
          {expandedGroups.has('Events')&&(
            <button onClick={()=>setActiveNav('events-name')} style={{width:'100%',textAlign:'left' as const,padding:'7px 16px 7px 44px',fontSize:13,cursor:'pointer',border:'none',borderLeft:activeNav==='events-name'?'2px solid #48b5ea':'2px solid transparent',background:activeNav==='events-name'?'#f0f7ff':'transparent',color:activeNav==='events-name'?'#1a85c8':'#555',fontWeight:activeNav==='events-name'?600:400}}>Event Name</button>
          )}
        </>}
        <button onClick={()=>toggleGroup('Social')} style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'10px 16px',background:'none',border:'none',cursor:'pointer',textAlign:'left' as const}}>
          <span style={{fontSize:14}}>📱</span><span style={{fontSize:13,fontWeight:600,color:'#1a1a1a',flex:1}}>Social</span>
          <ChevronDown size={12} style={{color:'#999',transform:expandedGroups.has('Social')?'rotate(0deg)':'rotate(-90deg)',transition:'0.15s'}}/>
        </button>
        {expandedGroups.has('Social')&&(
          <>
            <button onClick={()=>toggleGroup('Facebook')} style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'7px 16px 7px 24px',background:'none',border:'none',cursor:'pointer',textAlign:'left' as const}}>
              <span style={{fontSize:12}}>📘</span><span style={{fontSize:13,fontWeight:500,color:'#333',flex:1}}>Facebook</span>
              <ChevronDown size={11} style={{color:'#999',transform:expandedGroups.has('Facebook')?'rotate(0deg)':'rotate(-90deg)',transition:'0.15s'}}/>
            </button>
            {expandedGroups.has('Facebook')&&FACEBOOK_ITEMS.map(item=>(
              <button key={item.id} onClick={()=>setActiveNav(item.id)} style={{width:'100%',textAlign:'left' as const,padding:'7px 16px 7px 44px',fontSize:13,cursor:'pointer',border:'none',borderLeft:activeNav===item.id?'2px solid #48b5ea':'2px solid transparent',background:activeNav===item.id?'#f0f7ff':'transparent',color:activeNav===item.id?'#1a85c8':'#555',fontWeight:activeNav===item.id?600:400}}>{item.label}</button>
            ))}
          </>
        )}
        <button style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'10px 16px',background:'none',border:'none',cursor:'pointer'}}>
          <span style={{fontSize:14}}>💰</span><span style={{fontSize:13,fontWeight:600,color:'#1a1a1a',flex:1}}>Paid Ads</span><ChevronRight size={12} style={{color:'#999'}}/>
        </button>
      </div>
    )
  }

  function AcquisitionContent(){
    return(
      <>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
          <LeftAreaChart data={cd.timeData} metric="Views" value={fmt(cd.views)} change={cd.viewsChange} up={cd.viewsUp}/>
          <AcqRightChart cd={cd}/>
        </div>
        <KPICards cd={cd}/>
        {activeNav==='all'&&(
          <div style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,overflow:'hidden',marginTop:16}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px',borderBottom:'1px solid #f0f0f0'}}>
              <span style={{fontSize:12,color:'#666'}}>Showing {ALL_CHANNEL_ROWS.filter(r=>r.channel.toLowerCase().includes(tableSearch.toLowerCase())).length} of {ALL_CHANNEL_ROWS.length} Rows</span>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <input value={tableSearch} onChange={e=>setTableSearch(e.target.value)} placeholder="Search" style={{background:'#fafafa',border:'1px solid #e5e5e5',borderRadius:6,padding:'5px 10px',fontSize:12,outline:'none',width:160}}/>
                <button style={{background:'none',border:'none',cursor:'pointer',color:'#bbb'}}><MoreHorizontal size={14}/></button>
              </div>
            </div>
            <div style={{overflowX:'auto' as const}}>
              <table style={{width:'100%',borderCollapse:'collapse' as const,fontSize:12}}>
                <thead><tr style={{borderBottom:'1px solid #f0f0f0',background:'#fafafa'}}>
                  {['CHANNEL','SESSIONS ↓','TOTAL USERS','USER ENGAGEMENT','VIEWS','KEY EVENTS','EVENT COUNT','TOTAL PURCHASERS'].map(h=>(
                    <th key={h} style={{padding:'9px 14px',textAlign:h==='CHANNEL'?'left':'right' as any,fontSize:11,fontWeight:600,color:'#888',whiteSpace:'nowrap' as const}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{ALL_CHANNEL_ROWS.filter(r=>r.channel.toLowerCase().includes(tableSearch.toLowerCase())).map((row,i)=>(
                  <tr key={row.channel} style={{borderBottom:'1px solid #f8f8f8',background:i%2===0?'#fff':'#fafafa'}}>
                    <td style={{padding:'11px 14px',fontWeight:500,color:'#1a1a1a',whiteSpace:'nowrap' as const}}>{row.channel}</td>
                    <td style={{padding:'11px 14px',textAlign:'right' as const}}><div style={{fontWeight:500}}>{row.sessions.toLocaleString()}</div><Change val={row.sessChange} up={row.sessUp}/></td>
                    <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{row.users.toLocaleString()}</div><Change val={row.usersChange} up={row.usersUp}/></td>
                    <td style={{padding:'11px 14px',textAlign:'right' as const}}><div style={{fontSize:12,color:'#333'}}>{row.engagement}</div><Change val={row.engChange} up={row.engUp}/></td>
                    <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{row.views.toLocaleString()}</div><Change val={row.viewsChange} up={row.viewsUp}/></td>
                    <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{row.keyEvents.toFixed(2)}</div><Change val={row.keyChange} up={row.keyUp}/></td>
                    <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{row.eventCount.toLocaleString()}</div><Change val={row.evtChange} up={row.evtUp}/></td>
                    <td style={{padding:'11px 14px',textAlign:'right' as const}}><div>{row.purchasers}</div><span style={{fontSize:10,fontWeight:600,color:'#999',background:'#f0f0f0',padding:'1px 5px',borderRadius:3}}>{row.pct}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}
      </>
    )
  }

  function renderContent(){
    if(isSocial){
      switch(activeNav){
        case 'fb-page':       return <SocialFacebookPage/>
        case 'fb-engagement': return <SocialFacebookEngagement/>
        case 'fb-posts':      return <SocialFacebookPosts/>
        case 'fb-reels':      return <SocialFacebookReels/>
      }
    }
    if(isEvents){
      return <EventsEventName search={tableSearch} onSearch={setTableSearch}/>
    }
    if(isPages){
      switch(activeNav){
        case 'pages-all':     return <PagesAll search={tableSearch} onSearch={setTableSearch}/>
        case 'pages-landing': return <PagesLanding search={tableSearch} onSearch={setTableSearch}/>
        case 'pages-path':    return <PagesPath search={tableSearch} onSearch={setTableSearch}/>
        case 'pages-title':   return <PagesTitle search={tableSearch} onSearch={setTableSearch}/>
        case 'pages-content': return <PagesContentGroup search={tableSearch} onSearch={setTableSearch}/>
      }
    }
    if(isConversion){
      switch(activeNav){
        case 'conv-campaigns': return <ConversionsCampaigns search={tableSearch} onSearch={setTableSearch}/>
        case 'conv-ecommerce': return <ConversionsEcommerce/>
      }
    }
    if(isAudience){
      switch(activeNav){
        case 'aud-location':      return <AudienceLocation search={tableSearch} onSearch={setTableSearch}/>
        case 'aud-language':      return <AudienceLanguage search={tableSearch} onSearch={setTableSearch}/>
        case 'aud-age':           return <AudienceAge/>
        case 'aud-gender':        return <AudienceGender/>
        case 'aud-devices':       return <AudienceDevices search={tableSearch} onSearch={setTableSearch}/>
        case 'aud-browser':       return <AudienceBrowser search={tableSearch} onSearch={setTableSearch}/>
        case 'aud-os':            return <AudienceOS search={tableSearch} onSearch={setTableSearch}/>
        case 'aud-interests':     return <AudienceInterests search={tableSearch} onSearch={setTableSearch}/>
        case 'aud-new-returning': return <AudienceNewReturning search={tableSearch} onSearch={setTableSearch}/>
      }
    }
    return <AcquisitionContent/>
  }

  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',zIndex:200,display:'flex',alignItems:'stretch',justifyContent:'flex-end'}} onClick={onClose}>
      <div style={{width:'88%',background:'#fff',display:'flex',flexDirection:'column',overflow:'hidden'}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:'12px 20px',borderBottom:'1px solid #e5e5e5',display:'flex',alignItems:'center',gap:12,background:'#fff',flexShrink:0}}>
          <span style={{fontSize:14}}>📊</span>
          <span style={{fontSize:15,fontWeight:700,color:'#1a1a1a'}}>{activeLabel}</span>
          <div style={{background:'#f0f0f0',border:'1px solid #e5e5e5',borderRadius:6,padding:'4px 12px',fontSize:12,color:'#333'}}>Account is <strong>{clientName}</strong></div>
          <button style={{background:'#f5f5f5',border:'1px solid #e5e5e5',borderRadius:6,padding:'4px 12px',fontSize:12,color:'#333',cursor:'pointer',display:'flex',alignItems:'center',gap:4}}><Plus size={11}/> Add Filter</button>
          <button style={{background:'none',border:'none',fontSize:12,color:'#999',cursor:'pointer'}}>Clear All</button>
          <button onClick={onClose} style={{marginLeft:'auto',background:'none',border:'none',cursor:'pointer',color:'#999'}}><X size={18}/></button>
        </div>
        <div style={{display:'flex',flex:1,overflow:'hidden'}}>
          <div style={{width:220,minWidth:220,borderRight:'1px solid #e5e5e5',background:'#fff',display:'flex',flexDirection:'column',overflow:'hidden'}}><LeftNav/></div>
          {isSocial ? renderContent() : <div style={{flex:1,overflowY:'auto',padding:20,background:'#f8f9fa'}}>{renderContent()}</div>}
        </div>
      </div>
    </div>
  )
}
