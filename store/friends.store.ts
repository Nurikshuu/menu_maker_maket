import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Friend {
  id: string;
  name: string;
  phone: string;
  addedAt: string;
}

interface FriendsState {
  friends: Friend[];
  addFriend: (name: string, phone: string) => { exists: boolean };
  removeFriend: (id: string) => void;
}

export const useFriendsStore = create<FriendsState>()(
  persist(
    (set, get) => ({
      friends: [],

      addFriend: (name, phone) => {
        const exists = get().friends.some((f) => f.phone === phone.trim());
        if (exists) return { exists: true };
        const friend: Friend = {
          id: `friend-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: name.trim(),
          phone: phone.trim(),
          addedAt: new Date().toISOString(),
        };
        set((s) => ({ friends: [...s.friends, friend] }));
        return { exists: false };
      },

      removeFriend: (id) =>
        set((s) => ({ friends: s.friends.filter((f) => f.id !== id) })),
    }),
    { name: 'friends-storage' },
  ),
);
