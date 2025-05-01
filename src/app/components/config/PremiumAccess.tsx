'use client'

import React from 'react'

interface PremiumAccessProps {
  price: string
}

export default function PremiumAccess({ price }: PremiumAccessProps) {
  return (
    <div className="flex flex-col items-center bg-zinc-900 rounded-lg py-8 px-4 mt-4 text-center">
      {/* Ícone de cadeado */}
      <div className="bg-gray-200 rounded-full p-4 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
      
      {/* Título */}
      <h2 className="text-white text-xl font-medium mb-3">Conta privada</h2>
      
      {/* Descrição */}
      <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto">
        Este perfil é privado obtenha acesso premium para ter acesso completo ao perfil.
      </p>
      
      {/* Botão de acesso */}
      <button className="w-full py-3 rounded-full text-white font-medium bg-purple-600 hover:bg-purple-700 transition-colors text-base">
        Obter acesso completo R$ {price}
      </button>
    </div>
  )
}
