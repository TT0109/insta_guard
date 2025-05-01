'use client'

import React from 'react'
import Link from 'next/link'
import ConfigHeader from '@/app/components/config/ConfigHeader'
import UserProfile from '@/app/components/config/UserProfile'
import { usePhoneStore } from '../store/phoneStore'
import PaymentSection from '../components/payment/PaymentSection'

export default function ConfigPage() {
  const { profileImage, phoneNumber, userInfo } = usePhoneStore();
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <ConfigHeader title="Configurações" />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* User Profile Section */}
          <UserProfile 
            name={phoneNumber}
            status={userInfo?.about || ''}
            avatar={profileImage}
          />
          
          {/* Settings List */}
          {/* <div className="mt-6">
            <Link href="/configuracoes/avatar" className="flex items-center justify-between p-4 bg-black border-b border-zinc-800">
              <div className="flex items-center gap-4">
                <div className="text-white">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12,4a4,4,0,1,0,4,4A4,4,0,0,0,12,4ZM12,10a2,2,0,1,1,2-2A2,2,0,0,1,12,10Zm6,8.05A20.46,20.46,0,0,0,12,16a20.46,20.46,0,0,0-6,2.05,1,1,0,0,0-.5.87V20a1,1,0,0,0,1,1H17.5a1,1,0,0,0,1-1v-1.08A1,1,0,0,0,18,18.05Z" fill="currentColor"/>
                  </svg>
                </div>
                <span className="text-white text-xl">Avatar</span>
              </div>
              <div className="text-gray-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9.5 17.5l5-5-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          </div> */}
          
          {/* Premium Access Section */}
          <PaymentSection 
            title="Conta privada" 
            description="Este perfil é privado obtenha acesso premium para ter acesso completo ao perfil."
            icon="lock"
            variant="default"
            showPlanSelector={true}
          />
        </div>
      </div>
    </div>
  )
}
