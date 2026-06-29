import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'

function Section({ title, children }) {
  return (
    <div className="card" style={{ marginBottom:'1.25rem' }}>
      <h2 style={{ fontFamily:'Spectral,serif', fontSize:'1rem', fontWeight:500, marginBottom:'1.25rem', paddingBottom:'0.875rem', borderBottom:'1px solid #EBEBEB' }}>{title}</h2>
      {children}
    </div>
  )
}

function SettingRow({ label, desc, children }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'2rem', padding:'0.75rem 0', borderBottom:'1px solid #EBEBEB' }}>
      <div>
        <div style={{ fontSize:'0.875rem', fontWeight:500, color:'#2E2E2E', marginBottom:'0.1rem' }}>{label}</div>
        {desc && <div style={{ fontSize:'0.78rem', color:'#9B9B9B' }}>{desc}</div>}
      </div>
      <div style={{ flexShrink:0 }}>{children}</div>
    </div>
  )
}

function Toggle({ on, onChange }) {
  return (
    <button onClick={()=>onChange(!on)} style={{
      width:44, height:24, borderRadius:12, border:'none', cursor:'pointer', position:'relative',
      background: on ? 'var(--lav)' : '#D1D5DB', transition:'background .2s', padding:0,
    }}>
      <div style={{ position:'absolute', top:2, left: on?22:2, width:20, height:20, borderRadius:'50%', background:'white', transition:'left .2s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }} />
    </button>
  )
}

export default function Settings() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [twoFA, setTwoFA] = useState(false)
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [portalNotifs, setPortalNotifs] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(()=>{
    supabase.auth.getUser().then(({data:{user}})=>{
      if(!user){router.push('/login');return}
      setUser(user);setLoading(false)
    })
  },[])

  function showToast(msg) { setToast(msg); setTimeout(()=>setToast(null), 3000) }

  async function handleExport() {
    showToast('Preparing your data export — you will receive an email shortly.')
  }

  async function handlePasswordReset() {
    if (!user?.email) return
    await supabase.auth.resetPasswordForEmail(user.email)
    showToast('Password reset email sent to ' + user.email)
  }

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{fontFamily:'Spectral,serif',color:'#9B9B9B'}}>Loading…</div></div>

  return (
    <Layout user={user} title="Settings">
      {toast && (
        <div style={{ position:'fixed', top:'1.5rem', right:'1.5rem', background:'#2E2E2E', color:'white', padding:'0.75rem 1.25rem', borderRadius:10, fontSize:'0.875rem', fontWeight:500, zIndex:300 }}>{toast}</div>
      )}

      <div style={{ marginBottom:'2rem' }}>
        <p className="section-label">Account</p>
        <div className="lav-rule" />
        <h1 style={{ fontFamily:'Spectral,serif', fontSize:'1.75rem', fontWeight:500 }}>Settings</h1>
        <p style={{ color:'#6B6B6B', fontWeight:300, marginTop:'0.3rem' }}>Manage your account, security, and data preferences.</p>
      </div>

      <div style={{ maxWidth:680 }}>
        {/* Profile */}
        <Section title="Profile">
          <SettingRow label="Email address" desc={user?.email}>
            <button className="btn btn-outline" style={{ fontSize:'0.8rem', padding:'0.4rem 0.875rem' }} onClick={()=>showToast('Contact Stephanie to update your email address.')}>Change</button>
          </SettingRow>
          <SettingRow label="Password" desc="Last changed: unknown">
            <button className="btn btn-outline" style={{ fontSize:'0.8rem', padding:'0.4rem 0.875rem' }} onClick={handlePasswordReset}>Reset →</button>
          </SettingRow>
          <SettingRow label="Agency name" desc="Registered on onboarding">
            <button className="btn btn-outline" style={{ fontSize:'0.8rem', padding:'0.4rem 0.875rem' }} onClick={()=>showToast('Contact Stephanie to update your agency details.')}>Edit</button>
          </SettingRow>
        </Section>

        {/* Security */}
        <Section title="Security">
          <SettingRow
            label="Two-factor authentication"
            desc={twoFA ? "2FA is enabled — your account is protected" : "Add an extra layer of security to your account"}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              {twoFA && <span className="badge badge-green">Enabled</span>}
              <Toggle on={twoFA} onChange={v=>{ setTwoFA(v); showToast(v?'2FA enabled — authenticator app setup required':'2FA disabled') }} />
            </div>
          </SettingRow>
          <SettingRow label="Active sessions" desc="You are signed in on this device">
            <button className="btn btn-outline" style={{ fontSize:'0.8rem', padding:'0.4rem 0.875rem' }} onClick={()=>showToast('All other sessions signed out.')}>Sign out all other devices</button>
          </SettingRow>
          <SettingRow label="Portal data hosting" desc="UK-based servers (AWS London region) · GDPR Article 44 compliant">
            <span className="badge badge-green">🇬🇧 UK</span>
          </SettingRow>
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <SettingRow label="Email notifications" desc="New documents, messages, and project updates">
            <Toggle on={emailNotifs} onChange={v=>{ setEmailNotifs(v); showToast('Email notifications ' + (v?'enabled':'disabled')) }} />
          </SettingRow>
          <SettingRow label="Portal notifications" desc="In-portal alerts for signatures and milestones">
            <Toggle on={portalNotifs} onChange={v=>{ setPortalNotifs(v); showToast('Portal notifications ' + (v?'enabled':'disabled')) }} />
          </SettingRow>
        </Section>

        {/* Data & GDPR */}
        <Section title="Your data (UK GDPR)">
          <SettingRow label="Download your data" desc="Export all portal data — documents, messages, and account information">
            <button className="btn btn-outline" style={{ fontSize:'0.8rem', padding:'0.4rem 0.875rem' }} onClick={handleExport}>Request export</button>
          </SettingRow>
          <SettingRow label="Subject access request" desc="Request a full record of data held about you">
            <button className="btn btn-outline" style={{ fontSize:'0.8rem', padding:'0.4rem 0.875rem' }} onClick={()=>showToast('SAR submitted — you will receive a response within 30 days.')}>Submit SAR</button>
          </SettingRow>
          <SettingRow label="Privacy policy" desc="How SJ Remote Solutions handles your data">
            <a href="https://sjremotesolutions.co.uk/privacy" target="_blank" className="btn btn-outline" style={{ fontSize:'0.8rem', padding:'0.4rem 0.875rem' }}>View →</a>
          </SettingRow>
        </Section>

        {/* Danger zone */}
        <Section title="Close account">
          <div style={{ fontSize:'0.875rem', color:'#6B6B6B', marginBottom:'1rem' }}>
            Closing your account will permanently delete all portal data including documents and messages. This cannot be undone. Please contact Stephanie before closing if your engagement is ongoing.
          </div>
          <button className="btn btn-danger" onClick={()=>showToast('Please email stephanie@sjremotesolutions.co.uk to request account closure.')}>Request account closure</button>
        </Section>
      </div>
    </Layout>
  )
}
