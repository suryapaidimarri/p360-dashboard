'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard/clients')
  }

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8, padding: '10px 12px', color: 'rgba(255,255,255,0.8)', fontSize: 13,
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const
  }

  return (
    <div style={{ minHeight: '100vh', background: '#05070d', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, justifyContent: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#1a1f35', border: '1px solid rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#818cf8' }}>P</span>
          </div>
          <span style={{ fontSize: 20, fontWeight: 600, color: '#f0f2ff', letterSpacing: '-0.5px' }}>P360</span>
        </div>
        <div style={{ background: '#0c0f1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 32 }}>
          <h1 style={{ fontSize: 17, fontWeight: 600, color: '#f0f2ff', marginBottom: 4 }}>Welcome back</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 28 }}>Sign in to your P360 dashboard</p>
          {error && (
            <div style={{ marginBottom: 20, padding: '10px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 12, color: '#f87171' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 8 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@agency.com" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 8 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={inputStyle} />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', background: loading ? 'rgba(79,70,229,0.6)' : '#4f46e5', border: 'none',
              borderRadius: 8, padding: '11px', color: 'white', fontSize: 13, fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit'
            }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.15)', marginTop: 20 }}>P360 Marketing Dashboard</p>
      </div>
    </div>
  )
}
