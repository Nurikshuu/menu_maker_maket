'use client';

import { useEffect, useState } from 'react';
import { History, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes.constants';

interface OrderEntry {
  id: string;
  restaurantName: string;
  total: number;
  date: string;
  items: { name: string; quantity: number }[];
}

export default function HistoryPage() {
  const [orders, setOrders] = useState<OrderEntry[]>([]);

  useEffect(() => {
    try {
      const rawIds: string[] = JSON.parse(sessionStorage.getItem('last-order-ids') ?? '[]');
      const ids = [...new Set(rawIds)];
      const loaded = ids.flatMap((id) => {
        const raw = sessionStorage.getItem(`order-${id}`);
        if (!raw) return [];
        const o = JSON.parse(raw);
        return [{
          id,
          restaurantName: o.restaurantName ?? '—',
          total: o.total ?? 0,
          date: o.createdAt ?? '',
          items: (o.items ?? []).map((i: { name: string; quantity: number }) => ({ name: i.name, quantity: i.quantity })),
        }];
      });
      setOrders(loaded);
    } catch {
      // ignore
    }
  }, []);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-gray-400">
        <History className="size-14" />
        <p className="text-base font-medium">История заказов пуста</p>
        <p className="text-sm text-center max-w-xs">
          Здесь будут ваши прошлые заказы — как только вы оформите первый.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">История заказов</h1>
      {orders.map((o) => (
        <div key={o.id} className="rounded-2xl border border-gray-100 bg-white p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-gray-900">{o.restaurantName}</p>
              {o.date && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(o.date).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
            <Link
              href={ROUTES.ORDER(o.id)}
              className="shrink-0 flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              <ExternalLink className="size-3" />
              Детали
            </Link>
          </div>

          {o.items.length > 0 && (
            <ul className="text-sm text-gray-600 space-y-0.5">
              {o.items.slice(0, 3).map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className="text-gray-400">×{item.quantity}</span>
                </li>
              ))}
              {o.items.length > 3 && (
                <li className="text-gray-400 text-xs">+{o.items.length - 3} позиций</li>
              )}
            </ul>
          )}

          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
            <span className="text-xs text-gray-500">Итого</span>
            <span className="font-bold text-orange-600">
              {(o.total / 100).toLocaleString('ru-RU')} ₸
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
