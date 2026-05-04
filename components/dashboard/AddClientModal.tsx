'use client'
import { useState } from 'react'
import { X, Loader2, ChevronDown } from 'lucide-react'
import { Client } from '@/types'

const COLORS = ['#6366f1','#8b5cf6','#0ea5e9','#f59e0b','#10b981','#ec4899','#f97316','#a855f7']

interface Props {
  onClose: () => void
  onAdd: (client: Client) => void
}

export default function AddClientModal({ onClose, onAdd }: Props) {
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedColor, setSelectedColor] = useState(COLORS[0])

  async function handleAdd() {
    if (!name.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const newClient: Client = {
      id: Date.now().toString(),
      name: name.trim(),
      domain: domain.trim(),
      logo_url: domain ? `https://logo.clearbit.com/${domain}` : null,
      color: selectedColor,
      status: 'active',
      agency_id: '1',
      platforms: [],
      created_at: new Date().toISOString(),
    }
    setLoading(false)
    onAdd(newClient)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#0e1120] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden animate-scaleIn" onClick={e => e.stopPropagation()}>
        {/* Accent stripe */}
        <div className="h-0.5 bg-accent" />

        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-text-primary">Add new client</h2>
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-text-hint hover:bg-white/[0.06] hover:text-text-secondary transition-all">
              <X size={14} />
            </button>
          </div>
          <p className="text-xs text-text-hint mb-6">Logo and brand details are fetched automatically from the domain.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-medium text-text-hint uppercase tracking-wider mb-2">Client Name</label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Acme Corporation"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder-text-hint outline-none focus:border-accent/50 focus:bg-accent/[0.03] transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-text-hint uppercase tracking-wider mb-2">Website / Domain</label>
              <input value={domain} onChange={e => setDomain(e.target.value)}
                placeholder="e.g. acmecorp.com"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder-text-hint outline-none focus:border-accent/50 focus:bg-accent/[0.03] transition-all" />
            </div>

            {/* Advanced */}
            <button onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-xs text-text-hint hover:text-text-secondary transition-all">
              <ChevronDown size={12} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              Advanced settings
            </button>

            {showAdvanced && (
              <div className="animate-fadeIn">
                <label className="block text-[10px] font-medium text-text-hint uppercase tracking-wider mb-2">Brand Color</label>
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)}
                      className="w-6 h-6 rounded-md transition-all"
                      style={{ background: c, outline: selectedColor === c ? `2px solid white` : 'none', outlineOffset: '2px' }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-7">
            <button onClick={onClose}
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg py-2.5 text-xs text-text-secondary hover:text-text-primary transition-all">
              Cancel
            </button>
            <button onClick={handleAdd} disabled={!name.trim() || loading}
              className="flex-[2] bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium text-xs rounded-lg py-2.5 flex items-center justify-center gap-2 transition-all">
              {loading ? <><Loader2 size={13} className="animate-spin" /> Adding…</> : 'Add Client'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
