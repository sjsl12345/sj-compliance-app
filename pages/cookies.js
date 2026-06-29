import Head from 'next/head'
import Link from 'next/link'
const S={
  page:{minHeight:'100vh',background:'linear-gradient(135deg,rgba(230,220,255,.45) 0%,rgba(255,255,255,0) 40%),linear-gradient(225deg,rgba(200,235,255,.35) 0%,rgba(255,255,255,0) 40%),linear-gradient(315deg,rgba(255,210,240,.30) 0%,rgba(255,255,255,0) 40%),linear-gradient(45deg,rgba(210,245,240,.25) 0%,rgba(255,255,255,0) 40%),linear-gradient(160deg,#F8F6FC,#F3F0FA)',fontFamily:"'Inter','Segoe UI',sans-serif",color:'#2E2E2E',lineHeight:1.7},
  nav:{background:'white',borderBottom:'1px solid #EBEBEB',padding:'1rem 2rem',display:'flex',alignItems:'center',justifyContent:'space-between'},
  inner:{maxWidth:760,margin:'0 auto',padding:'3rem 2rem 5rem'},
  h1:{fontFamily:"'Spectral',serif",fontSize:'clamp(1.6rem,3vw,2.2rem)',fontWeight:500,marginBottom:'0.5rem'},
  h2:{fontFamily:"'Spectral',serif",fontSize:'1.15rem',fontWeight:500,marginTop:'2.5rem',marginBottom:'0.75rem'},
  p:{fontSize:'0.925rem',color:'#4A4A4A',marginBottom:'1rem'},
  rule:{width:'2.5rem',height:'2px',background:'#6F5C9C',borderRadius:2,margin:'0.75rem 0 2rem'},
  meta:{fontSize:'0.8rem',color:'#9B9B9B',marginBottom:'0'},
  a:{color:'#6F5C9C',textDecoration:'none'},
  back:{fontSize:'0.85rem',color:'#6F5C9C',textDecoration:'none'},
  table:{width:'100%',borderCollapse:'collapse',fontSize:'0.875rem',marginBottom:'1.5rem'},
  th:{background:'rgba(111,92,156,0.08)',padding:'0.6rem 0.875rem',textAlign:'left',fontWeight:600,fontSize:'0.8rem',borderBottom:'2px solid rgba(111,92,156,0.2)'},
  td:{padding:'0.6rem 0.875rem',borderBottom:'1px solid #EBEBEB',color:'#4A4A4A',verticalAlign:'top'},
}
export default function Cookies() {
  return (
    <>
      <Head><title>Cookie Policy — SJ Remote Solutions</title>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <link href="https://fonts.googleapis.com/css2?family=Spectral:wght@400;500&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/>
      </Head>
      <div style={S.page}>
        <nav style={S.nav}>
          <Link href="/" style={S.back}>← Back to portal</Link>
          <span style={{fontSize:'0.75rem',color:'#9B9B9B'}}>SJ Remote Solutions</span>
        </nav>
        <div style={S.inner}>
          <p style={S.meta}>Last updated: 29 June 2026</p>
          <h1 style={S.h1}>Cookie Policy</h1>
          <div style={S.rule}/>
          <p style={S.p}>This Cookie Policy explains how SJ Remote Solutions uses cookies when you use the client portal. By using the portal, you consent to the use of essential cookies as described below.</p>
          <h2 style={S.h2}>What are cookies?</h2>
          <p style={S.p}>Cookies are small text files stored on your device by your browser. They allow the portal to remember whether you are logged in and keep your session secure.</p>
          <h2 style={S.h2}>Cookies we use</h2>
          <p style={S.p}>This portal uses only <strong>strictly necessary cookies</strong>. We do not use advertising, tracking, or analytics cookies.</p>
          <table style={S.table}>
            <thead><tr><th style={S.th}>Cookie</th><th style={S.th}>Purpose</th><th style={S.th}>Duration</th><th style={S.th}>Type</th></tr></thead>
            <tbody>
              <tr><td style={S.td}><code>sb-access-token</code></td><td style={S.td}>Maintains your authenticated session</td><td style={S.td}>1 hour</td><td style={S.td}>Essential</td></tr>
              <tr><td style={S.td}><code>sb-refresh-token</code></td><td style={S.td}>Renews your session without re-login</td><td style={S.td}>30 days</td><td style={S.td}>Essential</td></tr>
              <tr><td style={S.td}><code>__vercel_live_token</code></td><td style={S.td}>Hosting provider deployment and caching</td><td style={S.td}>Session</td><td style={S.td}>Essential</td></tr>
            </tbody>
          </table>
          <h2 style={S.h2}>Why we don&rsquo;t need consent</h2>
          <p style={S.p}>Under UK PECR, strictly necessary cookies required for the operation of a service do not require consent. All cookies here are essential — without them you cannot log in or use the portal securely.</p>
          <h2 style={S.h2}>Managing cookies</h2>
          <p style={S.p}>You can delete cookies through your browser settings. Disabling essential cookies will prevent you from using the portal. See <a href="https://www.aboutcookies.org" style={S.a} target="_blank" rel="noopener">aboutcookies.org</a> for instructions.</p>
          <h2 style={S.h2}>Contact</h2>
          <p style={S.p}>Questions? Email <a href="mailto:stephanie@sjremotesolutions.co.uk" style={S.a}>stephanie@sjremotesolutions.co.uk</a></p>
        </div>
      </div>
    </>
  )
}
