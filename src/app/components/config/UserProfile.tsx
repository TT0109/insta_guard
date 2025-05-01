'use client'

import React from 'react'
import Image from 'next/image'

interface UserProfileProps {
  name: string
  status: string
  avatar: string
}

export default function UserProfile({ name, status, avatar }: UserProfileProps) {
  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden">
      <div className="p-4 flex items-center gap-3">
        {/* Avatar */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-800">
          <Image 
            src={avatar || '/whatsapp-default-profile.jpg'} 
            alt={`Avatar de ${name}`} 
            width={48}
            height={48}
            className="object-cover" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/whatsapp-default-profile.jpg';
            }}
          />
        </div>
        
        {/* Informações do usuário */}
        <div className="flex-1">
          <h2 className="text-white text-lg font-medium">{name}</h2>
          <p className="text-gray-400 text-sm">{status || 'Olá! Eu estou usando o WhatsApp Business.'}</p>
        </div>
        
        {/* Botão de QR code */}
        <button className="text-gray-400 p-2 rounded-full hover:bg-zinc-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <rect x="7" y="7" width="3" height="3"></rect>
            <rect x="14" y="7" width="3" height="3"></rect>
            <rect x="7" y="14" width="3" height="3"></rect>
            <rect x="14" y="14" width="3" height="3"></rect>
          </svg>
        </button>
      </div>
    </div>
  )
}
