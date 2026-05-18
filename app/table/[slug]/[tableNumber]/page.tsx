'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, Clock, Bike, ChevronLeft, ShoppingBag, Users, QrCode } from 'lucide-react';

export async function generateStaticParams() {
  return [];
}
import Link from 'next/link';
import { getRestaurantBySlug } from '@/services/restaurant.service';
import type { RestaurantWithMenu, MenuCategory, MenuItem } from '@/types/restaurant.types';
import { MenuItemCard } from '@/components/restaurant/MenuItemCard';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRating, formatDeliveryTime, formatDeliveryFee } from '@/utils/format-price';
import { ROUTES } from '@/constants/routes.constants';
import { useTableStore } from '@/store/table.store';
import { useUIStore } from '@/store/ui.store';
import { JoinTableModal } from '@/components/table/JoinTableModal';
import { TableCartDrawer } from '@/components/table/TableCartDrawer';

export default function TablePage() {
  const params = useParams<{ slug: string; tableNumber: string }>();
  const router = useRouter();
  const { addToast } = useUIStore();
  const tableStore = useTableStore();

  const [restaurant, setRestaurant] = useState<RestaurantWithMenu | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const session = tableStore.session;
  const sessionId = `${params.slug}-t${params.tableNumber}`;
  const isJoined =
    session?.sessionId === sessionId && session?.currentParticipantId !== null;

  useEffect(() => {
    async function load() {
      try {
        const data = await getRestaurantBySlug(params.slug);
        setRestaurant(data);
        if (data?.menuCategories[0]) setActiveCategory(data.menuCategories[0].id);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [params.slug]);

  function handleJoin(name: string) {
    if (!restaurant) return;
    tableStore.joinTable(
      restaurant.id,
      restaurant.slug,
      restaurant.name,
      params.tableNumber,
      name,
    );
    addToast(`Добро пожаловать, ${name}!`, 'success');
  }

  function handleConfirmOrder() {
    setIsDrawerOpen(false);
    addToast('Заказ отправлен на кухню!', 'success');
    tableStore.leaveTable();
    router.replace(ROUTES.HOME);
  }

  function scrollToCategory(catId: string) {
    setActiveCategory(catId);
    sectionRefs.current[catId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function getItemQuantity(menuItem: MenuItem): number {
    if (!session || !session.currentParticipantId) return 0;
    return (
      session.items
        .filter(
          (i) => i.menuItem.id === menuItem.id && i.participantId === session.currentParticipantId,
        )
        .reduce((sum, i) => sum + i.quantity, 0)
    );
  }

  if (isLoading) return <TablePageSkeleton />;

  if (!restaurant) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Ресторан не найден</p>
      </main>
    );
  }

  const existingNames =
    session?.sessionId === sessionId
      ? session.participants.map((p) => p.name)
      : [];

  const totalCount = tableStore.getTotalItemCount();
  const currentCount = tableStore.getCurrentParticipantItemCount();

  const categoriesWithItems = restaurant.menuCategories.filter((cat) =>
    restaurant.menuItems.some((item) => item.categoryId === cat.id && item.isAvailable),
  );

  return (
    <>
      <main>
        {/* Dine-in banner */}
        <div className="bg-blue-600 text-white text-center py-2 px-4">
          <div className="flex items-center justify-center gap-2 text-sm">
            <QrCode className="size-4" />
            <span>
              Дine-in · {restaurant.name} · Стол {params.tableNumber}
            </span>
            {isJoined && session && (
              <span className="flex items-center gap-1 ml-2 bg-white/20 rounded-full px-2 py-0.5 text-xs">
                <Users className="size-3" />
                {session.participants.length}
              </span>
            )}
          </div>
        </div>

        {/* Cover */}
        <div className="relative h-40 sm:h-56 overflow-hidden bg-gray-200">
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
              <ChevronLeft className="size-4" /> На главную
            </Link>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">{restaurant.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-white/90">
              <span className="flex items-center gap-1">
                <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                {formatRating(restaurant.rating)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {formatDeliveryTime(restaurant.deliveryTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
          <div className="flex gap-1 overflow-x-auto px-4 py-2 no-scrollbar">
            {categoriesWithItems.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={[
                  'shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap',
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                ].join(' ')}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu content */}
        <div className="mx-auto max-w-3xl px-4 py-6 space-y-8 pb-32">
          {categoriesWithItems.map((cat) => {
            const items = restaurant.menuItems.filter(
              (item) => item.categoryId === cat.id && item.isAvailable,
            );
            if (items.length === 0) return null;
            return (
              <section
                key={cat.id}
                ref={(el) => { sectionRefs.current[cat.id] = el; }}
              >
                <h2 className="text-lg font-bold text-gray-900 mb-3">{cat.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      restaurant={restaurant}
                      onAdd={isJoined ? (mi) => tableStore.addItem(mi) : undefined}
                      addedQuantity={isJoined ? getItemQuantity(item) : undefined}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {/* Floating cart button */}
      {isJoined && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-30">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-3 rounded-2xl bg-blue-600 px-6 py-3.5 text-white shadow-xl hover:bg-blue-700 transition-all active:scale-95"
          >
            <ShoppingBag className="size-5" />
            <span className="font-bold">
              {totalCount > 0 ? `Заказ (${totalCount} поз.)` : 'Открыть заказ'}
            </span>
            {currentCount > 0 && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                Ваших: {currentCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Join modal */}
      {!isJoined && !isLoading && (
        <JoinTableModal
          restaurantName={restaurant.name}
          tableNumber={params.tableNumber}
          existingParticipants={existingNames}
          onJoin={handleJoin}
        />
      )}

      {/* Table cart drawer */}
      <TableCartDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onConfirmOrder={handleConfirmOrder}
      />
    </>
  );
}

function TablePageSkeleton() {
  return (
    <main>
      <div className="h-8 bg-blue-600" />
      <Skeleton className="h-40 sm:h-56 w-full rounded-none" />
      <div className="border-b border-gray-100 px-4 py-2 flex gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        {[1, 2].map((i) => (
          <div key={i}>
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="h-28 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
