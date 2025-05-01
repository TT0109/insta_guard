'use client'

import React from 'react'
import Link from 'next/link'
import Navbar from '../navbar'

interface ConfigHeaderProps {
  title: string
}

export default function ConfigHeader({ title }: ConfigHeaderProps) {
  return (
    <div className="bg-black px-4 py-3 sticky top-0 z-10 border-b border-zinc-800">
      {/* Header com título e botão de voltar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Link href="/" className="text-white mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
          </Link>
          <h1 className="text-white text-xl font-medium">{title}</h1>
        </div>
        
        {/* Ícone de configurações adicionais */}
        <button className="text-gray-400 p-2 rounded-full hover:bg-zinc-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
        </button>
      </div>
      
      {/* Campo de pesquisa */}
      <div className="relative mb-2">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input 
          type="text" 
          placeholder="Pesquisar" 
          className="w-full bg-zinc-800 text-white rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 placeholder:text-gray-400"
        />
      </div>
      
      <Navbar activeItem="configuracoes" />
    </div>
  )
}
