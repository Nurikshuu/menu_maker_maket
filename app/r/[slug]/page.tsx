export async function generateStaticParams() {
  return [];
}

'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { Star, Clock, Bike, ChevronLeft, QrCode } from 'lucide-react';
import Link from 'next/link';
import { getRestaurantBySlug } from '@/services/restaurant.service';
import type { RestaurantWithMenu, MenuCategory } from '@/types/restaurant.types';
import { MenuItemCard } from '@/components/restaurant/MenuItemCard';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRating, formatDeliveryTime, formatDeliveryFee, formatPrice } from '@/utils/format-price';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes.constants';

// Load the QR/camera modal only when the user opens it
const TableModal = dynamic(() => import('@/components/restaurant/TableModal').then(m => ({ default: m.TableModal })), { ssr: false });

export default function RestaurantPage() {
  const params = useParams<{ slug: string }>();
  const [restaurant, setRestaurant] = useState<RestaurantWithMenu | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    async function load() {
      try {
        const data = await getRestaurantBySlug(params.slug);
        setRestaurant(data);
        if (data?.menuCategories[0]) {
          setActiveCategory(data.menuCategories[0].id);
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [params.slug]);

  function scrollToCategory(catId: string) {
    setActiveCategory(catId);
    sectionRefs.current[catId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (isLoading) return <RestaurantPageSkeleton />;

  if (!restaurant) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Ресторан не найден</p>
      </main>
    );
  }

  return (
    <>
      {tableModalOpen && (
        <TableModal
          restaurantSlug={restaurant.slug}
          onClose={() => setTableModalOpen(false)}
        />
      )}
      <main>
        {/* Cover */}
        <div className="relative h-56 sm:h-72 overflow-hidden bg-gray-200">
          <img
            src={restaurant.coverImageUrl}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Link
              href={ROUTES.HOME}
              className="mb-2 inline-flex items-center gap-1 text-white/80 hover:text-white text-sm"
            >
              <ChevronLeft className="size-4" /> Назад
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{restaurant.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-white/90">
              <span className="flex items-center gap-1">
                <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                {formatRating(restaurant.rating)} ({restaurant.reviewCount})
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" /> {formatDeliveryTime(restaurant.deliveryTime)}
              </span>
              <span className="flex items-center gap-1">
                <Bike className="size-3.5" /> {formatDeliveryFee(restaurant.deliveryFee)}
              </span>
              <span className="text-white/70">Мин: {formatPrice(restaurant.minimumOrder)}</span>
            </div>
            {!restaurant.isOpen && (
              <Badge variant="destructive" className="mt-2">Закрыто</Badge>
            )}
          </div>
        </div>

        {/* Dine-in banner */}
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
          <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <QrCode className="size-4 shrink-0" />
              <span>Вы в ресторане? Сканируйте QR-код на столе или введите номер стола</span>
            </div>
            <button
              onClick={() => setTableModalOpen(true)}
              className="shrink-0 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5"
            >
              <QrCode className="size-3.5" />
              Заказать за столом
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {/* Mobile: horizontal tabs */}
          <div className="lg:hidden mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {restaurant.menuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={[
                  'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                  activeCategory === cat.id
                    ? 'border-orange-500 bg-orange-500 text-white'
                    : 'border-gray-200 bg-white text-gray-600',
                ].join(' ')}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex gap-8">
            {/* Desktop: sticky sidebar */}
            <aside className="hidden lg:block w-52 shrink-0">
              <nav className="sticky top-24 space-y-1">
                {restaurant.menuCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => scrollToCategory(cat.id)}
                    className={[
                      'w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                      activeCategory === cat.id
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:bg-gray-50',
                    ].join(' ')}
                  >
                    {cat.name}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Menu items */}
            <div className="flex-1 space-y-10">
              {restaurant.menuCategories.map((cat) => (
                <CategorySection
                  key={cat.id}
                  category={cat}
                  items={restaurant.menuItems.filter((i) => i.categoryId === cat.id)}
                  restaurant={restaurant}
                  sectionRef={(el) => { sectionRefs.current[cat.id] = el; }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function CategorySection({
  category,
  items,
  restaurant,
  sectionRef,
}: {
  category: MenuCategory;
  items: RestaurantWithMenu['menuItems'];
  restaurant: RestaurantWithMenu;
  sectionRef: (el: HTMLElement | null) => void;
}) {
  return (
    <section ref={sectionRef}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">{category.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} restaurant={restaurant} />
        ))}
      </div>
    </section>
  );
}

function RestaurantPageSkeleton() {
  return (
    <main>
      <Skeleton className="h-56 sm:h-72 w-full rounded-none" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex gap-8">
        <div className="hidden lg:block w-52 space-y-2 shrink-0">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-9 rounded-lg" />)}
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    </main>
  );
}
