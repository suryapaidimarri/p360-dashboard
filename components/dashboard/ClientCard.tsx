'use client'
import Link from 'next/link'
import { Client } from '@/types'

const TINTS: Record<string, string> = {
  '#20BB71': '#C2FFE2', '#48B5EA': '#E1F7FF',
  '#F9B62A': '#FFEECA', '#F64674': '#FFCFDC',
  '#F53619': '#FFCFDC',
}
const STATUS: Record<string, string> = { active:'#20BB71', review:'#F9B62A', paused:'#F53619' }

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
}

export default function ClientCard({ client }: { client: Client }) {
  const tint = TINTS[client.color] || '#E6E6E6'
  return (
    <Link href={`/dashboard/clients/${client.id}`} style={{ textDecoration:'none', display:'block' }}>
      <div style={{ position:'relative', background:'#FFFFFF', border:'1px solid #E6E6E6', borderRadius:2, padding:14, cursor:'pointer', overflow:'hidden', transition:'all 0.12s' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:client.color }} />
        <div style={{ width:32, height:32, borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Barlow',sans-serif", fontSize:11, fontWeight:700, marginBottom:10, background:tint, color:'#111' }}>
          {initials(client.name)}
        </div>
        <p style={{ fontSize:12, fontWeight:500, color:'#111111', marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontFamily:"'DM Sans',sans-serif" }}>
          {client.name}
        </p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:9, color:'#6B6B6B', textTransform:'uppercase', letterSpacing:'0.04em', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {client.platforms.slice(0,2).join(' · ')}
          </p>
          <div style={{ width:5, height:5, borderRadius:'50%', background:STATUS[client.status]||'#20BB71', flexShrink:0, marginLeft:6 }} />
        </div>
      </div>
    </Link>
  )
}
