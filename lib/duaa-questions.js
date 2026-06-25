// Data (Use and Access) Act 2025 — Compliance Questions
// Legally precise wording for AI compliance advisory use
// Last reviewed: June 2026

export const DUAA_QUESTIONS = [
  {
    id: 'd1',
    section: 'Complaints & Redress',
    question: 'Do you have a documented complaints procedure that specifically enables candidates to challenge or request review of any decision made about them where AI tools were involved in the process?',
    hint: 'Under the Data (Use and Access) Act 2025 (s.47) and UK GDPR Article 22(3), individuals must have a clearly accessible route to lodge a complaint about automated or AI-assisted decisions. This procedure must be written, available to candidates on request, and actioned within a reasonable timeframe. A generic HR complaints policy is insufficient if it does not reference AI-assisted decisions specifically.',
    riskIfNo: 'Without a specific AI decision complaints procedure, your organisation is directly non-compliant with DUAA 2025 s.47, which came into force on 19 June 2026. The ICO can issue enforcement notices and fines. You may also face civil liability if a candidate suffers detriment from an unchallenged AI-assisted decision.',
    weight: 3,
    lawRef: 'DUAA 2025 s.47; UK GDPR Art. 22(3); ICO ADM Guidance (2023)',
  },
  {
    id: 'd2',
    section: 'Complaints & Redress',
    question: 'Can a candidate formally request that a human reviews or overrides any AI-assisted hiring decision within a defined and communicated timeframe — and do you have a documented process to action that request?',
    hint: 'UK GDPR Article 22(3) grants individuals the right to obtain human intervention, express their point of view, and contest automated decisions. The DUAA 2025 strengthens enforcement of this right. The right must be meaningful — it cannot be fulfilled by a token review that simply rubber-stamps the AI output. You must be able to demonstrate that a human with appropriate authority genuinely reconsidered the decision.',
    riskIfNo: 'Failure to provide genuine human review rights exposes your organisation to ICO enforcement action, compensation claims from affected candidates, and potential Employment Tribunal liability where the decision relates to a protected characteristic under the Equality Act 2010.',
    weight: 3,
    lawRef: 'UK GDPR Art. 22(3); DUAA 2025; Equality Act 2010 s.39',
  },
  {
    id: 'd3',
    section: 'Complaints & Redress',
    question: 'Do you inform candidates — in writing and before or at the point of application — of their right to escalate a complaint about an AI-assisted decision to the ICO if they are dissatisfied with your response?',
    hint: 'The DUAA 2025 creates a formal escalation pathway to the ICO for unresolved AI decision complaints. Candidates must be proactively told about this route — it is not sufficient to only mention it if they ask. This information must be included in your candidate-facing privacy notice and in any communication about an AI-assisted decision.',
    riskIfNo: 'Failing to signpost the ICO escalation route is a transparency failure under UK GDPR Articles 13 and 14, and may be treated by the ICO as obstruction of the complaints process. This carries reputational and regulatory risk including fines.',
    weight: 2,
    lawRef: 'DUAA 2025 s.48; UK GDPR Arts. 13(2)(d), 14(2)(e)',
  },
  {
    id: 'd4',
    section: 'Transparency & Notification',
    question: 'Do you proactively and specifically inform candidates — before or at the point of application — that AI tools are used in your hiring or screening process, identifying which stages involve AI and what decisions it influences?',
    hint: 'The DUAA 2025 and UK GDPR Articles 13/14 require active, specific disclosure of AI use — not passive disclosure buried in a lengthy privacy policy. Candidates must understand: (1) that AI is used, (2) at which stages, (3) what the AI does, and (4) the likely effect on them. Vague references to "automated processes" do not meet this standard.',
    riskIfNo: 'Inadequate disclosure of AI use in hiring is one of the ICO\'s stated enforcement priorities. This failure can result in enforcement notices, fines up to £17.5m or 4% of global turnover, and candidate compensation claims under UK GDPR Art. 82.',
    weight: 3,
    lawRef: 'DUAA 2025; UK GDPR Arts. 13(2)(f), 14(2)(g), 22(3)',
  },
  {
    id: 'd5',
    section: 'Transparency & Notification',
    question: 'Can you provide a candidate with a meaningful, plain-English explanation of how your AI tool reached its decision or score about them — including the key factors considered and their relative weighting?',
    hint: 'UK GDPR Article 22(3) requires "meaningful information about the logic involved" in automated decision-making. You must be able to explain the decision in terms the candidate can understand and challenge. If your AI vendor cannot tell you how the tool reaches decisions, that is itself a compliance risk that must be addressed contractually via your Data Processing Agreement.',
    riskIfNo: 'Inability to explain AI decisions prevents you from fulfilling Subject Access Requests within the mandatory 30-day period under UK GDPR Art. 12, defending Employment Tribunal claims, or satisfying ICO investigations. It also indicates a failure of vendor due diligence.',
    weight: 3,
    lawRef: 'UK GDPR Arts. 15, 22(3); ICO Subject Access Guidance',
  },
  {
    id: 'd6',
    section: 'Accountability & Governance',
    question: 'Have you completed a Data Protection Impact Assessment (DPIA) specifically covering the use of AI in your hiring process, and has it been reviewed or updated within the last 12 months?',
    hint: 'A DPIA is legally mandatory under UK GDPR Article 35 where processing is "likely to result in a high risk" to individuals — which AI-based hiring decisions categorically are, as confirmed by the ICO. The DPIA must identify risks, assess their likelihood and severity, and document mitigation measures. A DPIA conducted at initial deployment but never reviewed is legally insufficient.',
    riskIfNo: 'Absence of a valid, current DPIA for AI hiring is one of the most commonly identified failures in ICO investigations and is independent grounds for enforcement action and fines. It also fatally undermines your defence in any related data protection claim.',
    weight: 3,
    lawRef: 'UK GDPR Art. 35; ICO DPIA Guidance; DUAA 2025 accountability obligations',
  },
  {
    id: 'd7',
    section: 'Accountability & Governance',
    question: 'Is there a named, senior individual in your organisation with documented responsibility for overseeing AI compliance in hiring — with sufficient authority to act on compliance findings and sign off governance decisions?',
    hint: 'The DUAA 2025 accountability framework requires demonstrable organisational ownership of AI governance. Responsibility must sit with a named individual documented in your governance framework, DPIA, and internal policies. "Everyone is responsible" is not a legally defensible position and will not satisfy an ICO investigation.',
    riskIfNo: 'Without named accountability, demonstrating compliance to the ICO becomes significantly harder. Enforcement outcomes are consistently worse where organisations cannot evidence who was responsible for compliance decisions and why those decisions were made.',
    weight: 2,
    lawRef: 'DUAA 2025 accountability framework; UK GDPR Art. 5(2) accountability principle',
  },
  {
    id: 'd8',
    section: 'Accountability & Governance',
    question: 'Do you conduct and document a structured annual review of your AI hiring tools covering: accuracy, bias against protected characteristics under the Equality Act 2010, vendor compliance, and regulatory change?',
    hint: 'The DUAA 2025 and ICO ADM guidance expect ongoing monitoring, not a one-off check. Annual reviews must cover: (1) whether the tool still performs as intended, (2) whether it produces disparate outcomes for protected groups, (3) whether vendor practices remain compliant, and (4) whether regulatory changes require policy updates. Reviews must be documented and retained as evidence of accountability.',
    riskIfNo: 'Without documented annual reviews you cannot evidence compliance with DUAA 2025 accountability expectations, defend against an Equality Act bias claim, demonstrate due diligence to the ICO, or satisfy a Subject Access Request requiring disclosure of the logic used in a decision about a candidate.',
    weight: 3,
    lawRef: 'DUAA 2025; UK GDPR Art. 5(2); Equality Act 2010 s.149; ICO ADM Guidance',
  },
]

