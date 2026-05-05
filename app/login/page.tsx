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

  const S = {
    page: { minHeight:'100vh', background:'#FAFAFA', display:'flex', alignItems:'center', justifyContent:'center', padding:16, fontFamily:"'DM Sans', sans-serif" },
    wrap: { width:'100%', maxWidth:380 },
    brand: { display:'flex', alignItems:'center', gap:10, marginBottom:40, justifyContent:'center' },
    mark: { width:36, height:36, background:'#111111', borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center' },
    markText: { fontFamily:"'Barlow',sans-serif", fontSize:14, fontWeight:700, color:'#20BB71', letterSpacing:'0.05em' },
    brandName: { fontFamily:"'Barlow',sans-serif", fontSize:14, fontWeight:700, color:'#111111', letterSpacing:'0.12em', textTransform:'uppercase' as const },
    card: { background:'#FFFFFF', border:'1px solid #E6E6E6', borderRadius:2, padding:32 },
    title: { fontSize:20, fontWeight:300, color:'#111111', marginBottom:4, fontFamily:"'DM Sans',sans-serif", letterSpacing:'-0.3px' },
    sub: { fontFamily:"'Barlow',sans-serif", fontSize:10, color:'#6B6B6B', marginBottom:28, letterSpacing:'0.08em', textTransform:'uppercase' as const },
    error: { marginBottom:20, padding:'10px 14px', borderRadius:2, background:'#FFCFDC', border:'1px solid #F64674', fontSize:12, color:'#111' },
    label: { display:'block', fontFamily:"'Barlow',sans-serif", fontSize:9, fontWeight:600, color:'#6B6B6B', textTransform:'uppercase' as const, letterSpacing:'0.1em', marginBottom:6 },
    input: { width:'100%', background:'#FAFAFA', border:'1px solid #E6E6E6', borderRadius:2, padding:'10px 12px', color:'#111111', fontSize:13, outline:'none', fontFamily:"'DM Sans',sans-serif", boxSizing:'border-box' as const },
    btn: { width:'100%', background:'#20BB71', border:'none', borderRadius:2, padding:'11px', color:'#111111', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:"'Barlow',sans-serif", letterSpacing:'0.08em', textTransform:'uppercase' as const, marginTop:8 },
    footer: { textAlign:'center' as const, fontFamily:"'Barlow',sans-serif", fontSize:9, color:'#6B6B6B', marginTop:20, letterSpacing:'0.1em', textTransform:'uppercase' as const },
  }

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <div style={S.brand}>
          <div style={S.mark}><span style={S.markText}>P</span></div>
          <span style={S.brandName}>P360</span>
        </div>
        <div style={S.card}>
          <h1 style={S.title}>Welcome back</h1>
          <p style={S.sub}>Sign in to your dashboard</p>
          {error && <div style={S.error}>{error}</div>}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom:16 }}>
              <label style={S.label}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@agency.com" style={S.input} />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={S.label}>Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" style={S.input} />
            </div>
            <button type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
        <p style={S.footer}>P360 Marketing Dashboard · Alloy Agency</p>
      </div>
    </div>
  )
}
