/**
 * Application route constants and typed route builder functions.
 */

export const ROUTES = {
  HOME: '/',
  CITY: (city: string) => `/${city}`,
  RESTAURANT: (slug: string) => `/r/${slug}`,
  CHECKOUT: '/checkout',
  ORDER: (id: string) => `/order/${id}`,
  TABLE: (slug: string, tableNumber: string | number) => `/table/${slug}/${tableNumber}`,
  ACCOUNT: '/account',
  ACCOUNT_HISTORY: '/account/history',
  ACCOUNT_FRIENDS: '/account/friends',
  ACCOUNT_SUPPORT: '/account/support',
  ACCOUNT_SETTINGS: '/account/settings',
} as const;
