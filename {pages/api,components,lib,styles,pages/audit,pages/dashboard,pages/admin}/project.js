import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'

const MILESTONES = [
  { label:'Onboarding & discovery', date:'18 Jun 2026', done:true, tasks:['Discovery call (30 min)', 'Contract signed', 'Portal access granted'] },
  { label:'Information gathering', date:'25 Jun 2026', done:true, tasks:['AI tools questionnaire completed', 'Documentation uploaded', 'Data flow mapping shared'] },
  { label:'Review & analysis', date:'In progress', active:true, tasks:['ICO ADM framework assessment', 'DUAA 2025 compliance review', 'Bias & equality risk review', 'Candidate transparency audit'] },
  { label:'Draft report delivery', date:'14 Jul 2026', done:false, tasks:['Written report compiled', 'Priority actions identified', 'Draft shared for review'] },
  { label:'Debrief & sign-off', date:'TBC', done:false, tasks:['30-min debrief call', 'Amendments agreed', 'Final report issued'] },
]

const TASKS = [
  { id:1, task:'Review information gathering questionnaire', owner:'You', due:'28 Jun 2026', status:'done' },
  { id:2, task:'Upload AI tool documentation (Workable, LinkedIn Recruiter)', owner:'You', due:'30 Jun 2026', status:'done' },
  { id:3, task:'Sign Statement of Work', owner:'You', due:'2 Jul 2026', status:'pending' },
  { id:4, task:'Sign Data Processing Agreement', owner:'You', due:'2 Jul 2026', status:'pending' },
  { id:5, task:'Review draft compliance report', owner:'You', due:'16 Jul 2026', status:'upcoming' },
  { id:6, task:'ICO ADM framework assessment', owner:'Stephanie', due:'10 Jul 2026', status:'in_progress' },
  { id:7, task:'Debrief call scheduled', owner:'Stephanie', due:'TBC', status:'upcoming' },
]

