import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Admin() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [agencies, setAgencies] = useState([])
  const [audits, setAudits] = useState([])
  const [selected, setSelected] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== 'stephanie@sjremotesolutions.co.uk') {
        router.push('/login'); return
      }
      setUser(user)
      const { data: agencyData } = await supabase.from('agencies').select('*').order('created_at', { ascending: false })
      const { data: auditData } = await supabase.from('audits').select('*').eq('completed', true).order('created_at', { ascending: false })
      setAgencies(agencyData || [])
      setAudits(auditData || [])
      setLoading(false)
    }
    load()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  function getLatestAudit(agencyId) {
    return audits.find(a => a.agency_id === agencyId)
  }

  function riskBadge(level) {
    if (level === 'high') return <span className="badge-red">High Risk</span>
    if (level === 'medium') return <span className="badge-amber">Medium Risk</span>
    if (level === 'low') return <span className="badge-green">Low Risk</span>
    return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">No audit</span>
  }

  const stats = {
    total: agencies.length,
    audited: audits.length,
    high: audits.filter(a => a.risk_level === 'high').length,
    medium: audits.filter(a => a.risk_level === 'medium').length,
    low: audits.filter(a => a.risk_level === 'low').length,
  }

  if (loading) return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <>
      <Head><title>Admin — SJ Remote Solutions</title></Head>
      <div className="min-h-screen bg-gray-50">
        <BetaBanner />
        <nav className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SJ</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">SJ Remote Solutions</div>
                <div className="text-xs text-gray-500">Admin Dashboard</div>
              </div>
            </div>
            <button onClick={signOut} className="text-sm text-gray-500 hover:text-gray-700">Sign out</button>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Agency Overview</h1>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total agencies', value: stats.total, color: 'text-gray-900' },
              { label: 'Audits completed', value: stats.audited, color: 'text-teal-600' },
              { label: 'High risk', value: stats.high, color: 'text-red-600' },
              { label: 'Medium risk', value: stats.medium, color: 'text-amber-600' },
              { label: 'Low risk', value: stats.low, color: 'text-teal-600' },
            ].map(s => (
              <div key={s.label} className="card text-center py-4">
                <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* AGENCIES TABLE */}
          <div className="card p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">All agencies</h2>
              <span className="text-sm text-gray-500">{agencies.length} registered</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Agency</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Risk level</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Score</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {agencies.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No agencies registered yet</td></tr>
                  ) : agencies.map(agency => {
                    const audit = getLatestAudit(agency.id)
                    return (
                      <tr key={agency.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(selected?.id === agency.id ? null : { agency, audit })}>
                        <td className="px-6 py-4 font-medium text-gray-900">{agency.company_name}</td>
                        <td className="px-6 py-4 text-gray-600">{agency.contact_name || '—'}</td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          <a href={`mailto:${agency.email}`} className="text-teal-600 hover:underline" onClick={e => e.stopPropagation()}>{agency.email}</a>
                        </td>
                        <td className="px-6 py-4">{riskBadge(audit?.risk_level)}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{audit ? `${audit.score}%` : '—'}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{new Date(agency.created_at).toLocaleDateString('en-GB')}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* SELECTED AGENCY DETAIL */}
          {selected && (
            <div className="card mt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{selected.agency.company_name}</h3>
                  <p className="text-gray-500 text-sm">{selected.agency.contact_name} · <a href={`mailto:${selected.agency.email}`} className="text-teal-600">{selected.agency.email}</a></p>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              {selected.audit ? (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">{selected.audit.score}%</div>
                      <div className="text-xs text-gray-500 mt-1">Compliance score</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <div className="mt-1">{riskBadge(selected.audit.risk_level)}</div>
                      <div className="text-xs text-gray-500 mt-1">Risk level</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <div className="text-sm font-medium text-gray-900">{new Date(selected.audit.created_at).toLocaleDateString('en-GB')}</div>
                      <div className="text-xs text-gray-500 mt-1">Audit date</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Audit answers</h4>
                    <div className="space-y-2">
                      {selected.audit.answers && Object.entries(selected.audit.answers).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50">
                          <span className="text-sm text-gray-600">{key}</span>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${value === 'yes' ? 'bg-teal-50 text-teal-700' : value === 'no' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm">This agency hasn't completed their audit yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
