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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [search, setSearch] = useState('')
  const active = (href: string) => pathname.startsWith(href)

  return (
    <div style={{display:'flex',height:'100vh',overflow:'hidden',background:'#05070d'}}>
      <div style={{width:56,minWidth:56,background:'#080b12',borderRight:'1px solid rgba(255,255,255,0.05)',display:'flex',flexDirection:'column',alignItems:'center',padding:'16px 0',gap:4}}>
        <Link href="/dashboard/clients" style={{width:32,height:32,borderRadius:10,background:'#1a1f35',border:'1px solid rgba(99,102,241,0.4)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20,textDecoration:'none'}}>
          <span style={{fontSize:13,fontWeight:600,color:'#818cf8'}}>P</span>
        </Link>
        {[{href:'/dashboard/clients',icon:LayoutGrid},{href:'/dashboard/datasources',icon:Database},{href:'/dashboard/reports',icon:FileText},{href:'/dashboard/rollup',icon:BarChart2},{href:'/dashboard/alerts',icon:Bell}].map(({href,icon:Icon})=>(
          <Link key={href} href={href} style={{width:36,height:36,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',background:active(href)?'rgba(99,102,241,0.15)':'transparent',color:active(href)?'#818cf8':'rgba(255,255,255,0.25)',textDecoration:'none'}}>
            <Icon size={16}/>
          </Link>
        ))}
        <div style={{marginTop:'auto',display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
          <Link href="/dashboard/settings" style={{width:36,height:36,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.25)',textDecoration:'none'}}>
            <Settings size={16}/>
          </Link>
          <button onClick={async()=>{await supabase.auth.signOut();router.push('/login')}} style={{width:36,height:36,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.25)',background:'transparent',border:'none',cursor:'pointer'}}>
            <LogOut size={16}/>
          </button>
        </div>
      </div>
      <div style={{width:208,minWidth:208,background:'#080b12',borderRight:'1px solid rgba(255,255,255,0.05)',display:'flex',flexDirection:'column',padding:'20px 0'}}>
        <div style={{padding:'0 16px 16px'}}>
          <p style={{fontSize:9,fontWeight:500,color:'rgba(255,255,255,0.2)',textTransform:'uppercase',letterSpacing:'1.2px',marginBottom:12}}>Workspace</p>
          <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:8,padding:'7px 10px'}}>
            <Search size={11} style={{color:'rgba(255,255,255,0.2)',flexShrink:0}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{background:'transparent',border:'none',outline:'none',color:'rgba(255,255,255,0.6)',fontSize:12,width:'100%',fontFamily:'inherit'}}/>
          </div>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'0 8px'}}>
          {NAV.map(group=>(
            <div key={group.label} style={{marginBottom:20}}>
              <p style={{fontSize:9,fontWeight:500,color:'rgba(255,255,255,0.18)',textTransform:'uppercase',letterSpacing:'1.2px',padding:'0 8px 6px'}}>{group.label}</p>
              {group.items.map(({href,icon:Icon,label,badge})=>(
                <Link key={href} href={href} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 8px',borderRadius:7,color:active(href)?'#a5b4fc':'rgba(255,255,255,0.38)',background:active(href)?'rgba(99,102,241,0.12)':'transparent',fontSize:12,textDecoration:'none',marginBottom:1}}>
                  <Icon size={13} style={{flexShrink:0}}/>
                  <span>{label}</span>
                  {badge&&<span style={{marginLeft:'auto',fontSize:10,background:'rgba(99,102,241,0.18)',color:'#818cf8',padding:'1px 6px',borderRadius:20}}>{badge}</span>}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>{children}</div>
    </div>
  )
}
