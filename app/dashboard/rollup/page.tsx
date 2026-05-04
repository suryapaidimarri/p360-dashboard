'use client'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const DATA = [
  { m: 'Jan', sessions: 820000, conversions: 18200 },
  { m: 'Feb', sessions: 932000, conversions: 21000 },
  { m: 'Mar', sessions: 901000, conversions: 19800 },
  { m: 'Apr', sessions: 1140000, conversions: 25600 },
  { m: 'May', sessions: 1320000, conversions: 29100 },
  { m: 'Jun', sessions: 1180000, conversions: 26400 },
  { m: 'Jul', sessions: 1420000, conversions: 31200 },
  { m: 'Aug', sessions: 1560000, conversions: 34100 },
]

export default function RollupPage() {
  return (
    <>
      <div className="flex items-center gap-3 px-6 py-3.5 border-b border-white/[0.05] bg-bg-base shrink-0">
        <span className="text-sm font-medium text-text-primary">Roll-up Dashboard</span>
        <span className="text-xs text-text-hint ml-2">— All 60 clients combined</span>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total Sessions', value: '2.4M', change: '+18.2%' },
            { label: 'Total Conversions', value: '94.1K', change: '+11.4%' },
            { label: 'Avg Engagement', value: '62.4%', change: '+4.2%' },
            { label: 'Avg Bounce', value: '41.2%', change: '-2.1%' },
          ].map(k => (
            <div key={k.label} className="card-surface p-4">
              <p className="text-[10px] text-text-hint uppercase tracking-wider mb-2">{k.label}</p>
              <p className="text-2xl font-semibold text-text-primary tracking-tight">{k.value}</p>
              <p className="text-[10px] text-emerald-400 mt-1">{k.change}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="card-surface p-4">
            <p className="text-[10px] text-text-hint uppercase tracking-wider mb-4">Total Sessions (All Clients)</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={DATA} barSize={22}>
                <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#0e1120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} itemStyle={{ color: '#a5b4fc' }} />
                <Bar dataKey="sessions" fill="#4f46e5" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card-surface p-4">
            <p className="text-[10px] text-text-hint uppercase tracking-wider mb-4">Total Conversions Trend</p>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={DATA}>
                <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#0e1120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} itemStyle={{ color: '#a5b4fc' }} />
                <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  )
}
