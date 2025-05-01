'use client'

import { useEffect } from 'react'
import useInstagramStore from '@/app/store/instagram.store'

export default function StoreInitializer() {
  const { init } = useInstagramStore()
  
  useEffect(() => {
    // Initialize the store when the app loads
    init()
  }, [init])
  
  // This component doesn't render anything
  return null
}
