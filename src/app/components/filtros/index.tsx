'use client'

import React from 'react'

interface FiltroTagProps {
  label: string
  count?: number
  isActive?: boolean
  onClick?: () => void
}

function FiltroTag({ label, count, isActive = false, onClick }: FiltroTagProps) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium ${
        isActive 
          ? 'bg-green-600 text-white' 
          : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
      }`}
    >
      {label} {count && <span>{count}</span>}
    </button>
  )
}

interface FiltrosProps {
  activeFilter?: 'todas' | 'nao-lidas' | 'favoritos' | 'grupos' | 'arquivadas'
  naoLidasCount?: number
  arquivadasCount?: number
}

export default function Filtros({ 
  activeFilter = 'todas',
  naoLidasCount = 0,
  arquivadasCount = 0
}: FiltrosProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <FiltroTag 
          label="Todas" 
          isActive={activeFilter === 'todas'} 
        />
        <FiltroTag 
          label="Não lidas" 
          count={naoLidasCount} 
          isActive={activeFilter === 'nao-lidas'} 
        />
        <FiltroTag 
          label="Favoritos" 
          isActive={activeFilter === 'favoritos'} 
        />
        <FiltroTag 
          label="Grupos" 
          isActive={activeFilter === 'grupos'} 
        />
      </div>
      
      {activeFilter === 'arquivadas' && (
        <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <polyline points="21 8 21 21 3 21 3 8"></polyline>
            <rect x="1" y="3" width="22" height="5"></rect>
            <line x1="10" y1="12" x2="14" y2="12"></line>
          </svg>
          <span className="text-gray-300">Arquivadas</span>
          <span className="ml-auto text-gray-400 text-sm">{arquivadasCount}</span>
        </div>
      )}
    </div>
  )
}
