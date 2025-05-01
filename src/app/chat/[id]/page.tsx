'use client'

import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import MessageList from '@/app/components/chat/MessageList'
import ChatInput from '@/app/components/chat/ChatInput'
import { useChatStore } from '@/app/store/chatStore'
import { usePayment } from '@/app/components/payment/PaymentContext'
import useInstagramStore from '@/app/store/instagram.store'

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const chatId = params.id as string
  const { 
    contacts, 
    messages, 
    setActiveContact, 
    addMessage 
  } = useChatStore()
  const { openPaymentModal } = usePayment()
  const { username } = useInstagramStore()
  
  // State for showing/hiding the navbar in Instagram-style chat
  const [showNavbar, setShowNavbar] = useState(true)
  
  const contact :any = contacts.find(c => c.id === chatId)
  const isLocked = contact?.isLocked || false
  const isBlurred = contact?.isBlurred || false
  
  useEffect(() => {
    if (chatId) {
      setActiveContact(chatId)
    }
    
    // Hide navbar on chat page (Instagram style)
    const body = document.body
    body.style.paddingBottom = '0'
    
    return () => {
      // Restore navbar padding when leaving chat page
      body.style.paddingBottom = '49px'
    }
  }, [chatId, setActiveContact])
  
  const contactMessages = messages[chatId] || []
  
  const handleSendMessage = (text: string) => {
    if (text.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        type: 'text' as const,
        content: text,
        sender: 'me' as const,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
      addMessage(chatId, newMessage)
    }
  }
  
  if (!contact) {
    router.push('/')
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Instagram-style header with user info and action buttons */}
      <div className="fixed top-0 left-0 right-0 bg-black border-b border-zinc-800 z-10">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/messages')}
              className="p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M19 12H5M12 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <Image 
                  src={contact?.avatar || '/default-profile.jpg'} 
                  alt={contact?.nome || 'User'} 
                  width={32} 
                  height={32}
                  className={`object-cover rounded-full ${isBlurred ? 'blur-[8px]' : ''}`}
                />
              </div>
              <div>
                <h2 className={`text-white font-medium text-base ${isBlurred ? 'blur-[8px]' : ''}`}>
                  {contact?.nome || 'User'}
                </h2>
                <p className={`text-gray-400 text-xs ${isBlurred ? 'blur-[8px]' : ''}`}>
                  {contact?.username || 'username'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sticker button */}
            <button className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <circle cx="15.5" cy="8.5" r="1.5"></circle>
                <path d="M7 13s.5 2 5 2 5-2 5-2"></path>
              </svg>
            </button>
            
            {/* Phone call button */}
            <button className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </button>
            
            {/* Video call button */}
            <button className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Chat area with Instagram-style background */}
      <div className="flex-1 overflow-y-auto bg-black pt-14">
        <div className="max-w-3xl mx-auto py-4 px-4">
          <MessageList messages={contactMessages} isBlurred={isBlurred} />
        </div>
      </div>
      
      {isLocked ? (
        <>
          <ChatInput onSendMessage={handleSendMessage} isPremiumLocked={true} />
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 px-4 py-3 text-center">
            <div className="flex items-center justify-center gap-2 text-white mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Conversa bloqueada</span>
            </div>
            <button 
              className="bg-black text-white px-4 py-2 rounded-lg transition-colors"
              onClick={openPaymentModal}
            >
              Desbloquear com Premium
            </button>
          </div>
        </>
      ) : (
        <ChatInput onSendMessage={handleSendMessage} isPremiumLocked={false} />
      )}
    </div>
  )
}
