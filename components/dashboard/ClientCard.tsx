'use client'
import Link from 'next/link'
import { Client } from '@/types'

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const STATUS_COLOR: Record<string, string> = {
  active: '#10b981',
  review: '#f59e0b',
  paused: '#ef4444',
}

export default function ClientCard({ client }: { client: Client }) {
  return (
    <Link href={`/dashboard/clients/${client.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        position: 'relative', background: '#0c0f1a', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, padding: 16, cursor: 'pointer', overflow: 'hidden',
        transition: 'all 0.15s'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: client.color, borderRadius: '12px 12px 0 0' }} />
        <div style={{
          width: 36, height: 36, borderRadius: 9, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 12, fontWeight: 600, marginBottom: 12,
          background: client.color + '22', border: `1px solid ${client.color}40`, color: client.color
        }}>
          {initials(client.name)}
        </div>
        <p style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.8)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {client.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {client.platforms.slice(0, 2).join(' · ')}
          </p>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLOR[client.status] || '#10b981', flexShrink: 0, marginLeft: 8 }} />
        </div>
      </div>
    </Link>
  )
}
