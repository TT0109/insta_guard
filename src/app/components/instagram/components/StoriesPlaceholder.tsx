'use client'

import React from 'react'

export default function StoriesPlaceholder() {
  return (
    <div className="flex space-x-4 overflow-x-auto px-4 scrollbar-hide justify-center">
      <div className="w-14 h-14 rounded-full bg-gray-800 animate-pulse"></div>
      <div className="w-14 h-14 rounded-full bg-gray-800 animate-pulse"></div>
      <div className="w-14 h-14 rounded-full bg-gray-800 animate-pulse"></div>
    </div>
  );
}
