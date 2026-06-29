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
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
      if (error) throw error
      if (form.email === 'stephanie@sjremotesolutions.co.uk') router.push('/admin')
      else router.push('/portal')
    } catch {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgot(e) {
    e.preventDefault()
    setForgotLoading(true)
    setForgotError('')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setForgotSent(true)
    } catch {
      setForgotError('Could not send reset email. Please check the address and try again.')
    } finally {
      setForgotLoading(false)
    }
  }

  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9B9B9B', marginBottom: '0.375rem' }

  return (
    <>
      <Head><title>Sign in — SJ Remote Solutions</title></Head>
      <div style={{ minHeight: '100vh', background: '#FAFAF9', ...DM }}>
        <BetaBanner />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 48px)', padding: '2rem 1.5rem' }}>
          <div style={{ width: '100%', maxWidth: 420 }}>

            {/* Hero SVG logo */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
                <svg width="100%" viewBox="0 0 680 320" role="img" style={{ maxWidth: 280, margin: '0 auto', display: 'block' }}>
                  <title>SJ Remote Solutions</title>
                  <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&display=swap');.pf{font-family:'Playfair Display',Georgia,serif}`}</style>
                  <line x1="240" y1="52" x2="460" y2="52" stroke="#3DCFBF" strokeWidth="1.5" opacity="0.5"/>
                  <text x="82" y="255" className="pf" fontSize="220" fontWeight="700" fill="#2E2E2E" letterSpacing="-8" textAnchor="middle">SJ</text>
                  <line x1="40" y1="270" x2="168" y2="270" stroke="#3DCFBF" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="198" y1="80" x2="198" y2="265" stroke="#EBEBEB" strokeWidth="1"/>
                  <text x="224" y="158" className="pf" fontSize="58" fontWeight="700" fill="#2E2E2E" letterSpacing="6" textAnchor="start">REMOTE</text>
                  <text x="224" y="228" className="pf" fontSize="58" fontWeight="700" fill="#3DCFBF" letterSpacing="3" textAnchor="start">SOLUTIONS</text>
                  <line x1="240" y1="278" x2="460" y2="278" stroke="#3DCFBF" strokeWidth="1.5" opacity="0.5"/>
                  <text x="224" y="302" className="pf" fontSize="13" fontWeight="400" fill="#9B9B9B" letterSpacing="3" textAnchor="start" fontStyle="italic">AI Governance &amp; Compliance</text>
                </svg>
              </Link>
            </div>

            {/* Card */}
            <div style={{ background: 'white', border: '1px solid #EBEBEB', borderRadius: 16, padding: '2rem', boxShadow: '0 2px 12px rgba(46,46,46,0.06)' }}>

              {!forgotMode ? (
                <>
                  <h1 style={{ ...PF, fontSize: '1.5rem', fontWeight: 500, color: '#2E2E2E', marginBottom: '0.25rem', textAlign: 'center' }}>Welcome back</h1>
                  <p style={{ color: '#9B9B9B', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.75rem' }}>Sign in to your compliance dashboard</p>
                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={labelStyle}>Email address</label>
                      <input className="input" type="email" required placeholder="you@youragency.co.uk"
                        value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label style={labelStyle}>Password</label>
                      <input className="input" type="password" required
                        value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                    </div>
                    <div style={{ textAlign: 'right', marginBottom: '1.25rem' }}>
                      <button type="button" onClick={() => { setForgotMode(true); setForgotEmail(form.email) }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#3DCFBF', fontFamily: 'inherit' }}>
                        Forgot password?
                      </button>
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
                </>
              ) : (
                <>
                  <h1 style={{ ...PF, fontSize: '1.5rem', fontWeight: 500, color: '#2E2E2E', marginBottom: '0.25rem', textAlign: 'center' }}>Reset your password</h1>
                  <p style={{ color: '#9B9B9B', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.75rem' }}>
                    Enter your email and we&apos;ll send you a reset link.
                  </p>
                  {forgotSent ? (
                    <div style={{ background: '#EAF8F6', border: '1px solid #B0E8E2', borderRadius: 10, padding: '1rem', fontSize: '0.9rem', color: '#1A7A6E', textAlign: 'center', marginBottom: '1.25rem' }}>
                      ✓ Reset link sent! Check your inbox.
                    </div>
                  ) : (
                    <form onSubmit={handleForgot}>
                      <div style={{ marginBottom: '1.25rem' }}>
                        <label style={labelStyle}>Email address</label>
                        <input className="input" type="email" required placeholder="you@youragency.co.uk"
                          value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
                      </div>
                      {forgotError && (
                        <div style={{ background: '#FAF0EF', border: '1px solid #EDCBC7', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#7A2E26', marginBottom: '1.25rem' }}>{forgotError}</div>
                      )}
                      <button type="submit" disabled={forgotLoading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem' }}>
                        {forgotLoading ? 'Sending…' : 'Send reset link →'}
                      </button>
                    </form>
                  )}
                  <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                    <button onClick={() => { setForgotMode(false); setForgotSent(false); setForgotError('') }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#9B9B9B', fontFamily: 'inherit' }}>
                      ← Back to sign in
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
