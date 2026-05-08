'use client'
import { useState } from 'react'
import { X, Plus, RotateCcw, RotateCw, Monitor, Smartphone, ChevronDown, ChevronRight } from 'lucide-react'

const ALL_INTEGRATIONS = [
  { name:'Bing Webmaster Tools', color:'#0078D4' },
  { name:'Facebook',             color:'#1877F2' },
  { name:'Facebook Ads',         color:'#1877F2' },
  { name:'Google Ads',           color:'#EA4335' },
  { name:'Google Analytics 4',   color:'#E37400' },
  { name:'Google Lighthouse',    color:'#4285F4' },
  { name:'Google Search Console',color:'#34A853' },
  { name:'Google Sheets',        color:'#0F9D58' },
  { name:'LinkedIn Ads',         color:'#0A66C2' },
  { name:'Semrush - Backlinks',  color:'#FF642D' },
  { name:'Semrush - Projects',   color:'#FF642D' },
  { name:'ActiveCampaign',       color:'#ccc', dim:true },
  { name:'AdRoll',               color:'#ccc', dim:true },
  { name:'Adform',               color:'#ccc', dim:true },
  { name:'Ahrefs',               color:'#ccc', dim:true },
  { name:'Amazon Ads',           color:'#ccc', dim:true },
  { name:'Apple Search Ads',     color:'#ccc', dim:true },
  { name:'Appsflyer',            color:'#ccc', dim:true },
  { name:'Capterra',             color:'#ccc', dim:true },
  { name:'Criteo',               color:'#ccc', dim:true },
  { name:'DV360',                color:'#ccc', dim:true },
  { name:'HubSpot',              color:'#ccc', dim:true },
  { name:'Instagram',            color:'#ccc', dim:true },
  { name:'Klaviyo',              color:'#ccc', dim:true },
  { name:'Mailchimp',            color:'#ccc', dim:true },
  { name:'Pinterest',            color:'#ccc', dim:true },
  { name:'Shopify',              color:'#ccc', dim:true },
  { name:'Snapchat',             color:'#ccc', dim:true },
  { name:'TikTok',               color:'#ccc', dim:true },
  { name:'Twitter/X Ads',        color:'#ccc', dim:true },
  { name:'YouTube',              color:'#ccc', dim:true },
]

const RIGHT_TABS = [
  { id:'build',       label:'Build with AI',         icon:'✦' },
  { id:'integrations',label:'Integrations\nMetrics',  icon:'📊' },
  { id:'content',     label:'Content\nBlocks',        icon:'Aa' },
  { id:'media',       label:'Media',                  icon:'🖼' },
  { id:'metrics',     label:'Custom\nMetrics',        icon:'⊕' },
  { id:'benchmarks',  label:'Benchmarks',             icon:'⚖' },
  { id:'goals',       label:'Goals',                  icon:'◎' },
]

const DASHBOARDS = ['Website Performance','Paid Media','Organic + AI Search','Donations Trend','oiijuyuh']

interface Props {
  clientName: string
  clientDomain: string
  onClose: () => void
}

function IntegrationIcon({ name, color }: { name: string; color: string }) {
  const letter = name[0]
  const iconMap: Record<string, string> = {
    'Bing Webmaster Tools': '🔷',
    'Facebook': '𝐟',
    'Facebook Ads': '𝐟',
    'Google Ads': '⬡',
    'Google Analytics 4': '📊',
    'Google Lighthouse': '🌐',
    'Google Search Console': '🔍',
    'Google Sheets': '📗',
    'LinkedIn Ads': 'in',
    'Semrush - Backlinks': '●',
    'Semrush - Projects': '●',
  }
  return (
    <div style={{
      width: 28, height: 28, borderRadius: 6,
      background: color === '#ccc' ? '#f0f0f0' : color + '22',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: name === 'LinkedIn Ads' ? 9 : 13,
      fontWeight: 700, color: color === '#ccc' ? '#bbb' : color,
      flexShrink: 0,
    }}>
      {iconMap[name] || letter}
    </div>
  )
}

