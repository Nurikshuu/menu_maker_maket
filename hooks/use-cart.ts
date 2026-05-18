/**
 * useCart — bridge hook between components and the cart store.
 * Adds toast notifications and cart-drawer side-effects on top of raw store actions.
 */

'use client';

import { useCartStore } from '@/store/cart.store';
import { useUIStore } from '@/store/ui.store';
import type { MenuItem, Restaurant } from '@/types/restaurant.types';
import { CITIES } from '@/constants/delivery.constants';

export function useCart() {
  const cart = useCartStore();
  const { openCartDrawer, addToast } = useUIStore();

  function handleAddItem(menuItem: MenuItem, restaurant: Restaurant) {
    const result = cart.addItem(menuItem, restaurant);
    if (result && 'cityMismatch' in result) {
      const cityInCart = cart.getCityInCart();
      const cityName = CITIES.find((c) => c.slug === cityInCart)?.name ?? cityInCart;
      addToast(
        `У вас уже есть товары из ${cityName}. Очистите корзину для заказа из другого города.`,
        'error',
      );
      return;
    }
    addToast(`${menuItem.name} добавлен в корзину`, 'success');
    openCartDrawer();
  }

  function handleRemoveItem(restaurantId: string, menuItemId: string, name: string) {
    cart.removeItem(restaurantId, menuItemId);
    addToast(`${name} удалён из корзины`, 'info');
  }

  return {
    ...cart,
    handleAddItem,
    handleRemoveItem,
  };
}
