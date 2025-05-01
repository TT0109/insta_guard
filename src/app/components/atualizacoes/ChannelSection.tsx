'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Channel {
  id: string
  name: string
  logo: string
  message: string
  time: string
  unreadCount?: number
  hasVideo?: boolean
  hasEmoji?: boolean
  emoji?: string
}

export default function ChannelSection() {
  // Mock data for channels
  const channels: Channel[] = [
    {
      id: '1',
      name: 'UOL | Flamengo Agora',
      logo: 'https://logodownload.org/wp-content/uploads/2016/09/flamengo-logo-escudo-1.png',
      message: 'O que eu mais falo durante um jogo do Mengão 😂',
      time: '10:30',
      unreadCount: 590,
      hasEmoji: true,
      emoji: '😂'
    },
    {
      id: '2',
      name: 'South América Memes',
      logo: 'https://i.imgur.com/Qx5Vb9S.png',
      message: '😂',
      time: '09:15',
      unreadCount: 107,
      hasVideo: true,
      hasEmoji: true,
      emoji: '😂'
    },
    {
      id: '3',
      name: 'Netflix',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1920px-Netflix_2015_logo.svg.png',
      message: 'YES HE ISSSSSSSS',
      time: 'Ontem',
      unreadCount: 54,
      hasVideo: true
    }
  ]

  return (
    <div className="space-y-4">
      {channels.map((channel) => (
        <Link key={channel.id} href={`/canais/${channel.id}`} className="block">
          <div className="flex items-center gap-3">
            <div className="relative min-w-[48px] h-12 rounded-full overflow-hidden">
              <Image 
                src={channel.logo} 
                alt={channel.name} 
                width={48} 
                height={48} 
                className="object-cover" 
              />
            </div>
            
            <div className="flex-1 border-b border-zinc-800 pb-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-white font-medium">{channel.name}</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    {channel.hasVideo && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                      </svg>
                    )}
                    <span className="text-sm">{channel.message}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <span className="text-green-500 text-xs">{channel.time}</span>
                  {channel.unreadCount && (
                    <div className="bg-green-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                      {channel.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
      
      {/* Premium Access Button for Channels */}
      <div className="mt-6 p-4 bg-zinc-900 rounded-lg text-center">
        <h3 className="text-white text-lg font-bold mb-2">Acesso Premium a Canais</h3>
        <p className="text-gray-400 text-sm mb-4">
          Desbloqueie acesso a mais de 500 canais exclusivos com conteúdo premium.
        </p>
        <button className="w-full py-3 rounded-full text-white text-lg font-medium bg-gradient-to-r from-purple-600 to-pink-500">
          Obter acesso por R$ 19,90/mês
        </button>
      </div>
    </div>
  )
}
