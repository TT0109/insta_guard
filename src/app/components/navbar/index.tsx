'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePayment } from '../payment/PaymentContext'
import PaymentModal from '../payment/PaymentModal'
import { usePhoneStore } from '@/app/store/phoneStore'
import { FaBagShopping } from "react-icons/fa6"
import useInstagramStore from '@/app/store/instagram.store'

interface NavbarItemProps {
  icon: 'home' | 'search' | 'create' | 'shop' | 'profile'
  label: string
  isActive?: boolean
  badgeCount?: number
  href?: string
  isPremium?: boolean
  onClick?: () => void
  avatar?: string
}

function NavbarItem({ 
  icon, 
  label, 
  isActive = false,
  badgeCount,
  href,
  isPremium = false,
  onClick,
  avatar
}: NavbarItemProps) {
  const instagramStore = useInstagramStore((state) => state.profileImage);
  const content = (
    <div className="flex flex-col items-center justify-center">

      <div className="relative">
        <div className="p-1">
          {icon === 'home' && (
            <svg aria-label="Home" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24">
              <path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"></path>
            </svg>
          )}
          {icon === 'search' && (
            <svg aria-label="Search" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24">
              <path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line>
            </svg>
          )}
          {icon === 'create' && (
            <svg aria-label="Create" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24">
              <path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line>
              <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line>
            </svg>
          )}
          {icon === 'shop' && (
            <FaBagShopping size={24} color="rgb(245, 245, 245)" />
          )}
          {icon === 'profile' && (
            <div className="w-7 h-7 rounded-full overflow-hidden relative">
              <Image 
                src={instagramStore} 
                alt="Profile" 
                width={28} 
                height={28} 
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = instagramStore;
                }}
              />
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-black"></div>
            </div>
          )}
        </div>
        
        {badgeCount && (
          <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badgeCount > 99 ? '99+' : badgeCount}
          </div>
        )}
      </div>

    </div>
  )
  
  if (isPremium) {
    return (
      <div className="flex-1 cursor-pointer" onClick={onClick}>
        {content}
      </div>
    )
  }
  
  if (onClick) {
    return (
      <div className="flex-1 cursor-pointer" onClick={onClick}>
        {content}
      </div>
    )
  }
  
  return href ? (
    <Link href={href} className="flex-1">
      {content}
    </Link>
  ) : (
    <div className="flex-1">
      {content}
    </div>
  )
}

interface NavbarProps {
  activeItem?: 'home' | 'search' | 'create' | 'shop' | 'profile' | 'configuracoes'
  onNavItemClick?: (item: 'home' | 'search' | 'create' | 'shop' | 'profile' | 'configuracoes') => void
}

export default function Navbar({ activeItem, onNavItemClick }: NavbarProps) {
  const { openPaymentModal, closePaymentModal, isPaymentModalOpen } = usePayment();
  const { profileImage } = usePhoneStore();
  
  const handleItemClick = (item: 'home' | 'search' | 'create' | 'shop' | 'profile') => {
    if (onNavItemClick) {
      onNavItemClick(item);
    }
  };
  
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 z-50 h-[48px]">
        <div className="flex justify-around items-center w-full h-full">
          <NavbarItem 
            icon="home" 
            label="Home" 
            isActive={activeItem === 'home'} 
            onClick={() => handleItemClick('home')}
          />
          <NavbarItem 
            icon="search" 
            label="Search" 
            isActive={activeItem === 'search'} 
            onClick={() => handleItemClick('search')}
          />
          <NavbarItem 
            icon="create" 
            label="Create" 
            isActive={activeItem === 'create'} 
            isPremium={true}
            onClick={openPaymentModal}
          />
          <NavbarItem 
            icon="shop" 
            label="Loja" 
            isActive={activeItem === 'shop'} 
            onClick={() => handleItemClick('shop')}
          />
          <NavbarItem 
            icon="profile" 
            label="Profile" 
            isActive={activeItem === 'profile'} 
            onClick={() => handleItemClick('profile')}
            avatar={profileImage || "https://i.pravatar.cc/150?img=3"}
          />
        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={closePaymentModal} 
        title="Recurso Bloqueado" 
        description="Este recurso está bloqueado. Obtenha o plano premium para continuar."
        showPlanSelector={true}
      />
    </>
  )
}
