export default function BetaBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-start gap-3">
        <span className="text-amber-500 text-lg flex-shrink-0">⚠️</span>
        <div className="text-sm text-amber-800 leading-relaxed">
          <span className="font-semibold">Beta testing phase — not yet live.</span>{' '}
          This tool is currently in development and testing. Results are indicative only and do not constitute legal advice. 
          Any data submitted during this testing phase is for evaluation purposes only and should not include sensitive personal or business information. 
          SJ Remote Solutions accepts no liability for reliance on outputs generated during this beta period.{' '}
          <span className="font-medium">By using this tool you acknowledge it is a beta product.</span>
        </div>
      </div>
    </div>
  )
}
