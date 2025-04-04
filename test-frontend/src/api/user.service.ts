import api from './axios';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  nickname?: string;
  avatar?: string;
  status?: string;
  bio?: string;
  createdAt: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  nickname?: string;
  avatar?: string;
  status?: string;
  bio?: string;
}

export const userService = {
  getUserById: async (userId: string): Promise<User> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId: string, data: UpdateUserRequest): Promise<User> => {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  },

  searchUsers: async (query: string, limit = 10, offset = 0): Promise<User[]> => {
    const response = await api.get(`/users/search?query=${query}&limit=${limit}&offset=${offset}`);
    return response.data;
  }
}; 