const AMOUNT_PATTERN = /^\d*\.?\d{0,8}$/;

/**
 * Sanitizes free-typed amount input, allowing only digits and a single
 * decimal point (up to 8 decimal places). Returns `undefined` when the
 * candidate value should be rejected (i.e. the keystroke is discarded).
 */
export const sanitizeAmountInput = (raw: string): string | undefined => {
  const normalized = raw.replace(',', '.').trim();
  if (normalized === '') return '';
  if (!AMOUNT_PATTERN.test(normalized)) return undefined;
  return normalized.startsWith('.') ? `0${normalized}` : normalized;
};

/**
 * Check if the number is valid or not
 * @param value Number to check
 * @returns The number is positive or not
 */
export const isPositiveNumber = (value: string): boolean => {
  if (value === '') {
    return false;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0;
};
