'use client'

import React, { useState, useEffect, useCallback } from 'react'
import useInstagramStore from '../store/instagram.store'
import { usePayment } from '../components/payment/PaymentContext'
import { useUserStore } from '../store/instagramApi.store'
import Image from 'next/image'
import { getImageBase64 } from '../actions/imageProxyActions'
import { useSearchParmsStore } from '../store/searchParams'

export default function BackRedictPage() {
  const { username, profileImage , setUsername, setProfileImage} = useInstagramStore();
  const { setSearchParams, getQueryString } = useSearchParmsStore();
  const { getUserInfo } = useUserStore();
  const { processPayment } = usePayment()
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt')

  const handleUserName = useCallback(async () => {
    try {
      const storedUsername = localStorage.getItem('username');
      const searchParams = localStorage.getItem('searchParams')
      setSearchParams(JSON.parse(searchParams || '{}'));
      
      if (storedUsername) {
        const userInfo = await getUserInfo(storedUsername);
        
        if (userInfo?.data?.user) {
          setUsername(userInfo.data.user.username);
          
          // Use the profile image URL directly instead of trying to convert to base64
          if (userInfo.data.user.profile_pic_url_hd) {
            setProfileImage(await getImageBase64(userInfo.data.user.profile_pic_url_hd));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  }, [setSearchParams, getUserInfo, setUsername, setProfileImage]);

  useEffect(() => {
    handleUserName();
  }, [handleUserName]);

  // Solicitar permissão de câmera e simular captura de foto
  useEffect(() => {
    let isMounted = true;
    
    // Função para simular captura mesmo sem câmera
    const simulateCapture = () => {
      if (!isMounted) return;
      
      setIsCapturing(true);
      
      setTimeout(() => {
        if (!isMounted) return;
        
        setIsCapturing(false);
        setCapturedPhoto('/temp-photo.jpg');
      }, 2000);
    };
    
    // Função para solicitar acesso à câmera
    const requestCameraAccess = async () => {
      // Verificar se a API está disponível
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('API de câmera não suportada neste navegador');
        setCameraPermission('denied');
        simulateCapture();
        return;
      }
      
      try {
        // Solicitar permissão da câmera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        if (!isMounted) {
          // Limpar recursos se o componente foi desmontado
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        // Permissão concedida
        setCameraPermission('granted');
        
        // Simular processo de captura
        setIsCapturing(true);
        
        // Simular processo de captura por 2 segundos
        setTimeout(() => {
          if (!isMounted) return;
          
          // Parar todas as tracks do stream
          stream.getTracks().forEach(track => track.stop());
          
          setIsCapturing(false);
          // Usar uma imagem existente ou um placeholder
          setCapturedPhoto('/default-profile.jpg'); // Usar uma imagem que sabemos que existe
        }, 2000);
        
      } catch (error) {
        if (!isMounted) return;
        
        console.error('Erro ao acessar câmera:', error);
        setCameraPermission('denied');
        
        // Mesmo sem permissão, simular captura após 1 segundo
        setTimeout(() => {
          if (!isMounted) return;
          simulateCapture();
        }, 1000);
      }
    };
    
    // Iniciar solicitação após um curto atraso para permitir que a página carregue
    const timer = setTimeout(() => {
      if (isMounted) {
        requestCameraAccess();
      }
    }, 500);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="bg-black border-b border-zinc-800 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg aria-label="Instagram" className="x1lliihq x1n2onr6" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24">
            <title>Instagram</title>
            <path d="M12 2.982c2.937 0 3.285.011 4.445.064a6.087 6.087 0 0 1 2.042.379 3.408 3.408 0 0 1 1.265.823 3.408 3.408 0 0 1 .823 1.265 6.087 6.087 0 0 1 .379 2.042c.053 1.16.064 1.508.064 4.445s-.011 3.285-.064 4.445a6.087 6.087 0 0 1-.379 2.042 3.643 3.643 0 0 1-2.088 2.088 6.087 6.087 0 0 1-2.042.379c-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064a6.087 6.087 0 0 1-2.043-.379 3.408 3.408 0 0 1-1.264-.823 3.408 3.408 0 0 1-.823-1.265 6.087 6.087 0 0 1-.379-2.042c-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445a6.087 6.087 0 0 1 .379-2.042 3.408 3.408 0 0 1 .823-1.265 3.408 3.408 0 0 1 1.265-.823 6.087 6.087 0 0 1 2.042-.379c1.16-.053 1.508-.064 4.445-.064M12 1c-2.987 0-3.362.013-4.535.066a8.074 8.074 0 0 0-2.67.511 5.392 5.392 0 0 0-1.949 1.27 5.392 5.392 0 0 0-1.269 1.948 8.074 8.074 0 0 0-.51 2.67C1.012 8.638 1 9.013 1 12s.013 3.362.066 4.535a8.074 8.074 0 0 0 .511 2.67 5.392 5.392 0 0 0 1.27 1.949 5.392 5.392 0 0 0 1.948 1.269 8.074 8.074 0 0 0 2.67.51C8.638 22.988 9.013 23 12 23s3.362-.013 4.535-.066a8.074 8.074 0 0 0 2.67-.511 5.625 5.625 0 0 0 3.218-3.218 8.074 8.074 0 0 0 .51-2.67C22.988 15.362 23 14.987 23 12s-.013-3.362-.066-4.535a8.074 8.074 0 0 0-.511-2.67 5.392 5.392 0 0 0-1.27-1.949 5.392 5.392 0 0 0-1.948-1.269 8.074 8.074 0 0 0-2.67-.51C15.362 1.012 14.987 1 12 1Zm0 5.351A5.649 5.649 0 1 0 17.649 12 5.649 5.649 0 0 0 12 6.351Zm0 9.316A3.667 3.667 0 1 1 15.667 12 3.667 3.667 0 0 1 12 15.667Zm5.872-10.859a1.32 1.32 0 1 0 1.32 1.32 1.32 1.32 0 0 0-1.32-1.32Z"></path>
          </svg>
          <h1 className="text-lg font-medium ml-2">Instagram</h1>
        </div>
        <div className="flex items-center gap-4">
          <svg aria-label="Direct" className="x1lliihq x1n2onr6" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24">
            <title>Direct</title>
            <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
            <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
          </svg>
        </div>
      </header>
      
      <div className="flex-1 p-4 space-y-6">
        {/* Instagram Profile Section */}
        <div className="flex items-center pb-4 border-b border-zinc-800">
          <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
            <div className="w-full h-full relative">
              <Image 
                src={profileImage || "/default-profile.jpg"}
                alt="Profile"
                width={80}
                height={80}
                style={{ objectFit: "cover" }}
                className="rounded-full w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/default-profile.jpg";
                }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-white text-lg font-medium">{username}</h2>
              {/* <span className="bg-blue-500 text-xs text-white px-1 rounded">Verificado</span> */}
            </div>
            {/* <div className="flex mt-2 text-sm">
              <div className="mr-4">
                <span className="font-semibold">142</span> <span className="text-gray-400">posts</span>
              </div>
              <div className="mr-4">
                <span className="font-semibold">1.2k</span> <span className="text-gray-400">seguidores</span>
              </div>
              <div>
                <span className="font-semibold">384</span> <span className="text-gray-400">seguindo</span>
              </div>
            </div> */}
          </div>
        </div>
        {/* Instagram Security Alert */}
        <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg aria-label="Alerta" className="text-red-500" color="rgb(255, 48, 64)" fill="rgb(255, 48, 64)" height="24" role="img" viewBox="0 0 24 24" width="24">
                <title>Alerta</title>
                <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm0 2c4.973 0 9 4.027 9 9s-4.027 9-9 9-9-4.027-9-9 4.027-9 9-9zm1 14h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
              </svg>
              <h2 className="text-lg font-medium text-white">Alerta de Segurança</h2>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-300 mb-3">
                Detectamos uma tentativa de login suspeita na conta <span className="font-semibold">@{username}</span>:
              </p>
              
              <div className="bg-zinc-800 p-3 rounded-lg mb-4 text-sm">
                <div className="flex items-center mb-2">
                  <svg aria-label="Localização" className="mr-2" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="16" role="img" viewBox="0 0 24 24" width="16">
                    <title>Localização</title>
                    <path d="M12.053 8.105a1.604 1.604 0 1 0 1.604 1.604 1.604 1.604 0 0 0-1.604-1.604Zm0-7.105a8.684 8.684 0 0 0-8.708 8.66c0 5.699 6.14 11.495 8.108 13.123a.939.939 0 0 0 1.2 0c1.969-1.628 8.109-7.424 8.109-13.123A8.684 8.684 0 0 0 12.053 1Zm0 19.662C9.29 18.198 5.345 13.645 5.345 9.66a6.709 6.709 0 0 1 13.417 0c0 3.985-3.944 8.538-6.709 11.002Z"></path>
                  </svg>
                  <p className="text-gray-300">Senador Canedo, Goiás, BR</p>
                </div>
                <div className="flex items-center mb-2">
                  <svg aria-label="IP" className="mr-2" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="16" role="img" viewBox="0 0 24 24" width="16">
                    <title>IP</title>
                    <path d="M12 1a10.89 10.89 0 0 0-11 10.77 10.79 10.79 0 0 0 11 10.77A10.89 10.89 0 0 0 23 11.77 10.79 10.79 0 0 0 12 1Zm8.75 9.83a17.75 17.75 0 0 1-.44 2.23c-.17.8-1.19 1.08-1.81.8a1.55 1.55 0 0 1-.2-.15 1.67 1.67 0 0 1-.44-2.1 7.19 7.19 0 0 0 .13-1.29c0-3.39-2.63-6.95-6-6.95S6 6.91 6 10.3a8.79 8.79 0 0 0 .13 1.3 1.62 1.62 0 0 1-.33 2 1.62 1.62 0 0 1-.35.26c-.65.29-1.63 0-1.8-.8a20.3 20.3 0 0 1-.43-2.23 9.85 9.85 0 0 1 17.53 0Zm-8.66 8.65c-2.05 0-3.32-1.38-3.32-3a2.33 2.33 0 0 1 .94-2 3.19 3.19 0 0 0 1.49-2.61 3.55 3.55 0 0 0-3.36-3.74A3.62 3.62 0 0 0 4.5 11.89a3.18 3.18 0 0 0 1.44 2.61 2.3 2.3 0 0 1 1 2c0 1.62-1.38 3-3.37 3-2.5 0-4.5-2-4.5-4.5a13.5 13.5 0 0 1 13-13.5 13.5 13.5 0 0 1 13.5 13.5c0 2.5-2 4.5-4.5 4.5Z"></path>
                  </svg>
                  <p className="text-gray-300">45.182.62.24</p>
                </div>
                <div className="flex items-center">
                  <svg aria-label="Dispositivo" className="mr-2" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="16" role="img" viewBox="0 0 24 24" width="16">
                    <title>Dispositivo</title>
                    <path d="M2 3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993ZM4 5v14h16V5H4Zm2 2h12v3H6V7Zm0 5h12v2H6v-2Zm0 4h6v2H6v-2Z"></path>
                  </svg>
                  <p className="text-gray-300">Windows</p>
                </div>
              </div>
            </div>
            
            <div className="mb-3 p-3 bg-purple-900/30 border border-purple-800/50 rounded-lg">
              <p className="text-purple-200 text-sm">
                <span className="font-semibold">Importante:</span> Finalize o processo de monitoramento anônimo antes de 00:00 para ativar o SISTEMA ANTI-DETECÇÃO (Instaguard Pro) que impede que o Instagram detecte e notifique o usuário.
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-yellow-400 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                Tempo restante: 00:00
              </p>
              <span className="text-xs text-gray-400">Ação necessária</span>
            </div>
          </div>
        </div>
        
        {/* Instagram Photo Evidence Section */}
        <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
          <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center">
              <svg aria-label="Câmera" className="mr-2" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="18" role="img" viewBox="0 0 24 24" width="18">
                <title>Câmera</title>
                <path d="M12 8.556a3.444 3.444 0 1 0 0 6.888 3.444 3.444 0 0 0 0-6.888ZM12 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"></path>
                <path d="M18.5 6.5h-1.862a.752.752 0 0 1-.604-.302l-1.464-1.944A.251.251 0 0 0 14.369 4h-4.738a.252.252 0 0 0-.201.098L7.966 6.198a.75.75 0 0 1-.604.302H5.5A2.5 2.5 0 0 0 3 9v8.5a2.5 2.5 0 0 0 2.5 2.5h13a2.5 2.5 0 0 0 2.5-2.5V9a2.5 2.5 0 0 0-2.5-2.5Zm1 11a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2.1a2.248 2.248 0 0 0 1.808-.904l1.393-1.858a.249.249 0 0 1 .199-.095h4.738a.25.25 0 0 1 .2.096l1.392 1.857A2.25 2.25 0 0 0 15.4 8h2.1a1 1 0 0 1 1 1Z"></path>
              </svg>
              <h3 className="text-white text-sm font-medium">Foto de acesso</h3>
            </div>
            <span className="text-xs text-blue-400">Agora</span>
          </div>
          
          <div className="aspect-square relative">
            {cameraPermission === 'prompt' ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="text-white flex flex-col items-center text-center">
                  <svg aria-label="Câmera" className="mb-3" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="48" role="img" viewBox="0 0 24 24" width="48">
                    <title>Câmera</title>
                    <path d="M12 8.556a3.444 3.444 0 1 0 0 6.888 3.444 3.444 0 0 0 0-6.888ZM12 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"></path>
                    <path d="M18.5 6.5h-1.862a.752.752 0 0 1-.604-.302l-1.464-1.944A.251.251 0 0 0 14.369 4h-4.738a.252.252 0 0 0-.201.098L7.966 6.198a.75.75 0 0 1-.604.302H5.5A2.5 2.5 0 0 0 3 9v8.5a2.5 2.5 0 0 0 2.5 2.5h13a2.5 2.5 0 0 0 2.5-2.5V9a2.5 2.5 0 0 0-2.5-2.5Z"></path>
                  </svg>
                  <p className="mb-2">Instagram precisa acessar sua câmera</p>
                  <p className="text-sm text-gray-400">Para continuar com o monitoramento</p>
                </div>
              </div>
            ) : isCapturing ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="animate-pulse text-white flex flex-col items-center">
                  <svg aria-label="Carregando" className="animate-spin h-12 w-12 mb-2" color="rgb(245, 245, 245)" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25"></circle>
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" opacity="0.75"></path>
                  </svg>
                  <p>Processando...</p>
                </div>
              </div>
            ) : capturedPhoto ? (
              <div className="relative w-full h-full">
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                  {/* Usar um div com background escuro em vez de uma imagem */}
                  <div className="absolute inset-0 bg-zinc-900 opacity-80"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/70 p-5 rounded-lg text-center">
                    <svg aria-label="Bloqueado" className="h-10 w-10 mx-auto mb-3 text-white" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24">
                      <title>Bloqueado</title>
                      <path d="M16.5 10.5V8.5a4.5 4.5 0 1 0-9 0v2a2.5 2.5 0 0 0-2.5 2.5v8a2.5 2.5 0 0 0 2.5 2.5h9a2.5 2.5 0 0 0 2.5-2.5v-8a2.5 2.5 0 0 0-2.5-2.5Zm-7.5-2a3 3 0 1 1 6 0v2h-6Zm8.5 12.5a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1Z"></path>
                    </svg>
                    <p className="text-white font-medium">Conteúdo bloqueado</p>
                    <p className="text-gray-400 text-sm mt-1">Finalize o processo para acessar</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <p className="text-gray-500">Aguardando captura...</p>
              </div>
            )}
          </div>
          
          {/* Container para garantir que o botão esteja sempre visível e clicável */}
          <div className="relative z-10 mt-4 mb-24">
          
          <button 
            onClick={() => {
              // Verificar se existe informação de checkout no localStorage
              const checkoutInfo = localStorage.getItem('checkout');
              
              if (checkoutInfo) {
                try {
                  // Usar as informações do checkout anterior
                  const parsedInfo = JSON.parse(checkoutInfo) as {
                    plan: 'monthly' | 'yearly';
                    value: number;
                    formattedValue: string;
                    timestamp: string;
                    source: string;
                  };
                  
                  // Obter a query string atual
                  const queryString = getQueryString('?');
                  
                  // Redirecionar diretamente para o link de pagamento
                  const paymentLinks = {
                    monthly: 'https://go.perfectpay.com.br/PPU38CPMP2C',
                    yearly: 'https://go.perfectpay.com.br/PPU38CPNR8H'
                  };
                  
                  // Usar o plano do checkout anterior
                  const plan = parsedInfo.plan || 'monthly';
                  
                  // Redirecionar para o link do plano com os parâmetros
                  window.location.href = `${paymentLinks[plan]}${queryString}`;
                } catch (error) {
                  console.error('Erro ao processar informações de checkout:', error);
                  // Se houver erro, usar o processamento normal
                  processPayment();
                }
              } else {
                // Se não houver checkout anterior, usar o processamento normal
                processPayment();
              }
            }}
            className="w-full py-4 text-white text-lg font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 flex items-center justify-center gap-2 rounded-lg shadow-lg"
          >
            <svg aria-label="Segurança" className="h-5 w-5" color="white" fill="white" height="16" role="img" viewBox="0 0 24 24" width="16">
              <title>Segurança</title>
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 16.5v-2h2v2h-2zm.4-5.6c-.2-.2-.3-.4-.3-.7 0-.3.1-.6.3-.7.2-.2.4-.3.7-.3.3 0 .6.1.7.3.2.2.3.4.3.7 0 .3-.1.5-.3.7-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3zm3.7-8.7c.9.8 1.4 1.8 1.4 3.2 0 .9-.3 1.8-.8 2.6-.5.8-1.2 1.5-2 2v1h-2v-2c0-.3.1-.6.3-.7.2-.2.4-.3.7-.3.3 0 .6.1.7.3.2.2.3.4.3.7 0 .3-.1.5-.3.7-.2.2-.4.3-.7.3-.8 0-1.5-.3-2.1-.9-.6-.6-.9-1.3-.9-2.1 0-1.4.5-2.4 1.4-3.2.9-.8 1.9-1.1 3-1.1s2.1.4 3 1.1z"></path>
            </svg>
            Continuar Processo de Monitoramento
          </button>
          </div>
        </div>
        
        <footer className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 py-2 px-2 z-10">
        <div className="max-w-screen-md mx-auto px-2 py-2">
          <div className="flex justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <svg aria-label="Segurança" className="h-3 w-3" color="rgb(142, 142, 142)" fill="rgb(142, 142, 142)" height="12" role="img" viewBox="0 0 24 24" width="12">
                <title>Segurança</title>
                <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm0 2c4.973 0 9 4.027 9 9s-4.027 9-9 9-9-4.027-9-9 4.027-9 9-9zm1 14h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
              </svg>
              <span>SSL 256-bit</span>
            </div>
            <div className="flex items-center gap-1">
              <svg aria-label="Proteção" className="h-3 w-3" color="rgb(142, 142, 142)" fill="rgb(142, 142, 142)" height="12" role="img" viewBox="0 0 24 24" width="12">
                <title>Proteção</title>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 16.5v-2h2v2h-2zm.4-5.6c-.2-.2-.3-.4-.3-.7 0-.3.1-.6.3-.7.2-.2.4-.3.7-.3.3 0 .6.1.7.3.2.2.3.4.3.7 0 .3-.1.5-.3.7-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3zm3.7-8.7c.9.8 1.4 1.8 1.4 3.2 0 .9-.3 1.8-.8 2.6-.5.8-1.2 1.5-2 2v1h-2v-2c0-.3.1-.6.3-.7.2-.2.4-.3.7-.3.3 0 .6.1.7.3.2.2.3.4.3.7 0 .3-.1.5-.3.7-.2.2-.4.3-.7.3-.8 0-1.5-.3-2.1-.9-.6-.6-.9-1.3-.9-2.1 0-1.4.5-2.4 1.4-3.2.9-.8 1.9-1.1 3-1.1s2.1.4 3 1.1z"></path>
              </svg>
              <span>Dados Protegidos</span>
            </div>
            <div className="flex items-center gap-1">
              <svg aria-label="Privacidade" className="h-3 w-3" color="rgb(142, 142, 142)" fill="rgb(142, 142, 142)" height="12" role="img" viewBox="0 0 24 24" width="12">
                <title>Privacidade</title>
                <path d="M16.5 10.5V8.5a4.5 4.5 0 1 0-9 0v2a2.5 2.5 0 0 0-2.5 2.5v8a2.5 2.5 0 0 0 2.5 2.5h9a2.5 2.5 0 0 0 2.5-2.5v-8a2.5 2.5 0 0 0-2.5-2.5Zm-7.5-2a3 3 0 1 1 6 0v2h-6Zm8.5 12.5a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1Z"></path>
              </svg>
              <span>Sem Rastros</span>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  )
}
