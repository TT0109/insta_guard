'use client'

import React from 'react'

interface ArquivadasProps {
  count: number
  onClick?: () => void
}

export default function Arquivadas({ count, onClick }: ArquivadasProps) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center w-full gap-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="21 8 21 21 3 21 3 8"></polyline>
          <rect x="1" y="3" width="22" height="5"></rect>
          <line x1="10" y1="12" x2="14" y2="12"></line>
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-white font-medium">Arquivadas</span>
      </div>
      <div className="ml-auto text-gray-400 text-sm">{count}</div>
    </button>
  )
}
