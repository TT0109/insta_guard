'use client'

import React from 'react'

interface PremiumModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
}

export default function PremiumModal({ isOpen, onClose, title, description }: PremiumModalProps) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-gray-300 mt-2">{description}</p>
        </div>
        
        <div className="bg-zinc-700 rounded-lg p-4 mb-4">
          <h4 className="text-white font-bold mb-2">Recursos Premium</h4>
          <ul className="text-gray-300 space-y-2">
            <li className="flex items-center">
              <svg className="text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Acesso a todas as conversas bloqueadas
            </li>
            <li className="flex items-center">
              <svg className="text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Mensagens de áudio ilimitadas
            </li>
            <li className="flex items-center">
              <svg className="text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Sem anúncios
            </li>
          </ul>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
        >
          Obter Premium Agora
        </button>
        
        <button 
          onClick={onClose}
          className="w-full text-gray-400 hover:text-white py-2 mt-2 transition-colors"
        >
          Talvez mais tarde
        </button>
      </div>
    </div>
  )
}
