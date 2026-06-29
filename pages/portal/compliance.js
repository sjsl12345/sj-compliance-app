import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'

const CATEGORIES = [
  { name:'Transparency & disclosure', score:38, max:100, risk:'high', findings:['No candidate-facing notice explaining AI use in shortlisting','Privacy policy does not mention automated decision-making'] },
  { name:'Human oversight', score:65, max:100, risk:'medium', findings:['Human review exists but not formally documented','No audit trail for overrides of AI recommendations'] },
  { name:'Bias & fairness', score:72, max:100, risk:'medium', findings:['No formal bias testing conducted on CV screening tool','Protected characteristics not assessed in output review'] },
  { name:'Data governance', score:81, max:100, risk:'low', findings:['Data retention policy in place but needs AI-specific addendum'] },
  { name:'DUAA 2025 compliance', score:20, max:100, risk:'high', findings:['No formal complaints process in place (required from 19 Jun 2026)','ADM register not maintained','No DPA with AI tool vendor confirmed'] },
]

const RISK_STYLE = {
  high:   { bg:'#FEF2F2', border:'#FECACA', text:'#991B1B', badge:'badge-red', label:'High risk' },
  medium: { bg:'#FFFBEB', border:'#FCD34D', text:'#92400E', badge:'badge-amber', label:'Medium risk' },
  low:    { bg:'#ECFDF5', border:'#A7F3D0', text:'#065F46', badge:'badge-green', label:'Low risk' },
}

function ScoreRing({ pct, risk }) {
  const col = risk==='high'?'#DC2626':risk==='medium'?'#D97706':'#059669'
  const r=36, cx=44, cy=44, circ=2*Math.PI*r, dash=(pct/100)*circ
  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F2F2F2" strokeWidth="7"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={col} strokeWidth="7"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 44 44)"/>
      <text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="middle"
        style={{ fontFamily:'Spectral,serif', fontSize:16, fontWeight:700, fill:col }}>
        {pct}%
      </text>
    </svg>
  )
}

export default function Compliance() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(()=>{
    supabase.auth.getUser().then(({data:{user}})=>{
      if(!user){router.push('/login');return}
      setUser(user);setLoading(false)
    })
  },[])

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{fontFamily:'Spectral,serif',color:'#9B9B9B'}}>Loading…</div></div>

  const overall = Math.round(CATEGORIES.reduce((a,c)=>a+c.score,0)/CATEGORIES.length)
  const overallRisk = overall >= 70 ? 'low' : overall >= 50 ? 'medium' : 'high'

  return (
    <Layout user={user} title="Compliance Report">
      <div style={{ marginBottom:'2rem' }}>
        <p className="section-label">ICO ADM · DUAA 2025 · UK GDPR</p>
        <div className="lav-rule" />
        <h1 style={{ fontFamily:'Spectral,serif', fontSize:'1.75rem', fontWeight:500 }}>Compliance overview</h1>
        <p style={{ color:'#6B6B6B', fontWeight:300, marginTop:'0.3rem' }}>Based on your information gathering responses. Full report in progress.</p>
      </div>

      {/* Overall score */}
      <div className="card" style={{ display:'flex', alignItems:'center', gap:'2rem', marginBottom:'1.5rem', padding:'1.75rem' }}>
        <ScoreRing pct={overall} risk={overallRisk} />
        <div>
          <div style={{ fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#9B9B9B', marginBottom:'0.4rem' }}>Overall compliance score</div>
          <h2 style={{ fontFamily:'Spectral,serif', fontSize:'1.75rem', fontWeight:500, marginBottom:'0.4rem' }}>
            {overall}% — <span style={{ color: RISK_STYLE[overallRisk].text }}>{overallRisk==='high'?'High risk':overallRisk==='medium'?'Needs attention':'Good standing'}</span>
          </h2>
          <p style={{ fontSize:'0.875rem', color:'#6B6B6B', fontWeight:300, maxWidth:540 }}>
            Your agency has significant gaps in transparency and DUAA 2025 compliance. Human oversight and data governance are more developed — these provide a good foundation to build from.
          </p>
        </div>
        <div style={{ marginLeft:'auto', flexShrink:0 }}>
          <span className={`badge ${RISK_STYLE[overallRisk].badge}`}>{RISK_STYLE[overallRisk].label}</span>
          <div style={{ fontSize:'0.75rem', color:'#9B9B9B', marginTop:'0.5rem', textAlign:'right' }}>Assessed Jun 2026</div>
        </div>
      </div>

      {/* Priority actions */}
      <div className="card-lav" style={{ marginBottom:'1.5rem' }}>
        <div style={{ fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--lav)', marginBottom:'0.75rem' }}>⚠ Priority actions</div>
        {[
          'Implement formal complaints process (DUAA 2025 — required immediately)',
          'Add candidate-facing transparency notice to your hiring process',
          'Establish an ADM register documenting each automated tool used',
          'Confirm Data Processing Agreement with each AI tool vendor',
        ].map((a,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'0.6rem', padding:'0.4rem 0', fontSize:'0.875rem', color:'#4A4A4A', borderBottom: i<3?'1px solid rgba(111,92,156,0.1)':'none' }}>
            <span style={{ color:'#D97706', fontWeight:700, flexShrink:0 }}>{i+1}.</span>
            {a}
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <div className="card">
        <h2 style={{ fontFamily:'Spectral,serif', fontSize:'1rem', fontWeight:500, marginBottom:'1.25rem' }}>Category breakdown</h2>
        {CATEGORIES.map((cat, i)=>{
          const rs = RISK_STYLE[cat.risk]
          return (
            <div key={i} style={{ borderBottom: i<CATEGORIES.length-1?'1px solid #EBEBEB':'none' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'0.875rem 0', cursor:'pointer' }} onClick={()=>setExpanded(expanded===i?null:i)}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.4rem' }}>
                    <span style={{ fontSize:'0.875rem', fontWeight:500, color:'#2E2E2E' }}>{cat.name}</span>
                    <span className={`badge ${rs.badge}`}>{rs.label}</span>
                  </div>
                  <div className="progress-bar" style={{ maxWidth:400 }}>
                    <div className="progress-fill" style={{ width:`${cat.score}%`, background: cat.risk==='high'?'#DC2626':cat.risk==='medium'?'#D97706':'#059669' }}/>
                  </div>
                </div>
                <div style={{ fontFamily:'Spectral,serif', fontSize:'1.1rem', fontWeight:500, color: rs.text, flexShrink:0 }}>{cat.score}%</div>
                <span style={{ color:'#C4C4C4', fontSize:'0.75rem' }}>{expanded===i?'▲':'▼'}</span>
              </div>
              {expanded===i && (
                <div style={{ background: rs.bg, border:`1px solid ${rs.border}`, borderRadius:10, padding:'0.875rem 1rem', marginBottom:'0.875rem' }}>
                  <div style={{ fontSize:'0.75rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', color:rs.text, marginBottom:'0.5rem' }}>Findings</div>
                  {cat.findings.map((f,j)=>(
                    <div key={j} style={{ display:'flex', gap:'0.6rem', fontSize:'0.85rem', color:'#4A4A4A', padding:'0.3rem 0', borderTop:j>0?`1px solid ${rs.border}`:'none' }}>
                      <span style={{ color:rs.text, fontWeight:700, flexShrink:0 }}>!</span>{f}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
