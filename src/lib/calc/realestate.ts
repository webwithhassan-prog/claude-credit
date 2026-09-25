/**
 * Real-estate investor calculators: rental property cash flow (cap rate,
 * cash-on-cash, DSCR) and the BRRRR strategy (buy, rehab, rent, refinance, repeat).
 */
import { amortizedPayment, monthlyRate } from './loan';

export interface OperatingInput {
  /** Monthly rent. */
  rent: number;
  /** Other monthly income (parking, laundry, pet fees). */
  otherIncome: number;
  vacancyPercent: number;
  /** Annual property taxes. */
  taxes: number;
  /** Annual insurance. */
  insurance: number;
  /** Monthly HOA dues. */
  hoa: number;
  /** Monthly utilities paid by the owner. */
  utilities: number;
  /** Percent of rent reserved for repairs and maintenance. */
  maintenancePercent: number;
  /** Percent of rent paid for property management. */
  managementPercent: number;
  /** Percent of rent reserved for capital expenditures (roof, HVAC…). */
  capexPercent: number;
}

/** Monthly operating figures before debt service. */
export function operating(i: OperatingInput) {
  const gross = i.rent + i.otherIncome;
  const vacancy = (gross * i.vacancyPercent) / 100;
  const effective = gross - vacancy;
  const pctOfRent = (p: number) => (i.rent * p) / 100;
  const expenses =
    i.taxes / 12 +
    i.insurance / 12 +
    i.hoa +
    i.utilities +
    pctOfRent(i.maintenancePercent) +
    pctOfRent(i.managementPercent) +
    pctOfRent(i.capexPercent);
  const noiMonthly = effective - expenses;
  return { gross, vacancy, effective, expenses, noiMonthly, noiAnnual: noiMonthly * 12 };
}

/* ------------------------------------------------------------------------ */
/* Rental property analysis                                                   */
/* ------------------------------------------------------------------------ */

export interface RentalInput extends OperatingInput {
  price: number;
  downPercent: number;
  /** Closing costs in dollars. */
  closingCosts: number;
  /** Up-front repairs before renting, in dollars. */
  repairs: number;
  rate: number;
  termYears: number;
}

export function rentalAnalysis(i: RentalInput) {
  const op = operating(i);
  const down = (i.price * i.downPercent) / 100;
  const loan = i.price - down;
  const payment = amortizedPayment(loan, i.rate, Math.round(i.termYears * 12));
  const cashFlowMonthly = op.noiMonthly - payment;
  const cashInvested = down + i.closingCosts + i.repairs;
  const annualCashFlow = cashFlowMonthly * 12;
  const capRate = i.price > 0 ? (op.noiAnnual / i.price) * 100 : NaN;
  const cashOnCash = cashInvested > 0 ? (annualCashFlow / cashInvested) * 100 : NaN;
  const pitia = payment + i.taxes / 12 + i.insurance / 12 + i.hoa;
  const dscr = pitia > 0 ? i.rent / pitia : NaN;
  const annualRent = i.rent * 12;
  // Occupancy at which effective income covers expenses + debt service.
  const fixedCosts = op.expenses + payment;
  const breakEvenOccupancy = op.gross > 0 ? (fixedCosts / op.gross) * 100 : NaN;
  return {
    ...op,
    down,
    loan,
    payment,
    cashFlowMonthly,
    annualCashFlow,
    cashInvested,
    capRate,
    cashOnCash,
    dscr,
    grossRentMultiplier: annualRent > 0 ? i.price / annualRent : NaN,
    onePercentRule: i.price > 0 ? (i.rent / i.price) * 100 : NaN,
    /** Vacancy + operating expenses as a share of gross income (the "50% rule" compares this to 50%). */
    expenseRatio: op.gross > 0 ? ((op.expenses + op.vacancy) / op.gross) * 100 : NaN,
    breakEvenOccupancy,
  };
}

/* ------------------------------------------------------------------------ */
/* BRRRR                                                                      */
/* ------------------------------------------------------------------------ */

export interface BrrrrInput extends OperatingInput {
  price: number;
  purchaseClosing: number;
  rehab: number;
  /** Months from purchase to refinance (rehab + lease-up + seasoning). */
  holdMonths: number;
  /** Monthly holding costs while vacant (taxes, insurance, utilities…), excluding loan interest. */
  holdingMonthly: number;
  /** Initial financing: 'cash' or a short-term (hard money) loan. */
  financing: 'cash' | 'hard-money';
  /** Hard money loan-to-cost (% of price + rehab). */
  hmLtc: number;
  hmRate: number;
  /** Points charged on the hard money loan (% of loan). */
  hmPoints: number;
  arv: number;
  refiLtv: number;
  refiRate: number;
  refiTermYears: number;
  /** Refinance closing costs as % of the new loan. */
  refiCostsPercent: number;
}

export function brrrr(i: BrrrrInput) {
  const hmLoan = i.financing === 'hard-money' ? ((i.price + i.rehab) * i.hmLtc) / 100 : 0;
  const hmInterest = hmLoan * monthlyRate(i.hmRate) * i.holdMonths;
  const hmPoints = (hmLoan * i.hmPoints) / 100;
  const holding = i.holdingMonthly * i.holdMonths;
  const allInCost = i.price + i.purchaseClosing + i.rehab + holding + hmInterest + hmPoints;
  const cashBeforeRefi = allInCost - hmLoan;

  const refiLoan = (i.arv * i.refiLtv) / 100;
  const refiCosts = (refiLoan * i.refiCostsPercent) / 100;
  const cashBack = refiLoan - hmLoan - refiCosts;
  const cashLeftInDeal = cashBeforeRefi - cashBack;

  const payment = amortizedPayment(refiLoan, i.refiRate, Math.round(i.refiTermYears * 12));
  const op = operating(i);
  const cashFlowMonthly = op.noiMonthly - payment;
  const annualCashFlow = cashFlowMonthly * 12;
  const pitia = payment + i.taxes / 12 + i.insurance / 12 + i.hoa;

  return {
    ...op,
    hmLoan,
    hmInterest,
    hmPoints,
    holding,
    allInCost,
    cashBeforeRefi,
    refiLoan,
    refiCosts,
    cashBack,
    cashLeftInDeal,
    /** Share of the investor's cash recovered at refinance. */
    cashRecoveredPercent: cashBeforeRefi > 0 ? Math.min(100, (Math.max(0, cashBack) / cashBeforeRefi) * 100) : NaN,
    payment,
    cashFlowMonthly,
    annualCashFlow,
    /** Infinity when no cash is left in the deal and cash flow is positive. */
    cashOnCash:
      cashLeftInDeal > 0 ? (annualCashFlow / cashLeftInDeal) * 100 : annualCashFlow > 0 ? Infinity : -Infinity,
    equityAfterRefi: i.arv - refiLoan,
    dscr: pitia > 0 ? i.rent / pitia : NaN,
    /** The "70% rule": maximum purchase price = 70% of ARV − rehab. */
    seventyPercentMax: i.arv * 0.7 - i.rehab,
  };
}
