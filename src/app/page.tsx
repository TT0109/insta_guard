'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import HackingSimulation from '@/app/components/HackingSimulation'
import useInstagramStore from './store/instagram.store'
import { useUserStore } from './store/instagramApi.store'
import { useSearchParams } from "next/navigation";
import { useSearchParmsStore } from './store/searchParams';

export default function InstagramLoginPage() {
  const router = useRouter()
  const { setUsername } = useInstagramStore()
  const { getUserInfo } = useUserStore()
  const [usernameInput, setUsernameInput] = useState('')
  const [showHackingSimulation, setShowHackingSimulation] = useState(false)
  const [selectedOption, setSelectedOption] = useState('monitorar')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameInput(e.target.value)
  }

  const handleOptionChange = (option: 'hackear' | 'monitorar' | 'recuperar') => {
    setSelectedOption(option)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      // Clean up username input (remove @ if present)
      const cleanUsername = usernameInput.startsWith('@') 
        ? usernameInput.substring(1) 
        : usernameInput
      
      // Set username in Instagram store
      setUsername(cleanUsername)
      
      // Call the Instagram API to get user info
      await getUserInfo(cleanUsername)
      
      // Show hacking simulation
      setShowHackingSimulation(true)
    } catch (err) {
      console.error('Error fetching Instagram user:', err)
      // Continue anyway for demo purposes
      setShowHackingSimulation(true)
    } finally {
      setIsLoading(false)
    }
  }

  const searchParams = useSearchParams();
  const setSearchParams = useSearchParmsStore(state => state.setSearchParams);
  const searchParams2 = useSearchParmsStore(state => state.searchParams);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramsObject: Record<string, string> = {};
    params.forEach((value, key) => {
        paramsObject[key] = value;
    });
    setSearchParams(paramsObject);
}, [setSearchParams]);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {showHackingSimulation ? (
        <HackingSimulation phoneNumber={usernameInput} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Instagram logo with gradient border */}
            <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-1 mb-8 shadow-lg">
              <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center relative">
                {/* Instagram icon */}
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z" stroke="url(#paint1_linear)" strokeWidth="2"/>
                  <path d="M17.5 6.51L17.51 6.49889" stroke="url(#paint2_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="8" y1="12" x2="16" y2="12" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#7C3AED" />
                      <stop offset="0.5" stopColor="#EC4899" />
                      <stop offset="1" stopColor="#F59E0B" />
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="3" y1="12" x2="21" y2="12" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#7C3AED" />
                      <stop offset="0.5" stopColor="#EC4899" />
                      <stop offset="1" stopColor="#F59E0B" />
                    </linearGradient>
                    <linearGradient id="paint2_linear" x1="17.5" y1="6.5" x2="17.51" y2="6.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#7C3AED" />
                      <stop offset="0.5" stopColor="#EC4899" />
                      <stop offset="1" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Lock icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>



          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-xl font-medium text-gray-300 mb-2 text-center">
                Digite o <span className="font-bold">NomeUsuário</span> do Instagram que<br />deseja acessar!
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  value={usernameInput}
                  onChange={handleUsernameChange}
                  placeholder="NomeUsuário"
                  className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg py-4 px-4 text-lg focus:outline-none focus:border-pink-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center bg-zinc-900 p-3 rounded-lg mb-2 hover:bg-zinc-800 transition-colors">
                <input
                  type="checkbox"
                  id="hackear"
                  checked={selectedOption === 'hackear'}
                  onChange={() => handleOptionChange('hackear')}
                  className="w-5 h-5 mr-3"
                  name="instagramOption"
                />
                <label htmlFor="hackear" className="text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Hackear Perfil
                </label>
              </div>
              
              <div className="flex items-center bg-zinc-900 p-3 rounded-lg mb-2 hover:bg-zinc-800 transition-colors">
                <input
                  type="checkbox"
                  id="monitorar"
                  checked={selectedOption === 'monitorar'}
                  onChange={() => handleOptionChange('monitorar')}
                  className="w-5 h-5 mr-3"
                  name="instagramOption"
                />
                <label htmlFor="monitorar" className="text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Monitorar Perfil
                </label>
              </div>
              
              <div className="flex items-center bg-zinc-900 p-3 rounded-lg hover:bg-zinc-800 transition-colors">
                <input
                  type="checkbox"
                  id="recuperar"
                  checked={selectedOption === 'recuperar'}
                  onChange={() => handleOptionChange('recuperar')}
                  className="w-5 h-5 mr-3"
                  name="instagramOption"
                />
                <label htmlFor="recuperar" className="text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Recuperar Perfil
                </label>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm mb-4">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold py-4 px-6 rounded-full text-xl shadow-lg hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center">
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Acessar Instagram
                  </>
                )}
              </div>
            </button>
          </form>
          </div>
        </div>
      )}
    </div>
  )
}
