/**
 * CartDrawer — slide-in right panel showing the flat cart.
 * Single section with all items, one promo code, and unified totals.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, Tag } from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { useCartStore } from '@/store/cart.store';
import { formatPrice, formatDeliveryFee } from '@/utils/format-price';
import { ROUTES } from '@/constants/routes.constants';

export function CartDrawer() {
  const { isCartDrawerOpen, closeCartDrawer, addToast } = useUIStore();
  const cart = useCartStore();
  const totalCount = cart.getTotalItemCount();
  const [promoInput, setPromoInput] = useState('');

  function handleApplyPromo(e: React.FormEvent) {
    e.preventDefault();
    const result = cart.applyPromoCode(promoInput);
    addToast(result.message, result.success ? 'success' : 'error');
    if (result.success) setPromoInput('');
  }

  return (
    <>
      {isCartDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={closeCartDrawer}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          'fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300',
          isCartDrawerOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        aria-label="Корзина"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Корзина</h2>
          <button
            onClick={closeCartDrawer}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Закрыть корзину"
          >
            <X className="size-5" />
          </button>
        </div>

        {totalCount === 0 ? (
          <EmptyCart />
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto">
              <ul className="px-5 py-4 space-y-3">
                {cart.items.map(({ menuItem, quantity }) => (
                  <li key={menuItem.id} className="flex items-center gap-3">
                    <img
                      src={menuItem.imageUrl}
                      alt={menuItem.name}
                      className="size-14 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{menuItem.name}</p>
                      <p className="text-sm text-blue-600 font-semibold">
                        {formatPrice(menuItem.price * quantity)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => cart.decrementItem(menuItem.id)}
                        className="size-7 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                        aria-label="Уменьшить"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                      <button
                        onClick={() => cart.incrementItem(menuItem.id)}
                        className="size-7 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        aria-label="Увеличить"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        cart.removeItem(menuItem.id);
                        addToast(`${menuItem.name} удалён`, 'info');
                      }}
                      className="text-gray-300 hover:text-red-400 transition-colors ml-1"
                      aria-label="Удалить"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Promo code */}
            <div className="border-t border-gray-100 px-5 py-3">
              {cart.promoCode ? (
                <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-3 py-2">
                  <span className="flex items-center gap-2 text-sm font-medium text-green-700">
                    <Tag className="size-4" />
                    {cart.promoCode}
                  </span>
                  <button
                    onClick={cart.removePromoCode}
                    className="text-xs text-green-600 hover:text-green-800 underline"
                  >
                    Убрать
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Промокод"
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={promoInput.length === 0}
                    className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-40 transition-colors"
                  >
                    Применить
                  </button>
                </form>
              )}
            </div>

            {/* Totals + checkout */}
            <div className="border-t border-gray-200 px-5 py-4 space-y-2">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Товары</span>
                  <span>{formatPrice(cart.getSubtotal())}</span>
                </div>
                {cart.getDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Скидка {cart.discountPercent}%</span>
                    <span>−{formatPrice(cart.getDiscount())}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Доставка</span>
                  <span>{formatDeliveryFee(cart.getDeliveryFee())}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
                <span>Итого</span>
                <span>{formatPrice(cart.getTotal())}</span>
              </div>
              <Link
                href={ROUTES.CHECKOUT}
                onClick={closeCartDrawer}
                className="block w-full rounded-xl bg-blue-600 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Оформить заказ
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
      <ShoppingBag className="size-16 text-gray-200" />
      <p className="text-gray-500">Корзина пуста</p>
      <p className="text-sm text-gray-400">Добавьте блюда из меню</p>
    </div>
  );
}
