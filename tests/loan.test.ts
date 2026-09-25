import { describe, expect, it } from 'vitest';
import {
  amortizedPayment,
  aprFromPayments,
  monthsToPayoff,
  payoffWithFixedPayment,
  paymentWithBalloon,
  principalFromPayment,
} from '../src/lib/calc/loan';

describe('loan math', () => {
  it('matches the standard amortization formula', () => {
    // $200,000 at 6% for 30 years = $1,199.10/month (textbook value).
    expect(amortizedPayment(200000, 6, 360)).toBeCloseTo(1199.1, 1);
    // Zero rate divides evenly.
    expect(amortizedPayment(1200, 0, 12)).toBe(100);
  });

  it('inverts payment → principal', () => {
    const p = amortizedPayment(25000, 9, 60);
    expect(principalFromPayment(p, 9, 60)).toBeCloseTo(25000, 6);
  });

  it('simulates a fixed-payment payoff consistent with the closed form', () => {
    const r = payoffWithFixedPayment(5000, 22, 200);
    expect(r.neverPaysOff).toBe(false);
    expect(r.months).toBe(monthsToPayoff(5000, 22, 200));
    expect(r.totalPaid).toBeCloseTo(5000 + r.totalInterest, 6);
    expect(r.schedule.at(-1)!.balance).toBeCloseTo(0, 2);
  });

  it('detects payments that never cover interest', () => {
    // 24% APR on $10,000 = $200/month interest.
    expect(payoffWithFixedPayment(10000, 24, 200).neverPaysOff).toBe(true);
    expect(monthsToPayoff(10000, 24, 150)).toBe(Infinity);
  });

  it('computes APR from payments (Reg Z style)', () => {
    // A 12% loan with no fees has a 12% APR.
    const pay = amortizedPayment(10000, 12, 36);
    expect(aprFromPayments(10000, pay, 36, 12)).toBeCloseTo(12, 4);
    // A 5% fee deducted from proceeds raises the APR.
    expect(aprFromPayments(9500, pay, 36, 12)).toBeGreaterThan(15);
  });

  it('handles balloon payments', () => {
    const pay = paymentWithBalloon(50000, 8, 60, 10000);
    // Balance after 60 payments should equal the balloon.
    let bal = 50000;
    for (let m = 0; m < 60; m++) bal = bal * (1 + 0.08 / 12) - pay;
    expect(bal).toBeCloseTo(10000, 4);
  });
});

import { interestPaidInYear } from '../src/lib/calc/loan';

describe('interest paid in a calendar year', () => {
  it('splits a loan’s interest across calendar years', () => {
    const p = 30000, apr = 7, n = 60;
    const total = amortizedPayment(p, apr, n) * n - p;
    const byYear = [2025, 2026, 2027, 2028, 2029, 2030].map((y) => interestPaidInYear(p, apr, n, 2025, 3, y));
    expect(byYear.reduce((s, x) => s + x, 0)).toBeCloseTo(total, 4);
    // 10 payments in 2025 (Mar–Dec); first-year interest ≈ sum of the first 10 months.
    expect(byYear[0]).toBeGreaterThan(byYear[1] * 0.75);
    expect(byYear[1]).toBeGreaterThan(byYear[2]);
  });
});
