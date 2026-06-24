import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { AUDIT_QUESTIONS, SECTIONS, calculateScore } from '../lib/questions'

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
  const progress = Math.round(((currentQ) / total) * 100)
  const currentSection = question?.section
  const sectionQs = AUDIT_QUESTIONS.filter(q => q.section === currentSection)
  const sectionIndex = SECTIONS.indexOf(currentSection)

  function answer(value) {
    const newAnswers = { ...answers, [question.id]: value }
    setAnswers(newAnswers)
    if (currentQ < total - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 300)
    } else {
      submitAudit(newAnswers)
    }
  }

  async function submitAudit(finalAnswers) {
    setSaving(true)
    try {
      const result = calculateScore(finalAnswers)
      const { data: agency } = await supabase.from('agencies').select('id').eq('user_id', user.id).single()
      const { data: audit } = await supabase.from('audits').insert({
        agency_id: agency.id,
        answers: finalAnswers,
        score: result.percentage,
        risk_level: result.riskLevel,
        completed: true,
      }).select().single()
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      setSaving(false)
    }
  }

  if (!user || !question) return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-600 text-sm">{saving ? 'Saving your results...' : 'Loading...'}</p>
      </div>
    </div>
  )

  return (
    <>
      <Head><title>Compliance Check — SJ Remote Solutions</title></Head>
      <div className="min-h-screen bg-white">
        {/* TOP BAR */}
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">SJ</span>
              </div>
              <span className="text-sm font-medium text-gray-700">AI Compliance Check</span>
            </div>
            <span className="text-sm text-gray-500">{currentQ + 1} of {total}</span>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="h-1 bg-gray-100">
          <div className="h-1 bg-teal-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-12">
          {/* SECTION BADGE */}
          <div className="inline-flex items-center gap-2 bg-teal-50 rounded-full px-3 py-1 text-xs font-medium text-teal-700 mb-6">
            <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
            Section {sectionIndex + 1} of {SECTIONS.length} — {currentSection}
          </div>

          {/* QUESTION */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{question.question}</h2>

          {question.hint && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
              <p className="text-sm text-blue-700 leading-relaxed">
                <span className="font-medium">What this means: </span>{question.hint}
              </p>
            </div>
          )}

          {/* ANSWER BUTTONS */}
          <div className="space-y-3">
            {[
              { value: 'yes', label: 'Yes', desc: 'We do this / have this in place', color: 'border-teal-200 hover:border-teal-400 hover:bg-teal-50' },
              { value: 'no', label: 'No', desc: "We don't do this / don't have this", color: 'border-red-200 hover:border-red-300 hover:bg-red-50' },
              { value: 'unsure', label: "Not sure", desc: "I'm not certain either way", color: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50' },
            ].map(opt => (
              <button key={opt.value} onClick={() => answer(opt.value)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 ${opt.color} ${answers[question.id] === opt.value ? 'ring-2 ring-teal-500' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm flex-shrink-0
                    ${opt.value === 'yes' ? 'bg-teal-100 text-teal-700' : opt.value === 'no' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                    {opt.label}
                  </div>
                  <span className="text-gray-700">{opt.desc}</span>
                </div>
              </button>
            ))}
          </div>

          {/* BACK BUTTON */}
          {currentQ > 0 && (
            <button onClick={() => setCurrentQ(q => q - 1)} className="mt-6 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              Back to previous question
            </button>
          )}
        </div>
      </div>
    </>
  )
}
