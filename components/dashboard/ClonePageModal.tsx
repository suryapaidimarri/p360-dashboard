'use client'
import { useState, useMemo } from 'react'
import { X, Search, ChevronRight, Copy, LayoutGrid, FileText, BarChart2, TrendingUp, Check } from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────

interface Dashboard {
  id: string
  name: string
  client: string
  widgets: number
  lastEdited: string
  preview?: string[] // widget type hints for preview
}

interface ClonePageModalProps {
  onClose: () => void
  onClone?: (source: Dashboard, newName: string) => void
}

// ── Mock data (replace with real fetch) ─────────────────────────────────────

const DASHBOARDS: Dashboard[] = [
  { id: 'd1', client: 'Alloy (internal)',       name: 'Website Performance',   widgets: 8,  lastEdited: '2 days ago',   preview: ['kpi','kpi','line','bar'] },
  { id: 'd2', client: 'Alloy (internal)',       name: 'Paid Media',             widgets: 6,  lastEdited: '4 days ago',   preview: ['kpi','pie','line'] },
  { id: 'd3', client: 'Atlanta Beltline',       name: 'Website Performance',   widgets: 9,  lastEdited: '1 day ago',    preview: ['kpi','kpi','area','bar'] },
  { id: 'd4', client: 'Atlanta Beltline',       name: 'Donations Trend',        widgets: 5,  lastEdited: '1 week ago',   preview: ['kpi','area','pie'] },
  { id: 'd5', client: 'Collaborating Docs',     name: 'Website Performance',   widgets: 7,  lastEdited: '3 days ago',   preview: ['kpi','line','bar'] },
  { id: 'd6', client: 'Collaborating Docs',     name: 'Organic + AI Search',   widgets: 4,  lastEdited: '5 days ago',   preview: ['kpi','table'] },
  { id: 'd7', client: 'DEMO: Grainwise',        name: 'Website Performance',   widgets: 8,  lastEdited: '2 weeks ago',  preview: ['kpi','kpi','area'] },
  { id: 'd8', client: 'DEMO: Grainwise',        name: 'Paid Media',             widgets: 6,  lastEdited: '2 weeks ago',  preview: ['kpi','bar','pie'] },
  { id: 'd9', client: 'Georgia Aquarium',       name: 'Website Performance',   widgets: 11, lastEdited: '6 hours ago',  preview: ['kpi','kpi','kpi','line'] },
  { id: 'd10', client: 'GFVGA',                name: 'Organic + AI Search',   widgets: 5,  lastEdited: '3 days ago',   preview: ['kpi','line'] },
  { id: 'd11', client: 'HHAeXchange',           name: 'Website Performance',   widgets: 9,  lastEdited: '1 day ago',    preview: ['kpi','area','bar'] },
  { id: 'd12', client: 'IOU Financial',         name: 'Paid Media',             widgets: 7,  lastEdited: '4 days ago',   preview: ['kpi','pie','line'] },
  { id: 'd13', client: 'Latapult',              name: 'Website Performance',   widgets: 8,  lastEdited: '1 week ago',   preview: ['kpi','kpi','bar'] },
  { id: 'd14', client: 'Litmos',                name: 'Roll-up Dashboard',      widgets: 12, lastEdited: '2 days ago',   preview: ['kpi','kpi','line','pie'] },
  { id: 'd15', client: 'NCH',                   name: 'Website Performance',   widgets: 7,  lastEdited: '3 days ago',   preview: ['kpi','area'] },
  { id: 'd16', client: 'S&T Bank',              name: 'Paid Media',             widgets: 6,  lastEdited: '1 week ago',   preview: ['kpi','bar','pie'] },
]

// ── Mini preview SVG renderer ────────────────────────────────────────────────

