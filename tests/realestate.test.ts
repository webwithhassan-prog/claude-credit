import { describe, expect, it } from 'vitest';
import { brrrr, operating, rentalAnalysis } from '../src/lib/calc/realestate';
import { amortizedPayment } from '../src/lib/calc/loan';

const ops = {
  rent: 2200, otherIncome: 0, vacancyPercent: 5, taxes: 3000, insurance: 1500, hoa: 0, utilities: 0,
  maintenancePercent: 8, managementPercent: 8, capexPercent: 5,
};

describe('operating income', () => {
  it('computes NOI from rent, vacancy and expenses', () => {
    const o = operating(ops);
    expect(o.effective).toBeCloseTo(2090, 6);
    expect(o.expenses).toBeCloseTo(250 + 125 + 2200 * 0.21, 6);
    expect(o.noiMonthly).toBeCloseTo(2090 - 837, 6);
  });
});

describe('rental analysis', () => {
  it('computes cash flow, cap rate and cash-on-cash', () => {
    const r = rentalAnalysis({ ...ops, price: 250000, downPercent: 25, closingCosts: 6000, repairs: 0, rate: 7.25, termYears: 30 });
    const pay = amortizedPayment(187500, 7.25, 360);
    expect(r.payment).toBeCloseTo(pay, 6);
    expect(r.cashFlowMonthly).toBeCloseTo(1253 - pay, 6);
    expect(r.capRate).toBeCloseTo((1253 * 12) / 250000 * 100, 6);
    expect(r.cashInvested).toBe(68500);
    expect(r.cashOnCash).toBeCloseTo(((1253 - pay) * 12) / 68500 * 100, 6);
    expect(r.onePercentRule).toBeCloseTo(0.88, 6);
  });
});

describe('BRRRR', () => {
  const base = {
    ...ops, rent: 2000, insurance: 1400,
    price: 150000, purchaseClosing: 4000, rehab: 40000, holdMonths: 6, holdingMonthly: 600,
    financing: 'hard-money' as const, hmLtc: 85, hmRate: 11, hmPoints: 2,
    arv: 250000, refiLtv: 75, refiRate: 7.5, refiTermYears: 30, refiCostsPercent: 3,
  };
  it('tracks cash in, cash back and cash left in the deal', () => {
    const r = brrrr(base);
    expect(r.hmLoan).toBeCloseTo(161500, 6);
    expect(r.hmInterest).toBeCloseTo(161500 * 0.11 / 12 * 6, 6);
    expect(r.allInCost).toBeCloseTo(150000 + 4000 + 40000 + 3600 + r.hmInterest + 3230, 6);
    expect(r.refiLoan).toBe(187500);
    expect(r.cashBack).toBeCloseTo(187500 - 161500 - 5625, 6);
    expect(r.cashLeftInDeal).toBeCloseTo(r.cashBeforeRefi - r.cashBack, 6);
    expect(r.seventyPercentMax).toBe(135000);
  });
  it('reports infinite cash-on-cash when all cash comes back', () => {
    const r = brrrr({ ...base, arv: 330000 });
    expect(r.cashLeftInDeal).toBeLessThan(0);
    if (r.annualCashFlow > 0) expect(r.cashOnCash).toBe(Infinity);
  });
  it('handles an all-cash purchase', () => {
    const r = brrrr({ ...base, financing: 'cash' });
    expect(r.hmLoan).toBe(0);
    expect(r.cashBeforeRefi).toBeCloseTo(150000 + 4000 + 40000 + 3600, 6);
  });
});
