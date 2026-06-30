import Head from 'next/head'
import Link from 'next/link'
import BetaBanner from '../components/BetaBanner'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

const PF = { fontFamily: "'Spectral', Georgia, serif" }
const DM = { fontFamily: "'Inter', 'Segoe UI', sans-serif" }

export default function Register() {
  const router = useRouter()
  const [form, setForm] = useState({ company: '', contactName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { company_name: form.company, contact_name: form.contactName } }
      })
      if (authError) throw authError
      const { error: agencyError } = await supabase.from('agencies').insert({
        company_name: form.company,
        contact_name: form.contactName,
        email: form.email,
        user_id: authData.user.id,
      })
      if (agencyError) throw agencyError
      router.push('/audit')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const field = (label, props) => (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9B9B9B', marginBottom: '0.375rem' }}>{label}</label>
      <input className="input" {...props} />
    </div>
  )

  return (
    <>
      <Head><title>Get started — SJ Remote Solutions</title></Head>
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
              <h1 style={{ ...PF, fontSize: '1.75rem', fontWeight: 500, color: '#2E2E2E', marginBottom: '0.5rem' }}>Create your free account</h1>
              <p style={{ color: '#9B9B9B', fontSize: '0.9rem' }}>Your compliance check takes about 4 minutes</p>
            </div>

            {/* Card */}
            <div style={{ background: 'white', border: '1px solid #EBEBEB', borderRadius: 16, padding: '2rem', boxShadow: '0 2px 12px rgba(46,46,46,0.06)' }}>
              <form onSubmit={handleSubmit}>
                {field('Agency / company name', { type: 'text', required: true, placeholder: 'e.g. Apex Recruitment Ltd', value: form.company, onChange: e => setForm(f => ({ ...f, company: e.target.value })) })}
                {field('Your name', { type: 'text', required: true, placeholder: 'e.g. Sarah Johnson', value: form.contactName, onChange: e => setForm(f => ({ ...f, contactName: e.target.value })) })}
                {field('Work email address', { type: 'email', required: true, placeholder: 'you@youragency.co.uk', value: form.email, onChange: e => setForm(f => ({ ...f, email: e.target.value })) })}
                {field('Password', { type: 'password', required: true, placeholder: 'At least 8 characters', minLength: 8, value: form.password, onChange: e => setForm(f => ({ ...f, password: e.target.value })) })}
                {error && (
                  <div style={{ background: '#FAF0EF', border: '1px solid #EDCBC7', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#7A2E26', marginBottom: '1.25rem' }}>{error}</div>
                )}
                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }}>
                  {loading ? 'Creating account…' : 'Start my compliance check →'}
                </button>
              </form>
              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#9B9B9B' }}>
                Already have an account?{' '}
                <Link href="/login" style={{ color: '#6F5C9C', fontWeight: 500, textDecoration: 'none' }}>Sign in</Link>
              </p>
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#BEBEBE', marginTop: '1rem', lineHeight: 1.6 }}>
                By registering you agree that SJ Remote Solutions may contact you about your compliance results. Your data is stored securely and never shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
