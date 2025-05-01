"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Conversa from "../components/conversa";
import InstagramHeader from "../components/instagram/Header";
import useInstagramStore from "../store/instagram.store";
import { useChatStore } from "../store/chatStore";
import ActivitySummary from "../components/payment/ActivitySummary";

export default function MessagesPage() {
  const { contacts } = useChatStore();
  const { username, profileImage } = useInstagramStore();
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' or 'requests'
  
  return (
    <div className="flex flex-col min-h-screen bg-black text-white pt-14">
      {/* Header */}
      <InstagramHeader showBackButton title={username} />
      
      {/* Tabs - Instagram style */}
      <div className="flex justify-between px-4 py-2">
        <h2 className={`text-lg font-medium ${activeTab === 'messages' ? 'text-white' : 'text-gray-500'}`}
          onClick={() => setActiveTab('messages')}
        >
          Mensagens
        </h2>
        <h2 className={`text-lg font-medium ${activeTab === 'requests' ? 'text-white' : 'text-gray-500'}`}
          onClick={() => setActiveTab('requests')}
        >
          Pedidos
        </h2>
      </div>
      
      {/* Search Bar */}
      <div className="p-4">
        <div className="bg-zinc-800 rounded-lg flex items-center px-3 py-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Pesquisar" 
            className="bg-transparent border-none outline-none text-white w-full"
          />
        </div>
      </div>
      
      {/* Notes */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          <p className="text-gray-400 font-medium">Suas notas</p>
          <button className="text-blue-500 font-medium">Compartilhe uma nota</button>
        </div>
      </div>
      
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'messages' ? (
          <div className="space-y-1">
            {contacts.map((contact) => (
              contact.isLocked ? (
                // Don't wrap locked conversations in Link
                <div key={contact.id}>
                  <Conversa
                    id={contact.id}
                    nome={contact.nome}
                    mensagem={contact.lastMessage || ""}
                    horario={contact.lastMessageTime || ""}
                    numeroMensagens={contact.unreadCount}
                    avatar={contact.avatar}
                    isLocked={contact.isLocked}
                    isBlurred={contact.isBlurred}
                  />
                </div>
              ) : (
                // Only wrap non-locked conversations in Link
                <Link href={`/chat/${contact.id}`} key={contact.id}>
                  <Conversa
                    id={contact.id}
                    nome={contact.nome}
                    mensagem={contact.lastMessage || ""}
                    horario={contact.lastMessageTime || ""}
                    numeroMensagens={contact.unreadCount}
                    avatar={contact.avatar}
                    isLocked={contact.isLocked}
                    isBlurred={contact.isBlurred}
                  />
                </Link>
              )
            ))}
            
            {/* Activity Summary after messages */}
            <div className="px-4 py-6">
              <ActivitySummary variant="feed" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center h-40">
            <p className="text-gray-400">Não há solicitações de mensagens pendentes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
  