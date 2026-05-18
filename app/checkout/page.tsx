/**
 * Checkout page (/checkout) — order form (left) + order summary (right).
 * Redirects to home if the cart is empty.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart.store';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { ROUTES } from '@/constants/routes.constants';

export default function CheckoutPage() {
  const totalCount = useCartStore((s) => s.getTotalItemCount());
  const router = useRouter();

  useEffect(() => {
    if (totalCount === 0) router.replace(ROUTES.HOME);
  }, [totalCount, router]);

  if (totalCount === 0) return null;

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-8">Оформление заказа</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        <CheckoutForm />
        <OrderSummary />
      </div>
    </main>
  );
}
