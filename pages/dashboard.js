import Head from 'next/head'
import Link from 'next/link'
import BetaBanner from '../components/BetaBanner'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { calculateScore, getSectionScores, AUDIT_QUESTIONS } from '../lib/questions'
import { calculateDUAAScore, getDUAASectionScores, DUAA_QUESTIONS } from '../lib/duaa-questions'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [agency, setAgency] = useState(null)
  const [audit, setAudit] = useState(null)
  const [result, setResult] = useState(null)
  const [sectionScores, setSectionScores] = useState([])
  const [duaaAudit, setDuaaAudit] = useState(null)
  const [duaaResult, setDuaaResult] = useState(null)
  const [duaaSectionScores, setDuaaSectionScores] = useState([])
  const [activeTab, setActiveTab] = useState('adm')

  useEffect(() => {
    // Check for tab param in URL
    if (router.query.tab === 'duaa') setActiveTab('duaa')
  }, [router.query])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: agencyData } = await supabase.from('agencies').select('*').eq('user_id', user.id).single()
      setAgency(agencyData)
      if (agencyData) {
        // Load ADM audit — try agency_id, fallback to user_id
        let auditData = null
        if (agencyData) {
          const { data: a1 } = await supabase.from('audits').select('*')
            .eq('agency_id', agencyData.id).eq('completed', true)
            .order('created_at', { ascending: false }).limit(1).single()
          auditData = a1
        }
        if (!auditData) {
          const { data: a2 } = await supabase.from('audits').select('*')
            .eq('user_id', user.id).eq('completed', true)
            .order('created_at', { ascending: false }).limit(1).single()
          auditData = a2
        }
        if (auditData) {
          setAudit(auditData)
          const r = calculateScore(auditData.answers)
          setResult(r)
          setSectionScores(getSectionScores(auditData.answers))
        }
        // Load DUAA audit — try agency_id, fallback to user_id
        let duaaData = null
        if (agencyData) {
          const { data: d1 } = await supabase.from('duaa_audits').select('*')
            .eq('agency_id', agencyData.id).eq('completed', true)
            .order('created_at', { ascending: false }).limit(1).single()
          duaaData = d1
        }
        if (!duaaData) {
          const { data: d2 } = await supabase.from('duaa_audits').select('*')
            .eq('user_id', user.id).eq('completed', true)
            .order('created_at', { ascending: false }).limit(1).single()
          duaaData = d2
        }
        if (duaaData) {
          setDuaaAudit(duaaData)
          const dr = calculateDUAAScore(duaaData.answers)
          setDuaaResult(dr)
          setDuaaSectionScores(getDUAASectionScores(duaaData.answers))
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

  const riskColors = {
    low: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', bar: 'bg-teal-500', badge: 'badge-green' },
    medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', bar: 'bg-amber-400', badge: 'badge-amber' },
    high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', bar: 'bg-red-500', badge: 'badge-red' },
  }

  const admColors = result ? riskColors[result.riskLevel] : riskColors.high
  const duaaColors = duaaResult ? riskColors[duaaResult.riskLevel] : riskColors.high

  return (
    <>
      <Head><title>My Compliance Dashboard — SJ Remote Solutions</title></Head>
      <div className="min-h-screen bg-gray-50">
        <BetaBanner />

        {/* NAV */}
        <nav style={{background:'white',borderBottom:'1px solid #EBEBEB',padding:'0.875rem 1.5rem'}}>
          <div style={{maxWidth:'72rem',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{display:'flex',alignItems:'center',gap:'1.5rem'}}>
              <Link href="/" style={{display:'inline-block',textDecoration:'none'}}>
                <svg height="32" viewBox="0 0 340 78" role="img" style={{display:'block'}}>
                  <title>SJ Remote Solutions</title>
                  <style>{`.npf{font-family:'Playfair Display',Georgia,serif}`}</style>
                  <text x="26" y="62" className="npf" fontSize="70" fontWeight="700" fill="#2E2E2E" letterSpacing="-3" textAnchor="start">SJ</text>
                  <line x1="16" y1="70" x2="84" y2="70" stroke="#3DCFBF" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="96" y1="12" x2="96" y2="66" stroke="#EBEBEB" strokeWidth="1"/>
                  <text x="108" y="37" className="npf" fontSize="21" fontWeight="700" fill="#2E2E2E" letterSpacing="3" textAnchor="start">REMOTE</text>
                  <text x="108" y="62" className="npf" fontSize="21" fontWeight="700" fill="#3DCFBF" letterSpacing="1.5" textAnchor="start">SOLUTIONS</text>
                </svg>
              </Link>
              <div style={{borderLeft:'1px solid #EBEBEB',paddingLeft:'1.5rem'}}>
                <div style={{fontWeight:600,color:'#2E2E2E',fontSize:'0.875rem'}}>{agency?.company_name || 'My Dashboard'}</div>
                <div style={{fontSize:'0.75rem',color:'#9B9B9B'}}>AI Compliance Dashboard</div>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'1.25rem'}}>
              <a href="/history" style={{fontSize:'0.875rem',color:'#3DCFBF',fontWeight:500,textDecoration:'none'}}>My History</a>
              <button onClick={signOut} style={{fontSize:'0.875rem',color:'#9B9B9B',background:'none',border:'none',cursor:'pointer',fontFamily:'inherit'}}>Sign out</button>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-8">

          {/* TABS */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit">
            <button
              onClick={() => setActiveTab('adm')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'adm' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              ICO ADM Check
              {result && <span className={`ml-2 text-xs font-bold ${admColors.text}`}>{result.percentage}%</span>}
            </button>
            <button
              onClick={() => setActiveTab('duaa')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'duaa' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              DUAA 2025 Check
              {duaaResult && <span className={`ml-2 text-xs font-bold ${duaaColors.text}`}>{duaaResult.percentage}%</span>}
              {!duaaResult && <span className="ml-2 text-xs bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full">NEW</span>}
            </button>
          </div>

          {/* ── ADM TAB ──────────────────────────────────────────── */}
          {activeTab === 'adm' && (
            <>
              {!audit ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">You haven&apos;t completed your ICO ADM audit yet</h2>
                  <p className="text-gray-600 mb-6">Takes about 4 minutes. Find out your ICO ADM compliance rating instantly.</p>
                  <Link href="/audit" className="btn-primary">Start ICO compliance check →</Link>
                </div>
              ) : (
                <>
                  {/* SCORE HERO */}
                  <div className={`card ${admColors.bg} ${admColors.border} border-2 mb-6`}>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={admColors.badge}>{result.riskLabel}</span>
                          <span className="text-sm text-gray-500">Completed {new Date(audit.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">ICO ADM score: <span className={admColors.text}>{result.percentage}%</span></h1>
                        <p className="text-gray-600">
                          {result.riskLevel === 'high' && 'Significant gaps identified. Action needed to meet ICO ADM obligations.'}
                          {result.riskLevel === 'medium' && 'Some gaps identified. A few key areas need attention.'}
                          {result.riskLevel === 'low' && 'Good compliance position. A few areas for improvement identified.'}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className={`w-24 h-24 rounded-full border-4 ${admColors.border} flex items-center justify-center`}>
                          <span className={`text-3xl font-bold ${admColors.text}`}>{result.percentage}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 h-2 bg-white rounded-full">
                      <div className={`h-2 ${admColors.bar} rounded-full transition-all`} style={{ width: `${result.percentage}%` }}></div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Link href="/audit" className="text-sm text-gray-600 hover:text-gray-900 underline">Retake audit</Link>
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
                </>
              )}
            </>
          )}

          {/* ── DUAA TAB ─────────────────────────────────────────── */}
          {activeTab === 'duaa' && (
            <>
              {!duaaAudit ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 01.06 12.006 11.954 11.954 0 013.6 18a11.955 11.955 0 012.38 4.5A11.959 11.959 0 0112 21.964a11.96 11.96 0 016.02-3.464 11.955 11.955 0 012.381-4.5 11.955 11.955 0 01-3.54-6.006A11.955 11.955 0 0120.4 6a11.959 11.959 0 01-3.598-3.036A11.96 11.96 0 0112 2.964z"/>
                    </svg>
                  </div>
                  <div className="inline-block bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    NEW — Live since 19 June 2026
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">DUAA 2025 Readiness Check</h2>
                  <p className="text-gray-600 mb-2 max-w-md mx-auto">The Data (Use and Access) Act 2025 introduced new obligations for AI hiring — including a mandatory complaints process that went live on <strong>19 June 2026</strong>.</p>
                  <p className="text-gray-500 text-sm mb-6">8 questions · ~3 minutes</p>
                  <Link href="/duaa" className="btn-primary">Start DUAA check →</Link>
                </div>
              ) : (
                <>
                  {/* DUAA SCORE HERO */}
                  <div className={`card ${duaaColors.bg} ${duaaColors.border} border-2 mb-6`}>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={duaaColors.badge}>{duaaResult.riskLabel}</span>
                          <span className="text-sm text-gray-500">Completed {new Date(duaaAudit.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">DUAA 2025 score: <span className={duaaColors.text}>{duaaResult.percentage}%</span></h1>
                        <p className="text-gray-600">
                          {duaaResult.riskLevel === 'high' && 'Critical gaps identified. You are likely non-compliant with DUAA 2025 obligations already in force.'}
                          {duaaResult.riskLevel === 'medium' && 'Partial readiness. Key obligations are missing — action needed before an ICO complaint lands.'}
                          {duaaResult.riskLevel === 'low' && 'Strong DUAA readiness. Minor gaps to close — you\'re in a good position.'}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className={`w-24 h-24 rounded-full border-4 ${duaaColors.border} flex items-center justify-center`}>
                          <span className={`text-3xl font-bold ${duaaColors.text}`}>{duaaResult.percentage}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 h-2 bg-white rounded-full">
                      <div className={`h-2 ${duaaColors.bar} rounded-full transition-all`} style={{ width: `${duaaResult.percentage}%` }}></div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Link href="/duaa" className="text-sm text-gray-600 hover:text-gray-900 underline">Retake DUAA check</Link>
                    </div>
                  </div>

                  {/* DUAA SECTION SCORES */}
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {duaaSectionScores.map(s => {
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

                  {/* DUAA GAPS */}
                  {duaaResult.gaps.length > 0 && (
                    <div className="card mb-6">
                      <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        </span>
                        DUAA compliance gaps ({duaaResult.gaps.length})
                      </h2>
                      <div className="space-y-3">
                        {duaaResult.gaps.map(gap => (
                          <div key={gap.id} className="p-4 bg-red-50 rounded-xl border border-red-100">
                            <div className="flex items-start gap-3 mb-2">
                              <div className="w-5 h-5 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{gap.question}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{gap.section} · {gap.lawRef}</p>
                              </div>
                              <span className={`text-xs font-medium flex-shrink-0 ${gap.weight >= 3 ? 'text-red-600' : 'text-amber-600'}`}>
                                {gap.weight >= 3 ? 'High priority' : 'Medium'}
                              </span>
                            </div>
                            <p className="text-xs text-red-700 bg-red-100 rounded-lg px-3 py-2 ml-8">⚠️ {gap.riskIfNo}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* UNSURE items */}
                  {duaaResult.unsure.length > 0 && (
                    <div className="card mb-6 border-amber-200 bg-amber-50">
                      <h2 className="font-bold text-amber-800 mb-3 text-sm">❓ Questions you were unsure about ({duaaResult.unsure.length})</h2>
                      <div className="space-y-2">
                        {duaaResult.unsure.map(u => (
                          <div key={u.id} className="text-sm text-amber-700 flex gap-2">
                            <span>·</span><span>{u.question} <span className="text-amber-500 text-xs">({u.lawRef})</span></span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-amber-600 mt-3">These should be clarified — &apos;unsure&apos; is a risk in itself under the DUAA accountability framework.</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}



        </div>
      </div>
    </>
  )
}
