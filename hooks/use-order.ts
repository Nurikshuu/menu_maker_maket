/**
 * useOrder — checkout form state, validation, and order placement.
 * Places a single order for all items in the flat cart.
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
import { CAFE_NAME, MINIMUM_ORDER } from '@/constants/delivery.constants';

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

  function validateMinimumOrder(): boolean {
    const subtotal = cart.getSubtotal();
    if (subtotal < MINIMUM_ORDER) {
      addToast(
        `Минимальная сумма заказа: ${formatPrice(MINIMUM_ORDER)}`,
        'error',
      );
      return false;
    }
    return true;
  }

  async function submitOrder() {
    if (!validate() || !validateMinimumOrder()) return;
    if (cart.items.length === 0) return;

    setLoadingState('loading');
    try {
      const order = await placeOrder({
        restaurantId: 'menumaker-kitchen',
        restaurantName: CAFE_NAME,
        items: cart.items,
        subtotal: cart.getSubtotal(),
        deliveryFee: cart.getDeliveryFee(),
        discount: cart.getDiscount(),
        total: cart.getTotal(),
        form,
        promoCode: cart.promoCode,
      });

      sessionStorage.setItem(`order-${order.id}`, JSON.stringify(order));
      sessionStorage.setItem('last-order-ids', JSON.stringify([order.id]));

      setLoadingState('success');
      addToast('Заказ оформлен!', 'success');
      cart.clearAll();
      router.push(ROUTES.ORDER(order.id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка оформления заказа';
      addToast(message, 'error');
      setLoadingState('error');
    }
  }

  return { form, errors, loadingState, updateField, submitOrder };
}
