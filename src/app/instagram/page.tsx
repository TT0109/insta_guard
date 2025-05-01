'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import InstagramHeader from '../components/instagram/Header'
import Stories from '../components/instagram/Stories'
import Feed from '../components/instagram/Feed'
import Navbar from '../components/navbar'
import { useUserStore } from '../store/instagramApi.store'
import useInstagramStore from '../store/instagram.store'
import { getImageBase64 } from '../actions/imageProxyActions'
import { usePayment } from '../components/payment/PaymentContext'
import PaymentModal from '../components/payment/PaymentModal'
import StoreInitializer from '../components/instagram/StoreInitializer'

// Function to convert image URL to base64
async function getImageBase64Profile(imageUrl: string): Promise<string> {
  return await getImageBase64(imageUrl)
}

// Profile component
function ProfileView({ user }: { user: any }) {
  const { openPaymentModal } = usePayment()
  const { profileImage, username } = useInstagramStore()
  
  return (
    <div className="flex flex-col bg-black text-white">
      {/* Profile header */}
      
      <div className="px-4 pt-4">
        <div className="flex items-start">
          {/* Profile picture */}
          <div className="mr-8">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-zinc-700">
              <Image 
                src={profileImage || '/default-profile.jpg'} 
                alt={username || 'Profile'} 
                width={80} 
                height={80} 
                className="object-cover"
              />
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <div className="text-center">
                <div className="font-semibold">{user?.media_count || 11}</div>
                <div className="text-xs text-gray-400">posts</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{user?.edge_followed_by?.count || 906}</div>
                <div className="text-xs text-gray-400">seguidores</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{user?.edge_follow?.count || 1424}</div>
                <div className="text-xs text-gray-400">seguindo</div>
              </div>
            </div>
            
            {/* Buttons */}
            <div className="flex gap-2">
              <button 
                className="flex-1 bg-zinc-800 rounded-md py-1.5 text-sm font-medium flex items-center justify-center gap-1"
                onClick={openPaymentModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Editar
              </button>
              <button className="flex-1 bg-zinc-800 rounded-md py-1.5 text-sm font-medium">
                Compartilhar perfil
              </button>
            </div>
          </div>
        </div>
        
        {/* Bio */}
        <div className="mt-4">
          <h1 className="font-semibold">{user?.full_name }</h1>
        </div>
      </div>
      
      {/* Highlights */}
      <div className="px-2 mt-6 overflow-x-auto">
        <div className="flex gap-4 pb-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border border-zinc-700 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full overflow-hidden">
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                  <span className="text-2xl">+</span>
                </div>
              </div>
            </div>
            <span className="text-xs mt-1">Destaques</span>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-t border-zinc-800 mt-2">
        <button className="flex-1 py-3 flex justify-center border-b-2 border-white">
          <svg aria-label="Posts" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24">
            <rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect>
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line>
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line>
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line>
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line>
          </svg>
        </button>
        <button className="flex-1 py-3 flex justify-center">
          <svg aria-label="Reels" color="rgb(115, 115, 115)" fill="rgb(115, 115, 115)" height="24" role="img" viewBox="0 0 24 24" width="24">
            <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="2.049" x2="21.95" y1="7.002" y2="7.002"></line>
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="13.504" x2="16.362" y1="2.001" y2="7.002"></line>
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7.207" x2="10.002" y1="2.11" y2="7.002"></line>
            <path d="M2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.848-.698-4.006-1.606-4.945C19.454 2.699 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.546 2 5.704 2 8.552Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            <path d="M9.763 17.664a.908.908 0 0 1-.454-.787V11.63a.909.909 0 0 1 1.364-.788l4.545 2.624a.909.909 0 0 1 0 1.575l-4.545 2.624a.91.91 0 0 1-.91-.001Z" fillRule="evenodd"></path>
          </svg>
        </button>
        <button className="flex-1 py-3 flex justify-center">
          <svg aria-label="Tagged" color="rgb(115, 115, 115)" fill="rgb(115, 115, 115)" height="24" role="img" viewBox="0 0 24 24" width="24">
            <path d="M10.201 3.797 12 1.997l1.799 1.8a1.59 1.59 0 0 0 1.124.465h5.259A1.818 1.818 0 0 1 22 6.08v14.104a1.818 1.818 0 0 1-1.818 1.818H3.818A1.818 1.818 0 0 1 2 20.184V6.08a1.818 1.818 0 0 1 1.818-1.818h5.26a1.59 1.59 0 0 0 1.123-.465Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            <path d="M18.598 22.002V21.4a3.949 3.949 0 0 0-3.948-3.949H9.495A3.949 3.949 0 0 0 5.546 21.4v.603" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            <circle cx="12.072" cy="11.075" fill="none" r="3.556" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
          </svg>
        </button>
      </div>
      
      {/* Grid of posts - Premium locked */}
      <div className="grid grid-cols-3 gap-1 mt-1 relative" onClick={openPaymentModal}>
        {/* Overlay with lock icon */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 cursor-pointer">
          <div className="text-center">
            <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <p className="text-white font-medium">Conteúdo Premium</p>
            <p className="text-gray-300 text-sm">Clique para desbloquear</p>
          </div>
        </div>
        
        {/* Post grid items */}
        {[...Array(9)].map((_, i) => (
          <div key={i} className="aspect-square bg-zinc-800 relative">
            {i < 3 && (
              <Image 
                src={`/post-${i + 1}.jpg`} 
                alt={`Post ${i + 1}`}
                width={200}
                height={200}
                className="object-cover w-full h-full blur-[2px]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/150';
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function InstagramPage() {
  const { user, getUserInfo, getFollowers, getFollowings } = useUserStore()
  const instagramStore = useInstagramStore()
  const { username } = useInstagramStore()
  const [showProfile, setShowProfile] = useState(false)
  const { isPaymentModalOpen } = usePayment()
  
  // Adicionar padding ao body para compensar o header e navbar fixos
  useEffect(() => {
    const updateUserData = async () => {
      document.body.style.paddingTop = '54px' // Altura do header
      document.body.style.paddingBottom = '49px' // Altura do navbar
      document.body.style.backgroundColor = '#000' // Fundo preto do Instagram
      
      // Update Instagram store with user data if available
      if (user) {
        try {
          const profileImageBase64 = await getImageBase64Profile(user.profile_pic_url_hd || user.profile_pic_url);
          instagramStore.setProfileImage(profileImageBase64);
          instagramStore.setUsername(user.username);
          
          // Buscar seguidores e seguindo para exibir nos stories
          if (user && (user as any).pk) {
            try {
              // Buscar seguidores
              await getFollowers((user as any).pk);
              
              // Buscar seguindo
              await getFollowings((user as any).pk);
            } catch (error) {
              console.error('Erro ao buscar seguidores/seguindo:', error);
            }
          }
        } catch (error) {
          console.error('Error converting image to base64:', error);
          // Fallback to direct URL if base64 conversion fails
          instagramStore.setProfileImage(user.profile_pic_url_hd || user.profile_pic_url);
          instagramStore.setUsername(user.username);
        }
      } else {
        // Fetch user info if not available
        try {
          const userInfo = await getUserInfo('');
          
          // Se conseguiu buscar o usuário, buscar seguidores e seguindo
          if (userInfo?.data?.user && (userInfo.data.user as any).pk) {
            try {
              // Buscar seguidores
              await getFollowers((userInfo.data.user as any).pk);
              
              // Buscar seguindo
              await getFollowings((userInfo.data.user as any).pk);
            } catch (error) {
              console.error('Erro ao buscar seguidores/seguindo:', error);
            }
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };
    
    updateUserData();
    
    return () => {
      document.body.style.paddingTop = ''
      document.body.style.paddingBottom = ''
      document.body.style.backgroundColor = ''
    }
  }, [user, instagramStore, getUserInfo, getFollowers, getFollowings])
  
  // Handle profile navigation from navbar
  useEffect(() => {
    const handleNavbarProfileClick = (event: CustomEvent) => {
      if (event.detail === 'profile') {
        setShowProfile(true);
      } else if (event.detail === 'home') {
        setShowProfile(false);
      }
    };
    
    window.addEventListener('navbarItemClick' as any, handleNavbarProfileClick);
    
    return () => {
      window.removeEventListener('navbarItemClick' as any, handleNavbarProfileClick);
    };
  }, []);

  return (
    <main className="min-h-screen bg-black">
      {/* Initialize the store to load location data */}
      <StoreInitializer />
      
      
      {!showProfile && (
        <InstagramHeader title={username || ''} />
      )}
      
      {showProfile ? (
        <><InstagramHeader title={username} isShowProcfile={true} /><ProfileView user={user} /></>
      ) : (
        <>
          <Stories />
          <Feed />
        </>
      )}
      
      <Navbar activeItem={showProfile ? 'profile' : 'home'} onNavItemClick={(item) => {
        if (item === 'profile') {
          setShowProfile(true);
        } else if (item === 'home') {
          setShowProfile(false);
        }
      }} />
    </main>
  )
}
