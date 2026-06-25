import Head from 'next/head'
import BetaBanner from '../components/BetaBanner'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { AUDIT_QUESTIONS, SECTIONS, calculateScore } from '../lib/questions'

const PF = { fontFamily: "'Playfair Display', Georgia, serif" }
const DM = { fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }

export default function Audit() {
  const router = useRouter()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login')
      else setUser(data.user)
    })
  }, [])

  const question = AUDIT_QUESTIONS[currentQ]
  const total = AUDIT_QUESTIONS.length
  const progress = Math.round((currentQ / total) * 100)
  const sectionIndex = SECTIONS.indexOf(question?.section)

  function answer(value) {
    const newAnswers = { ...answers, [question.id]: value }
    setAnswers(newAnswers)
    if (currentQ < total - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 200)
    } else {
      submitAudit(newAnswers)
    }
  }

  async function submitAudit(finalAnswers) {
    setSaving(true)
    try {
      const result = calculateScore(finalAnswers)
      const { data: agency } = await supabase.from('agencies').select('id').eq('user_id', user.id).single()
      await supabase.from('audits').insert({
        agency_id: agency.id,
        answers: finalAnswers,
        score: result.percentage,
        risk_level: result.riskLevel,
        completed: true,
      })
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      setSaving(false)
    }
  }

  if (!user || !question) return (
    <div style={{ minHeight: '100vh', background: '#FAFAF9', display: 'flex', alignItems: 'center', justifyContent: 'center', ...DM }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid #3DCFBF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: '#9B9B9B', fontSize: '0.9rem' }}>{saving ? 'Saving your results…' : 'Loading…'}</p>
      </div>
    </div>
  )

  return (
    <>
      <Head><title>Compliance Check — SJ Remote Solutions</title></Head>
      <div style={{ minHeight: '100vh', background: '#FAFAF9', ...DM }}>
        <BetaBanner />

        {/* TOP BAR */}
        <div style={{ background: 'white', borderBottom: '1px solid #EBEBEB', padding: '1rem 1.5rem' }}>
          <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, background: '#2E2E2E', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 11 }}>SJ</span>
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#2E2E2E' }}>AI Compliance Check</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#9B9B9B' }}>{currentQ + 1} of {total}</span>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div style={{ height: 2, background: '#F2F2F2' }}>
          <div style={{ height: 2, background: '#3DCFBF', width: `${progress}%`, transition: 'width 0.4s ease' }} />
        </div>

        <div style={{ maxWidth: 640, margin: '0 auto', padding: '3rem 1.5rem' }}>

          {/* Section label */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EAF8F6', borderRadius: 999, padding: '0.25rem 1rem', marginBottom: '2rem' }}>
            <span style={{ width: 6, height: 6, background: '#3DCFBF', borderRadius: '50%', display: 'inline-block' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1A7A6E' }}>
              Section {sectionIndex + 1} of {SECTIONS.length} — {question.section}
            </span>
          </div>

          {/* Question */}
          <h2 style={{ ...PF, fontSize: '1.6rem', fontWeight: 500, color: '#2E2E2E', lineHeight: 1.3, marginBottom: '1.5rem' }}>
            {question.question}
          </h2>

          {/* Hint */}
          {question.hint && (
            <div style={{ background: '#F2F2F2', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '2rem', borderLeft: '3px solid #3DCFBF' }}>
              <p style={{ fontSize: '0.875rem', color: '#6B6B6B', lineHeight: 1.65 }}>
                <span style={{ fontWeight: 600, color: '#4A4A4A' }}>What this means: </span>{question.hint}
              </p>
            </div>
          )}

          {/* Answer buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { value: 'yes', label: 'Yes', desc: 'We do this / have this in place', accent: '#3DCFBF', bg: '#EAF8F6', text: '#1A7A6E' },
              { value: 'no', label: 'No', desc: "We don't do this / don't have this", accent: '#E8909A', bg: '#FFF0F2', text: '#7A2E26' },
              { value: 'unsure', label: 'Not sure', desc: "I'm not certain either way", accent: '#9B9B9B', bg: '#F2F2F2', text: '#4A4A4A' },
            ].map(opt => {
              const selected = answers[question.id] === opt.value
              return (
                <button key={opt.value} onClick={() => answer(opt.value)} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  background: selected ? opt.bg : 'white',
                  border: `1.5px solid ${selected ? opt.accent : '#EBEBEB'}`,
                  borderRadius: 12, padding: '1rem 1.25rem',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  boxShadow: selected ? `0 0 0 3px ${opt.accent}22` : 'none',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: selected ? opt.accent : '#F2F2F2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 600, fontSize: '0.8rem',
                    color: selected ? 'white' : '#6B6B6B',
                    transition: 'all 0.15s',
                  }}>{opt.label}</div>
                  <span style={{ fontSize: '0.9rem', color: '#4A4A4A' }}>{opt.desc}</span>
                </button>
              )
            })}
          </div>

          {/* Back */}
          {currentQ > 0 && (
            <button onClick={() => setCurrentQ(q => q - 1)} style={{
              marginTop: '1.5rem', fontSize: '0.85rem', color: '#9B9B9B',
              background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            }}>
              ← Back to previous question
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}
