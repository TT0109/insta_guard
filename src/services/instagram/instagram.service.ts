import { getImageBase64 } from "@/app/actions/imageProxyActions";
import { UserInfoResponse } from "@/interface/UserInfoResponse";
import api from "@/lib/axios/instance";

export class Instagram {
  constructor() { }

  async getUserInfo(username: string): Promise<UserInfoResponse> {
    try {
      const response = await api.post('/user/get_info', { username });
      return response.data.response.body;
    } catch (err) {
      console.error('Error fetching user info:', err);
      throw err;
    }
  }

  async getUserFollwers(userId: string, count: number = 10, maxId: string | null = null): Promise<any> {
    try {
      const response = await api.post('user/get_followers', { id: userId, count: count, max_id: null });
      return response.data.response.body;
    } catch (err) {
      console.error('Error fetching user posts:', err);
      throw err;
    }
  }

  async getFollowings(userId: string, count: number = 10, maxId: string | null = null): Promise<any> {
    try {
      const response = await api.post('user/get_following ', { id: userId, count: count, max_id: null });
      return response.data.response.body;
    } catch (err) {
      console.error('Error fetching user posts:', err);
      throw err;
    }
  }

  async getStories(userId: string): Promise<any[]> {
    console.log(userId)
    if (!userId) {
      throw new Error('User ID é obrigatório');
    }
  
    try {
      const response = await api.post('user/get_stories', {
        ids: [Number(userId)],
      });
  
      return response.data.response.body;
    } catch (err: any) {
      console.error('Erro ao buscar stories do usuário:', err?.response?.data || err.message);
      throw new Error('Erro ao buscar stories');
    }
  }

  async getPublications(userId: string): Promise<any[]> {
    if (!userId) {
      throw new Error('User ID é obrigatório');
    }
  
    try {
      const response = await api.post('user/get_media', {
        id: Number(userId),
        count: 4,
        max_id: null
      });
  
      return response.data.response.body;
    } catch (err: any) {
      console.error('Erro ao buscar publications do usuário:', err?.response?.data || err.message);
      throw new Error('Erro ao buscar publications');
    }
  }
  

  async onBlurFollowersFotos(userId: string, count: number = 10): Promise<any> {
    try {
      const data = await this.getUserFollwers(userId, count);
      const followingsData = await this.getFollowings(userId, count);
      const followers = await Promise.all(
        data.users.map((follower: any) =>
          getImageBase64(follower.profile_pic_url, true)
        )
      );

      const followings = await Promise.all(
        followingsData.users.map((following: any) =>
          getImageBase64(following.profile_pic_url, true)
        )
      );

      return { ...followers, ...followings };
    } catch (err) {
      console.error('Error fetching user posts:', err);
      throw err;
    }
  }
}