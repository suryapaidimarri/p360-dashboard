'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutGrid, TrendingUp, FileText, Database, Target, Bell, Layout, Zap, LogOut, BarChart2, Search, Download, BellRing, Briefcase, Hash, Settings } from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { items: [
    { href:'/dashboard/clients', icon:LayoutGrid, label:'Clients', badge:'60' },
    { href:'/dashboard/prospects', icon:Briefcase, label:'Prospects' },
  ]},
  { label:'ANALYSIS', items:[
    { href:'/dashboard/reports', icon:FileText, label:'Reports' },
    { href:'/dashboard/rollup', icon:TrendingUp, label:'Roll-up Dashboards' },
  ]},
  { label:'PROJECT MANAGEMENT', items:[
    { href:'/dashboard/proposals', icon:Layout, label:'Proposals' },
    { href:'/dashboard/goals', icon:Target, label:'Goals' },
    { href:'/dashboard/alerts', icon:Bell, label:'Alerts' },
  ]},
  { label:'MANAGEMENT', items:[
    { href:'/dashboard/datasources', icon:Database, label:'Data Sources' },
    { href:'/dashboard/metrics', icon:Hash, label:'Custom Metrics' },
    { href:'/dashboard/templates', icon:Layout, label:'Templates' },
    { href:'/dashboard/bulk', icon:Zap, label:'Bulk Actions' },
  ]},
]

