import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'

const INVOICES = [
  { id:'INV-2026-001', desc:'Full AI Hiring Audit — Deposit (50%)', amount:1750, date:'20 Jun 2026', due:'27 Jun 2026', status:'paid', paid:'27 Jun 2026' },
  { id:'INV-2026-002', desc:'Full AI Hiring Audit — Final Payment (50%)', amount:1750, date:'1 Jul 2026', due:'15 Jul 2026', status:'outstanding', paid:null },
]

function InvoiceRow({ inv, onPay }) {
  const stMap = {
    paid:        { label:'Paid', cls:'badge-green' },
    outstanding: { label:'Outstanding', cls:'badge-amber' },
    overdue:     { label:'Overdue', cls:'badge-red' },
  }
  const st = stMap[inv.status]
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'1rem 0', borderBottom:'1px solid #EBEBEB' }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:'0.875rem', fontWeight:600, color:'#2E2E2E', marginBottom:'0.1rem' }}>{inv.id}</div>
        <div style={{ fontSize:'0.8rem', color:'#6B6B6B', marginBottom:'0.1rem' }}>{inv.desc}</div>
        <div style={{ fontSize:'0.75rem', color:'#9B9B9B' }}>Issued {inv.date} · Due {inv.due}</div>
      </div>
      <div style={{ textAlign:'right', flexShrink:0 }}>
        <div style={{ fontFamily:'Spectral,serif', fontSize:'1.1rem', fontWeight:500, marginBottom:'0.3rem' }}>£{inv.amount.toLocaleString()}</div>
        <span className={`badge ${st.cls}`}>{st.label}</span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', flexShrink:0 }}>
        {inv.status === 'outstanding' && (
          <button className="btn btn-lav" style={{ fontSize:'0.8rem', padding:'0.45rem 1rem' }} onClick={()=>onPay(inv)}>Pay now →</button>
        )}
        <button className="btn btn-outline" style={{ fontSize:'0.8rem', padding:'0.45rem 0.875rem' }}>↓ PDF</button>
      </div>
    </div>
  )
}

function PayModal({ inv, onClose }) {
  const [step, setStep] = useState(1)
  if (!inv) return null
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(46,46,46,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
      <div className="card" style={{ width:'100%', maxWidth:460, padding:'2rem' }}>
        {step === 2 ? (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>✅</div>
            <h2 style={{ fontFamily:'Spectral,serif', fontSize:'1.2rem', fontWeight:500, marginBottom:'0.5rem' }}>Payment link sent</h2>
            <p style={{ color:'#6B6B6B', fontSize:'0.875rem', marginBottom:'1.5rem' }}>A secure payment link has been sent to your email. You will be redirected to Stripe to complete your payment safely.</p>
            <button className="btn btn-dark" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily:'Spectral,serif', fontSize:'1.1rem', fontWeight:500, marginBottom:'0.25rem' }}>Pay invoice</h2>
            <p style={{ fontSize:'0.8rem', color:'#9B9B9B', marginBottom:'1.5rem' }}>{inv.id} · {inv.desc}</p>
            <div className="card-lav" style={{ marginBottom:'1.25rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'0.85rem', color:'#6B6B6B' }}>Amount due</span>
                <span style={{ fontFamily:'Spectral,serif', fontSize:'1.5rem', fontWeight:500 }}>£{inv.amount.toLocaleString()}</span>
              </div>
            </div>
            <p style={{ fontSize:'0.8rem', color:'#9B9B9B', marginBottom:'1.5rem' }}>
              You will be redirected to a secure Stripe payment page. SJ Remote Solutions never stores your card details.
            </p>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button className="btn btn-outline" onClick={onClose} style={{ flex:1 }}>Cancel</button>
              <button className="btn btn-lav" onClick={()=>setStep(2)} style={{ flex:1 }}>Pay via Stripe →</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Invoices() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [payingInv, setPayingInv] = useState(null)

  useEffect(()=>{
    supabase.auth.getUser().then(({data:{user}})=>{
      if(!user){router.push('/login');return}
      setUser(user);setLoading(false)
    })
  },[])

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{fontFamily:'Spectral,serif',color:'#9B9B9B'}}>Loading…</div></div>

  const outstanding = INVOICES.filter(i=>i.status==='outstanding').reduce((a,i)=>a+i.amount,0)

  return (
    <Layout user={user} title="Invoices">
      <PayModal inv={payingInv} onClose={()=>setPayingInv(null)} />

      <div style={{ marginBottom:'2rem' }}>
        <p className="section-label">Billing & payments</p>
        <div className="lav-rule" />
        <h1 style={{ fontFamily:'Spectral,serif', fontSize:'1.75rem', fontWeight:500 }}>Invoices</h1>
        <p style={{ color:'#6B6B6B', fontWeight:300, marginTop:'0.3rem' }}>View and pay your invoices securely.</p>
      </div>

      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        <div className="card">
          <div style={{ fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#9B9B9B', marginBottom:'0.5rem' }}>Total invoiced</div>
          <div style={{ fontFamily:'Spectral,serif', fontSize:'1.75rem', fontWeight:500 }}>£{INVOICES.reduce((a,i)=>a+i.amount,0).toLocaleString()}</div>
        </div>
        <div className="card">
          <div style={{ fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#9B9B9B', marginBottom:'0.5rem' }}>Paid to date</div>
          <div style={{ fontFamily:'Spectral,serif', fontSize:'1.75rem', fontWeight:500, color:'#065F46' }}>£{INVOICES.filter(i=>i.status==='paid').reduce((a,i)=>a+i.amount,0).toLocaleString()}</div>
        </div>
        <div className="card">
          <div style={{ fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#9B9B9B', marginBottom:'0.5rem' }}>Outstanding</div>
          <div style={{ fontFamily:'Spectral,serif', fontSize:'1.75rem', fontWeight:500, color:outstanding>0?'#92400E':'#065F46' }}>£{outstanding.toLocaleString()}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom:'1.5rem' }}>
        <h2 style={{ fontFamily:'Spectral,serif', fontSize:'1rem', fontWeight:500, marginBottom:'1rem' }}>Invoice history</h2>
        {INVOICES.map(inv=><InvoiceRow key={inv.id} inv={inv} onPay={setPayingInv}/>)}
      </div>

      <div className="card-lav" style={{ padding:'1.25rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <span style={{ fontSize:'1.1rem' }}>🔒</span>
          <p style={{ fontSize:'0.85rem', color:'#6B6B6B' }}>All payments are processed securely via Stripe. SJ Remote Solutions is registered in England & Wales and is professionally insured.</p>
        </div>
      </div>
    </Layout>
  )
}
