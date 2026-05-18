/**
 * UI store — manages transient UI state: cart drawer open/closed,
 * city selection modal, toast queue, and active city filter.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ToastMessage } from '@/types/common.types';
import { TOAST_DURATION_MS } from '@/constants/delivery.constants';

interface UIState {
  isCartDrawerOpen: boolean;
  isCityModalOpen: boolean;
  isAccountDrawerOpen: boolean;
  theme: 'light' | 'dark';
  selectedCity: string;
  toasts: ToastMessage[];

  // Actions
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  openCityModal: () => void;
  closeCityModal: () => void;
  openAccountDrawer: () => void;
  closeAccountDrawer: () => void;
  toggleTheme: () => void;
  setSelectedCity: (city: string) => void;
  addToast: (message: string, type: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

let toastIdCounter = 0;

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      isCartDrawerOpen: false,
      isCityModalOpen: false,
      isAccountDrawerOpen: false,
      theme: 'light' as const,
      selectedCity: 'moscow',
      toasts: [],

      openCartDrawer: () => set({ isCartDrawerOpen: true }),
      closeCartDrawer: () => set({ isCartDrawerOpen: false }),
      toggleCartDrawer: () =>
        set((s) => ({ isCartDrawerOpen: !s.isCartDrawerOpen })),

      openCityModal: () => set({ isCityModalOpen: true }),
      closeCityModal: () => set({ isCityModalOpen: false }),

      openAccountDrawer: () => set({ isAccountDrawerOpen: true }),
      closeAccountDrawer: () => set({ isAccountDrawerOpen: false }),

      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),

      setSelectedCity: (city) => {
        set({ selectedCity: city, isCityModalOpen: false });
      },

      addToast: (message, type) => {
        const id = String(++toastIdCounter);
        set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
        setTimeout(() => get().removeToast(id), TOAST_DURATION_MS);
      },

      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ selectedCity: state.selectedCity, theme: state.theme }),
    },
  ),
);
