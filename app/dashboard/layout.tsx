'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutGrid, TrendingUp, FileText, Users, Database, Target, Bell, Layout, Zap, Settings, LogOut, BarChart2, Search } from 'lucide-react'

const NAV = [
  { label: 'Main', items: [
    { href: '/dashboard/clients', icon: LayoutGrid, label: 'Clients', badge: '60' },
    { href: '/dashboard/prospects', icon: Users, label: 'Prospects' },
    { href: '/dashboard/rollup', icon: TrendingUp, label: 'Roll-up' },
  ]},
  { label: 'Tools', items: [
    { href: '/dashboard/datasources', icon: Database, label: 'Data Sources' },
    { href: '/dashboard/reports', icon: FileText, label: 'Reports' },
    { href: '/dashboard/goals', icon: Target, label: 'Goals' },
    { href: '/dashboard/alerts', icon: Bell, label: 'Alerts' },
    { href: '/dashboard/templates', icon: Layout, label: 'Templates' },
    { href: '/dashboard/bulk', icon: Zap, label: 'Bulk Actions' },
  ]}
]

const RAIL = [
  { href: '/dashboard/clients', icon: LayoutGrid },
  { href: '/dashboard/datasources', icon: Database },
  { href: '/dashboard/reports', icon: FileText },
  { href: '/dashboard/rollup', icon: BarChart2 },
  { href: '/dashboard/alerts', icon: Bell },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [search, setSearch] = useState('')
  const on = (href: string) => pathname.startsWith(href)

  const railItem = (href: string, Icon: React.ElementType) => ({
    width:36, height:36, borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center',
    background: on(href) ? 'rgba(32,187,113,0.2)' : 'transparent',
    color: on(href) ? '#20BB71' : 'rgba(255,255,255,0.35)',
    textDecoration:'none', cursor:'pointer', transition:'all 0.1s',
  })

  const navItem = (href: string) => ({
    display:'flex', alignItems:'center', gap:8, padding:'7px 8px', borderRadius:2,
    background: on(href) ? '#C2FFE2' : 'transparent',
    color: on(href) ? '#111111' : '#2A2A2A',
    fontSize:12, textDecoration:'none', marginBottom:1, cursor:'pointer',
    fontFamily:"'DM Sans', sans-serif",
  })

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#FAFAFA', fontFamily:"'DM Sans',sans-serif" }}>
      {/* Black icon rail */}
      <div style={{ width:52, minWidth:52, background:'#111111', display:'flex', flexDirection:'column', alignItems:'center', padding:'16px 0', gap:2 }}>
        <Link href="/dashboard/clients" style={{ width:32, height:32, background:'#20BB71', borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20, textDecoration:'none' }}>
          <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:13, fontWeight:700, color:'#111', letterSpacing:'0.05em' }}>P</span>
        </Link>
        {RAIL.map(({ href, icon: Icon }) => (
          <Link key={href} href={href} style={railItem(href, Icon)}>
            <Icon size={15} />
          </Link>
        ))}
        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
          <Link href="/dashboard/settings" style={railItem('/dashboard/settings', Settings)}>
            <Settings size={15} />
          </Link>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
            style={{ width:36, height:36, borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.35)', background:'transparent', border:'none', cursor:'pointer' }}>
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {/* White nav panel */}
      <div style={{ width:196, minWidth:196, background:'#FFFFFF', borderRight:'1px solid #E6E6E6', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'18px 16px', borderBottom:'1px solid #E6E6E6', display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:22, height:22, background:'#20BB71', borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:10, fontWeight:700, color:'#111' }}>P</span>
          </div>
          <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, fontWeight:700, color:'#111111', letterSpacing:'0.1em', textTransform:'uppercase' }}>P360</span>
        </div>
        <div style={{ padding:'12px 8px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, background:'#FAFAFA', border:'1px solid #E6E6E6', borderRadius:2, padding:'6px 10px' }}>
            <Search size={11} style={{ color:'#6B6B6B', flexShrink:0 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              style={{ background:'transparent', border:'none', outline:'none', color:'#111', fontSize:12, width:'100%', fontFamily:"'DM Sans',sans-serif" }} />
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'0 8px' }}>
          {NAV.map(group => (
            <div key={group.label} style={{ marginBottom:20 }}>
              <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, fontWeight:600, color:'#6B6B6B', textTransform:'uppercase', letterSpacing:'0.12em', padding:'0 8px 6px' }}>{group.label}</p>
              {group.items.map(({ href, icon: Icon, label, badge }) => (
                <Link key={href} href={href} style={navItem(href)}>
                  <Icon size={13} style={{ flexShrink:0, color: on(href) ? '#111' : '#6B6B6B' }} />
                  <span>{label}</span>
                  {badge && <span style={{ marginLeft:'auto', fontFamily:"'Barlow',sans-serif", fontSize:9, background: on(href) ? '#6FF5B5' : '#E6E6E6', color: on(href) ? '#111' : '#6B6B6B', padding:'1px 6px', borderRadius:999 }}>{badge}</span>}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:'#FAFAFA' }}>
        {children}
      </div>
    </div>
  )
}
