'use client'
import { useState, useEffect } from 'react'
import { X, Plus, RotateCcw, RotateCw, Monitor, Smartphone, ChevronDown, ChevronRight, Search } from 'lucide-react'

// ── Data ─────────────────────────────────────────────────────────────────────

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

const TEMPLATES = [
  '...', '{...}', '2025 Layout', '3 things to know', 'ADAI Quick Links',
  'AI Copier', 'App + Gaming', 'B2B SaaS Dashboard', 'Brand Insights',
  'Campaign Overview', 'Content Performance', 'Ecommerce Overview',
  'Executive Summary', 'Lead Generation', 'Monthly Report',
  'Paid Media Overview', 'SEO Dashboard', 'Social Media', 'Website Analytics',
]

const TEMPLATE_CATEGORIES = ['All Templates', 'My Page Templates', 'Default Page Templates']

const RIGHT_TABS = [
  { id:'build',        label:'Build with AI',        icon:'✦' },
  { id:'integrations', label:'Integrations\nMetrics', icon:'📊' },
  { id:'content',      label:'Content\nBlocks',       icon:'Aa' },
  { id:'media',        label:'Media',                 icon:'🖼' },
  { id:'metrics',      label:'Custom\nMetrics',       icon:'⊕' },
  { id:'benchmarks',   label:'Benchmarks',            icon:'⚖' },
  { id:'goals',        label:'Goals',                 icon:'◎' },
]

const BASE_DASHBOARDS = ['Website Performance','Paid Media','Organic + AI Search','Donations Trend','oiijuyuh']

// ── Sub-components ────────────────────────────────────────────────────────────

function IntegrationIcon({ name, color }: { name: string; color: string }) {
  const map: Record<string,string> = {
    'Bing Webmaster Tools':'b','Facebook':'f','Facebook Ads':'f',
    'Google Ads':'G','Google Analytics 4':'G','Google Lighthouse':'G',
    'Google Search Console':'G','Google Sheets':'G','LinkedIn Ads':'in',
    'Semrush - Backlinks':'S','Semrush - Projects':'S',
  }
  return (
    <div style={{
      width:28,height:28,borderRadius:6,flexShrink:0,
      background:color==='#ccc'?'#f0f0f0':color+'22',
      display:'flex',alignItems:'center',justifyContent:'center',
      fontSize:name==='LinkedIn Ads'?9:12,fontWeight:700,
      color:color==='#ccc'?'#bbb':color,
    }}>{map[name]||name[0]}</div>
  )
}