function MilestoneCard({ m, i, total }) {
  const [open, setOpen] = useState(m.active)
  return (
    <div style={{ display:'flex', gap:'1.25rem' }}>
      {/* Line + dot */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
        <div style={{
          width:32, height:32, borderRadius:'50%', zIndex:1,
          background: m.done ? 'var(--lav)' : m.active ? 'rgba(111,92,156,0.15)' : '#F2F2F2',
          border: m.active ? '2px solid var(--lav)' : m.done ? 'none' : '2px solid #EBEBEB',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'0.8rem', fontWeight:700, color: m.done ? 'white' : m.active ? 'var(--lav)' : '#C4C4C4',
        }}>{m.done ? '✓' : i+1}</div>
        {i < total-1 && <div style={{ width:2, flex:1, background:'#EBEBEB', margin:'4px 0', minHeight:40 }} />}
      </div>
      {/* Content */}
      <div style={{ flex:1, paddingBottom:'1.75rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:open?'0.75rem':0, cursor:'pointer' }} onClick={()=>setOpen(o=>!o)}>
          <div>
            <div style={{ fontSize:'0.875rem', fontWeight: m.done||m.active ? 600 : 400, color: m.done ? '#2E2E2E' : m.active ? 'var(--lav)' : '#9B9B9B' }}>{m.label}</div>
            <div style={{ fontSize:'0.75rem', color: m.active ? 'var(--lav)' : '#C4C4C4', fontWeight: m.active ? 600 : 400 }}>{m.date}</div>
          </div>
          {m.active && <span className="badge badge-lav" style={{ marginLeft:'auto' }}>Active</span>}
          {m.done && <span className="badge badge-green" style={{ marginLeft:'auto' }}>Complete</span>}
          <span style={{ color:'#C4C4C4', marginLeft: m.active||m.done ? '0' : 'auto', fontSize:'0.75rem' }}>{open?'▲':'▼'}</span>
        </div>
        {open && (
          <div style={{ background:'rgba(111,92,156,0.05)', borderRadius:10, padding:'0.875rem 1rem' }}>
            {m.tasks.map((t,j)=>(
              <div key={j} style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.35rem 0', fontSize:'0.85rem', color:'#4A4A4A', borderBottom: j<m.tasks.length-1?'1px solid rgba(111,92,156,0.1)':'none' }}>
                <span style={{ color: m.done ? 'var(--lav)' : m.active ? '#9B9B9B' : '#C4C4C4', fontSize:'0.9rem' }}>{m.done?'✓':'○'}</span>
                {t}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const STATUS = {
  done:        { label:'Done', cls:'badge-green' },
  in_progress: { label:'In progress', cls:'badge-lav' },
  pending:     { label:'Action needed', cls:'badge-amber' },
  upcoming:    { label:'Upcoming', cls:'badge-grey' },
}

export default function Project() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(()=>{
    supabase.auth.getUser().then(({data:{user}})=>{
      if(!user){router.push('/login');return}
      setUser(user);setLoading(false)
    })
  },[])

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{fontFamily:'Spectral,serif',color:'#9B9B9B'}}>Loading…</div></div>

  const filtered = filter==='all' ? TASKS : TASKS.filter(t=>t.status===filter || (filter==='mine' && t.owner==='You'))

  return (
    <Layout user={user} title="My Project">
      <div style={{ marginBottom:'2rem' }}>
        <p className="section-label">Engagement tracker</p>
        <div className="lav-rule" />
        <h1 style={{ fontFamily:'Spectral,serif', fontSize:'1.75rem', fontWeight:500 }}>My Project</h1>
        <p style={{ color:'#6B6B6B', fontWeight:300, marginTop:'0.3rem' }}>Track progress, milestones, and outstanding actions.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.1fr', gap:'1.5rem' }}>
        {/* Timeline */}
        <div>
          <div className="card" style={{ marginBottom:'1rem' }}>
            <h2 style={{ fontFamily:'Spectral,serif', fontSize:'1rem', fontWeight:500, marginBottom:'0.1rem' }}>Project timeline</h2>
            <p style={{ fontSize:'0.78rem', color:'#9B9B9B', marginBottom:'1.5rem' }}>Full AI Hiring Audit · started 18 Jun 2026</p>
            {MILESTONES.map((m,i)=><MilestoneCard key={i} m={m} i={i} total={MILESTONES.length}/>)}
          </div>
          <div className="card-lav">
            <div style={{ fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--lav)', marginBottom:'0.4rem' }}>Estimated completion</div>
            <div style={{ fontFamily:'Spectral,serif', fontSize:'1.25rem', fontWeight:500 }}>Late July 2026</div>
            <p style={{ fontSize:'0.8rem', color:'#6B6B6B', marginTop:'0.25rem' }}>Subject to document receipt and review sign-off.</p>
          </div>
        </div>

        {/* Task list */}
        <div className="card" style={{ alignSelf:'start' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
            <h2 style={{ fontFamily:'Spectral,serif', fontSize:'1rem', fontWeight:500 }}>Actions & tasks</h2>
            <div style={{ display:'flex', gap:'0.4rem' }}>
              {['all','mine','pending'].map(f=>(
                <button key={f} onClick={()=>setFilter(f)}
                  style={{ fontSize:'0.75rem', padding:'0.3rem 0.7rem', borderRadius:8, border:'1px solid', cursor:'pointer', fontWeight:500, background: filter===f?'var(--lav)':'white', color:filter===f?'white':'#9B9B9B', borderColor:filter===f?'var(--lav)':'#EBEBEB', transition:'all .15s' }}>
                  {f==='all'?'All':f==='mine'?'Mine':'Pending'}
                </button>
              ))}
            </div>
          </div>
          {filtered.map((t,i)=>{
            const st = STATUS[t.status]
            return (
              <div key={t.id} style={{ display:'flex', alignItems:'flex-start', gap:'0.75rem', padding:'0.75rem 0', borderBottom: i<filtered.length-1?'1px solid #EBEBEB':'none' }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background: t.status==='done'?'var(--lav)':t.status==='pending'?'#D97706':t.status==='in_progress'?'#6F5C9C':'#EBEBEB', flexShrink:0, marginTop:6 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'0.85rem', fontWeight:500, color: t.status==='done'?'#9B9B9B':'#2E2E2E', textDecoration:t.status==='done'?'line-through':'none' }}>{t.task}</div>
                  <div style={{ fontSize:'0.75rem', color:'#9B9B9B', marginTop:'0.15rem' }}>
                    {t.owner==='You'?'You':'Stephanie'} · Due {t.due}
                  </div>
                </div>
                <span className={`badge ${st.cls}`}>{st.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
