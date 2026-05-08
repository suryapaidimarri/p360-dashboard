'use client'
import { useState } from 'react'
import { X, Plus, MoreHorizontal, ChevronRight, ChevronDown } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

// ── Types ────────────────────────────────────────────────────────────────────
interface DrillDownPanelProps {
  clientName?: string
  ga4Data?: any
  sessionData?: any[]
  sourceData?: any[]
  onClose: () => void
}

// ── Nav tree structure ────────────────────────────────────────────────────────
const NAV_TREE = [
  {
    label: 'Google Analytics 4',
    icon: '📊',
    children: [
      {
        label: 'Acquisition',
        children: [
          { label: 'All', id: 'acq-all' },
          { label: 'Organic Search', id: 'acq-organic' },
          { label: 'Paid Search', id: 'acq-paid' },
          { label: 'Direct', id: 'acq-direct' },
          { label: 'Social', id: 'acq-social' },
          { label: 'Referral', id: 'acq-referral' },
          { label: 'Display', id: 'acq-display' },
          { label: 'Email', id: 'acq-email' },
          { label: 'Video', id: 'acq-video' },
        ]
      },
      {
        label: 'Audience',
        children: [
          { label: 'Location', id: 'aud-location' },
          { label: 'Language', id: 'aud-language' },
          { label: 'Age', id: 'aud-age' },
          { label: 'Gender', id: 'aud-gender' },
          { label: 'Devices', id: 'aud-devices' },
          { label: 'Browser', id: 'aud-browser' },
          { label: 'Operating System', id: 'aud-os' },
          { label: 'Interests', id: 'aud-interests' },
          { label: 'New vs Returning', id: 'aud-new-returning' },
        ]
      },
      {
        label: 'Conversions',
        children: [
          { label: 'All Goals', id: 'conv-all' },
          { label: 'Key Events', id: 'conv-key' },
        ]
      },
      {
        label: 'Pages',
        children: [
          { label: 'All Pages', id: 'pages-all' },
          { label: 'Landing Pages', id: 'pages-landing' },
          { label: 'Exit Pages', id: 'pages-exit' },
        ]
      },
      {
        label: 'Events',
        children: [
          { label: 'All Events', id: 'events-all' },
        ]
      },
    ]
  },
  {
    label: 'Social',
    icon: '📱',
    children: []
  },
  {
    label: 'Paid Ads',
    icon: '💰',
    children: []
  },
]

// ── Static fallback data ──────────────────────────────────────────────────────
const DEFAULT_SESSION_DATA = [
  {d:'6 Apr',v:7500,v2:6800},{d:'8 Apr',v:9200,v2:8100},{d:'10 Apr',v:10500,v2:9600},
  {d:'13 Apr',v:8800,v2:9200},{d:'15 Apr',v:11200,v2:10800},{d:'17 Apr',v:9600,v2:8900},
  {d:'20 Apr',v:12400,v2:11200},{d:'22 Apr',v:11800,v2:10500},{d:'24 Apr',v:10200,v2:9100},
  {d:'27 Apr',v:8900,v2:7600},{d:'29 Apr',v:7200,v2:6800},{d:'1 May',v:6500,v2:6200},
]

const DEFAULT_SOURCE_DATA = [
  { name: 'Organic Search', value: 152328, color: '#4DA6FF' },
  { name: 'Direct', value: 50441, color: '#4CAF82' },
  { name: 'Paid Search', value: 11350, color: '#F9B62A' },
  { name: 'Organic Social', value: 10032, color: '#A8D8FF' },
  { name: 'Referral', value: 8653, color: '#CE93D8' },
  { name: 'Paid Social', value: 7921, color: '#FFB74D' },
  { name: 'Unassigned', value: 1311, color: '#B0BEC5' },
  { name: 'Email', value: 733, color: '#80CBC4' },
]

