'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PaymentModal from '../payment/PaymentModal'
import { usePayment } from '../payment/PaymentContext'

interface ConversaProps {
  id?: string;
  nome: string;
  mensagem: string;
  horario: string;
  numeroMensagens?: number | string;
  avatar?: string;
  isActive?: boolean;
  isLocked?: boolean;
  isBlurred?: boolean;
  isOnline?: boolean;
}

export default function Conversa({
  id = '1',
  nome,
  mensagem,
  horario,
  numeroMensagens,
  avatar = '/default-profile.jpg',
  isActive = false,
  isLocked = false,
  isBlurred = false,
  isOnline = false,
}: ConversaProps) {
  const { openPaymentModal, closePaymentModal, isPaymentModalOpen } = usePayment();
  
  // Instagram-style conversation item
  return (
    <>
      {isLocked ? (
        // Locked conversation item
        <div 
          className="block w-full" 
          onClick={openPaymentModal}
        >
          <div className="flex items-center justify-between w-full p-3 hover:bg-zinc-900 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <div className="blur-[8px]">
                  <Image 
                    src={avatar} 
                    alt={`Avatar de ${nome}`} 
                    width={48} 
                    height={48}
                    className="object-cover" 
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium truncate blur-[8px]">{nome}</h3>
                </div>
                <p className="text-gray-400 text-sm truncate blur-[8px]">
                  {mensagem}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400 blur-[8px]">{horario}</span>
              {numeroMensagens && (
                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-1 blur-[8px]">
                  {numeroMensagens}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : isBlurred ? (
        // Blurred conversation item (but not locked)
        <div className={`flex items-center justify-between w-full p-3 ${isActive ? 'bg-zinc-900' : 'hover:bg-zinc-900'} cursor-pointer transition-colors`}>
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <div className="blur-[8px]">
                <Image 
                  src={avatar} 
                  alt={`Avatar de ${nome}`} 
                  width={48} 
                  height={48}
                  className="object-cover" 
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium truncate blur-[8px]">{nome}</h3>
              </div>
              <p className="text-gray-400 text-sm truncate blur-[8px]">
                {mensagem}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400 blur-[8px]">{horario}</span>
            {numeroMensagens && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-1 blur-[8px]">
                {numeroMensagens}
              </span>
            )}
          </div>
        </div>
      ) : (
        // Regular conversation item
        <div className={`flex items-center justify-between w-full p-3 ${isActive ? 'bg-zinc-900' : 'hover:bg-zinc-900'} cursor-pointer transition-colors`}>
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <div className="relative w-full h-full">
                <Image 
                  src={avatar} 
                  alt={`Avatar de ${nome}`} 
                  width={48} 
                  height={48}
                  className="object-cover rounded-full" 
                />
                {isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium truncate">{nome}</h3>
              </div>
              <p className="text-gray-400 text-sm truncate">
                {mensagem}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400">{horario}</span>
            {numeroMensagens && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-1">
                {numeroMensagens}
              </span>
            )}
          </div>
        </div>
      )}

      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={closePaymentModal} 
        title="Contato Bloqueado" 
        description="Este contato está bloqueado. Obtenha o plano premium para continuar."
        showPlanSelector={true}
      />
    </>
  )
}
