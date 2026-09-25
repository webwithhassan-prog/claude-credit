/**
 * Home equity & real-estate calculators: HELOC payments, borrowing limit,
 * cash-out refinance vs HELOC, and DSCR (rental) loans.
 */
import { amortizedPayment, monthlyRate, principalFromPayment } from './loan';

/* ------------------------------------------------------------------------ */
/* HELOC payment                                                             */
/* ------------------------------------------------------------------------ */

export interface HelocInput {
  /** Amount drawn (assumed drawn in full at the start). */
  balance: number;
  rate: number;
  drawYears: number;
  repayYears: number;
  /** 'interest-only' is the most common draw-period structure. */
  drawPayment: 'interest-only' | 'amortizing';
}

export function helocPayments(i: HelocInput) {
  const drawMonths = Math.round(i.drawYears * 12);
  const repayMonths = Math.round(i.repayYears * 12);
  const r = monthlyRate(i.rate);
  const balances: number[] = [i.balance];
  let bal = i.balance;
  let drawInterest = 0;
  let drawPayment: number;

  if (i.drawPayment === 'interest-only') {
    drawPayment = i.balance * r;
    drawInterest = drawPayment * drawMonths;
    for (let m = 0; m < drawMonths; m++) balances.push(bal);
  } else {
    // Amortize over the full life (draw + repay) so payments stay level.
    drawPayment = amortizedPayment(i.balance, i.rate, drawMonths + repayMonths);
    for (let m = 0; m < drawMonths; m++) {
      const interest = bal * r;
      drawInterest += interest;
      bal = bal + interest - drawPayment;
      balances.push(Math.max(bal, 0));
    }
  }

  const balanceAtRepay = Math.max(bal, 0);
  const repayPayment = amortizedPayment(balanceAtRepay, i.rate, repayMonths);
  let repayInterest = 0;
  for (let m = 0; m < repayMonths; m++) {
    const interest = bal * r;
    repayInterest += interest;
    bal = bal + interest - repayPayment;
    balances.push(Math.max(bal, 0));
  }

  return {
    drawMonths,
    repayMonths,
    drawPayment,
    repayPayment,
    balanceAtRepay,
    /** Increase from draw-period payment to repayment-period payment. */
    paymentShock: repayPayment - drawPayment,
    paymentShockPercent: drawPayment > 0 ? ((repayPayment - drawPayment) / drawPayment) * 100 : 0,
    drawInterest,
    repayInterest,
    totalInterest: drawInterest + repayInterest,
    balances,
  };
}

/* ------------------------------------------------------------------------ */
/* Home equity / borrowing limit                                             */
/* ------------------------------------------------------------------------ */

export function homeEquity(homeValue: number, mortgageBalances: number, maxCltvPercent: number) {
  const equity = homeValue - mortgageBalances;
  const maxTotalDebt = (homeValue * maxCltvPercent) / 100;
  const borrowable = Math.max(0, maxTotalDebt - mortgageBalances);
  return {
    equity,
    equityPercent: homeValue > 0 ? (equity / homeValue) * 100 : NaN,
    currentLtv: homeValue > 0 ? (mortgageBalances / homeValue) * 100 : NaN,
    maxTotalDebt,
    borrowable,
    /** Equity that must stay untouched under this CLTV cap. */
    retainedEquity: homeValue - Math.max(maxTotalDebt, mortgageBalances),
  };
}

/* ------------------------------------------------------------------------ */
/* Cash-out refinance vs HELOC                                               */
/* ------------------------------------------------------------------------ */

export interface CashOutVsHelocInput {
  mortgageBalance: number;
  mortgageRate: number;
  mortgageYearsLeft: number;
  cashNeeded: number;
  refiRate: number;
  refiYears: number;
  /** Closing costs as % of the new loan. */
  refiCostsPercent: number;
  /** Roll closing costs into the new loan (true) or pay them in cash. */
  refiFinanceCosts: boolean;
  helocRate: number;
  helocDrawYears: number;
  helocRepayYears: number;
  helocCosts: number;
  /** Comparison window in years. */
  horizonYears: number;
}

interface Track {
  interest: number;
  paid: number;
  balance: number;
}

function simulateAmortizing(balance: number, rate: number, months: number, horizon: number): Track & { payment: number } {
  const payment = amortizedPayment(balance, rate, months);
  const r = monthlyRate(rate);
  let bal = balance;
  let interest = 0;
  let paid = 0;
  for (let m = 0; m < Math.min(horizon, months); m++) {
    const i = bal * r;
    const pay = Math.min(payment, bal + i);
    interest += i;
    paid += pay;
    bal = bal + i - pay;
  }
  return { payment, interest, paid, balance: Math.max(bal, 0) };
}

