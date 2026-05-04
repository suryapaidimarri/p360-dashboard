'use client'
import { useState } from 'react'
import { Plus, CheckCircle2, XCircle } from 'lucide-react'

const SOURCES = [
  { name: 'Google Analytics 4', type: 'Analytics', account: 'Agency Main', id: 'UA-29384710', clients: 48, connected: true, color: '#f59e0b' },
  { name: 'Google Ads', type: 'Advertising', account: 'P360 Ads', id: 'ADS-7741029', clients: 32, connected: true, color: '#4285f4' },
  { name: 'Google Search Console', type: 'SEO', account: 'Agency GSC', id: 'GSC-1029384', clients: 55, connected: true, color: '#34a853' },
  { name: 'Facebook Ads', type: 'Advertising', account: 'P360 Meta', id: 'FB-88291047', clients: 29, connected: true, color: '#1877f2' },
  { name: 'LinkedIn Ads', type: 'Advertising', account: 'P360 LinkedIn', id: 'LI-99102847', clients: 18, connected: true, color: '#0a66c2' },
  { name: 'Semrush', type: 'SEO', account: 'Agency Pro', id: 'SEM-4728190', clients: 40, connected: false, color: '#ff642d' },
  { name: 'StackAdapt', type: 'Programmatic', account: 'P360 SA', id: 'SA-1827364', clients: 12, connected: true, color: '#5c6bc0' },
  { name: 'YouTube', type: 'Social', account: 'Agency YT', id: 'YT-0928374', clients: 22, connected: true, color: '#ff0000' },
  { name: 'Bing Webmaster', type: 'SEO', account: 'P360 Bing', id: 'BW-3847291', clients: 14, connected: true, color: '#00809d' },
]

export default function DataSourcesPage() {
  const [sources, setSources] = useState(SOURCES)

  function toggleSource(id: string) {
    setSources(prev => prev.map(s => s.id === id ? { ...s, connected: !s.connected } : s))
  }

  return (
    <>
      <div className="flex items-center gap-3 px-6 py-3.5 border-b border-white/[0.05] bg-bg-base shrink-0">
        <div>
          <span className="text-sm font-medium text-text-primary">Data Sources</span>
          <span className="text-xs text-text-hint ml-2">— {sources.filter(s => s.connected).length} connected</span>
        </div>
        <button className="ml-auto flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-medium px-3.5 py-1.5 rounded-lg transition-all">
          <Plus size={13} /> Connect Data Source
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="card-surface overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.05]">
                <th className="text-left px-4 py-3 text-text-hint font-medium uppercase tracking-wider text-[10px]">Integration</th>
                <th className="text-left px-4 py-3 text-text-hint font-medium uppercase tracking-wider text-[10px]">Type</th>
                <th className="text-left px-4 py-3 text-text-hint font-medium uppercase tracking-wider text-[10px]">Account</th>
                <th className="text-left px-4 py-3 text-text-hint font-medium uppercase tracking-wider text-[10px]">Account ID</th>
                <th className="text-center px-4 py-3 text-text-hint font-medium uppercase tracking-wider text-[10px]">Clients</th>
                <th className="text-center px-4 py-3 text-text-hint font-medium uppercase tracking-wider text-[10px]">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {sources.map(src => (
                <tr key={src.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: src.color + '22', border: `1px solid ${src.color}40`, color: src.color }}>
                        {src.name[0]}
                      </div>
                      <span className="font-medium text-text-primary">{src.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-hint">{src.type}</td>
                  <td className="px-4 py-3 text-text-secondary">{src.account}</td>
                  <td className="px-4 py-3 font-mono text-text-hint text-[10px]">{src.id}</td>
                  <td className="px-4 py-3 text-center text-text-secondary">{src.clients}</td>
                  <td className="px-4 py-3 text-center">
                    {src.connected
                      ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400"><CheckCircle2 size={9} />Connected</span>
                      : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-white/[0.05] text-text-hint"><XCircle size={9} />Disconnected</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => toggleSource(src.id)}
                      className="text-[10px] px-2.5 py-1 rounded-md border border-white/[0.08] text-text-hint hover:text-text-secondary hover:border-white/20 transition-all">
                      {src.connected ? 'Manage' : 'Connect'}
                    </button>
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
