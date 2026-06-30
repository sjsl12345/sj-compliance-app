import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Legacy route — history is now part of the portal.
export default function HistoryRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/portal') }, [router])
  return null
}
