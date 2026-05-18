/**
 * useOrder — checkout form state, validation, and order placement.
 * Iterates over all cart restaurant entries and creates one order per restaurant.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CheckoutFormData, CheckoutFormErrors } from '@/types/order.types';
import { DeliveryType, DeliveryTime, PaymentMethod } from '@/types/order.types';
import type { LoadingState } from '@/types/common.types';
import { useCartStore } from '@/store/cart.store';
import { useUIStore } from '@/store/ui.store';
import { useUserStore } from '@/store/user.store';
import { placeOrder } from '@/services/order.service';
import { isValidName, isValidPhone, isValidAddress } from '@/utils/validate-address';
import { formatPrice } from '@/utils/format-price';
import { ROUTES } from '@/constants/routes.constants';

const EMPTY_FORM: CheckoutFormData = {
  customerName: '',
  customerPhone: '',
  deliveryType: DeliveryType.Delivery,
  deliveryAddress: '',
  deliveryTime: DeliveryTime.ASAP,
  scheduledTime: '',
  paymentMethod: PaymentMethod.Card,
  promoCode: '',
};

export function useOrder() {
  const userProfile = useUserStore((s) => s.profile);

  const [form, setForm] = useState<CheckoutFormData>({
    ...EMPTY_FORM,
    customerName: userProfile.name,
    customerPhone: userProfile.phone,
    deliveryAddress: userProfile.address,
  });
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const router = useRouter();

  const cart = useCartStore();
  const { addToast } = useUIStore();

  function updateField<K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: CheckoutFormErrors = {};
    if (!isValidName(form.customerName)) next.customerName = 'Введите имя (минимум 2 символа)';
    if (!isValidPhone(form.customerPhone)) next.customerPhone = 'Введите корректный номер телефона';
    if (form.deliveryType === DeliveryType.Delivery && !isValidAddress(form.deliveryAddress)) {
      next.deliveryAddress = 'Введите адрес доставки (минимум 10 символов)';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateMinimumOrders(): boolean {
    const entries = cart.getRestaurantEntries();
    for (const entry of entries) {
      const subtotal = cart.getRestaurantSubtotal(entry.restaurantId);
      if (subtotal < entry.minimumOrder) {
        addToast(
          `Минимальная сумма для «${entry.restaurantName}»: ${formatPrice(entry.minimumOrder)}`,
          'error',
        );
        return false;
      }
    }
    return true;
  }

  async function submitOrder() {
    if (!validate() || !validateMinimumOrders()) return;

    const entries = cart.getRestaurantEntries();
    if (entries.length === 0) return;

    setLoadingState('loading');
    try {
      const orderPromises = entries.map((entry) =>
        placeOrder({
          restaurantId: entry.restaurantId,
          restaurantName: entry.restaurantName,
          items: entry.items,
          subtotal: cart.getRestaurantSubtotal(entry.restaurantId),
          deliveryFee: entry.deliveryFee,
          discount: cart.getRestaurantDiscount(entry.restaurantId),
          total: cart.getRestaurantTotal(entry.restaurantId),
          form,
          promoCode: entry.promoCode,
        }),
      );

      const orders = await Promise.all(orderPromises);
      orders.forEach((order) => {
        sessionStorage.setItem(`order-${order.id}`, JSON.stringify(order));
      });
      sessionStorage.setItem('last-order-ids', JSON.stringify(orders.map((o) => o.id)));

      setLoadingState('success');
      addToast('Заказы оформлены!', 'success');
      cart.clearAll();
      router.push(ROUTES.ORDER(orders[0].id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка оформления заказа';
      addToast(message, 'error');
      setLoadingState('error');
    }
  }

  return { form, errors, loadingState, updateField, submitOrder };
}
