'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Message } from '@/app/store/chatStore'
import PaymentModal from '../payment/PaymentModal'
import { usePayment } from '../payment/PaymentContext'



interface MessageListProps {
  messages: Message[]
  isBlurred?: boolean
}

// Common reactions
const reactions = ['👍', '❤️', '😂', '😮', '😢', '🙏']

// Message content component
function MessageContent({ message, isBlurred }: { message: Message, isBlurred: boolean }) {
  const blurClass = isBlurred ? 'blur-[8px] select-none' : ''

  switch (message.type) {
    case 'text':
      return <p className={`text-sm ${blurClass}`}>{message.content}</p>
    
    case 'audio':
      return (
        <div className={`flex items-center gap-2 ${blurClass}`}>
          <div className="bg-zinc-700 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="22"></line>
            </svg>
          </div>
          <div>
            <div className="w-36 h-1 bg-zinc-600 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-green-500"></div>
            </div>
            <span className="text-xs text-gray-400">0:37</span>
          </div>
          <button className="text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>
        </div>
      )
    
    case 'image':
      return (
        <div className="relative">
          <div className={`${blurClass} ${isBlurred ? 'pointer-events-none' : ''}`}>
            <Image 
              src={message.content} 
              alt="Imagem" 
              width={300}
              height={200}
              className="rounded-md max-w-full max-h-48 object-cover"
            />
          </div>
          {isBlurred && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          )}
        </div>
      )
    
    case 'missed-call':
      return (
        <div className={`flex items-center gap-2 text-red-500 ${blurClass}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 2v5h5"></path>
            <path d="M8 2v5H3"></path>
            <path d="M9 16H3v5"></path>
            <path d="M21 16h-6v5"></path>
            <path d="M2 12h20"></path>
            <path d="M12 2v20"></path>
          </svg>
          <span>Chamada perdida</span>
        </div>
      )
    
    default:
      return <p className={`text-sm ${blurClass}`}>{message.content || 'Mensagem não suportada'}</p>
  }
}



export default function MessageList({ messages, isBlurred = false }: MessageListProps) {
  const { openPaymentModal, closePaymentModal, isPaymentModalOpen } = usePayment()
  const [selectedReaction, setSelectedReaction] = useState<{ messageId: string, reaction: string | null }>({ messageId: '', reaction: null })

  const handleReactionClick = (messageId: string, reaction: string) => {
    setSelectedReaction({ messageId, reaction })
  }

  const handleMessageLongPress = (messageId: string) => {
    // Toggle reaction panel
    if (selectedReaction.messageId === messageId) {
      setSelectedReaction({ messageId: '', reaction: null })
    } else {
      setSelectedReaction({ messageId, reaction: null })
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'them' && message.senderAvatar && (
              <div className="mr-1 self-end mb-1">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <div className={isBlurred ? 'blur-[8px]' : ''}>
                    <Image 
                      src={message.senderAvatar} 
                      alt="Avatar" 
                      width={32} 
                      height={32}
                      className="object-cover" 
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div 
              className={`max-w-[80%] rounded-lg px-3 py-2 relative ${
                message.sender === 'me' 
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-tr-none' 
                  : 'bg-zinc-800 text-white rounded-tl-none'
              } ${isBlurred ? 'cursor-not-allowed' : ''}`}
              onClick={() => isBlurred ? openPaymentModal() : handleMessageLongPress(message.id)}
            >
              <MessageContent message={message} isBlurred={isBlurred} />
              
              {/* Message time and status */}
              <span className={`text-xs text-gray-300 opacity-70 float-right ml-2 mt-1 ${isBlurred ? 'blur-[8px]' : ''}`}>
                {message.time}
                {message.sender === 'me' && (
                  <span className="ml-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                )}
              </span>
              
              {/* Reaction display */}
              {selectedReaction.messageId === message.id && selectedReaction.reaction && (
                <div className="absolute -bottom-4 right-0 bg-zinc-700 rounded-full px-2 py-1 text-xs shadow-md">
                  {selectedReaction.reaction}
                </div>
              )}
              
              {/* Reaction selector - only show if not blurred */}
              {selectedReaction.messageId === message.id && !selectedReaction.reaction && !isBlurred && (
                <div className="absolute -top-10 left-0 bg-zinc-700 rounded-full px-2 py-1 flex gap-1 shadow-md z-10">
                  {reactions.map((reaction, index) => (
                    <button 
                      key={index} 
                      className="hover:bg-zinc-600 p-1 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReactionClick(message.id, reaction)
                      }}
                    >
                      {reaction}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Premium modal for locked content */}
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={closePaymentModal}
        title="Conteúdo Bloqueado"
        description="Assine o plano premium para desbloquear este conteúdo e ter acesso a todas as conversas."
        showPlanSelector={true}
      />
    </>
  )
}
