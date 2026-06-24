export default function BetaBanner() {
    return (
          <div style={{background:'#F7E0E3', borderBottom:'2px solid #E8B8C0'}}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-start gap-3">
          <span className="text-base flex-shrink-0 mt-0.5">⚠️</span>
        <p className="text-sm leading-relaxed" style={{color:'#5C2D38'}}>
          <span className="font-bold">BETA — Testing phase only.</span>{' '}
          This tool is under active development. It is <span className="font-semibold">not yet live or publicly launched</span>.
          Results are indicative only and do <span className="font-semibold">not</span> constitute legal or compliance advice.{' '}
                      <span className="font-semibold">Do not enter real personal data, candidate information, or confidential business information at this stage.</span>{' '}
          No privacy notice, cookie notice, or data processing agreement is currently in place.
                      SJ Remote Solutions accepts no liability whatsoever for any data entered or reliance placed on outputs during this testing period.
                      By continuing to use this tool you confirm you understand and accept these conditions.
            </p>
            </div>
            </div>
  )
}
