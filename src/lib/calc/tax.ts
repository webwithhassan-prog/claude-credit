/**
 * U.S. federal income tax helpers and the 2025–2028 deductions created by the
 * One Big Beautiful Bill Act (Public Law 119-21, signed July 4, 2025):
 * no tax on tips, no tax on overtime, car loan interest, and the senior deduction.
 *
 * Figures: 2025 brackets from Rev. Proc. 2024-40 with the OBBBA standard deduction;
 * 2026 brackets and standard deduction from Rev. Proc. 2025-32.
 * Every figure here is listed with its source in docs/DATA-SOURCES.md — re-verify each tax year.
 */

export type FilingStatus = 'single' | 'mfj' | 'hoh' | 'mfs';
export type TaxYear = 2025 | 2026;

export const TAX_YEARS: TaxYear[] = [2026, 2025];

export const FILING_STATUS_LABELS: Record<FilingStatus, string> = {
  single: 'Single',
  mfj: 'Married filing jointly',
  hoh: 'Head of household',
  mfs: 'Married filing separately',
};

const RATES = [10, 12, 22, 24, 32, 35, 37];

/** Upper bound of each bracket except the last (37%) one. */
const BRACKETS: Record<TaxYear, Record<FilingStatus, number[]>> = {
  2025: {
    single: [11925, 48475, 103350, 197300, 250525, 626350],
    mfj: [23850, 96950, 206700, 394600, 501050, 751600],
    hoh: [17000, 64850, 103350, 197300, 250500, 626350],
    mfs: [11925, 48475, 103350, 197300, 250525, 375800],
  },
  2026: {
    single: [12400, 50400, 105700, 201775, 256225, 640600],
    mfj: [24800, 100800, 211400, 403550, 512450, 768700],
    hoh: [17700, 67450, 105700, 201750, 256200, 640600],
    mfs: [12400, 50400, 105700, 201775, 256225, 384350],
  },
};

export const STANDARD_DEDUCTION: Record<TaxYear, Record<FilingStatus, number>> = {
  2025: { single: 15750, mfj: 31500, hoh: 23625, mfs: 15750 },
  2026: { single: 16100, mfj: 32200, hoh: 24150, mfs: 16100 },
};

/** Additional standard deduction per person aged 65+ (or blind). */
export const ADDITIONAL_65: Record<TaxYear, { married: number; unmarried: number }> = {
  2025: { married: 1600, unmarried: 2000 },
  2026: { married: 1650, unmarried: 2050 },
};

export function federalTax(taxableIncome: number, year: TaxYear, status: FilingStatus): number {
  if (taxableIncome <= 0) return 0;
  const bounds = BRACKETS[year][status];
  let tax = 0;
  let lower = 0;
  for (let k = 0; k < RATES.length; k++) {
    const upper = k < bounds.length ? bounds[k] : Infinity;
    if (taxableIncome > lower) {
      tax += ((Math.min(taxableIncome, upper) - lower) * RATES[k]) / 100;
    }
    lower = upper;
  }
  return tax;
}

export function marginalRate(taxableIncome: number, year: TaxYear, status: FilingStatus): number {
  if (taxableIncome <= 0) return 0;
  const bounds = BRACKETS[year][status];
  for (let k = 0; k < bounds.length; k++) if (taxableIncome <= bounds[k]) return RATES[k];
  return 37;
}

export function standardDeduction(year: TaxYear, status: FilingStatus, people65: number): number {
  const married = status === 'mfj' || status === 'mfs';
  const extra = ADDITIONAL_65[year][married ? 'married' : 'unmarried'];
  return STANDARD_DEDUCTION[year][status] + people65 * extra;
}

/* ------------------------------------------------------------------------ */
/* OBBBA deductions (tax years 2025–2028)                                     */
/* ------------------------------------------------------------------------ */

const isJoint = (s: FilingStatus) => s === 'mfj';

