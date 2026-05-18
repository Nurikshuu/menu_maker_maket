/**
 * CheckoutForm — full checkout form: personal details, delivery type,
 * address, time, payment method, and submit. Driven by useOrder hook.
 */

'use client';

import { DeliveryType, DeliveryTime, PaymentMethod } from '@/types/order.types';
import { useOrder } from '@/hooks/use-order';
import { DeliveryToggle } from './DeliveryToggle';
import { cn } from '@/lib/utils';
import { formatPhone } from '@/utils/validate-address';

export function CheckoutForm() {
  const { form, errors, loadingState, updateField, submitOrder } = useOrder();

  const isSubmitting = loadingState === 'loading';

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); submitOrder(); }}
      className="rounded-xl bg-white shadow-sm p-6 space-y-6"
      noValidate
    >
      <h2 className="text-xl font-semibold text-gray-900">Оформление заказа</h2>

      {/* Personal details */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Ваши данные</h3>
        <FormField label="Имя" error={errors.customerName}>
          <input
            type="text"
            value={form.customerName}
            onChange={(e) => updateField('customerName', e.target.value)}
            placeholder="Иван"
            className={inputClass(!!errors.customerName)}
          />
        </FormField>
        <FormField label="Телефон" error={errors.customerPhone}>
          <input
            type="tel"
            value={form.customerPhone}
            onChange={(e) => updateField('customerPhone', formatPhone(e.target.value))}
            placeholder="+7 (999) 999-99-99"
            className={inputClass(!!errors.customerPhone)}
          />
        </FormField>
      </section>

      {/* Delivery type */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Способ получения</h3>
        <DeliveryToggle
          value={form.deliveryType}
          onChange={(v) => updateField('deliveryType', v)}
        />
        {form.deliveryType === DeliveryType.Delivery && (
          <FormField label="Адрес доставки" error={errors.deliveryAddress}>
            <input
              type="text"
              value={form.deliveryAddress}
              onChange={(e) => updateField('deliveryAddress', e.target.value)}
              placeholder="Улица, дом, квартира"
              className={inputClass(!!errors.deliveryAddress)}
            />
          </FormField>
        )}
      </section>

      {/* Delivery time */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Время</h3>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {[
            { value: DeliveryTime.ASAP, label: 'Как можно скорее' },
            { value: DeliveryTime.Scheduled, label: 'К определённому времени' },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => updateField('deliveryTime', value)}
              className={cn(
                'flex-1 py-2.5 text-sm font-medium transition-colors',
                form.deliveryTime === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50',
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {form.deliveryTime === DeliveryTime.Scheduled && (
          <input
            type="datetime-local"
            value={form.scheduledTime}
            onChange={(e) => updateField('scheduledTime', e.target.value)}
            className={inputClass(false)}
          />
        )}
      </section>

      {/* Payment */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Оплата</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: PaymentMethod.Card, label: 'Картой онлайн' },
            { value: PaymentMethod.Cash, label: 'Наличные' },
            { value: PaymentMethod.Online, label: 'СБП' },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => updateField('paymentMethod', value)}
              className={cn(
                'rounded-lg border py-3 text-sm font-medium transition-colors',
                form.paymentMethod === value
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-600 py-3.5 text-base font-bold text-white hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60"
      >
        {isSubmitting ? 'Оформляем...' : 'Оформить заказ'}
      </button>
    </form>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    'w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors',
    'focus:ring-2 focus:ring-blue-100',
    hasError
      ? 'border-red-400 focus:border-red-400'
      : 'border-gray-200 focus:border-blue-500',
  );
}
