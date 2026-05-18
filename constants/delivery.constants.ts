/**
 * Delivery and business logic constants.
 * All monetary values are in tiyn (100 tiyn = 1 KZT).
 */

import { RestaurantCategory, RESTAURANT_CATEGORY_LABELS } from '@/types/restaurant.types';

export const DEFAULT_DELIVERY_FEE = 150000 as const;       // 1500 KZT
export const FREE_DELIVERY_THRESHOLD = 1000000 as const;   // 10 000 KZT
export const MAX_CART_ITEMS = 99 as const;
export const TOAST_DURATION_MS = 3500 as const;

export interface PromoCode {
  code: string;
  discountPercent: number;
  /** If set, promo is valid only for this restaurant slug */
  restaurantSlug?: string;
  /** If set, promo is valid only for restaurants in this category */
  category?: RestaurantCategory;
  description: string;
}

/**
 * Available promo codes.
 * Category/restaurant-specific codes are validated against the cart entry
 * at apply time in the store.
 */
export const PROMO_CODES: PromoCode[] = [
  { code: 'ALMATY15',    discountPercent: 15, description: 'Скидка 15% на весь заказ' },
  { code: 'WELCOME10',   discountPercent: 10, description: 'Скидка 10% для новых клиентов' },
  { code: 'ASTANA20',    discountPercent: 20, description: 'Скидка 20% для Астаны' },
  { code: 'BURGER10',    discountPercent: 10, category: RestaurantCategory.Burgers,  description: 'Скидка 10% на бургеры' },
  { code: 'SUSHI20',     discountPercent: 20, category: RestaurantCategory.Sushi,    description: 'Скидка 20% на суши' },
  { code: 'PIZZA15',     discountPercent: 15, category: RestaurantCategory.Pizza,    description: 'Скидка 15% на пиццу' },
  { code: 'LAGMAN10',    discountPercent: 10, restaurantSlug: 'lagman-house',         description: 'Скидка 10% в Lagman House' },
  { code: 'KHINKALI10', discountPercent: 10, restaurantSlug: 'khinkali-house',       description: 'Скидка 10% в Хинкали House' },
];

// Re-export label map for use inside this module (needed by store validation)
export { RESTAURANT_CATEGORY_LABELS };

export const CITIES = [
  { id: 'astana',    name: 'Астана',     slug: 'astana' },
  { id: 'almaty',   name: 'Алматы',     slug: 'almaty' },
  { id: 'taraz',    name: 'Тараз',      slug: 'taraz' },
  { id: 'shymkent', name: 'Шымкент',    slug: 'shymkent' },
  { id: 'karaganda',name: 'Қарағанды', slug: 'karaganda' },
] as const;

export type City = (typeof CITIES)[number];
