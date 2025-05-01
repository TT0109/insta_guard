'use client'

import React from 'react'
import Image from 'next/image'
import { Story } from '../types/Story'

interface StoryItemProps {
  story: Story;
}

export default function StoryItem({ story }: StoryItemProps) {
  const { id, username, userImage, viewed, isLocked, isCloseFriend } = story;
  const isSelfStory = username === 'Seu story';

  return (
    <div className="flex flex-col items-center space-y-1 w-16">
      <div className={`relative rounded-full p-[2px] ${isCloseFriend ? 'bg-green-500' : viewed ? 'bg-gray-700' : 'bg-gradient-to-tr from-yellow-400 to-pink-600'}`}>
        <div className="bg-black rounded-full p-[2px]">
          <div className="relative w-14 h-14 rounded-full overflow-hidden">
            <div className="w-full h-full rounded-full overflow-hidden relative">
              <Image
                src={userImage}
                alt={username}
                fill
                sizes="56px"
                style={{ objectFit: 'cover' }}
                className={isLocked ? 'blur-sm' : ''}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70);
                }}
              />
            </div>
          </div>

          {isSelfStory && (
            <div className="absolute bottom-0 right-[5px] translate-y-[30%] bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center z-10 border-[1.5px] border-black shadow-sm">
              <span className="text-white text-sm font-bold">+</span>
            </div>
          )}

          {isLocked && (
            <div className="absolute top-0 right-0 bg-pink-500 rounded-full w-4 h-4 flex items-center justify-center z-10 border border-black shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          )}
        </div>
      </div>
      <span className="text-xs text-center truncate w-16">{username}</span>
    </div>
  )
}
