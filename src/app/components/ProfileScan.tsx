'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { usePhoneStore } from '../store/phoneStore'
import { getImageBase64 } from '../actions/imageProxyActions'

export default function ProfileScan() {
  const router = useRouter()
  const { phoneNumber, userInfo, setProfileImage, profileImage } = usePhoneStore()
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [messages, setMessages] = useState<string[]>([])

  const steps = useMemo(() => [
    'Iniciando conexão segura com servidores...',
    'Verificando existência do perfil...',
    'Rastreando perfil...',
    'Verificando dados...',
    'Análise completa!'
  ], [])

  const getProfileImage = useCallback(async () => {
    if (!userInfo) return
    
    try {
      const userInfoObj = userInfo as { profilePic?: string };
      
      if (userInfoObj.profilePic) {
        const image = await getImageBase64(userInfoObj.profilePic);
        setProfileImage(image);
      } else {

        setProfileImage('/whatsapp-default-profile.jpg');
      }
    } catch (error) {
      console.error('Error loading profile image:', error);
      setProfileImage('/whatsapp-default-profile.jpg');
    }
  }, [setProfileImage, userInfo])

  useEffect(() => {
    getProfileImage()
  }, [getProfileImage])

  const [redirectTriggered, setRedirectTriggered] = useState(false)

  useEffect(() => {
    setMessages([steps[0]])

    let progressInterval: NodeJS.Timeout | null = null;
    let messageInterval: NodeJS.Timeout | null = null;
    
    // Only set up intervals if redirection hasn't been triggered yet
    if (!redirectTriggered) {
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100 && !redirectTriggered) {
            setRedirectTriggered(true);
            return 100;
          }
          return prev + 0.5;
        });
      }, 50);

      messageInterval = setInterval(() => {
        if (progress > 20 && currentStep < 1) {
          setCurrentStep(1);
          setMessages(prev => [...prev, steps[1]]);
        } else if (progress > 40 && currentStep < 2) {
          setCurrentStep(2);
          setMessages(prev => [...prev, steps[2]]);
        } else if (progress > 70 && currentStep < 3) {
          setCurrentStep(3);
          setMessages(prev => [...prev, steps[3]]);
        } else if (progress > 95 && currentStep < 4) {
          setCurrentStep(4);
          setMessages(prev => [...prev, steps[4]]);
        }
      }, 500);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (messageInterval) clearInterval(messageInterval);
    };
  }, [progress, currentStep, steps, redirectTriggered]);
  
  // Separate effect for redirection to avoid loop
  useEffect(() => {
    if (redirectTriggered) {
      const redirectTimer = setTimeout(() => {
        router.push('/whatsapp/monitor');
      }, 1500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [redirectTriggered, router]);

  const progressPercentage = `${Math.min(Math.round(progress), 100)}%`

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex-1 flex flex-col items-center p-6">
        <div className="w-full max-w-md flex flex-col items-center mt-8">
          {/* Logo and Title */}
          <h1 className="text-3xl font-bold mb-8">
            <span className="bg-gradient-to-r from-green-400 to-green-500 text-transparent bg-clip-text">Whats</span>
            <span className="bg-gradient-to-r from-green-500 to-green-600 text-transparent bg-clip-text">Guard</span>
            <span className="bg-gradient-to-r from-green-600 to-teal-500 text-transparent bg-clip-text">PRO</span>
          </h1>

          {/* Profile Image */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-green-600 p-1">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full">
                  <Image 
                    src={profileImage} 
                    alt="Profile" 
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/whatsapp-default-profile.png";
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Rastreando perfil
            </div>
          </div>

          {/* Phone Number */}
          <h2 className="text-2xl font-bold text-white mb-6">{phoneNumber || '+55 (00) 00000-0000'}</h2>

          {/* Progress Bar */}
          <div className="w-full mb-8">
            <div className="flex justify-between mb-1">
              <span className="text-xs uppercase font-bold text-green-500">VERIFICANDO EXISTÊNCIA DO PERFIL</span>
              <span className="text-xs font-bold">{progressPercentage}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full" 
                style={{ width: progressPercentage }}
              ></div>
            </div>
          </div>

          {/* Console Messages */}
          <div className="w-full bg-gray-900 rounded-lg p-4 mb-6 h-48 overflow-y-auto font-mono text-sm">
            {messages.map((message, index) => (
              <div key={index} className="mb-2">
                <span className="text-green-500">&gt; </span>
                <span className="text-gray-300">{message}</span>
                {index === messages.length - 1 && (
                  <span className="animate-pulse">|</span>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-center w-full">
            <span className="text-green-500 flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Análise segura e criptografada
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