const CHANNEL_TABLE_DATA = [
  { channel: 'Organic Search', sessions: 68639, sessChange: '+7.11%', sessUp: true, users: 44985, usersChange: '+7.64%', usersUp: true, engagement: '44d 8h 39m 25s', engChange: '+4.75%', engUp: true, views: 152328, viewsChange: '+5.26%', viewsUp: true, keyEvents: 2368, keyChange: '-11%', keyUp: false, eventCount: 998510, evtChange: '+5.00%', evtUp: true },
  { channel: 'Direct', sessions: 30294, sessChange: '-15%', sessUp: false, users: 24614, usersChange: '-16%', usersUp: false, engagement: '12d 21h 3m 39s', engChange: '-7.43%', engUp: false, views: 50441, viewsChange: '-9.86%', viewsUp: false, keyEvents: 596, keyChange: '-26%', keyUp: false, eventCount: 295939, evtChange: '-9.10%', evtUp: false },
  { channel: 'Paid Social', sessions: 8288, sessChange: '+7.62%', sessUp: true, users: 7972, usersChange: '+22%', usersUp: true, engagement: '5h 37m 40s', engChange: '-89%', engUp: false, views: 7921, viewsChange: '-39%', viewsUp: false, keyEvents: 9, keyChange: '-97%', keyUp: false, eventCount: 36718, evtChange: '-53%', evtUp: false },
  { channel: 'Organic Social', sessions: 6570, sessChange: '+24%', sessUp: true, users: 5587, usersChange: '+21%', usersUp: true, engagement: '2d 13h 51m 18s', engChange: '+11%', engUp: true, views: 10032, viewsChange: '-7.43%', viewsUp: false, keyEvents: 179, keyChange: '-25%', keyUp: false, eventCount: 63071, evtChange: '-13%', evtUp: false },
  { channel: 'Referral', sessions: 4079, sessChange: '-8%', sessUp: false, users: 3200, usersChange: '-5%', usersUp: false, engagement: '1d 4h 20m', engChange: '+2%', engUp: true, views: 8653, viewsChange: '-3%', viewsUp: false, keyEvents: 124, keyChange: '-18%', keyUp: false, eventCount: 55440, evtChange: '-4%', evtUp: false },
]

const LOCATION_DATA = [
  { country: 'United States', sessions: 115460, users: 80750, engagement: '65d 14h 32m 25s', views: 224751, keyEvents: 3509 },
  { country: 'Singapore', sessions: 1689, users: 1420, engagement: '18h 12m', views: 3200, keyEvents: 45 },
  { country: 'United Kingdom', sessions: 980, users: 820, engagement: '12h 44m', views: 1890, keyEvents: 32 },
  { country: 'Canada', sessions: 760, users: 640, engagement: '9h 22m', views: 1450, keyEvents: 28 },
  { country: 'Germany', sessions: 440, users: 380, engagement: '5h 10m', views: 820, keyEvents: 12 },
  { country: 'India', sessions: 390, users: 350, engagement: '4h 45m', views: 740, keyEvents: 9 },
  { country: 'Netherlands', sessions: 310, users: 280, engagement: '3h 58m', views: 595, keyEvents: 7 },
  { country: 'China', sessions: 339, users: 290, engagement: '4h 12m', views: 620, keyEvents: 5 },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(2) + ' M'
  if (n >= 1000) return (n / 1000).toFixed(1) + ' K'
  return n.toLocaleString()
}

