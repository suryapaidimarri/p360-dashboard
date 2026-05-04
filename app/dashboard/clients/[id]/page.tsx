'use client'
import { useState } from 'react'
import { ArrowLeft, Share2, Plus, Calendar } from 'lucide-react'
import Link from 'next/link'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'

const SESSIONS_DATA = [
  { m: 'Jan', v: 38000 }, { m: 'Feb', v: 52000 }, { m: 'Mar', v: 45000 },
  { m: 'Apr', v: 68000 }, { m: 'May', v: 74000 }, { m: 'Jun', v: 61000 },
  { m: 'Jul', v: 79000 }, { m: 'Aug', v: 84200 },
]

const TRAFFIC = [
  { name: 'Organic', value: 45, color: '#6366f1' },
  { name: 'Paid', value: 25, color: '#8b5cf6' },
  { name: 'Social', value: 15, color: '#10b981' },
  { name: 'Direct', value: 15, color: '#334155' },
]

const KPIS = [
  { label: 'Sessions', value: '84.2K', change: '+12.4%', up: true },
  { label: 'Conversions', value: '3,841', change: '+8.1%', up: true },
  { label: 'Engagement', value: '64.3%', change: '+3.2%', up: true },
  { label: 'Bounce Rate', value: '38.1%', change: '-1.8%', up: true },
]

const TABS = ['Overview', 'SEO', 'Paid Ads', 'Social', 'Reports']

export default function ClientWorkspace({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('Overview')

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-3.5 border-b border-white/[0.05] bg-bg-base shrink-0">
        <Link href="/dashboard/clients"
          className="flex items-center gap-1.5 text-xs text-text-hint hover:text-text-secondary bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-1.5 transition-all">
          <ArrowLeft size={11} /> Back
        </Link>
        <div className="w-7 h-7 rounded-lg bg-[#1e1b4b] border border-accent/30 flex items-center justify-center text-[10px] font-semibold text-accent-text">
          AC
        </div>
        <span className="text-sm font-medium text-text-primary">Acme Corp</span>

        {/* Tabs */}
        <div className="ml-4 flex gap-0.5 bg-white/[0.04] rounded-lg p-0.5">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-xs transition-all ${activeTab === tab ? 'bg-accent/18 text-accent-text' : 'text-text-hint hover:text-text-secondary'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs text-text-hint bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-1.5 hover:text-text-secondary transition-all">
            <Calendar size={11} /> Last 30 days
          </button>
          <button className="flex items-center gap-1.5 text-xs text-text-hint bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-1.5 hover:text-text-secondary transition-all">
            <Share2 size={11} /> Share
          </button>
          <button className="flex items-center gap-1.5 text-xs bg-accent hover:bg-accent-hover text-white rounded-lg px-3 py-1.5 transition-all">
            <Plus size={11} /> Widget
          </button>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {KPIS.map(kpi => (
            <div key={kpi.label} className="card-surface p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-text-hint uppercase tracking-wider">{kpi.label}</span>
              </div>
              <p className="text-2xl font-semibold text-text-primary tracking-tight">{kpi.value}</p>
              <p className={`text-[10px] mt-1 ${kpi.up ? 'text-emerald-400' : 'text-red-400'}`}>{kpi.change} vs last period</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          {/* Sessions Chart */}
          <div className="col-span-2 card-surface p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-medium text-text-hint uppercase tracking-wider">Sessions over time</span>
              <span className="text-[10px] text-text-hint bg-white/[0.04] px-2 py-0.5 rounded">30d</span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={SESSIONS_DATA} barSize={20}>
                <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: '#0e1120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                  itemStyle={{ color: '#a5b4fc' }}
                  formatter={(v: number) => [v.toLocaleString(), 'Sessions']}
                />
                <Bar dataKey="v" fill="#4f46e5" radius={[3, 3, 0, 0]}
                  label={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Traffic Donut */}
          <div className="card-surface p-4">
            <span className="text-[10px] font-medium text-text-hint uppercase tracking-wider block mb-3">Traffic Sources</span>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={80}>
                <PieChart>
                  <Pie data={TRAFFIC} cx="50%" cy="50%" innerRadius={25} outerRadius={38} dataKey="value" paddingAngle={2}>
                    {TRAFFIC.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full space-y-1.5 mt-2">
                {TRAFFIC.map(t => (
                  <div key={t.name} className="flex items-center gap-2 text-[10px]">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
                    <span className="text-text-hint flex-1">{t.name}</span>
                    <span className="text-text-secondary font-mono">{t.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-3 gap-3">
          {/* Line chart */}
          <div className="col-span-2 card-surface p-4">
            <span className="text-[10px] font-medium text-text-hint uppercase tracking-wider block mb-4">Conversion Trend</span>
            <ResponsiveContainer width="100%" height={90}>
              <LineChart data={SESSIONS_DATA}>
                <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: '#0e1120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }}
                  itemStyle={{ color: '#a5b4fc' }}
                />
                <Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Device breakdown */}
          <div className="card-surface p-4">
            <span className="text-[10px] font-medium text-text-hint uppercase tracking-wider block mb-4">Devices</span>
            <div className="space-y-3">
              {[['Desktop', 58, '#6366f1'], ['Mobile', 34, '#8b5cf6'], ['Tablet', 8, '#a78bfa']].map(([label, pct, color]) => (
                <div key={label as string}>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-text-hint">{label}</span>
                    <span className="text-text-secondary font-mono">{pct}%</span>
                  </div>
                  <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color as string }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