export function cashOutVsHeloc(i: CashOutVsHelocInput) {
  const horizon = Math.round(i.horizonYears * 12);

  // Cash-out refinance: one new first mortgage.
  const costsBase = i.mortgageBalance + i.cashNeeded;
  const refiLoan = i.refiFinanceCosts
    ? costsBase / (1 - i.refiCostsPercent / 100)
    : costsBase;
  const refiCosts = (refiLoan * i.refiCostsPercent) / 100;
  const refi = simulateAmortizing(refiLoan, i.refiRate, Math.round(i.refiYears * 12), horizon);
  const refiUpfront = i.refiFinanceCosts ? 0 : refiCosts;

  // HELOC: keep the existing mortgage, borrow the cash on a HELOC.
  const existing = simulateAmortizing(i.mortgageBalance, i.mortgageRate, Math.round(i.mortgageYearsLeft * 12), horizon);
  const drawMonths = Math.round(i.helocDrawYears * 12);
  const repayMonths = Math.round(i.helocRepayYears * 12);
  const hr = monthlyRate(i.helocRate);
  const helocIo = i.cashNeeded * hr;
  const helocRepayPayment = amortizedPayment(i.cashNeeded, i.helocRate, repayMonths);
  let hBal = i.cashNeeded;
  let hInterest = 0;
  let hPaid = 0;
  for (let m = 0; m < Math.min(horizon, drawMonths + repayMonths); m++) {
    const int = hBal * hr;
    const pay = m < drawMonths ? int : Math.min(helocRepayPayment, hBal + int);
    hInterest += int;
    hPaid += pay;
    hBal = hBal + int - pay;
  }

  const refiTotalCost = refi.interest + refiCosts;
  const helocTotalCost = existing.interest + hInterest + i.helocCosts;

  return {
    refi: {
      loanAmount: refiLoan,
      closingCosts: refiCosts,
      upfrontCash: refiUpfront,
      payment: refi.payment,
      interest: refi.interest,
      totalCost: refiTotalCost,
      balanceAtHorizon: refi.balance,
    },
    heloc: {
      mortgagePayment: existing.payment,
      helocPaymentDraw: helocIo,
      helocPaymentRepay: helocRepayPayment,
      paymentNow: existing.payment + helocIo,
      interest: existing.interest + hInterest,
      costs: i.helocCosts,
      totalCost: helocTotalCost,
      balanceAtHorizon: existing.balance + Math.max(hBal, 0),
    },
    /** Blended rate of keeping the old mortgage + HELOC, weighted by balances. */
    blendedRate:
      (i.mortgageBalance * i.mortgageRate + i.cashNeeded * i.helocRate) / (i.mortgageBalance + i.cashNeeded || 1),
    /** Positive = HELOC route is cheaper over the horizon (interest + costs). */
    helocAdvantage: refiTotalCost - helocTotalCost,
  };
}

/* ------------------------------------------------------------------------ */
/* DSCR loan                                                                  */
/* ------------------------------------------------------------------------ */

export interface DscrInput {
  monthlyRent: number;
  /** Annual property tax. */
  taxes: number;
  /** Annual insurance. */
  insurance: number;
  /** Monthly HOA dues. */
  hoa: number;
  loanAmount: number;
  rate: number;
  termYears: number;
  interestOnly: boolean;
  /** Optional: vacancy % and other operating expenses for the NOI-based ratio. */
  vacancyPercent: number;
  /** Annual operating expenses excluding taxes/insurance/HOA (maintenance, management…). */
  otherExpenses: number;
  targetDscr: number;
}

export type DscrBand = 'strong' | 'qualifies' | 'sub-one' | 'weak';

export function dscrBand(dscr: number): DscrBand {
  if (dscr >= 1.25) return 'strong';
  if (dscr >= 1.0) return 'qualifies';
  if (dscr >= 0.75) return 'sub-one';
  return 'weak';
}

export function dscr(i: DscrInput) {
  const months = Math.round(i.termYears * 12);
  const pi = i.interestOnly ? i.loanAmount * monthlyRate(i.rate) : amortizedPayment(i.loanAmount, i.rate, months);
  const tiMonthly = (i.taxes + i.insurance) / 12;
  const pitia = pi + tiMonthly + i.hoa;
  const ratio = pitia > 0 ? i.monthlyRent / pitia : NaN;

  // Investor view: NOI / annual debt service.
  const egi = i.monthlyRent * 12 * (1 - i.vacancyPercent / 100);
  const noi = egi - i.taxes - i.insurance - i.hoa * 12 - i.otherExpenses;
  const noiDscr = pi > 0 ? noi / (pi * 12) : NaN;

  // Max loan that still hits the target lender DSCR.
  const maxPi = i.monthlyRent / i.targetDscr - tiMonthly - i.hoa;
  const maxLoan =
    maxPi <= 0
      ? 0
      : i.interestOnly
        ? maxPi / monthlyRate(i.rate || 1e-9)
        : principalFromPayment(maxPi, i.rate, months);

  const minRent = i.targetDscr * pitia;
  const cashFlow = i.monthlyRent - pitia;

  return {
    pi,
    pitia,
    ratio,
    band: Number.isNaN(ratio) ? null : dscrBand(ratio),
    noi,
    noiDscr,
    maxLoan,
    minRent,
    cashFlow,
  };
}
