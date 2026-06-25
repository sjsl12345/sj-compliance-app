import Head from 'next/head'
import Link from 'next/link'
import BetaBanner from '../components/BetaBanner'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

const PF = { fontFamily: "'Playfair Display', Georgia, serif" }
const DM = { fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }

export default function ResetPassword() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase puts the session tokens in the URL hash after redirect
    // We need to let it process the hash before showing the form
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2500)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const labelStyle = {
    display: 'block', fontSize: '0.75rem', fontWeight: 600,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    color: '#9B9B9B', marginBottom: '0.375rem'
  }

  return (
    <>
      <Head><title>Reset Password — SJ Remote Solutions</title></Head>
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

            <div style={{ background: 'white', border: '1px solid #EBEBEB', borderRadius: 16, padding: '2rem', boxShadow: '0 2px 12px rgba(46,46,46,0.06)' }}>

              {success ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✓</div>
                  <h1 style={{ ...PF, fontSize: '1.4rem', fontWeight: 500, color: '#2E2E2E', marginBottom: '0.5rem' }}>Password updated</h1>
                  <p style={{ color: '#9B9B9B', fontSize: '0.875rem' }}>Redirecting you to your dashboard…</p>
                </div>
              ) : !ready ? (
                <div style={{ textAlign: 'center' }}>
                  <h1 style={{ ...PF, fontSize: '1.4rem', fontWeight: 500, color: '#2E2E2E', marginBottom: '0.75rem' }}>Reset your password</h1>
                  <p style={{ color: '#9B9B9B', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Verifying your reset link…</p>
                  <div style={{ width: 28, height: 28, border: '2px solid #3DCFBF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                  <p style={{ color: '#BEBEBE', fontSize: '0.8rem', marginTop: '1.5rem' }}>
                    Link not working?{' '}
                    <Link href="/login" style={{ color: '#3DCFBF', textDecoration: 'none' }}>Request a new one</Link>
                  </p>
                </div>
              ) : (
                <>
                  <h1 style={{ ...PF, fontSize: '1.5rem', fontWeight: 500, color: '#2E2E2E', marginBottom: '0.25rem', textAlign: 'center' }}>Choose a new password</h1>
                  <p style={{ color: '#9B9B9B', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.75rem' }}>Must be at least 8 characters.</p>
                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={labelStyle}>New password</label>
                      <input className="input" type="password" required minLength={8} placeholder="At least 8 characters"
                        value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={labelStyle}>Confirm password</label>
                      <input className="input" type="password" required minLength={8} placeholder="Same again"
                        value={confirm} onChange={e => setConfirm(e.target.value)} />
                    </div>
                    {error && (
                      <div style={{ background: '#FAF0EF', border: '1px solid #EDCBC7', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#7A2E26', marginBottom: '1.25rem' }}>{error}</div>
                    )}
                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem' }}>
                      {loading ? 'Updating…' : 'Update password →'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}
