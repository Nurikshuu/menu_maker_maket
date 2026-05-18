/**
 * JoinTableModal — shown when a user lands on a table QR page
 * without an active session. Prompts for a name to join the table.
 */

'use client';

import { useState } from 'react';
import { Users, UtensilsCrossed } from 'lucide-react';

interface JoinTableModalProps {
  restaurantName: string;
  tableNumber: string;
  existingParticipants: string[];
  onJoin: (name: string) => void;
}

export function JoinTableModal({
  restaurantName,
  tableNumber,
  existingParticipants,
  onJoin,
}: JoinTableModalProps) {
  const [name, setName] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length === 0) return;
    onJoin(trimmed);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-5 text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-white/20">
            <UtensilsCrossed className="size-6 text-white" />
          </div>
          <h2 className="text-lg font-bold text-white">{restaurantName}</h2>
          <p className="mt-0.5 text-sm text-blue-100">Стол {tableNumber}</p>
        </div>

        <div className="px-6 py-5 space-y-4">
          {existingParticipants.length > 0 && (
            <div className="rounded-lg bg-blue-50 p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Users className="size-3.5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700">
                  За столом уже {existingParticipants.length}{' '}
                  {existingParticipants.length === 1 ? 'человек' : 'человека'}
                </span>
              </div>
              <p className="text-xs text-blue-600">{existingParticipants.join(', ')}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Как вас зовут?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите имя"
                autoFocus
                maxLength={30}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={name.trim().length === 0}
              className="w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {existingParticipants.length > 0 ? 'Присоединиться к заказу' : 'Начать заказ'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400">
            Каждый участник добавляет своё блюдо. В конце можно разделить счёт.
          </p>
        </div>
      </div>
    </div>
  );
}
