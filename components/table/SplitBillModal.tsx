/**
 * SplitBillModal — shows a per-participant breakdown of the table order.
 * Supports sending individual bills (mocked) and paying the full amount.
 */

'use client';

import { useState } from 'react';
import { X, Receipt, Send, CreditCard, CheckCircle } from 'lucide-react';
import type { SplitBillParticipant } from '@/types/table.types';
import { formatPrice } from '@/utils/format-price';

interface SplitBillModalProps {
  tableNumber: string;
  restaurantName: string;
  participants: SplitBillParticipant[];
  grandTotal: number;
  discountPercent: number;
  promoCode: string;
  onPayAll: () => void;
  onClose: () => void;
}

export function SplitBillModal({
  tableNumber,
  restaurantName,
  participants,
  grandTotal,
  discountPercent,
  promoCode,
  onPayAll,
  onClose,
}: SplitBillModalProps) {
  const [sentBills, setSentBills] = useState<Set<string>>(new Set());

  function handleSendBill(participantId: string, participantName: string) {
    setSentBills((prev) => new Set(prev).add(participantId));
    // In production: send push notification or SMS to participant's phone
  }

  function handleSendAllBills() {
    const allIds = new Set(participants.map((p) => p.participantId));
    setSentBills(allIds);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-0 sm:px-4">
      <div className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Receipt className="size-5 text-blue-600" />
            <div>
              <h2 className="font-bold text-gray-900">Разделение счёта</h2>
              <p className="text-xs text-gray-500">
                {restaurantName} · Стол {tableNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Participant bills */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {promoCode && (
            <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
              Промокод <strong>{promoCode}</strong> — скидка {discountPercent}% распределена
              пропорционально
            </div>
          )}

          {participants.map((p) => (
            <div key={p.participantId} className="rounded-xl border border-gray-200 overflow-hidden">
              {/* Participant header */}
              <div className="flex items-center justify-between bg-gray-50 px-4 py-2.5">
                <span className="font-semibold text-gray-900 text-sm">{p.participantName}</span>
                <span className="font-bold text-blue-600 text-sm">{formatPrice(p.total)}</span>
              </div>

              {/* Items */}
              <ul className="px-4 py-2 space-y-1">
                {p.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm text-gray-600">
                    <span>
                      {item.name}
                      {item.quantity > 1 && (
                        <span className="text-gray-400"> ×{item.quantity}</span>
                      )}
                    </span>
                    <span>{formatPrice(item.total)}</span>
                  </li>
                ))}
                {p.discount > 0 && (
                  <li className="flex justify-between text-sm text-green-600">
                    <span>Скидка</span>
                    <span>−{formatPrice(p.discount)}</span>
                  </li>
                )}
              </ul>

              {/* Send bill button */}
              <div className="px-4 pb-3">
                {sentBills.has(p.participantId) ? (
                  <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                    <CheckCircle className="size-4" />
                    Счёт отправлен
                  </div>
                ) : (
                  <button
                    onClick={() => handleSendBill(p.participantId, p.participantName)}
                    className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Send className="size-3.5" />
                    Отправить счёт {p.participantName}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="border-t border-gray-100 px-5 py-4 space-y-2">
          <div className="flex justify-between text-sm font-bold text-gray-900 mb-3">
            <span>Итого по столу</span>
            <span>{formatPrice(grandTotal)}</span>
          </div>

          <button
            onClick={handleSendAllBills}
            disabled={sentBills.size === participants.length}
            className="w-full rounded-lg border border-blue-300 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            {sentBills.size === participants.length
              ? 'Все счета отправлены'
              : 'Отправить все личные счета'}
          </button>

          <button
            onClick={onPayAll}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <CreditCard className="size-4" />
            Оплатить один общий счёт ({formatPrice(grandTotal)})
          </button>
        </div>
      </div>
    </div>
  );
}
