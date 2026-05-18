/**
 * Table session types — for dine-in QR-code-based group ordering.
 * A TableSession represents a shared table order where multiple
 * participants can add items and see each other's selections.
 */

import type { MenuItem } from './restaurant.types';

export interface TableParticipant {
  id: string;
  name: string;
}

export interface TableOrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  participantId: string;
  participantName: string;
}

export interface TableSession {
  /** Unique session key: `${restaurantSlug}-t${tableNumber}` */
  sessionId: string;
  restaurantId: string;
  restaurantSlug: string;
  restaurantName: string;
  tableNumber: string;
  participants: TableParticipant[];
  /** ID of the person currently using this device */
  currentParticipantId: string | null;
  items: TableOrderItem[];
  promoCode: string;
  discountPercent: number;
  promoDescription: string;
  createdAt: string;
}

export interface SplitBillParticipant {
  participantId: string;
  participantName: string;
  items: { name: string; price: number; quantity: number; total: number }[];
  subtotal: number;
  discount: number;
  total: number;
}
