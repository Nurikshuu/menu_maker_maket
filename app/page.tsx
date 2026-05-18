/**
 * Homepage (/) — Hero search, city picker shortcut, category chips,
 * and restaurant grid with skeleton loading state.
 */

'use client';

import { useState } from 'react';
import { useUIStore } from '@/store/ui.store';
import { useRestaurants } from '@/hooks/use-restaurant';
import { CategoryFilter } from '@/components/restaurant/CategoryFilter';
import { RestaurantCard } from '@/components/restaurant/RestaurantCard';
import { RestaurantCardSkeleton } from '@/components/restaurant/RestaurantCardSkeleton';
import type { RestaurantCategory } from '@/types/restaurant.types';
import { MapPin } from 'lucide-react';
import { CITIES } from '@/constants/delivery.constants';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<RestaurantCategory | null>(null);
  const { selectedCity, openCityModal } = useUIStore();

  const { restaurants, loadingState, error } = useRestaurants(selectedCity, activeCategory);

  const cityLabel = CITIES.find((c) => c.slug === selectedCity)?.name ?? selectedCity;
  const isLoading = loadingState === 'idle' || loadingState === 'loading';

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 px-8 py-12 text-white text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold">
          Еда в&nbsp;
          <button
            onClick={openCityModal}
            className="underline underline-offset-4 hover:opacity-80 transition-opacity inline-flex items-center gap-1"
          >
            <MapPin className="size-6" />
            {cityLabel}
          </button>
        </h1>
        <p className="text-blue-100 text-lg">
          Потому что хорошая еда не должна заставлять ждать
        </p>
      </section>

      {/* Filters */}
      <section>
        <CategoryFilter selected={activeCategory} onChange={setActiveCategory} />
      </section>

      {/* Grid */}
      <section>
        {error ? (
          <p className="text-center text-red-500 py-12">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <RestaurantCardSkeleton key={i} />
                ))
              : restaurants.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
          </div>
        )}
        {!isLoading && restaurants.length === 0 && !error && (
          <p className="text-center text-gray-400 py-16">
            Рестораны не найдены. Попробуйте другой фильтр.
          </p>
        )}
      </section>
    </main>
  );
}
