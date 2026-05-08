'use client'
import { useState } from 'react'
import { X, Plus, MoreHorizontal, ChevronRight, ChevronDown } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

interface DrillDownPanelProps {
  clientName?: string
  ga4Data?: any
  sessionData?: any[]
  sourceData?: any[]
  onClose: () => void
}

const CHANNELS = [
  { id: 'all',            label: 'All' },
  { id: 'organic-search', label: 'Organic Search' },
  { id: 'paid-search',    label: 'Paid Search' },
  { id: 'direct',         label: 'Direct' },
  { id: 'social',         label: 'Social' },
  { id: 'referral',       label: 'Referral' },
  { id: 'display',        label: 'Display' },
  { id: 'email',          label: 'Email' },
  { id: 'video',          label: 'Video' },
  { id: 'paid-social',    label: 'Paid Social' },
]

const AUDIENCE_ITEMS = [
  { id: 'aud-location',      label: 'Location' },
  { id: 'aud-language',      label: 'Language' },
  { id: 'aud-age',           label: 'Age' },
  { id: 'aud-gender',        label: 'Gender' },
  { id: 'aud-devices',       label: 'Devices' },
  { id: 'aud-browser',       label: 'Browser' },
  { id: 'aud-os',            label: 'Operating System' },
  { id: 'aud-interests',     label: 'Interests' },
  { id: 'aud-new-returning', label: 'New vs Returning' },
]

type ChartEntry = { name: string; value: number; color: string }
type TimeEntry  = { d: string; v: number; v2: number }

interface ChannelData {
  views: number; viewsChange: string; viewsUp: boolean
  sessions: number; sessChange: string; sessUp: boolean
  users: number; usersChange: string; usersUp: boolean
  engagement: string; engChange: string; engUp: boolean
  keyEvents: number; keyChange: string; keyUp: boolean
  eventCount: string; evtChange: string; evtUp: boolean
  chartType: 'donut' | 'bar'
  donutData?: ChartEntry[]
  barData?: ChartEntry[]
  timeData: TimeEntry[]
}

