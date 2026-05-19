/**
 * PromoInput — promo code field for the checkout page.
 * Applies a global discount via the flat cart store.
 */

'use client';

import { useState } from 'react';
import { Tag } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useUIStore } from '@/store/ui.store';
import { cn } from '@/lib/utils';

export function PromoInput() {
  const [code, setCode] = useState('');
  const cart = useCartStore();
  const { addToast } = useUIStore();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = cart.applyPromoCode(code);
    addToast(result.message, result.success ? 'success' : 'error');
    if (result.success) setCode('');
  }

  if (cart.promoCode) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-3 py-2">
        <span className="flex items-center gap-2 text-sm font-medium text-green-700">
          <Tag className="size-4" />
          {cart.promoCode} — −{cart.discountPercent}%
        </span>
        <button
          onClick={cart.removePromoCode}
          className="text-xs text-green-600 hover:text-green-800 underline"
        >
          Убрать
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Промокод"
        className={cn(
          'flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none',
          'focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors',
        )}
      />
      <button
        type="submit"
        disabled={code.length === 0}
        className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-40 transition-colors"
      >
        Применить
      </button>
    </form>
  );
}
