import Head from 'next/head'
import Link from 'next/link'
import BetaBanner from '../components/BetaBanner'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

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
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { company_name: form.company, contact_name: form.contactName } }
      })
      if (authError) throw authError

      // 2. Insert agency record
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

  return (
    <>
      <Head><title>Get started — SJ Remote Solutions</title></Head>
      <div className="min-h-screen gradient-bg flex flex-col">
      <BetaBanner />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SJ</span>
              </div>
              <span className="font-semibold text-gray-900">SJ Remote Solutions</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Create your free account</h1>
            <p className="text-gray-600 mt-2 text-sm">Your compliance check takes about 4 minutes</p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Agency / company name</label>
                <input className="input" type="text" required placeholder="e.g. Apex Recruitment Ltd"
                  value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
              </div>
              <div>
                <label className="label">Your name</label>
                <input className="input" type="text" required placeholder="e.g. Sarah Johnson"
                  value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} />
              </div>
              <div>
                <label className="label">Work email address</label>
                <input className="input" type="email" required placeholder="you@youragency.co.uk"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="label">Password</label>
                <input className="input" type="password" required placeholder="At least 8 characters" minLength={8}
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base">
                {loading ? 'Creating account...' : 'Start my compliance check →'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-teal-600 font-medium hover:underline">Sign in</Link>
            </p>

            <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
              By registering you agree that SJ Remote Solutions may contact you about your compliance results. 
              Your data is stored securely and never shared with third parties.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
