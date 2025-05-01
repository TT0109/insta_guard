'use client'

import React from 'react'
import { usePayment, PlanType } from './PaymentContext'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  showPlanSelector?: boolean
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  title = "Conteúdo Bloqueado", 
  description = "Assine o plano premium para desbloquear este conteúdo e ter acesso a todas as conversas.",
  showPlanSelector = true
}: PaymentModalProps) {
  const { prices, selectedPlan, setSelectedPlan, processPayment } = usePayment()
  
  if (!isOpen) return null
  
  const handlePlanChange = (plan: PlanType) => {
    setSelectedPlan(plan)
  }
  
  const currentPrice = selectedPlan === 'monthly' ? prices.monthly : prices.yearly
  const period = selectedPlan === 'monthly' ? '/mês' : '/ano'
  
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
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-gray-300 mt-2">{description}</p>
        </div>
        
        {showPlanSelector && (
          <div className="bg-zinc-700 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center">
              <div className="flex-1 text-center">
                <button 
                  className={`w-full py-2 rounded-lg transition-colors ${
                    selectedPlan === 'monthly' 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' 
                      : 'bg-zinc-800 text-gray-400'
                  }`}
                  onClick={() => handlePlanChange('monthly')}
                >
                  Mensal
                </button>
              </div>
              <div className="flex-1 text-center">
                <button 
                  className={`w-full py-2 rounded-lg transition-colors ${
                    selectedPlan === 'yearly' 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' 
                      : 'bg-zinc-800 text-gray-400'
                  }`}
                  onClick={() => handlePlanChange('yearly')}
                >
                  Anual
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-zinc-700 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white font-medium">Plano Premium</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 font-bold">{currentPrice}{period}</span>
          </div>
          
          <ul className="text-gray-300 space-y-2">
            <li className="flex items-center">
              <svg className="text-purple-500 mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Acesso a todos os recursos
            </li>
            <li className="flex items-center">
              <svg className="text-purple-500 mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Ligações ilimitadas
            </li>
            <li className="flex items-center">
              <svg className="text-purple-500 mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Comunidades exclusivas
            </li>
            <li className="flex items-center">
              <svg className="text-purple-500 mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Sem anúncios
            </li>
            <li className="flex items-center">
              <svg className="text-purple-500 mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Suporte prioritário
            </li>
          </ul>
        </div>
        
        <button 
          onClick={processPayment}
          className="w-full py-3 rounded-lg text-white font-bold transition-colors bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
        >
          Obter Premium
        </button>
        
        <button 
          onClick={onClose}
          className="w-full text-gray-400 hover:text-white py-2 mt-2 transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}
