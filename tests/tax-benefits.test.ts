import { describe, expect, it } from 'vitest';
import {
  carLoanInterestDeduction,
  federalTax,
  marginalRate,
  overtimeDeduction,
  qualifiedOvertimeFromHours,
  seniorDeduction,
  taxSavings,
  tipsDeduction,
} from '../src/lib/calc/tax';
import { acaSubsidy, applicablePercentage, APPLICABLE_2026, irmaa, povertyLine, ssdiBackPay } from '../src/lib/calc/benefits';

describe('federal tax', () => {
  it('computes bracket tax (2026 single)', () => {
    // 12,400 × 10% + (50,400 − 12,400) × 12% + (60,000 − 50,400) × 22%
    expect(federalTax(60000, 2026, 'single')).toBeCloseTo(1240 + 4560 + 2112, 6);
    expect(marginalRate(60000, 2026, 'single')).toBe(22);
    expect(marginalRate(0, 2026, 'mfj')).toBe(0);
  });
});

describe('OBBBA deductions', () => {
  it('caps and phases out tips', () => {
    expect(tipsDeduction(30000, 100000, 'single').allowed).toBe(25000);
    // $10,500 over → 10 × $100 = $1,000 reduction
    expect(tipsDeduction(20000, 160500, 'single').allowed).toBe(19000);
    expect(tipsDeduction(20000, 100000, 'mfs').ineligible).toBe(true);
  });
  it('caps overtime by filing status', () => {
    expect(overtimeDeduction(20000, 100000, 'single').allowed).toBe(12500);
    expect(overtimeDeduction(30000, 100000, 'mfj').allowed).toBe(25000);
    expect(qualifiedOvertimeFromHours(30, 200)).toBe(3000);
  });
  it('phases out car loan interest $200 per $1,000 or part', () => {
    expect(carLoanInterestDeduction(4000, 90000, 'single').allowed).toBe(4000);
    // $1,500 over → 2 steps × $200 = $400
    expect(carLoanInterestDeduction(4000, 101500, 'single').allowed).toBe(3600);
    expect(carLoanInterestDeduction(12000, 150000, 'mfj').allowed).toBe(10000);
  });
  it('phases out the senior deduction at 6% per person', () => {
    expect(seniorDeduction(1, 60000, 'single').allowed).toBe(6000);
    expect(seniorDeduction(2, 200000, 'mfj').allowed).toBeCloseTo(6000, 6); // (6000 − 3000) × 2
    expect(seniorDeduction(1, 175000, 'single').allowed).toBe(0);
  });
  it('computes savings as tax before minus tax after', () => {
    const r = taxSavings({ year: 2026, status: 'single', agi: 90000, itemized: 0, people65: 0, otherDeductions: 0, deduction: 5000 });
    expect(r.taxableBefore).toBe(90000 - 16100);
    expect(r.savings).toBeCloseTo(5000 * 0.22, 6);
    // A deduction that crosses a bracket line: 3,500 at 22% + 1,500 at 12%.
    const x = taxSavings({ year: 2026, status: 'single', agi: 70000, itemized: 0, people65: 0, otherDeductions: 0, deduction: 5000 });
    expect(x.savings).toBeCloseTo(3500 * 0.22 + 1500 * 0.12, 6);
  });
});

describe('ACA 2026', () => {
  it('uses the 2025 poverty guidelines', () => {
    expect(povertyLine(1, 'contiguous')).toBe(15650);
    expect(povertyLine(4, 'contiguous')).toBe(32150);
  });
  it('interpolates the applicable percentage', () => {
    expect(applicablePercentage(175, APPLICABLE_2026)).toBeCloseTo(4.19 + 0.5 * (6.6 - 4.19), 6);
    expect(applicablePercentage(400, APPLICABLE_2026)).toBe(9.96);
    expect(applicablePercentage(401, APPLICABLE_2026)).toBeNull();
  });
  it('computes the credit against the benchmark and the cliff', () => {
    const r = acaSubsidy({ householdSize: 1, magi: 40000, region: 'contiguous', benchmarkMonthly: 600, planMonthly: 0, schedule: 'current' });
    expect(r.eligible).toBe(true);
    expect(r.creditMonthly).toBeCloseTo(600 - (40000 * (r.applicablePercent as number)) / 100 / 12, 6);
    const over = acaSubsidy({ householdSize: 1, magi: 70000, region: 'contiguous', benchmarkMonthly: 600, planMonthly: 0, schedule: 'current' });
    expect(over.aboveCliff).toBe(true);
    expect(over.creditMonthly).toBe(0);
    const enhanced = acaSubsidy({ householdSize: 1, magi: 70000, region: 'contiguous', benchmarkMonthly: 900, planMonthly: 0, schedule: 'enhanced' });
    expect(enhanced.creditMonthly).toBeCloseTo(900 - (70000 * 0.085) / 12, 6);
  });
});

describe('IRMAA', () => {
  it('matches the 2026 tables', () => {
    expect(irmaa(100000, 'individual', 2026).partBMonthly).toBe(202.9);
    expect(irmaa(109000, 'individual', 2026).tierIndex).toBe(0);
    expect(irmaa(109001, 'individual', 2026).partBMonthly).toBe(284.1);
    expect(irmaa(300000, 'joint', 2026).partBMonthly).toBe(405.8);
    expect(irmaa(600000, 'individual', 2026).partDSurcharge).toBe(91);
    expect(irmaa(200000, 'mfs', 2026).partBMonthly).toBe(649.2);
    expect(irmaa(391000, 'mfs', 2026).partBMonthly).toBe(689.9);
  });
  it('Part B IRMAA amounts are the standard premium × statutory multipliers', () => {
    // Beneficiaries pay 35/50/65/80/85% of cost vs 25% standard → 1.4×, 2×, 2.6×, 3.2×, 3.4×.
    for (const year of [2025, 2026] as const) {
      const std = irmaa(0, 'individual', year).standardB;
      const incomes = [120000, 150000, 190000, 300000, 600000];
      [1.4, 2.0, 2.6, 3.2, 3.4].forEach((m, k) => {
        expect(Math.abs(irmaa(incomes[k], 'individual', year).partBMonthly - std * m)).toBeLessThanOrEqual(0.15);
      });
    }
  });
});

describe('SSDI back pay', () => {
  it('applies the 5-month waiting period and back pay through the month before approval', () => {
    const r = ssdiBackPay({ onset: '2025-01-15', applied: '2025-03-01', approved: '2026-03-10', monthlyBenefit: 1800, hasRepresentative: true, als: false });
    // First full month Feb 2025; entitlement July 2025; past-due Jul 2025 – Feb 2026 = 8 months.
    expect(r.months).toBe(8);
    expect(r.backPay).toBe(14400);
    expect(r.fee).toBe(3600);
  });
  it('limits retroactive benefits to 12 months before the application', () => {
    const r = ssdiBackPay({ onset: '2020-01-01', applied: '2025-06-01', approved: '2025-12-01', monthlyBenefit: 1000, hasRepresentative: true, als: false });
    expect(r.retroCapped).toBe(true);
    // June 2024 → Nov 2025 = 18 months
    expect(r.months).toBe(18);
    expect(r.fee).toBe(4500);
  });
  it('caps the representative fee', () => {
    const r = ssdiBackPay({ onset: '2023-01-01', applied: '2023-02-01', approved: '2026-01-01', monthlyBenefit: 2500, hasRepresentative: true, als: false });
    expect(r.fee).toBe(9200);
  });
});