const T = {
  ink: '#111111',
  paper: '#FAFAFA',
  white: '#FFFFFF',
  line: '#E6E6E6',
  mute: '#6B6B6B',
  green1: '#20BB71',
  green4: '#C2FFE2',
  blue1: '#48B5EA',
  red1: '#F53619',
  label: { fontFamily:"'Barlow',sans-serif", fontSize:'9px' as const, fontWeight:600, textTransform:'uppercase' as const, letterSpacing:'0.12em' },
  body: { fontFamily:"'DM Sans',sans-serif" },
  display: { fontFamily:"'Aeonik','DM Sans',sans-serif" },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [search, setSearch] = useState('')
  const on = (href: string) => pathname.startsWith(href)

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:T.paper, ...T.body }}>

      {/* Black icon rail */}
      <div style={{ width:48, minWidth:48, background:T.ink, display:'flex', flexDirection:'column', alignItems:'center', padding:'14px 0', gap:2, borderRight:'1px solid #222' }}>
        {/* Alloy mark */}
        <Link href="/dashboard/clients" style={{ marginBottom:20, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <img src="/logos/Alloy-Logo-WHT-Green.png" alt="Alloy Intelligence" style={{ width:28, height:'auto', objectFit:'contain' }}
            onError={e => {
              e.currentTarget.style.display = 'none'
              const span = document.createElement('span')
              span.style.cssText = 'font-family:Barlow,sans-serif;font-size:11px;font-weight:700;color:#20BB71;letter-spacing:0.1em'
              span.textContent = 'AI'
              e.currentTarget.parentElement?.appendChild(span)
            }}
          />
        </Link>
        {[
          {href:'/dashboard/clients', icon:LayoutGrid},
          {href:'/dashboard/datasources', icon:Database},
          {href:'/dashboard/reports', icon:FileText},
          {href:'/dashboard/rollup', icon:BarChart2},
          {href:'/dashboard/alerts', icon:Bell},
        ].map(({href, icon:Icon}) => (
          <Link key={href} href={href} className="alloy-rail-link" style={{
            width:36, height:36, borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center',
            background: on(href) ? 'rgba(32,187,113,0.15)' : 'transparent',
            color: on(href) ? T.green1 : 'rgba(255,255,255,0.3)',
            textDecoration:'none',
          }}>
            <Icon size={15} strokeWidth={1.5}/>
          </Link>
        ))}
        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
          <Link href="/dashboard/settings" className="alloy-rail-link" style={{ width:36, height:36, borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.3)', textDecoration:'none' }}>
            <Settings size={15} strokeWidth={1.5}/>
          </Link>
          <button onClick={async()=>{await supabase.auth.signOut();router.push('/login')}}
            className="alloy-rail-link"
            style={{ width:36, height:36, borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.3)', background:'transparent', border:'none' }}>
            <LogOut size={15} strokeWidth={1.5}/>
          </button>
        </div>
      </div>

      {/* White nav panel */}
      <div data-sidebar style={{ width:216, minWidth:216, background:T.white, borderRight:`1px solid ${T.line}`, display:'flex', flexDirection:'column' }}>
        {/* Brand */}
        <div style={{ padding:'16px 16px 14px', borderBottom:`1px solid ${T.line}`, display:'flex', alignItems:'center', gap:10 }}>
          <img src="/logos/Alloy-Logo-BLK-Green.png" alt="Alloy Intelligence"
            style={{ height:18, width:'auto', objectFit:'contain' }}
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
          <div style={{ display:'flex', flexDirection:'column' }}>
            <span style={{ ...T.label, fontSize:'10px', color:T.ink, letterSpacing:'0.08em' }}>INTELLIGENCE</span>
          </div>
        </div>

        {/* Search */}
        <div style={{ padding:'10px 12px', borderBottom:`1px solid ${T.paper}` }}>
          <div className="alloy-search" style={{ display:'flex', alignItems:'center', gap:6, background:T.paper, border:`1px solid ${T.line}`, padding:'6px 10px', borderRadius:2, transition:'border-color 0.18s ease, box-shadow 0.18s ease' }}>
            <Search size={11} style={{ color:T.mute, flexShrink:0 }} strokeWidth={1.5}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
              style={{ background:'transparent', border:'none', outline:'none', color:T.ink, fontSize:12, width:'100%', fontFamily:"'DM Sans',sans-serif" }}/>
          </div>
        </div>

        {/* Nav — staggered entrance */}
        <div className="a-stagger" style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
          {NAV.map((group, gi) => (
            <div key={gi} className="a-slideup" style={{ marginBottom:2, animationDelay:`${gi * 40}ms` }}>
              {group.label && (
                <p style={{ ...T.label, color:T.mute, padding:'10px 16px 4px', display:'block', fontSize:'9px' }}>{group.label}</p>
              )}
              {group.items.map(({ href, icon:Icon, label, badge }: any) => (
                <Link key={href} href={href}
                  className={`alloy-nav-link${on(href) ? ' active' : ''}`}
                  style={{
                    display:'flex', alignItems:'center', gap:9, padding:'8px 16px',
                    background: on(href) ? T.green4 : 'transparent',
                    color: on(href) ? T.ink : '#2A2A2A',
                    fontSize:13, textDecoration:'none', fontWeight: on(href) ? 500 : 400,
                    borderRight: on(href) ? `2px solid ${T.green1}` : '2px solid transparent',
                    ...T.body,
                  }}>
                  <Icon size={14} style={{ flexShrink:0, color: on(href) ? T.green1 : T.mute, transition:'color 0.18s ease' }} strokeWidth={1.5}/>
                  <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{label}</span>
                  {badge && (
                    <span className="alloy-nav-badge" style={{ marginLeft:'auto', ...T.label, fontSize:'9px',
                      background: on(href) ? T.green1 : T.line,
                      color: on(href) ? T.white : T.mute,
                      padding:'2px 6px', borderRadius:999 }}>
                      {badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ borderTop:`1px solid ${T.line}`, padding:'6px 0' }}>
          <Link href="/dashboard/exports" className="alloy-nav-link" style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 16px', color:'#2A2A2A', fontSize:13, textDecoration:'none', borderRight:'2px solid transparent', ...T.body }}>
            <Download size={14} style={{ color:T.mute }} strokeWidth={1.5}/><span>Exports</span>
          </Link>
          <Link href="/dashboard/notifications" className="alloy-nav-link" style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 16px', color:'#2A2A2A', fontSize:13, textDecoration:'none', borderRight:'2px solid transparent', ...T.body }}>
            <BellRing size={14} style={{ color:T.mute }} strokeWidth={1.5}/><span>Notifications</span>
            <span style={{ marginLeft:'auto', background:T.red1, color:T.white, ...T.label, fontSize:'9px', padding:'2px 5px', borderRadius:999, animation:'a-fadein 0.3s ease both' }}>3</span>
          </Link>
          {/* User row */}
          <div style={{ padding:'8px 16px', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:26, height:26, borderRadius:'50%', background:T.ink, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ ...T.label, fontSize:'9px', color:T.green1 }}>A</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:12, fontWeight:500, color:T.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', ...T.body }}>Analytics (alloy...)</p>
              <p style={{ fontSize:10, color:T.mute, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>analytics@alloy...</p>
            </div>
            <button onClick={async()=>{await supabase.auth.signOut();router.push('/login')}}
              style={{ background:'none', border:'none', cursor:'pointer', color:T.mute, padding:2, transition:'color 0.15s ease, transform 0.1s ease' }}
              onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.color=T.red1}
              onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.color=T.mute}>
              <LogOut size={12} strokeWidth={1.5}/>
            </button>
          </div>
        </div>
      </div>

      {/* Main content — fades in on route change */}
      <div data-main-content style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {children}
      </div>
    </div>
  )
}
