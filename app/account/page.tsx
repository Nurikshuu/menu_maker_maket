'use client';

import { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Save } from 'lucide-react';
import { useUserStore } from '@/store/user.store';

export default function AccountPage() {
  const { profile, isLoggedIn, updateProfile, login } = useUserStore();
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(profile); }, [profile]);

  function handleSave() {
    if (!isLoggedIn) login(form); else updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const fields: { key: keyof typeof form; label: string; icon: React.ReactNode; type?: string; placeholder: string }[] = [
    { key: 'name', label: 'Имя', icon: <User className="size-4 text-gray-400" />, placeholder: 'Введите имя' },
    { key: 'phone', label: 'Телефон', icon: <Phone className="size-4 text-gray-400" />, type: 'tel', placeholder: '+7 700 000 00 00' },
    { key: 'email', label: 'Email', icon: <Mail className="size-4 text-gray-400" />, type: 'email', placeholder: 'example@mail.com' },
    { key: 'address', label: 'Адрес доставки', icon: <MapPin className="size-4 text-gray-400" />, placeholder: 'ул. Пример, д. 1' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Мой аккаунт</h1>
        <p className="text-sm text-gray-500 mt-1">Данные автоматически подставляются при оформлении заказа.</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4">
        {fields.map(({ key, label, icon, type, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
              <input
                type={type ?? 'text'}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>
          </div>
        ))}

        <button
          onClick={handleSave}
          className={[
            'w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors',
            saved ? 'bg-green-500 text-white' : 'bg-orange-500 text-white hover:bg-orange-600',
          ].join(' ')}
        >
          <Save className="size-4" />
          {saved ? 'Сохранено!' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}
