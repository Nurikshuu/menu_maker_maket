/**
 * RestaurantCard — displays a restaurant in the grid: image, name,
 * rating, delivery time, fee, categories, and open/closed state.
 */

import Link from 'next/link';
import { Star, Clock, Bike } from 'lucide-react';
import type { Restaurant } from '@/types/restaurant.types';
import { RESTAURANT_CATEGORY_LABELS } from '@/types/restaurant.types';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDeliveryTime, formatRating, formatDeliveryFee } from '@/utils/format-price';
import { ROUTES } from '@/constants/routes.constants';

export interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const {
    slug, name, imageUrl, rating, reviewCount,
    deliveryTime, deliveryFee, minimumOrder,
    categories, isOpen, promoText,
  } = restaurant;

  return (
    <Link href={ROUTES.RESTAURANT(slug)} className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {!isOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="rounded-lg bg-white/90 px-3 py-1 text-sm font-semibold text-gray-700">
              Закрыто
            </span>
          </div>
        )}
        {promoText && isOpen && (
          <div className="absolute top-2 left-2">
            <Badge variant="default">{promoText}</Badge>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 truncate">{name}</h3>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1 text-yellow-500 font-medium">
            <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
            {formatRating(rating)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {formatDeliveryTime(deliveryTime)}
          </span>
          <span className="flex items-center gap-1">
            <Bike className="size-3.5" />
            {formatDeliveryFee(deliveryFee)}
          </span>
        </div>

        {/* Min order */}
        <p className="text-xs text-gray-400">
          Мин. заказ: {formatPrice(minimumOrder)}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {categories.slice(0, 3).map((cat) => (
            <Badge key={cat} variant="secondary" className="text-[10px]">
              {RESTAURANT_CATEGORY_LABELS[cat]}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
