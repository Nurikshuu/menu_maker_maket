/**
 * TableCartDrawer — slide-in panel for the dine-in table order.
 * Shows items grouped by participant with the ability to remove,
 * apply a promo code, and open the split-bill modal.
 */

'use client';

import { useState } from 'react';
import { X, Plus, Minus, Trash2, Tag, Receipt, UserPlus } from 'lucide-react';
import { useTableStore } from '@/store/table.store';
import { useUIStore } from '@/store/ui.store';
import { formatPrice } from '@/utils/format-price';
import { SplitBillModal } from './SplitBillModal';
import { AddParticipantModal } from './AddParticipantModal';

interface TableCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmOrder: () => void;
}

export function TableCartDrawer({ isOpen, onClose, onConfirmOrder }: TableCartDrawerProps) {
  const store = useTableStore();
  const { addToast } = useUIStore();
  const [showSplitBill, setShowSplitBill] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [promoInput, setPromoInput] = useState('');

  const session = store.session;
  if (!session) return null;

  const subtotal = store.getSubtotal();
  const discount = store.getDiscount();
  const total = store.getTotal();
  const totalCount = store.getTotalItemCount();
  const splitBill = store.getSplitBill();

  // Group items by participant
  const byParticipant = session.participants
    .map((p) => ({
      participant: p,
      items: session.items.filter((i) => i.participantId === p.id),
    }))
    .filter((g) => g.items.length > 0);

  function handleApplyPromo(e: React.FormEvent) {
    e.preventDefault();
    const result = store.applyPromoCode(promoInput);
    addToast(result.message, result.success ? 'success' : 'error');
    if (result.success) setPromoInput('');
  }

  function handleAddParticipant(name: string) {
    const id = store.addParticipant(name);
    store.switchParticipant(id);
    addToast(`${name} добавлен за стол`, 'success');
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={[
          'fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        aria-label="Заказ на стол"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 bg-blue-600">
          <div>
            <h2 className="text-base font-bold text-white">
              Заказ на стол {session.tableNumber}
            </h2>
            <p className="text-xs text-blue-100">{session.restaurantName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-blue-100 hover:text-white transition-colors"
            aria-label="Закрыть"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Participants bar */}
        <div className="border-b border-gray-100 px-5 py-2.5 flex items-center gap-2 overflow-x-auto">
          {session.participants.map((p) => {
            const count = store.getParticipantItemCount(p.id);
            const isCurrent = p.id === session.currentParticipantId;
            return (
              <button
                key={p.id}
                onClick={() => store.switchParticipant(p.id)}
                className={[
                  'shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                  isCurrent
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                ].join(' ')}
              >
                {p.name}
                {count > 0 && (
                  <span className={isCurrent ? 'text-blue-200 ml-1' : 'text-gray-400 ml-1'}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
          <button
            onClick={() => setShowAddParticipant(true)}
            className="shrink-0 flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            <UserPlus className="size-3" />
            Добавить
          </button>
        </div>

        {totalCount === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400 px-6">
            <Receipt className="size-12 opacity-30" />
            <p className="text-sm text-center">
              Никто ещё ничего не заказал. Добавьте блюда из меню.
            </p>
          </div>
        ) : (
          <>
            {/* Items grouped by participant */}
            <div className="flex-1 overflow-y-auto">
              {byParticipant.map(({ participant, items }) => {
                const isCurrent = participant.id === session.currentParticipantId;
                return (
                  <div key={participant.id} className="border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-between px-5 pt-3 pb-1">
                      <span
                        className={[
                          'text-xs font-semibold uppercase tracking-wide',
                          isCurrent ? 'text-blue-600' : 'text-gray-500',
                        ].join(' ')}
                      >
                        {participant.name}
                        {isCurrent && ' (вы)'}
                      </span>
                      {isCurrent && (
                        <button
                          onClick={() => store.clearParticipantItems()}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                          Очистить
                        </button>
                      )}
                    </div>

                    <ul className="px-5 py-2 space-y-3">
                      {items.map((item) => (
                        <li key={item.id} className="flex items-center gap-3">
                          <img
                            src={item.menuItem.imageUrl}
                            alt={item.menuItem.name}
                            className="size-12 rounded-lg object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.menuItem.name}
                            </p>
                            <p className="text-sm text-blue-600 font-semibold">
                              {formatPrice(item.menuItem.price * item.quantity)}
                            </p>
                          </div>
                          {isCurrent ? (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => store.decrementItem(item.id)}
                                className="size-6 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600"
                              >
                                <Minus className="size-3" />
                              </button>
                              <span className="w-5 text-center text-sm font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => store.incrementItem(item.id)}
                                className="size-6 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
                              >
                                <Plus className="size-3" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400 shrink-0">
                              ×{item.quantity}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Promo code */}
            <div className="border-t border-gray-100 px-5 py-3">
              {session.promoCode ? (
                <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-3 py-2">
                  <span className="flex items-center gap-2 text-sm font-medium text-green-700">
                    <Tag className="size-4" />
                    {session.promoCode} — −{session.discountPercent}%
                  </span>
                  <button
                    onClick={store.removePromoCode}
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
                    OK
                  </button>
                </form>
              )}
            </div>

            {/* Totals + actions */}
            <div className="border-t border-gray-100 px-5 pb-5 pt-3 space-y-2">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Итого</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Скидка {session.discountPercent}%</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
                  <span>К оплате</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowSplitBill(true)}
                className="w-full rounded-lg border border-blue-300 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                <Receipt className="size-4" />
                Разделить счёт
              </button>

              <button
                onClick={onConfirmOrder}
                className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
              >
                Оплатить весь счёт
              </button>
            </div>
          </>
        )}
      </aside>

      {showSplitBill && (
        <SplitBillModal
          tableNumber={session.tableNumber}
          restaurantName={session.restaurantName}
          participants={splitBill}
          grandTotal={total}
          discountPercent={session.discountPercent}
          promoCode={session.promoCode}
          onPayAll={() => {
            setShowSplitBill(false);
            onConfirmOrder();
          }}
          onClose={() => setShowSplitBill(false)}
        />
      )}

      {showAddParticipant && (
        <AddParticipantModal
          onAdd={handleAddParticipant}
          onClose={() => setShowAddParticipant(false)}
        />
      )}
    </>
  );
}
