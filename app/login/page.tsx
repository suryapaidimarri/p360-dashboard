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

  return (
    <div style={{ minHeight:'100vh', background:'#f5f5f5', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ width:'100%', maxWidth:380 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:32, justifyContent:'center' }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:'#1a1a2e', border:'2px solid #48b5ea', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:12, fontWeight:700, color:'#fff' }}>360</span>
          </div>
          <span style={{ fontSize:16, fontWeight:700, color:'#1a1a2e', letterSpacing:'-0.3px' }}>PARTNERSHIP360</span>
        </div>
        <div style={{ background:'#fff', border:'1px solid #e5e5e5', borderRadius:8, padding:32 }}>
          <h1 style={{ fontSize:18, fontWeight:600, color:'#1a1a1a', marginBottom:4 }}>Sign in</h1>
          <p style={{ fontSize:13, color:'#6b6b6b', marginBottom:24 }}>Access your P360 dashboard</p>
          {error && <div style={{ marginBottom:16, padding:'10px 12px', borderRadius:6, background:'#fff0f0', border:'1px solid #fcc', fontSize:12, color:'#c00' }}>{error}</div>}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#6b6b6b', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6 }}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@agency.com"
                style={{ width:'100%', background:'#fafafa', border:'1px solid #e5e5e5', borderRadius:6, padding:'9px 12px', color:'#1a1a1a', fontSize:13, outline:'none', boxSizing:'border-box' }} />
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#6b6b6b', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6 }}>Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••"
                style={{ width:'100%', background:'#fafafa', border:'1px solid #e5e5e5', borderRadius:6, padding:'9px 12px', color:'#1a1a1a', fontSize:13, outline:'none', boxSizing:'border-box' }} />
            </div>
            <button type="submit" disabled={loading} style={{ width:'100%', background:'#48b5ea', border:'none', borderRadius:6, padding:'10px', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', opacity:loading?0.7:1 }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
