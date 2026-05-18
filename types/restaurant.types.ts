/**
 * Restaurant domain types — defines data shapes for restaurants,
 * menu categories, and menu items used throughout the app.
 */

export enum RestaurantCategory {
  Pizza = 'pizza',
  Sushi = 'sushi',
  Burgers = 'burgers',
  Salads = 'salads',
  Drinks = 'drinks',
  Desserts = 'desserts',
  Asian = 'asian',
  Georgian = 'georgian',
  Shawarma = 'shawarma',
}

export const RESTAURANT_CATEGORY_LABELS: Record<RestaurantCategory, string> = {
  [RestaurantCategory.Pizza]: 'Пицца',
  [RestaurantCategory.Sushi]: 'Суши',
  [RestaurantCategory.Burgers]: 'Бургеры',
  [RestaurantCategory.Salads]: 'Салаты',
  [RestaurantCategory.Drinks]: 'Напитки',
  [RestaurantCategory.Desserts]: 'Десерты',
  [RestaurantCategory.Asian]: 'Азиатская',
  [RestaurantCategory.Georgian]: 'Грузинская',
  [RestaurantCategory.Shawarma]: 'Шаурма',
};

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  coverImageUrl: string;
  city: string;
  rating: number;
  reviewCount: number;
  deliveryTime: number;    // minutes
  deliveryFee: number;     // kopecks (0 = free)
  minimumOrder: number;    // kopecks
  categories: RestaurantCategory[];
  isOpen: boolean;
  promoText?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  restaurantId: string;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;           // kopecks
  categoryId: string;
  restaurantId: string;
  isAvailable: boolean;
  weight?: string;         // e.g. "350г"
  calories?: number;
}

export interface RestaurantWithMenu extends Restaurant {
  menuCategories: MenuCategory[];
  menuItems: MenuItem[];
}