function DashboardPreview({ dash }: { dash: Dashboard }) {
  const widgets = dash.preview || ['kpi', 'line', 'bar']
  return (
    <svg viewBox="0 0 340 220" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* background */}
      <rect width="340" height="220" fill="#f8f9fa" rx="4"/>
      {/* header band */}
      <rect x="8" y="8" width="324" height="28" rx="3" fill="#48b5ea"/>
      <rect x="16" y="15" width="80" height="6" rx="2" fill="rgba(255,255,255,0.9)"/>
      <rect x="16" y="24" width="50" height="4" rx="1" fill="rgba(255,255,255,0.5)"/>
      {/* KPI row */}
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x={8 + i*81} y="44" width="77" height="44" rx="3"
            fill={i===0?'#fff':i===1?'#48b5ea':i===2?'#4caf82':'#fff'}
            stroke={i===0||i===3?'#e5e5e5':'none'} strokeWidth="1"/>
          <rect x={16 + i*81} y="51" width={30+Math.random()*10|0} height="4" rx="1"
            fill={i===0?'#ccc':i===1?'rgba(255,255,255,0.6)':i===2?'rgba(255,255,255,0.6)':'#ccc'}/>
          <rect x={16 + i*81} y="60" width={40+Math.random()*10|0} height="8" rx="1"
            fill={i===0?'#1a1a1a':i===1?'#fff':i===2?'#fff':'#1a1a1a'}/>
          <rect x={16 + i*81} y="73" width="18" height="3" rx="1"
            fill={i===0?'#22c55e':i===1?'rgba(255,255,255,0.5)':i===2?'rgba(255,255,255,0.5)':'#ef4444'}/>
        </g>
      ))}
      {/* Chart 1 - line/area */}
      <rect x="8" y="96" width="160" height="68" rx="3" fill="#fff" stroke="#e5e5e5" strokeWidth="1"/>
      <rect x="14" y="102" width="60" height="4" rx="1" fill="#999"/>
      <polyline points="14,152 35,140 56,145 77,132 98,138 119,125 140,130 161,120"
        fill="none" stroke="#48b5ea" strokeWidth="1.5" strokeLinejoin="round"/>
      <polygon points="14,155 35,143 56,148 77,135 98,141 119,128 140,133 161,123 161,155"
        fill="rgba(72,181,234,0.12)"/>
      {/* Chart 2 - bar */}
      <rect x="176" y="96" width="156" height="68" rx="3" fill="#fff" stroke="#e5e5e5" strokeWidth="1"/>
      <rect x="182" y="102" width="60" height="4" rx="1" fill="#999"/>
      {[0,1,2,3,4,5].map(i => {
        const h = 18 + (i*7)%24
        return <rect key={i} x={184+i*22} y={157-h} width="14" height={h} rx="1" fill={['#2196f3','#4caf82','#48b5ea','#2196f3','#4caf82','#48b5ea'][i]}/>
      })}
      {/* Chart 3 - donut */}
      <rect x="8" y="172" width="100" height="40" rx="3" fill="#fff" stroke="#e5e5e5" strokeWidth="1"/>
      <circle cx="35" cy="192" r="12" fill="none" stroke="#e5e5e5" strokeWidth="5"/>
      <circle cx="35" cy="192" r="12" fill="none" stroke="#48b5ea" strokeWidth="5"
        strokeDasharray="44 32" strokeDashoffset="10"/>
      <rect x="52" y="185" width="30" height="3" rx="1" fill="#ccc"/>
      <rect x="52" y="191" width="22" height="3" rx="1" fill="#e5e5e5"/>
      <rect x="52" y="197" width="26" height="3" rx="1" fill="#e5e5e5"/>
      {/* Bottom row placeholder */}
      <rect x="116" y="172" width="216" height="40" rx="3" fill="#fff" stroke="#e5e5e5" strokeWidth="1"/>
      <rect x="124" y="181" width="80" height="4" rx="1" fill="#ccc"/>
      <rect x="124" y="189" width="60" height="3" rx="1" fill="#e5e5e5"/>
      <rect x="124" y="196" width="70" height="3" rx="1" fill="#e5e5e5"/>
      <rect x="124" y="203" width="50" height="3" rx="1" fill="#e5e5e5"/>
    </svg>
  )
}

// ── Step indicator ───────────────────────────────────────────────────────────

function StepBar({ step }: { step: 1 | 2 | 3 }) {
  const steps = ['Choose Source', 'Pick a Name', 'Start Design']
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '14px 32px', borderBottom: '1px solid #e6e6e6', background: '#fff', gap: 0 }}>
      {steps.map((label, i) => {
        const idx = i + 1
        const done = step > idx
        const active = step === idx
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: done ? '#20BB71' : active ? '#48b5ea' : '#e6e6e6',
                color: done || active ? '#fff' : '#999',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, flexShrink: 0,
                transition: 'background 0.2s',
              }}>
                {done ? <Check size={12}/> : idx}
              </div>
              <span style={{
                fontSize: 12, fontWeight: active ? 600 : 400,
                color: active ? '#1a1a1a' : done ? '#20BB71' : '#999',
                whiteSpace: 'nowrap',
              }}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 1, background: step > idx + 1 ? '#20BB71' : '#e6e6e6', margin: '0 12px', transition: 'background 0.2s' }}/>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Main Modal ───────────────────────────────────────────────────────────────