// 3-step progress bar
function StepBar({ step }: { step: number }) {
  const steps = ['Choose Source','Pick a Name','Start Design']
  return (
    <div style={{display:'flex',alignItems:'stretch',height:52,borderBottom:'1px solid #e5e5e5',flexShrink:0}}>
      {steps.map((label,i) => {
        const n = i+1
        const done = step > n
        const active = step === n
        return (
          <div key={n} style={{
            flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:10,
            background:active?'#fff':'#fafafa',
            borderRight:i<2?'1px solid #e5e5e5':'none',
            position:'relative',
          }}>
            {/* Arrow chevron for non-last */}
            {i < 2 && (
              <div style={{
                position:'absolute',right:-13,top:0,bottom:0,
                width:26,zIndex:2,
                clipPath:'polygon(0 0, 50% 50%, 0 100%)',
                background: active ? '#fff' : '#fafafa',
                borderRight:'1px solid #e5e5e5',
              }}/>
            )}
            <div style={{
              width:24,height:24,borderRadius:'50%',
              background:done?'#48b5ea':active?'#48b5ea':'#e0e0e0',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:12,fontWeight:700,color:'#fff',flexShrink:0,
            }}>
              {done ? '✓' : n}
            </div>
            <span style={{
              fontSize:14,fontWeight:active||done?600:400,
              color:active?'#48b5ea':done?'#48b5ea':'#999',
            }}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}

// Step 1: Choose Source (template picker)
function StepChooseSource({
  onContinue, onCancel
}: { onContinue:(t:string)=>void; onCancel:()=>void }) {
  const [selected, setSelected] = useState('')
  const [search, setSearch] = useState('')
  const [catOpen, setCatOpen] = useState(false)
  const [cat, setCat] = useState('All Templates')

  const filtered = TEMPLATES.filter(t=>t.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{display:'flex',flex:1,overflow:'hidden'}}>
      {/* Left panel */}
      <div style={{width:340,minWidth:340,borderRight:'1px solid #e5e5e5',display:'flex',flexDirection:'column',padding:'28px 28px 20px',overflow:'hidden'}}>
        <h2 style={{fontSize:22,fontWeight:700,color:'#1a1a1a',marginBottom:8,textAlign:'center'}}>Add Page Template</h2>
        <p style={{fontSize:13,color:'#888',textAlign:'center',lineHeight:1.6,marginBottom:20}}>You can make changes after it's added to your dashboard.</p>
        <div style={{height:1,background:'#e5e5e5',marginBottom:16}}/>

        {/* Category dropdown */}
        <div style={{position:'relative',marginBottom:8,flexShrink:0}}>
          <button onClick={()=>setCatOpen(o=>!o)} style={{
            width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',
            padding:'9px 14px',border:'1px solid #e5e5e5',borderRadius:6,background:'#fff',
            fontSize:13,color:'#333',cursor:'pointer',
          }}>
            <span>{cat}</span>
            <span style={{fontSize:11,color:'#999'}}>⇅</span>
          </button>
          {catOpen && (
            <div style={{
              position:'absolute',top:'calc(100% + 2px)',left:0,right:0,
              background:'#fff',border:'1px solid #e5e5e5',borderRadius:6,
              boxShadow:'0 4px 12px rgba(0,0,0,0.1)',zIndex:20,overflow:'hidden',
            }}>
              {TEMPLATE_CATEGORIES.map(c=>(
                <button key={c} onClick={()=>{setCat(c);setCatOpen(false)}} style={{
                  width:'100%',textAlign:'left' as const,padding:'10px 14px',fontSize:13,
                  background:cat===c?'#48b5ea':'#fff',color:cat===c?'#fff':'#333',
                  border:'none',cursor:'pointer',display:'block',
                }}>{c}</button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div style={{display:'flex',alignItems:'center',gap:8,border:'1px solid #e5e5e5',borderRadius:6,padding:'7px 12px',marginBottom:8,background:'#fff',flexShrink:0}}>
          <Search size={13} style={{color:'#bbb',flexShrink:0}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search"
            style={{border:'none',outline:'none',fontSize:13,color:'#333',width:'100%',background:'transparent'}}/>
        </div>

        {/* Template list - scrollable, fixed height */}
        <div style={{flex:1,overflowY:'auto',border:'1px solid #e5e5e5',borderRadius:6,minHeight:0}}>
          {filtered.map(t=>(
            <div key={t} onClick={()=>setSelected(t)} style={{
              display:'flex',alignItems:'center',gap:12,padding:'11px 16px',
              borderBottom:'1px solid #f5f5f5',cursor:'pointer',
              background:selected===t?'#f0f9ff':'#fff',
            }}
              onMouseEnter={e=>{if(selected!==t)(e.currentTarget as HTMLDivElement).style.background='#fafafa'}}
              onMouseLeave={e=>{if(selected!==t)(e.currentTarget as HTMLDivElement).style.background=selected===t?'#f0f9ff':'#fff'}}>
              <div style={{
                width:18,height:18,borderRadius:'50%',flexShrink:0,
                border:`2px solid ${selected===t?'#48b5ea':'#ccc'}`,
                background:'#fff',
                display:'flex',alignItems:'center',justifyContent:'center',
              }}>
                {selected===t&&<div style={{width:8,height:8,borderRadius:'50%',background:'#48b5ea'}}/>}
              </div>
              <span style={{fontSize:13,color:'#333'}}>{t}</span>
            </div>
          ))}
        </div>

        {/* Buttons - always visible at bottom */}
        <div style={{display:'flex',gap:10,marginTop:14,flexShrink:0,paddingTop:4}}>
          <button onClick={()=>selected&&onContinue(selected)} disabled={!selected} style={{
            background:selected?'#48b5ea':'#a8d8f0',border:'none',borderRadius:6,
            padding:'10px 24px',fontSize:13,fontWeight:600,color:'#fff',cursor:selected?'pointer':'default',
            transition:'background 0.15s',
          }}>Continue</button>
          <button onClick={onCancel} style={{
            background:'#fff',border:'1px solid #e5e5e5',borderRadius:6,
            padding:'10px 24px',fontSize:13,color:'#555',cursor:'pointer',
          }}>Cancel</button>
        </div>
      </div>

      {/* Right: Page Preview */}
      <div style={{flex:1,background:'#f8f9fa',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16}}>
        {selected ? (
          <div style={{width:'90%',height:'80%',background:'#fff',borderRadius:8,border:'1px solid #e5e5e5',overflow:'hidden',boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
            {/* Mock template preview */}
            <div style={{background:'#F9B62A',height:40,display:'flex',alignItems:'center',padding:'0 16px'}}>
              <span style={{fontSize:14,fontWeight:700,color:'#fff',fontStyle:'italic'}}>Brand Insights</span>
              <div style={{flex:1,height:1,background:'rgba(255,255,255,0.4)',marginLeft:12}}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,padding:10}}>
              <div style={{gridColumn:'span 1',background:'#f5f5f5',borderRadius:4,padding:8,fontSize:8,color:'#666',lineHeight:1.5}}>
                <strong style={{fontSize:9,color:'#333'}}>Strategic Initiatives Boost Engagement</strong>
                <br/>Significant engagement increase observed following strategic initiatives on September 7...
              </div>
              <div style={{background:'#fff',borderRadius:4,padding:8,border:'1px solid #e5e5e5'}}>
                <div style={{fontSize:8,color:'#888',marginBottom:4}}>📊 Referral Channels</div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <div style={{width:44,height:44,borderRadius:'50%',border:'6px solid #F9B62A',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <span style={{fontSize:9,fontWeight:700}}>238</span>
                  </div>
                </div>
              </div>
              <div style={{background:'#48b5ea',borderRadius:4,padding:8}}>
                <div style={{fontSize:8,color:'rgba(255,255,255,0.9)',fontWeight:600,marginBottom:4}}>Enhance Website Traffic</div>
                <div style={{fontSize:7,color:'rgba(255,255,255,0.8)',lineHeight:1.4}}>Website traffic experienced a 14% decline in September, mainly due to a 21% decrease in organic search visits...</div>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8,padding:'0 10px 8px'}}>
              {[{l:'SEO Score',v:'57',c:'#4caf82'},{l:'Accessibility',v:'48',c:'#4caf82'},{l:'Page Follows',v:'52',c:'#fff'},{l:'Follows',v:'156',c:'#0A66C2'}].map(k=>(
                <div key={k.l} style={{background:k.c==='#fff'?'#f5f5f5':k.c==='#4caf82'?'#fff':'#0A66C2',border:'1px solid #e5e5e5',borderRadius:4,padding:'6px 8px',textAlign:'center' as const}}>
                  <div style={{fontSize:7,color:'#888',marginBottom:2}}>{k.l}</div>
                  <div style={{fontSize:12,fontWeight:700,color:k.c==='#4caf82'?'#4caf82':k.c==='#0A66C2'?'#fff':'#1a1a1a'}}>{k.v}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div style={{width:80,height:80,borderRadius:'50%',background:'#e8e8e8',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="8" y="6" width="24" height="28" rx="2" stroke="#48b5ea" strokeWidth="2" fill="none"/>
                <circle cx="14" cy="14" r="3" fill="#48b5ea"/>
                <rect x="18" y="13" width="10" height="2" rx="1" fill="#ccc"/>
                <rect x="12" y="20" width="16" height="2" rx="1" fill="#ccc"/>
                <rect x="12" y="24" width="12" height="2" rx="1" fill="#ccc"/>
              </svg>
            </div>
            <div style={{textAlign:'center' as const}}>
              <p style={{fontSize:18,fontWeight:700,color:'#333',marginBottom:6}}>Page Preview</p>
              <p style={{fontSize:13,color:'#aaa'}}>Select a page to preview</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Step 2: Pick a Name
function StepPickName({ template, onContinue }: { template:string; onContinue:(name:string)=>void }) {
  const [name, setName] = useState(template === '...' || template === '{...}' ? '' : template)
  return (
    <div style={{flex:1,display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:60,background:'#fff'}}>
      <div style={{width:'100%',maxWidth:680,padding:'0 40px'}}>
        <h2 style={{fontSize:26,fontWeight:700,color:'#1a1a1a',marginBottom:10,textAlign:'center'}}>What would you like your dashboard to be named?</h2>
        <p style={{fontSize:13,color:'#aaa',textAlign:'center' as const,marginBottom:40}}>This name will appear in your list of dashboards</p>
        <div style={{height:1,background:'#e5e5e5',marginBottom:32}}/>
        <input
          value={name}
          onChange={e=>setName(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&name.trim()&&onContinue(name.trim())}
          placeholder="..."
          autoFocus
          style={{
            width:'100%',border:'2px solid #48b5ea',borderRadius:6,
            padding:'14px 16px',fontSize:15,outline:'none',color:'#333',
            boxSizing:'border-box' as const,marginBottom:24,
          }}
        />
        <button onClick={()=>name.trim()&&onContinue(name.trim())} disabled={!name.trim()} style={{
          background:name.trim()?'#48b5ea':'#a8d8f0',border:'none',borderRadius:6,
          padding:'12px 28px',fontSize:14,fontWeight:600,color:'#fff',
          cursor:name.trim()?'pointer':'default',
        }}>Continue</button>
      </div>
    </div>
  )
}

// ── Main DashboardBuilder ─────────────────────────────────────────────────────

interface Props { clientName:string; clientDomain:string; clientId?:string; onClose:()=>void }

export default function DashboardBuilder({ clientName: initialName, clientDomain: initialDomain, clientId, onClose }: Props) {
  const [clientName, setClientName] = useState(initialName||'')
  const [clientDomain, setClientDomain] = useState(initialDomain||'')

  // Load client info if name not provided yet
  useEffect(()=>{
    if(!clientName&&clientId){
      import('@/lib/supabase/client').then(({createClient})=>{
        createClient().from('clients').select('name,domain').eq('id',clientId).single()
          .then(({data})=>{ if(data){ setClientName(data.name); setClientDomain(data.domain||'') } })
      }).catch(()=>{})
    } else {
      if(initialName) setClientName(initialName)
      if(initialDomain) setClientDomain(initialDomain)
    }
  },[clientId,initialName,initialDomain])
  const [liveData, setLiveData] = useState(true)
  const [activeRight, setActiveRight] = useState('integrations')
  const [intSearch, setIntSearch] = useState('')
  const [dashboards, setDashboards] = useState(BASE_DASHBOARDS)
  const [activeDash, setActiveDash] = useState('')
  const [openSrc, setOpenSrc] = useState<Set<string>>(new Set())
  const [openSrcNav, setOpenSrcNav] = useState(false)

  // Template flow state
  const [templateFlow, setTemplateFlow] = useState<null|'choose'|'name'>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [flowStep, setFlowStep] = useState(1)

  const filteredInt = ALL_INTEGRATIONS.filter(i=>i.name.toLowerCase().includes(intSearch.toLowerCase()))

  function handleAddDash() {
    setActiveDash('Untitled Dashboard')
    setDashboards(prev => prev.includes('Untitled Dashboard') ? prev : [...prev, 'Untitled Dashboard'])
  }

  function handleTemplateChoose(t: string) {
    setSelectedTemplate(t)
    setFlowStep(2)
    setTemplateFlow('name')
  }

  function handleTemplateName(name: string) {
    setFlowStep(3)
    setDashboards(prev => prev.includes(name) ? prev : [...prev, name])
    setActiveDash(name)
    setTemplateFlow(null)
    setFlowStep(1)
  }

  // Template flow overlay
  const showTemplateFlow = templateFlow !== null

  return (
    <div style={{
      position:'fixed',inset:0,zIndex:1000,
      display:'flex',flexDirection:'column',
      background:'#fff',fontFamily:"'DM Sans',system-ui,sans-serif",
    }}>
      {/* ── Top bar ── */}
      <div style={{
        display:'flex',alignItems:'center',gap:12,
        padding:'0 20px',height:52,
        borderBottom:'1px solid #e5e5e5',background:'#fff',flexShrink:0,
      }}>
        <span style={{fontSize:15,fontWeight:700,color:'#1a1a1a'}}>Dashboard</span>
        <div style={{display:'flex',alignItems:'center',gap:8,marginLeft:4}}>
          <div style={{width:28,height:28,borderRadius:'50%',overflow:'hidden',background:'#e0e0e0',flexShrink:0,border:'1px solid #d0d0d0',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <img src={`https://logo.clearbit.com/${clientDomain}`} alt=""
              style={{width:'100%',height:'100%',objectFit:'contain'}}
              onError={e=>{e.currentTarget.style.display='none'}}/>
            {!clientDomain&&<span style={{fontSize:11,fontWeight:700,color:'#888'}}>{clientName?clientName[0]:''}</span>}
          </div>
          <span style={{fontSize:14,fontWeight:700,color:'#1a1a1a'}}>{clientName||'Client'}</span>
          <span style={{fontSize:11,background:'#e8f4fd',color:'#1a85c8',padding:'3px 10px',borderRadius:12,fontWeight:600,letterSpacing:'0.02em'}}>Client</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6,marginLeft:'auto'}}>
          <div style={{display:'flex',gap:1,background:'#f5f5f5',border:'1px solid #e5e5e5',borderRadius:6,padding:2}}>
            <button onClick={()=>setLiveData(true)} style={{padding:'5px 14px',borderRadius:4,fontSize:11,fontWeight:600,background:liveData?'#48b5ea':'transparent',color:liveData?'#fff':'#666',border:'none',cursor:'pointer'}}>Live Data</button>
            <button onClick={()=>setLiveData(false)} style={{padding:'5px 14px',borderRadius:4,fontSize:11,background:!liveData?'#fff':'transparent',color:!liveData?'#333':'#666',border:'none',cursor:'pointer'}}>Sample Data</button>
          </div>
          <button style={{background:'none',border:'none',cursor:'pointer',color:'#bbb',display:'flex'}}><RotateCcw size={14}/></button>
          <button style={{background:'none',border:'none',cursor:'pointer',color:'#bbb',display:'flex'}}><RotateCw size={14}/></button>
          <div style={{width:1,height:14,background:'#e5e5e5',margin:'0 2px'}}/>
          <button style={{background:'#f5f5f5',border:'1px solid #e5e5e5',borderRadius:6,padding:'5px 8px',cursor:'pointer',display:'flex'}}><Monitor size={13} style={{color:'#333'}}/></button>
          <button style={{background:'transparent',border:'none',borderRadius:6,padding:'5px 8px',cursor:'pointer',display:'flex'}}><Smartphone size={13} style={{color:'#bbb'}}/></button>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center',marginLeft:12}}>
          <button style={{background:'#f5f5f5',border:'1px solid #e5e5e5',borderRadius:6,padding:'6px 12px',fontSize:12,color:'#333',cursor:'pointer'}}>⊞ Page Setup</button>
          <button style={{background:'#f5f5f5',border:'1px solid #e5e5e5',borderRadius:6,padding:'6px 12px',fontSize:12,color:'#333',cursor:'pointer'}}>◑ Theme</button>
          <button style={{background:'#f5f5f5',border:'1px solid #e5e5e5',borderRadius:6,padding:'6px 12px',fontSize:12,color:'#333',cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>
            🗓 Apr 1, 2026 – Apr 30, 2026 <ChevronDown size={11}/>
          </button>
          <button style={{background:'#f5f5f5',border:'1px solid #e5e5e5',borderRadius:6,padding:'6px 14px',fontSize:12,color:'#333',cursor:'pointer'}}>▶ Preview</button>
          <span style={{fontSize:11,color:'#aaa'}}>☁ Auto saved</span>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:'50%',background:'#f5f5f5',border:'1px solid #e5e5e5',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',marginLeft:4}}>
            <X size={14} style={{color:'#555'}}/>
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>

        {/* Left sidebar */}
        <div style={{width:230,minWidth:230,borderRight:'1px solid #e5e5e5',display:'flex',flexDirection:'column',background:'#fff'}}>
          <div style={{padding:12}}>
            <button onClick={handleAddDash} style={{width:'100%',display:'flex',alignItems:'center',gap:6,background:'#48b5ea',border:'none',borderRadius:6,padding:'9px 12px',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer'}}>
              <Plus size={13}/> Add blank dashboard
            </button>
          </div>
          <div style={{flex:1,overflowY:'auto'}}>
            {dashboards.map(d=>(
              <button key={d} onClick={()=>setActiveDash(d)} style={{
                width:'100%',textAlign:'left' as const,padding:'9px 12px',fontSize:13,
                cursor:'pointer',background:'none',border:'none',
                fontWeight:activeDash===d?700:400,
                color:activeDash===d?'#1a1a1a':'#555',
                borderLeft:activeDash===d?'3px solid #48b5ea':'3px solid transparent',
                display:'flex',alignItems:'center',gap:6,
              }}>
                <span style={{flex:1}}>{d}</span>
                <span style={{color:'#ccc',fontSize:14}}>•••</span>
              </button>
            ))}
            <div style={{padding:'10px 16px 4px'}}>
              <p style={{fontSize:10,fontWeight:600,color:'#999',textTransform:'uppercase' as const,letterSpacing:'0.06em'}}>DATA SOURCES</p>
            </div>
            {['SEO','Analytics','Social','Paid Ads'].map(s=>(
              <button key={s} onClick={()=>setOpenSrc(p=>{const n=new Set(p);n.has(s)?n.delete(s):n.add(s);return n})}
                style={{width:'100%',textAlign:'left' as const,display:'flex',alignItems:'center',gap:8,padding:'7px 16px',fontSize:13,cursor:'pointer',background:'none',border:'none',color:'#555'}}>
                <ChevronRight size={12} style={{transform:openSrc.has(s)?'rotate(90deg)':'none',transition:'0.15s',color:'#999'}}/>{s}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div style={{flex:1,background:'#f8f9fa',position:'relative',overflow:'auto'}}>
          {!activeDash ? (
            /* Empty state - show 4 option cards */
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:6}}>
              <p style={{fontSize:16,color:'#555',marginBottom:2}}>Start building by dragging widgets</p>
              <p style={{fontSize:13,color:'#bbb',marginBottom:24}}>or</p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,width:560}}>
                {[
                  {title:'Add a page template',desc:'Choose from a ready-made template or one of your saved pages',
                    action:()=>setTemplateFlow('choose'),
                    icon:<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="13" height="13" rx="2" fill="#D5D5D5"/><rect x="22" y="4" width="13" height="13" rx="2" fill="#D5D5D5"/><rect x="4" y="22" width="13" height="9" rx="1.5" fill="#E8E8E8"/><rect x="22" y="22" width="13" height="9" rx="1.5" fill="#E8E8E8"/><circle cx="10" cy="35" r="3" fill="#48b5ea"/></svg>},
                  {title:'Build a page using AI',desc:"Tell AI what you're trying to achieve, and watch it build your page",
                    action:()=>{},
                    icon:<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="13" stroke="#D5D5D5" strokeWidth="2"/><path d="M15 20 L18.5 23.5 L26 16" stroke="#48b5ea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 7 L22 11 L26 9" stroke="#D5D5D5" strokeWidth="1.5" strokeLinecap="round"/></svg>},
                  {title:'Clone existing page',desc:'Copy a page from another page',
                    action:()=>{},
                    icon:<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="5" y="8" width="20" height="26" rx="2" stroke="#D5D5D5" strokeWidth="2"/><rect x="14" y="6" width="20" height="26" rx="2" stroke="#D5D5D5" strokeWidth="2" fill="#FAFAFA"/><path d="M19 14 h9 M19 19 h7 M19 24 h8" stroke="#E5E5E5" strokeWidth="1.5" strokeLinecap="round"/></svg>},
                  {title:'Smart Dashboard',desc:'Generate a dashboard from your connected integrations',
                    action:()=>{},
                    icon:<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="4" y="10" width="32" height="20" rx="2" stroke="#D5D5D5" strokeWidth="2"/><path d="M4 17 h32" stroke="#D5D5D5" strokeWidth="1.5"/><rect x="9" y="22" width="8" height="5" rx="1" fill="#E5E5E5"/><rect x="22" y="22" width="8" height="5" rx="1" fill="#48b5ea" fillOpacity="0.4"/></svg>},
                ].map(opt=>(
                  <button key={opt.title} onClick={opt.action}
                    style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16,padding:'36px 28px',background:'#fff',border:'1px solid #e8e8e8',borderRadius:10,cursor:'pointer',textAlign:'center' as const,transition:'all 0.12s'}}
                    onMouseEnter={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.borderColor='#ccc';b.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)'}}
                    onMouseLeave={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.borderColor='#e8e8e8';b.style.boxShadow='none'}}
                  >
                    <div style={{width:60,height:60,display:'flex',alignItems:'center',justifyContent:'center'}}>{opt.icon}</div>
                    <div>
                      <p style={{fontSize:15,fontWeight:500,color:'#1a1a1a',marginBottom:8}}>{opt.title}</p>
                      <p style={{fontSize:12,color:'#aaa',lineHeight:1.6}}>{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{padding:16}}>
              <div style={{background:'#48b5ea',borderRadius:8,padding:'18px 24px',marginBottom:12}}>
                <h2 style={{fontSize:20,fontWeight:700,color:'#fff'}}>{activeDash}</h2>
              </div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:300,color:'#bbb',fontSize:14}}>
                Drag widgets here to build your dashboard
              </div>
            </div>
          )}
        </div>

        {/* Right: integrations panel + icon strip */}
        <div style={{display:'flex',borderLeft:'1px solid #e5e5e5'}}>
          {activeRight==='integrations' && (
            <div style={{width:240,background:'#fff',display:'flex',flexDirection:'column',overflow:'hidden'}}>
              <div style={{padding:'10px 12px',borderBottom:'1px solid #f0f0f0'}}>
                <div style={{display:'flex',alignItems:'center',gap:8,background:'#f5f5f5',border:'1px solid #e5e5e5',borderRadius:6,padding:'7px 10px',marginBottom:10}}>
                  <span style={{color:'#999',fontSize:13}}>🔍</span>
                  <input value={intSearch} onChange={e=>setIntSearch(e.target.value)} placeholder="Search"
                    style={{background:'transparent',border:'none',outline:'none',fontSize:13,color:'#333',width:'100%'}}/>
                </div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontSize:13,fontWeight:600,color:'#1a1a1a'}}>All Integrations</span>
                  <ChevronDown size={14} style={{color:'#999'}}/>
                </div>
              </div>
              <div style={{flex:1,overflowY:'auto'}}>
                {filteredInt.map(i=>(
                  <div key={i.name}
                    style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderBottom:'1px solid #f5f5f5',cursor:'pointer'}}
                    onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='#f8f9fa'}
                    onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}>
                    <IntegrationIcon name={i.name} color={i.color}/>
                    <span style={{flex:1,fontSize:13,color:(i as any).dim?'#aaa':'#1a1a1a'}}>{i.name}</span>
                    <ChevronRight size={13} style={{color:'#ccc'}}/>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Icon strip */}
          <div style={{width:72,background:'#fff',display:'flex',flexDirection:'column',alignItems:'center',padding:'12px 0',gap:2,borderLeft:'1px solid #e5e5e5'}}>
            {RIGHT_TABS.map(tab=>(
              <button key={tab.id} onClick={()=>setActiveRight(activeRight===tab.id?'':tab.id)}
                style={{width:60,padding:'10px 4px',display:'flex',flexDirection:'column',alignItems:'center',gap:5,border:'none',cursor:'pointer',borderRadius:8,background:activeRight===tab.id?'#f0f0f0':'none'}}>
                <span style={{fontSize:17,lineHeight:1}}>{tab.icon}</span>
                <span style={{fontSize:9,color:activeRight===tab.id?'#333':'#888',textAlign:'center' as const,lineHeight:1.3,whiteSpace:'pre-line' as const,fontWeight:activeRight===tab.id?600:400}}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom zoom bar */}
      <div style={{position:'absolute',bottom:16,left:'50%',transform:'translateX(-50%)',display:'flex',alignItems:'center',gap:8,background:'#fff',border:'1px solid #e5e5e5',borderRadius:8,padding:'6px 14px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
        <button style={{background:'none',border:'none',cursor:'pointer',fontSize:16,color:'#555',lineHeight:1}}>−</button>
        <span style={{fontSize:13,color:'#555',minWidth:36,textAlign:'center' as const}}>100%</span>
        <button style={{background:'none',border:'none',cursor:'pointer',fontSize:16,color:'#555',lineHeight:1}}>+</button>
        <div style={{width:1,height:14,background:'#e5e5e5',margin:'0 4px'}}/>
        <button style={{background:'none',border:'none',cursor:'pointer',color:'#888',display:'flex'}}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1h4v4H1zM9 1h4v4H9zM1 9h4v4H1zM9 9h4v4H9z" stroke="#888" strokeWidth="1.2"/></svg>
        </button>
      </div>

      {/* ── Template flow overlay ── */}
      {showTemplateFlow && (
        <div style={{position:'absolute',inset:0,background:'rgba(240,242,245,0.95)',zIndex:50,display:'flex',flexDirection:'column'}}>
          {/* Top progress bar */}
          <div style={{background:'#fff',flexShrink:0}}>
            {/* Blue progress line */}
            <div style={{height:3,background:'#48b5ea',width:flowStep===1?'33%':flowStep===2?'66%':'100%',transition:'width 0.3s'}}/>
            <StepBar step={flowStep}/>
          </div>

          {/* Step content */}
          <div style={{display:'flex',flexDirection:'column',margin:'24px auto',width:'100%',maxWidth:800,background:'transparent',flex:1,minHeight:0}}>
            <div style={{height:'75vh',background:'#fff',borderRadius:8,border:'1px solid #e5e5e5',overflow:'hidden',display:'flex',flexDirection:'column',boxShadow:'0 4px 24px rgba(0,0,0,0.08)'}}>
              {flowStep===1 && (
                <StepChooseSource
                  onContinue={handleTemplateChoose}
                  onCancel={()=>setTemplateFlow(null)}
                />
              )}
              {flowStep===2 && (
                <StepPickName
                  template={selectedTemplate}
                  onContinue={handleTemplateName}
                />
              )}
            </div>
          </div>

          {/* Close X */}
          <button onClick={()=>{setTemplateFlow(null);setFlowStep(1)}}
            style={{position:'absolute',top:16,right:16,width:32,height:32,borderRadius:'50%',background:'#e5e5e5',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <X size={14} style={{color:'#555'}}/>
          </button>
        </div>
      )}
    </div>
  )
}
