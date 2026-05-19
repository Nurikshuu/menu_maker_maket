/**
 * useCart — bridge hook between components and the cart store.
 * Adds toast notifications and cart-drawer side-effects on top of raw store actions.
 */

'use client';

import { useCartStore } from '@/store/cart.store';
import { useUIStore } from '@/store/ui.store';
import type { MenuItem } from '@/types/restaurant.types';

export function useCart() {
  const cart = useCartStore();
  const { openCartDrawer, addToast } = useUIStore();

  function handleAddItem(menuItem: MenuItem) {
    cart.addItem(menuItem);
    addToast(`${menuItem.name} добавлен в корзину`, 'success');
    openCartDrawer();
  }

  function handleRemoveItem(menuItemId: string, name: string) {
    cart.removeItem(menuItemId);
    addToast(`${name} удалён из корзины`, 'info');
  }

  return {
    ...cart,
    handleAddItem,
    handleRemoveItem,
  };
}
