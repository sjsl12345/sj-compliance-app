import Head from 'next/head'
import Link from 'next/link'
import BetaBanner from '../components/BetaBanner'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

const PF = { fontFamily: "'Playfair Display', Georgia, serif" }
const DM = { fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }

export default function Login() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
      if (error) throw error
      if (form.email === 'stephanie@sjremotesolutions.co.uk') router.push('/admin')
      else router.push('/dashboard')
    } catch {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Sign in — SJ Remote Solutions</title></Head>
      <div style={{ minHeight: '100vh', background: '#FAFAF9', ...DM }}>
        <BetaBanner />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 48px)', padding: '2rem 1.5rem' }}>
          <div style={{ width: '100%', maxWidth: 420 }}>

            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: '1.5rem' }}>
                <div style={{ width: 36, height: 36, background: '#2E2E2E', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>SJ</span>
                </div>
                <span style={{ ...PF, fontSize: '1.05rem', fontWeight: 500, color: '#2E2E2E' }}>SJ Remote Solutions</span>
              </Link>
              <h1 style={{ ...PF, fontSize: '1.75rem', fontWeight: 500, color: '#2E2E2E', marginBottom: '0.5rem' }}>Welcome back</h1>
              <p style={{ color: '#9B9B9B', fontSize: '0.9rem' }}>Sign in to view your compliance dashboard</p>
            </div>

            {/* Card */}
            <div style={{ background: 'white', border: '1px solid #EBEBEB', borderRadius: 16, padding: '2rem', boxShadow: '0 2px 12px rgba(46,46,46,0.06)' }}>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9B9B9B', marginBottom: '0.375rem' }}>Email address</label>
                  <input className="input" type="email" required placeholder="you@youragency.co.uk"
                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9B9B9B', marginBottom: '0.375rem' }}>Password</label>
                  <input className="input" type="password" required
                    value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                </div>
                {error && (
                  <div style={{ background: '#FAF0EF', border: '1px solid #EDCBC7', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#7A2E26', marginBottom: '1.25rem' }}>{error}</div>
                )}
                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem' }}>
                  {loading ? 'Signing in…' : 'Sign in →'}
                </button>
              </form>
              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#9B9B9B', marginTop: '1.25rem' }}>
                Don&apos;t have an account?{' '}
                <Link href="/register" style={{ color: '#3DCFBF', fontWeight: 500, textDecoration: 'none' }}>Get started free</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
