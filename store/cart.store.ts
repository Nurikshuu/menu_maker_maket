/**
 * Cart store — multi-restaurant cart.
 * Each restaurant gets its own RestaurantCartEntry with independent items,
 * delivery fee, and promo code. State persisted to localStorage.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, RestaurantCartEntry } from '@/types/cart.types';
import type { MenuItem, Restaurant } from '@/types/restaurant.types';
import { PROMO_CODES, MAX_CART_ITEMS, RESTAURANT_CATEGORY_LABELS } from '@/constants/delivery.constants';

interface CartState {
  entries: Record<string, RestaurantCartEntry>;

  /** Returns city slug of restaurants currently in cart, or null if cart is empty. */
  getCityInCart: () => string | null;
  addItem: (menuItem: MenuItem, restaurant: Restaurant) => { cityMismatch: true } | void;
  removeItem: (restaurantId: string, menuItemId: string) => void;
  incrementItem: (restaurantId: string, menuItemId: string) => void;
  decrementItem: (restaurantId: string, menuItemId: string) => void;
  clearRestaurant: (restaurantId: string) => void;
  clearAll: () => void;
  applyPromoCode: (restaurantId: string, code: string) => { success: boolean; message: string };
  removePromoCode: (restaurantId: string) => void;
  /** Apply one promo code to ALL eligible restaurants in the cart at once. */
  applyPromoCodeGlobal: (code: string) => { success: boolean; message: string; appliedCount: number };
  /** Remove promo from every restaurant in the cart. */
  removePromoCodeGlobal: () => void;
  /** Returns {code, description} if any entry has a promo, else null. */
  getActiveGlobalPromo: () => { code: string; description: string } | null;

  getTotalItemCount: () => number;
  getRestaurantSubtotal: (restaurantId: string) => number;
  getRestaurantDiscount: (restaurantId: string) => number;
  getRestaurantTotal: (restaurantId: string) => number;
  getGrandTotal: () => number;
  getRestaurantEntries: () => RestaurantCartEntry[];
}

