'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, User, History, Headphones, Settings, LogOut, Users, Sun, Moon, ChevronRight } from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { useUserStore } from '@/store/user.store';
import { ROUTES } from '@/constants/routes.constants';

const NAV_ITEMS = [
  { href: ROUTES.ACCOUNT, label: 'Мой аккаунт', icon: User },
  { href: ROUTES.ACCOUNT_HISTORY, label: 'История заказов', icon: History },
  { href: ROUTES.ACCOUNT_FRIENDS, label: 'Друзья', icon: Users },
  { href: ROUTES.ACCOUNT_SUPPORT, label: 'Служба поддержки', icon: Headphones },
  { href: ROUTES.ACCOUNT_SETTINGS, label: 'Настройки', icon: Settings },
];

export function AccountDrawer() {
  const { isAccountDrawerOpen, closeAccountDrawer, theme, toggleTheme } = useUIStore();
  const { profile, isLoggedIn, logout } = useUserStore();
  const pathname = usePathname();

  function handleLogout() {
    logout();
    closeAccountDrawer();
  }

  return (
    <>
      {isAccountDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={closeAccountDrawer}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          'fixed top-0 left-0 z-50 h-full w-full max-w-xs bg-white shadow-2xl flex flex-col transition-transform duration-300',
          isAccountDrawerOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        aria-label="Личный кабинет"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <User className="size-5 text-orange-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {profile.name || 'Гость'}
              </p>
              {isLoggedIn && profile.phone && (
                <p className="text-xs text-gray-500 truncate">{profile.phone}</p>
              )}
            </div>
          </div>
          <button
            onClick={closeAccountDrawer}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 ml-2"
            aria-label="Закрыть"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={closeAccountDrawer}
                className={[
                  'flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors',
                  isActive
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50',
                ].join(' ')}
              >
                <Icon className="size-4 shrink-0" />
                <span className="flex-1">{label}</span>
                <ChevronRight className="size-3.5 text-gray-400 shrink-0" />
              </Link>
            );
          })}
        </nav>

        {/* Footer: theme toggle + logout */}
        <div className="border-t border-gray-100 px-3 py-3 space-y-0.5">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {theme === 'dark'
              ? <Sun className="size-4 text-yellow-500" />
              : <Moon className="size-4 text-gray-500" />}
            <span className="flex-1 text-left">{theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="size-4" />
            <span>Выйти из аккаунта</span>
          </button>
        </div>
      </aside>
    </>
  );
}