const CHANNEL_DATA: Record<string, ChannelData> = {
  all: {
    views: 242900, viewsChange: '1.91%', viewsUp: false,
    sessions: 120500, sessChange: '0.35%', sessUp: false,
    users: 88069, usersChange: '0.69%', usersUp: true,
    engagement: '66d 21h 22m 49s', engChange: '1.65%', engUp: false,
    keyEvents: 3610, keyChange: '21%', keyUp: false,
    eventCount: '1.54 M', evtChange: '2.67%', evtUp: false,
    chartType: 'donut',
    donutData: [
      { name: 'Organic Search', value: 152328, color: '#4DA6FF' },
      { name: 'Direct',         value: 50441,  color: '#4CAF82' },
      { name: 'Paid Search',    value: 11350,  color: '#F9B62A' },
      { name: 'Organic Social', value: 10032,  color: '#A8D8FF' },
      { name: 'Referral',       value: 8653,   color: '#CE93D8' },
      { name: 'Paid Social',    value: 7921,   color: '#FFB74D' },
      { name: 'Unassigned',     value: 1311,   color: '#B0BEC5' },
      { name: 'Email',          value: 733,    color: '#80CBC4' },
    ],
    timeData: [
      {d:'6 Apr',v:9200,v2:8100},{d:'8 Apr',v:10500,v2:9600},{d:'10 Apr',v:9800,v2:9200},
      {d:'13 Apr',v:8800,v2:9200},{d:'15 Apr',v:11200,v2:10800},{d:'17 Apr',v:9600,v2:8900},
      {d:'20 Apr',v:12400,v2:11200},{d:'22 Apr',v:11800,v2:10500},{d:'27 Apr',v:8900,v2:7600},
    ],
  },
  'organic-search': {
    views: 152300, viewsChange: '5.26%', viewsUp: true,
    sessions: 68639, sessChange: '7.11%', sessUp: true,
    users: 44985, usersChange: '7.64%', usersUp: true,
    engagement: '44d 8h 39m 25s', engChange: '4.75%', engUp: true,
    keyEvents: 2368, keyChange: '11%', keyUp: false,
    eventCount: '998.5 K', evtChange: '5.00%', evtUp: true,
    chartType: 'donut',
    donutData: [
      { name: 'google',              value: 143000, color: '#4DA6FF' },
      { name: 'bing',                value: 5866,   color: '#4CAF82' },
      { name: 'duckduckgo',          value: 1621,   color: '#F9B62A' },
      { name: 'yahoo',               value: 1564,   color: '#A8D8FF' },
      { name: 'ecosia.org',          value: 299,    color: '#CE93D8' },
      { name: 'br.search.yahoo.com', value: 73,     color: '#FFB74D' },
      { name: 'msn.com',             value: 53,     color: '#B0BEC5' },
      { name: 'cn.bing.com',         value: 32,     color: '#80CBC4' },
    ],
    timeData: [
      {d:'6 Apr',v:5800,v2:5200},{d:'8 Apr',v:6400,v2:5800},{d:'10 Apr',v:7200,v2:6400},
      {d:'13 Apr',v:6800,v2:7000},{d:'15 Apr',v:7800,v2:7200},{d:'17 Apr',v:6200,v2:6000},
      {d:'20 Apr',v:5600,v2:5400},{d:'22 Apr',v:4800,v2:5000},{d:'27 Apr',v:4000,v2:4200},
    ],
  },
  'paid-search': {
    views: 11350, viewsChange: '3.23%', viewsUp: true,
    sessions: 3874, sessChange: '0.16%', sessUp: true,
    users: 2931, usersChange: '2.30%', usersUp: false,
    engagement: '3d 20h 50s', engChange: '8.72%', engUp: true,
    keyEvents: 163, keyChange: '9.40%', keyUp: true,
    eventCount: '78,019', evtChange: '3.76%', evtUp: true,
    chartType: 'donut',
    donutData: [
      { name: 'google', value: 11350, color: '#4DA6FF' },
    ],
    timeData: [
      {d:'6 Apr',v:380,v2:340},{d:'8 Apr',v:420,v2:390},{d:'10 Apr',v:460,v2:420},
      {d:'13 Apr',v:390,v2:410},{d:'15 Apr',v:580,v2:520},{d:'17 Apr',v:500,v2:480},
      {d:'20 Apr',v:440,v2:430},{d:'22 Apr',v:410,v2:400},{d:'27 Apr',v:330,v2:350},
    ],
  },
  direct: {
    views: 50441, viewsChange: '9.86%', viewsUp: false,
    sessions: 30294, sessChange: '15%', sessUp: false,
    users: 24614, usersChange: '16%', usersUp: false,
    engagement: '12d 21h 3m 39s', engChange: '7.43%', engUp: false,
    keyEvents: 596, keyChange: '26%', keyUp: false,
    eventCount: '295.9 K', evtChange: '9.10%', evtUp: false,
    chartType: 'bar',
    barData: [
      { name: '/visit/',      value: 7800, color: '#4DA6FF' },
      { name: '/events/',     value: 5900, color: '#4CAF82' },
      { name: '/map/',        value: 3800, color: '#F9B62A' },
      { name: '/blog/atl...', value: 1400, color: '#A8D8FF' },
      { name: '/parks-t...',  value: 1100, color: '#CE93D8' },
      { name: '/blog/',       value: 900,  color: '#FFB74D' },
      { name: '/blog/at2...', value: 700,  color: '#B0BEC5' },
      { name: '/live/',       value: 500,  color: '#80CBC4' },
    ],
    timeData: [
      {d:'6 Apr',v:3800,v2:4200},{d:'8 Apr',v:2800,v2:3200},{d:'10 Apr',v:2200,v2:2600},
      {d:'13 Apr',v:1800,v2:2200},{d:'15 Apr',v:2000,v2:2400},{d:'17 Apr',v:1600,v2:2000},
      {d:'20 Apr',v:7200,v2:2800},{d:'22 Apr',v:2400,v2:2800},{d:'27 Apr',v:1600,v2:2000},
    ],
  },
  social: {
    views: 10032, viewsChange: '7.43%', viewsUp: false,
    sessions: 6570, sessChange: '24%', sessUp: true,
    users: 5587, usersChange: '21%', usersUp: true,
    engagement: '2d 13h 51m 18s', engChange: '11%', engUp: true,
    keyEvents: 179, keyChange: '25%', keyUp: false,
    eventCount: '63,071', evtChange: '13%', evtUp: false,
    chartType: 'bar',
    barData: [
      { name: 'later-lin...', value: 1820, color: '#4DA6FF' },
      { name: 'm.faceb...',   value: 1780, color: '#4CAF82' },
      { name: 'faceboo...',   value: 1100, color: '#F9B62A' },
      { name: 'reddit.c...',  value: 1080, color: '#A8D8FF' },
      { name: 'l.facebo...',  value: 920,  color: '#CE93D8' },
      { name: 'linkedin...',  value: 860,  color: '#FFB74D' },
      { name: 'l.instag...',  value: 620,  color: '#B0BEC5' },
      { name: 't.co',         value: 480,  color: '#80CBC4' },
    ],
    timeData: [
      {d:'6 Apr',v:380,v2:520},{d:'8 Apr',v:320,v2:440},{d:'10 Apr',v:280,v2:380},
      {d:'13 Apr',v:240,v2:320},{d:'15 Apr',v:1200,v2:360},{d:'17 Apr',v:480,v2:340},
      {d:'20 Apr',v:360,v2:320},{d:'22 Apr',v:580,v2:300},{d:'27 Apr',v:280,v2:300},
    ],
  },
  referral: {
    views: 8653, viewsChange: '3.00%', viewsUp: false,
    sessions: 4079, sessChange: '8%', sessUp: false,
    users: 3200, usersChange: '5%', usersUp: false,
    engagement: '1d 4h 20m', engChange: '2%', engUp: true,
    keyEvents: 124, keyChange: '18%', keyUp: false,
    eventCount: '55,440', evtChange: '4%', evtUp: false,
    chartType: 'bar',
    barData: [
      { name: 'beltline.org', value: 2200, color: '#4DA6FF' },
      { name: 'atlanta.gov',  value: 1400, color: '#4CAF82' },
      { name: 'ajc.com',      value: 980,  color: '#F9B62A' },
      { name: 'yelp.com',     value: 720,  color: '#A8D8FF' },
      { name: 'tripadvi...',  value: 540,  color: '#CE93D8' },
    ],
    timeData: [
      {d:'6 Apr',v:320,v2:380},{d:'8 Apr',v:280,v2:320},{d:'10 Apr',v:310,v2:290},
      {d:'13 Apr',v:260,v2:280},{d:'15 Apr',v:340,v2:300},{d:'17 Apr',v:290,v2:270},
      {d:'20 Apr',v:270,v2:260},{d:'22 Apr',v:250,v2:240},{d:'27 Apr',v:220,v2:240},
    ],
  },
  display: {
    views: 2100, viewsChange: '5%', viewsUp: true,
    sessions: 980, sessChange: '3%', sessUp: true,
    users: 810, usersChange: '4%', usersUp: true,
    engagement: '8h 22m', engChange: '2%', engUp: true,
    keyEvents: 18, keyChange: '10%', keyUp: false,
    eventCount: '12,400', evtChange: '5%', evtUp: true,
    chartType: 'donut',
    donutData: [{ name: 'google', value: 2100, color: '#4DA6FF' }],
    timeData: [
      {d:'6 Apr',v:90,v2:80},{d:'8 Apr',v:110,v2:95},{d:'10 Apr',v:95,v2:100},
      {d:'13 Apr',v:80,v2:90},{d:'15 Apr',v:120,v2:100},{d:'17 Apr',v:100,v2:95},
      {d:'20 Apr',v:85,v2:90},{d:'22 Apr',v:75,v2:85},{d:'27 Apr',v:65,v2:75},
    ],
  },
  email: {
    views: 733, viewsChange: '2%', viewsUp: false,
    sessions: 420, sessChange: '3%', sessUp: false,
    users: 380, usersChange: '2%', usersUp: false,
    engagement: '4h 12m', engChange: '1%', engUp: true,
    keyEvents: 8, keyChange: '5%', keyUp: false,
    eventCount: '4,820', evtChange: '2%', evtUp: false,
    chartType: 'donut',
    donutData: [
      { name: 'mailchimp', value: 600, color: '#4DA6FF' },
      { name: 'other',     value: 133, color: '#4CAF82' },
    ],
    timeData: [
      {d:'6 Apr',v:30,v2:35},{d:'8 Apr',v:28,v2:32},{d:'10 Apr',v:32,v2:30},
      {d:'13 Apr',v:25,v2:28},{d:'15 Apr',v:38,v2:32},{d:'17 Apr',v:30,v2:28},
      {d:'20 Apr',v:26,v2:25},{d:'22 Apr',v:22,v2:24},{d:'27 Apr',v:18,v2:20},
    ],
  },
  video: {
    views: 540, viewsChange: '1%', viewsUp: true,
    sessions: 290, sessChange: '2%', sessUp: true,
    users: 240, usersChange: '1%', usersUp: true,
    engagement: '2h 44m', engChange: '3%', engUp: true,
    keyEvents: 4, keyChange: '0%', keyUp: true,
    eventCount: '2,100', evtChange: '1%', evtUp: true,
    chartType: 'donut',
    donutData: [{ name: 'youtube', value: 540, color: '#4DA6FF' }],
    timeData: [
      {d:'6 Apr',v:22,v2:20},{d:'8 Apr',v:28,v2:24},{d:'10 Apr',v:24,v2:22},
      {d:'13 Apr',v:20,v2:22},{d:'15 Apr',v:32,v2:28},{d:'17 Apr',v:26,v2:24},
      {d:'20 Apr',v:22,v2:20},{d:'22 Apr',v:18,v2:20},{d:'27 Apr',v:14,v2:16},
    ],
  },
  'paid-social': {
    views: 7921, viewsChange: '39%', viewsUp: false,
    sessions: 8288, sessChange: '7.62%', sessUp: true,
    users: 7972, usersChange: '22%', usersUp: true,
    engagement: '5h 37m 40s', engChange: '89%', engUp: false,
    keyEvents: 9, keyChange: '97%', keyUp: false,
    eventCount: '36,718', evtChange: '53%', evtUp: false,
    chartType: 'bar',
    barData: [
      { name: 'facebook',  value: 4200, color: '#4DA6FF' },
      { name: 'instagram', value: 2800, color: '#4CAF82' },
      { name: 'linkedin',  value: 620,  color: '#F9B62A' },
      { name: 'twitter',   value: 301,  color: '#A8D8FF' },
    ],
    timeData: [
      {d:'6 Apr',v:320,v2:420},{d:'8 Apr',v:280,v2:380},{d:'10 Apr',v:310,v2:360},
      {d:'13 Apr',v:260,v2:340},{d:'15 Apr',v:380,v2:320},{d:'17 Apr',v:290,v2:300},
      {d:'20 Apr',v:340,v2:280},{d:'22 Apr',v:310,v2:260},{d:'27 Apr',v:260,v2:240},
    ],
  },
}