export default function DashboardBuilder({ clientName, clientDomain, onClose }: Props) {
  const [liveData, setLiveData] = useState(true)
  const [activeRight, setActiveRight] = useState('integrations')
  const [search, setSearch] = useState('')
  const [dashboards, setDashboards] = useState([...DASHBOARDS, 'Untitled Dashboard'])
  const [activeDash, setActiveDash] = useState('Untitled Dashboard')
  const [openSrc, setOpenSrc] = useState<Set<string>>(new Set())

  const filtered = ALL_INTEGRATIONS.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', flexDirection: 'column',
      background: '#fff', fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      {/* ── Top bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 20px', height: 52,
        borderBottom: '1px solid #e5e5e5', background: '#fff', flexShrink: 0,
      }}>
        {/* Left: title + client badge */}
        <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Dashboard</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 4 }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%', overflow: 'hidden',
            background: '#f0f0f0', flexShrink: 0,
          }}>
            <img
              src={`https://logo.clearbit.com/${clientDomain}`} alt=""
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={e => (e.currentTarget.style.display = 'none')}
            />
          </div>
          <span style={{ fontSize: 13, color: '#555' }}>{clientName}</span>
          <span style={{
            fontSize: 11, background: '#f0f0f0', color: '#666',
            padding: '2px 8px', borderRadius: 4,
          }}>Client</span>
        </div>

        {/* Center controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          {/* Live / Sample toggle */}
          <div style={{
            display: 'flex', gap: 1, background: '#f5f5f5',
            border: '1px solid #e5e5e5', borderRadius: 6, padding: 2,
          }}>
            <button onClick={() => setLiveData(true)} style={{
              padding: '5px 14px', borderRadius: 4, fontSize: 11, fontWeight: 600,
              background: liveData ? '#48b5ea' : 'transparent',
              color: liveData ? '#fff' : '#666', border: 'none', cursor: 'pointer',
            }}>Live Data</button>
            <button onClick={() => setLiveData(false)} style={{
              padding: '5px 14px', borderRadius: 4, fontSize: 11,
              background: !liveData ? '#fff' : 'transparent',
              color: !liveData ? '#333' : '#666', border: 'none', cursor: 'pointer',
            }}>Sample Data</button>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', display: 'flex' }}><RotateCcw size={14}/></button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', display: 'flex' }}><RotateCw size={14}/></button>
          <div style={{ width: 1, height: 14, background: '#e5e5e5', margin: '0 2px' }}/>
          <button style={{ background: '#f5f5f5', border: '1px solid #e5e5e5', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex' }}><Monitor size={13} style={{ color: '#333' }}/></button>
          <button style={{ background: 'transparent', border: 'none', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex' }}><Smartphone size={13} style={{ color: '#bbb' }}/></button>
        </div>

        {/* Right: page setup + theme + date + preview + auto saved */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 12 }}>
          <button style={{ background: '#f5f5f5', border: '1px solid #e5e5e5', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: '#333', cursor: 'pointer' }}>⊞ Page Setup</button>
          <button style={{ background: '#f5f5f5', border: '1px solid #e5e5e5', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: '#333', cursor: 'pointer' }}>◑ Theme</button>
          <button style={{ background: '#f5f5f5', border: '1px solid #e5e5e5', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: '#333', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            🗓 Apr 1, 2026 – Apr 30, 2026 <ChevronDown size={11}/>
          </button>
          <button style={{ background: '#f5f5f5', border: '1px solid #e5e5e5', borderRadius: 6, padding: '6px 14px', fontSize: 12, color: '#333', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            ▶ Preview
          </button>
          <span style={{ fontSize: 11, color: '#aaa' }}>☁ Auto saved</span>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: '50%', background: '#f5f5f5',
            border: '1px solid #e5e5e5', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 4,
          }}>
            <X size={14} style={{ color: '#555' }}/>
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left sidebar */}
        <div style={{
          width: 230, minWidth: 230, borderRight: '1px solid #e5e5e5',
          display: 'flex', flexDirection: 'column', background: '#fff',
        }}>
          <div style={{ padding: 12 }}>
            <button
              onClick={() => {
                const name = 'Untitled Dashboard'
                setDashboards(prev => [...prev, name])
                setActiveDash(name)
              }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 6,
                background: '#48b5ea', border: 'none', borderRadius: 6,
                padding: '9px 12px', color: '#fff', fontSize: 12,
                fontWeight: 600, cursor: 'pointer',
              }}>
              <Plus size={13}/> Add blank dashboard
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {dashboards.map(d => (
              <button key={d} onClick={() => setActiveDash(d)} style={{
                width: '100%', textAlign: 'left', padding: '9px 12px', fontSize: 13,
                cursor: 'pointer', background: 'none', border: 'none',
                fontWeight: activeDash === d ? 700 : 400,
                color: activeDash === d ? '#1a1a1a' : '#555',
                borderLeft: activeDash === d ? '3px solid #48b5ea' : '3px solid transparent',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ flex: 1 }}>{d}</span>
                <span style={{ color: '#ccc', fontSize: 16 }}>•••</span>
              </button>
            ))}
            <div style={{ padding: '10px 16px 4px' }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em' }}>DATA SOURCES</p>
            </div>
            {['SEO','Analytics','Social','Paid Ads'].map(s => (
              <button key={s}
                onClick={() => setOpenSrc(p => { const n = new Set(p); n.has(s) ? n.delete(s) : n.add(s); return n })}
                style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 16px', fontSize: 13, cursor: 'pointer', background: 'none', border: 'none', color: '#555' }}>
                <ChevronRight size={12} style={{ transform: openSrc.has(s) ? 'rotate(90deg)' : 'none', transition: '0.15s', color: '#999' }}/>{s}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div style={{ flex: 1, background: '#f8f9fa', position: 'relative', overflow: 'auto' }}>
          {activeDash === 'Untitled Dashboard' || activeDash.startsWith('Untitled') ? (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 6,
            }}>
              <p style={{ fontSize: 16, color: '#555', marginBottom: 2 }}>Start building by dragging widgets</p>
              <p style={{ fontSize: 13, color: '#bbb', marginBottom: 24 }}>or</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: 560 }}>
                {[
                  { title: 'Add a page template', desc: 'Choose from a ready-made template or one of your saved pages',
                    icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="13" height="13" rx="2" fill="#D5D5D5"/><rect x="22" y="4" width="13" height="13" rx="2" fill="#D5D5D5"/><rect x="4" y="22" width="13" height="9" rx="1.5" fill="#E8E8E8"/><rect x="22" y="22" width="13" height="9" rx="1.5" fill="#E8E8E8"/><circle cx="10" cy="35" r="3" fill="#48b5ea"/></svg> },
                  { title: 'Build a page using AI', desc: 'Tell AI what you\'re trying to achieve, and watch it build your page',
                    icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="13" stroke="#D5D5D5" strokeWidth="2"/><path d="M15 20 L18.5 23.5 L26 16" stroke="#48b5ea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 7 L22 11 L26 9" stroke="#D5D5D5" strokeWidth="1.5" strokeLinecap="round"/></svg> },
                  { title: 'Clone existing page', desc: 'Copy a page from another page',
                    icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="5" y="8" width="20" height="26" rx="2" stroke="#D5D5D5" strokeWidth="2"/><rect x="14" y="6" width="20" height="26" rx="2" stroke="#D5D5D5" strokeWidth="2" fill="#FAFAFA"/><path d="M19 14 h9 M19 19 h7 M19 24 h8" stroke="#E5E5E5" strokeWidth="1.5" strokeLinecap="round"/></svg> },
                  { title: 'Smart Dashboard', desc: 'Generate a dashboard from your connected integrations',
                    icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="4" y="10" width="32" height="20" rx="2" stroke="#D5D5D5" strokeWidth="2"/><path d="M4 17 h32" stroke="#D5D5D5" strokeWidth="1.5"/><rect x="9" y="22" width="8" height="5" rx="1" fill="#E5E5E5"/><rect x="22" y="22" width="8" height="5" rx="1" fill="#48b5ea" fillOpacity="0.4"/></svg> },
                ].map(opt => (
                  <button key={opt.title}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                      padding: '36px 28px', background: '#fff',
                      border: '1px solid #e8e8e8', borderRadius: 10,
                      cursor: 'pointer', textAlign: 'center' as const, transition: 'all 0.12s',
                    }}
                    onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = '#ccc'; b.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)' }}
                    onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = '#e8e8e8'; b.style.boxShadow = 'none' }}
                  >
                    <div style={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{opt.icon}</div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 500, color: '#1a1a1a', marginBottom: 8 }}>{opt.title}</p>
                      <p style={{ fontSize: 12, color: '#aaa', lineHeight: 1.6 }}>{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: 16 }}>
              <div style={{ background: '#48b5ea', borderRadius: 8, padding: '18px 24px', marginBottom: 12 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{activeDash}</h2>
              </div>
            </div>
          )}
        </div>

        {/* Right panel - icon strip + content */}
        <div style={{ display: 'flex', borderLeft: '1px solid #e5e5e5' }}>
          {/* Integrations panel content */}
          {activeRight === 'integrations' && (
            <div style={{ width: 240, background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Search */}
              <div style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5f5f5', border: '1px solid #e5e5e5', borderRadius: 6, padding: '7px 10px', marginBottom: 10 }}>
                  <span style={{ color: '#999', fontSize: 13 }}>🔍</span>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search"
                    style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#333', width: '100%' }}/>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>All Integrations</span>
                  <ChevronDown size={14} style={{ color: '#999' }}/>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {filtered.map(i => (
                  <div key={i.name}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#f8f9fa'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                    <IntegrationIcon name={i.name} color={i.color}/>
                    <span style={{ flex: 1, fontSize: 13, color: (i as any).dim ? '#aaa' : '#1a1a1a' }}>{i.name}</span>
                    <ChevronRight size={13} style={{ color: '#ccc' }}/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Icon strip */}
          <div style={{
            width: 72, background: '#fff', display: 'flex', flexDirection: 'column',
            alignItems: 'center', padding: '12px 0', gap: 2, borderLeft: '1px solid #e5e5e5',
          }}>
            {RIGHT_TABS.map(tab => (
              <button key={tab.id}
                onClick={() => setActiveRight(activeRight === tab.id ? '' : tab.id)}
                style={{
                  width: 60, padding: '10px 4px', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 5, border: 'none', cursor: 'pointer',
                  borderRadius: 8, background: activeRight === tab.id ? '#f0f0f0' : 'none',
                }}>
                <span style={{ fontSize: 17, lineHeight: 1 }}>{tab.icon}</span>
                <span style={{
                  fontSize: 9, color: activeRight === tab.id ? '#333' : '#888',
                  textAlign: 'center', lineHeight: 1.3, whiteSpace: 'pre-line',
                  fontWeight: activeRight === tab.id ? 600 : 400,
                }}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom zoom bar */}
      <div style={{
        position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8,
        padding: '6px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#555', lineHeight: 1 }}>−</button>
        <span style={{ fontSize: 13, color: '#555', minWidth: 36, textAlign: 'center' }}>100%</span>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#555', lineHeight: 1 }}>+</button>
        <div style={{ width: 1, height: 14, background: '#e5e5e5', margin: '0 4px' }}/>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1h4v4H1zM9 1h4v4H9zM1 9h4v4H1zM9 9h4v4H9z" stroke="#888" strokeWidth="1.2"/></svg>
        </button>
      </div>
    </div>
  )
}
