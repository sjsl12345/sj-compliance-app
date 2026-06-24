export const AUDIT_QUESTIONS = [
  {
    id: 'q1',
    section: 'How You Use AI in Hiring',
    question: 'Do you use any software that automatically filters or scores CVs?',
    hint: 'This includes ATS systems with AI features, CV screening tools, or any software that ranks applications automatically.',
    weight: 3,
  },
  {
    id: 'q2',
    section: 'How You Use AI in Hiring',
    question: 'Does your system rank or shortlist candidates without a human reviewing each one first?',
    hint: 'For example, does the software decide who makes it to the next stage without a recruiter checking each profile?',
    weight: 3,
  },
  {
    id: 'q3',
    section: 'How You Use AI in Hiring',
    question: 'Do you use AI-powered video interview tools?',
    hint: 'Tools like HireVue, Spark Hire, or similar platforms that analyse candidate responses, tone, or facial expressions.',
    weight: 2,
  },
  {
    id: 'q4',
    section: 'Transparency with Candidates',
    question: 'Do you tell candidates when AI is being used in their application process?',
    hint: 'Under UK GDPR Article 22, candidates have a right to know when automated decision-making is being used.',
    weight: 3,
  },
  {
    id: 'q5',
    section: 'Transparency with Candidates',
    question: 'Do you have a written policy explaining how AI decisions are made in your hiring process?',
    hint: 'This could be part of your privacy notice, candidate-facing documentation, or internal policy.',
    weight: 2,
  },
  {
    id: 'q6',
    section: 'Transparency with Candidates',
    question: 'Can candidates request a human review of an AI-assisted decision?',
    hint: 'The ICO expects organisations to offer candidates the right to contest automated decisions.',
    weight: 3,
  },
  {
    id: 'q7',
    section: 'Bias & Fairness',
    question: 'Has your AI hiring tool ever been audited for bias?',
    hint: 'Has anyone checked whether the AI treats candidates differently based on age, gender, ethnicity, or other protected characteristics?',
    weight: 3,
  },
  {
    id: 'q8',
    section: 'Bias & Fairness',
    question: 'Do you monitor whether certain groups are disproportionately filtered out by your AI tools?',
    hint: 'For example, tracking whether women, older candidates, or ethnic minorities are rejected at higher rates.',
    weight: 2,
  },
  {
    id: 'q9',
    section: 'Bias & Fairness',
    question: 'Is there a named person in your organisation responsible for AI fairness in hiring?',
    hint: 'Someone accountable for ensuring your AI tools are used ethically and compliantly.',
    weight: 1,
  },
  {
    id: 'q10',
    section: 'Data & GDPR',
    question: 'Do you know where candidate data processed by your AI tools is stored?',
    hint: 'Is it stored in the UK, EU, or a third country? Is it clear in your data register?',
    weight: 2,
  },
  {
    id: 'q11',
    section: 'Data & GDPR',
    question: 'Do you have a Data Processing Agreement with your AI software provider?',
    hint: 'A DPA is legally required under UK GDPR when a third party processes personal data on your behalf.',
    weight: 3,
  },
  {
    id: 'q12',
    section: 'Data & GDPR',
    question: 'Is the use of AI in hiring mentioned in your candidate privacy notice?',
    hint: 'Candidates must be informed about automated processing in your privacy notice under UK GDPR Article 13/14.',
    weight: 3,
  },
]

export const SECTIONS = [...new Set(AUDIT_QUESTIONS.map(q => q.section))]

export function calculateScore(answers) {
  // answers = { q1: 'yes'|'no'|'unsure', ... }
  const maxScore = AUDIT_QUESTIONS.reduce((sum, q) => sum + q.weight, 0)
  
  let score = 0
  let gaps = []
  let strengths = []

  AUDIT_QUESTIONS.forEach(q => {
    const answer = answers[q.id]
    // For compliance: 'yes' to transparency/data questions = good
    // 'yes' to AI usage without safeguards = risk
    // We score based on whether they have safeguards in place
    const isPositive = ['q4','q5','q6','q7','q8','q9','q10','q11','q12'].includes(q.id)
    const isRisk = ['q1','q2','q3'].includes(q.id)

    if (isPositive) {
      if (answer === 'yes') {
        score += q.weight
        strengths.push(q.id)
      } else if (answer === 'no') {
        gaps.push({ id: q.id, question: q.question, section: q.section, weight: q.weight })
      }
    }

    if (isRisk && answer === 'yes') {
      // Using AI — so safeguards matter more
      // We don't penalise for using AI, but it increases the importance of gaps
    }
  })

  const percentage = Math.round((score / maxScore) * 100)

  let riskLevel, riskColor, riskLabel
  if (percentage >= 75) {
    riskLevel = 'low'
    riskColor = 'green'
    riskLabel = 'Low Risk'
  } else if (percentage >= 45) {
    riskLevel = 'medium'
    riskColor = 'amber'
    riskLabel = 'Medium Risk'
  } else {
    riskLevel = 'high'
    riskColor = 'red'
    riskLabel = 'High Risk'
  }

  return { score, maxScore, percentage, riskLevel, riskColor, riskLabel, gaps, strengths }
}

export function getSectionScores(answers) {
  return SECTIONS.map(section => {
    const sectionQs = AUDIT_QUESTIONS.filter(q => q.section === section)
    const maxScore = sectionQs.reduce((sum, q) => sum + q.weight, 0)
    let score = 0
    sectionQs.forEach(q => {
      const isPositive = ['q4','q5','q6','q7','q8','q9','q10','q11','q12'].includes(q.id)
      if (isPositive && answers[q.id] === 'yes') score += q.weight
    })
    const percentage = Math.round((score / maxScore) * 100)
    return { section, score, maxScore, percentage }
  })
}
