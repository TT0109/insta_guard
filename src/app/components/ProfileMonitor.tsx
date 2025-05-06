'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import './ProfileMonitor.css'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePhoneStore } from '../store/phoneStore'
import Head from 'next/head'
import useInstagramStore from '../store/instagram.store'
import { useUserStore } from '../store/instagramApi.store'
import { getImageBase64 } from '../actions/imageProxyActions'
import SmartPlayerVideo from './SmartPlayerVideo'

// Função para formatar o tempo em minutos:segundos
const formatTime = (timeInSeconds: number): string => {
  if (!timeInSeconds) return '0:00';
  
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Função para formatar o tempo em minutos e segundos (sem arredondamento)
const formatTimeInMinutes = (timeInSeconds: number): string => {
  if (!timeInSeconds) return '0 minutos';
  
  // Calcula minutos e segundos exatos
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  
  // Mostra apenas minutos se for um valor exato de minutos
  if (seconds === 0) {
    return minutes === 1 ? `${minutes} minuto` : `${minutes} minutos`;
  }
  
  // Se faltar menos de um minuto, mostra apenas os segundos
  if (minutes === 0) {
    return `${seconds} segundos`;
  }
  
  // Caso contrário, mostra minutos e segundos
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default function ProfileMonitor() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const instagramStore = useInstagramStore()
  const { profileImage } = useInstagramStore()
  const { getUserInfo, user } = useUserStore()
  
  // Get username from query params or from Instagram store
  const usernameParam = searchParams.get('username')
  const username = usernameParam || instagramStore.username
  
  // Use a ref to track if we've already fetched user info
  const userInfoFetchedRef = useRef(false)
  
  const [progress, setProgress] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [redirectTriggered, setRedirectTriggered] = useState(false)
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)
  const [videoTotalTime, setVideoTotalTime] = useState(188) // Default to 188 seconds (known video duration)
  const [videoCurrentTime, setVideoCurrentTime] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(188) // Initialize with the default duration
  const [isMuted, setIsMuted] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  
  // Suspicious items found
  const [suspiciousMessages, setSuspiciousMessages] = useState(5)
  const [suspiciousImages, setSuspiciousImages] = useState(6)
  const [suspiciousLocations, setSuspiciousLocations] = useState(2)
  const [showResults, setShowResults] = useState(false)

  // Fetch user info when component mounts (only once)
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (username && !userInfoFetchedRef.current) {
        userInfoFetchedRef.current = true;
        setIsLoadingUserInfo(true)
        try {
          const userinfo = await getUserInfo(username)
          instagramStore.setProfileImage(await getImageBase64(userinfo.data.user.profile_pic_url_hd))
        } catch (error) {
          console.error('Error fetching Instagram user info:', error)
        } finally {
          setIsLoadingUserInfo(false)
        }
      }
    }
    
    fetchUserInfo()
  }, [username, instagramStore, getUserInfo])
  
  // Start the timer immediately when component mounts
  useEffect(() => {
    // Only initialize on first mount
    if (!videoTotalTime) {
      const initialDuration = 188; // Known video duration in seconds
      setVideoTotalTime(initialDuration);
      setTimeRemaining(initialDuration);
      setIsVideoPlaying(true);
    }
  }, []); // Empty dependency array means this only runs once on mount
  
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    // Only start the interval if the video is playing
    if (isVideoPlaying && !videoEnded) {
      progressInterval = setInterval(() => {
        setVideoCurrentTime(prevTime => {
          const newTime = Math.min(prevTime + 0.05, videoTotalTime);
          const remaining = Math.max(0, Math.floor(videoTotalTime - newTime));
          
          // Update progress and remaining time based on new time
          const calculatedProgress = (newTime / videoTotalTime) * 100;
          setProgress(calculatedProgress);
          setTimeRemaining(remaining);
          
          // If time is up, show results and stop playing
          if (remaining === 0 && !showResults) {
            setShowResults(true);
            setIsVideoPlaying(false);
          }
          
          return newTime;
        });
      }, 50);
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isVideoPlaying, videoEnded, videoTotalTime, showResults])
  
  // Show results when video ends instead of immediate redirect
  useEffect(() => {
    if (videoEnded && !showResults) {
      console.log('Video ended, showing results')
      setShowResults(true)
      // Stop the timer from continuing to count down
      setIsVideoPlaying(false)
    }
  }, [videoEnded, showResults])
  
  // Handle verification button click
  const handleVerify = () => {
    console.log('Redirecting to /instagram')
    router.push('/instagram')
  }

  // Handle video events from SmartPlayerVideo component
  const handleVideoEnd = () => {
    console.log('Video ended event triggered');
    setVideoEnded(true);
    setIsVideoPlaying(false);
    // Instead of immediate redirect, show results
    setShowResults(true);
    // Ensure we don't reset the timer
    setTimeRemaining(0);
  };
  
  const handleVideoProgress = (progress: number) => {
    setProgress(progress);
    // Update current time based on progress percentage
    if (videoTotalTime > 0) {
      const currentTime = (progress / 100) * videoTotalTime;
      setVideoCurrentTime(currentTime);
      setIsVideoPlaying(true);
      
      // Update remaining time directly from progress
      const remaining = Math.max(0, Math.floor(videoTotalTime - currentTime));
      setTimeRemaining(remaining);

      // Show results when timer reaches zero
      if (remaining === 0) {
        setShowResults(true);
        setIsVideoPlaying(false);
      }
    }
  };
  
  const handleVideoDurationChange = (duration: number, currentTime?: number) => {
    // Only update if the new duration is valid and different
    if (duration > 0) {
      setVideoTotalTime(duration);
      
      // Update current time if provided
      if (currentTime !== undefined) {
        setVideoCurrentTime(currentTime);
      }
      
      // Calculate remaining time directly
      const remaining = Math.max(0, Math.floor(duration - (currentTime || videoCurrentTime)));
      setTimeRemaining(remaining);
      
      // Ensure we're in playing state
      setIsVideoPlaying(true);
    }

  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Head>
        <style>
          {`
            /* Hide the default play button */
            .smartplayer-bigplay,
            .converteai-play-button, 
            .vjs-big-play-button, 
            .ytp-large-play-button {
              opacity: 0 !important;
              pointer-events: none !important;
              display: none !important;
              visibility: hidden !important;
            }
          `}
        </style>
      </Head>
      <div className="flex-1 flex flex-col p-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-pink-500">Assista o video enquanto</h1>
          <h2 className="text-4xl font-bold text-white">o perfil é rastreado</h2>
          <p className="text-gray-400 mt-1">e as conversas são processadas</p>
        </div>

        {/* Video Player */}
        <div className="relative w-full rounded-xl overflow-hidden border-2 border-pink-500 mb-6">
          {/* SmartPlayer Video Component */}
          <SmartPlayerVideo 
            onVideoEnd={handleVideoEnd}
            onVideoProgress={handleVideoProgress}
            onVideoDurationChange={handleVideoDurationChange}
          />
        </div>
        
        {/* Profile Image with wave animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Animated waves */}
            <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-pink-500 pulse-animation"></div>
            <div className="absolute inset-0 w-20 h-20 rounded-full border border-pink-500 wave-animation-delay-1"></div>
            <div className="absolute inset-0 w-20 h-20 rounded-full border border-pink-500 wave-animation-delay-2"></div>
            <div className="absolute inset-0 w-20 h-20 rounded-full border border-pink-500 wave-animation-delay-3"></div>
            <div className="absolute inset-0 w-20 h-20 rounded-full border border-pink-500 wave-animation-delay-4"></div>
            
            {/* Profile image */}
            <div className="relative w-20 h-20 rounded-full border-2 border-pink-500 p-0.5 z-10">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
                <div className="w-full h-full relative">
                  <Image 
                    src={profileImage || "/default-profile.jpg"}
                    alt="Profile"
                    fill
                    sizes="80px"
                    style={{ objectFit: "cover" }}
                    className="rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/default-profile.jpg";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Username and Status */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-900 rounded-full px-6 py-2 flex items-center space-x-2">
            <svg className="animate-spin h-4 w-4 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Acessando <span className="text-pink-500 font-bold">@{username}</span>
            {user && <div className="text-xs text-gray-400 mt-1">{user.full_name}</div>}
          </div>
        </div>

        {/* Processing Status */}
        <div className="text-center mb-1">
          <div className="text-gray-400">
            {videoEnded ? 'Processamento concluído!' : 'Processando...'}
          </div>
          {!videoEnded && (
            <div className="text-pink-500 text-sm font-medium flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tempo restante: <span className="font-bold ml-1">{formatTimeInMinutes(timeRemaining)}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-8">
          <div className="w-full bg-gray-700 h-1 rounded-full">
            <div 
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 h-full rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Conditional rendering based on video state */}
        {!showResults ? (
          // Scanning in progress view
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-4 text-white">Dados suspeitos detectados:</h3>
            
            {/* Mensagens suspeitas */}
            <div className="bg-gray-900 rounded-lg p-4 mb-3 hover:bg-gray-800 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <div>
                    <div className="font-bold">Mensagens suspeitas</div>
                    <div className="text-xs text-gray-400">*Analisando conversas e mensagens diretas...</div>
                  </div>
                </div>
                <div className="animate-spin">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Imagens suspeitas */}
            <div className="bg-gray-900 rounded-lg p-4 mb-3 hover:bg-gray-800 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="font-bold">Imagens suspeitas</div>
                    <div className="text-xs text-gray-400">*Verificando conteúdo de imagens compartilhadas...</div>
                  </div>
                </div>
                <div className="animate-spin">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Localizações suspeitas */}
            <div className="bg-gray-900 rounded-lg p-4 mb-3 hover:bg-gray-800 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div className="font-bold">Localizações suspeitas</div>
                    <div className="text-xs text-gray-400">*Analisando dados de localização...</div>
                  </div>
                </div>
                <div className="animate-spin">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Results view after video ends
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-4 text-white">Dados suspeitos detectados:</h3>
            
            {/* Mensagens suspeitas - Completed */}
            <div className="bg-gray-900 rounded-lg p-4 mb-3 hover:bg-gray-800 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <div>
                    <div className="font-bold text-white">{suspiciousMessages} mensagens suspeitas encontradas</div>
                    <div className="text-xs text-gray-400">Conversas e mensagens diretas analisadas</div>
                  </div>
                </div>
                <div className="text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Imagens suspeitas - Completed */}
            <div className="bg-gray-900 rounded-lg p-4 mb-3 hover:bg-gray-800 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="font-bold text-white">{suspiciousImages} imagens suspeitas encontradas</div>
                    <div className="text-xs text-gray-400">Conteúdo de imagens compartilhadas verificado</div>
                  </div>
                </div>
                <div className="text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Localizações suspeitas - Completed */}
            <div className="bg-gray-900 rounded-lg p-4 mb-3 hover:bg-gray-800 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div className="font-bold text-white">{suspiciousLocations} localizações suspeitas encontradas</div>
                    <div className="text-xs text-gray-400">Dados de localização analisados</div>
                  </div>
                </div>
                <div className="text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Verification Button */}
            <div className="mt-6 flex justify-center">
              <button 
                onClick={handleVerify}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center"
              >
                <span>Verificar detalhes</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-auto">
          Os dados são processados em tempo real e são estritamente confidenciais
        </div>
      </div>
    </div>
  )
}
