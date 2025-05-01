'use client'

import React from 'react'
import StatusSection from '@/app/components/atualizacoes/StatusSection'
import Navbar from '@/app/components/navbar'
import PaymentSection from '@/app/components/payment/PaymentSection'

export default function AtualizacoesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black pb-16">
      {/* Header */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-white text-4xl font-bold">Atualizações</h1>
          </div>
          <div className="flex gap-2">
            <button className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Pesquisar" 
            className="w-full bg-zinc-800 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-green-500 placeholder:text-gray-400"
          />
        </div>
        
        {/* Status Section */}
        <StatusSection />
        
        {/* Premium Access */}
        <div className="mt-8">
          <PaymentSection 
            title="Acesso Premium" 
            description="Desbloqueie todos os status e canais com acesso premium."
            icon="crown"
            variant="default"
            showPlanSelector={true}
          />
        </div>
        
        {/* Blurred Channels Section */}
        <div className="mt-8 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-2xl font-bold">Canais</h2>
            <span className="text-green-500 text-sm font-medium">Conhecer</span>
          </div>
          
          <div className="space-y-4 blur-sm opacity-50">
            {/* Blurred channel items */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-600"></div>
              <div className="flex-1 border-b border-zinc-800 pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <div className="w-32 h-4 bg-gray-500 rounded"></div>
                    <div className="w-48 h-3 bg-gray-600 rounded mt-1"></div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="w-10 h-3 bg-green-500 rounded"></div>
                    <div className="bg-green-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                      590
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-600"></div>
              <div className="flex-1 border-b border-zinc-800 pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <div className="w-40 h-4 bg-gray-500 rounded"></div>
                    <div className="w-32 h-3 bg-gray-600 rounded mt-1"></div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="w-10 h-3 bg-green-500 rounded"></div>
                    <div className="bg-green-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                      107
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="mt-auto">
        <Navbar activeItem="home" />
      </div>
    </div>
  )
}
