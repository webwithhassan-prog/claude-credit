import { describe, expect, it } from 'vitest';
import { cashOutVsHeloc, dscr, helocPayments, homeEquity } from '../src/lib/calc/home';
import { equipmentLoan, invoiceFactoring, merchantCashAdvance } from '../src/lib/calc/business';
import { amortizedPayment } from '../src/lib/calc/loan';

describe('HELOC', () => {
  it('interest-only draw then amortizing repayment', () => {
    const r = helocPayments({ balance: 50000, rate: 8.5, drawYears: 10, repayYears: 20, drawPayment: 'interest-only' });
    expect(r.drawPayment).toBeCloseTo((50000 * 0.085) / 12, 6);
    expect(r.repayPayment).toBeCloseTo(amortizedPayment(50000, 8.5, 240), 6);
    expect(r.paymentShock).toBeGreaterThan(0);
    expect(r.balances.at(-1)!).toBeCloseTo(0, 2);
  });
});

describe('home equity', () => {
  it('computes the CLTV borrowing limit', () => {
    const r = homeEquity(400000, 250000, 85);
    expect(r.borrowable).toBe(90000);
    expect(r.equity).toBe(150000);
    expect(r.currentLtv).toBeCloseTo(62.5, 6);
  });
  it('never returns a negative limit', () => {
    expect(homeEquity(300000, 290000, 80).borrowable).toBe(0);
  });
});

describe('cash-out vs HELOC', () => {
  it('keeping a low-rate first mortgage beats refinancing it at a higher rate', () => {
    const r = cashOutVsHeloc({
      mortgageBalance: 300000, mortgageRate: 3, mortgageYearsLeft: 25, cashNeeded: 60000,
      refiRate: 6.75, refiYears: 30, refiCostsPercent: 3, refiFinanceCosts: true,
      helocRate: 8.5, helocDrawYears: 10, helocRepayYears: 20, helocCosts: 500, horizonYears: 10,
    });
    expect(r.refi.loanAmount).toBeCloseTo(360000 / 0.97, 4);
    expect(r.helocAdvantage).toBeGreaterThan(0);
    expect(r.blendedRate).toBeCloseTo((300000 * 3 + 60000 * 8.5) / 360000, 6);
  });
});

describe('DSCR', () => {
  it('computes lender DSCR from rent / PITIA and the max loan at target', () => {
    const r = dscr({
      monthlyRent: 3000, taxes: 3600, insurance: 1800, hoa: 0, loanAmount: 300000, rate: 7.5, termYears: 30,
      interestOnly: false, vacancyPercent: 5, otherExpenses: 2400, targetDscr: 1.25,
    });
    const pi = amortizedPayment(300000, 7.5, 360);
    expect(r.pitia).toBeCloseTo(pi + 450, 6);
    expect(r.ratio).toBeCloseTo(3000 / (pi + 450), 6);
    // At the max loan the DSCR equals the target.
    const atMax = dscr({
      monthlyRent: 3000, taxes: 3600, insurance: 1800, hoa: 0, loanAmount: r.maxLoan, rate: 7.5, termYears: 30,
      interestOnly: false, vacancyPercent: 5, otherExpenses: 2400, targetDscr: 1.25,
    });
    expect(atMax.ratio).toBeCloseTo(1.25, 6);
  });
});

describe('merchant cash advance', () => {
  it('converts a factor rate to APR', () => {
    const r = merchantCashAdvance({
      advance: 50000, factorRate: 1.3, fees: 0, frequency: 'daily', mode: 'term', termMonths: 6, monthlySales: 0, holdbackPercent: 0,
    });
    expect(r.payback).toBe(65000);
    expect(r.payments).toBe(126);
    expect(r.apr).toBeGreaterThan(90);
    expect(r.apr).toBeLessThan(130);
  });
  it('estimates term from holdback', () => {
    const r = merchantCashAdvance({
      advance: 20000, factorRate: 1.25, fees: 500, frequency: 'daily', mode: 'holdback', termMonths: 0, monthlySales: 42000, holdbackPercent: 10,
    });
    // Daily remittance = 42000 / 21 * 10% = 200 → 25000 / 200 = 125 payments.
    expect(r.payments).toBe(125);
    expect(r.netFunds).toBe(19500);
  });
});

describe('invoice factoring', () => {
  it('charges fees per started fee period', () => {
    const r = invoiceFactoring({ invoice: 10000, advanceRate: 85, feePercent: 3, feePeriodDays: 30, daysToPay: 45, otherFees: 0 });
    expect(r.advance).toBe(8500);
    expect(r.periods).toBe(2);
    expect(r.totalFees).toBe(600);
    expect(r.rebate).toBe(900);
    expect(r.netReceived).toBe(9400);
  });
});

describe('equipment loan', () => {
  it('finances cost minus down payment plus tax when selected', () => {
    const r = equipmentLoan({
      cost: 100000, downPercent: 10, salesTaxPercent: 8, financeTax: true, fees: 0, rate: 9, termMonths: 60, balloonPercent: 0, taxRate: 25,
    });
    expect(r.financed).toBe(98000);
    expect(r.payment).toBeCloseTo(amortizedPayment(98000, 9, 60), 6);
    expect(r.apr).toBeCloseTo(9, 3);
    expect(r.taxSavings).toBe(27000);
  });
});
