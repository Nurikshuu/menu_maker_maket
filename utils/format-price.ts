/**
 * Price and time formatting utilities.
 * All monetary values are stored as integers in tiyn (100 tiyn = 1 KZT).
 */

const TIYN_PER_TENGE = 100;

export function formatPrice(tiyn: number): string {
  const tenge = tiyn / TIYN_PER_TENGE;
  return new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(tenge);
}

export function formatDeliveryTime(minutes: number): string {
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (remainder === 0) return `${hours} ч`;
  return `${hours} ч ${remainder} мин`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatReviewCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

export function formatDeliveryFee(tiyn: number): string {
  if (tiyn === 0) return 'Бесплатно';
  return formatPrice(tiyn);
}
