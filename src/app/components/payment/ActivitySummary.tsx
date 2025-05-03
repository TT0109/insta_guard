'use client'

import React from 'react'
import { usePayment } from './PaymentContext'

interface ActivitySummaryProps {
  variant?: 'feed' | 'profile'
}

export default function ActivitySummary({ 
  variant = 'feed'
}: ActivitySummaryProps) {
  const { processPayment, selectedPlan, prices } = usePayment()
  
  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden">
      <div className="p-4">
        <h2 className="text-white text-lg font-medium mb-4">Resumo de atividade</h2>
        
        {/* Activity items */}
        <div className="space-y-4">
          {/* Suspicious hours */}
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-600">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-white text-sm font-medium">Horários suspeitos</h3>
              <p className="text-gray-400 text-xs">Atividade detectada entre 00:13 - 03:47</p>
            </div>
          </div>
          
          {/* Deleted messages */}
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-600">
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white text-sm font-medium">Mensagens apagadas</h3>
              <p className="text-gray-400 text-xs">Mensagens são apagadas frequentemente, por este usuário.</p>
            </div>
          </div>
          
          {/* Shared locations */}
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-600">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-white text-sm font-medium">Localizações compartilhadas</h3>
              <p className="text-gray-400 text-xs">3 novos locais compartilhados com contatos restritos</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Unlock button */}
      <button 
        onClick={processPayment}
        className="w-full py-3 text-white font-medium bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
      >
        Desbloquear tudo - {prices[selectedPlan]}
      </button>
    </div>
  )
}
