import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'

const MOCK_DOCS = [
  { id:1, name:'Statement of Work — Full AI Hiring Audit.pdf', type:'contract', size:'284 KB', uploaded:'25 Jun 2026', by:'Stephanie Jones', status:'awaiting_signature', version:1 },
  { id:2, name:'Data Processing Agreement.pdf', type:'legal', size:'112 KB', uploaded:'25 Jun 2026', by:'Stephanie Jones', status:'awaiting_signature', version:1 },
  { id:3, name:'Information Gathering Pack.pdf', type:'questionnaire', size:'540 KB', uploaded:'27 Jun 2026', by:'Stephanie Jones', status:'received', version:1 },
]

const MOCK_UPLOADS = [
  { id:4, name:'AI Tool Documentation — Workable.pdf', size:'1.2 MB', uploaded:'28 Jun 2026', by:'You', status:'received', version:1 },
]

function DocRow({ doc, onSign }) {
  const statusMap = {
    awaiting_signature: { label:'Signature needed', cls:'badge-amber' },
    signed:             { label:'Signed', cls:'badge-green' },
    received:           { label:'Received', cls:'badge-lav' },
    draft:              { label:'Draft', cls:'badge-grey' },
  }
  const st = statusMap[doc.status] || statusMap.received
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'0.875rem 0', borderBottom:'1px solid #EBEBEB' }}>
      <div style={{ width:38, height:38, borderRadius:10, background:'rgba(111,92,156,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>
        {doc.type==='contract' ? '📋' : doc.type==='legal' ? '⚖️' : '📄'}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:'0.875rem', fontWeight:500, color:'#2E2E2E', marginBottom:'0.1rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{doc.name}</div>
        <div style={{ fontSize:'0.75rem', color:'#9B9B9B' }}>Uploaded {doc.uploaded} · {doc.size} · v{doc.version}</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexShrink:0 }}>
        <span className={`badge ${st.cls}`}>{st.label}</span>
        {doc.status === 'awaiting_signature' && (
          <button className="btn btn-lav" style={{ fontSize:'0.8rem', padding:'0.45rem 1rem' }} onClick={()=>onSign(doc)}>Sign →</button>
        )}
        <button className="btn btn-outline" style={{ fontSize:'0.8rem', padding:'0.45rem 0.875rem' }}>↓ Download</button>
      </div>
    </div>
  )
}

function UploadZone({ onUpload }) {
  const ref = useRef()
  const [dragging, setDragging] = useState(false)
  return (
    <div
      style={{
        border: `2px dashed ${dragging ? 'var(--lav)' : '#EBEBEB'}`,
        borderRadius:14, padding:'2.5rem', textAlign:'center', cursor:'pointer',
        background: dragging ? 'rgba(111,92,156,0.05)' : 'transparent',
        transition:'all .15s',
      }}
      onClick={()=>ref.current.click()}
      onDragOver={e=>{e.preventDefault();setDragging(true)}}
      onDragLeave={()=>setDragging(false)}
      onDrop={e=>{e.preventDefault();setDragging(false);onUpload(e.dataTransfer.files[0])}}
    >
      <input ref={ref} type="file" style={{display:'none'}} onChange={e=>onUpload(e.target.files[0])} />
      <div style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>📁</div>
      <div style={{ fontSize:'0.9rem', fontWeight:500, color:'#2E2E2E', marginBottom:'0.35rem' }}>Drop files here or click to upload</div>
      <div style={{ fontSize:'0.8rem', color:'#9B9B9B' }}>PDF, Word, Excel — end-to-end encrypted · max 50 MB</div>
    </div>
  )
}

