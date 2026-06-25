import Head from 'next/head'
import Link from 'next/link'
import BetaBanner from '../components/BetaBanner'

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Hiring Compliance Checker — SJ Remote Solutions</title>
        <meta name="description" content="Free AI hiring compliance tool for UK recruitment agencies. Check your ICO ADM obligations in minutes." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>

      <div className="min-h-screen" style={{ background: '#FAFAF9', color: '#2E2E2E' }}>
        <BetaBanner />

        {/* NAV */}
        <nav style={{ background: 'white', borderBottom: '1px solid #EBEBEB' }} className="px-6 py-5">
          <div className="max-w-6xl mx-auto flex items-center justify-end gap-6">
            <Link href="/login" className="text-sm font-medium" style={{ color: '#6B6B6B', letterSpacing: '0.01em' }}>Sign in</Link>
            <Link href="/register" className="btn-primary text-sm">Get started free</Link>
          </div>
        </nav>

        {/* HERO */}
        <section className="px-6 pt-24 pb-20" style={{ background: 'white' }}>
          <div className="max-w-4xl mx-auto text-center">
            <div style={{ marginBottom: '2.5rem', display: 'inline-block' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1, display: 'flex', alignItems: 'flex-start', gap: '0.5rem', justifyContent: 'center' }}>
                <span style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', fontWeight: 700, color: '#2E2E2E', letterSpacing: '-0.04em', lineHeight: 1 }}>SJ</span>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '0.6rem' }}>
                  <span style={{ fontSize: 'clamp(0.9rem, 2vw, 1.35rem)', fontWeight: 500, color: '#2E2E2E', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1.2 }}>Remote</span>
                  <span style={{ fontSize: 'clamp(0.9rem, 2vw, 1.35rem)', fontWeight: 500, color: '#3DCFBF', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1.2 }}>Solutions</span>
                </div>
              </div>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 500, color: '#2E2E2E', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
              Is your AI hiring process<br />
              <em style={{ color: '#3DCFBF', fontStyle: 'italic' }}>ICO compliant?</em>
            </h1>
            <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B6B6B', fontWeight: 300 }}>
              The ICO's automated decision-making framework and the Data (Use and Access) Act 2025 place real obligations on recruitment agencies using AI. Know where you stand in under five minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="btn-primary">
                Check my compliance — it's free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>
              <Link href="/login" className="btn-secondary">
                Sign in to my dashboard
              </Link>
            </div>
            <p className="text-sm mt-5" style={{ color: '#9B9B9B' }}>No credit card. No obligation. Just clarity.</p>
          </div>
        </section>

        {/* THIN TEAL RULE */}
        <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent 0%, #3DCFBF 30%, #3DCFBF 70%, transparent 100%)', opacity: 0.25 }} />

        {/* HOW IT WORKS */}
        <section className="py-24 px-6" style={{ background: '#FAFAF9' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="section-label mb-3">Process</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 500, color: '#2E2E2E' }}>How it works</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { step: '01', title: 'Answer 12 questions', desc: 'Tell us how AI features in your hiring process. Plain English throughout — no technical knowledge needed. Takes about four minutes.' },
                { step: '02', title: 'Get your risk score', desc: 'Receive an instant Red, Amber or Green ICO ADM compliance rating with a breakdown by category so you know exactly where the gaps are.' },
                { step: '03', title: 'Know what to fix', desc: 'See a prioritised list of compliance gaps with guidance on severity. Your dashboard updates as your position improves.' },
              ].map(item => (
                <div key={item.step} className="text-center">
                  <div className="mb-5">
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 400, color: '#EBEBEB', letterSpacing: '-0.02em' }}>{item.step}</span>
                  </div>
                  <div className="teal-rule mx-auto" />
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 500, color: '#2E2E2E', marginBottom: '0.75rem' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B6B6B', fontWeight: 300 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY IT MATTERS */}
        <section className="py-24 px-6" style={{ background: 'white' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="section-label mb-3">The legal context</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 500, color: '#2E2E2E' }}>Why this matters now</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  title: 'UK GDPR Article 22',
                  desc: 'Candidates have the right not to be subject to solely automated decisions. If AI makes or significantly influences hiring decisions, you must disclose this and provide a route to human review.',
                },
                {
                  title: 'ICO ADM Framework',
                  desc: 'The ICO has published detailed guidance on automated decision-making in recruitment. Non-compliance can result in enforcement action, fines, and reputational damage.',
                },
                {
                  title: 'Data (Use and Access) Act 2025',
                  desc: 'A formal complaints and redress process came into force on 19 June 2026. Candidates now have clearer, stronger routes to challenge AI-based hiring decisions directly.',
                  highlight: true,
                },
                {
                  title: 'Client due diligence',
                  desc: 'End-client organisations increasingly require their recruitment partners to demonstrate AI governance as part of supplier qualification. Compliance is becoming table stakes.',
                },
              ].map(item => (
                <div key={item.title} className="card" style={item.highlight ? { borderColor: '#3DCFBF', borderWidth: '1.5px' } : {}}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {item.highlight
                        ? <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#3DCFBF' }} />
                        : <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#EBEBEB' }} />
                      }
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 500, color: '#2E2E2E', marginBottom: '0.5rem' }}>{item.title}</h3>
                      {item.highlight && <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3DCFBF', display: 'block', marginBottom: '0.5rem' }}>In force now</span>}
                      <p className="text-sm leading-relaxed" style={{ color: '#6B6B6B', fontWeight: 300 }}>{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6" style={{ background: '#2E2E2E' }}>
          <div className="max-w-2xl mx-auto text-center">
            <div className="teal-rule mx-auto" style={{ marginBottom: '2rem' }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 400, color: 'white', marginBottom: '1rem', lineHeight: 1.25 }}>
              Ready to find out<br />where you stand?
            </h2>
            <p className="mb-8 text-sm" style={{ color: '#9B9B9B', fontWeight: 300, letterSpacing: '0.01em' }}>
              Free, plain-English, built specifically for UK recruitment agencies.
            </p>
            <Link href="/register" className="btn-teal">
              Start your free compliance check
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-8 px-6" style={{ borderTop: '1px solid #EBEBEB', background: 'white' }}>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: '#2E2E2E' }}>
                <span className="text-white font-semibold text-xs">SJ</span>
              </div>
              <span className="text-sm" style={{ color: '#9B9B9B', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>SJ Remote Solutions</span>
            </div>
            <div className="text-xs" style={{ color: '#9B9B9B', letterSpacing: '0.03em' }}>
              <a href="mailto:stephanie@sjremotesolutions.co.uk" style={{ color: '#3DCFBF' }}>stephanie@sjremotesolutions.co.uk</a>
              <span className="mx-2">·</span>
              <a href="https://sjremotesolutions.co.uk" style={{ color: '#3DCFBF' }}>sjremotesolutions.co.uk</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
