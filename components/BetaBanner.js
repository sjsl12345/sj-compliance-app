export default function BetaBanner() {
  return (
    <div style={{ background: 'rgba(111,92,156,0.08)', borderBottom: '1px solid rgba(111,92,156,0.15)' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0.6rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'white', background: '#6F5C9C', padding: '2px 8px', borderRadius: '4px', flexShrink: 0 }}>Portal</span>
        <p style={{ fontSize: '0.78rem', color: '#6B5B85', margin: 0, lineHeight: 1.5 }}>
          Secure client portal for SJ Remote Solutions clients only.
          {` `}<a href="/privacy" style={{ color: '#6F5C9C', fontWeight: 500, textDecoration: 'none' }}>Privacy Policy</a>
          {` · `}<a href="/cookies" style={{ color: '#6F5C9C', fontWeight: 500, textDecoration: 'none' }}>Cookie Policy</a>
          {` · `}<a href="/terms" style={{ color: '#6F5C9C', fontWeight: 500, textDecoration: 'none' }}>Terms of Service</a>
        </p>
      </div>
    </div>
  )
}
