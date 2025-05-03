'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckoutRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // Verificar se está no lado do cliente
    if (typeof window !== 'undefined') {
      // Verificar se existe informação de checkout no localStorage
      const checkoutInfo = localStorage.getItem('checkout')
      
      if (checkoutInfo) {
        try {
          const parsedInfo = JSON.parse(checkoutInfo)
          
          // Verificar se o checkout foi recente (menos de 24 horas)
          const checkoutTime = new Date(parsedInfo.timestamp).getTime()
          const currentTime = new Date().getTime()
          const hoursSinceCheckout = (currentTime - checkoutTime) / (1000 * 60 * 60)
          
          // Se o checkout foi nas últimas 24 horas e não estamos já na página de backredict
          if (hoursSinceCheckout < 24 && window.location.pathname !== '/backredict') {
            // Redirecionar para a página de backredict
            router.push('/backredict')
          }
        } catch (error) {
          console.error('Erro ao processar informações de checkout:', error)
          // Limpar dados inválidos
          localStorage.removeItem('checkout')
        }
      }
    }
  }, [router])
  
  // Este componente não renderiza nada visualmente
  return null
}
