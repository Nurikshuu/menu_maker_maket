/**
 * Cart types — multi-restaurant cart.
 * A RestaurantCartEntry groups items, delivery info, and promo state
 * for a single restaurant inside the shared cart.
 */

import type { MenuItem, RestaurantCategory } from './restaurant.types';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface RestaurantCartEntry {
  restaurantId: string;
  restaurantName: string;
  restaurantSlug: string;
  restaurantCity: string;
  restaurantCategories: RestaurantCategory[];
  minimumOrder: number;
  deliveryFee: number;
  items: CartItem[];
  promoCode: string;
  discountPercent: number;
  promoDescription: string;
}
