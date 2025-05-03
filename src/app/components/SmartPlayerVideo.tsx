'use client'

import React, { useEffect, useRef, useState } from 'react'

interface SmartPlayerVideoProps {
  onVideoEnd?: () => void
  onVideoProgress?: (progress: number) => void
  onVideoDurationChange?: (duration: number, currentTime?: number) => void
}

// Add type declaration for window.smartplayer
declare global {
  interface Window {
    smartplayer: any;
  }
}

export default function SmartPlayerVideo({ onVideoEnd, onVideoProgress, onVideoDurationChange }: SmartPlayerVideoProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(603); // Duração aproximada do vídeo em segundos (10 minutos)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showMuteNotice, setShowMuteNotice] = useState(true);
  const videoEndedRef = useRef(false); // Track if video has ended to prevent multiple calls
  
  useEffect(() => {
    // Prevent page reload when video ends
    window.onbeforeunload = (e) => {
      e.preventDefault();
      return false;
    };
    
    // Add autoplay settings to window before loading the script
    // This helps ensure the SmartPlayer initializes with autoplay enabled
    window.smartplayer = window.smartplayer || {};
    window.smartplayer.instances = window.smartplayer.instances || {};
    window.smartplayer.instances['644a1ae1b0ab0b0009260396'] = {
      config: {
        autoplay: true,
        muted: true,
        loop: false // Prevent looping
      }
    };
    
    // Inicializa o script do SmartPlayer
    if (!document.getElementById('scr_644a1ae1b0ab0b0009260396')) {
      const script = document.createElement('script');
      script.src = 'https://scripts.converteai.net/ac126580-0731-4f45-9424-c0e1a1514295/players/644a1ae1b0ab0b0009260396/player.js'
      script.async = true
      script.id = 'scr_644a1ae1b0ab0b0009260396'
      document.head.appendChild(script);
      
      // Force autoplay after script loads
      script.onload = () => {
        setTimeout(() => {
          const videoElement = document.querySelector('video');
          if (videoElement) {
            videoElement.muted = true;
            videoElement.play().catch(e => console.error('Autoplay failed after script load:', e));
          }
        }, 500);
      };
    }
    
    // Configura um intervalo para monitorar o vídeo
    const monitorVideo = () => {
      const videoElement = document.querySelector('video');
      if (videoElement) {
        // Configure video for autoplay if not already configured
        if (!videoElement.hasAttribute('data-configured')) {
          console.log('Configuring video for autoplay');
          // Set critical attributes for autoplay
          videoElement.muted = true;
          videoElement.playsInline = true;
          videoElement.autoplay = true;
          videoElement.setAttribute('data-configured', 'true');
          setIsMuted(true);
          setShowMuteNotice(true);
          
          // Remove controls to prevent user from pausing
          videoElement.controls = false;
          
          // Force play with multiple attempts
          const attemptPlay = () => {
            videoElement.play()
              .then(() => {
                console.log('Autoplay successful');
              })
              .catch(err => {
                console.error('Autoplay failed, retrying:', err);
                setTimeout(attemptPlay, 200);
              });
          };
          
          attemptPlay();
          
          // Add click handlers to the document for user interaction backup
          document.addEventListener('click', () => {
            videoElement.play().catch(e => console.error('Play after click failed:', e));
          }, { once: true });
        }
        
        // Atualiza a duração total do vídeo se disponível
        if (videoElement.duration && videoElement.duration > 0) {
          const duration = Math.floor(videoElement.duration);
          setTotalDuration(duration);
          console.log('Video duration detected:', duration);
          
          // Notifica o componente pai sobre a duração
          if (onVideoDurationChange) {
            onVideoDurationChange(duration);
          }
        }
        
        // Monitora o progresso do vídeo
        if (videoElement.duration && videoElement.duration > 0) {
          const progress = (videoElement.currentTime / videoElement.duration) * 100;
          const remaining = Math.max(0, Math.floor(videoElement.duration - videoElement.currentTime));
          
          // Atualiza o tempo restante
          setTimeRemaining(remaining);
          
          // Notifica o componente pai sobre o progresso e o tempo atual
          if (onVideoProgress) {
            onVideoProgress(progress);
          }
          
          // Notifica explicitamente sobre a duração atual para garantir que o tempo seja atualizado
          if (onVideoDurationChange) {
            // Envia a duração e o tempo atual para o componente pai
            onVideoDurationChange(videoElement.duration, videoElement.currentTime);
          }
          
          // Verifica se o vídeo terminou - detect end much earlier
          if ((videoElement.ended || progress > 95 || videoElement.currentTime >= videoElement.duration - 2) && !videoEndedRef.current) {
            console.log('Video end detected:', { ended: videoElement.ended, progress, currentTime: videoElement.currentTime, duration: videoElement.duration });
            // Mark as ended to prevent multiple calls
            videoEndedRef.current = true;
            // Force the time remaining to 0 immediately
            setTimeRemaining(0);
            
            if (onVideoEnd) {
              // Call onVideoEnd immediately
              console.log('Calling onVideoEnd callback');
              onVideoEnd();
            }
            
            // Stop the video to prevent it from looping or continuing
            videoElement.pause();
            // Prevent default behavior that might cause page reload
            videoElement.onended = (e) => {
              e.preventDefault();
              return false;
            };
          }
        }
      }
    };
    
    // Inicia o monitoramento a cada segundo
    timerIntervalRef.current = setInterval(monitorVideo, 1000);
    
    // Add a forced end check after a specific time but much earlier
    // This ensures the video end callback is called even if other detection methods fail
    const knownDuration = 188; // Known video duration in seconds
    const forceEndTimeout = setTimeout(() => {
      if (!videoEndedRef.current && onVideoEnd) {
        console.log('Forcing video end callback after timeout');
        videoEndedRef.current = true;
        setTimeRemaining(0);
        onVideoEnd();
        
        // Find and stop the video to prevent reload
        const videoElement = document.querySelector('video');
        if (videoElement) {
          videoElement.pause();
          // Prevent default behavior
          videoElement.onended = (e) => {
            e.preventDefault();
            return false;
          };
        }
      }
    }, (knownDuration - 5) * 1000); // End 5 seconds earlier
    
    // Cleanup
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      clearTimeout(forceEndTimeout);
    };
  }, [onVideoEnd, onVideoProgress, onVideoDurationChange]);

  return (
    <div className="w-full">
      {/* Video Player Container */}
      <div className="relative w-full rounded-xl overflow-hidden">
        {/* Div principal do SmartPlayer - NÃO MODIFIQUE ESTE ID */}
        <div id="vid_644a1ae1b0ab0b0009260396" style={{ position: 'relative', width: '100%', padding: '56.25% 0 0' }} className="video-container">
          {/* Add click handler to the container to help with autoplay */}
          <div 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              zIndex: 5, 
              cursor: 'pointer' 
            }} 
            onClick={() => {
              const video = document.querySelector('video');
              if (video) {
                video.muted = false; // Unmute when user clicks
                setIsMuted(false);
                setShowMuteNotice(false);
                video.play().catch(e => console.error('Play after click failed:', e));
              }
            }}
          />
          
          {/* Mute indicator */}
          {showMuteNotice && (
            <div 
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
              onClick={() => {
                const video = document.querySelector('video');
                if (video) {
                  video.muted = false;
                  setIsMuted(false);
                  setShowMuteNotice(false);
                }
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
          {/* Timer display */}
          {/* <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 10
          }}>
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </div> */}
        </div>
      </div>
      
      {/* Estilo para esconder botões padrão */}
      <style jsx global>{`
        .smartplayer-bigplay,
        .converteai-play-button, 
        .vjs-big-play-button, 
        .ytp-large-play-button,
        .vjs-control-bar,
        .vjs-error-display,
        .vjs-loading-spinner,
        .vjs-poster,
        .vjs-text-track-display {
          opacity: 0 !important;
          pointer-events: none !important;
          display: none !important;
          visibility: hidden !important;
        }
        
        /* Force autoplay styles */
        video {
          object-fit: cover !important;
        }
        
        /* Ensure the video container is clickable */
        .video-container {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
