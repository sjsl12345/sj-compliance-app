import Head from 'next/head'
import Link from 'next/link'
const S = {
  page:{minHeight:'100vh',background:'linear-gradient(135deg,rgba(230,220,255,.45) 0%,rgba(255,255,255,0) 40%),linear-gradient(225deg,rgba(200,235,255,.35) 0%,rgba(255,255,255,0) 40%),linear-gradient(315deg,rgba(255,210,240,.30) 0%,rgba(255,255,255,0) 40%),linear-gradient(45deg,rgba(210,245,240,.25) 0%,rgba(255,255,255,0) 40%),linear-gradient(160deg,#F8F6FC,#F3F0FA)',fontFamily:"'Inter','Segoe UI',sans-serif",color:'#2E2E2E',lineHeight:1.7},
  nav:{background:'white',borderBottom:'1px solid #EBEBEB',padding:'1rem 2rem',display:'flex',alignItems:'center',justifyContent:'space-between'},
  inner:{maxWidth:760,margin:'0 auto',padding:'3rem 2rem 5rem'},
  h1:{fontFamily:"'Spectral',serif",fontSize:'clamp(1.6rem,3vw,2.2rem)',fontWeight:500,marginBottom:'0.5rem'},
  h2:{fontFamily:"'Spectral',serif",fontSize:'1.15rem',fontWeight:500,marginTop:'2.5rem',marginBottom:'0.75rem'},
  p:{fontSize:'0.925rem',color:'#4A4A4A',marginBottom:'1rem'},
  rule:{width:'2.5rem',height:'2px',background:'#6F5C9C',borderRadius:2,margin:'0.75rem 0 2rem'},
  meta:{fontSize:'0.8rem',color:'#9B9B9B',marginBottom:'0'},
  ul:{fontSize:'0.925rem',color:'#4A4A4A',paddingLeft:'1.25rem',marginBottom:'1rem'},
  a:{color:'#6F5C9C',textDecoration:'none'},
  back:{fontSize:'0.85rem',color:'#6F5C9C',textDecoration:'none'},
}
export default function Privacy() {
  return (
    <>
      <Head><title>Privacy Policy — SJ Remote Solutions</title>
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
          <h1 style={S.h1}>Privacy Policy</h1>
          <div style={S.rule}/>
          <p style={S.p}>This Privacy Policy explains how SJ Remote Solutions collects, uses, and protects your personal data when you use this client portal, in accordance with the UK GDPR and the Data Protection Act 2018.</p>
          <h2 style={S.h2}>1. Who we are</h2>
          <p style={S.p}>SJ Remote Solutions is an independent AI governance and compliance consultancy operating as a sole trader, registered in England and Wales and registered with the ICO.</p>
          <p style={S.p}>Data controller: Stephanie Jones, SJ Remote Solutions<br/>Contact: <a href="mailto:stephanie@sjremotesolutions.co.uk" style={S.a}>stephanie@sjremotesolutions.co.uk</a></p>
          <h2 style={S.h2}>2. What data we collect</h2>
          <ul style={S.ul}>
            <li>Your name and email address (account creation and management)</li>
            <li>Your agency name and business information (provided during onboarding)</li>
            <li>Documents and files you upload through the portal</li>
            <li>Messages sent through the secure messaging feature</li>
            <li>Technical data including IP address, browser type, and login times</li>
          </ul>
          <h2 style={S.h2}>3. Legal basis for processing</h2>
          <ul style={S.ul}>
            <li><strong>Contract</strong> — processing necessary to provide our services (UK GDPR Art. 6(1)(b))</li>
            <li><strong>Legal obligation</strong> — retaining records as required by law (UK GDPR Art. 6(1)(c))</li>
            <li><strong>Legitimate interests</strong> — portal security and fraud prevention (UK GDPR Art. 6(1)(f))</li>
          </ul>
          <h2 style={S.h2}>4. Storage and security</h2>
          <p style={S.p}>Your data is stored securely using Supabase (EEA-hosted servers). We use TLS encryption in transit and encryption at rest. Access is restricted to you and SJ Remote Solutions.</p>
          <h2 style={S.h2}>5. Retention</h2>
          <p style={S.p}>We retain your data for as long as necessary to provide our services. Following the end of an engagement, records are retained for 6 years in accordance with standard professional practice, then securely deleted.</p>
          <h2 style={S.h2}>6. Your rights</h2>
          <p style={S.p}>Under UK GDPR you have the right to access, rectify, erase, restrict, or port your data, and to object to processing. To exercise any right, email <a href="mailto:stephanie@sjremotesolutions.co.uk" style={S.a}>stephanie@sjremotesolutions.co.uk</a>. You may also complain to the ICO at <a href="https://ico.org.uk" style={S.a}>ico.org.uk</a>.</p>
          <h2 style={S.h2}>7. Third-party services</h2>
          <p style={S.p}>We use Supabase (authentication and database), Vercel (hosting), and Stripe (payments) — each with adequate data protection safeguards.</p>
          <h2 style={S.h2}>8. Contact</h2>
          <p style={S.p}>Questions? Email <a href="mailto:stephanie@sjremotesolutions.co.uk" style={S.a}>stephanie@sjremotesolutions.co.uk</a></p>
        </div>
      </div>
    </>
  )
}
