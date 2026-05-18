/**
 * Order domain types — covers order lifecycle, delivery options,
 * payment methods, checkout form data, and validation errors.
 */

export enum OrderStatus {
  New = 'new',
  Confirmed = 'confirmed',
  Preparing = 'preparing',
  OnTheWay = 'on_the_way',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.New]: 'Новый',
  [OrderStatus.Confirmed]: 'Подтверждён',
  [OrderStatus.Preparing]: 'Готовится',
  [OrderStatus.OnTheWay]: 'В пути',
  [OrderStatus.Delivered]: 'Доставлен',
  [OrderStatus.Cancelled]: 'Отменён',
};

export enum DeliveryType {
  Delivery = 'delivery',
  Pickup = 'pickup',
}

export enum DeliveryTime {
  ASAP = 'asap',
  Scheduled = 'scheduled',
}

export enum PaymentMethod {
  Cash = 'cash',
  Card = 'card',
  Online = 'online',
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;      // kopecks
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;    // kopecks
  deliveryFee: number; // kopecks
  discount: number;    // kopecks
  total: number;       // kopecks
  status: OrderStatus;
  deliveryType: DeliveryType;
  deliveryTime: DeliveryTime;
  scheduledTime?: string;
  paymentMethod: PaymentMethod;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  promoCode?: string;
  createdAt: string;
}

export interface CheckoutFormData {
  customerName: string;
  customerPhone: string;
  deliveryType: DeliveryType;
  deliveryAddress: string;
  deliveryTime: DeliveryTime;
  scheduledTime: string;
  paymentMethod: PaymentMethod;
  promoCode: string;
}

export type CheckoutFormErrors = Partial<Record<keyof CheckoutFormData, string>>;
