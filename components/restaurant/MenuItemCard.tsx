/**
 * MenuItemCard — displays a single menu item with image, name,
 * description, weight, calories, price, and add-to-cart button.
 */

'use client';

import { memo, useState } from 'react';
import { Plus, Check } from 'lucide-react';
import type { MenuItem, Restaurant } from '@/types/restaurant.types';
import { formatPrice } from '@/utils/format-price';
import { useCart } from '@/hooks/use-cart';
import { useCartStore } from '@/store/cart.store';
import { cn } from '@/lib/utils';

export interface MenuItemCardProps {
  item: MenuItem;
  restaurant: Restaurant;
  /** Override the default add-to-cart action (used for table/dine-in mode). */
  onAdd?: (item: MenuItem) => void;
  /** Override the displayed quantity (used for table/dine-in mode). */
  addedQuantity?: number;
}

const FLASH_DURATION_MS = 600;

export const MenuItemCard = memo(function MenuItemCard({ item, restaurant, onAdd, addedQuantity }: MenuItemCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const { handleAddItem } = useCart();
  // Subscribe directly to flat cart items for this item's quantity
  const cartQuantity = useCartStore((s) => s.items.find((i) => i.menuItem.id === item.id)?.quantity ?? 0);

  function handleAdd() {
    if (onAdd) {
      onAdd(item);
    } else {
      handleAddItem(item);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), FLASH_DURATION_MS);
  }

  const displayQuantity =
    addedQuantity !== undefined
      ? addedQuantity
      : cartQuantity;

  if (!item.isAvailable) return null;

  return (
    <div className="flex gap-3 rounded-xl bg-white p-3 shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="size-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col min-w-0">
        <p className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</p>
        <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{item.description}</p>
        <div className="flex gap-2 mt-1 text-[11px] text-gray-400">
          {item.weight && <span>{item.weight}</span>}
          {item.calories && <span>· {item.calories} ккал</span>}
        </div>

        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <span className="font-bold text-gray-900 text-sm">{formatPrice(item.price)}</span>
          <button
            onClick={handleAdd}
            className={cn(
              'flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all active:scale-95',
              isAdded
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700',
            )}
            aria-label={`Добавить ${item.name}`}
          >
            {isAdded ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
            {displayQuantity > 0 && !isAdded ? (
              <span>{displayQuantity}</span>
            ) : (
              <span>{isAdded ? 'Добавлено' : 'В корзину'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});
