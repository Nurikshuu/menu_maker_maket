/**
 * City page (/[city]) — same layout as homepage but pre-filtered by city.
 * Redirects home if city slug is unknown.
 */

export async function generateStaticParams() {
  return [];
}

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUIStore } from '@/store/ui.store';
import { useRestaurants } from '@/hooks/use-restaurant';
import { CategoryFilter } from '@/components/restaurant/CategoryFilter';
import { RestaurantCard } from '@/components/restaurant/RestaurantCard';
import { RestaurantCardSkeleton } from '@/components/restaurant/RestaurantCardSkeleton';
import type { RestaurantCategory } from '@/types/restaurant.types';
import { CITIES } from '@/constants/delivery.constants';

export default function CityPage() {
  const params = useParams<{ city: string }>();
  const city = params.city;
  const [activeCategory, setActiveCategory] = useState<RestaurantCategory | null>(null);
  const { setSelectedCity } = useUIStore();

  const cityData = CITIES.find((c) => c.slug === city);

  useEffect(() => {
    if (cityData) setSelectedCity(cityData.slug);
  }, [cityData, setSelectedCity]);

  const { restaurants, loadingState, error } = useRestaurants(city, activeCategory);
  const isLoading = loadingState === 'idle' || loadingState === 'loading';

  if (!cityData) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Город не найден</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-extrabold text-gray-900">
        Доставка еды в городе <span className="text-blue-600">{cityData.name}</span>
      </h1>

      <CategoryFilter selected={activeCategory} onChange={setActiveCategory} />

      {error ? (
        <p className="text-center text-red-500 py-12">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <RestaurantCardSkeleton key={i} />)
            : restaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      )}
    </main>
  );
}
