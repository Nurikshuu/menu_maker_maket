/**
 * OrderSummary — read-only cart summary panel shown on the checkout page.
 * Single flat list of all items, unified promo, delivery, and total.
 */

import { useCartStore } from '@/store/cart.store';
import { formatPrice, formatDeliveryFee } from '@/utils/format-price';

export function OrderSummary() {
  const cart = useCartStore();

  if (cart.items.length === 0) return null;

  const subtotal = cart.getSubtotal();
  const discount = cart.getDiscount();
  const deliveryFee = cart.getDeliveryFee();
  const total = cart.getTotal();

  return (
    <div className="rounded-xl bg-white shadow-sm p-6 space-y-4">
      <h3 className="font-semibold text-gray-900">Ваш заказ</h3>

      <ul className="space-y-2">
        {cart.items.map(({ menuItem, quantity }) => (
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

      <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Товары</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Скидка {cart.discountPercent}%</span>
            <span>−{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Доставка</span>
          <span>{formatDeliveryFee(deliveryFee)}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-900 pt-1 border-t border-gray-100">
          <span>Итого</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
