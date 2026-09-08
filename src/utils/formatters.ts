/**
 * BrandFlow Pro Standard Formatters
 * Centralized formatting procedures for currency, numbers, and dates.
 */

/**
 * Formats a number into South African Rand (ZAR) currency string: e.g. "R 1,250.00" or "R 1,250"
 * @param amount Number to format
 * @param options Configuration for decimals and negative sign
 */
export function formatRands(
  amount: number | null | undefined,
  options: { decimals?: boolean; showZero?: boolean } = {}
): string {
  const num = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const { decimals = false } = options;

  const isNegative = num < 0;
  const absVal = Math.abs(num);

  const formattedNum = decimals
    ? absVal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : absVal.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      });

  return isNegative ? `-R ${formattedNum}` : `R ${formattedNum}`;
}

/**
 * Formats an integer or float with thousands separators (e.g. 5000 -> "5,000")
 */
export function formatNumber(
  value: number | null | undefined,
  fractionDigits: number = 0
): string {
  const num = typeof value === 'number' && !isNaN(value) ? value : 0;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

/**
 * Formats a date or ISO string into readable format: "YYYY-MM-DD"
 */
export function formatDate(date: string | number | Date | null | undefined): string {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    if (isNaN(d.getTime())) return String(date);
    return d.toISOString().split('T')[0];
  } catch {
    return String(date);
  }
}

/**
 * Formats a date into a standard timestamp string: "YYYY-MM-DD HH:mm:ss"
 */
export function formatTimestamp(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