function SignModal({ doc, onClose }) {
  const [agreed, setAgreed] = useState(false)
  const [signed, setSigned] = useState(false)
  if (!doc) return null
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(46,46,46,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
      <div className="card" style={{ width:'100%', maxWidth:480, padding:'2rem' }}>
        {signed ? (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>✅</div>
            <h2 style={{ fontFamily:'Spectral,serif', fontSize:'1.2rem', fontWeight:500, marginBottom:'0.5rem' }}>Document signed</h2>
            <p style={{ color:'#6B6B6B', fontSize:'0.875rem', marginBottom:'1.5rem' }}>Your signature has been applied and Stephanie has been notified.</p>
            <button className="btn btn-dark" onClick={onClose}>Back to documents</button>
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily:'Spectral,serif', fontSize:'1.1rem', fontWeight:500, marginBottom:'0.25rem' }}>Sign document</h2>
            <p style={{ fontSize:'0.8rem', color:'#9B9B9B', marginBottom:'1.5rem' }}>{doc.name}</p>
            <div style={{ background:'rgba(111,92,156,0.06)', border:'1px solid rgba(111,92,156,0.2)', borderRadius:10, padding:'1rem', marginBottom:'1.25rem', fontSize:'0.85rem', color:'#6B6B6B' }}>
              By signing this document you confirm you have read, understood, and agree to its contents. This constitutes a legally binding electronic signature under UK eIDAS regulations.
            </div>
            <label style={{ display:'flex', alignItems:'flex-start', gap:'0.75rem', cursor:'pointer', marginBottom:'1.5rem' }}>
              <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{ marginTop:3, accentColor:'var(--lav)' }} />
              <span style={{ fontSize:'0.875rem', color:'#2E2E2E' }}>I have read this document and agree to its terms</span>
            </label>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button className="btn btn-outline" onClick={onClose} style={{ flex:1 }}>Cancel</button>
              <button className="btn btn-lav" disabled={!agreed} onClick={()=>setSigned(true)} style={{ flex:1, opacity:agreed?1:0.5 }}>Apply signature →</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Documents() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploads, setUploads] = useState(MOCK_UPLOADS)
  const [signingDoc, setSigningDoc] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(()=>{
    supabase.auth.getUser().then(({data:{user}})=>{
      if (!user){router.push('/login');return}
      setUser(user);setLoading(false)
    })
  },[])

  function handleUpload(file) {
    if (!file) return
    const newDoc = { id: Date.now(), name: file.name, size: `${Math.round(file.size/1024)} KB`, uploaded: new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}), by:'You', status:'received', version:1 }
    setUploads(u=>[newDoc,...u])
    setToast('File uploaded securely ✓')
    setTimeout(()=>setToast(null), 3500)
  }

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{fontFamily:'Spectral,serif',color:'#9B9B9B'}}>Loading…</div></div>

  return (
    <Layout user={user} title="Documents">
      {toast && (
        <div style={{ position:'fixed', top:'1.5rem', right:'1.5rem', background:'#2E2E2E', color:'white', padding:'0.75rem 1.25rem', borderRadius:10, fontSize:'0.875rem', fontWeight:500, zIndex:300 }}>{toast}</div>
      )}
      <SignModal doc={signingDoc} onClose={()=>setSigningDoc(null)} />

      <div style={{ marginBottom:'2rem' }}>
        <p className="section-label">Secure Document Exchange</p>
        <div className="lav-rule" />
        <h1 style={{ fontFamily:'Spectral,serif', fontSize:'1.75rem', fontWeight:500 }}>Documents</h1>
        <p style={{ color:'#6B6B6B', fontWeight:300, marginTop:'0.3rem' }}>All files are end-to-end encrypted and stored on UK servers.</p>
      </div>

      {/* From Stephanie */}
      <div className="card" style={{ marginBottom:'1.5rem' }}>
        <h2 style={{ fontFamily:'Spectral,serif', fontSize:'1rem', fontWeight:500, marginBottom:'0.1rem' }}>From Stephanie</h2>
        <p style={{ fontSize:'0.78rem', color:'#9B9B9B', marginBottom:'0.5rem' }}>Documents requiring your review or signature</p>
        {MOCK_DOCS.map(d=><DocRow key={d.id} doc={d} onSign={setSigningDoc}/>)}
      </div>

      {/* Your uploads */}
      <div className="card" style={{ marginBottom:'1.5rem' }}>
        <h2 style={{ fontFamily:'Spectral,serif', fontSize:'1rem', fontWeight:500, marginBottom:'0.1rem' }}>Your uploads</h2>
        <p style={{ fontSize:'0.78rem', color:'#9B9B9B', marginBottom:'0.5rem' }}>Files you've shared with SJ Remote Solutions</p>
        {uploads.map(d=><DocRow key={d.id} doc={d} onSign={()=>{}}/>)}
      </div>

      {/* Upload zone */}
      <div className="card">
        <h2 style={{ fontFamily:'Spectral,serif', fontSize:'1rem', fontWeight:500, marginBottom:'1rem' }}>Upload a document</h2>
        <UploadZone onUpload={handleUpload} />
        <p style={{ fontSize:'0.75rem', color:'#9B9B9B', marginTop:'0.875rem', textAlign:'center' }}>
          🔒 256-bit AES encryption · UK-based storage · GDPR compliant
        </p>
      </div>
    </Layout>
  )
}
