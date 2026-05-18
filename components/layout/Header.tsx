/**
 * Header — top app bar with logo, city selector button, and cart icon.
 * Stays sticky at the top; cart badge animates on item count change.
 */

'use client';

import Link from 'next/link';
import { ShoppingCart, MapPin, User } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useUIStore } from '@/store/ui.store';
import { useUserStore } from '@/store/user.store';
import { ROUTES } from '@/constants/routes.constants';
import { CITIES } from '@/constants/delivery.constants';

export function Header() {
  const itemCount = useCartStore((s) => s.getTotalItemCount());
  const { openCartDrawer, openCityModal, openAccountDrawer, selectedCity } = useUIStore();
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const profileName = useUserStore((s) => s.profile.name);

  const cityLabel = CITIES.find((c) => c.slug === selectedCity)?.name ?? 'Город';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Account + City */}
        <div className="flex items-center gap-3">
          {/* Account button */}
          <button
            onClick={openAccountDrawer}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Личный кабинет"
          >
            <User className={['size-5', isLoggedIn ? 'text-orange-500' : 'text-gray-500'].join(' ')} />
            {isLoggedIn && profileName && (
              <span className="hidden sm:inline text-orange-600 font-medium">{profileName.split(' ')[0]}</span>
            )}
          </button>

          {/* City selector */}
          <button
            onClick={openCityModal}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <MapPin className="size-4 text-blue-600" />
            <span className="hidden sm:inline">{cityLabel}</span>
          </button>
        </div>

        {/* Center: Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2 shrink-0">
          <span className="text-2xl font-extrabold text-blue-600 tracking-tight">
            menu<span className="text-gray-900">maker</span>
          </span>
        </Link>

        {/* Right: Cart button */}
        <button
          onClick={openCartDrawer}
          className="relative flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:scale-95 transition-all"
          aria-label="Открыть корзину"
        >
          <ShoppingCart className="size-4" />
          <span className="hidden sm:inline">Корзина</span>
          {itemCount > 0 && (
            <span
              key={itemCount}
              className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-bounce"
            >
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
