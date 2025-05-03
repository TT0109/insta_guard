'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

// Tipos de planos disponíveis
export type PlanType = 'monthly' | 'yearly'

// Interface para preços
interface PriceData {
  monthly: string
  yearly: string
  monthlyRaw: number
  yearlyRaw: number
}

// Contexto de pagamento
interface PaymentContextType {
  // Preços
  prices: PriceData
  // Tipo de plano selecionado
  selectedPlan: PlanType
  // Método para alterar o plano
  setSelectedPlan: (plan: PlanType) => void
  // Método para abrir o modal de pagamento
  openPaymentModal: () => void
  // Método para fechar o modal de pagamento
  closePaymentModal: () => void
  // Estado do modal
  isPaymentModalOpen: boolean
  // Método para processar pagamento
  processPayment: () => void
}

// Valores padrão
const defaultPrices: PriceData = {
  monthly: 'R$ 37,90',
  yearly: 'R$ 97,90',
  monthlyRaw: 37.90,
  yearlyRaw: 97.90
}

// Criando o contexto
const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

// Provider do contexto
export function PaymentProvider({ children }: { children: ReactNode }) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('monthly')
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  
  // Preços fixos
  const prices = defaultPrices
  
  // Abrir modal de pagamento
  const openPaymentModal = () => setIsPaymentModalOpen(true)
  
  // Fechar modal de pagamento
  const closePaymentModal = () => setIsPaymentModalOpen(false)
  
  // Processar pagamento (simulação)
  const processPayment = () => {
    alert('Redirecionando para página de pagamento...')
    closePaymentModal()
  }
  
  return (
    <PaymentContext.Provider 
      value={{
        prices,
        selectedPlan,
        setSelectedPlan,
        openPaymentModal,
        closePaymentModal,
        isPaymentModalOpen,
        processPayment
      }}
    >
      {children}
    </PaymentContext.Provider>
  )
}

// Hook para usar o contexto
export function usePayment() {
  const context = useContext(PaymentContext)
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider')
  }
  return context
}
