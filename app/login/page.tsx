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

  const T = {
    ink:'#111111', line:'#E6E6E6', paper:'#FAFAFA', mute:'#6B6B6B',
    green1:'#20BB71', green4:'#C2FFE2',
    label: { fontFamily:"'Barlow',sans-serif", fontSize:'9px', fontWeight:600, textTransform:'uppercase' as const, letterSpacing:'0.12em' },
    body: { fontFamily:"'DM Sans',sans-serif" },
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard/clients')
  }

  return (
    <div style={{ minHeight:'100vh', background:T.paper, display:'flex', alignItems:'center', justifyContent:'center', padding:16, ...T.body }}>
      <div style={{ width:'100%', maxWidth:360 }}>
        {/* Logo lockup */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <img src="/logos/Alloy-Logo-BLK-Green.png" alt="Alloy Intelligence"
            style={{ height:24, width:'auto', objectFit:'contain', marginBottom:8 }}
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
          <p style={{ ...T.label, color:T.mute, marginTop:4 }}>INTELLIGENCE PLATFORM</p>
        </div>

        <div style={{ background:'#fff', border:`1px solid ${T.line}`, padding:32 }}>
          <h1 style={{ fontFamily:"'Aeonik','DM Sans',sans-serif", fontSize:20, fontWeight:400, color:T.ink, marginBottom:4, letterSpacing:'-0.02em' }}>Sign in</h1>
          <p style={{ ...T.label, color:T.mute, marginBottom:28 }}>ACCESS YOUR DASHBOARD</p>

          {error && (
            <div style={{ marginBottom:16, padding:'10px 12px', background:'#fff5f5', border:`1px solid #fcc`, fontSize:12, color:'#c00', ...T.body }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom:14 }}>
              <label style={{ ...T.label, color:T.mute, display:'block', marginBottom:6 }}>EMAIL</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@agency.com"
                style={{ width:'100%', background:T.paper, border:`1px solid ${T.line}`, padding:'9px 12px', color:T.ink, fontSize:13, outline:'none', boxSizing:'border-box' as const, ...T.body }}/>
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ ...T.label, color:T.mute, display:'block', marginBottom:6 }}>PASSWORD</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••"
                style={{ width:'100%', background:T.paper, border:`1px solid ${T.line}`, padding:'9px 12px', color:T.ink, fontSize:13, outline:'none', boxSizing:'border-box' as const, ...T.body }}/>
            </div>
            <button type="submit" disabled={loading}
              style={{ width:'100%', background:loading ? T.mute : T.green1, border:'none', padding:'11px', color:'#111', fontSize:11, fontWeight:700, cursor:'pointer', ...T.label, letterSpacing:'0.1em' }}>
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p style={{ textAlign:'center', marginTop:24, ...T.label, color:T.mute }}>
          ALLOY + INTELLIGENCE PLATFORM
        </p>
      </div>
    </div>
  )
}
