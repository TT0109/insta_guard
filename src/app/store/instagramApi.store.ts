// stores/userStore.ts
import { create } from 'zustand'
import useInstagramStore from './instagram.store';
import axios from "axios";
import { Instagram } from "@/services/instagram/instagram.service";
import { UserInfoResponse, InstagramUser } from "@/interface/UserInfoResponse";
const instagram = new Instagram();

// Using the InstagramUser type imported from the interface
type User = InstagramUser;

type Follower = {
  id: string;
  username: string;
  full_name: string;
  profile_pic_url: string;
  [key: string]: any;
};

type UserStore = {
  user: User | null;
  followers: any;
  followings: any;
  setUser: (user: User) => void;
  clearUser: () => void;
  setFollowers: (followers: Follower[]) => void;
  setFollowings: (followings: Follower[]) => void;
  getUserInfo: (username: string) => Promise<UserInfoResponse>;
  getFollowers: (userId: string, count?: number, maxId?: string | null) => Promise<Follower[]>;
  getFollowings: (userId: string, count?: number, maxId?: string | null) => Promise<Follower[]>;
  getStories: (userId: string, count?: number, maxId?: string | null) => Promise<any>;
  stories: any;
  publications: any;
  getPublications: (userId: string, count?: number, maxId?: string | null) => Promise<any[]>;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  followers: [],
  followings: [],
  stories: [], 
  publications: [],
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null, followers: [], followings: [] }),
  setFollowers: (followers) => set({ followers }),
  setFollowings: (followings) => set({ followings }),

  getUserInfo: async (username: string) => {
    try {
      const userInfoResponse = await instagram.getUserInfo(username);
      // Extract the user from the response and set it in the store
      if (userInfoResponse && userInfoResponse.data && userInfoResponse.data.user) {
        set({ user: userInfoResponse.data.user });
      }
      return userInfoResponse;
    } catch (err) {
      console.error('Error fetching user info:', err);
      throw err;
    }
  },
  
  getFollowers: async (userId, count = 10, maxId = null) => {
    try {
      const response = await instagram.getUserFollwers(userId, count, maxId);
      set({ followers: response });
      console.log(response)
      return response;
    } catch (err) {
      console.error("Error fetching user followers:", err);
      throw err;
    }
  },

  getFollowings: async (userId, count = 10, maxId = null) => {
    try {
      const response = await instagram.getFollowings(userId, count, maxId);
      set({ followings: response});
      console.log(response)
      return response;
    } catch (err) {
      console.error("Error fetching user followings:", err);
      throw err;
    }
  },

  getStories: async (userId, count = 10, maxId = null) => {
    try {
      const response = await instagram.getStories(userId);
      set({ stories: response });
      return response;
    } catch (err) {
      console.error("Error fetching user stories:", err);
      throw err;
    }
  },

  getPublications: async (userId, count = 10, maxId = null) => {
    try {
      const response = await instagram.getPublications(userId);
      set({ publications: response });
      return response;
    } catch (err) {
      console.error("Error fetching user publications:", err);
      throw err;
    }
  },
}));
