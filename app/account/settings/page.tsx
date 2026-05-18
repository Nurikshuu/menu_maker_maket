'use client';

import { Sun, Moon, Bell, BellOff } from 'lucide-react';
import { useState } from 'react';
import { useUIStore } from '@/store/ui.store';

export default function SettingsPage() {
  const { theme, toggleTheme } = useUIStore();
  const [orderNotif, setOrderNotif] = useState(true);
  const [promoNotif, setPromoNotif] = useState(true);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Настройки</h1>

      {/* Appearance */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Внешний вид</h2>
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-4 rounded-xl p-3 hover:bg-gray-50 transition-colors"
        >
          <div className="size-10 rounded-xl bg-gray-100 flex items-center justify-center">
            {theme === 'dark'
              ? <Sun className="size-5 text-yellow-500" />
              : <Moon className="size-5 text-gray-600" />}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-900">
              {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
            </p>
            <p className="text-xs text-gray-400">
              {theme === 'dark' ? 'Переключиться на светлый режим' : 'Переключиться на тёмный режим'}
            </p>
          </div>
          <div className={[
            'w-12 h-6 rounded-full transition-colors relative',
            theme === 'dark' ? 'bg-orange-500' : 'bg-gray-200',
          ].join(' ')}>
            <span className={[
              'absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform',
              theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5',
            ].join(' ')} />
          </div>
        </button>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Уведомления</h2>
        <ToggleRow
          icon={<Bell className="size-4 text-blue-500" />}
          label="Статус заказа"
          description="Уведомления о курьере и доставке"
          value={orderNotif}
          onChange={setOrderNotif}
        />
        <ToggleRow
          icon={<BellOff className="size-4 text-orange-500" />}
          label="Акции и промокоды"
          description="Специальные предложения от ресторанов"
          value={promoNotif}
          onChange={setPromoNotif}
        />
      </div>

      <p className="text-xs text-center text-gray-400">menumaker v0.1.0 · Астана, Казахстан</p>
    </div>
  );
}

function ToggleRow({ icon, label, description, value, onChange }: {
  icon: React.ReactNode;
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="flex w-full items-center gap-3 rounded-xl p-3 hover:bg-gray-50 transition-colors text-left"
    >
      <div className="size-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <div className={['w-10 h-5 rounded-full transition-colors relative shrink-0', value ? 'bg-orange-500' : 'bg-gray-200'].join(' ')}>
        <span className={['absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform', value ? 'translate-x-5' : 'translate-x-0.5'].join(' ')} />
      </div>
    </button>
  );
}
