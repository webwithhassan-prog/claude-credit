/**
 * Debt & credit calculators: credit card payoff, multi-debt avalanche/snowball,
 * balance transfer, debt consolidation, credit utilization and DTI.
 */
import {
  amortizedPayment,
  aprFromPayments,
  monthlyRate,
  monthsToPayoff,
  payoffWithFixedPayment,
  type PayoffResult,
} from './loan';

/* ------------------------------------------------------------------------ */
/* Credit card payoff                                                        */
/* ------------------------------------------------------------------------ */

/** Monthly payment needed to clear `balance` in exactly `months`. */
export const paymentForPayoffMonths = (balance: number, aprPercent: number, months: number) =>
  amortizedPayment(balance, aprPercent, months);

export interface MinimumPaymentRule {
  /** Percent of the balance (e.g. 1 = 1%). */
  percentOfBalance: number;
  /** Add the month's interest charge on top of the percent (most large U.S. issuers do). */
  plusInterest: boolean;
  /** Dollar floor, e.g. $25–$40. */
  floor: number;
}

export const DEFAULT_MIN_RULE: MinimumPaymentRule = { percentOfBalance: 1, plusInterest: true, floor: 25 };

/** Simulates paying only the (declining) minimum payment each month. */
export function minimumPaymentPayoff(
  balance: number,
  aprPercent: number,
  rule: MinimumPaymentRule = DEFAULT_MIN_RULE,
  maxMonths = 1200,
): PayoffResult {
  const r = monthlyRate(aprPercent);
  const schedule: PayoffResult['schedule'] = [];
  let bal = balance;
  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;
  while (bal > 0.005 && month < maxMonths) {
    month++;
    const interest = bal * r;
    let min = (bal * rule.percentOfBalance) / 100 + (rule.plusInterest ? interest : 0);
    min = Math.max(min, rule.floor);
    const pay = Math.min(min, bal + interest);
    if (pay <= interest && pay < bal + interest) {
      return { months: Infinity, totalInterest: Infinity, totalPaid: Infinity, schedule, neverPaysOff: true };
    }
    bal = bal + interest - pay;
    totalInterest += interest;
    totalPaid += pay;
    schedule.push({ month, payment: pay, interest, principal: pay - interest, balance: Math.max(bal, 0) });
  }
  return { months: month, totalInterest, totalPaid, schedule, neverPaysOff: bal > 0.005 };
}

/* ------------------------------------------------------------------------ */
/* Multi-debt payoff: avalanche vs snowball                                  */
/* ------------------------------------------------------------------------ */

export interface Debt {
  name: string;
  balance: number;
  apr: number;
  minPayment: number;
}

export type Strategy = 'avalanche' | 'snowball';

export interface DebtPlanResult {
  months: number;
  totalInterest: number;
  totalPaid: number;
  /** Month each debt is paid off (index-aligned with input). Infinity if never. */
  payoffMonth: number[];
  /** Order debts are targeted (indices). */
  order: number[];
  /** Total remaining balance at the end of each month (index 0 = start). */
  balances: number[];
  neverPaysOff: boolean;
}

/** Target order: avalanche = highest APR first; snowball = smallest balance first. Ties keep input order. */
export function targetOrder(debts: Debt[], strategy: Strategy): number[] {
  const idx = debts.map((_, i) => i);
  return idx.sort((a, b) => {
    const da = debts[a];
    const db = debts[b];
    const primary = strategy === 'avalanche' ? db.apr - da.apr : da.balance - db.balance;
    if (primary !== 0) return primary;
    const secondary = strategy === 'avalanche' ? da.balance - db.balance : db.apr - da.apr;
    return secondary !== 0 ? secondary : a - b;
  });
}

/**
 * Simulates a debt payoff plan with a fixed total monthly budget
 * (sum of minimums + `extra`). Every month: interest accrues on each debt, the
 * minimum is paid on each, then all leftover budget (the extra plus minimums
 * freed up by paid-off debts — the "rollover") goes to the current target debt.
 */
