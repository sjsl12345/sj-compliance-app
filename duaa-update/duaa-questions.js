// Data (Use and Access) Act 2025 — Compliance Questions
// Focused on obligations that came into force 19 June 2026

export const DUAA_QUESTIONS = [
  {
    id: 'd1',
    section: 'Complaints & Redress',
    question: 'Do you have a written complaints procedure specifically for candidates who wish to challenge an AI-assisted hiring decision?',
    hint: 'The DUAA 2025 introduced a formal redress mechanism (live 19 June 2026). Candidates must have a clear route to complain about automated decisions that affect them.',
    riskIfNo: 'Without a documented complaints process, you are directly non-compliant with the DUAA 2025 redress obligations that came into force on 19 June 2026.',
    weight: 3,
    lawRef: 'DUAA 2025 s.47 — Right to Complain',
  },
  {
    id: 'd2',
    section: 'Complaints & Redress',
    question: 'Can a candidate request a human to review an AI-assisted decision within a reasonable timeframe (e.g. 30 days)?',
    hint: 'The Act strengthens the Article 22 UK GDPR right to human review. Candidates must be able to trigger this easily — it cannot be buried or made deliberately difficult.',
    riskIfNo: 'Failure to provide accessible human review is an enforcement priority for the ICO following the DUAA 2025 commencement.',
    weight: 3,
    lawRef: 'DUAA 2025 + UK GDPR Article 22(3)',
  },
  {
    id: 'd3',
    section: 'Complaints & Redress',
    question: 'Are candidates informed of their right to complain to the ICO if their DUAA complaint is not resolved?',
    hint: 'The DUAA creates an escalation path — candidates can go to the ICO if the controller does not resolve their complaint. You must signpost this in your communications.',
    riskIfNo: 'Failing to signpost ICO escalation rights may be treated as obstruction of the complaints process.',
    weight: 2,
    lawRef: 'DUAA 2025 s.48 — ICO Escalation',
  },
  {
    id: 'd4',
    section: 'Transparency & Notification',
    question: 'Do you proactively inform candidates (before or at the point of application) that AI tools are used in your hiring process?',
    hint: 'The DUAA 2025 strengthens transparency requirements — passive disclosure buried in a privacy notice is no longer sufficient. Candidates should be actively notified.',
    riskIfNo: 'Passive or hidden disclosure of AI use is a key ICO enforcement focus. Active, prominent notification is now the expected standard.',
    weight: 3,
    lawRef: 'DUAA 2025 + UK GDPR Articles 13/14',
  },
  {
    id: 'd5',
    section: 'Transparency & Notification',
    question: 'Can you explain, in plain English, how your AI hiring tool reaches its decisions or scores?',
    hint: 'Meaningful transparency means being able to give a candidate a real explanation — not just "an algorithm decided." If your vendor cannot tell you how the tool works, that is itself a compliance risk.',
    riskIfNo: 'Inability to explain AI decisions is a significant ICO red flag and limits your ability to respond to Subject Access Requests or complaints.',
    weight: 3,
    lawRef: 'DUAA 2025 + UK GDPR Article 22(3) — Meaningful information',
  },
  {
    id: 'd6',
    section: 'Accountability & Governance',
    question: 'Have you conducted or updated a Data Protection Impact Assessment (DPIA) specifically covering your AI hiring tools in the last 12 months?',
    hint: 'A DPIA is mandatory for AI-powered hiring decisions under UK GDPR Article 35. The DUAA 2025 increases scrutiny — an outdated DPIA (or none at all) is a significant gap.',
    riskIfNo: 'A missing or outdated DPIA is one of the most common and easily-evidenced failures the ICO looks for when investigating AI hiring complaints.',
    weight: 3,
    lawRef: 'UK GDPR Article 35 + DUAA 2025 accountability obligations',
  },
  {
    id: 'd7',
    section: 'Accountability & Governance',
    question: 'Is there a named, senior individual in your organisation responsible for overseeing AI compliance in hiring?',
    hint: 'The DUAA 2025 emphasises organisational accountability. Responsibility for ADM compliance must sit with an identifiable person — not just a department or system.',
    riskIfNo: 'Without a named accountability owner, demonstrating compliance to the ICO is significantly harder — and enforcement outcomes are worse.',
    weight: 2,
    lawRef: 'DUAA 2025 accountability framework',
  },
  {
    id: 'd8',
    section: 'Accountability & Governance',
    question: 'Do you review your AI hiring tool for bias, accuracy, and fairness at least annually — and document the outcome?',
    hint: 'The DUAA 2025 expects ongoing monitoring, not just a one-off check. You should be able to show a documented review trail covering protected characteristics and decision accuracy.',
    riskIfNo: 'Without documented ongoing review, you cannot demonstrate compliance with the DUAA\'s accountability expectations or defend against a bias complaint.',
    weight: 3,
    lawRef: 'DUAA 2025 + Equality Act 2010 s.149',
  },
]

export const DUAA_SECTIONS = [...new Set(DUAA_QUESTIONS.map(q => q.section))]

export function calculateDUAAScore(answers) {
  // Only score the governance/safeguard questions (all of them — DUAA is all about having things in place)
  const maxScore = DUAA_QUESTIONS.reduce((sum, q) => sum + q.weight, 0)
  let score = 0
  let gaps = []
  let strengths = []

  DUAA_QUESTIONS.forEach(q => {
    const answer = answers[q.id]
    if (answer === 'yes') {
      score += q.weight
      strengths.push({ id: q.id, question: q.question, section: q.section })
    } else if (answer === 'no') {
      gaps.push({
        id: q.id,
        question: q.question,
        section: q.section,
        weight: q.weight,
        riskIfNo: q.riskIfNo,
        lawRef: q.lawRef,
      })
    }
    // 'unsure' = not scored either way but flagged
  })

  const unsure = DUAA_QUESTIONS.filter(q => answers[q.id] === 'unsure')
    .map(q => ({ id: q.id, question: q.question, section: q.section, lawRef: q.lawRef }))

  const percentage = Math.round((score / maxScore) * 100)

  let riskLevel, riskLabel
  if (percentage >= 75) {
    riskLevel = 'low'
    riskLabel = 'DUAA Ready'
  } else if (percentage >= 45) {
    riskLevel = 'medium'
    riskLabel = 'Partially Ready'
  } else {
    riskLevel = 'high'
    riskLabel = 'Not Ready'
  }

  return { score, maxScore, percentage, riskLevel, riskLabel, gaps, strengths, unsure }
}

export function getDUAASectionScores(answers) {
  return DUAA_SECTIONS.map(section => {
    const sectionQs = DUAA_QUESTIONS.filter(q => q.section === section)
    const maxScore = sectionQs.reduce((sum, q) => sum + q.weight, 0)
    let score = 0
    sectionQs.forEach(q => {
      if (answers[q.id] === 'yes') score += q.weight
    })
    const percentage = Math.round((score / maxScore) * 100)
    return { section, score, maxScore, percentage }
  })
}
