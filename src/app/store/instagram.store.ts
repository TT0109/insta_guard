import { create } from 'zustand';
import { getUserLocation } from '../services/location.service';

interface InstagramState {
  username: string;
  profileImage: string;
  posts: Post[];
  stories: Story[];
  hasNewNotifications: boolean;
  hasNewMessages: boolean;
  setUsername: (username: string) => Promise<void>;
  setProfileImage: (image: string) => void;
  addPost: (post: Post) => void;
  viewStory: (storyId: string) => void;
  toggleLike: (postId: string) => void;
  updateStories: (stories: Story[]) => void;
  getImageBase64: (imageUrl: string) => Promise<string>;
  getPostsWithCurrentUsername: () => Promise<Post[]>;
  init: () => Promise<void>;
}

export interface Post {
  id: string;
  username: string;
  userImage: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  isLiked: boolean;
  isSaved: boolean;
  location?: string;
}

export interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  isHotComment?: boolean;
}

export interface Story {
  id: string;
  username: string;
  userImage: string;
  viewed: boolean;
  timestamp: string;
  isLocked?: boolean;
  isFollower?: boolean;
  isFollowing?: boolean;
}

const useInstagramStore = create<InstagramState>((set, get) => {
  // Base posts data without dynamic username
  const basePosts = [
    {
      id: '0',
      username: 'cr*****',
      userImage: 'https://i.pravatar.cc/150?img=3',
      imageUrl: '',
      caption: 'Conteúdo restrito',
      likes: 89,
      comments: [
        { id: '13', username: 'ev****', text: 'Você está linda demais...', timestamp: '3h' },
        { id: '14', username: 'USER_COMMENT', text: 'Adorei nosso último encontro secreto 🔥💋', timestamp: '2h', isHotComment: true },
        { id: '15', username: 'pe****92', text: 'Isso é muito bom!', timestamp: '1h' }
      ],
      timestamp: '18/03/2023 - 11:00',
      isLiked: true,
      isSaved: true,
      location: 'Local ocultado'
    },
    {
      id: '1',
      username: 'jul*****',
      userImage: 'https://i.pravatar.cc/150?img=1',
      imageUrl: '',
      caption: 'Local ocultado',
      likes: 153,
      comments: [
        { id: '1', username: 'san***', text: 'Texto oculto do primeiro comentário...', timestamp: '2h' },
        { id: '2', username: 'jo***_r', text: 'Texto oculto do segundo comentário...', timestamp: '1h' },
        { id: '3', username: 'USER_COMMENT', text: 'Vamos conversar em particular... 🔥😈', timestamp: '30m', isHotComment: true },
        { id: '10', username: 'USER_COMMENT', text: 'Olha o que te enviei no privado 😝😳', timestamp: '15m', isHotComment: true }
      ],
      timestamp: '17/03/2023 - 23:48',
      isLiked: false,
      isSaved: false,
      location: 'Local ocultado'
    },
    {
      id: '2',
      username: 'mar***_oficial',
      userImage: 'https://i.pravatar.cc/150?img=5',
      imageUrl: '',
      caption: 'Conteúdo exclusivo',
      likes: 278,
      comments: [
        { id: '4', username: 'ana***', text: 'Incrível!', timestamp: '1h' },
        { id: '5', username: 'pedro_***', text: 'Quero participar!', timestamp: '45m' },
        { id: '11', username: 'USER_COMMENT', text: 'Podemos marcar algo mais íntimo? 😏👉👈', timestamp: '20m', isHotComment: true }
      ],
      timestamp: '16/03/2023 - 18:30',
      isLiked: false,
      isSaved: false,
      location: 'São Paulo, Brasil'
    },
    {
      id: '3',
      username: 'sor***_vip',
      userImage: 'https://i.pravatar.cc/150?img=8',
      imageUrl: '',
      caption: 'Novo sorteio em breve',
      likes: 421,
      comments: [
        { id: '6', username: 'carlos_***', text: 'Quando começa?', timestamp: '3h' },
        { id: '7', username: 'USER_COMMENT', text: 'Quero participar!', timestamp: '2h' }
      ],
      timestamp: '15/03/2023 - 14:15',
      isLiked: true,
      isSaved: false,
      location: 'Rio de Janeiro, Brasil'
    },
    {
      id: '4',
      username: 'pro***_oficial',
      userImage: 'https://i.pravatar.cc/150?img=12',
      imageUrl: '',
      caption: 'Conteúdo exclusivo para membros',
      likes: 189,
      comments: [
        { id: '8', username: 'lucia_***', text: 'Como faço para participar?', timestamp: '5h' },
        { id: '9', username: 'roberto***', text: 'Incrível iniciativa!', timestamp: '4h' },
        { id: '12', username: 'USER_COMMENT', text: 'Quero te mostrar algo especial hoje 😉🍆', timestamp: '1h', isHotComment: true }
      ],
      timestamp: '14/03/2023 - 09:22',
      isLiked: false,
      isSaved: true,
      location: 'Belo Horizonte, Brasil'
    }
  ];
  
  return {
  username: '',
  profileImage: 'default-profile.jpg',
  
  // Getter for posts that dynamically updates usernames in comments and locations
  getPostsWithCurrentUsername: async () => {
    const currentUsername = get().username; // Fallback username if empty
    
    // Get user's current location based on IP
    let userLocation = 'sua cidade';
    try {
      userLocation = await getUserLocation();
    } catch (error) {
      console.error('Erro ao buscar cidade por IP:', error);
    }
    
    return basePosts.map(post => ({
      ...post,
      // Update location to user's actual location
      location: userLocation,
      comments: post.comments.map(comment => 
        // Replace any comment with username 'USER_COMMENT' with the current username
        comment.username === 'USER_COMMENT'
          ? { ...comment, username: currentUsername }
          : comment
      )
    }));
  },
  
  // Use the getter function to get posts with current username and location
  posts: basePosts.map(post => ({
    ...post,
    location: 'sua cidade' // Default location until async location is loaded
  })),
  
  // Initialize posts with user location when the store is created
  init: async () => {
    try {
      const postsWithLocation = await get().getPostsWithCurrentUsername();
      set({ posts: postsWithLocation });
    } catch (error) {
      console.error('Error initializing posts with location:', error);
    }
  },
  
  stories: [
    { id: '1', username: 'user1', userImage: 'https://i.pravatar.cc/150?img=1', viewed: false, timestamp: '2h' },
    { id: '2', username: 'user2', userImage: 'https://i.pravatar.cc/150?img=2', viewed: true, timestamp: '4h' },
    { id: '3', username: 'user3', userImage: 'https://i.pravatar.cc/150?img=3', viewed: false, timestamp: '6h' },
    { id: '4', username: 'user4', userImage: 'https://i.pravatar.cc/150?img=4', viewed: false, timestamp: '8h' },
    { id: '5', username: 'user5', userImage: 'https://i.pravatar.cc/150?img=5', viewed: true, timestamp: '10h' }
  ],
  hasNewNotifications: true,
  hasNewMessages: true,
  setUsername: async (username) => {
    set({ username });
    // Update posts with new username and location
    try {
      const updatedPosts = await get().getPostsWithCurrentUsername();
      set({ posts: updatedPosts });
    } catch (error) {
      console.error('Error updating posts after username change:', error);
      // Force a re-render by updating a reference even if location fetch fails
      set(state => ({ posts: [...state.posts] }));
    }
  },
  setProfileImage: (image) => set({ profileImage: image }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  viewStory: (storyId) => set((state) => ({
    stories: state.stories.map(story => 
      story.id === storyId ? { ...story, viewed: true } : story
    )
  })),
  toggleLike: (postId) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 } 
        : post
    )
  })),
  
  updateStories: (stories) => set({ stories }),
  
  // Função para converter uma URL de imagem para base64
  getImageBase64: async (imageUrl) => {
    try {
      // Verificar se a URL já é base64
      if (imageUrl && imageUrl.startsWith('data:image')) {
        return imageUrl;
      }
      
      // Fazer a requisição para obter a imagem
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Converter o blob para base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Erro ao converter imagem para base64:', error);
      // Retornar a URL original em caso de erro
      return imageUrl;
    }
  }
}});

export default useInstagramStore;
