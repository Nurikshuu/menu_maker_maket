'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, User, History, Users, Headphones, Settings } from 'lucide-react';
import { ROUTES } from '@/constants/routes.constants';

const TABS = [
  { href: ROUTES.ACCOUNT, label: 'Аккаунт', icon: User },
  { href: ROUTES.ACCOUNT_HISTORY, label: 'История', icon: History },
  { href: ROUTES.ACCOUNT_FRIENDS, label: 'Друзья', icon: Users },
  { href: ROUTES.ACCOUNT_SUPPORT, label: 'Поддержка', icon: Headphones },
  { href: ROUTES.ACCOUNT_SETTINGS, label: 'Настройки', icon: Settings },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8 space-y-6">
      {/* Back */}
      <Link href={ROUTES.HOME} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
        <ChevronLeft className="size-4" />
        На главную
      </Link>

      {/* Tab bar */}
      <nav className="flex gap-1 bg-gray-100 rounded-2xl p-1 overflow-x-auto">
        {TABS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex-1 min-w-fit flex flex-col items-center gap-1 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors whitespace-nowrap',
                isActive
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700',
              ].join(' ')}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Page content */}
      <div>{children}</div>
    </main>
  );
}
