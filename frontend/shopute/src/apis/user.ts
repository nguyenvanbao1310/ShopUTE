import { api } from './base';
import { Profile } from '../types/user';
export const userApi = {
  getProfile: async (): Promise<Profile> => {
    const { data } = await api.get<Profile>('/users/profile');
    return data;
  },

  updateProfile: async (profileData: Partial<Profile>): Promise<Profile> => {
    const { data } = await api.put<Profile>('users/profile/updateInfor', profileData);
    return data;
  },

  changePassword: async (passwordData: { oldPassword: string; newPassword: string }) => {
    const { data } = await api.put('users/profile/changePassword', passwordData);
    return data;
  },
};
