export interface User {
    _id: string;
    name: string;
    email: string;
    friends: string[]; // Array of friend IDs
    friendRequests: string[]; // Array of friend request IDs
    createdAt: Date;
  }
  
  export interface FriendRecommendation {
    _id: string;
    name: string;
    email: string;
    mutualFriendsCount: number;
    mutualFriends: {
      _id: string;
      name: string;
      email: string;
    }[];
  }
  
  export interface FriendRequest {
    _id: string;
    name: string;
    email: string;
  }