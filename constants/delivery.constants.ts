/**
 * Delivery and business logic constants.
 * All monetary values are in tiyn (100 tiyn = 1 KZT).
 */

export const CAFE_NAME = 'Menumaker Kitchen' as const;
export const DEFAULT_DELIVERY_FEE = 150000 as const;       // 1500 KZT
export const FREE_DELIVERY_THRESHOLD = 1000000 as const;   // 10 000 KZT
export const MINIMUM_ORDER = 300000 as const;              // 3000 KZT
export const MAX_CART_ITEMS = 99 as const;
export const TOAST_DURATION_MS = 3500 as const;

export interface PromoCode {
  code: string;
  discountPercent: number;
  description: string;
}

export const PROMO_CODES: PromoCode[] = [
  { code: 'WELCOME10',  discountPercent: 10, description: 'Скидка 10% для новых клиентов' },
  { code: 'SAVE15',     discountPercent: 15, description: 'Скидка 15% на весь заказ' },
  { code: 'MENU20',     discountPercent: 20, description: 'Скидка 20% на весь заказ' },
  { code: 'PROMO10',    discountPercent: 10, description: 'Скидка 10% на любой заказ' },
];

export const CITIES = [
  { id: 'astana',    name: 'Астана',     slug: 'astana' },
  { id: 'almaty',   name: 'Алматы',     slug: 'almaty' },
  { id: 'taraz',    name: 'Тараз',      slug: 'taraz' },
  { id: 'shymkent', name: 'Шымкент',    slug: 'shymkent' },
  { id: 'karaganda',name: 'Қарағанды', slug: 'karaganda' },
] as const;

export type City = (typeof CITIES)[number];
