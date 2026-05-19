/**
 * Cart domain types.
 * Single-network flat cart — no per-restaurant grouping.
 * All monetary values are in tiyn (100 tiyn = 1 KZT).
 */

import type { MenuItem } from './restaurant.types';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}
