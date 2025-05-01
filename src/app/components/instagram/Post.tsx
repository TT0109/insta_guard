'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import useInstagramStore, { Post as PostType } from '@/app/store/instagram.store';

interface PostProps {
  post: PostType;
}

export default function Post({ post }: PostProps) {
  const { toggleLike, username: currentUsername } = useInstagramStore();
  const [showAllComments, setShowAllComments] = useState(false);
  
  const { 
    id,
    username, 
    userImage, 
    imageUrl, 
    caption, 
    likes, 
    comments,
    timestamp,
    isLiked,
    isSaved,
    location
  } = post;

  const handleLike = () => {
    toggleLike(id);
  };

  return (
    <div className="bg-black text-white border-b border-zinc-800 pb-2 mb-4">
      {/* Post header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
            <div className="filter blur-[4px]">
              <Image 
                src={userImage} 
                alt={username} 
                width={32} 
                height={32} 
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm filter blur-[4px]">{username}</span>
            {location && <span className="text-xs text-gray-400">{location}</span>}
          </div>
        </div>
        <button>
          <svg aria-label="More options" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24">
            <circle cx="12" cy="12" r="1.5"></circle>
            <circle cx="6" cy="12" r="1.5"></circle>
            <circle cx="18" cy="12" r="1.5"></circle>
          </svg>
        </button>
      </div>

      {/* Content restricted overlay with blur effect */}
      <div className="relative w-full aspect-square bg-gray-900 overflow-hidden">
        {/* Blurred background image */}
        <div className="absolute inset-0 bg-[url('/images/blurred-content.jpg')] bg-cover bg-center opacity-30 blur-sm"></div>
        
        {/* Lock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm bg-black/30 z-10">
          <svg aria-label="Cadeado" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-4 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <h2 className="text-xl font-bold text-white mb-1">Conteúdo restrito</h2>
          <p className="text-sm text-gray-300">{timestamp}</p>
        </div>
      </div>

      {/* Post actions */}
      <div className="p-3">
        <div className="flex justify-between mb-2">
          <div className="flex space-x-4">
            <button onClick={handleLike}>
              {isLiked ? (
                <svg aria-label="Unlike" color="rgb(255, 48, 64)" fill="rgb(255, 48, 64)" height="24" role="img" viewBox="0 0 24 24" width="24">
                  <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                </svg>
              ) : (
                <svg aria-label="Like" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24">
                  <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                </svg>
              )}
            </button>
            <button>
              <svg aria-label="Comment" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24">
                <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </button>
            <button>
              <svg aria-label="Share Post" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24">
                <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
                <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
              </svg>
            </button>
          </div>
          <button>
            {isSaved ? (
              <svg aria-label="Remove" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24">
                <path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path>
              </svg>
            ) : (
              <svg aria-label="Save" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24">
                <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
              </svg>
            )}
          </button>
        </div>

        {/* Likes */}
        <div className="font-semibold mb-1">{likes.toLocaleString()} curtidas</div>

        {/* Caption */}
        <div className="mb-1">
          <span className="font-semibold mr-2">{username}</span>
          {caption}
        </div>

        {/* Comments */}
        {comments && comments.length > 0 && (
          <div className="mb-1">
            <button 
              className="text-gray-400 text-sm"
              onClick={() => setShowAllComments(!showAllComments)}
            >
              Ver todos os {comments.length} comentários
            </button>
            
            {showAllComments ? (
              comments.map(comment => {
                // Check if this comment is from the current user by comparing usernames
                const isCurrentUser = comment.username === currentUsername;
                // Check if this is a hot comment based on the isHotComment property
                const isHotComment = comment.isHotComment === true;
                
                return (
                  <div key={comment.id} className="mt-1">
                    <span className="font-semibold mr-2">{comment.username}</span>
                    {isHotComment ? (
                      <span className="flex items-center">
                        <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded mr-1">Alerta</span>
                        <span className="filter blur-sm">{comment.text}</span>
                        <span className="ml-1 flex">
                          <span className="mr-1">🔥</span>
                          <span>😈</span>
                        </span>
                      </span>
                    ) : isCurrentUser ? (
                      comment.text
                    ) : (
                      <span className="filter blur-[2px]">{comment.text}</span>
                    )}
                  </div>
                );
              })
            ) : (
              comments[0] && (
                <div className="mt-1">
                  <span className="font-semibold mr-2">{comments[0].username}</span>
                  {comments[0].isHotComment ? (
                    <span className="flex items-center">
                      <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded mr-1">Alerta</span>
                      <span className="filter blur-sm">{comments[0].text}</span>
                      <span className="ml-1 flex">
                        <span className="mr-1">🔥</span>
                        <span>😈</span>
                      </span>
                    </span>
                  ) : comments[0].username === currentUsername ? (
                    comments[0].text
                  ) : (
                    <span className="filter blur-[2px]">{comments[0].text}</span>
                  )}
                </div>
              )
            )}
          </div>
        )}

        {/* Timestamp */}
        <div className="text-gray-500 text-xs">{timestamp}</div>
      </div>
      
      {/* Comment input */}
      {/* <div className="flex items-center px-4 mt-3">
        <button className="mr-3">
          <svg aria-label="Emoji" className="_ab6-" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24">
            <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
          </svg>
        </button>
        <input 
          type="text" 
          placeholder="Add a comment..." 
          className="bg-transparent text-white text-sm w-full outline-none"
        />
        <button className="text-blue-500 text-sm font-semibold ml-2">Post</button>
      </div> */}
    </div>
  )
}
