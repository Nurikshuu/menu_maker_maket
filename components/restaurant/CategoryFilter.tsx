/**
 * CategoryFilter — horizontal chip row to filter restaurants by category.
 * "Все" chip resets the filter to null.
 */

'use client';

import { RestaurantCategory, RESTAURANT_CATEGORY_LABELS } from '@/types/restaurant.types';
import { cn } from '@/lib/utils';

const ALL_CATEGORIES = Object.values(RestaurantCategory);

export interface CategoryFilterProps {
  selected: RestaurantCategory | null;
  onChange: (cat: RestaurantCategory | null) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Chip active={selected === null} onClick={() => onChange(null)}>
        Все
      </Chip>
      {ALL_CATEGORIES.map((cat) => (
        <Chip key={cat} active={selected === cat} onClick={() => onChange(cat)}>
          {RESTAURANT_CATEGORY_LABELS[cat]}
        </Chip>
      ))}
    </div>
  );
}

interface ChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap',
        active
          ? 'border-blue-600 bg-blue-600 text-white'
          : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600',
      )}
    >
      {children}
    </button>
  );
}
