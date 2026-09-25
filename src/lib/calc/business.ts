/**
 * Small-business financing: merchant cash advances, invoice factoring and
 * equipment loans.
 */
import { amortizedPayment, aprFromPayments, paymentWithBalloon } from './loan';

/** Business days per year used to annualize daily MCA remittances. */
export const BUSINESS_DAYS_PER_YEAR = 252;
export const WEEKS_PER_YEAR = 52;

/* ------------------------------------------------------------------------ */
/* Merchant cash advance                                                      */
/* ------------------------------------------------------------------------ */

export interface McaInput {
  advance: number;
  factorRate: number;
  /** Upfront fees deducted from the funded amount (origination, underwriting, etc.). */
  fees: number;
  frequency: 'daily' | 'weekly';
  /** How the term is determined. */
  mode: 'term' | 'holdback';
  /** For mode 'term': expected repayment term in months. */
  termMonths: number;
  /** For mode 'holdback': average monthly card/bank sales and holdback percentage. */
  monthlySales: number;
  holdbackPercent: number;
}

export function merchantCashAdvance(i: McaInput) {
  const payback = i.advance * i.factorRate;
  const netFunds = i.advance - i.fees;
  const perYear = i.frequency === 'daily' ? BUSINESS_DAYS_PER_YEAR : WEEKS_PER_YEAR;
  const perMonth = perYear / 12;

  let payments: number;
  let payment: number;
  if (i.mode === 'term') {
    payments = Math.max(1, Math.round(i.termMonths * perMonth));
    payment = payback / payments;
  } else {
    const salesPerPeriod = i.monthlySales / perMonth;
    payment = (salesPerPeriod * i.holdbackPercent) / 100;
    payments = payment > 0 ? Math.ceil(payback / payment) : Infinity;
  }

  const finiteTerm = Number.isFinite(payments) && payments > 0;
  // Last payment may be smaller in holdback mode; approximate with a level payment of payback/payments.
  const levelPayment = finiteTerm ? payback / payments : 0;
  const apr = finiteTerm && netFunds > 0 ? aprFromPayments(netFunds, levelPayment, payments, perYear) : NaN;
  const cost = payback - netFunds;

  return {
    payback,
    netFunds,
    cost,
    payment: finiteTerm ? levelPayment : payment,
    payments,
    termMonths: finiteTerm ? payments / perMonth : Infinity,
    apr,
    /** Cost per dollar actually received. */
    costPerDollar: netFunds > 0 ? cost / netFunds : NaN,
    monthlyEquivalent: finiteTerm ? levelPayment * perMonth : NaN,
  };
}

/* ------------------------------------------------------------------------ */
/* Invoice factoring                                                          */
/* ------------------------------------------------------------------------ */

export interface FactoringInput {
  invoice: number;
  advanceRate: number;
  /** Fee % charged per fee period (e.g. 3 = 3% per 30 days). */
  feePercent: number;
  /** Length of each fee period in days (30, 15, 10, 7 or 1). */
  feePeriodDays: number;
  daysToPay: number;
  /** Flat extra fees (ACH/wire, application, due diligence…). */
  otherFees: number;
}

export function invoiceFactoring(i: FactoringInput) {
  const advance = (i.invoice * i.advanceRate) / 100;
  const periods = Math.max(1, Math.ceil(i.daysToPay / i.feePeriodDays));
  const factoringFee = (i.invoice * i.feePercent * periods) / 100;
  const totalFees = factoringFee + i.otherFees;
  const reserve = i.invoice - advance;
  const rebate = reserve - totalFees;
  const netReceived = i.invoice - totalFees;
  const feePercentOfInvoice = i.invoice > 0 ? (totalFees / i.invoice) * 100 : NaN;
  // Annualized cost of the cash you actually used (the advance) for the days outstanding.
  const apr = advance > 0 && i.daysToPay > 0 ? (totalFees / advance) * (365 / i.daysToPay) * 100 : NaN;

  return { advance, reserve, periods, factoringFee, totalFees, rebate, netReceived, feePercentOfInvoice, apr };
}

/* ------------------------------------------------------------------------ */
/* Equipment loan                                                              */
/* ------------------------------------------------------------------------ */

export interface EquipmentInput {
  cost: number;
  downPercent: number;
  salesTaxPercent: number;
  financeTax: boolean;
  fees: number;
  rate: number;
  termMonths: number;
  /** Balloon / residual as % of equipment cost due at the end. */
  balloonPercent: number;
  /** Marginal tax rate for the year-one expensing estimate (federal + state). */
  taxRate: number;
}

export function equipmentLoan(i: EquipmentInput) {
  const tax = (i.cost * i.salesTaxPercent) / 100;
  const down = (i.cost * i.downPercent) / 100;
  const financed = i.cost - down + (i.financeTax ? tax : 0) + i.fees;
  const balloon = (i.cost * i.balloonPercent) / 100;
  const payment =
    balloon > 0 ? paymentWithBalloon(financed, i.rate, i.termMonths, balloon) : amortizedPayment(financed, i.rate, i.termMonths);
  const totalPayments = payment * i.termMonths + balloon;
  const totalInterest = totalPayments - financed;
  const upfront = down + (i.financeTax ? 0 : tax);
  const totalCost = upfront + totalPayments;
  // Year-one expensing (Section 179 / 100% bonus depreciation) applies to the equipment cost basis.
  const taxSavings = ((i.cost + tax) * i.taxRate) / 100;

  return {
    financed,
    down,
    tax,
    upfront,
    payment,
    balloon,
    totalInterest,
    totalCost,
    taxSavings,
    netCostAfterTax: totalCost - taxSavings,
    apr: aprFromPayments(financed - i.fees, payment, i.termMonths, 12, balloon),
  };
}
