'use client'

import { useEffect, useRef } from 'react'
import { useChatStore } from '@/app/store/chatStore'
import { usePathname } from 'next/navigation'

export default function AutoUserMessages() {
  const { activeContactId, addMessage } = useChatStore()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()
  
  // Using useEffect with proper dependencies
  useEffect(() => {
    // Check if we're on a route where messages should be shown
    const shouldShowMessages = pathname === '/whatsapp' || pathname.startsWith('/chat/');
    
    // Only run if we're on the correct routes
    if (!shouldShowMessages) {
      return;
    }
    // Sample user messages that will be randomly sent
    const sampleUserMessages = [
      'Ok, vou ver',
      'Entendi',
      'Vamos sim!',
      'Agora não posso',
      'Mais tarde eu te ligo',
      'Que legal!',
      'Não acredito nisso',
      'Sério mesmo?',
      'Tudo bem por aqui',
      'Já estou chegando',
      'Combinado então',
      'Vou pensar sobre isso',
      'Claro, sem problemas'
    ]
    
    // Define the function to send a random user message
    const sendRandomUserMessage = () => {
      // Skip if no active contact
      if (!activeContactId) return
      
      // Select a random message
      const randomMessageIndex = Math.floor(Math.random() * sampleUserMessages.length)
      const messageText = sampleUserMessages[randomMessageIndex]
      
      // Get current time in HH:MM format
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      const timeString = `${hours}:${minutes}`
      
      // Add the message
      addMessage(activeContactId, {
        id: Date.now().toString(),
        type: 'text' as const,
        content: messageText,
        sender: 'me',
        time: timeString
      })
    }
    
    // Define the schedule function
    const scheduleNext = () => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      // Random time between 8 and 20 seconds
      const randomTime = Math.floor(Math.random() * 12000) + 8000
      
      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        sendRandomUserMessage()
        scheduleNext() // Schedule the next message after sending
      }, randomTime)
    }
    
    // Only start sending messages if there's an active contact
    if (activeContactId) {
      scheduleNext()
    }
    
    // Clean up on unmount or when active contact changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [activeContactId, addMessage, pathname])
  
  // This component doesn't render anything
  return null
}
