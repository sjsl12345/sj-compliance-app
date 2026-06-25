import Head from 'next/head'
import Link from 'next/link'
import BetaBanner from '../components/BetaBanner'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { AUDIT_QUESTIONS, calculateScore, getSectionScores } from '../lib/questions'
import { DUAA_QUESTIONS, calculateDUAAScore } from '../lib/duaa-questions'

const PF = { fontFamily: "'Playfair Display', Georgia, serif" }
const DM = { fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }

const ALL_QUESTIONS = [
  ...AUDIT_QUESTIONS.map(q => ({ ...q, module: 'ICO ADM' })),
  ...DUAA_QUESTIONS.map(q => ({ ...q, module: 'DUAA 2025' })),
]

const TOTAL = ALL_QUESTIONS.length
const ADM_COUNT = AUDIT_QUESTIONS.length

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

export default function Audit() {
  const router = useRouter()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [saving, setSaving] = useState(false)
  const [savingProgress, setSavingProgress] = useState(false)
  const [progressSaved, setProgressSaved] = useState(false)
  const [user, setUser] = useState(null)
  const [agency, setAgency] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: agencyData } = await supabase.from('agencies').select('*').eq('user_id', user.id).single()
      setAgency(agencyData)
      const { data: draft } = await supabase.from('audits')
        .select('*').eq('user_id', user.id).eq('completed', false)
        .order('created_at', { ascending: false }).limit(1).single()
      if (draft?.answers && Object.keys(draft.answers).length > 0) {
        setAnswers(draft.answers)
        const lastUnanswered = ALL_QUESTIONS.findIndex(q => !draft.answers[q.id])
        setCurrentQ(lastUnanswered > -1 ? lastUnanswered : TOTAL - 1)
      }
      setLoading(false)
    }
    load()
  }, [])

  const question = ALL_QUESTIONS[currentQ]
  const sectionChanged = currentQ === 0 || question?.section !== ALL_QUESTIONS[currentQ - 1]?.section || question?.module !== ALL_QUESTIONS[currentQ - 1]?.module

  async function saveProgress(currentAnswers) {
    if (!user) return
    setSavingProgress(true)
    try {
      const { data: existing } = await supabase.from('audits')
        .select('id').eq('user_id', user.id).eq('completed', false).single()
      if (existing) {
        await supabase.from('audits').update({ answers: currentAnswers }).eq('id', existing.id)
      } else {
        await supabase.from('audits').insert({ agency_id: agency?.id || null, user_id: user.id, answers: currentAnswers, completed: false })
      }
      setProgressSaved(true)
      setTimeout(() => setProgressSaved(false), 2500)
    } catch (e) { console.error(e) }
    setSavingProgress(false)
  }

  function answer(value) {
    const newAnswers = { ...answers, [question.id]: value }
    setAnswers(newAnswers)
    if (currentQ < TOTAL - 1) {
      setCurrentQ(q => q + 1)
    } else {
      submitAudit(newAnswers)
    }
  }

  async function submitAudit(finalAnswers) {
    setSaving(true)
    try {
      const admAnswers = {}
      const duaaAnswers = {}
      AUDIT_QUESTIONS.forEach(q => { if (finalAnswers[q.id] !== undefined) admAnswers[q.id] = finalAnswers[q.id] })
      DUAA_QUESTIONS.forEach(q => { if (finalAnswers[q.id] !== undefined) duaaAnswers[q.id] = finalAnswers[q.id] })
      const admResult = calculateScore(admAnswers)
      const duaaResult = calculateDUAAScore(duaaAnswers)
      await supabase.from('audits').delete().eq('user_id', user.id).eq('completed', false)
      const { error: admError } = await supabase.from('audits').insert({
        agency_id: agency?.id || null, user_id: user.id, answers: admAnswers,
        score: admResult.percentage, risk_level: admResult.riskLevel, completed: true,
      })
      if (admError) throw admError
      const { error: duaaError } = await supabase.from('duaa_audits').insert({
        agency_id: agency?.id || null, user_id: user.id, answers: duaaAnswers,
        score: duaaResult.score, max_score: duaaResult.maxScore,
        percentage: duaaResult.percentage, risk_level: duaaResult.riskLevel, completed: true,
      })
      if (duaaError) throw duaaError
      router.push('/dashboard')
    } catch (err) {
      alert('Error: ' + (err.message || JSON.stringify(err)))
      setSaving(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FAFAF9', display: 'flex', alignItems: 'center', justifyContent: 'center', ...DM }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid #3DCFBF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: '#9B9B9B', fontSize: '0.9rem' }}>Loading…</p>
      </div>
    </div>
  )

  if (saving) return (
    <div style={{ minHeight: '100vh', background: '#FAFAF9', display: 'flex', alignItems: 'center', justifyContent: 'center', ...DM }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid #3DCFBF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: '#9B9B9B', fontSize: '0.9rem' }}>Saving your results…</p>
      </div>
    </div>
  )

  if (!question) return null

  const moduleColor = question?.module === 'DUAA 2025' ? '#FFB3BC' : '#3DCFBF'
  const moduleBg = question?.module === 'DUAA 2025' ? '#FFF0F2' : '#EAF8F6'
  const moduleTextColor = question?.module === 'DUAA 2025' ? '#7A4A50' : '#1A7A6E'

  return (
    <>
      <Head><title>AI Compliance Check — SJ Remote Solutions</title></Head>
      <div style={{ minHeight: '100vh', background: '#FAFAF9', ...DM }}>
        <BetaBanner />
        <div style={{ background: 'white', borderBottom: '1px solid #EBEBEB', padding: '0.875rem 1.5rem' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <NavLogo />
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button onClick={() => saveProgress(answers)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: progressSaved ? '#3DCFBF' : '#9B9B9B', fontFamily: 'inherit' }}>
                {savingProgress ? 'Saving…' : progressSaved ? '✓ Saved' : '💾 Save & exit later'}
              </button>
              <span style={{ fontSize: '0.8rem', color: '#9B9B9B' }}>{currentQ + 1} of {TOTAL}</span>
            </div>
          </div>
        </div>
        <div style={{ height: 4, background: '#F2F2F2', display: 'flex' }}>
          <div style={{ height: 4, background: '#3DCFBF', width: `${Math.min(currentQ, ADM_COUNT) / ADM_COUNT * 50}%`, transition: 'width 0.3s' }} />
          <div style={{ height: 4, background: '#F2F2F2', width: '50%', position: 'relative' }}>
            <div style={{ height: 4, background: '#FFB3BC', width: `${Math.max(0, (currentQ - ADM_COUNT)) / (TOTAL - ADM_COUNT) * 100}%`, transition: 'width 0.3s' }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 1.5rem', background: 'white', borderBottom: '1px solid #EBEBEB' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: currentQ < ADM_COUNT ? '#3DCFBF' : '#BEBEBE' }}>
            Part 1 — ICO ADM ({Math.min(currentQ + 1, ADM_COUNT)}/{ADM_COUNT})
          </span>
          <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: currentQ >= ADM_COUNT ? '#FFB3BC' : '#BEBEBE' }}>
            Part 2 — DUAA 2025 ({Math.max(0, currentQ - ADM_COUNT + 1)}/{TOTAL - ADM_COUNT})
          </span>
        </div>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: moduleBg, border: `1px solid ${moduleColor}`, borderRadius: 999, padding: '0.25rem 0.875rem', marginBottom: '1.5rem' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: moduleColor, display: 'inline-block' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: moduleTextColor }}>
              {question?.module} — {question?.section}
            </span>
          </div>
          {sectionChanged && (
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ ...PF, fontSize: '1.5rem', fontWeight: 500, color: '#2E2E2E', paddingBottom: '0.75rem', borderBottom: `2px solid ${moduleColor}`, display: 'inline-block' }}>
                {question?.section}
              </h2>
            </div>
          )}
          <h3 style={{ ...PF, fontSize: '1.25rem', fontWeight: 500, color: '#2E2E2E', lineHeight: 1.45, marginBottom: '1.25rem' }}>
            {question?.question}
          </h3>
          {question?.hint && (
            <div style={{ background: '#F2F2F2', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.75rem', borderLeft: `3px solid ${moduleColor}` }}>
              <p style={{ fontSize: '0.875rem', color: '#6B6B6B', lineHeight: 1.7 }}>
                <span style={{ fontWeight: 600, color: '#4A4A4A' }}>What this means: </span>{question?.hint}
              </p>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {[
              { value: 'yes', label: 'Yes — we do this / have this in place', accent: '#3DCFBF', bg: '#EAF8F6', textCol: '#1A4A44' },
              { value: 'no', label: "No — we don't do this / don't have this", accent: '#E8909A', bg: '#FFF0F2', textCol: '#5A2030' },
              { value: 'unsure', label: "Not sure — I'm not certain either way", accent: '#C0C0C0', bg: '#F5F5F5', textCol: '#4A4A4A' },
            ].map(opt => {
              const selected = answers[question?.id] === opt.value
              return (
                <button key={opt.value} onClick={() => answer(opt.value)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                  background: selected ? opt.bg : 'white',
                  border: `1.5px solid ${selected ? opt.accent : '#EBEBEB'}`,
                  borderRadius: 10, padding: '0.875rem 1rem',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', width: '100%',
                }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, border: `2px solid ${selected ? opt.accent : '#BEBEBE'}`, background: selected ? opt.accent : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                    {selected && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{ fontSize: '0.9rem', color: selected ? opt.textCol : '#4A4A4A', fontWeight: selected ? 500 : 400 }}>{opt.label}</span>
                </button>
              )
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            {currentQ > 0 ? (
              <button onClick={() => setCurrentQ(q => q - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#9B9B9B', fontFamily: 'inherit' }}>← Back</button>
            ) : <span />}
            <button onClick={() => saveProgress(answers)} style={{ background: 'none', border: '1px solid #EBEBEB', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', color: progressSaved ? '#3DCFBF' : '#9B9B9B', fontFamily: 'inherit', padding: '0.4rem 0.875rem' }}>
              {progressSaved ? '✓ Progress saved' : 'Save & continue later'}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  )
}
