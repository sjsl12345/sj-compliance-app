import Head from 'next/head'
import Link from 'next/link'
import BetaBanner from '../components/BetaBanner'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { calculateScore } from '../lib/questions'
import { calculateDUAAScore } from '../lib/duaa-questions'

const PF = { fontFamily: "'Playfair Display', Georgia, serif" }
const DM = { fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }

function NavLogo() {
  return (
    <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
      <svg height="32" viewBox="0 0 340 78" role="img" style={{ display: 'block' }}>
        <title>SJ Remote Solutions</title>
        <style>{`.npf{font-family:'Playfair Display',Georgia,serif}`}</style>
        <text x="26" y="62" className="npf" fontSize="70" fontWeight="700" fill="#2E2E2E" letterSpacing="-3" textAnchor="start">SJ</text>
        <line x1="16" y1="70" x2="84" y2="70" stroke="#3DCFBF" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="96" y1="12" x2="96" y2="66" stroke="#EBEBEB" strokeWidth="1"/>
        <text x="108" y="37" className="npf" fontSize="21" fontWeight="700" fill="#2E2E2E" letterSpacing="3" textAnchor="start">REMOTE</text>
        <text x="108" y="62" className="npf" fontSize="21" fontWeight="700" fill="#3DCFBF" letterSpacing="1.5" textAnchor="start">SOLUTIONS</text>
      </svg>
    </Link>
  )
}

const riskColors = {
  low:    { bg: '#EAF8F6', border: '#B0E8E2', text: '#1A7A6E', bar: '#3DCFBF', label: 'Low Risk' },
  medium: { bg: '#FBF5EB', border: '#EDD9AA', text: '#7A4E1A', bar: '#D97706', label: 'Medium Risk' },
  high:   { bg: '#FAF0EF', border: '#EDCBC7', text: '#7A2E26', bar: '#DC2626', label: 'High Risk' },
}

