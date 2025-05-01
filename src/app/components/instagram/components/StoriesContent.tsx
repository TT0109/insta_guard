'use client'

import React, { useEffect, useState } from 'react'
import useInstagramStore from '@/app/store/instagram.store'
import { useUserStore } from '@/app/store/instagramApi.store'
import { Story } from '../types/Story'
import StoryItem from './StoryItem'
import StoriesPlaceholder from './StoriesPlaceholder'
import { createStoriesFromFollowers, getDefaultStories } from '../utils/storyUtils'

export default function StoriesContent() {
  // Usando estado local para os stories
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Acessar os stores
  const { profileImage } = useInstagramStore()
  const { user, getFollowers, getFollowings, getUserInfo } = useUserStore()

  // Carregar os dados dos stories
  useEffect(() => {
    let isDataLoaded = false

    // Função para carregar os dados
    const loadData = async () => {
      if (isDataLoaded) return
      isDataLoaded = true

      try {
        // Definir que está carregando
        setIsLoading(true)

        if (user) {
          const userId = user.id || (user as any).pk
          if (userId) {
            console.log('Iniciando carregamento de seguidores e seguidos')
            try {
              const followersResponse = await getFollowers(userId)
              const followingsResponse = await getFollowings(userId)
              
              // Usando as propriedades com type assertion para evitar erros de tipagem
              console.log('Seguidores carregados:', (followersResponse as any)?.users?.length || 0)
              console.log('Seguidos carregados:', (followingsResponse as any)?.users?.length || 0)
              
              // Exemplo de um usuário para debug
              if ((followersResponse as any)?.users?.[0]) {
                console.log('Exemplo de seguidor:', JSON.stringify((followersResponse as any).users[0], null, 2))
              }
              
              // Criar stories a partir dos seguidores e seguidos
              const newStories = await createStoriesFromFollowers(
                followersResponse, 
                followingsResponse,
                profileImage || ''
              )
              
              // Atualizar o estado com os novos stories
              setStories(newStories)
            } catch (error) {
              console.error('Erro ao carregar seguidores/seguidos:', error)
            } finally {
              setIsLoading(false)
            }
          } else {
            setIsLoading(false)
          }
        } else {
          try {
            const username = useInstagramStore.getState().username
            console.log('Buscando informações para o usuário:', username)
            const userInfo = await getUserInfo(username)
            
            if (userInfo?.data?.user) {
              const userId = userInfo.data.user.id || (userInfo.data.user as any).pk
              if (userId) {
                const followersResponse = await getFollowers(userId)
                const followingsResponse = await getFollowings(userId)
                
                // Criar stories a partir dos seguidores e seguidos
                const newStories = await createStoriesFromFollowers(
                  followersResponse, 
                  followingsResponse,
                  profileImage || ''
                )
                
                // Atualizar o estado com os novos stories
                setStories(newStories)
              }
            }
          } catch (error) {
            console.error('Erro ao buscar informações do usuário:', error)
          } finally {
            setIsLoading(false)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        setIsLoading(false)
      }
    }
    
    loadData()

    return () => {
      isDataLoaded = true
    }
  }, [getFollowers, getFollowings, getUserInfo, user, profileImage])

  const defaultStories = getDefaultStories(profileImage || '')

  const displayStories = stories.length === 0 ? defaultStories : stories

  return (
    <div className="bg-black border-b border-zinc-800 py-4">
      {isLoading ? (
        <StoriesPlaceholder />
      ) : (
        <div className="flex space-x-4 overflow-x-auto px-4 scrollbar-hide">
          {displayStories.map((story) => (
            <StoryItem 
              key={story.id} 
              story={story}
            />
          ))}
        </div>
      )}
    </div>
  )
}
