'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutGrid, TrendingUp, FileText, Users, Database, Target, Bell, Layout, Zap, Settings, LogOut, BarChart2, Search, Download, BellRing, Briefcase, Hash } from 'lucide-react'

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

const label9 = { fontFamily:"'Barlow',sans-serif", fontSize:'9px', fontWeight:600, textTransform:'uppercase' as const, letterSpacing:'0.1em' }

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [search, setSearch] = useState('')
  const on = (href: string) => pathname.startsWith(href)

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#FAFAFA', fontFamily:"'DM Sans',sans-serif" }}>

      {/* Black icon rail */}
      <div style={{ width:52, minWidth:52, background:'#111111', display:'flex', flexDirection:'column', alignItems:'center', padding:'16px 0', gap:2 }}>
        <Link href="/dashboard/clients" style={{ width:32, height:32, background:'#20BB71', borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20, textDecoration:'none', flexShrink:0 }}>
          <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:13, fontWeight:700, color:'#111', letterSpacing:'0.05em' }}>P</span>
        </Link>
        {[
          {href:'/dashboard/clients', icon:LayoutGrid},
          {href:'/dashboard/datasources', icon:Database},
          {href:'/dashboard/reports', icon:FileText},
          {href:'/dashboard/rollup', icon:BarChart2},
          {href:'/dashboard/alerts', icon:Bell},
        ].map(({href, icon:Icon}) => (
          <Link key={href} href={href} style={{
            width:36, height:36, borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center',
            background: on(href) ? 'rgba(32,187,113,0.2)' : 'transparent',
            color: on(href) ? '#20BB71' : 'rgba(255,255,255,0.35)',
            textDecoration:'none', transition:'all 0.1s',
          }}>
            <Icon size={15}/>
          </Link>
        ))}
        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
          <Link href="/dashboard/settings" style={{ width:36, height:36, borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.35)', textDecoration:'none' }}>
            <Settings size={15}/>
          </Link>
          <button onClick={async()=>{await supabase.auth.signOut();router.push('/login')}}
            style={{ width:36, height:36, borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.35)', background:'transparent', border:'none', cursor:'pointer' }}>
            <LogOut size={15}/>
          </button>
        </div>
      </div>

      {/* White nav panel */}
      <div style={{ width:210, minWidth:210, background:'#FFFFFF', borderRight:'1px solid #E6E6E6', display:'flex', flexDirection:'column' }}>
        {/* Logo */}
        <div style={{ padding:'16px 16px 14px', borderBottom:'1px solid #E6E6E6', display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:24, height:24, background:'#20BB71', borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, fontWeight:700, color:'#111' }}>P</span>
          </div>
          <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, fontWeight:700, color:'#111111', letterSpacing:'0.1em', textTransform:'uppercase' as const }}>P360</span>
        </div>

        {/* Search */}
        <div style={{ padding:'10px 12px', borderBottom:'1px solid #F0F0F0' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, background:'#FAFAFA', border:'1px solid #E6E6E6', borderRadius:2, padding:'6px 10px' }}>
            <Search size={11} style={{ color:'#6B6B6B', flexShrink:0 }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
              style={{ background:'transparent', border:'none', outline:'none', color:'#333', fontSize:12, width:'100%', fontFamily:"'DM Sans',sans-serif" }}/>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
          {NAV.map((group, gi) => (
            <div key={gi} style={{ marginBottom:4 }}>
              {group.label && (
                <p style={{ ...label9, color:'#999', padding:'8px 16px 4px', display:'block' }}>{group.label}</p>
              )}
              {group.items.map(({ href, icon:Icon, label, badge }) => (
                <Link key={href} href={href} style={{
                  display:'flex', alignItems:'center', gap:10, padding:'8px 16px', cursor:'pointer',
                  background: on(href) ? '#C2FFE2' : 'transparent',
                  color: on(href) ? '#111111' : '#333',
                  fontSize:13, textDecoration:'none', fontWeight: on(href) ? 600 : 400,
                  borderRight: on(href) ? '3px solid #20BB71' : '3px solid transparent',
                  transition:'background 0.1s',
                }}>
                  <Icon size={14} style={{ flexShrink:0, color: on(href) ? '#20BB71' : '#6B6B6B' }}/>
                  <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{label}</span>
                  {badge && (
                    <span style={{ marginLeft:'auto', ...label9, background: on(href)?'#6FF5B5':'#E6E6E6', color: on(href)?'#111':'#6B6B6B', padding:'1px 6px', borderRadius:999 }}>{badge}</span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ borderTop:'1px solid #E6E6E6', padding:'6px 0' }}>
          <Link href="/dashboard/exports" style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 16px', color:'#333', fontSize:13, textDecoration:'none' }}>
            <Download size={14} style={{ color:'#6B6B6B' }}/><span>Exports</span>
          </Link>
          <Link href="/dashboard/notifications" style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 16px', color:'#333', fontSize:13, textDecoration:'none' }}>
            <BellRing size={14} style={{ color:'#6B6B6B' }}/><span>Notifications</span>
            <span style={{ marginLeft:'auto', background:'#F53619', color:'#fff', ...label9, padding:'1px 5px', borderRadius:999 }}>3</span>
          </Link>
          <div style={{ padding:'8px 16px', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:26, height:26, borderRadius:'50%', background:'#111111', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ ...label9, color:'#20BB71' }}>A</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:12, fontWeight:600, color:'#111', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Analytics (alloy...)</p>
              <p style={{ fontSize:10, color:'#6B6B6B', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>analytics@alloy...</p>
            </div>
            <button onClick={async()=>{await supabase.auth.signOut();router.push('/login')}}
              style={{ background:'none', border:'none', cursor:'pointer', color:'#6B6B6B', padding:2 }}>
              <LogOut size={12}/>
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {children}
      </div>
    </div>
  )
}
