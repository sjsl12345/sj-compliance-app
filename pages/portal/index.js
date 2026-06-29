import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

function StatCard({ label, value, sub, accent, icon }) {
  return (
    <div className="card" style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:'0.75rem', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'#9B9B9B' }}>{label}</span>
        <span style={{ fontSize:'1.2rem' }}>{icon}</span>
      </div>
      <div style={{ fontFamily:'Spectral,serif', fontSize:'1.75rem', fontWeight:500, color:accent||'#2E2E2E' }}>{value}</div>
      {sub && <div style={{ fontSize:'0.78rem', color:'#9B9B9B' }}>{sub}</div>}
    </div>
  )
}

function Activity({ icon, title, time, tag, tagColor }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:'0.75rem', padding:'0.75rem 0', borderBottom:'1px solid #EBEBEB' }}>
      <div style={{ width:34, height:34, borderRadius:10, background:'rgba(111,92,156,0.10)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>{icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:'0.85rem', fontWeight:500, color:'#2E2E2E' }}>{title}</div>
        <div style={{ fontSize:'0.75rem', color:'#9B9B9B', marginTop:'0.1rem' }}>{time}</div>
      </div>
      {tag && <span className={`badge badge-${tagColor||'lav'}`}>{tag}</span>}
    </div>
  )
}

function QuickAction({ href, icon, label, desc }) {
  return (
    <Link href={href}>
      <div className="card" style={{ display:'flex', alignItems:'center', gap:'1rem', cursor:'pointer', transition:'border-color .15s' }}
        onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(111,92,156,0.4)'}
        onMouseLeave={e=>e.currentTarget.style.borderColor='#EBEBEB'}>
        <div style={{ width:42, height:42, borderRadius:12, background:'rgba(111,92,156,0.10)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0 }}>{icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:'0.875rem', fontWeight:600, color:'#2E2E2E' }}>{label}</div>
          <div style={{ fontSize:'0.78rem', color:'#9B9B9B', marginTop:'0.1rem' }}>{desc}</div>
        </div>
        <span style={{ color:'#9B9B9B' }}>→</span>
      </div>
    </Link>
  )
}

const STEPS = [
  { label:'Discovery call', date:'18 Jun 2026', done:true },
  { label:'Information gathering', date:'25 Jun 2026', done:true },
  { label:'Review & analysis', date:'In progress', active:true },
  { label:'Draft report', date:'14 Jul 2026', done:false },
  { label:'Debrief call', date:'TBC', done:false },
]

export default function PortalDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data:{ user } }) => {
      if (!user) { router.push('/login'); return }
      setUser(user); setLoading(false)
    })
  }, [])

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontFamily:'Spectral,serif', color:'#9B9B9B' }}>Loading your portal…</div>
    </div>
  )

  const firstName = user?.email?.split('@')[0]?.split('.')?.[0] || 'there'

  return (
    <Layout user={user} title="Dashboard">
      <div style={{ marginBottom:'2rem' }}>
        <p className="section-label">Client Portal</p>
        <div className="lav-rule" />
        <h1 style={{ fontFamily:'Spectral,serif', fontSize:'clamp(1.6rem,2.5vw,2rem)', fontWeight:500, marginBottom:'0.35rem' }}>
          Welcome back, <em style={{ color:'var(--lav)', fontStyle:'italic' }}>{firstName}</em>
        </h1>
        <p style={{ color:'#6B6B6B', fontWeight:300 }}>Here's what's happening with your AI compliance project.</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        <StatCard label="Project status" value="Active" sub="Audit in progress" icon="✅" accent="var(--lav)" />
        <StatCard label="Documents" value="3" sub="2 awaiting signature" icon="📄" />
        <StatCard label="Next milestone" value="14 Jul" sub="Draft report delivery" icon="📅" />
        <StatCard label="Outstanding" value="£0" sub="All invoices paid" icon="💳" accent="#065F46" />
      </div>

      {/* Project timeline */}
      <div className="card" style={{ marginBottom:'1.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
          <div>
            <div style={{ fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#9B9B9B', marginBottom:'0.3rem' }}>Current engagement</div>
            <h2 style={{ fontFamily:'Spectral,serif', fontSize:'1.15rem', fontWeight:500 }}>Full AI Hiring Audit</h2>
          </div>
          <span className="badge badge-lav">In progress</span>
        </div>

        {STEPS.map((s, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'0.6rem 0', borderBottom: i<4 ? '1px solid #EBEBEB' : 'none' }}>
            <div style={{
              width:28, height:28, borderRadius:'50%', flexShrink:0,
              background: s.done ? 'var(--lav)' : s.active ? 'rgba(111,92,156,0.12)' : '#F2F2F2',
              border: s.active ? '2px solid var(--lav)' : '2px solid transparent',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'0.72rem', fontWeight:700,
              color: s.done ? 'white' : s.active ? 'var(--lav)' : '#C4C4C4',
            }}>
              {s.done ? '✓' : i+1}
            </div>
            <div style={{ flex:1, fontSize:'0.875rem', fontWeight: s.done||s.active ? 500 : 400, color: s.done ? '#2E2E2E' : s.active ? 'var(--lav)' : '#9B9B9B' }}>{s.label}</div>
            <div style={{ fontSize:'0.75rem', color: s.active ? 'var(--lav)' : '#C4C4C4', fontWeight: s.active ? 600 : 400 }}>{s.date}</div>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
        <div className="card">
          <h3 style={{ fontFamily:'Spectral,serif', fontSize:'1rem', fontWeight:500, marginBottom:'0.1rem' }}>Recent activity</h3>
          <p style={{ fontSize:'0.78rem', color:'#9B9B9B', marginBottom:'0.25rem' }}>Updates on your project</p>
          <Activity icon="📄" title="Information pack uploaded by Stephanie" time="2 days ago" tag="Document" tagColor="lav" />
          <Activity icon="✍️" title="Statement of Work sent for signature" time="5 days ago" tag="Signature needed" tagColor="amber" />
          <Activity icon="💬" title="Message from Stephanie" time="6 days ago" tag="Unread" tagColor="blue" />
          <Activity icon="✅" title="Discovery call completed" time="18 Jun 2026" tag="Done" tagColor="green" />
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          <h3 style={{ fontFamily:'Spectral,serif', fontSize:'1rem', fontWeight:500 }}>Quick actions</h3>
          <QuickAction href="/portal/documents" icon="📄" label="Upload a document" desc="Share files securely with Stephanie" />
          <QuickAction href="/portal/documents" icon="✍️" label="Sign documents" desc="2 documents awaiting your signature" />
          <QuickAction href="/portal/messages" icon="💬" label="Send a message" desc="Get in touch with your consultant" />
          <QuickAction href="/portal/compliance" icon="🛡️" label="View compliance report" desc="Your latest ICO ADM assessment" />
        </div>
      </div>
    </Layout>
  )
}
