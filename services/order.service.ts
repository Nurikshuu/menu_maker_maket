/**
 * Order service — all HTTP calls related to order placement and status.
 * No state, no UI logic — only data fetching.
 */

import type { Order, CheckoutFormData, OrderStatus } from '@/types/order.types';
import type { CartItem } from '@/types/cart.types';
import { DeliveryType, DeliveryTime, PaymentMethod } from '@/types/order.types';

const ARTIFICIAL_DELAY_MS = 600;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface PlaceOrderPayload {
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  form: CheckoutFormData;
  promoCode: string;
}

export async function placeOrder(payload: PlaceOrderPayload): Promise<Order> {
  await delay(ARTIFICIAL_DELAY_MS);

  const order: Order = {
    id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    restaurantId: payload.restaurantId,
    restaurantName: payload.restaurantName,
    items: payload.items.map((ci) => ({
      menuItemId: ci.menuItem.id,
      name: ci.menuItem.name,
      price: ci.menuItem.price,
      quantity: ci.quantity,
      imageUrl: ci.menuItem.imageUrl,
    })),
    subtotal: payload.subtotal,
    deliveryFee: payload.deliveryFee,
    discount: payload.discount,
    total: payload.total,
    status: 'new' as OrderStatus,
    deliveryType: payload.form.deliveryType ?? DeliveryType.Delivery,
    deliveryTime: payload.form.deliveryTime ?? DeliveryTime.ASAP,
    scheduledTime: payload.form.scheduledTime || undefined,
    paymentMethod: payload.form.paymentMethod ?? PaymentMethod.Card,
    customerName: payload.form.customerName,
    customerPhone: payload.form.customerPhone,
    deliveryAddress: payload.form.deliveryAddress || undefined,
    promoCode: payload.promoCode || undefined,
    createdAt: new Date().toISOString(),
  };

  return order;
}

export async function getOrderById(id: string): Promise<Order | null> {
  await delay(ARTIFICIAL_DELAY_MS);
  // In production this would be a GET /orders/:id
  const stored = sessionStorage.getItem(`order-${id}`);
  if (!stored) return null;
  return JSON.parse(stored) as Order;
}