/** No tax on tips: up to $25,000; reduced $100 per $1,000 of MAGI over $150k ($300k joint). */
export function tipsDeduction(qualifiedTips: number, magi: number, status: FilingStatus) {
  if (status === 'mfs') return { allowed: 0, cap: 25000, reduction: 0, ineligible: true };
  const cap = 25000;
  const threshold = isJoint(status) ? 300000 : 150000;
  const capped = Math.min(Math.max(qualifiedTips, 0), cap);
  const reduction = magi > threshold ? Math.floor((magi - threshold) / 1000) * 100 : 0;
  return { allowed: Math.max(0, capped - reduction), cap, reduction, ineligible: false };
}

/** No tax on overtime: up to $12,500 ($25,000 joint); reduced $100 per $1,000 of MAGI over $150k ($300k joint). */
export function overtimeDeduction(qualifiedOvertime: number, magi: number, status: FilingStatus) {
  if (status === 'mfs') return { allowed: 0, cap: 12500, reduction: 0, ineligible: true };
  const cap = isJoint(status) ? 25000 : 12500;
  const threshold = isJoint(status) ? 300000 : 150000;
  const capped = Math.min(Math.max(qualifiedOvertime, 0), cap);
  const reduction = magi > threshold ? Math.floor((magi - threshold) / 1000) * 100 : 0;
  return { allowed: Math.max(0, capped - reduction), cap, reduction, ineligible: false };
}

/**
 * Qualified overtime = only the FLSA-required premium: half the regular rate for
 * each FLSA overtime hour (hours over 40 in a workweek). Double-time premiums
 * paid under state law or contract do not count beyond that half.
 */
export function qualifiedOvertimeFromHours(regularRate: number, flsaOvertimeHours: number) {
  return Math.max(0, regularRate) * 0.5 * Math.max(0, flsaOvertimeHours);
}

/** Car loan interest: up to $10,000; reduced $200 per $1,000 (or part) of MAGI over $100k ($200k joint). */
export function carLoanInterestDeduction(interestPaid: number, magi: number, status: FilingStatus) {
  const cap = 10000;
  const threshold = isJoint(status) ? 200000 : 100000;
  const capped = Math.min(Math.max(interestPaid, 0), cap);
  const reduction = magi > threshold ? Math.ceil((magi - threshold) / 1000) * 200 : 0;
  return { allowed: Math.max(0, capped - reduction), cap, reduction, ineligible: false };
}

/** Senior deduction: $6,000 per person 65+; reduced by 6% of MAGI over $75k ($150k joint). */
export function seniorDeduction(qualifyingPeople: number, magi: number, status: FilingStatus) {
  if (status === 'mfs') return { allowed: 0, cap: 6000, reduction: 0, ineligible: true };
  const people = Math.min(Math.max(Math.round(qualifyingPeople), 0), isJoint(status) ? 2 : 1);
  const threshold = isJoint(status) ? 150000 : 75000;
  const reductionEach = magi > threshold ? 0.06 * (magi - threshold) : 0;
  const perPerson = Math.max(0, 6000 - reductionEach);
  return { allowed: perPerson * people, cap: 6000 * people, reduction: reductionEach, ineligible: false, people };
}

/** Year the 2025–2028 temporary deductions are available. */
export const OBBBA_YEARS = [2025, 2026, 2027, 2028];

export interface SavingsInput {
  year: TaxYear;
  status: FilingStatus;
  /** Adjusted gross income (used as MAGI for most U.S. residents). */
  agi: number;
  /** Itemized deductions total; 0 = take the standard deduction. */
  itemized: number;
  people65: number;
  /** Other below-the-line deductions already claimed (e.g. other new OBBBA deductions). */
  otherDeductions: number;
  /** The new deduction being evaluated. */
  deduction: number;
}

/** Federal income tax saved by a below-the-line deduction (does not reduce AGI). */
export function taxSavings(i: SavingsInput) {
  const base = Math.max(standardDeduction(i.year, i.status, i.people65), i.itemized);
  const taxableBefore = Math.max(0, i.agi - base - i.otherDeductions);
  const taxableAfter = Math.max(0, taxableBefore - i.deduction);
  const before = federalTax(taxableBefore, i.year, i.status);
  const after = federalTax(taxableAfter, i.year, i.status);
  return {
    baseDeduction: base,
    taxableBefore,
    taxableAfter,
    taxBefore: before,
    taxAfter: after,
    savings: before - after,
    marginal: marginalRate(taxableBefore, i.year, i.status),
  };
}
