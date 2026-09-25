/** Display formatting shared by every calculator (en-US, USD). */

const usd0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const usd2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const num0 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

export const INFINITE = '—';

/** $1,234 (or $1,234.56 when `cents`). Infinity/NaN render as an em dash. */
export function money(n: number, cents = false): string {
  if (!Number.isFinite(n)) return INFINITE;
  const v = Math.abs(n) < 0.005 ? 0 : n;
  return (cents ? usd2 : usd0).format(v);
}

/** Money with cents only when the value is small (payments), whole dollars otherwise. */
export const moneyAuto = (n: number) => money(n, Math.abs(n) < 1000);

export function moneyCompact(n: number): string {
  if (!Number.isFinite(n)) return INFINITE;
  return '$' + compact.format(n);
}

export function percent(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return INFINITE;
  return `${n.toFixed(digits)}%`;
}

export const integer = (n: number) => (Number.isFinite(n) ? num0.format(n) : INFINITE);

/** "4 years 2 months", "11 months", "1 year". */
export function duration(months: number): string {
  if (!Number.isFinite(months)) return 'Never';
  const m = Math.max(0, Math.round(months));
  const y = Math.floor(m / 12);
  const r = m % 12;
  const parts: string[] = [];
  if (y) parts.push(`${y} year${y === 1 ? '' : 's'}`);
  if (r || !y) parts.push(`${r} month${r === 1 ? '' : 's'}`);
  return parts.join(' ');
}

/** Calendar month `months` from now, e.g. "March 2029". */
export function monthFromNow(months: number, from = new Date()): string {
  if (!Number.isFinite(months)) return 'Never';
  const d = new Date(from.getFullYear(), from.getMonth() + Math.round(months), 1);
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

/** Escape user-provided text before inserting it into HTML. */
export function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
