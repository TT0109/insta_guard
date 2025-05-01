export interface Story {
  id: string
  username: string
  userImage: string
  viewed: boolean
  timestamp: string
  isLocked?: boolean
  isFollower?: boolean
  isFollowing?: boolean
  isCloseFriend?: boolean
}

export interface ApiResponse {
  users?: Array<{
    pk: string;
    username: string;
    profile_pic_url: string;
    full_name: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}
