/**
 * useRestaurant — fetches restaurant list for a city+category combo.
 * Manages local loading/error state; delegates API call to the service.
 */

'use client';

import { useState, useEffect } from 'react';
import type { Restaurant, RestaurantCategory } from '@/types/restaurant.types';
import type { LoadingState } from '@/types/common.types';
import { getRestaurants } from '@/services/restaurant.service';

interface UseRestaurantsResult {
  restaurants: Restaurant[];
  loadingState: LoadingState;
  error: string | null;
  refetch: () => void;
}

export function useRestaurants(
  city: string,
  category: RestaurantCategory | null,
): UseRestaurantsResult {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  async function fetchRestaurants() {
    setLoadingState('loading');
    setError(null);
    try {
      const data = await getRestaurants({ city, category });
      setRestaurants(data);
      setLoadingState('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка загрузки ресторанов';
      setError(message);
      setLoadingState('error');
    }
  }

  useEffect(() => {
    fetchRestaurants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, category]);

  return { restaurants, loadingState, error, refetch: fetchRestaurants };
}