export function debtPayoffPlan(debts: Debt[], extra: number, strategy: Strategy, maxMonths = 600): DebtPlanResult {
  const n = debts.length;
  const bal = debts.map((d) => Math.max(d.balance, 0));
  const payoffMonth = debts.map((d) => (d.balance <= 0 ? 0 : Infinity));
  const order = targetOrder(debts, strategy);
  const budget = debts.reduce((s, d) => s + Math.max(d.minPayment, 0), 0) + Math.max(extra, 0);
  const balances = [bal.reduce((s, b) => s + b, 0)];
  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;

  while (bal.some((b) => b > 0.005) && month < maxMonths) {
    month++;
    // 1. Accrue interest.
    for (let i = 0; i < n; i++) {
      if (bal[i] <= 0) continue;
      const interest = bal[i] * monthlyRate(debts[i].apr);
      bal[i] += interest;
      totalInterest += interest;
    }
    // 2. Pay minimums.
    let remaining = budget;
    for (let i = 0; i < n; i++) {
      if (bal[i] <= 0) continue;
      const pay = Math.min(debts[i].minPayment, bal[i], remaining);
      bal[i] -= pay;
      remaining -= pay;
      totalPaid += pay;
    }
    // 3. Everything left goes to targets in order.
    for (const i of order) {
      if (remaining <= 0) break;
      if (bal[i] <= 0) continue;
      const pay = Math.min(bal[i], remaining);
      bal[i] -= pay;
      remaining -= pay;
      totalPaid += pay;
    }
    for (let i = 0; i < n; i++) {
      if (bal[i] <= 0.005 && payoffMonth[i] === Infinity) {
        bal[i] = 0;
        payoffMonth[i] = month;
      }
    }
    balances.push(bal.reduce((s, b) => s + b, 0));
    // Stall detection: balance not falling after the first year means the budget can't cover interest.
    if (month > 12 && balances[month] >= balances[month - 12] - 0.01) {
      return { months: Infinity, totalInterest: Infinity, totalPaid: Infinity, payoffMonth, order, balances, neverPaysOff: true };
    }
  }
  const neverPaysOff = bal.some((b) => b > 0.005);
  return {
    months: neverPaysOff ? Infinity : month,
    totalInterest: neverPaysOff ? Infinity : totalInterest,
    totalPaid: neverPaysOff ? Infinity : totalPaid,
    payoffMonth,
    order,
    balances,
    neverPaysOff,
  };
}

/** Baseline: each debt paid at exactly its own minimum, no extra and no rollover. */
export function minimumsOnlyPlan(debts: Debt[]) {
  let months = 0;
  let totalInterest = 0;
  let neverPaysOff = false;
  for (const d of debts) {
    const r = payoffWithFixedPayment(d.balance, d.apr, d.minPayment);
    if (r.neverPaysOff) {
      neverPaysOff = true;
      continue;
    }
    months = Math.max(months, r.months);
    totalInterest += r.totalInterest;
  }
  return {
    months: neverPaysOff ? Infinity : months,
    totalInterest: neverPaysOff ? Infinity : totalInterest,
    neverPaysOff,
  };
}

/* ------------------------------------------------------------------------ */
/* Balance transfer                                                          */
/* ------------------------------------------------------------------------ */

export interface BalanceTransferInput {
  balance: number;
  currentApr: number;
  feePercent: number;
  introApr: number;
  introMonths: number;
  goToApr: number;
  monthlyPayment: number;
}

export interface BalanceTransferResult {
  fee: number;
  keep: PayoffResult;
  transfer: { months: number; totalInterest: number; totalPaid: number; neverPaysOff: boolean; balanceAfterIntro: number };
  /** Interest + fee saved by transferring (positive = transfer is cheaper). */
  netSavings: number;
  /** Monthly payment that clears the transferred balance (incl. fee) before the intro rate ends. */
  paymentToClearInIntro: number;
}

export function balanceTransfer(i: BalanceTransferInput): BalanceTransferResult {
  const fee = (i.balance * i.feePercent) / 100;
  const keep = payoffWithFixedPayment(i.balance, i.currentApr, i.monthlyPayment);

  // Transfer path: intro APR for introMonths, then go-to APR.
  let bal = i.balance + fee;
  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;
  let balanceAfterIntro = 0;
  let neverPaysOff = false;
  while (bal > 0.005 && month < 1200) {
    month++;
    const apr = month <= i.introMonths ? i.introApr : i.goToApr;
    const interest = bal * monthlyRate(apr);
    if (month > i.introMonths && i.monthlyPayment <= interest) {
      neverPaysOff = true;
      break;
    }
    const pay = Math.min(i.monthlyPayment, bal + interest);
    bal = bal + interest - pay;
    totalInterest += interest;
    totalPaid += pay;
    if (month === i.introMonths) balanceAfterIntro = Math.max(bal, 0);
  }
  if (month < i.introMonths) balanceAfterIntro = 0;

  const transferCost = neverPaysOff ? Infinity : totalInterest + fee;
  const keepCost = keep.neverPaysOff ? Infinity : keep.totalInterest;
  const netSavings = keepCost === Infinity && transferCost === Infinity ? 0 : keepCost - transferCost;

  const transferred = i.balance + fee;
  const paymentToClearInIntro =
    i.introMonths > 0 ? amortizedPayment(transferred, i.introApr, i.introMonths) : Infinity;

  return {
    fee,
    keep,
    transfer: {
      months: neverPaysOff ? Infinity : month,
      totalInterest: neverPaysOff ? Infinity : totalInterest,
      totalPaid: neverPaysOff ? Infinity : totalPaid,
      neverPaysOff,
      balanceAfterIntro,
    },
    netSavings,
    paymentToClearInIntro,
  };
}

/* ------------------------------------------------------------------------ */
/* Debt consolidation loan                                                   */
/* ------------------------------------------------------------------------ */

export interface ConsolidationDebt {
  name: string;
  balance: number;
  apr: number;
  payment: number;
}

export interface ConsolidationInput {
  debts: ConsolidationDebt[];
  loanApr: number;
  termMonths: number;
  /** Origination fee as % of the loan amount. */
  feePercent: number;
  /** true = fee is deducted from proceeds, so you must borrow more to net the payoff amount. */
  feeFromProceeds: boolean;
}

