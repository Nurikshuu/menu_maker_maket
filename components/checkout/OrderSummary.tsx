/**
 * OrderSummary — read-only cart summary panel shown on the checkout page.
 * Renders one section per restaurant with items, promo, delivery, and totals.
 * Shows grand total at the bottom when there are multiple restaurants.
 */

import { useCartStore } from '@/store/cart.store';
import { formatPrice, formatDeliveryFee } from '@/utils/format-price';

export function OrderSummary() {
  const cart = useCartStore();
  const entries = cart.getRestaurantEntries();
  const grandTotal = cart.getGrandTotal();

  if (entries.length === 0) return null;

  return (
    <div className="rounded-xl bg-white shadow-sm p-6 space-y-6">
      <h3 className="font-semibold text-gray-900">Ваш заказ</h3>

      {entries.map((entry) => {
        const subtotal = cart.getRestaurantSubtotal(entry.restaurantId);
        const discount = cart.getRestaurantDiscount(entry.restaurantId);
        const total = cart.getRestaurantTotal(entry.restaurantId);

        return (
          <div key={entry.restaurantId} className="space-y-3">
            <p className="text-sm font-semibold text-blue-600">{entry.restaurantName}</p>

            <ul className="space-y-2">
              {entry.items.map(({ menuItem, quantity }) => (
                <li key={menuItem.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {menuItem.name} × {quantity}
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(menuItem.price * quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-100 pt-2 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Товары</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Скидка {entry.discountPercent}%</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Доставка</span>
                <span>{formatDeliveryFee(entry.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Итого</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        );
      })}

      {entries.length > 1 && (
        <div className="border-t-2 border-gray-200 pt-4 flex justify-between font-bold text-gray-900 text-base">
          <span>Итого по всем заказам</span>
          <span>{formatPrice(grandTotal)}</span>
        </div>
      )}
    </div>
  );
}
