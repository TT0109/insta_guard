'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Contact {
  id: string
  nome: string
  avatar: string
  online?: boolean
}

interface ChatHeaderProps {
  contact: Contact
  isLocked?: boolean
}

export default function ChatHeader({ contact, isLocked = false }: ChatHeaderProps) {
  return (
    <div className="bg-zinc-900 px-4 py-2 flex items-center gap-4 border-b border-zinc-800">
      <Link href="/whatsapp" className="text-white">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
          <div className="flex items-center">
            <span className="text-gray-400">54</span>
          </div>
        </div>
      </Link>
      
      <div className="flex items-center gap-3 flex-1">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <div className="blur-[8px]">
            <Image 
              src={contact.avatar} 
              alt={`Avatar de ${contact.nome}`} 
              width={40}
              height={40}
              className="object-cover" 
            />
          </div>
        </div>
        <div className="flex flex-col">
          <span className={`text-white font-medium blur-[8px]`}>{contact.nome}</span>
          <span className="text-xs text-gray-400">
            {contact.online ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
      
      <div className="flex gap-4">
        <button className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 7l-7 5 7 5V7z"></path>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
          </svg>
        </button>
        <button className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </button>
      </div>
    </div>
  )
}
