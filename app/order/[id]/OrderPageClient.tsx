'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Circle } from 'lucide-react';
import type { Order } from '@/types/order.types';
import { OrderStatus, ORDER_STATUS_LABELS } from '@/types/order.types';
import { getOrderById } from '@/services/order.service';
import { formatPrice } from '@/utils/format-price';
import { ROUTES } from '@/constants/routes.constants';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_STEPS: OrderStatus[] = [
  OrderStatus.New,
  OrderStatus.Confirmed,
  OrderStatus.Preparing,
  OrderStatus.OnTheWay,
  OrderStatus.Delivered,
];

export default function OrderPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getOrderById(params.id);
        setOrder(data);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (isLoading) return <OrderPageSkeleton />;

  if (!order) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-500">Заказ не найден</p>
        <Link href={ROUTES.HOME} className="text-blue-600 hover:underline text-sm">
          На главную
        </Link>
      </main>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status as OrderStatus);

  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8 space-y-8">
      <div className="text-center space-y-2">
        <CheckCircle className="mx-auto size-16 text-green-500" />
        <h1 className="text-2xl font-extrabold text-gray-900">Заказ оформлен!</h1>
        <p className="text-gray-500 text-sm">#{order.id}</p>
        <p className="text-blue-600 font-semibold">{order.restaurantName}</p>
      </div>

      <div className="rounded-xl bg-white shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">
          Статус заказа
        </h2>
        <ol className="space-y-4">
          {STATUS_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <li key={step} className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle className="size-5 text-green-500 shrink-0" />
                ) : (
                  <Circle
                    className={[
                      'size-5 shrink-0',
                      isCurrent ? 'text-blue-600' : 'text-gray-300',
                    ].join(' ')}
                  />
                )}
                <span
                  className={[
                    'text-sm font-medium',
                    isDone ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400',
                  ].join(' ')}
                >
                  {ORDER_STATUS_LABELS[step]}
                </span>
                {isCurrent && (
                  <span className="ml-auto text-xs text-blue-600 animate-pulse">Текущий</span>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="rounded-xl bg-white shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Состав заказа</h2>
        <ul className="space-y-2">
          {order.items.map((item) => (
            <li key={item.menuItemId} className="flex justify-between text-sm">
              <span className="text-gray-700">{item.name} × {item.quantity}</span>
              <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Скидка</span>
              <span>−{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-900 text-base">
            <span>Итого</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link
          href={ROUTES.HOME}
          className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Сделать ещё заказ
        </Link>
      </div>
    </main>
  );
}

function OrderPageSkeleton() {
  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8 space-y-6">
      <Skeleton className="h-16 w-16 rounded-full mx-auto" />
      <Skeleton className="h-8 w-48 mx-auto" />
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-40 rounded-xl" />
    </main>
  );
}
