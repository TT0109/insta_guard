'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import StoriesPlaceholder from './components/StoriesPlaceholder'

// Importar dinamicamente o componente StoriesContent com a opção ssr: false
const StoriesContent = dynamic(() => import('./components/StoriesContent'), {
  ssr: false,
  loading: () => (
    <div className="bg-black border-b border-zinc-800 py-4">
      <StoriesPlaceholder />
    </div>
  )
})

// Componente principal que será exportado
export default function Stories() {
  return <StoriesContent />
}
