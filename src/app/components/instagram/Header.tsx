'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePhoneStore } from '@/app/store/phoneStore'
import useInstagramStore from '@/app/store/instagram.store'

export default function InstagramHeader({ showBackButton = false, title = '', isShowProcfile = false }) {
  const router = useRouter()
  const { username } = useInstagramStore()
 
  if(isShowProcfile){
    return (
      <header className="fixed top-0 left-0 right-0 bg-black border-b border-zinc-800 z-50">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex-1 flex items-center">
            <div className="flex items-center">
              <span 
                className="text-white mr-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <span className="text-white font-semibold text-lg">{username}</span>
            </div>
        </div>
      </div>
    </header>
    )
  }
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-black border-b border-zinc-800 z-50">
      <div className="flex justify-between items-center px-4 py-2">
        {/* Left side - Logo or Back button + username */}
        <div className="flex-1 flex items-center">
          {showBackButton ? (
            <div className="flex items-center">
              <button 
                onClick={() => router.push('/instagram')}
                className="text-white mr-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
              <span className="text-white font-semibold text-lg">{title || username}</span>
            </div>
          ) : (
            <Link href="/">
              <h1 className="text-white font-semibold text-2xl font-serif" style={{ fontFamily: 'Billabong, sans-serif' }}>Instagram</h1>
            </Link>
          )}
        </div>
        
        {/* Icons on the right */}
        <div className="flex items-center space-x-5">
          {!showBackButton && (
            <>
              <button className="text-white relative">
                <svg aria-label="Notifications" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24">
                  <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                </svg>
                <div className="absolute top-0 right-0 bg-red-500 rounded-full w-2 h-2"></div>
              </button>
            </>
          )}
          
          <Link href="/messages" className="text-white relative">
            <svg aria-label="Direct messaging" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24">
              <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
              <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
            </svg>
            <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold text-white">3</div>
          </Link>
        </div>
      </div>
    </header>
  )
}
