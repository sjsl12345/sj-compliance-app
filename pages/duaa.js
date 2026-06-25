import Head from 'next/head'
import BetaBanner from '../components/BetaBanner'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { DUAA_QUESTIONS, calculateDUAAScore } from '../lib/duaa-questions'

const TOTAL = DUAA_QUESTIONS.length

export default function DUAAaudit() {
  const router = useRouter()
  const [step, setStep] = useState(0) // 0 = intro, 1..N = questions, N+1 = done
  const [answers, setAnswers] = useState({})
  const [saving, setSaving] = useState(false)
  const [agency, setAgency] = useState(null)
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: agencyData } = await supabase.from('agencies').select('*').eq('user_id', user.id).single()
      setAgency(agencyData)
      setAuthLoading(false)
    }
    load()
  }, [])

  const currentQ = DUAA_QUESTIONS[step - 1]
  const progress = step === 0 ? 0 : Math.round((step / TOTAL) * 100)
  const answered = Object.keys(answers).length

  async function handleAnswer(value) {
    const newAnswers = { ...answers, [currentQ.id]: value }
    setAnswers(newAnswers)
    if (step < TOTAL) {
      setStep(step + 1)
    } else {
      // Last question answered — save and finish
      await saveAndFinish(newAnswers)
    }
  }

  async function saveAndFinish(finalAnswers) {
    setSaving(true)
    try {
      const result = calculateDUAAScore(finalAnswers)
      const { error } = await supabase.from('duaa_audits').insert({
        agency_id: agency?.id,
        user_id: user?.id,
        answers: finalAnswers,
        score: result.score,
        max_score: result.maxScore,
        percentage: result.percentage,
        risk_level: result.riskLevel,
        completed: true,
      })
      if (error) throw error
      router.push('/dashboard?tab=duaa')
    } catch (err) {
      console.error(err)
      // Even if save fails, go to dashboard with result in query
      router.push('/dashboard?tab=duaa')
    }
    setSaving(false)
  }

  if (authLoading) return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  // INTRO SCREEN
  if (step === 0) return (
    <>
      <Head><title>DUAA 2025 Readiness Check — SJ Remote Solutions</title></Head>
      <div className="min-h-screen bg-gray-50">
        <BetaBanner />
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="card text-center">
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 01.06 12.006 11.954 11.954 0 013.6 18a11.955 11.955 0 012.38 4.5A11.959 11.959 0 0112 21.964a11.96 11.96 0 016.02-3.464 11.955 11.955 0 012.381-4.5 11.955 11.955 0 01-3.54-6.006A11.955 11.955 0 0120.4 6a11.959 11.959 0 01-3.598-3.036A11.96 11.96 0 0112 2.964z"/>
              </svg>
            </div>
            <div className="inline-block bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              NEW — Live since 19 June 2026
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Data (Use and Access) Act 2025<br/>Readiness Check</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              The DUAA 2025 introduced new obligations for organisations using AI in hiring — including a formal complaints and redress process that went live on <strong>19 June 2026</strong>. This 8-question check identifies your biggest gaps.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8 text-center">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-teal-600">8</div>
                <div className="text-xs text-gray-500 mt-1">Questions</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-teal-600">~3</div>
                <div className="text-xs text-gray-500 mt-1">Minutes</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-teal-600">2026</div>
                <div className="text-xs text-gray-500 mt-1">In force now</div>
              </div>
            </div>
            <button onClick={() => setStep(1)} className="btn-primary w-full text-center">
              Start DUAA check →
            </button>
            <button onClick={() => router.push('/dashboard')} className="mt-3 text-sm text-gray-500 hover:text-gray-700 w-full text-center">
              ← Back to dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  )

  // SAVING SCREEN
  if (saving) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Saving your results…</p>
      </div>
    </div>
  )

  // QUESTION SCREEN
  const sectionChanged = step === 1 || currentQ.section !== DUAA_QUESTIONS[step - 2]?.section

  return (
    <>
      <Head><title>DUAA 2025 Check — Question {step} of {TOTAL}</title></Head>
      <div className="min-h-screen bg-gray-50">
        <BetaBanner />
        <div className="max-w-2xl mx-auto px-6 py-10">

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Question {step} of {TOTAL}</span>
              <span className="text-sm font-medium text-teal-600">{progress}% complete</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-teal-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Section label */}
          {sectionChanged && (
            <div className="mb-4">
              <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full">
                {currentQ.section}
              </span>
            </div>
          )}

          {/* Question card */}
          <div className="card mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug">{currentQ.question}</h2>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-700 leading-relaxed">💡 {currentQ.hint}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: 'yes', label: '✓ Yes', style: 'border-2 border-teal-200 bg-teal-50 text-teal-700 hover:border-teal-400 hover:bg-teal-100' },
                { val: 'no', label: '✗ No', style: 'border-2 border-red-200 bg-red-50 text-red-700 hover:border-red-400 hover:bg-red-100' },
                { val: 'unsure', label: '? Not sure', style: 'border-2 border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-400 hover:bg-gray-100' },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => handleAnswer(opt.val)}
                  className={`py-4 rounded-xl font-semibold text-sm transition-all ${opt.style} ${answers[currentQ.id] === opt.val ? 'ring-2 ring-offset-1 ring-teal-400' : ''}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Law reference */}
          <div className="text-center mb-6">
            <span className="text-xs text-gray-400">Legal basis: {currentQ.lawRef}</span>
          </div>

          {/* Risk preview if No was just selected */}
          {answers[currentQ.id] === 'no' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-red-700 font-medium">⚠️ Risk: {currentQ.riskIfNo}</p>
            </div>
          )}

          {/* Back */}
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="text-sm text-gray-500 hover:text-gray-700">
              ← Previous question
            </button>
          )}
        </div>
      </div>
    </>
  )
}