export default function History() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [agency, setAgency] = useState(null)
  const [admHistory, setAdmHistory] = useState([])
  const [duaaHistory, setDuaaHistory] = useState([])
  const [activeTab, setActiveTab] = useState('adm')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: agencyData } = await supabase.from('agencies').select('*').eq('user_id', user.id).single()
      setAgency(agencyData)

      // Load all completed ADM audits
      const query = agencyData
        ? supabase.from('audits').select('*').eq('agency_id', agencyData.id).eq('completed', true)
        : supabase.from('audits').select('*').eq('user_id', user.id).eq('completed', true)
      const { data: audits } = await query.order('created_at', { ascending: false })
      setAdmHistory(audits || [])

      // Load all completed DUAA audits
      const duaaQuery = agencyData
        ? supabase.from('duaa_audits').select('*').eq('agency_id', agencyData.id).eq('completed', true)
        : supabase.from('duaa_audits').select('*').eq('user_id', user.id).eq('completed', true)
      const { data: duaas } = await duaaQuery.order('created_at', { ascending: false })
      setDuaaHistory(duaas || [])

      setLoading(false)
    }
    load()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  function ScoreCard({ audit, type }) {
    const result = type === 'adm' ? calculateScore(audit.answers) : calculateDUAAScore(audit.answers)
    const c = riskColors[result.riskLevel] || riskColors.high
    const date = new Date(audit.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    const time = new Date(audit.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

    return (
      <div style={{ background: 'white', border: `1.5px solid ${c.border}`, borderRadius: 14, padding: '1.25rem 1.5rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#9B9B9B', marginBottom: '0.2rem' }}>{date} at {time}</div>
            <div style={{ ...PF, fontSize: '1.1rem', fontWeight: 500, color: '#2E2E2E' }}>
              {type === 'adm' ? 'ICO ADM Check' : 'DUAA 2025 Check'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ ...PF, fontSize: '2rem', fontWeight: 700, color: c.text, lineHeight: 1 }}>{result.percentage}%</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: c.text, marginTop: '0.25rem' }}>{result.riskLabel || c.label}</div>
          </div>
        </div>
        <div style={{ height: 6, background: '#F2F2F2', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: 6, background: c.bar, width: `${result.percentage}%`, borderRadius: 4, transition: 'width 0.5s ease' }} />
        </div>
        {result.gaps?.length > 0 && (
          <div style={{ marginTop: '0.875rem', fontSize: '0.8rem', color: '#9B9B9B' }}>
            {result.gaps.length} gap{result.gaps.length !== 1 ? 's' : ''} identified
            {result.gaps.filter(g => g.weight >= 3).length > 0 && (
              <span style={{ color: '#DC2626', marginLeft: '0.5rem' }}>
                · {result.gaps.filter(g => g.weight >= 3).length} high priority
              </span>
            )}
          </div>
        )}
      </div>
    )
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FAFAF9', display: 'flex', alignItems: 'center', justifyContent: 'center', ...DM }}>
      <div style={{ width: 32, height: 32, border: '2px solid #3DCFBF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <>
      <Head><title>My History — SJ Remote Solutions</title></Head>
      <div style={{ minHeight: '100vh', background: '#FAFAF9', ...DM }}>
        <BetaBanner />

        {/* NAV */}
        <nav style={{ background: 'white', borderBottom: '1px solid #EBEBEB', padding: '0.875rem 1.5rem' }}>
          <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <NavLogo />
              <div style={{ borderLeft: '1px solid #EBEBEB', paddingLeft: '1.5rem' }}>
                <div style={{ fontWeight: 600, color: '#2E2E2E', fontSize: '0.875rem' }}>{agency?.company_name || 'My History'}</div>
                <div style={{ fontSize: '0.75rem', color: '#9B9B9B' }}>Audit History</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <Link href="/dashboard" style={{ fontSize: '0.875rem', color: '#3DCFBF', fontWeight: 500, textDecoration: 'none' }}>← Dashboard</Link>
              <button onClick={signOut} style={{ fontSize: '0.875rem', color: '#9B9B9B', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Sign out</button>
            </div>
          </div>
        </nav>

        <div style={{ maxWidth: '52rem', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ ...PF, fontSize: '2rem', fontWeight: 500, color: '#2E2E2E', marginBottom: '0.5rem' }}>My History</h1>
            <p style={{ color: '#9B9B9B', fontSize: '0.9rem' }}>All your past compliance checks in one place. Your most recent result is what appears on your dashboard.</p>
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', gap: 4, background: '#F2F2F2', padding: 4, borderRadius: 12, marginBottom: '1.5rem', width: 'fit-content' }}>
            {[
              { key: 'adm', label: 'ICO ADM Checks', count: admHistory.length },
              { key: 'duaa', label: 'DUAA 2025 Checks', count: duaaHistory.length },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                padding: '0.6rem 1.25rem', borderRadius: 9, fontSize: '0.875rem', fontWeight: 600,
                background: activeTab === tab.key ? 'white' : 'transparent',
                color: activeTab === tab.key ? '#2E2E2E' : '#9B9B9B',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s',
              }}>
                {tab.label}
                <span style={{ marginLeft: 6, fontSize: '0.75rem', background: activeTab === tab.key ? '#F2F2F2' : 'transparent', padding: '1px 6px', borderRadius: 10 }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* ADM HISTORY */}
          {activeTab === 'adm' && (
            admHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: '#9B9B9B' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
                <p style={{ ...PF, fontSize: '1.1rem', color: '#2E2E2E', marginBottom: '0.5rem' }}>No ICO ADM checks yet</p>
                <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Complete your first compliance check to see your results here.</p>
                <Link href="/audit" style={{ background: '#2E2E2E', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 10, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
                  Start ICO ADM check →
                </Link>
              </div>
            ) : (
              <div>
                {admHistory.map((audit, i) => (
                  <div key={audit.id}>
                    {i === 0 && (
                      <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3DCFBF', marginBottom: '0.5rem' }}>
                        Most recent
                      </div>
                    )}
                    {i === 1 && (
                      <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9B9B', margin: '1.25rem 0 0.5rem' }}>
                        Previous checks
                      </div>
                    )}
                    <ScoreCard audit={audit} type="adm" />
                  </div>
                ))}
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <Link href="/audit" style={{ background: '#2E2E2E', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 10, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
                    Take another ICO ADM check →
                  </Link>
                </div>
              </div>
            )
          )}

          {/* DUAA HISTORY */}
          {activeTab === 'duaa' && (
            duaaHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: '#9B9B9B' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚖️</div>
                <p style={{ ...PF, fontSize: '1.1rem', color: '#2E2E2E', marginBottom: '0.5rem' }}>No DUAA 2025 checks yet</p>
                <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>The DUAA 2025 complaints process went live 19 June 2026. Check your readiness now.</p>
                <Link href="/duaa" style={{ background: '#2E2E2E', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 10, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
                  Start DUAA 2025 check →
                </Link>
              </div>
            ) : (
              <div>
                {duaaHistory.map((audit, i) => (
                  <div key={audit.id}>
                    {i === 0 && (
                      <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3DCFBF', marginBottom: '0.5rem' }}>
                        Most recent
                      </div>
                    )}
                    {i === 1 && (
                      <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9B9B', margin: '1.25rem 0 0.5rem' }}>
                        Previous checks
                      </div>
                    )}
                    <ScoreCard audit={audit} type="duaa" />
                  </div>
                ))}
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <Link href="/duaa" style={{ background: '#2E2E2E', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 10, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
                    Take another DUAA 2025 check →
                  </Link>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  )
}
