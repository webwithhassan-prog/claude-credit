/**
 * Core loan math shared by the calculators. Pure functions only — no DOM —
 * so everything here is unit-tested in tests/.
 *
 * Conventions: rates are annual percentages (e.g. 7.5 for 7.5%), money is in
 * dollars (floats, rounded only for display), periods are months unless named.
 */

export const monthlyRate = (aprPercent: number) => aprPercent / 100 / 12;

/** Fixed payment that fully amortizes `principal` over `months` at `aprPercent`. */
export function amortizedPayment(principal: number, aprPercent: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = monthlyRate(aprPercent);
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

/** Payment with a balloon: amortizes `principal - PV(balloon)` over `months`. */
export function paymentWithBalloon(principal: number, aprPercent: number, months: number, balloon: number): number {
  if (months <= 0) return 0;
  const r = monthlyRate(aprPercent);
  if (r === 0) return (principal - balloon) / months;
  const pvBalloon = balloon / Math.pow(1 + r, months);
  return amortizedPayment(principal - pvBalloon, aprPercent, months);
}

export interface ScheduleRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface PayoffResult {
  /** Months until balance reaches zero; Infinity if the payment never covers interest. */
  months: number;
  totalInterest: number;
  totalPaid: number;
  schedule: ScheduleRow[];
  /** True when the payment is too small to ever pay the balance off. */
  neverPaysOff: boolean;
}

/**
 * Simulates paying a revolving/instalment balance with a fixed monthly payment.
 * Interest accrues monthly at APR/12 on the balance before the payment is applied.
 */
export function payoffWithFixedPayment(
  balance: number,
  aprPercent: number,
  payment: number,
  maxMonths = 1200,
): PayoffResult {
  const r = monthlyRate(aprPercent);
  const schedule: ScheduleRow[] = [];
  if (balance <= 0) return { months: 0, totalInterest: 0, totalPaid: 0, schedule, neverPaysOff: false };
  if (payment <= balance * r) {
    return { months: Infinity, totalInterest: Infinity, totalPaid: Infinity, schedule, neverPaysOff: true };
  }
  let bal = balance;
  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;
  while (bal > 0.005 && month < maxMonths) {
    month++;
    const interest = bal * r;
    const pay = Math.min(payment, bal + interest);
    const principal = pay - interest;
    bal = bal + interest - pay;
    totalInterest += interest;
    totalPaid += pay;
    schedule.push({ month, payment: pay, interest, principal, balance: Math.max(bal, 0) });
  }
  return { months: month, totalInterest, totalPaid, schedule, neverPaysOff: false };
}

/** Full amortization schedule for a fixed-payment loan. */
export function amortizationSchedule(principal: number, aprPercent: number, months: number): PayoffResult {
  const pay = amortizedPayment(principal, aprPercent, months);
  return payoffWithFixedPayment(principal, aprPercent, pay + 1e-9, months + 1);
}

/** Number of months to pay off `balance` with `payment` (closed form). Infinity if never. */
export function monthsToPayoff(balance: number, aprPercent: number, payment: number): number {
  if (balance <= 0) return 0;
  const r = monthlyRate(aprPercent);
  if (r === 0) return payment > 0 ? Math.ceil(balance / payment) : Infinity;
  if (payment <= balance * r) return Infinity;
  const n = -Math.log(1 - (r * balance) / payment) / Math.log(1 + r);
  return Math.ceil(n - 1e-9);
}

/** Maximum principal a given monthly payment can support. */
export function principalFromPayment(payment: number, aprPercent: number, months: number): number {
  if (payment <= 0 || months <= 0) return 0;
  const r = monthlyRate(aprPercent);
  if (r === 0) return payment * months;
  return (payment * (1 - Math.pow(1 + r, -months))) / r;
}

/**
 * Internal rate of return per period for a cash-flow series (first flow usually
 * negative = money received by borrower as positive, payments negative — sign
 * convention is irrelevant as long as flows change sign). Uses bisection on the
 * NPV, which is robust for the single-sign-change flows we produce.
 */
export function irrPerPeriod(flows: number[], lo = -0.9999, hi = 10): number {
  const npv = (rate: number) => flows.reduce((acc, cf, i) => acc + cf / Math.pow(1 + rate, i), 0);
  let fLo = npv(lo);
  let fHi = npv(hi);
  if (Number.isNaN(fLo) || Number.isNaN(fHi) || fLo * fHi > 0) return NaN;
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    const fMid = npv(mid);
    if (Math.abs(fMid) < 1e-10) return mid;
    if (fLo * fMid < 0) {
      hi = mid;
      fHi = fMid;
    } else {
      lo = mid;
      fLo = fMid;
    }
  }
  return (lo + hi) / 2;
}

/**
 * APR of a loan where the borrower receives `netProceeds` (after fees) and repays
 * `payment` every period for `periods` periods, with `periodsPerYear` periods per year.
 * This mirrors the U.S. Truth in Lending (Reg Z) actuarial APR definition.
 */
export function aprFromPayments(
  netProceeds: number,
  payment: number,
  periods: number,
  periodsPerYear: number,
  balloon = 0,
): number {
  if (netProceeds <= 0 || periods <= 0) return NaN;
  const flows = [-netProceeds];
  for (let i = 1; i <= periods; i++) flows.push(payment + (i === periods ? balloon : 0));
  const r = irrPerPeriod(flows, -0.99, 5);
  return r * periodsPerYear * 100;
}

/** Effective annual rate from a nominal APR compounded `n` times per year. */
export const effectiveAnnualRate = (aprPercent: number, n = 12) => (Math.pow(1 + aprPercent / 100 / n, n) - 1) * 100;

/**
 * Interest paid during calendar `year` on a fixed-payment loan whose first
 * payment falls in `firstYear`/`firstMonth` (1–12).
 */
export function interestPaidInYear(
  principal: number,
  aprPercent: number,
  months: number,
  firstYear: number,
  firstMonth: number,
  year: number,
): number {
  const pay = amortizedPayment(principal, aprPercent, months);
  const r = monthlyRate(aprPercent);
  let bal = principal;
  let total = 0;
  for (let k = 0; k < months && bal > 0.005; k++) {
    const idx = firstYear * 12 + (firstMonth - 1) + k;
    const y = Math.floor(idx / 12);
    const interest = bal * r;
    bal = bal + interest - Math.min(pay, bal + interest);
    if (y === year) total += interest;
    if (y > year) break;
  }
  return total;
}
