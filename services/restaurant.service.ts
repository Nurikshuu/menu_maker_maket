/**
 * Restaurant service — all HTTP calls (or mock data) related to restaurants.
 * No state, no UI logic — only data fetching.
 */

import type { Restaurant, RestaurantWithMenu, RestaurantCategory } from '@/types/restaurant.types';
import { MOCK_RESTAURANTS, MOCK_RESTAURANTS_WITH_MENU } from './mock-data';

const ARTIFICIAL_DELAY_MS = 400;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface GetRestaurantsParams {
  city?: string;
  category?: RestaurantCategory | null;
}

export async function getRestaurants(params: GetRestaurantsParams): Promise<Restaurant[]> {
  await delay(ARTIFICIAL_DELAY_MS);

  let results = MOCK_RESTAURANTS;

  if (params.city) {
    results = results.filter((r) => r.city === params.city);
  }

  if (params.category) {
    results = results.filter((r) => r.categories.includes(params.category!));
  }

  return results;
}

export async function getRestaurantBySlug(slug: string): Promise<RestaurantWithMenu | null> {
  await delay(ARTIFICIAL_DELAY_MS);
  return MOCK_RESTAURANTS_WITH_MENU[slug] ?? null;
}