export default function ClonePageModal({ onClose, onClone }: ClonePageModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [search, setSearch] = useState('')
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set(['Alloy (internal)', 'Atlanta Beltline']))
  const [selected, setSelected] = useState<Dashboard | null>(null)
  const [hoveredDash, setHoveredDash] = useState<Dashboard | null>(null)
  const [newName, setNewName] = useState('')
  const [cloning, setCloning] = useState(false)
  const [done, setDone] = useState(false)

  // Group dashboards by client
  const grouped = useMemo(() => {
    const map: Record<string, Dashboard[]> = {}
    DASHBOARDS.forEach(d => {
      if (!d.name.toLowerCase().includes(search.toLowerCase()) && !d.client.toLowerCase().includes(search.toLowerCase())) return
      if (!map[d.client]) map[d.client] = []
      map[d.client].push(d)
    })
    return map
  }, [search])

  const previewTarget = hoveredDash || selected

  function toggleClient(client: string) {
    setExpandedClients(prev => {
      const n = new Set(prev)
      n.has(client) ? n.delete(client) : n.add(client)
      return n
    })
  }

  function handleContinue() {
    if (step === 1 && selected) {
      setNewName(`${selected.name} (Copy)`)
      setStep(2)
    } else if (step === 2 && newName.trim()) {
      setStep(3)
      handleClone()
    }
  }

  async function handleClone() {
    if (!selected) return
    setCloning(true)
    await new Promise(r => setTimeout(r, 1200))
    setCloning(false)
    setDone(true)
    setTimeout(() => {
      onClone?.(selected, newName.trim())
      onClose()
    }, 800)
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 8, width: '100%', maxWidth: 900, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #e6e6e6', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#e1f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Copy size={15} style={{ color: '#48b5ea' }}/>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>Clone Existing Page</p>
              <p style={{ fontSize: 11, color: '#999', marginTop: 1 }}>Copy a dashboard from any client</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid #e6e6e6', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={14} style={{ color: '#555' }}/>
          </button>
        </div>

        {/* Step bar */}
        <StepBar step={step}/>

        {/* Body */}
        {step === 1 && (
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Left — source selector */}
            <div style={{ width: 340, minWidth: 340, borderRight: '1px solid #e6e6e6', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Title */}
              <div style={{ padding: '20px 20px 12px' }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Select a Page</h2>
                <p style={{ fontSize: 12, color: '#999' }}>Search or add a page you've already created!</p>
              </div>
              {/* Search */}
              <div style={{ padding: '0 16px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5f5f5', border: '1px solid #e6e6e6', borderRadius: 6, padding: '7px 10px' }}>
                  <Search size={12} style={{ color: '#999', flexShrink: 0 }}/>
                  <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search..."
                    style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#333', width: '100%' }}
                  />
                </div>
              </div>
              {/* Client list */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {Object.keys(grouped).length === 0 && (
                  <div style={{ padding: 24, textAlign: 'center', color: '#999', fontSize: 12 }}>No pages match your search.</div>
                )}
                {Object.entries(grouped).map(([client, dashes]) => {
                  const expanded = expandedClients.has(client)
                  return (
                    <div key={client}>
                      {/* Client row */}
                      <button
                        onClick={() => toggleClient(client)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                      >
                        <ChevronRight size={13} style={{ color: '#999', transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }}/>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#333', flex: 1 }}>{client}</span>
                        <span style={{ fontSize: 10, color: '#bbb', fontWeight: 600 }}>{dashes.length}</span>
                      </button>
                      {/* Dashboard rows */}
                      {expanded && dashes.map(dash => {
                        const isSelected = selected?.id === dash.id
                        return (
                          <button
                            key={dash.id}
                            onClick={() => setSelected(dash)}
                            onMouseEnter={() => setHoveredDash(dash)}
                            onMouseLeave={() => setHoveredDash(null)}
                            style={{
                              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                              padding: '8px 16px 8px 36px', background: isSelected ? '#e1f7ff' : 'transparent',
                              border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s',
                              borderLeft: isSelected ? '3px solid #48b5ea' : '3px solid transparent',
                            }}
                          >
                            <LayoutGrid size={12} style={{ color: isSelected ? '#48b5ea' : '#bbb', flexShrink: 0 }}/>
                            <span style={{ fontSize: 12, color: isSelected ? '#1a1a1a' : '#555', fontWeight: isSelected ? 600 : 400, flex: 1 }}>{dash.name}</span>
                            <span style={{ fontSize: 10, color: '#bbb' }}>{dash.widgets}w</span>
                          </button>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
              {/* Footer */}
              <div style={{ padding: '12px 16px', borderTop: '1px solid #e6e6e6', display: 'flex', gap: 8 }}>
                <button onClick={onClose} style={{ flex: 1, background: '#f5f5f5', border: '1px solid #e6e6e6', borderRadius: 6, padding: '9px', fontSize: 12, color: '#555', cursor: 'pointer', fontWeight: 500 }}>
                  Cancel
                </button>
                <button
                  onClick={handleContinue}
                  disabled={!selected}
                  style={{ flex: 2, background: selected ? '#48b5ea' : '#e6e6e6', border: 'none', borderRadius: 6, padding: '9px', fontSize: 12, fontWeight: 700, color: selected ? '#fff' : '#bbb', cursor: selected ? 'pointer' : 'default', transition: 'background 0.15s' }}
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Right — preview */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, background: '#f8f9fa' }}>
              {previewTarget ? (
                <div style={{ width: '100%', maxWidth: 400 }}>
                  {/* Preview label */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#48b5ea' }}/>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a' }}>{previewTarget.name}</p>
                    <span style={{ fontSize: 11, color: '#999' }}>— {previewTarget.client}</span>
                  </div>
                  {/* Preview card */}
                  <div style={{ background: '#fff', border: '2px solid #48b5ea', borderRadius: 8, overflow: 'hidden', boxShadow: '0 8px 24px rgba(72,181,234,0.15)' }}>
                    <DashboardPreview dash={previewTarget}/>
                  </div>
                  {/* Meta */}
                  <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                    {[
                      { label: 'Widgets', value: `${previewTarget.widgets}` },
                      { label: 'Last edited', value: previewTarget.lastEdited },
                    ].map(m => (
                      <div key={m.label}>
                        <p style={{ fontSize: 10, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#333', marginTop: 2 }}>{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: 0.6 }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#e6e6e6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LayoutGrid size={28} style={{ color: '#bbb' }}/>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#999' }}>Page Preview</p>
                  <p style={{ fontSize: 12, color: '#bbb' }}>Select a page to preview</p>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, background: '#f8f9fa' }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 40, width: '100%', maxWidth: 480, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              {/* Source summary */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, padding: '10px 14px', background: '#f0fdf4', border: '1px solid #20BB71', borderRadius: 8 }}>
                <Copy size={14} style={{ color: '#20BB71', flexShrink: 0 }}/>
                <div>
                  <p style={{ fontSize: 11, color: '#20BB71', fontWeight: 600 }}>Cloning from</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{selected?.client} — {selected?.name}</p>
                </div>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Pick a Name</h2>
              <p style={{ fontSize: 13, color: '#999', marginBottom: 24 }}>Give your cloned page a new name.</p>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#666', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Page Name</label>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && newName.trim() && handleContinue()}
                autoFocus
                style={{ width: '100%', background: '#fafafa', border: '2px solid #48b5ea', borderRadius: 8, padding: '12px 14px', fontSize: 14, outline: 'none', color: '#1a1a1a', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, background: '#f5f5f5', border: '1px solid #e6e6e6', borderRadius: 8, padding: '11px', fontSize: 13, color: '#555', cursor: 'pointer', fontWeight: 500 }}>Back</button>
                <button
                  onClick={handleContinue}
                  disabled={!newName.trim()}
                  style={{ flex: 2, background: newName.trim() ? '#48b5ea' : '#e6e6e6', border: 'none', borderRadius: 8, padding: '11px', fontSize: 13, fontWeight: 700, color: newName.trim() ? '#fff' : '#bbb', cursor: newName.trim() ? 'pointer' : 'default' }}
                >
                  Clone & Start Design
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, background: '#f8f9fa', gap: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: done ? '#20BB71' : '#48b5ea',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.4s',
            }}>
              {done
                ? <Check size={32} style={{ color: '#fff' }}/>
                : <Copy size={28} style={{ color: '#fff', animation: 'pulse 1s ease-in-out infinite' }}/>
              }
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>
                {done ? 'Page Cloned!' : 'Cloning page...'}
              </p>
              <p style={{ fontSize: 13, color: '#999' }}>
                {done
                  ? `"${newName}" is ready. Redirecting to design…`
                  : `Copying "${selected?.name}" → "${newName}"`
                }
              </p>
            </div>
            {/* Progress bar */}
            <div style={{ width: 280, height: 4, background: '#e6e6e6', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: done ? '#20BB71' : '#48b5ea',
                width: done ? '100%' : '65%',
                transition: 'width 1s ease, background 0.4s',
              }}/>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.92); }
        }
      `}</style>
    </div>
  )
}
