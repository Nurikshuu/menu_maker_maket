/**
 * Form validation utilities for checkout fields.
 * Pure functions with no side effects.
 */

const PHONE_DIGIT_LENGTH = 11;
const MIN_ADDRESS_LENGTH = 10;
const MIN_NAME_LENGTH = 2;

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return (
    digits.length === PHONE_DIGIT_LENGTH &&
    (digits.startsWith('7') || digits.startsWith('8'))
  );
}

export function isValidAddress(address: string): boolean {
  return address.trim().length >= MIN_ADDRESS_LENGTH;
}

export function isValidName(name: string): boolean {
  return name.trim().length >= MIN_NAME_LENGTH;
}

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';

  // Normalise to start with 7
  const normalised =
    digits.startsWith('8') ? '7' + digits.slice(1)
    : digits.startsWith('7') ? digits
    : '7' + digits;

  if (normalised.length <= 1) return '+7';
  if (normalised.length <= 4) return `+7 (${normalised.slice(1)}`;
  if (normalised.length <= 7) return `+7 (${normalised.slice(1, 4)}) ${normalised.slice(4)}`;
  if (normalised.length <= 9) return `+7 (${normalised.slice(1, 4)}) ${normalised.slice(4, 7)}-${normalised.slice(7)}`;
  return `+7 (${normalised.slice(1, 4)}) ${normalised.slice(4, 7)}-${normalised.slice(7, 9)}-${normalised.slice(9, 11)}`;
}
