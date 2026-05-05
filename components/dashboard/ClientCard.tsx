'use client'
import Link from 'next/link'
import { Client } from '@/types'
import { useState } from 'react'

export default function ClientCard({ client }: { client: Client }) {
  const [imgError, setImgError] = useState(false)
  return (
    <Link href={`/dashboard/clients/${client.id}`} style={{ textDecoration:'none', display:'block' }}>
      <div style={{ background:'#fff', border:'1px solid #e5e5e5', borderRadius:8, padding:16, textAlign:'center', cursor:'pointer' }}>
        {client.logo_url && !imgError ? (
          <img src={client.logo_url} alt={client.name} onError={()=>setImgError(true)}
            style={{ width:80, height:80, objectFit:'contain', margin:'0 auto 12px', display:'block' }} />
        ) : (
          <div style={{ width:80, height:80, borderRadius:8, background:'#e0e0e0', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:22, fontWeight:700, color:'#666' }}>
            {client.name[0]}
          </div>
        )}
        <p style={{ fontSize:12, fontWeight:600, color:'#1a1a1a' }}>{client.name}</p>
      </div>
    </Link>
  )
}
