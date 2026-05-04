'use client'
import { useState } from 'react'
import { Plus, Send, Clock, CheckCircle2 } from 'lucide-react'

const REPORTS = [
  { id: '1', client: 'Acme Corp', title: 'Monthly Performance Report', type: 'monthly', lastSent: '2024-04-01', status: 'sent', color: '#6366f1' },
  { id: '2', client: 'BrightMed', title: 'SEO & Organic Report', type: 'monthly', lastSent: '2024-04-01', status: 'sent', color: '#8b5cf6' },
  { id: '3', client: 'CloudBase', title: 'Paid Ads Summary', type: 'weekly', lastSent: '2024-04-22', status: 'sent', color: '#0ea5e9' },
  { id: '4', client: 'DeltaRetail', title: 'Monthly Performance Report', type: 'monthly', lastSent: null, status: 'pending', color: '#f59e0b' },
  { id: '5', client: 'EcoFinance', title: 'Full Channel Report', type: 'monthly', lastSent: '2024-03-01', status: 'sent', color: '#10b981' },
]

export default function ReportsPage() {
  return (
    <>
      <div className="flex items-center gap-3 px-6 py-3.5 border-b border-white/[0.05] bg-bg-base shrink-0">
        <span className="text-sm font-medium text-text-primary">Reports</span>
        <button className="ml-auto flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-medium px-3.5 py-1.5 rounded-lg transition-all">
          <Plus size={13} /> New Report
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Reports Sent', value: '142', sub: 'this month' },
            { label: 'Scheduled', value: '60', sub: 'monthly auto-send' },
            { label: 'Pending', value: '4', sub: 'need attention' },
          ].map(s => (
            <div key={s.label} className="card-surface p-4">
              <p className="text-[10px] text-text-hint uppercase tracking-wider mb-2">{s.label}</p>
              <p className="text-2xl font-semibold text-text-primary">{s.value}</p>
              <p className="text-[10px] text-text-hint mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="card-surface overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.05]">
                <th className="text-left px-4 py-3 text-text-hint font-medium uppercase tracking-wider text-[10px]">Client</th>
                <th className="text-left px-4 py-3 text-text-hint font-medium uppercase tracking-wider text-[10px]">Report</th>
                <th className="text-left px-4 py-3 text-text-hint font-medium uppercase tracking-wider text-[10px]">Schedule</th>
                <th className="text-left px-4 py-3 text-text-hint font-medium uppercase tracking-wider text-[10px]">Last Sent</th>
                <th className="text-center px-4 py-3 text-text-hint font-medium uppercase tracking-wider text-[10px]">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {REPORTS.map(r => (
                <tr key={r.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-semibold"
                        style={{ background: r.color + '22', color: r.color }}>
                        {r.client[0]}
                      </div>
                      <span className="text-text-primary font-medium">{r.client}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{r.title}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-accent/10 text-accent-text capitalize">{r.type}</span>
                  </td>
                  <td className="px-4 py-3 text-text-hint font-mono text-[10px]">{r.lastSent ?? '—'}</td>
                  <td className="px-4 py-3 text-center">
                    {r.status === 'sent'
                      ? <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400"><CheckCircle2 size={9} />Sent</span>
                      : <span className="inline-flex items-center gap-1 text-[10px] text-amber-400"><Clock size={9} />Pending</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-md border border-white/[0.08] text-text-hint hover:bg-accent/10 hover:text-accent-text hover:border-accent/30 transition-all">
                      <Send size={9} /> Send now
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
