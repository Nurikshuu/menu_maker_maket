/**
 * Table session store — manages shared dine-in table orders.
 * Multiple participants scan the same QR to join a table session.
 * Each participant's items are tracked individually for bill splitting.
 * State is persisted to localStorage so refreshing keeps the session.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MenuItem } from '@/types/restaurant.types';
import type {
  TableSession,
  TableParticipant,
  TableOrderItem,
  SplitBillParticipant,
} from '@/types/table.types';
import { PROMO_CODES } from '@/constants/delivery.constants';

interface TableState {
  session: TableSession | null;

  /** Join (or create) a table session. Returns the new participant's ID. */
  joinTable: (
    restaurantId: string,
    restaurantSlug: string,
    restaurantName: string,
    tableNumber: string,
    participantName: string,
  ) => string;

  /** Clear session from this device */
  leaveTable: () => void;

  /** Add another participant without switching to them */
  addParticipant: (name: string) => string;

  /** Switch the "current" participant on this device */
  switchParticipant: (participantId: string) => void;

  // Items (always act on currentParticipantId)
  addItem: (menuItem: MenuItem) => void;
  removeItem: (itemId: string) => void;
  incrementItem: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
  clearParticipantItems: (participantId?: string) => void;

  // Promo
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  // Selectors
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getTotalItemCount: () => number;
  getCurrentParticipantItemCount: () => number;
  getParticipantItemCount: (participantId: string) => number;
  getSplitBill: () => SplitBillParticipant[];
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export const useTableStore = create<TableState>()(
  persist(
    (set, get) => ({
      session: null,

      joinTable: (restaurantId, restaurantSlug, restaurantName, tableNumber, participantName) => {
        const sessionId = `${restaurantSlug}-t${tableNumber}`;
        const existing = get().session;
        const participantId = generateId();
        const participant: TableParticipant = { id: participantId, name: participantName };

        if (existing && existing.sessionId === sessionId) {
          // Join existing session at this table
          set({
            session: {
              ...existing,
              currentParticipantId: participantId,
              participants: [...existing.participants, participant],
            },
          });
        } else {
          // Start a new session (different table or fresh)
          set({
            session: {
              sessionId,
              restaurantId,
              restaurantSlug,
              restaurantName,
              tableNumber,
              participants: [participant],
              currentParticipantId: participantId,
              items: [],
              promoCode: '',
              discountPercent: 0,
              promoDescription: '',
              createdAt: new Date().toISOString(),
            },
          });
        }
        return participantId;
      },

      leaveTable: () => set({ session: null }),

      addParticipant: (name) => {
        const id = generateId();
        const session = get().session;
        if (!session) return id;
        set({
          session: {
            ...session,
            participants: [...session.participants, { id, name }],
          },
        });
        return id;
      },

      switchParticipant: (participantId) => {
        const session = get().session;
        if (!session) return;
        if (!session.participants.find((p) => p.id === participantId)) return;
        set({ session: { ...session, currentParticipantId: participantId } });
      },

      addItem: (menuItem) => {
        const session = get().session;
        if (!session || !session.currentParticipantId) return;
        const participant = session.participants.find(
          (p) => p.id === session.currentParticipantId,
        );
        if (!participant) return;

        const existingIdx = session.items.findIndex(
          (i) =>
            i.menuItem.id === menuItem.id && i.participantId === session.currentParticipantId,
        );

        if (existingIdx >= 0) {
          set({
            session: {
              ...session,
              items: session.items.map((item, idx) =>
                idx === existingIdx ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            },
          });
        } else {
          const newItem: TableOrderItem = {
            id: generateId(),
            menuItem,
            quantity: 1,
            participantId: participant.id,
            participantName: participant.name,
          };
          set({ session: { ...session, items: [...session.items, newItem] } });
        }
      },

      removeItem: (itemId) => {
        const session = get().session;
        if (!session) return;
        set({ session: { ...session, items: session.items.filter((i) => i.id !== itemId) } });
      },

      incrementItem: (itemId) => {
        const session = get().session;
        if (!session) return;
        set({
          session: {
            ...session,
            items: session.items.map((i) =>
              i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          },
        });
      },

      decrementItem: (itemId) => {
        const session = get().session;
        if (!session) return;
        const item = session.items.find((i) => i.id === itemId);
        if (!item) return;
        if (item.quantity === 1) {
          get().removeItem(itemId);
          return;
        }
        set({
          session: {
            ...session,
            items: session.items.map((i) =>
              i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i,
            ),
          },
        });
      },

      clearParticipantItems: (participantId) => {
        const session = get().session;
        if (!session) return;
        const pid = participantId ?? session.currentParticipantId;
        if (!pid) return;
        set({
          session: {
            ...session,
            items: session.items.filter((i) => i.participantId !== pid),
          },
        });
      },

      applyPromoCode: (code) => {
        const session = get().session;
        if (!session) return { success: false, message: 'Нет активной сессии стола' };

        const upperCode = code.trim().toUpperCase();
        const promo = PROMO_CODES.find((p) => p.code === upperCode);
        if (!promo) return { success: false, message: 'Промокод не найден' };

        set({
          session: {
            ...session,
            promoCode: upperCode,
            discountPercent: promo.discountPercent,
            promoDescription: promo.description,
          },
        });
        return { success: true, message: promo.description };
      },

      removePromoCode: () => {
        const session = get().session;
        if (!session) return;
        set({ session: { ...session, promoCode: '', discountPercent: 0, promoDescription: '' } });
      },

      getSubtotal: () => {
        const session = get().session;
        if (!session) return 0;
        return session.items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
      },

      getDiscount: () => {
        const session = get().session;
        if (!session || session.discountPercent === 0) return 0;
        return Math.round((get().getSubtotal() * session.discountPercent) / 100);
      },

      getTotal: () => get().getSubtotal() - get().getDiscount(),

      getTotalItemCount: () => {
        const session = get().session;
        if (!session) return 0;
        return session.items.reduce((sum, i) => sum + i.quantity, 0);
      },

      getCurrentParticipantItemCount: () => {
        const session = get().session;
        if (!session || !session.currentParticipantId) return 0;
        return session.items
          .filter((i) => i.participantId === session.currentParticipantId)
          .reduce((sum, i) => sum + i.quantity, 0);
      },

      getParticipantItemCount: (participantId) => {
        const session = get().session;
        if (!session) return 0;
        return session.items
          .filter((i) => i.participantId === participantId)
          .reduce((sum, i) => sum + i.quantity, 0);
      },

      getSplitBill: () => {
        const session = get().session;
        if (!session) return [];

        const byParticipant = new Map<string, SplitBillParticipant>();

        for (const item of session.items) {
          if (!byParticipant.has(item.participantId)) {
            byParticipant.set(item.participantId, {
              participantId: item.participantId,
              participantName: item.participantName,
              items: [],
              subtotal: 0,
              discount: 0,
              total: 0,
            });
          }
          const entry = byParticipant.get(item.participantId)!;
          const lineTotal = item.menuItem.price * item.quantity;
          entry.items.push({
            name: item.menuItem.name,
            price: item.menuItem.price,
            quantity: item.quantity,
            total: lineTotal,
          });
          entry.subtotal += lineTotal;
        }

        // Apply discount proportionally per participant
        const grandSubtotal = get().getSubtotal();
        const grandDiscount = get().getDiscount();
        byParticipant.forEach((entry) => {
          const proportion = grandSubtotal > 0 ? entry.subtotal / grandSubtotal : 0;
          entry.discount = Math.round(grandDiscount * proportion);
          entry.total = entry.subtotal - entry.discount;
        });

        return Array.from(byParticipant.values());
      },
    }),
    { name: 'table-session-storage' },
  ),
);
