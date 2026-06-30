import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Legacy route — old dashboard has been replaced by the portal.
export default function DashboardRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/portal') }, [router])
  return null
}
