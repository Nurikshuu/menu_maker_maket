/**
 * Cart store вЂ” single-network flat cart.
 * No per-restaurant grouping: all items share one promo and one delivery fee.
 * State is persisted to localStorage.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types/cart.types';
import type { MenuItem } from '@/types/restaurant.types';
import {
  PROMO_CODES,
  MAX_CART_ITEMS,
  DEFAULT_DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
} from '@/constants/delivery.constants';

interface CartState {
  items: CartItem[];
  promoCode: string;
  discountPercent: number;
  promoDescription: string;

  addItem: (menuItem: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  incrementItem: (menuItemId: string) => void;
  decrementItem: (menuItemId: string) => void;
  clearAll: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  getTotalItemCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: '',
      discountPercent: 0,
      promoDescription: '',

      addItem: (menuItem) => {
        const { items } = get();
        const existing = items.find((i) => i.menuItem.id === menuItem.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.menuItem.id === menuItem.id && i.quantity < MAX_CART_ITEMS
                ? { ...i, quantity: i.quantity + 1 }
                : i,
            ),
          });
        } else {
          set({ items: [...items, { menuItem, quantity: 1 }] });
        }
      },

      removeItem: (menuItemId) => {
        set({ items: get().items.filter((i) => i.menuItem.id !== menuItemId) });
      },

      incrementItem: (menuItemId) => {
        set({
          items: get().items.map((i) =>
            i.menuItem.id === menuItemId && i.quantity < MAX_CART_ITEMS
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        });
      },

      decrementItem: (menuItemId) => {
        const item = get().items.find((i) => i.menuItem.id === menuItemId);
        if (!item) return;
        if (item.quantity === 1) {
          get().removeItem(menuItemId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.menuItem.id === menuItemId ? { ...i, quantity: i.quantity - 1 } : i,
          ),
        });
      },

      clearAll: () =>
        set({ items: [], promoCode: '', discountPercent: 0, promoDescription: '' }),

      applyPromoCode: (code) => {
        const upperCode = code.trim().toUpperCase();
        const promo = PROMO_CODES.find((p) => p.code === upperCode);
        if (!promo) return { success: false, message: 'РџСЂРѕРјРѕРєРѕРґ РЅРµ РЅР°Р№РґРµРЅ' };
        set({
          promoCode: upperCode,
          discountPercent: promo.discountPercent,
          promoDescription: promo.description,
        });
        return { success: true, message: promo.description };
      },

      removePromoCode: () =>
        set({ promoCode: '', discountPercent: 0, promoDescription: '' }),

      getTotalItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0),

      getDiscount: () => {
        const { discountPercent } = get();
        if (discountPercent === 0) return 0;
        return Math.round((get().getSubtotal() * discountPercent) / 100);
      },

      getDeliveryFee: () =>
        get().getSubtotal() >= FREE_DELIVERY_THRESHOLD ? 0 : DEFAULT_DELIVERY_FEE,

      getTotal: () =>
        get().getSubtotal() - get().getDiscount() + get().getDeliveryFee(),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        promoCode: state.promoCode,
        discountPercent: state.discountPercent,
        promoDescription: state.promoDescription,
      }),
    },
  ),
);