function Change({ val, up }: { val: string; up: boolean }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700,
      color: up ? '#22c55e' : '#ef4444',
    }}>
      {up ? '▲' : '▼'} {val}
    </span>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DrillDownPanel({
  clientName = 'Atlanta BeltLine Website',
  ga4Data,
  sessionData,
  sourceData,
  onClose,
}: DrillDownPanelProps) {
  const [activeNav, setActiveNav] = useState('acq-all')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(['Google Analytics 4', 'Acquisition'])
  )
  const [locationTab, setLocationTab] = useState<'Country' | 'Region' | 'City'>('Country')
  const [tableSearch, setTableSearch] = useState('')

  const chartData = sessionData || DEFAULT_SESSION_DATA
  const donutData = sourceData?.length ? sourceData : DEFAULT_SOURCE_DATA
  const totalViews = donutData.reduce((s: number, d: any) => s + (d.value || 0), 0)

  const sessions = ga4Data?.timeSeries?.totals?.[0]?.metricValues?.[0]?.value
  const totalUsers = ga4Data?.timeSeries?.totals?.[0]?.metricValues?.[1]?.value
  const keyEvents = ga4Data?.timeSeries?.totals?.[0]?.metricValues?.[2]?.value

  const isLocation = activeNav === 'aud-location'

  function toggleGroup(label: string) {
    setExpandedGroups(prev => {
      const n = new Set(prev)
      n.has(label) ? n.delete(label) : n.add(label)
      return n
    })
  }

  // ── Left nav ─────────────────────────────────────────────────────────────
  function NavTree() {
    return (
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
        {NAV_TREE.map(source => (
          <div key={source.label}>
            {/* Source header */}
            <button
              onClick={() => toggleGroup(source.label)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 14 }}>{source.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', flex: 1 }}>{source.label}</span>
              <ChevronDown size={12} style={{
                color: '#999',
                transform: expandedGroups.has(source.label) ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: '0.15s',
              }}/>
            </button>

            {expandedGroups.has(source.label) && source.children.map(group => (
              <div key={group.label}>
                {/* Group header */}
                <button
                  onClick={() => toggleGroup(group.label)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 16px 7px 28px', background: 'none', border: 'none',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <ChevronRight size={11} style={{
                    color: '#888',
                    transform: expandedGroups.has(group.label) ? 'rotate(90deg)' : 'none',
                    transition: '0.15s',
                  }}/>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>{group.label}</span>
                </button>

                {expandedGroups.has(group.label) && group.children?.map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.id)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '6px 16px 6px 44px',
                      fontSize: 13, cursor: 'pointer', border: 'none',
                      background: activeNav === item.id ? '#f0f0f0' : 'transparent',
                      color: activeNav === item.id ? '#1a1a1a' : '#555',
                      fontWeight: activeNav === item.id ? 600 : 400,
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  // ── Acquisition view ──────────────────────────────────────────────────────
  function AcquisitionView() {
    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: '#f8f9fa' }}>
        {/* Top two charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Line chart */}
          <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: '#555' }}>Views</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>{fmt(totalViews)}</span>
                <Change val="1.91%" up={false}/>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb' }}>
                  <MoreHorizontal size={14}/>
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="areaGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#48b5ea" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#48b5ea" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="areaGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a8d8ff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#a8d8ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} tickFormatter={v => v >= 1000 ? (v/1000)+'K' : v}/>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #e5e5e5' }}/>
                <Area type="monotone" dataKey="v" stroke="#48b5ea" fill="url(#areaGrad1)" strokeWidth={2} name="This period"/>
                <Area type="monotone" dataKey="v2" stroke="#a8d8ff" fill="url(#areaGrad2)" strokeWidth={1.5} strokeDasharray="4 2" name="Previous period"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Donut chart */}
          <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: '#555' }}>Views</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>{fmt(totalViews)}</span>
                <Change val="1.91%" up={false}/>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} cx="50%" cy="50%" innerRadius={54} outerRadius={82} dataKey="value">
                      {donutData.map((d: any, i: number) => (
                        <Cell key={i} fill={d.color || ['#4DA6FF','#4CAF82','#F9B62A','#A8D8FF','#CE93D8','#FFB74D','#B0BEC5','#80CBC4'][i % 8]}/>
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} formatter={(v: number) => [v.toLocaleString(), '']}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 20, fontWeight: 700 }}>{fmt(totalViews)}</span>
                  <span style={{ fontSize: 10, color: '#999' }}>Views</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                {donutData.map((d: any, i: number) => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color || '#999', flexShrink: 0 }}/>
                    <span style={{ fontSize: 12, color: '#333', flex: 1 }}>{d.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{d.value >= 1000 ? (d.value/1000).toFixed(0)+'K' : d.value?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* KPI cards row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Sessions', val: sessions ? parseInt(sessions).toLocaleString() : '120.5 K', change: '0.35%', up: false },
            { label: 'Total Users', val: totalUsers ? parseInt(totalUsers).toLocaleString() : '88,069', change: '0.69%', up: true },
            { label: 'User Engagement', val: '66d 21h 22m 49s', change: '1.65%', up: false },
            { label: 'Views', val: fmt(totalViews), change: '1.91%', up: false, highlight: true },
          ].map(k => (
            <div key={k.label} style={{
              background: '#fff',
              border: `1px solid ${(k as any).highlight ? '#48b5ea' : '#e5e5e5'}`,
              borderWidth: (k as any).highlight ? 2 : 1,
              borderRadius: 8, padding: '16px 20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#555' }}>{k.label}</span>
                <Change val={k.change} up={k.up}/>
              </div>
              <p style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.5px', lineHeight: 1.1 }}>{k.val}</p>
            </div>
          ))}
        </div>

        {/* KPI cards row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Key Events', val: keyEvents ? parseInt(keyEvents).toLocaleString() : '3,610', change: '21%', up: false },
            { label: 'Event Count', val: '1.54 M', change: '2.67%', up: false },
            { label: 'Total Purchasers', val: '0', change: '0%', up: true },
          ].map(k => (
            <div key={k.label} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#555' }}>{k.label}</span>
                <Change val={k.change} up={k.up}/>
              </div>
              <p style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.5px' }}>{k.val}</p>
            </div>
          ))}
        </div>

        {/* Data table */}
        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ fontSize: 13, color: '#555' }}>Showing {CHANNEL_TABLE_DATA.length} of {CHANNEL_TABLE_DATA.length} Rows</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                value={tableSearch} onChange={e => setTableSearch(e.target.value)}
                placeholder="Search"
                style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: 6, padding: '5px 10px', fontSize: 12, outline: 'none', width: 160 }}
              />
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb' }}><MoreHorizontal size={14}/></button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                  {['CHANNEL', 'SESSIONS ↓', 'TOTAL USERS', 'USER ENGAGEME...', 'VIEWS', 'KEY EVENTS', 'EVENT COUNT'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: h === 'CHANNEL' ? 'left' : 'right', fontSize: 11, fontWeight: 600, color: '#888', whiteSpace: 'nowrap', background: '#fafafa' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CHANNEL_TABLE_DATA
                  .filter(r => r.channel.toLowerCase().includes(tableSearch.toLowerCase()))
                  .map((row, i) => (
                  <tr key={row.channel} style={{ borderBottom: '1px solid #f8f8f8', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#1a1a1a', whiteSpace: 'nowrap' }}>{row.channel}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{row.sessions.toLocaleString()}</div>
                      <Change val={row.sessChange.replace(/[+-]/,'')} up={row.sessUp}/>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div>{row.users.toLocaleString()}</div>
                      <Change val={row.usersChange.replace(/[+-]/,'')} up={row.usersUp}/>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: '#555' }}>
                      <div style={{ fontSize: 12 }}>{row.engagement}</div>
                      <Change val={row.engChange.replace(/[+-]/,'')} up={row.engUp}/>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div>{row.views.toLocaleString()}</div>
                      <Change val={row.viewsChange.replace(/[+-]/,'')} up={row.viewsUp}/>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div>{row.keyEvents.toLocaleString()}</div>
                      <Change val={row.keyChange.replace(/[+-]/,'')} up={row.keyUp}/>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div>{row.eventCount.toLocaleString()}</div>
                      <Change val={row.evtChange.replace(/[+-]/,'')} up={row.evtUp}/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // ── Location view ─────────────────────────────────────────────────────────
  function LocationView() {
    // Country bar data for the bar chart
    const barData = LOCATION_DATA.slice(0, 8).map(d => ({ name: d.country.slice(0, 6) + '...', v: d.sessions }))

    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: '#f8f9fa' }}>
        {/* Top two charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* World map placeholder */}
          <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#555' }}>Views</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{fmt(totalViews)}</span>
                <Change val="1.91%" up={false}/>
              </div>
            </div>
            {/* Simplified world map SVG */}
            <div style={{ width: '100%', height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', borderRadius: 6, position: 'relative', overflow: 'hidden' }}>
              <svg viewBox="0 0 800 400" style={{ width: '100%', height: '100%' }}>
                {/* Simplified continent shapes */}
                {/* North America */}
                <path d="M 80 80 L 180 70 L 220 100 L 210 180 L 170 220 L 120 200 L 80 160 Z" fill="#4DA6FF" opacity="0.8"/>
                {/* South America */}
                <path d="M 150 240 L 200 230 L 220 300 L 200 370 L 160 380 L 140 320 Z" fill="#c8e6ff" opacity="0.6"/>
                {/* Europe */}
                <path d="M 340 60 L 420 55 L 440 100 L 400 130 L 350 120 L 330 90 Z" fill="#c8e6ff" opacity="0.5"/>
                {/* Africa */}
                <path d="M 360 150 L 420 140 L 450 220 L 430 320 L 380 330 L 350 250 L 340 180 Z" fill="#c8e6ff" opacity="0.4"/>
                {/* Asia */}
                <path d="M 450 50 L 650 45 L 680 130 L 600 200 L 480 190 L 440 130 Z" fill="#c8e6ff" opacity="0.4"/>
                {/* US highlighted darker */}
                <path d="M 85 100 L 175 90 L 200 130 L 190 175 L 140 185 L 90 155 Z" fill="#2196f3" opacity="0.7"/>
                {/* Australia */}
                <path d="M 600 260 L 680 255 L 700 320 L 660 350 L 600 340 L 580 290 Z" fill="#c8e6ff" opacity="0.4"/>
              </svg>
              <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: 11 }}>
                United States · Views 224,751
              </div>
            </div>
          </div>

          {/* Bar chart by country */}
          <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#555' }}>Views</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{fmt(totalViews)}</span>
                <Change val="1.91%" up={false}/>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb' }}><MoreHorizontal size={14}/></button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barSize={32}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} tickFormatter={v => v >= 1000 ? (v/1000)+'K' : v}/>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} formatter={(v: number) => [v.toLocaleString(), 'Views']}/>
                <Bar dataKey="v" radius={[3, 3, 0, 0]}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#4DA6FF' : '#c8e6ff'}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPI cards row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Sessions', val: sessions ? parseInt(sessions).toLocaleString() : '120.5 K', change: '0.35%', up: false },
            { label: 'Total Users', val: totalUsers ? parseInt(totalUsers).toLocaleString() : '88,069', change: '0.69%', up: true },
            { label: 'User Engagement', val: '66d 21h 22m', change: '1.65%', up: false },
            { label: 'Views', val: fmt(totalViews), change: '1.91%', up: false, highlight: true },
          ].map(k => (
            <div key={k.label} style={{
              background: '#fff',
              border: `${(k as any).highlight ? 2 : 1}px solid ${(k as any).highlight ? '#48b5ea' : '#e5e5e5'}`,
              borderRadius: 8, padding: '16px 20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#555' }}>{k.label}</span>
                <Change val={k.change} up={k.up}/>
              </div>
              <p style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.5px', lineHeight: 1.2 }}>{k.val}</p>
            </div>
          ))}
        </div>

        {/* Location data table */}
        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['Country', 'Region', 'City'] as const).map(t => (
                <button key={t} onClick={() => setLocationTab(t)} style={{
                  padding: '5px 14px', fontSize: 13, borderRadius: 6, cursor: 'pointer', border: 'none',
                  background: locationTab === t ? '#48b5ea' : '#f0f0f0',
                  color: locationTab === t ? '#fff' : '#555',
                  fontWeight: locationTab === t ? 600 : 400,
                }}>{t}</button>
              ))}
              <span style={{ fontSize: 12, color: '#999', alignSelf: 'center', marginLeft: 8 }}>Showing 50 of 133 Rows</span>
            </div>
            <input placeholder="Search" style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: 6, padding: '5px 10px', fontSize: 12, outline: 'none', width: 160 }}/>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#888' }}>
                    {locationTab.toUpperCase()}
                  </th>
                  {['SESSIONS ↓', 'TOTAL USERS', 'USER ENGAGEME...', 'VIEWS', 'KEY EVENTS'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'right', fontSize: 11, fontWeight: 600, color: '#888', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LOCATION_DATA.map((row, i) => (
                  <tr key={row.country} style={{ borderBottom: '1px solid #f8f8f8', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{row.country}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>{row.sessions.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>{row.users.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, color: '#555' }}>{row.engagement}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>{row.views.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>{row.keyEvents.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // ── Get active section label ───────────────────────────────────────────────
  function getActiveLabel() {
    if (activeNav.startsWith('acq')) return 'All Channels'
    if (activeNav === 'aud-location') return 'Location'
    for (const src of NAV_TREE) {
      for (const grp of src.children) {
        const match = (grp.children as any[])?.find((c: any) => c.id === activeNav)
        if (match) return match.label
      }
    }
    return 'All Channels'
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200,
      display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end',
    }} onClick={onClose}>
      <div style={{ width: '88%', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          padding: '12px 20px', borderBottom: '1px solid #e5e5e5',
          display: 'flex', alignItems: 'center', gap: 12, background: '#fff', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* GA4 icon badge */}
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📊</div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{getActiveLabel()}</span>
            <div style={{
              background: '#f0f0f0', border: '1px solid #e5e5e5', borderRadius: 6,
              padding: '4px 12px', fontSize: 12, color: '#333',
            }}>
              Account is <strong>{clientName}</strong>
            </div>
            <button style={{
              background: '#f5f5f5', border: '1px solid #e5e5e5', borderRadius: 6,
              padding: '4px 12px', fontSize: 12, color: '#333', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <Plus size={11}/> Add Filter
            </button>
            <button style={{ background: 'none', border: 'none', fontSize: 12, color: '#999', cursor: 'pointer' }}>Clear All</button>
          </div>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#999' }}>
            <X size={18}/>
          </button>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left nav */}
          <div style={{ width: 220, minWidth: 220, borderRight: '1px solid #e5e5e5', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <NavTree/>
          </div>

          {/* Main content */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {isLocation ? <LocationView/> : <AcquisitionView/>}
          </div>
        </div>
      </div>
    </div>
  )
}
