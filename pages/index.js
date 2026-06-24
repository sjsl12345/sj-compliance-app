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
      </Head>

      <div className="min-h-screen" style={{background:'#F8F6F3'}}>
        <BetaBanner />

        {/* NAV */}
        <nav style={{background:'white', borderBottom:'1px solid #EDE8E3'}} className="px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'#2A9D8F'}}>
                <span className="text-white font-bold text-sm">SJ</span>
              </div>
              <div>
                <div className="font-semibold text-sm" style={{color:'#2C2C2E'}}>SJ Remote Solutions</div>
                <div className="text-xs" style={{color:'#8E8E93'}}>AI Compliance Companion</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium" style={{color:'#636366'}}>Sign in</Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-4">Get started free</Link>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="gradient-bg py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-6" style={{background:'white', color:'#2A9D8F', border:'1px solid #B8DDD9'}}>
              <span className="w-2 h-2 rounded-full" style={{background:'#2A9D8F'}}></span>
              Free for UK recruitment agencies
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{color:'#2C2C2E'}}>
              Is your AI hiring process<br />
              <span style={{color:'#2A9D8F'}}>ICO compliant?</span>
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed" style={{color:'#636366'}}>
              The ICO's automated decision-making framework and the Data (Use and Access) Act 2025 place new obligations on recruitment agencies using AI. Find out where you stand in under 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="btn-primary text-base">
                Check my compliance — it's free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/login" className="btn-secondary text-base">
                I already have an account
              </Link>
            </div>
            <p className="text-sm mt-4" style={{color:'#AEAEB2'}}>No credit card. No obligation. Just clarity.</p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 px-6" style={{background:'white'}}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4" style={{color:'#2C2C2E'}}>How it works</h2>
            <p className="text-center mb-12 max-w-xl mx-auto" style={{color:'#636366'}}>Three steps to understanding your AI hiring compliance position</p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Answer 12 questions', desc: 'Tell us how you use AI in your hiring process. Takes about 4 minutes. No technical knowledge needed.' },
                { step: '02', title: 'Get your risk score', desc: 'Instantly see your Red, Amber, or Green ICO ADM compliance rating with a breakdown by category.' },
                { step: '03', title: 'Know what to fix', desc: 'See exactly which gaps need addressing and how serious they are. Your compliance dashboard updates as you improve.' },
              ].map(item => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:'#E8F4F3'}}>
                    <span className="font-bold text-sm" style={{color:'#2A9D8F'}}>{item.step}</span>
                  </div>
                  <h3 className="font-semibold mb-2" style={{color:'#2C2C2E'}}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{color:'#636366'}}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY IT MATTERS */}
        <section className="py-20 px-6" style={{background:'#F8F6F3'}}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12" style={{color:'#2C2C2E'}}>Why this matters now</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'UK GDPR Article 22', desc: 'Candidates have the right to not be subject to solely automated decisions. If your AI makes or significantly influences hiring decisions, you must tell candidates and give them the right to a human review.' },
                { title: 'ICO ADM Framework', desc: 'The ICO has published detailed guidance on automated decision-making in recruitment. Non-compliance can result in enforcement action, fines, and reputational damage.' },
                { title: 'Data (Use and Access) Act 2025', desc: 'A new complaints process came into force on 19 June 2026. Candidates now have clearer routes to challenge AI-based hiring decisions.' },
                { title: 'Your clients expect it', desc: 'End-client organisations increasingly require their recruitment partners to demonstrate AI compliance as part of supplier due diligence.' },
              ].map(item => (
                <div key={item.title} className="card">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{background:'#2A9D8F'}}>
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{color:'#2C2C2E'}}>{item.title}</h3>
                      <p className="text-sm leading-relaxed" style={{color:'#636366'}}>{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6" style={{background:'white'}}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4" style={{color:'#2C2C2E'}}>Ready to find out where you stand?</h2>
            <p className="mb-8" style={{color:'#636366'}}>Free, plain-English, built specifically for UK recruitment agencies.</p>
            <Link href="/register" className="btn-primary text-base">
              Start your free compliance check
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-8 px-6" style={{borderTop:'1px solid #EDE8E3', background:'#F8F6F3'}}>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{background:'#2A9D8F'}}>
                <span className="text-white font-bold text-xs">SJ</span>
              </div>
              <span className="text-sm" style={{color:'#8E8E93'}}>SJ Remote Solutions · AI Governance & Compliance</span>
            </div>
            <div className="text-sm" style={{color:'#8E8E93'}}>
              <a href="mailto:stephanie@sjremotesolutions.co.uk" style={{color:'#2A9D8F'}}>stephanie@sjremotesolutions.co.uk</a>
              <span className="mx-2">·</span>
              <a href="https://sjremotesolutions.co.uk" style={{color:'#2A9D8F'}}>sjremotesolutions.co.uk</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
