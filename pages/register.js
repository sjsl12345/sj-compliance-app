import { useEffect } from 'react'

// Self-serve signup has been removed. Clients get access after completing
// the free check at sjremotesolutions.co.uk/risk-check.html.
export default function RegisterRedirect() {
  useEffect(() => {
    window.location.replace('https://sjremotesolutions.co.uk/risk-check.html')
  }, [])
  return null
}
