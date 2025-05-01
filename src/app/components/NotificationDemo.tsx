'use client'

import React, { useState } from 'react'
import { useChatStore } from '@/app/store/chatStore'

export default function NotificationDemo() {
  const { contacts, updateUnreadCount, addMessage, playNotificationSound } = useChatStore()
  const [selectedContact, setSelectedContact] = useState('')
  const [messageText, setMessageText] = useState('')
  const [unreadCount, setUnreadCount] = useState<number | string>(1)

  const handleSendNotification = () => {
    if (selectedContact) {
      updateUnreadCount(selectedContact, unreadCount)
    } else {
      playNotificationSound()
    }
  }

  const handleSendMessage = () => {
    if (selectedContact && messageText) {
      addMessage(selectedContact, {
        id: Date.now().toString(),
        type: 'text',
        content: messageText,
        sender: 'them',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
      setMessageText('')
    }
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 bg-zinc-800 p-4 rounded-lg shadow-lg w-72">
      <h3 className="text-white text-lg font-bold mb-3">Teste de Notificações</h3>
      
      <div className="mb-3">
        <label className="text-white text-sm block mb-1">Selecione o contato:</label>
        <select 
          className="w-full bg-zinc-700 text-white p-2 rounded"
          value={selectedContact}
          onChange={(e) => setSelectedContact(e.target.value)}
        >
          <option value="">Selecione...</option>
          {contacts.map(contact => (
            <option key={contact.id} value={contact.id}>
              {contact.nome}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-3">
        <label className="text-white text-sm block mb-1">Número de mensagens não lidas:</label>
        <input 
          type="text" 
          className="w-full bg-zinc-700 text-white p-2 rounded"
          value={unreadCount}
          onChange={(e) => setUnreadCount(e.target.value)}
        />
      </div>
      
      <button 
        className="w-full bg-green-600 text-white p-2 rounded mb-3"
        onClick={handleSendNotification}
      >
        Atualizar Notificações
      </button>
      
      <div className="mb-3">
        <label className="text-white text-sm block mb-1">Mensagem:</label>
        <input 
          type="text" 
          className="w-full bg-zinc-700 text-white p-2 rounded"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Digite uma mensagem..."
        />
      </div>
      
      <button 
        className="w-full bg-blue-600 text-white p-2 rounded"
        onClick={handleSendMessage}
      >
        Enviar Mensagem
      </button>
      
      <div className="mt-3 text-xs text-gray-400">
        <p>Dica: Enviar uma mensagem também atualiza as notificações automaticamente.</p>
      </div>
    </div>
  )
}
