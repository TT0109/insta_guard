'use client'

import React from 'react'
import { usePayment, PlanType } from './PaymentContext'
import ActivitySummary from './ActivitySummary'

interface PaymentSectionProps {
  title?: string
  description?: string
  showPlanSelector?: boolean
  variant?: 'default' | 'compact'
  icon?: 'lock' | 'star' | 'crown'
}

export default function PaymentSection({
  title = "Conta privada",
  description = "Este perfil é privado obtenha acesso premium para ter acesso completo ao perfil.",
  showPlanSelector = true,
  variant = 'default',
  icon = 'lock'
}: PaymentSectionProps) {
  const { prices, selectedPlan, setSelectedPlan, processPayment } = usePayment()
  
  const handlePlanChange = (plan: PlanType) => {
    setSelectedPlan(plan)
  }
  
  const currentPrice = selectedPlan === 'monthly' ? prices.monthly : prices.yearly
  const period = selectedPlan === 'monthly' ? '/mês' : '/ano'
  
  // Use the new Activity Summary component
  return <ActivitySummary price={currentPrice} variant="feed" />
}
