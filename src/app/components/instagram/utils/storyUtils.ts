import { ApiResponse, Story } from '../types/Story';
import { getImageBase64 } from '@/app/actions/imageProxyActions';

/**
 * Função auxiliar para obter itens aleatórios de um array
 */
export const getRandomItems = async (array: any[], count: number) => {
  if (!array || array.length === 0) return [];
  if (array.length <= count) return array;

  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Cria stories a partir dos dados de seguidores e seguidos
 */
export const createStoriesFromFollowers = async (
  followersData: ApiResponse,
  followingsData: ApiResponse,
  profileImage: string
): Promise<Story[]> => {
  // Criar stories mesmo se não houver seguidores ou seguidos
  const hasFollowers = followersData?.users && Array.isArray(followersData.users) && followersData.users.length > 0;
  const hasFollowings = followingsData?.users && Array.isArray(followingsData.users) && followingsData.users.length > 0;

  // Se não tiver seguidores ou seguidos, todos os stories serão bloqueados
  const allLocked = !hasFollowers && !hasFollowings;
  console.log('Todos os stories bloqueados:', allLocked);

  try {
    // Criar um mapa com todos os usuários (seguidores e seguidos)
    const allUsersMap = new Map();

    // Adicionar seguidores ao mapa
    if (followersData?.users && Array.isArray(followersData.users) && followersData.users.length > 0) {
      followersData.users.forEach(user => {
        if (user && user.pk && user.username) {
          allUsersMap.set(user.pk, {
            ...user,
            isFollower: true
          });
        }
      });
    }

    // Adicionar seguidos ao mapa
    if (followingsData?.users && Array.isArray(followingsData.users) && followingsData.users.length > 0) {
      followingsData.users.forEach(user => {
        if (user && user.pk && user.username) {
          if (allUsersMap.has(user.pk)) {
            // Se já existe como seguidor, marcar também como seguido
            const existingUser = allUsersMap.get(user.pk);
            allUsersMap.set(user.pk, {
              ...existingUser,
              isFollowing: true
            });
          } else {
            // Se não existe, adicionar como seguido
            allUsersMap.set(user.pk, {
              ...user,
              isFollowing: true
            });
          }
        }
      });
    }

    // Processar usuários e criar stories
    // Converter o mapa para array
    const usersArray = Array.from(allUsersMap.values());

    // Limitar a quantidade de usuários para não sobrecarregar a interface
    const maxUsers = 20;
    const limitedUsersArray = usersArray.length > maxUsers ?
      usersArray.slice(0, maxUsers) :
      usersArray;

    // Criar stories a partir dos usuários
    const newStories: Story[] = [];

    // Adicionar o story do próprio usuário
    newStories.push({
      id: 'self',
      username: 'Seu story',
      userImage: profileImage,
      viewed: false,
      timestamp: new Date().toISOString()
    });

    // Processar usuários reais usando Promise.all para lidar corretamente com operações assíncronas
    const userStories = await Promise.all(
      limitedUsersArray.map(async (user, index) => {
        // Determinar se o story deve ser bloqueado
        // Stories são bloqueados se o usuário não é seguidor nem seguido,
        // ou aleatoriamente para alguns usuários (mesmo sendo seguidor/seguido)
        const isLocked = allLocked || 
          (!user.isFollower && !user.isFollowing) || 
          (Math.random() < 0.3); // 30% de chance de ser bloqueado mesmo sendo seguidor/seguido
        
        // Determinar se o story já foi visualizado (aleatório)
        const viewed = Math.random() < 0.5;
        
        // Determinar se é amigo próximo (aleatório, apenas para não bloqueados)
        const isCloseFriend = !isLocked && Math.random() < 0.2;
        
        return {
          id: user.pk || `user-${index}`,
          username: isLocked ? 
            // Se bloqueado, mostrar apenas as primeiras letras do username
            `${user.username.substring(0, 3)}***` : 
            user.username,
          userImage: await getImageBase64(user.profile_pic_url),
          viewed,
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString(),
          isLocked,
          isFollower: user.isFollower,
          isFollowing: user.isFollowing,
          isCloseFriend
        };
      })
    );
    
    // Adicionar os stories dos usuários ao array de stories
    newStories.push(...userStories);

    // Adicionar alguns stories bloqueados fictícios para completar
    if (newStories.length < 10) {
      const additionalCount = 10 - newStories.length;
      for (let i = 0; i < additionalCount; i++) {
        newStories.push({
          id: `locked-${i}`,
          username: `user${i}***`,
          userImage: `https://i.pravatar.cc/150?img=${50 + i}`,
          viewed: Math.random() < 0.5,
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString(),
          isLocked: true
        });
      }
    }

    return newStories;
  } catch (error) {
    console.error('Erro ao processar stories:', error);
    return [];
  }
};

/**
 * Retorna uma lista de stories padrão para quando não há dados carregados
 */
export const getDefaultStories = (profileImage: string): Story[] => {
  return [
    { id: 'self', username: 'Seu story', userImage: profileImage || 'https://i.pravatar.cc/150?img=1', viewed: false, isLocked: true, timestamp: new Date().toISOString() },
    { id: 'default-1', username: 'maria_silva', userImage: 'https://i.pravatar.cc/150?img=5', viewed: false, isLocked: true, timestamp: new Date().toISOString() },
    { id: 'default-2', username: 'joao_123', userImage: 'https://i.pravatar.cc/150?img=8', viewed: false, isLocked: true, timestamp: new Date().toISOString() },
    { id: 'default-3', username: 'ana.costa', userImage: 'https://i.pravatar.cc/150?img=13', viewed: true, isLocked: true, timestamp: new Date().toISOString() },
    { id: 'default-4', username: 'pedro.santos', userImage: 'https://i.pravatar.cc/150?img=17', viewed: true, isLocked: true, timestamp: new Date().toISOString() },
    { id: 'default-5', username: 'jul***', userImage: 'https://i.pravatar.cc/150?img=23', viewed: false, isLocked: true, timestamp: new Date().toISOString() },
    { id: 'default-6', username: 'car***', userImage: 'https://i.pravatar.cc/150?img=28', viewed: true, isLocked: true, timestamp: new Date().toISOString() },
    { id: 'default-7', username: 'mar***', userImage: 'https://i.pravatar.cc/150?img=32', viewed: false, isLocked: true, timestamp: new Date().toISOString() },
  ];
};
