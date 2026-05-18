/**
 * Toast — single toast notification rendered inside ToastContainer.
 * Auto-dismisses via the UI store timeout.
 */

'use client';

import * as React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ToastMessage } from '@/types/common.types';
import { useUIStore } from '@/store/ui.store';

const ICON_MAP = {
  success: <CheckCircle className="size-4 shrink-0 text-green-500" />,
  error: <AlertCircle className="size-4 shrink-0 text-red-500" />,
  info: <Info className="size-4 shrink-0 text-blue-500" />,
};

const BG_MAP: Record<ToastMessage['type'], string> = {
  success: 'bg-white border-green-200',
  error: 'bg-white border-red-200',
  info: 'bg-white border-blue-200',
};

interface ToastProps {
  toast: ToastMessage;
}

function Toast({ toast }: ToastProps) {
  const { removeToast } = useUIStore();

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg',
        'animate-in slide-in-from-bottom-4 duration-300',
        BG_MAP[toast.type],
      )}
    >
      {ICON_MAP[toast.type]}
      <span className="flex-1 text-sm font-medium text-gray-800">{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Закрыть"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-3rem)]"
      role="region"
      aria-label="Уведомления"
    >
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  );
}
