/** Shared helpers for the tax deduction calculators. */
import type { FormReader } from './form';
import type { FilingStatus, TaxYear } from '../calc/tax';

export interface TaxBasics {
  year: TaxYear;
  status: FilingStatus;
  agi: number;
  itemized: number;
  people65: number;
}

export function readTaxBasics(f: FormReader): TaxBasics {
  const year = (Number(f.str('year')) === 2025 ? 2025 : 2026) as TaxYear;
  const status = (['single', 'mfj', 'hoh', 'mfs'].includes(f.str('status')) ? f.str('status') : 'single') as FilingStatus;
  const maxPeople = status === 'mfj' ? 2 : 1;
  return {
    year,
    status,
    agi: f.num('agi'),
    itemized: f.num('itemized'),
    people65: Math.min(Number(f.str('age65')) || 0, maxPeople),
  };
}
