'use client'

import { useEffect, useRef } from 'react'
import { useChatStore } from '@/app/store/chatStore'
import { usePathname } from 'next/navigation'

export default function AutoNotifications() {
  const { contacts, addMessage } = useChatStore()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()
  
  // Using useEffect with proper dependencies
  useEffect(() => {
    // Check if we're on a route where notifications should be shown
    const shouldShowNotifications = pathname === '/whatsapp' || pathname.startsWith('/chat/');
    
    // Only run if we're on the correct routes
    if (!shouldShowNotifications) {
      return;
    }
    // Sample text messages that will be randomly sent
    const sampleTextMessages = [
      'Oi, tudo bem?',
      'Você viu as novidades?',
      'Preciso falar com você',
      'Quando podemos nos encontrar?',
      'Você não vai acreditar no que aconteceu!',
      'Estou te esperando',
      'Vamos sair hoje?',
      'Me liga quando puder',
      'Já chegou em casa?',
      'Obrigado pela ajuda!',
      'Bom dia! Como está?',
      'Que horas você vai estar livre?',
      'Preciso da sua opinião',
      'Viu aquela série nova?',
      'Tem planos para o final de semana?'
    ]
    
    // Sample audio messages
    const sampleAudioMessages = [
      '🎤 Mensagem de voz (0:12)',
      '🎤 Mensagem de voz (0:37)',
      '🎤 Mensagem de voz (1:05)',
      '🎤 Mensagem de voz (0:22)'
    ]
    
    // Sample image messages
    const sampleImageMessages = [
      '/img/chat1.jpg',
      '/img/chat2.jpg',
      '/img/chat3.jpg',
      '/img/profile1.jpg',
      '/img/profile2.jpg'
    ]
    // Define the function to send a random message inside useEffect
    const sendRandomMessageInside = () => {
      // Skip if no contacts
      if (contacts.length === 0) return
      
      // Select a random contact
      const randomContactIndex = Math.floor(Math.random() * contacts.length)
      const randomContact = contacts[randomContactIndex]
      
      // Get current time in HH:MM format
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      const timeString = `${hours}:${minutes}`
      
      // Determine message type (text: 70%, audio: 20%, image: 10%)
      const messageTypeRandom = Math.random()
      let messageType: 'text' | 'audio' | 'image' = 'text'
      let messageContent = ''
      
      if (messageTypeRandom < 0.7) {
        // Text message
        messageType = 'text'
        const randomMessageIndex = Math.floor(Math.random() * sampleTextMessages.length)
        messageContent = sampleTextMessages[randomMessageIndex]
      } else if (messageTypeRandom < 0.9) {
        // Audio message
        messageType = 'audio'
        const randomAudioIndex = Math.floor(Math.random() * sampleAudioMessages.length)
        messageContent = sampleAudioMessages[randomAudioIndex]
      } else {
        // Image message
        messageType = 'image'
        const randomImageIndex = Math.floor(Math.random() * sampleImageMessages.length)
        messageContent = sampleImageMessages[randomImageIndex]
      }
      
      // Add the message
      addMessage(randomContact.id, {
        id: Date.now().toString(),
        type: messageType,
        content: messageContent,
        sender: 'them',
        time: timeString,
        senderAvatar: randomContact.avatar
      })
    }
    
    // Define the schedule function inside useEffect to avoid dependency issues
    const scheduleNext = () => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      // Random time between 5 and 15 seconds (more frequent messages)
      const randomTime = Math.floor(Math.random() * 10000) + 5000
      
      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        sendRandomMessageInside()
        scheduleNext() // Schedule the next message after sending
      }, randomTime)
    }
    
    // Start the notification cycle
    scheduleNext()
    
    // Clean up on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [contacts, addMessage, pathname])
  
  // This component doesn't render anything
  return null
}
