export default function BetaBanner() {
  return (
    <div style={{ background: '#FFF0F2', borderBottom: '1px solid #F5D0D5' }}>
      <div className="max-w-6xl mx-auto px-6 py-2.5 flex items-center gap-3">
        <span style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#FFB3BC',
          background: '#2E2E2E',
          padding: '2px 8px',
          borderRadius: '4px',
          flexShrink: 0,
        }}>Beta</span>
        <p className="text-xs leading-relaxed" style={{ color: '#7A4A50' }}>
          Testing phase only — results are indicative and do not constitute legal advice.{' '}
          <span className="font-medium">Do not enter real personal data.</span>{' '}
          No privacy notice or DPA is currently in place. SJ Remote Solutions accepts no liability for reliance on outputs during this period.
        </p>
      </div>
    </div>
  )
}