export function debtConsolidation(i: ConsolidationInput) {
  const totalBalance = i.debts.reduce((s, d) => s + d.balance, 0);
  const currentPayment = i.debts.reduce((s, d) => s + d.payment, 0);

  let currentInterest = 0;
  let currentMonths = 0;
  let currentNever = false;
  for (const d of i.debts) {
    const r = payoffWithFixedPayment(d.balance, d.apr, d.payment);
    if (r.neverPaysOff) currentNever = true;
    else {
      currentInterest += r.totalInterest;
      currentMonths = Math.max(currentMonths, r.months);
    }
  }
  const weightedApr = totalBalance > 0 ? i.debts.reduce((s, d) => s + d.apr * d.balance, 0) / totalBalance : 0;

  const f = i.feePercent / 100;
  const loanAmount = i.feeFromProceeds ? (f < 1 ? totalBalance / (1 - f) : Infinity) : totalBalance * (1 + f);
  const fee = loanAmount * f;
  const payment = amortizedPayment(loanAmount, i.loanApr, i.termMonths);
  const loanTotalPaid = payment * i.termMonths;
  const loanInterest = loanTotalPaid - loanAmount;
  // True APR: borrower effectively receives `totalBalance` and repays `payment` × term.
  const trueApr = aprFromPayments(totalBalance, payment, i.termMonths, 12);

  const currentCost = currentNever ? Infinity : currentInterest;
  const loanCost = loanInterest + fee;

  return {
    totalBalance,
    currentPayment,
    currentInterest: currentNever ? Infinity : currentInterest,
    currentMonths: currentNever ? Infinity : currentMonths,
    weightedApr,
    loanAmount,
    fee,
    payment,
    loanInterest,
    loanCost,
    trueApr,
    monthlyChange: payment - currentPayment,
    savings: currentCost - loanCost,
  };
}

/* ------------------------------------------------------------------------ */
/* Credit utilization                                                        */
/* ------------------------------------------------------------------------ */

export interface Card {
  name: string;
  balance: number;
  limit: number;
}

export type UtilizationBand = 'excellent' | 'good' | 'fair' | 'poor' | 'very-poor';

export function utilizationBand(pct: number): UtilizationBand {
  if (pct < 10) return 'excellent';
  if (pct < 30) return 'good';
  if (pct < 50) return 'fair';
  if (pct < 75) return 'poor';
  return 'very-poor';
}

export function creditUtilization(cards: Card[], targetPercent = 30) {
  const totalBalance = cards.reduce((s, c) => s + Math.max(c.balance, 0), 0);
  const totalLimit = cards.reduce((s, c) => s + Math.max(c.limit, 0), 0);
  const overall = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : NaN;
  const perCard = cards.map((c) => {
    const pct = c.limit > 0 ? (c.balance / c.limit) * 100 : NaN;
    return {
      ...c,
      percent: pct,
      paydownToTarget: c.limit > 0 ? Math.max(0, c.balance - (targetPercent / 100) * c.limit) : 0,
    };
  });
  return {
    totalBalance,
    totalLimit,
    overall,
    band: Number.isNaN(overall) ? null : utilizationBand(overall),
    perCard,
    paydownToTarget: Math.max(0, totalBalance - (targetPercent / 100) * totalLimit),
    maxedCards: perCard.filter((c) => c.percent >= 90).length,
  };
}

/* ------------------------------------------------------------------------ */
/* Debt-to-income ratio                                                       */
/* ------------------------------------------------------------------------ */

export type DtiBand = 'excellent' | 'good' | 'stretched' | 'high' | 'very-high';

export function dtiBand(backEnd: number): DtiBand {
  if (backEnd <= 20) return 'excellent';
  if (backEnd <= 36) return 'good';
  if (backEnd <= 43) return 'stretched';
  if (backEnd <= 50) return 'high';
  return 'very-high';
}

export function debtToIncome(grossMonthlyIncome: number, housing: number, otherDebts: number, targetBackEnd = 36) {
  const total = housing + otherDebts;
  const backEnd = grossMonthlyIncome > 0 ? (total / grossMonthlyIncome) * 100 : NaN;
  const frontEnd = grossMonthlyIncome > 0 ? (housing / grossMonthlyIncome) * 100 : NaN;
  const maxTotalAtTarget = (targetBackEnd / 100) * grossMonthlyIncome;
  return {
    total,
    backEnd,
    frontEnd,
    band: Number.isNaN(backEnd) ? null : dtiBand(backEnd),
    /** Largest housing payment that keeps back-end DTI at the target. */
    maxHousingAtTarget: Math.max(0, maxTotalAtTarget - otherDebts),
    /** Monthly debt payments to cut to reach the target. */
    reductionToTarget: Math.max(0, total - maxTotalAtTarget),
    /** Gross monthly income needed to reach the target with current debts. */
    incomeNeededForTarget: targetBackEnd > 0 ? total / (targetBackEnd / 100) : Infinity,
  };
}

export { monthsToPayoff, payoffWithFixedPayment };
