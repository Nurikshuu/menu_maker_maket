/**
 * CitySelectModal — modal for picking a city. Opens from the Header.
 * Updates selectedCity in the UI store and redirects to the city page.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store/ui.store';
import { CITIES } from '@/constants/delivery.constants';
import { ROUTES } from '@/constants/routes.constants';
import { Modal } from '@/components/ui/modal';

export function CitySelectModal() {
  const { isCityModalOpen, closeCityModal, selectedCity, setSelectedCity } = useUIStore();
  const router = useRouter();

  function handleSelect(slug: string) {
    setSelectedCity(slug);
    router.push(ROUTES.CITY(slug));
  }

  return (
    <Modal isOpen={isCityModalOpen} onClose={closeCityModal} title="Выберите город">
      <ul className="mt-2 space-y-1">
        {CITIES.map((city) => (
          <li key={city.id}>
            <button
              onClick={() => handleSelect(city.slug)}
              className={[
                'w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors',
                selectedCity === city.slug
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50',
              ].join(' ')}
            >
              {city.name}
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
