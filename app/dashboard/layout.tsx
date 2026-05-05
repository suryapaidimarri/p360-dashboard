'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Users, BarChart2, FileText, Target, Bell, Layout, Zap,
  Database, Hash, Settings, LogOut, Search, Download,
  BellRing, ChevronLeft, Briefcase, TrendingUp
} from 'lucide-react'

const NAV = [
  { items: [
    { href: '/dashboard/clients', icon: Users, label: 'Clients' },
    { href: '/dashboard/prospects', icon: Briefcase, label: 'Prospects' },
  ]},
  { label: 'ANALYSIS', items: [
    { href: '/dashboard/reports', icon: FileText, label: 'Reports' },
    { href: '/dashboard/rollup', icon: TrendingUp, label: 'Roll-up Dashboards' },
  ]},
  { label: 'PROJECT MANAGEMENT', items: [
    { href: '/dashboard/proposals', icon: Layout, label: 'Proposals' },
    { href: '/dashboard/goals', icon: Target, label: 'Goals' },
    { href: '/dashboard/alerts', icon: Bell, label: 'Alerts' },
  ]},
  { label: 'MANAGEMENT', items: [
    { href: '/dashboard/datasources', icon: Database, label: 'Data Sources' },
    { href: '/dashboard/metrics', icon: Hash, label: 'Custom Metrics' },
    { href: '/dashboard/templates', icon: Layout, label: 'Templates' },
    { href: '/dashboard/bulk', icon: Zap, label: 'Bulk Actions' },
  ]},
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [search, setSearch] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const on = (href: string) => pathname.startsWith(href)

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#f5f5f5' }}>
      {/* Sidebar */}
      <div style={{ width: collapsed ? 0 : 220, minWidth: collapsed ? 0 : 220, background:'#fff', borderRight:'1px solid #e5e5e5', display:'flex', flexDirection:'column', overflow:'hidden', transition:'all 0.2s' }}>
        {/* Logo */}
        <div style={{ padding:'16px 16px 12px', borderBottom:'1px solid #e5e5e5', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:'#1a1a2e', border:'2px solid #48b5ea', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ fontSize:10, fontWeight:700, color:'#fff' }}>360</span>
          </div>
          <span style={{ fontSize:13, fontWeight:700, color:'#1a1a2e', letterSpacing:'-0.2px', whiteSpace:'nowrap' }}>PARTNERSHIP360</span>
        </div>

        {/* Search */}
        <div style={{ padding:'10px 12px', borderBottom:'1px solid #f0f0f0' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f5f5f5', border:'1px solid #e5e5e5', borderRadius:6, padding:'6px 10px' }}>
            <Search size={12} style={{ color:'#999', flexShrink:0 }} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
              style={{ background:'transparent', border:'none', outline:'none', color:'#333', fontSize:12, width:'100%' }} />
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
          {NAV.map((group, gi) => (
            <div key={gi} style={{ marginBottom:4 }}>
              {group.label && (
                <p style={{ fontSize:10, fontWeight:600, color:'#999', letterSpacing:'0.06em', padding:'8px 16px 4px', textTransform:'uppercase' as const }}>{group.label}</p>
              )}
              {group.items.map(({ href, icon: Icon, label }) => (
                <Link key={href} href={href} style={{
                  display:'flex', alignItems:'center', gap:10, padding:'8px 16px',
                  background: on(href) ? '#ebf7ff' : 'transparent',
                  color: on(href) ? '#1a85c8' : '#333',
                  fontSize:13, textDecoration:'none', fontWeight: on(href) ? 600 : 400,
                  borderRight: on(href) ? '3px solid #48b5ea' : '3px solid transparent',
                }}>
                  <Icon size={15} style={{ flexShrink:0 }} />
                  <span style={{ whiteSpace:'nowrap' }}>{label}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ borderTop:'1px solid #e5e5e5', padding:'8px 0' }}>
          <Link href="/dashboard/exports" style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 16px', color:'#333', fontSize:13, textDecoration:'none' }}>
            <Download size={15} /><span>Exports</span>
          </Link>
          <Link href="/dashboard/notifications" style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 16px', color:'#333', fontSize:13, textDecoration:'none' }}>
            <BellRing size={15} /><span>Notifications</span>
            <span style={{ marginLeft:'auto', background:'#ef4444', color:'#fff', fontSize:10, fontWeight:600, padding:'1px 5px', borderRadius:999 }}>3</span>
          </Link>
          <div style={{ padding:'8px 16px', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'#1a1a2e', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontSize:10, fontWeight:700, color:'#fff' }}>A</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:12, fontWeight:600, color:'#1a1a1a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Analytics (alloy...)</p>
              <p style={{ fontSize:10, color:'#999', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>analytics@alloy...</p>
            </div>
            <button onClick={async()=>{await supabase.auth.signOut();router.push('/login')}}
              style={{ background:'none', border:'none', cursor:'pointer', color:'#999', padding:2 }}>
              <LogOut size={13} />
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
