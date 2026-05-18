/**
 * DeliveryToggle — segmented control for switching between
 * delivery and pickup in the checkout form.
 */

'use client';

import { Truck, Store } from 'lucide-react';
import { DeliveryType } from '@/types/order.types';
import { cn } from '@/lib/utils';

export interface DeliveryToggleProps {
  value: DeliveryType;
  onChange: (type: DeliveryType) => void;
}

const OPTIONS = [
  { value: DeliveryType.Delivery, label: 'Доставка', Icon: Truck },
  { value: DeliveryType.Pickup, label: 'Самовывоз', Icon: Store },
] as const;

export function DeliveryToggle({ value, onChange }: DeliveryToggleProps) {
  return (
    <div className="flex rounded-lg border border-gray-200 overflow-hidden">
      {OPTIONS.map(({ value: optVal, label, Icon }) => (
        <button
          key={optVal}
          type="button"
          onClick={() => onChange(optVal)}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors',
            value === optVal
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50',
          )}
        >
          <Icon className="size-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
