'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePhoneStore } from '@/app/store/phoneStore'
import { usePayment } from '@/app/components/payment/PaymentContext'
import PaymentModal from '@/app/components/payment/PaymentModal'

interface StatusItem {
  id: string
  name: string
  image: string
  hasUpdate: boolean
  isViewed: boolean
  content?: string
  isLocked?: boolean
}

export default function StatusSection() {
  // Mock data for status updates
  const { profileImage } = usePhoneStore()
  const { openPaymentModal, closePaymentModal, isPaymentModalOpen } = usePayment()
  const statusItems: StatusItem[] = [
    {
      id: 'add',
      name: 'Adicionar status',
      image: profileImage,
      hasUpdate: false,
      isViewed: false
    },
    {
      id: '1',
      name: 'Thiago',
      image: 'https://i.pravatar.cc/150?img=11',
      hasUpdate: true,
      isViewed: false,
      content: 'O JEITO PASSA POR MUITAS ADVERSIDADES, MAS O DINHEIRO LIVRA DE TODAS',
      isLocked: true
    },
    {
      id: '2',
      name: 'Barbara',
      image: 'https://i.pravatar.cc/150?img=5',
      hasUpdate: true,
      isViewed: false,
      content: 'É ASSIM QUE COMEÇA',
      isLocked: true
    },
    {
      id: '3',
      name: 'Nathan',
      image: 'https://i.pravatar.cc/150?img=3',
      hasUpdate: true,
      isViewed: false,
      content: 'O bonito é ser encantador, sincero, e me fascina',
      isLocked: true
    },
    {
      id: '1',
      name: 'Thiago',
      image: 'https://i.pravatar.cc/150?img=11',
      hasUpdate: true,
      isViewed: false,
      content: 'O JEITO PASSA POR MUITAS ADVERSIDADES, MAS O DINHEIRO LIVRA DE TODAS',
      isLocked: true
    },
    {
      id: '2',
      name: 'Barbara',
      image: 'https://i.pravatar.cc/150?img=5',
      hasUpdate: true,
      isViewed: false,
      content: 'É ASSIM QUE COMEÇA',
      isLocked: true
    },
    {
      id: '3',
      name: 'Nathan',
      image: 'https://i.pravatar.cc/150?img=3',
      hasUpdate: true,
      isViewed: false,
      content: 'O bonito é ser encantador, sincero, e me fascina',
      isLocked: true
    },
    {
      id: '1',
      name: 'Thiago',
      image: 'https://i.pravatar.cc/150?img=11',
      hasUpdate: true,
      isViewed: false,
      content: 'O JEITO PASSA POR MUITAS ADVERSIDADES, MAS O DINHEIRO LIVRA DE TODAS',
      isLocked: true
    },
    {
      id: '2',
      name: 'Barbara',
      image: 'https://i.pravatar.cc/150?img=5',
      hasUpdate: true,
      isViewed: false,
      content: 'É ASSIM QUE COMEÇA',
      isLocked: true
    },
    {
      id: '3',
      name: 'Nathan',
      image: 'https://i.pravatar.cc/150?img=3',
      hasUpdate: true,
      isViewed: false,
      content: 'O bonito é ser encantador, sincero, e me fascina',
      isLocked: true
    }
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-2xl font-bold">Status</h2>
        <div className="flex gap-2">
          <button className="text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </button>
          <button className="text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </button>
          <button className="text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        {statusItems.map((item) => (
          <div key={item.id} className="flex flex-col items-center min-w-[80px]">
            {item.id === 'add' ? (
              <Link href={`/status/${item.id}`} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center relative">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    width={64} 
                    height={64} 
                    className="rounded-full object-cover w-16 h-16" 
                  />
                  <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center border-2 border-black">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </div>
                </div>
                <span className="text-white text-xs mt-1 text-center">
                  <div className="flex flex-col items-center">
                    <span>Adicionar</span>
                    <span>status</span>
                  </div>
                </span>
              </Link>
            ) : item.isLocked ? (
              <div 
                className="cursor-pointer" 
                onClick={openPaymentModal}
              >
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full border-2 ${item.hasUpdate && !item.isViewed ? 'border-green-500' : 'border-gray-500'}`}>
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      width={64} 
                      height={64} 
                      className="rounded-full object-cover" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <span className="text-white text-xs mt-1 text-center blur-sm">
                  {item.name}
                </span>
              </div>
            ) : (
              <Link href={`/status/${item.id}`} className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full border-2 ${item.hasUpdate && !item.isViewed ? 'border-green-500' : 'border-gray-500'}`}>
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    width={64} 
                    height={64} 
                    className="rounded-full object-cover" 
                  />
                </div>
                <span className="text-white text-xs mt-1 text-center">
                  {item.name}
                </span>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={closePaymentModal} 
        title="Status Bloqueado" 
        description="Este status está bloqueado. Obtenha o plano premium para visualizar todos os status."
        showPlanSelector={true}
      />
    </div>
  )
}
