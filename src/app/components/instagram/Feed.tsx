'use client'

import React from 'react'
import Post from './Post'
import useInstagramStore from '@/app/store/instagram.store'
import ActivitySummary from '../payment/ActivitySummary'

export default function Feed() {
  const { posts } = useInstagramStore()

  return (
    <div className="pb-16">
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
      
      {/* Activity Summary after posts */}
      <div className="px-4 py-6">
        <ActivitySummary />
      </div>
    </div>
  )
}
