import Head from 'next/head'
import Link from 'next/link'
import BetaBanner from '../components/BetaBanner'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { calculateScore, getSectionScores } from '../lib/questions'
import { calculateDUAAScore, getDUAASectionScores } from '../lib/duaa-questions'

const PF = { fontFamily: "'Playfair Display', Georgia, serif" }
const DM = { fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }

const RC = {
  low:    { bg: '#EAF8F6', border: '#B0E8E2', text: '#1A7A6E', bar: '#3DCFBF' },
  medium: { bg: '#FBF5EB', border: '#EDD9AA', text: '#7A4E1A', bar: '#D97706' },
  high:   { bg: '#FAF0EF', border: '#EDCBC7', text: '#7A2E26', bar: '#DC2626' },
}

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

function ScoreRing({ percentage, color }) {
  const r = 36, cx = 44, cy = 44, circ = 2 * Math.PI * r
  const dash = (percentage / 100) * circ
  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F2F2F2" strokeWidth="7"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 44 44)"/>
      <text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="middle"
        style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, fill: color }}>
        {percentage}%
      </text>
    </svg>
  )
}

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
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: agencyData } = await supabase.from('agencies').select('*').eq('user_id', user.id).single()
      setAgency(agencyData)
      let auditData = null
      if (agencyData) {
        const { data: a1 } = await supabase.from('audits').select('*').eq('agency_id', agencyData.id).eq('completed', true).order('created_at', { ascending: false }).limit(1).single()
        auditData = a1
      }
      if (!auditData) {
        const { data: a2 } = await supabase.from('audits').select('*').eq('user_id', user.id).eq('completed', true).order('created_at', { ascending: false }).limit(1).single()
        auditData = a2
      }
      if (auditData) { setAudit(auditData); setResult(calculateScore(auditData.answers)); setSectionScores(getSectionScores(auditData.answers)) }
      let duaaData = null
      if (agencyData) {
        const { data: d1 } = await supabase.from('duaa_audits').select('*').eq('agency_id', agencyData.id).eq('completed', true).order('created_at', { ascending: false }).limit(1).single()
        duaaData = d1
      }
      if (!duaaData) {
        const { data: d2 } = await supabase.from('duaa_audits').select('*').eq('user_id', user.id).eq('completed', true).order('created_at', { ascending: false }).limit(1).single()
        duaaData = d2
      }
      if (duaaData) { setDuaaAudit(duaaData); setDuaaResult(calculateDUAAScore(duaaData.answers)); setDuaaSectionScores(getDUAASectionScores(duaaData.answers)) }
      setLoading(false)
    }
    load()
  }, [])

  async function signOut() { await supabase.auth.signOut(); router.push('/') }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FAFAF9', display: 'flex', alignItems: 'center', justifyContent: 'center', ...DM }}>
      <div style={{ width: 32, height: 32, border: '2px solid #3DCFBF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const admC = result ? RC[result.riskLevel] : null
  const duaaC = duaaResult ? RC[duaaResult.riskLevel] : null

  const card = (onClick, borderColor, children) => (
    <div onClick={onClick} style={{ background: 'white', border: `1.5px solid ${borderColor || '#EBEBEB'}`, borderRadius: 16, padding: '1.5rem', cursor: onClick ? 'pointer' : 'default', transition: 'all 0.15s' }}>
      {children}
    </div>
  )

  return (
    <>
      <Head><title>My Dashboard — SJ Remote Solutions</title></Head>
      <div style={{ minHeight: '100vh', background: '#FAFAF9', ...DM }}>
        <BetaBanner />
        <nav style={{ background: 'white', borderBottom: '1px solid #EBEBEB', padding: '0.875rem 1.5rem' }}>
          <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <NavLogo />
              <div style={{ borderLeft: '1px solid #EBEBEB', paddingLeft: '1.5rem' }}>
                <div style={{ fontWeight: 600, color: '#2E2E2E', fontSize: '0.875rem' }}>{agency?.company_name || 'My Dashboard'}</div>
                <div style={{ fontSize: '0.75rem', color: '#9B9B9B' }}>AI Compliance Dashboard</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <Link href="/history" style={{ fontSize: '0.875rem', color: '#3DCFBF', fontWeight: 500, textDecoration: 'none' }}>My History</Link>
              <button onClick={signOut} style={{ fontSize: '0.875rem', color: '#9B9B9B', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Sign out</button>
            </div>
          </div>
        </nav>

        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ ...PF, fontSize: '1.75rem', fontWeight: 500, color: '#2E2E2E' }}>Your Compliance Overview</h1>
            <p style={{ color: '#9B9B9B', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {audit || duaaAudit ? 'Click a card to see full details and gaps.' : 'Complete your compliance check to see results here.'}
            </p>
          </div>

          {/* TOP ROW — 3 cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>

            {/* ADM CARD */}
            <div onClick={() => audit && setExpanded(expanded === 'adm' ? null : 'adm')}
              style={{ background: 'white', border: `1.5px solid ${expanded === 'adm' ? '#3DCFBF' : admC ? admC.border : '#EBEBEB'}`, borderRadius: 16, padding: '1.5rem', cursor: audit ? 'pointer' : 'default', transition: 'all 0.15s' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9B9B', marginBottom: '0.25rem' }}>Part 1</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h2 style={{ ...PF, fontSize: '1.05rem', fontWeight: 500, color: '#2E2E2E' }}>ICO ADM Check</h2>
                {admC && <ScoreRing percentage={result.percentage} color={admC.bar} />}
              </div>
              {audit ? (
                <>
                  <span style={{ display: 'inline-block', background: admC.bg, color: admC.text, fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.75rem', borderRadius: 999 }}>{result.riskLabel}</span>
                  <div style={{ fontSize: '0.75rem', color: '#9B9B9B', marginTop: '0.5rem' }}>{result.gaps?.length || 0} gaps · {new Date(audit.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                  <div style={{ fontSize: '0.75rem', color: '#3DCFBF', marginTop: '0.5rem', fontWeight: 500 }}>{expanded === 'adm' ? '↑ Hide details' : '↓ View details'}</div>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '0.8rem', color: '#9B9B9B', marginBottom: '0.75rem' }}>Not completed yet</p>
                  <Link href="/audit" onClick={e => e.stopPropagation()} style={{ fontSize: '0.8rem', background: '#2E2E2E', color: 'white', padding: '0.5rem 1rem', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>Start check →</Link>
                </>
              )}
            </div>

            {/* DUAA CARD */}
            <div onClick={() => duaaAudit && setExpanded(expanded === 'duaa' ? null : 'duaa')}
              style={{ background: 'white', border: `1.5px solid ${expanded === 'duaa' ? '#FFB3BC' : duaaC ? duaaC.border : '#EBEBEB'}`, borderRadius: 16, padding: '1.5rem', cursor: duaaAudit ? 'pointer' : 'default', transition: 'all 0.15s' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9B9B', marginBottom: '0.25rem' }}>Part 2</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h2 style={{ ...PF, fontSize: '1.05rem', fontWeight: 500, color: '#2E2E2E' }}>DUAA 2025 Check</h2>
                {duaaC && <ScoreRing percentage={duaaResult.percentage} color={duaaC.bar} />}
              </div>
              {duaaAudit ? (
                <>
                  <span style={{ display: 'inline-block', background: duaaC.bg, color: duaaC.text, fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.75rem', borderRadius: 999 }}>{duaaResult.riskLabel}</span>
                  <div style={{ fontSize: '0.75rem', color: '#9B9B9B', marginTop: '0.5rem' }}>{duaaResult.gaps?.length || 0} gaps · {new Date(duaaAudit.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                  <div style={{ fontSize: '0.75rem', color: '#3DCFBF', marginTop: '0.5rem', fontWeight: 500 }}>{expanded === 'duaa' ? '↑ Hide details' : '↓ View details'}</div>
                </>
              ) : (
                <>
                  <span style={{ display: 'inline-block', background: '#FFF0F2', color: '#7A4A50', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.6rem', borderRadius: 4, marginBottom: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>New</span>
                  <p style={{ fontSize: '0.8rem', color: '#9B9B9B', marginBottom: '0.75rem' }}>Live since 19 June 2026</p>
                  <Link href="/audit" onClick={e => e.stopPropagation()} style={{ fontSize: '0.8rem', background: '#2E2E2E', color: 'white', padding: '0.5rem 1rem', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>Start check →</Link>
                </>
              )}
            </div>

            {/* HISTORY CARD */}
            <Link href="/history" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', border: '1.5px solid #EBEBEB', borderRadius: 16, padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#3DCFBF'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#EBEBEB'}>
                <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9B9B', marginBottom: '0.25rem' }}>Records</div>
                  <h2 style={{ ...PF, fontSize: '1.05rem', fontWeight: 500, color: '#2E2E2E', marginBottom: '0.75rem' }}>My History</h2>
                  <p style={{ fontSize: '0.8rem', color: '#9B9B9B', lineHeight: 1.6 }}>All your past compliance checks. Track progress and see how your score changes over time.</p>
                </div>
                <div style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: '#3DCFBF', fontWeight: 500 }}>View history →</div>
              </div>
            </Link>
          </div>

          {(audit || duaaAudit) && (
            <div style={{ marginBottom: '1.5rem' }}>
              <Link href="/audit" style={{ fontSize: '0.8rem', color: '#9B9B9B', textDecoration: 'none', background: 'white', border: '1px solid #EBEBEB', padding: '0.5rem 1rem', borderRadius: 8 }}>
                ↺ Retake full compliance check
              </Link>
            </div>
          )}

          {/* ADM EXPANDED */}
          {expanded === 'adm' && result && (
            <div style={{ background: 'white', border: `1.5px solid ${admC.border}`, borderRadius: 16, padding: '1.75rem', marginBottom: '1rem' }}>
              <h3 style={{ ...PF, fontSize: '1.25rem', fontWeight: 500, color: '#2E2E2E', marginBottom: '1.25rem' }}>ICO ADM — Detailed Results</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {sectionScores.map(s => {
                  const c = s.percentage >= 75 ? RC.low : s.percentage >= 45 ? RC.medium : RC.high
                  return (
                    <div key={s.section} style={{ background: '#FAFAF9', borderRadius: 10, padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#2E2E2E' }}>{s.section}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: c.text }}>{s.percentage}%</span>
                      </div>
                      <div style={{ height: 4, background: '#EBEBEB', borderRadius: 2 }}>
                        <div style={{ height: 4, background: c.bar, width: `${s.percentage}%`, borderRadius: 2 }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              {result.gaps?.length > 0 && (
                <>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2E2E2E', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Gaps ({result.gaps.length})</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {result.gaps.map(gap => (
                      <div key={gap.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: '#FAF0EF', border: '1px solid #EDCBC7', borderRadius: 10, padding: '0.75rem 1rem' }}>
                        <span style={{ color: '#DC2626', flexShrink: 0 }}>✕</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.85rem', fontWeight: 500, color: '#2E2E2E' }}>{gap.question}</p>
                          <p style={{ fontSize: '0.75rem', color: '#9B9B9B', marginTop: '0.2rem' }}>{gap.section}</p>
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: gap.weight >= 3 ? '#DC2626' : '#D97706', flexShrink: 0 }}>{gap.weight >= 3 ? 'High' : 'Medium'}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* DUAA EXPANDED */}
          {expanded === 'duaa' && duaaResult && (
            <div style={{ background: 'white', border: `1.5px solid ${duaaC.border}`, borderRadius: 16, padding: '1.75rem', marginBottom: '1rem' }}>
              <h3 style={{ ...PF, fontSize: '1.25rem', fontWeight: 500, color: '#2E2E2E', marginBottom: '1.25rem' }}>DUAA 2025 — Detailed Results</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {duaaSectionScores.map(s => {
                  const c = s.percentage >= 75 ? RC.low : s.percentage >= 45 ? RC.medium : RC.high
                  return (
                    <div key={s.section} style={{ background: '#FAFAF9', borderRadius: 10, padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#2E2E2E' }}>{s.section}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: c.text }}>{s.percentage}%</span>
                      </div>
                      <div style={{ height: 4, background: '#EBEBEB', borderRadius: 2 }}>
                        <div style={{ height: 4, background: c.bar, width: `${s.percentage}%`, borderRadius: 2 }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              {duaaResult.gaps?.length > 0 && (
                <>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2E2E2E', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Gaps ({duaaResult.gaps.length})</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {duaaResult.gaps.map(gap => (
                      <div key={gap.id} style={{ background: '#FAF0EF', border: '1px solid #EDCBC7', borderRadius: 10, padding: '0.875rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem' }}>
                          <span style={{ color: '#DC2626', flexShrink: 0 }}>✕</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: 500, color: '#2E2E2E' }}>{gap.question}</p>
                            <p style={{ fontSize: '0.75rem', color: '#9B9B9B', marginTop: '0.2rem' }}>{gap.section} · {gap.lawRef}</p>
                          </div>
                          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: gap.weight >= 3 ? '#DC2626' : '#D97706', flexShrink: 0 }}>{gap.weight >= 3 ? 'High' : 'Medium'}</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#7A2E26', background: '#EDCBC7', borderRadius: 8, padding: '0.5rem 0.75rem', marginLeft: '1.5rem' }}>⚠️ {gap.riskIfNo}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {duaaResult.unsure?.length > 0 && (
                <div style={{ background: '#FBF5EB', border: '1px solid #EDD9AA', borderRadius: 10, padding: '1rem', marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#7A4E1A', marginBottom: '0.5rem' }}>❓ Unsure ({duaaResult.unsure.length})</p>
                  {duaaResult.unsure.map(u => <p key={u.id} style={{ fontSize: '0.8rem', color: '#7A4E1A', marginBottom: '0.25rem' }}>· {u.question}</p>)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  )
}