function makeEntry(restaurant: Restaurant, firstItem: CartItem): RestaurantCartEntry {
  return {
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    restaurantSlug: restaurant.slug,
    restaurantCity: restaurant.city,
    restaurantCategories: restaurant.categories,
    minimumOrder: restaurant.minimumOrder,
    deliveryFee: restaurant.deliveryFee,
    items: [firstItem],
    promoCode: '',
    discountPercent: 0,
    promoDescription: '',
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      entries: {},

      getCityInCart: () => {
        const entries = Object.values(get().entries);
        return entries.length > 0 ? entries[0].restaurantCity : null;
      },

      addItem: (menuItem, restaurant) => {
        const { entries } = get();
        const entry = entries[restaurant.id];

        // Block adding items from a different city
        const cityInCart = get().getCityInCart();
        if (cityInCart && cityInCart !== restaurant.city) {
          return { cityMismatch: true };
        }

        if (!entry) {
          set({ entries: { ...entries, [restaurant.id]: makeEntry(restaurant, { menuItem, quantity: 1 }) } });
          return;
        }

        const existingItem = entry.items.find((i) => i.menuItem.id === menuItem.id);
        const updatedItems = existingItem
          ? entry.items.map((i) =>
              i.menuItem.id === menuItem.id && i.quantity < MAX_CART_ITEMS
                ? { ...i, quantity: i.quantity + 1 }
                : i,
            )
          : [...entry.items, { menuItem, quantity: 1 }];

        set({ entries: { ...entries, [restaurant.id]: { ...entry, items: updatedItems } } });
      },

      removeItem: (restaurantId, menuItemId) => {
        const { entries } = get();
        const entry = entries[restaurantId];
        if (!entry) return;

        const nextItems = entry.items.filter((i) => i.menuItem.id !== menuItemId);
        if (nextItems.length === 0) {
          const { [restaurantId]: _removed, ...rest } = entries;
          set({ entries: rest });
        } else {
          set({ entries: { ...entries, [restaurantId]: { ...entry, items: nextItems } } });
        }
      },

      incrementItem: (restaurantId, menuItemId) => {
        const { entries } = get();
        const entry = entries[restaurantId];
        if (!entry) return;
        set({
          entries: {
            ...entries,
            [restaurantId]: {
              ...entry,
              items: entry.items.map((i) =>
                i.menuItem.id === menuItemId && i.quantity < MAX_CART_ITEMS
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            },
          },
        });
      },

      decrementItem: (restaurantId, menuItemId) => {
        const entry = get().entries[restaurantId];
        if (!entry) return;
        const item = entry.items.find((i) => i.menuItem.id === menuItemId);
        if (!item) return;
        if (item.quantity === 1) {
          get().removeItem(restaurantId, menuItemId);
          return;
        }
        const { entries } = get();
        set({
          entries: {
            ...entries,
            [restaurantId]: {
              ...entry,
              items: entry.items.map((i) =>
                i.menuItem.id === menuItemId ? { ...i, quantity: i.quantity - 1 } : i,
              ),
            },
          },
        });
      },

      clearRestaurant: (restaurantId) => {
        const { [restaurantId]: _removed, ...rest } = get().entries;
        set({ entries: rest });
      },

      clearAll: () => set({ entries: {} }),

      applyPromoCode: (restaurantId, code) => {
        const entry = get().entries[restaurantId];
        if (!entry) return { success: false, message: 'Ресторан не найден' };

        const upperCode = code.trim().toUpperCase();
        const promo = PROMO_CODES.find((p) => p.code === upperCode);
        if (!promo) return { success: false, message: 'Промокод не найден' };

        if (promo.restaurantSlug && promo.restaurantSlug !== entry.restaurantSlug) {
          return { success: false, message: 'Промокод не действует для этого ресторана' };
        }
        if (promo.category && !entry.restaurantCategories.includes(promo.category)) {
          return {
            success: false,
            message: `Промокод действует только для: ${RESTAURANT_CATEGORY_LABELS[promo.category]}`,
          };
        }

        set({
          entries: {
            ...get().entries,
            [restaurantId]: {
              ...entry,
              promoCode: upperCode,
              discountPercent: promo.discountPercent,
              promoDescription: promo.description,
            },
          },
        });
        return { success: true, message: promo.description };
      },

      removePromoCode: (restaurantId) => {
        const entry = get().entries[restaurantId];
        if (!entry) return;
        set({
          entries: {
            ...get().entries,
            [restaurantId]: { ...entry, promoCode: '', discountPercent: 0, promoDescription: '' },
          },
        });
      },

      applyPromoCodeGlobal: (code) => {
        const { entries } = get();
        const upperCode = code.trim().toUpperCase();
        const promo = PROMO_CODES.find((p) => p.code === upperCode);
        if (!promo) return { success: false, message: 'Промокод не найден', appliedCount: 0 };

        let appliedCount = 0;
        const updated: typeof entries = {};

        for (const [id, entry] of Object.entries(entries)) {
          let valid = true;
          if (promo.restaurantSlug && promo.restaurantSlug !== entry.restaurantSlug) valid = false;
          if (promo.category && !entry.restaurantCategories.includes(promo.category)) valid = false;

          if (valid) {
            updated[id] = {
              ...entry,
              promoCode: upperCode,
              discountPercent: promo.discountPercent,
              promoDescription: promo.description,
            };
            appliedCount++;
          } else {
            updated[id] = entry;
          }
        }

        if (appliedCount === 0) {
          return {
            success: false,
            message: 'Промокод не подходит ни к одному ресторану в корзине',
            appliedCount: 0,
          };
        }

        set({ entries: updated });
        const suffix =
          appliedCount === 1
            ? 'к 1 ресторану'
            : appliedCount <= 4
              ? `к ${appliedCount} ресторанам`
              : `к ${appliedCount} ресторанам`;
        return { success: true, message: `${promo.description} (применён ${suffix})`, appliedCount };
      },

      removePromoCodeGlobal: () => {
        const { entries } = get();
        const cleared: typeof entries = {};
        for (const [id, entry] of Object.entries(entries)) {
          cleared[id] = { ...entry, promoCode: '', discountPercent: 0, promoDescription: '' };
        }
        set({ entries: cleared });
      },

      getActiveGlobalPromo: () => {
        const withPromo = Object.values(get().entries).find((e) => e.promoCode);
        if (!withPromo) return null;
        return { code: withPromo.promoCode, description: withPromo.promoDescription };
      },

      getTotalItemCount: () =>
        Object.values(get().entries).reduce(
          (sum, entry) => sum + entry.items.reduce((s, i) => s + i.quantity, 0),
          0,
        ),

      getRestaurantSubtotal: (restaurantId) => {
        const entry = get().entries[restaurantId];
        if (!entry) return 0;
        return entry.items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
      },

      getRestaurantDiscount: (restaurantId) => {
        const entry = get().entries[restaurantId];
        if (!entry || entry.discountPercent === 0) return 0;
        return Math.round((get().getRestaurantSubtotal(restaurantId) * entry.discountPercent) / 100);
      },

      getRestaurantTotal: (restaurantId) => {
        const entry = get().entries[restaurantId];
        if (!entry) return 0;
        return (
          get().getRestaurantSubtotal(restaurantId) -
          get().getRestaurantDiscount(restaurantId) +
          entry.deliveryFee
        );
      },

      getGrandTotal: () =>
        Object.keys(get().entries).reduce(
          (sum, id) => sum + get().getRestaurantTotal(id),
          0,
        ),

      getRestaurantEntries: () => Object.values(get().entries),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ entries: state.entries }),
    },
  ),
);