function fmt(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(2) + ' M'
  if (n >= 1000) return (n / 1000).toFixed(1) + ' K'
  return n.toLocaleString()
}

function Change({ val, up }: { val: string; up: boolean }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: up ? '#22c55e' : '#ef4444' }}>
      {up ? '▲' : '▼'} {val}
    </span>
  )
}

export default function DrillDownPanel({ clientName = 'Atlanta BeltLine Website', onClose }: DrillDownPanelProps) {
  const [activeChannel, setActiveChannel] = useState('all')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['ga4', 'Acquisition']))

  function toggleGroup(key: string) {
    setExpandedGroups(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n })
  }

  const cd = CHANNEL_DATA[activeChannel] || CHANNEL_DATA['all']
  const activeLabel = CHANNELS.find(c => c.id === activeChannel)?.label || 'All Channels'

  function LeftNav() {
    return (
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
        <button onClick={() => toggleGroup('ga4')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' as const }}>
          <span style={{ fontSize: 14 }}>📊</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', flex: 1 }}>Google Analytics 4</span>
          <ChevronDown size={12} style={{ color: '#999', transform: expandedGroups.has('ga4') ? 'rotate(0deg)' : 'rotate(-90deg)', transition: '0.15s' }}/>
        </button>

        {expandedGroups.has('ga4') && <>
          {/* Acquisition */}
          <button onClick={() => toggleGroup('Acquisition')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px 7px 28px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' as const }}>
            <ChevronDown size={11} style={{ color: '#888', transform: expandedGroups.has('Acquisition') ? 'rotate(0deg)' : 'rotate(-90deg)', transition: '0.15s' }}/>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>Acquisition</span>
          </button>
          {expandedGroups.has('Acquisition') && CHANNELS.map(ch => (
            <button key={ch.id} onClick={() => setActiveChannel(ch.id)} style={{ width: '100%', textAlign: 'left' as const, padding: '7px 16px 7px 44px', fontSize: 13, cursor: 'pointer', border: 'none', borderLeft: activeChannel === ch.id ? '2px solid #48b5ea' : '2px solid transparent', background: activeChannel === ch.id ? '#f0f7ff' : 'transparent', color: activeChannel === ch.id ? '#1a85c8' : '#555', fontWeight: activeChannel === ch.id ? 600 : 400 }}>
              {ch.label}
            </button>
          ))}

          {/* Audience */}
          <button onClick={() => toggleGroup('Audience')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px 7px 28px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' as const }}>
            <ChevronRight size={11} style={{ color: '#888', transform: expandedGroups.has('Audience') ? 'rotate(90deg)' : 'none', transition: '0.15s' }}/>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>Audience</span>
          </button>
          {expandedGroups.has('Audience') && AUDIENCE_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActiveChannel(item.id)} style={{ width: '100%', textAlign: 'left' as const, padding: '7px 16px 7px 44px', fontSize: 13, cursor: 'pointer', border: 'none', background: 'transparent', color: '#555' }}>
              {item.label}
            </button>
          ))}

          {/* Conversions */}
          <button onClick={() => toggleGroup('Conversions')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px 7px 28px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' as const }}>
            <ChevronRight size={11} style={{ color: '#888' }}/><span style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>Conversions</span>
          </button>

          {/* Pages */}
          <button onClick={() => toggleGroup('Pages')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px 7px 28px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' as const }}>
            <ChevronRight size={11} style={{ color: '#888' }}/><span style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>Pages</span>
          </button>

          {/* Events */}
          <button onClick={() => toggleGroup('Events')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px 7px 28px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' as const }}>
            <ChevronRight size={11} style={{ color: '#888' }}/><span style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>Events</span>
          </button>
        </>}

        <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <span style={{ fontSize: 14 }}>📱</span><span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', flex: 1 }}>Social</span><ChevronRight size={12} style={{ color: '#999' }}/>
        </button>
        <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <span style={{ fontSize: 14 }}>💰</span><span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', flex: 1 }}>Paid Ads</span><ChevronRight size={12} style={{ color: '#999' }}/>
        </button>
      </div>
    )
  }

  function RightChart() {
    if (cd.chartType === 'donut' && cd.donutData) {
      const total = cd.donutData.reduce((s, d) => s + d.value, 0)
      return (
        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: '#555' }}>Views</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>{fmt(cd.views)}</span>
              <Change val={cd.viewsChange} up={cd.viewsUp}/>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={cd.donutData} cx="50%" cy="50%" innerRadius={56} outerRadius={84} dataKey="value">
                    {cd.donutData.map((d, i) => <Cell key={i} fill={d.color}/>)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} formatter={(v: number) => [v.toLocaleString(), '']}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 20, fontWeight: 700 }}>{fmt(total)}</span>
                <span style={{ fontSize: 10, color: '#999' }}>Views</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {cd.donutData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }}/>
                  <span style={{ fontSize: 12, color: '#333', flex: 1 }}>{d.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{d.value >= 1000 ? fmt(d.value) : d.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
    if (cd.chartType === 'bar' && cd.barData) {
      return (
        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: '#555' }}>Views</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>{fmt(cd.views)}</span>
              <Change val={cd.viewsChange} up={cd.viewsUp}/>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb' }}><MoreHorizontal size={14}/></button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cd.barData} barSize={28}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#999' }}/>
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} tickFormatter={(v: number) => v >= 1000 ? (v/1000)+'K' : String(v)}/>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} formatter={(v: number) => [v.toLocaleString(), 'Views']}/>
              <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                {cd.barData.map((d, i) => <Cell key={i} fill={d.color}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end' }} onClick={onClose}>
      <div style={{ width: '88%', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', gap: 12, background: '#fff', flexShrink: 0 }}>
          <span style={{ fontSize: 14 }}>📊</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{activeLabel}</span>
          <div style={{ background: '#f0f0f0', border: '1px solid #e5e5e5', borderRadius: 6, padding: '4px 12px', fontSize: 12, color: '#333' }}>
            Account is <strong>{clientName}</strong>
          </div>
          <button style={{ background: '#f5f5f5', border: '1px solid #e5e5e5', borderRadius: 6, padding: '4px 12px', fontSize: 12, color: '#333', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Plus size={11}/> Add Filter
          </button>
          <button style={{ background: 'none', border: 'none', fontSize: 12, color: '#999', cursor: 'pointer' }}>Clear All</button>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}><X size={18}/></button>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left nav */}
          <div style={{ width: 220, minWidth: 220, borderRight: '1px solid #e5e5e5', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <LeftNav/>
          </div>

          {/* Main content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: '#f8f9fa' }}>
            {/* Top two charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {/* Area chart */}
              <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: '#555' }}>Views</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{fmt(cd.views)}</span>
                    <Change val={cd.viewsChange} up={cd.viewsUp}/>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={cd.timeData}>
                    <defs>
                      <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#48b5ea" stopOpacity={0.2}/><stop offset="95%" stopColor="#48b5ea" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a8d8ff" stopOpacity={0.15}/><stop offset="95%" stopColor="#a8d8ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }}/>
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} tickFormatter={(v: number) => v >= 1000 ? (v/1000)+'K' : String(v)}/>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }}/>
                    <Area type="monotone" dataKey="v"  stroke="#48b5ea" fill="url(#ag1)" strokeWidth={2} name="This period"/>
                    <Area type="monotone" dataKey="v2" stroke="#a8d8ff" fill="url(#ag2)" strokeWidth={1.5} strokeDasharray="4 2" name="Prev period"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <RightChart/>
            </div>

            {/* KPI row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
              {[
                { label: 'Sessions',        val: cd.sessions >= 1000 ? fmt(cd.sessions) : cd.sessions.toLocaleString(), change: cd.sessChange,  up: cd.sessUp,  hl: false },
                { label: 'Total Users',     val: cd.users >= 1000    ? fmt(cd.users)    : cd.users.toLocaleString(),    change: cd.usersChange, up: cd.usersUp, hl: false },
                { label: 'User Engagement', val: cd.engagement,                                                          change: cd.engChange,   up: cd.engUp,   hl: false },
                { label: 'Views',           val: fmt(cd.views),                                                          change: cd.viewsChange, up: cd.viewsUp, hl: true  },
              ].map(k => (
                <div key={k.label} style={{ background: '#fff', border: `${k.hl ? 2 : 1}px solid ${k.hl ? '#48b5ea' : '#e5e5e5'}`, borderRadius: 8, padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: '#555' }}>{k.label}</span>
                    {k.hl
                      ? <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb' }}><MoreHorizontal size={14}/></button>
                      : <Change val={k.change} up={k.up}/>
                    }
                  </div>
                  <p style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.5px', lineHeight: 1.2 }}>{k.val}</p>
                  {k.hl && <div style={{ marginTop: 6 }}><Change val={k.change} up={k.up}/></div>}
                </div>
              ))}
            </div>

            {/* KPI row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: 'Key Events',       val: cd.keyEvents >= 1000 ? fmt(cd.keyEvents) : cd.keyEvents.toLocaleString(), change: cd.keyChange, up: cd.keyUp, badge: false },
                { label: 'Event Count',      val: cd.eventCount,                                                              change: cd.evtChange, up: cd.evtUp, badge: false },
                { label: 'Total Purchasers', val: '0',                                                                        change: '0%',         up: true,     badge: true  },
              ].map(k => (
                <div key={k.label} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: '#555' }}>{k.label}</span>
                    {k.badge
                      ? <span style={{ fontSize: 11, fontWeight: 600, color: '#999', background: '#f0f0f0', padding: '2px 6px', borderRadius: 4 }}>0%</span>
                      : <Change val={k.change} up={k.up}/>
                    }
                  </div>
                  <p style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.5px' }}>{k.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
