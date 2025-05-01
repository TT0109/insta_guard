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

// Função para formatar o tempo em minutos:segundos
const formatTime = (timeInSeconds: number): string => {
  if (!timeInSeconds) return '0:00';
  
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  
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
  const [videoTotalTime, setVideoTotalTime] = useState(0)
  const [videoCurrentTime, setVideoCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)

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
  
  useEffect(() => {
    const progressInterval = setInterval(() => {
      // Only update progress if we have video duration
      if (videoTotalTime > 0) {
        const calculatedProgress = (videoCurrentTime / videoTotalTime) * 100
        setProgress(calculatedProgress)
        
        // If video has ended, trigger redirect
        if (videoEnded && !redirectTriggered) {
          setRedirectTriggered(true)
        }
      } else {
        // Fallback animation if video duration not available yet
        setProgress(prev => Math.min(prev + 0.3, 99))
      }
    }, 50)

    return () => {
      clearInterval(progressInterval)
    }
  }, [videoCurrentTime, videoTotalTime, videoEnded, redirectTriggered])
  
  // Separate effect for redirection to avoid loop
  useEffect(() => {
    if (redirectTriggered || videoEnded) {
      console.log('Redirect triggered:', redirectTriggered, 'Video ended:', videoEnded)
      // Redirecionar imediatamente quando o vídeo terminar
      console.log('Redirecting to /instagram')
      router.push('/instagram')
    }
  }, [redirectTriggered, videoEnded, router])

  // Effect to load the video player script and add event listeners
  useEffect(() => {
    // Create script element for the video player
    const existingScript = document.getElementById('scr_644a1ae1b0ab0b0009260396')
    if (existingScript && existingScript.parentNode) {
      existingScript.parentNode.removeChild(existingScript)
    }
    
    const script = document.createElement('script')
    script.src = 'https://scripts.converteai.net/ac126580-0731-4f45-9424-c0e1a1514295/players/644a1ae1b0ab0b0009260396/player.js'
    script.async = true
    script.id = 'scr_644a1ae1b0ab0b0009260396'
    document.head.appendChild(script)
    
    // Configure video after script loads
    script.onload = () => {
      console.log('Script loaded, initializing player...');
      
      // Wait for player to initialize
      setTimeout(() => {
        // Find video element and configure it
        const videoElement = document.querySelector('video');
        if (videoElement) {
          // Configure video settings for autoplay with muted sound
          videoElement.controls = false;
          videoElement.muted = true; // Start muted to allow autoplay
          videoElement.playsInline = true; // Important for mobile
          videoElement.autoplay = true; // Enable autoplay
          setIsMuted(true);
          
          // Try to autoplay the video
          videoElement.play().catch(err => {
            console.error('Autoplay failed:', err);
            // If autoplay fails, we'll rely on user interaction
          });
          
          // Add event listeners
          videoElement.addEventListener('loadedmetadata', () => {
            setVideoTotalTime(videoElement.duration);
          });
          
          videoElement.addEventListener('timeupdate', () => {
            setVideoCurrentTime(videoElement.currentTime);
          });
          
          videoElement.addEventListener('ended', () => {
            console.log('Video ended event triggered');
            setVideoEnded(true);
            setRedirectTriggered(true);
            router.push('/instagram');
          });
          
          videoElement.addEventListener('play', () => {
            setIsVideoPlaying(true);
          });
          
          videoElement.addEventListener('pause', () => {
            setIsVideoPlaying(false);
            // Prevent user from pausing video
            if (!videoElement.ended) {
              videoElement.play().catch(err => console.error('Error playing video:', err));
            }
          });
        }
      }, 1000);
    };

    // Cleanup function
    return () => {
      // Remove script
      const scriptElement = document.getElementById('scr_644a1ae1b0ab0b0009260396');
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
      
      // Clean up video elements
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        video.pause();
        video.src = '';
        video.load();
      });
    };
  }, [router])

  // Function to handle unmuting the video
  const handleUnmute = () => {
    setUserInteracted(true);
    
    // Unmute the video
    const video = document.querySelector('video');
    if (video) {
      console.log('Unmuting video');
      video.muted = false;
      setIsMuted(false);
      
      // Make sure the video is playing
      if (video.paused) {
        video.play().catch(err => {
          console.error('Error playing video after unmute:', err);
          // If there's an error, try again with user interaction
          document.addEventListener('click', () => {
            video.play().catch(e => console.error('Error on second attempt:', e));
          }, { once: true });
        });
      }
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
          {/* Converteai Video Player */}
          <div id="vid_644a1ae1b0ab0b0009260396" style={{ position: 'relative', width: '100%', padding: '56.25% 0 0' }} className="video-container">
            <div id="thumb_644a1ae1b0ab0b0009260396" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <Image 
                src="https://images.converteai.net/ac126580-0731-4f45-9424-c0e1a1514295/players/644a1ae1b0ab0b0009260396/thumbnail.jpg"
                alt="thumbnail"
                fill
                sizes="100vw"
                style={{ objectFit: 'cover', display: 'block' }}
                priority
              />
            </div>
            <div id="backdrop_644a1ae1b0ab0b0009260396" style={{ WebkitBackdropFilter: 'blur(5px)', backdropFilter: 'blur(5px)', position: 'absolute', top: 0, height: '100%', width: '100%' }}></div>
            
            {/* Unmute button overlay */}
            {isMuted && (
              <div 
                onClick={handleUnmute}
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                {/* Unmute button */}
                <div 
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(to right, #8a2387, #e94057, #f27121)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                    marginBottom: '5px'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                </div>
                
                {/* Unmute text */}
                <div 
                  style={{
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textShadow: '0 0 10px rgba(0,0,0,0.8)'
                  }}
                >
                  Ativar som
                </div>
              </div>
            )}
          </div>
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
        <div className="text-gray-400 text-center mb-2">
          {videoEnded ? 'Processamento concluído!' : 'Processando...'}
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

        {/* Suspicious Data Section */}
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

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-auto">
          Os dados são processados em tempo real e são estritamente confidenciais
        </div>
      </div>
    </div>
  )
}
