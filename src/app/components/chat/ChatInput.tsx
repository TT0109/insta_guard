'use client'

import React, { useState, useRef, useEffect } from 'react'
import { usePayment } from '../payment/PaymentContext'

interface ChatInputProps {
  onSendMessage: (text: string) => void
  isPremiumLocked?: boolean
}

export default function ChatInput({ onSendMessage, isPremiumLocked = false }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [showEmojis, setShowEmojis] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)
  const { openPaymentModal } = usePayment()
  
  // Common emojis
  const commonEmojis = ['😊', '😂', '❤️', '👍', '🙏', '😍', '🔥', '😘', '🤔', '👏', '🎉', '🌹', '🤣', '😭', '🥰', '😎']
  
  // Handle clicking outside emoji picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setShowEmojis(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && onSendMessage) {
      onSendMessage(message)
      setMessage('')
      setShowEmojis(false)
    }
  }
  
  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }
  
  const simulateRecording = () => {
    setIsRecording(true)
    setTimeout(() => {
      setIsRecording(false)
      if (onSendMessage) {
        onSendMessage('🎤 Mensagem de voz')
      }
    }, 2000)
  }

  // Function to show premium modal
  const showPremiumModal = () => {
    openPaymentModal()
  }

  return (
    <div className="bg-black border-t border-zinc-800 px-2 py-2 relative">
      {/* Emoji picker - only show if not premium locked and emoji panel is open */}
      {showEmojis && !isPremiumLocked && (
        <div 
          ref={emojiRef}
          className="absolute bottom-16 right-2 bg-zinc-800 rounded-lg p-2 shadow-lg z-10"
        >
          <div className="grid grid-cols-8 gap-1">
            {commonEmojis.map((emoji, index) => (
              <button 
                key={index} 
                className="text-xl p-1 hover:bg-zinc-700 rounded"
                onClick={() => handleEmojiClick(emoji)}
                type="button"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={isPremiumLocked ? (e) => { e.preventDefault(); showPremiumModal(); } : handleSubmit} className="flex items-center gap-2">
        {/* Camera button - Instagram style */}
        <button 
          type="button"
          className={`text-gray-400 p-2 rounded-full ${isPremiumLocked ? 'opacity-50 cursor-not-allowed blur-[2px]' : 'hover:text-gray-300'}`}
          onClick={showPremiumModal}
          disabled={isPremiumLocked}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
            <circle cx="12" cy="13" r="3"></circle>
          </svg>
        </button>
        
        {/* Message input - Instagram style */}
        <div className="flex-1 bg-zinc-800 rounded-full px-4 py-2 flex items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder={isPremiumLocked ? "Desbloqueie com Premium" : "Mensagem..."}
            value={message}
            onChange={(e) => !isPremiumLocked && setMessage(e.target.value)}
            className={`bg-transparent text-white w-full focus:outline-none ${isPremiumLocked ? 'blur-[8px] cursor-not-allowed select-none' : ''}`}
            disabled={isPremiumLocked}
            onClick={isPremiumLocked ? showPremiumModal : undefined}
          />
          
          {/* Emoji button - Instagram style */}
          <button 
            type="button"
            className={`text-gray-400 p-1 ${isPremiumLocked ? 'opacity-50 cursor-not-allowed blur-[2px]' : 'hover:text-gray-300'}`}
            onClick={isPremiumLocked ? showPremiumModal : () => setShowEmojis(!showEmojis)}
            disabled={isPremiumLocked}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </button>
        </div>
        
        {/* Send or Audio button - Instagram style */}
        {message && !isPremiumLocked ? (
          <button 
            type="submit"
            className="text-blue-500 p-2 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        ) : (
          <button 
            type="button"
            className={`p-2 rounded-full transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-blue-500'} ${isPremiumLocked ? 'opacity-50 cursor-not-allowed blur-[2px]' : ''}`}
            onClick={isPremiumLocked ? showPremiumModal : simulateRecording}
            disabled={isPremiumLocked}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="22"></line>
            </svg>
          </button>
        )}
      </form>
    </div>
  )
}
