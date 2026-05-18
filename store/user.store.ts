import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '@/types/user.types';

const EMPTY_PROFILE: UserProfile = {
  name: '',
  phone: '',
  email: '',
  address: '',
};

interface UserState {
  profile: UserProfile;
  isLoggedIn: boolean;
  updateProfile: (data: Partial<UserProfile>) => void;
  login: (data: Partial<UserProfile>) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: EMPTY_PROFILE,
      isLoggedIn: false,

      updateProfile: (data) =>
        set((s) => ({ profile: { ...s.profile, ...data } })),

      login: (data) =>
        set({ isLoggedIn: true, profile: { ...EMPTY_PROFILE, ...data } }),

      logout: () =>
        set({ isLoggedIn: false, profile: EMPTY_PROFILE }),
    }),
    { name: 'user-storage' },
  ),
);