export const DUAA_SECTIONS = [...new Set(DUAA_QUESTIONS.map(q => q.section))]

export function calculateDUAAScore(answers) {
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
      gaps.push({ id: q.id, question: q.question, section: q.section, weight: q.weight, riskIfNo: q.riskIfNo, lawRef: q.lawRef })
    }
  })

  const unsure = DUAA_QUESTIONS.filter(q => answers[q.id] === 'unsure')
    .map(q => ({ id: q.id, question: q.question, section: q.section, lawRef: q.lawRef }))

  const percentage = Math.round((score / maxScore) * 100)

  let riskLevel, riskLabel
  if (percentage >= 75) { riskLevel = 'low'; riskLabel = 'DUAA Ready' }
  else if (percentage >= 45) { riskLevel = 'medium'; riskLabel = 'Partially Ready' }
  else { riskLevel = 'high'; riskLabel = 'Not Ready' }

  return { score, maxScore, percentage, riskLevel, riskLabel, gaps, strengths, unsure }
}

export function getDUAASectionScores(answers) {
  return DUAA_SECTIONS.map(section => {
    const sectionQs = DUAA_QUESTIONS.filter(q => q.section === section)
    const maxScore = sectionQs.reduce((sum, q) => sum + q.weight, 0)
    let score = 0
    sectionQs.forEach(q => { if (answers[q.id] === 'yes') score += q.weight })
    const percentage = Math.round((score / maxScore) * 100)
    return { section, score, maxScore, percentage }
  })
}
