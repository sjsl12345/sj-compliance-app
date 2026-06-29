import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'

const INIT_MESSAGES = [
  { id:1, from:'stephanie', text:"Hi! Just confirming I've received your information gathering questionnaire — really thorough, thank you. I'll begin the ICO ADM analysis this week and aim to have a draft report ready by 14 July.", time:'27 Jun · 10:14', read:true },
  { id:2, from:'stephanie', text:"Also, I've uploaded the Statement of Work and Data Processing Agreement to your portal — please sign these when you get a chance so we're formally on board. Let me know if you have any questions about either document.", time:'27 Jun · 10:16', read:true },
  { id:3, from:'client', text:"Thanks Stephanie! Will get those signed today. Quick question — do you need the documentation for our LinkedIn Recruiter integration as well, or just Workable?", time:'28 Jun · 09:02', read:true },
  { id:4, from:'stephanie', text:"Yes please — LinkedIn Recruiter would be very useful, particularly the candidate ranking features. If you can export any documentation on how the algorithm works, or even just screenshots of the settings, that would be great.", time:'28 Jun · 11:30', read:true },
]

function Bubble({ msg, user }) {
  const isMe = msg.from === 'client'
  return (
    <div style={{ display:'flex', flexDirection: isMe?'row-reverse':'row', gap:'0.75rem', marginBottom:'1.25rem', alignItems:'flex-end' }}>
      {!isMe && (
        <div style={{ width:34, height:34, borderRadius:'50%', background:'rgba(111,92,156,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem', fontWeight:700, color:'var(--lav)', flexShrink:0 }}>SJ</div>
      )}
      <div style={{ maxWidth:'72%' }}>
        <div style={{
          padding:'0.875rem 1.1rem', borderRadius:14,
          borderBottomRightRadius: isMe?4:14, borderBottomLeftRadius: isMe?14:4,
          background: isMe ? 'var(--lav)' : 'white',
          border: isMe ? 'none' : '1px solid #EBEBEB',
          color: isMe ? 'white' : '#2E2E2E',
          fontSize:'0.875rem', lineHeight:1.6,
        }}>
          {msg.text}
        </div>
        <div style={{ fontSize:'0.7rem', color:'#C4C4C4', marginTop:'0.3rem', textAlign: isMe?'right':'left' }}>{msg.time}</div>
      </div>
    </div>
  )
}

export default function Messages() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState(INIT_MESSAGES)
  const [draft, setDraft] = useState('')
  const bottomRef = useRef()

  useEffect(()=>{
    supabase.auth.getUser().then(({data:{user}})=>{
      if(!user){router.push('/login');return}
      setUser(user);setLoading(false)
    })
  },[])

  useEffect(()=>{ bottomRef.current?.scrollIntoView({ behavior:'smooth' }) },[messages])

  function sendMessage(e) {
    e.preventDefault()
    if (!draft.trim()) return
    setMessages(m=>[...m, { id:Date.now(), from:'client', text:draft.trim(), time:'Just now', read:true }])
    setDraft('')
    setTimeout(()=>{
      setMessages(m=>[...m, { id:Date.now()+1, from:'stephanie', text:"Thanks for your message! I'll get back to you shortly. In the meantime, if it's urgent you can reach me at stephanie@sjremotesolutions.co.uk.", time:'Just now', read:true }])
    }, 2000)
  }

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{fontFamily:'Spectral,serif',color:'#9B9B9B'}}>Loading…</div></div>

  return (
    <Layout user={user} title="Messages">
      <div style={{ marginBottom:'1.5rem' }}>
        <p className="section-label">Secure messaging</p>
        <div className="lav-rule" />
        <h1 style={{ fontFamily:'Spectral,serif', fontSize:'1.75rem', fontWeight:500 }}>Messages</h1>
        <p style={{ color:'#6B6B6B', fontWeight:300, marginTop:'0.3rem' }}>Communicate securely with Stephanie. Messages are private and stored within your portal.</p>
      </div>

      <div className="card" style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 240px)', minHeight:480 }}>
        {/* Thread header */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.875rem', padding:'1rem 1.5rem', borderBottom:'1px solid #EBEBEB' }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(111,92,156,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem', fontWeight:700, color:'var(--lav)' }}>SJ</div>
          <div>
            <div style={{ fontSize:'0.875rem', fontWeight:600, color:'#2E2E2E' }}>Stephanie Jones</div>
            <div style={{ fontSize:'0.75rem', color:'#9B9B9B' }}>AI Governance Consultant · SJ Remote Solutions</div>
          </div>
          <span className="badge badge-green" style={{ marginLeft:'auto' }}>● Online</span>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:'auto', padding:'1.25rem 1.5rem' }}>
          {messages.map(m=><Bubble key={m.id} msg={m} user={user}/>)}
          <div ref={bottomRef} />
        </div>

        {/* Composer */}
        <div style={{ borderTop:'1px solid #EBEBEB', padding:'1rem 1.5rem' }}>
          <form onSubmit={sendMessage} style={{ display:'flex', gap:'0.75rem', alignItems:'flex-end' }}>
            <textarea
              value={draft} onChange={e=>setDraft(e.target.value)}
              placeholder="Write a message…"
              rows={2}
              style={{ flex:1, padding:'0.75rem 1rem', border:'1px solid #EBEBEB', borderRadius:10, fontFamily:'Inter,sans-serif', fontSize:'0.875rem', color:'#2E2E2E', resize:'none', outline:'none', lineHeight:1.6 }}
              onFocus={e=>e.target.style.borderColor='var(--lav)'}
              onBlur={e=>e.target.style.borderColor='#EBEBEB'}
              onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage(e)} }}
            />
            <button type="submit" className="btn btn-lav" disabled={!draft.trim()} style={{ padding:'0.75rem 1.25rem', opacity:draft.trim()?1:0.5 }}>Send →</button>
          </form>
          <p style={{ fontSize:'0.72rem', color:'#C4C4C4', marginTop:'0.5rem' }}>Press Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </Layout>
  )
}
