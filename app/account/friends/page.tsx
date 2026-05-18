'use client';

import { useState } from 'react';
import { Users, UserPlus, Trash2, Link2, X, Copy, Check, Utensils } from 'lucide-react';
import { useFriendsStore, type Friend } from '@/store/friends.store';
import { ROUTES } from '@/constants/routes.constants';

export default function FriendsPage() {
  const { friends, addFriend, removeFriend } = useFriendsStore();
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [addError, setAddError] = useState('');
  const [inviteFriend, setInviteFriend] = useState<Friend | null>(null);
  const [tableSlug, setTableSlug] = useState('');
  const [tableNum, setTableNum] = useState('');
  const [copied, setCopied] = useState(false);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!nameInput.trim() || !phoneInput.trim()) {
      setAddError('Заполните имя и телефон');
      return;
    }
    const result = addFriend(nameInput, phoneInput);
    if (result.exists) {
      setAddError('Друг с таким номером уже добавлен');
      return;
    }
    setNameInput('');
    setPhoneInput('');
    setAddError('');
  }

  const tableLink =
    tableSlug && tableNum
      ? `${typeof window !== 'undefined' ? window.location.origin : ''}${ROUTES.TABLE(tableSlug, tableNum)}`
      : '';

  function handleCopy() {
    if (!tableLink) return;
    navigator.clipboard.writeText(tableLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Друзья</h1>

      {/* Add friend form */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <UserPlus className="size-4 text-orange-500" />
          Добавить друга
        </h2>
        <form onSubmit={handleAdd} className="space-y-2">
          <input
            value={nameInput}
            onChange={(e) => { setNameInput(e.target.value); setAddError(''); }}
            placeholder="Имя"
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
          <input
            value={phoneInput}
            onChange={(e) => { setPhoneInput(e.target.value); setAddError(''); }}
            placeholder="+7 700 000 00 00"
            type="tel"
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
          {addError && <p className="text-xs text-red-500">{addError}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            Добавить
          </button>
        </form>
      </div>

      {/* Friends list */}
      {friends.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
          <Users className="size-12" />
          <p className="text-sm">Список друзей пуст</p>
          <p className="text-xs text-center max-w-xs">Добавьте друзей, чтобы приглашать их к совместным заказам за столом</p>
        </div>
      ) : (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700">Мои друзья ({friends.length})</h2>
          {friends.map((f) => (
            <div key={f.id} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
              <div className="size-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-orange-600 font-semibold text-sm">
                {f.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{f.name}</p>
                <p className="text-xs text-gray-500 truncate">{f.phone}</p>
              </div>
              <button
                onClick={() => setInviteFriend(f)}
                title="Пригласить к столу"
                className="flex items-center gap-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors px-2.5 py-1.5 text-xs font-medium"
              >
                <Utensils className="size-3.5" />
                За стол
              </button>
              <button
                onClick={() => removeFriend(f.id)}
                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                title="Удалить"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Invite modal */}
      {inviteFriend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Link2 className="size-4 text-blue-600" />
                Пригласить {inviteFriend.name}
              </h2>
              <button onClick={() => { setInviteFriend(null); setTableSlug(''); setTableNum(''); }} className="text-gray-400 hover:text-gray-600">
                <X className="size-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Введите ресторан и номер стола, чтобы сгенерировать ссылку для друга.
            </p>
            <input
              value={tableSlug}
              onChange={(e) => setTableSlug(e.target.value)}
              placeholder="Slug ресторана (напр. pizza-house)"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <input
              value={tableNum}
              onChange={(e) => setTableNum(e.target.value)}
              placeholder="Номер стола"
              type="number"
              min={1}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            {tableLink && (
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 flex items-center gap-2">
                <p className="flex-1 text-xs text-gray-700 break-all font-mono">{tableLink}</p>
                <button
                  onClick={handleCopy}
                  className="shrink-0 flex items-center gap-1 rounded-lg bg-blue-600 text-white px-2.5 py-1.5 text-xs font-medium hover:bg-blue-700 transition-colors"
                >
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copied ? 'Скопировано' : 'Копировать'}
                </button>
              </div>
            )}
            <p className="text-xs text-gray-400">
              Друг откроет ссылку и присоединится к заказу за вашим столом. Вы можете делать заказы вместе и потом разделить счёт.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
