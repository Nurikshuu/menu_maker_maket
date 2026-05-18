/**
 * AddParticipantModal — lets the current user add a new participant
 * to the table session (e.g., a friend who sat down).
 */

'use client';

import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

interface AddParticipantModalProps {
  onAdd: (name: string) => void;
  onClose: () => void;
}

export function AddParticipantModal({ onAdd, onClose }: AddParticipantModalProps) {
  const [name, setName] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-xs rounded-2xl bg-white shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="size-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">Новый участник</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя участника"
            autoFocus
            maxLength={30}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
          />
          <button
            type="submit"
            disabled={name.trim().length === 0}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Добавить
          </button>
        </form>
      </div>
    </div>
  );
}
