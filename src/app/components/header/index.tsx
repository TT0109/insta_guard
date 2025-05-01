'use client'

import React from 'react'

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  return (
    <div className="space-y-3 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </button>
          <button className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input 
          type="text" 
          placeholder="Pergunte à Meta AI ou pesquise" 
          className="w-full bg-zinc-800 text-white rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-green-500 placeholder:text-gray-400"
        />
      </div>
    </div>
  )
}
