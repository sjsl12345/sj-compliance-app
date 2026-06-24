import Head from 'next/head'
import Link from 'next/link'
import BetaBanner from '../components/BetaBanner'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { calculateScore, getSectionScores, AUDIT_QUESTIONS } from '../lib/questions'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [agency, setAgency] = useState(null)
  const [audit, setAudit] = useState(null)
  const [result, setResult] = useState(null)
  const [sectionScores, setSectionScores] = useState([])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: agencyData } = await supabase.from('agencies').select('*').eq('user_id', user.id).single()
      setAgency(agencyData)
      if (agencyData) {
        const { data: auditData } = await supabase.from('audits').select('*')
          .eq('agency_id', agencyData.id).eq('completed', true).order('created_at', { ascending: false }).limit(1).single()
        if (auditData) {
          setAudit(auditData)
          const r = calculateScore(auditData.answers)
          setResult(r)
          setSectionScores(getSectionScores(auditData.answers))
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  const riskColors = { low: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', bar: 'bg-teal-500', badge: 'badge-green' },
    medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', bar: 'bg-amber-400', badge: 'badge-amber' },
    high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', bar: 'bg-red-500', badge: 'badge-red' } }
  const colors = result ? riskColors[result.riskLevel] : riskColors.high

  return (
    <>
      <Head><title>My Compliance Dashboard — SJ Remote Solutions</title></Head>
      <div className="min-h-screen bg-gray-50">
        {/* BETA BANNER */}
        <BetaBanner />
        {/* NAV */}
        <nav className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SJ</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{agency?.company_name || 'My Dashboard'}</div>
                <div className="text-xs text-gray-500">AI Compliance Dashboard</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/audit" className="text-sm text-teal-600 font-medium hover:underline">Retake audit</Link>
              <button onClick={signOut} className="text-sm text-gray-500 hover:text-gray-700">Sign out</button>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-8">
          {!audit ? (
            /* NO AUDIT YET */
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You haven't completed your audit yet</h2>
              <p className="text-gray-600 mb-6">Takes about 4 minutes. Find out your ICO ADM compliance rating instantly.</p>
              <Link href="/audit" className="btn-primary">Start compliance check →</Link>
            </div>
          ) : (
            <>
              {/* SCORE HERO */}
              <div className={`card ${colors.bg} ${colors.border} border-2 mb-6`}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={colors.badge}>{result.riskLabel}</span>
                      <span className="text-sm text-gray-500">Completed {new Date(audit.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Your compliance score: <span className={colors.text}>{result.percentage}%</span></h1>
                    <p className="text-gray-600">
                      {result.riskLevel === 'high' && 'Significant gaps identified. Action needed to meet ICO ADM obligations.'}
                      {result.riskLevel === 'medium' && 'Some gaps identified. A few key areas need attention.'}
                      {result.riskLevel === 'low' && "Good compliance position. A few areas for improvement identified."}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className={`w-24 h-24 rounded-full border-4 ${colors.border} flex items-center justify-center`}>
                      <span className={`text-3xl font-bold ${colors.text}`}>{result.percentage}%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-white rounded-full">
                  <div className={`h-2 ${colors.bar} rounded-full transition-all`} style={{ width: `${result.percentage}%` }}></div>
                </div>
              </div>

              {/* SECTION SCORES */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {sectionScores.map(s => {
                  const c = s.percentage >= 75 ? riskColors.low : s.percentage >= 45 ? riskColors.medium : riskColors.high
                  return (
                    <div key={s.section} className="card">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">{s.section}</h3>
                        <span className={`text-sm font-bold ${c.text}`}>{s.percentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className={`h-2 ${c.bar} rounded-full`} style={{ width: `${s.percentage}%` }}></div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* GAPS */}
              {result.gaps.length > 0 && (
                <div className="card mb-6">
                  <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    </span>
                    Gaps to address ({result.gaps.length})
                  </h2>
                  <div className="space-y-3">
                    {result.gaps.map(gap => (
                      <div key={gap.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                        <div className="w-5 h-5 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{gap.question}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{gap.section}</p>
                        </div>
                        <span className={`ml-auto text-xs font-medium flex-shrink-0 ${gap.weight >= 3 ? 'text-red-600' : gap.weight === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                          {gap.weight >= 3 ? 'High priority' : gap.weight === 2 ? 'Medium' : 'Low'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GET HELP */}
              <div className="card bg-teal-500 border-0 text-white">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Ready to fix these gaps?</h3>
                    <p className="text-teal-100 text-sm">SJ Remote Solutions offers affordable, plain-English compliance support specifically for UK recruitment agencies.</p>
                  </div>
                  <a href="mailto:stephanie@sjremotesolutions.co.uk?subject=Compliance support enquiry"
                    className="bg-white text-teal-600 font-semibold py-3 px-6 rounded-xl hover:bg-teal-50 transition-all whitespace-nowrap flex-shrink-0">
                    Get in touch →
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
