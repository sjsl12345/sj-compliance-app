import Head from 'next/head'
import Link from 'next/link'
import BetaBanner from '../components/BetaBanner'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

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
      const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
      if (error) throw error
      // Check if admin
      if (form.email === 'stephanie@sjremotesolutions.co.uk') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Sign in — SJ Remote Solutions</title></Head>
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
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-600 mt-2 text-sm">Sign in to view your compliance dashboard</p>
          </div>
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email address</label>
                <input className="input" type="email" required placeholder="you@youragency.co.uk"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="label">Password</label>
                <input className="input" type="password" required
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base">
                {loading ? 'Signing in...' : 'Sign in →'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{' '}
              <Link href="/register" className="text-teal-600 font-medium hover:underline">Get started free</Link>
            </p>
          </div>
        </div>
      </div>
    </>
    }
  )
}
