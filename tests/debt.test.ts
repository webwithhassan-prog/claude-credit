import { describe, expect, it } from 'vitest';
import {
  balanceTransfer,
  creditUtilization,
  debtConsolidation,
  debtPayoffPlan,
  debtToIncome,
  minimumPaymentPayoff,
  minimumsOnlyPlan,
  paymentForPayoffMonths,
  targetOrder,
  type Debt,
} from '../src/lib/calc/debt';

const debts: Debt[] = [
  { name: 'Card A', balance: 3000, apr: 24.99, minPayment: 90 },
  { name: 'Card B', balance: 8000, apr: 19.99, minPayment: 200 },
  { name: 'Car', balance: 12000, apr: 6.9, minPayment: 320 },
  { name: 'Store', balance: 900, apr: 15, minPayment: 35 },
];

describe('credit card payoff', () => {
  it('payment for a target payoff date clears the balance', () => {
    const p = paymentForPayoffMonths(6000, 21.99, 24);
    let bal = 6000;
    for (let m = 0; m < 24; m++) bal = bal * (1 + 0.2199 / 12) - p;
    expect(bal).toBeCloseTo(0, 4);
  });

  it('minimum-payment path is far slower and costlier than a fixed payment', () => {
    const min = minimumPaymentPayoff(5000, 22);
    expect(min.neverPaysOff).toBe(false);
    expect(min.months).toBeGreaterThan(120);
    // First minimum: 1% of 5000 + interest (91.67) = 141.67
    expect(min.schedule[0].payment).toBeCloseTo(50 + 5000 * 0.22 / 12, 2);
  });
});

describe('avalanche vs snowball', () => {
  it('orders debts correctly', () => {
    expect(targetOrder(debts, 'avalanche')).toEqual([0, 1, 3, 2]);
    expect(targetOrder(debts, 'snowball')).toEqual([3, 0, 1, 2]);
  });

  it('avalanche never costs more interest than snowball', () => {
    const av = debtPayoffPlan(debts, 300, 'avalanche');
    const sb = debtPayoffPlan(debts, 300, 'snowball');
    expect(av.neverPaysOff).toBe(false);
    expect(av.totalInterest).toBeLessThan(sb.totalInterest);
    // Paying extra beats minimums only.
    const base = minimumsOnlyPlan(debts);
    expect(av.months).toBeLessThan(base.months);
    expect(av.totalInterest).toBeLessThan(base.totalInterest);
    // Total paid = principal + interest.
    const principal = debts.reduce((s, d) => s + d.balance, 0);
    expect(av.totalPaid).toBeCloseTo(principal + av.totalInterest, 2);
  });

  it('flags a budget that cannot cover interest', () => {
    const r = debtPayoffPlan([{ name: 'X', balance: 20000, apr: 30, minPayment: 100 }], 0, 'avalanche');
    expect(r.neverPaysOff).toBe(true);
  });
});

describe('balance transfer', () => {
  it('saves money when paid off within the intro period', () => {
    const r = balanceTransfer({
      balance: 6000, currentApr: 24, feePercent: 3, introApr: 0, introMonths: 18, goToApr: 24, monthlyPayment: 400,
    });
    expect(r.fee).toBe(180);
    expect(r.transfer.totalInterest).toBe(0);
    expect(r.transfer.months).toBe(Math.ceil(6180 / 400));
    expect(r.netSavings).toBeCloseTo(r.keep.totalInterest - 180, 6);
    expect(r.paymentToClearInIntro).toBeCloseTo(6180 / 18, 6);
  });
});

describe('debt consolidation', () => {
  it('grosses the loan up for a fee taken from proceeds', () => {
    const r = debtConsolidation({
      debts: [
        { name: 'A', balance: 9500, apr: 24, payment: 300 },
      ],
      loanApr: 11,
      termMonths: 36,
      feePercent: 5,
      feeFromProceeds: true,
    });
    expect(r.loanAmount).toBeCloseTo(10000, 6);
    expect(r.fee).toBeCloseTo(500, 6);
    expect(r.trueApr).toBeGreaterThan(11);
  });
});

describe('utilization & DTI', () => {
  it('computes overall and per-card utilization', () => {
    const r = creditUtilization([
      { name: 'A', balance: 1500, limit: 5000 },
      { name: 'B', balance: 500, limit: 5000 },
    ], 10);
    expect(r.overall).toBeCloseTo(20, 6);
    expect(r.band).toBe('good');
    expect(r.paydownToTarget).toBeCloseTo(1000, 6);
    expect(r.perCard[0].percent).toBeCloseTo(30, 6);
  });

  it('computes front- and back-end DTI', () => {
    const r = debtToIncome(6000, 1800, 600, 36);
    expect(r.frontEnd).toBeCloseTo(30, 6);
    expect(r.backEnd).toBeCloseTo(40, 6);
    expect(r.band).toBe('stretched');
    expect(r.maxHousingAtTarget).toBeCloseTo(1560, 6);
    expect(r.reductionToTarget).toBeCloseTo(240, 6);
  });
});
