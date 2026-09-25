/**
 * Health & benefits calculators: ACA premium tax credit (2026), Medicare IRMAA
 * (2025/2026) and SSDI back pay. Every figure is listed with its official
 * source in docs/DATA-SOURCES.md — re-verify when agencies publish new numbers.
 */

/* ------------------------------------------------------------------------ */
/* ACA premium tax credit                                                     */
/* ------------------------------------------------------------------------ */

export type FplRegion = 'contiguous' | 'alaska' | 'hawaii';

/** 2025 HHS poverty guidelines — used for 2026 Marketplace coverage. */
export const FPL_2025: Record<FplRegion, { base: number; perPerson: number }> = {
  contiguous: { base: 15650, perPerson: 5500 },
  alaska: { base: 19550, perPerson: 6880 },
  hawaii: { base: 17990, perPerson: 6330 },
};

export function povertyLine(householdSize: number, region: FplRegion): number {
  const g = FPL_2025[region];
  return g.base + g.perPerson * Math.max(0, Math.round(householdSize) - 1);
}

/** [lower FPL %, upper FPL %, initial %, final %] — applicable percentage table. */
type Band = [number, number, number, number];

/** 2026 applicable percentage table (Rev. Proc. 2025-25), after the enhanced credits expired. */
export const APPLICABLE_2026: Band[] = [
  [0, 133, 2.1, 2.1],
  [133, 150, 3.14, 4.19],
  [150, 200, 4.19, 6.6],
  [200, 250, 6.6, 8.44],
  [250, 300, 8.44, 9.96],
  [300, 400, 9.96, 9.96],
];

/** 2021–2025 enhanced (ARPA/IRA) schedule, for comparison: no 400% cliff, 8.5% cap. */
export const APPLICABLE_ENHANCED: Band[] = [
  [0, 150, 0, 0],
  [150, 200, 0, 2],
  [200, 250, 2, 4],
  [250, 300, 4, 6],
  [300, 400, 6, 8.5],
  [400, Infinity, 8.5, 8.5],
];

/**
 * Applicable percentage for a household at `fplPercent` of the poverty line,
 * interpolated linearly within each band. Returns null above the table (no credit).
 * The top band includes its upper edge (credit is allowed "up to and including" 400% FPL).
 */
export function applicablePercentage(fplPercent: number, table: Band[]): number | null {
  if (Number.isNaN(fplPercent) || fplPercent < 0) return null;
  for (let k = 0; k < table.length; k++) {
    const [lo, hi, a, b] = table[k];
    const last = k === table.length - 1;
    if (fplPercent >= lo && (fplPercent < hi || (last && fplPercent <= hi))) {
      if (!Number.isFinite(hi) || a === b) return a;
      return a + ((fplPercent - lo) / (hi - lo)) * (b - a);
    }
  }
  return null;
}

export interface AcaInput {
  householdSize: number;
  magi: number;
  region: FplRegion;
  /** Monthly premium of the second-lowest-cost silver plan (benchmark) for your household. */
  benchmarkMonthly: number;
  /** Monthly premium of the plan you want (0 = same as benchmark). */
  planMonthly: number;
  schedule: 'current' | 'enhanced';
}

export function acaSubsidy(i: AcaInput) {
  const fpl = povertyLine(i.householdSize, i.region);
  const fplPercent = fpl > 0 ? (i.magi / fpl) * 100 : NaN;
  const table = i.schedule === 'enhanced' ? APPLICABLE_ENHANCED : APPLICABLE_2026;
  const belowFloor = fplPercent < 100;
  const pct = belowFloor ? null : applicablePercentage(fplPercent, table);
  const eligible = pct !== null;
  const contributionAnnual = eligible ? (i.magi * (pct as number)) / 100 : NaN;
  const contributionMonthly = contributionAnnual / 12;
  const planMonthly = i.planMonthly > 0 ? i.planMonthly : i.benchmarkMonthly;
  const creditMonthly = eligible ? Math.max(0, Math.min(i.benchmarkMonthly - contributionMonthly, planMonthly)) : 0;
  const netMonthly = Math.max(0, planMonthly - creditMonthly);
  // Distance to the 400% cliff (2026 rules).
  const cliffIncome = 4 * fpl;
  return {
    fpl,
    fplPercent,
    applicablePercent: pct,
    eligible,
    belowFloor,
    aboveCliff: !eligible && !belowFloor,
    contributionAnnual,
    contributionMonthly,
    creditMonthly,
    creditAnnual: creditMonthly * 12,
    planMonthly,
    netMonthly,
    netAnnual: netMonthly * 12,
    cliffIncome,
    overCliffBy: i.magi - cliffIncome,
    /** Medicaid expansion threshold (138% FPL) — informational. */
    medicaidLine: fpl * 1.38,
  };
}

/* ------------------------------------------------------------------------ */
/* Medicare IRMAA                                                              */
/* ------------------------------------------------------------------------ */

export type IrmaaStatus = 'individual' | 'joint' | 'mfs';
export type IrmaaYear = 2025 | 2026;

interface IrmaaTier {
  /** Upper MAGI bound (inclusive) for individual / joint filers. */
  individualMax: number;
  jointMax: number;
  partB: number;
  partD: number;
}

export const IRMAA: Record<IrmaaYear, { standardB: number; deductibleB: number; tiers: IrmaaTier[]; mfsMiddleMax: number }> = {
  2026: {
    standardB: 202.9,
    deductibleB: 283,
    mfsMiddleMax: 391000,
    tiers: [
      { individualMax: 109000, jointMax: 218000, partB: 202.9, partD: 0 },
      { individualMax: 137000, jointMax: 274000, partB: 284.1, partD: 14.5 },
      { individualMax: 171000, jointMax: 342000, partB: 405.8, partD: 37.5 },
      { individualMax: 205000, jointMax: 410000, partB: 527.5, partD: 60.4 },
      { individualMax: 499999.99, jointMax: 749999.99, partB: 649.2, partD: 83.3 },
      { individualMax: Infinity, jointMax: Infinity, partB: 689.9, partD: 91.0 },
    ],
  },
  2025: {
    standardB: 185.0,
    deductibleB: 257,
    mfsMiddleMax: 394000,
    tiers: [
      { individualMax: 106000, jointMax: 212000, partB: 185.0, partD: 0 },
      { individualMax: 133000, jointMax: 266000, partB: 259.0, partD: 13.7 },
      { individualMax: 167000, jointMax: 334000, partB: 370.0, partD: 35.3 },
      { individualMax: 200000, jointMax: 400000, partB: 480.9, partD: 57.0 },
      { individualMax: 499999.99, jointMax: 749999.99, partB: 591.9, partD: 78.6 },
      { individualMax: Infinity, jointMax: Infinity, partB: 628.9, partD: 85.8 },
    ],
  },
};

export function irmaaTierIndex(magi: number, status: IrmaaStatus, year: IrmaaYear): number {
  const t = IRMAA[year];
  if (status === 'mfs') {
    // Married filing separately and lived with spouse: only three levels.
    if (magi <= t.tiers[0].individualMax) return 0;
    if (magi < t.mfsMiddleMax) return 4;
    return 5;
  }
  const key = status === 'joint' ? 'jointMax' : 'individualMax';
  return t.tiers.findIndex((x) => magi <= x[key]);
}

export function irmaa(magi: number, status: IrmaaStatus, year: IrmaaYear, peopleOnMedicare = 1) {
  const t = IRMAA[year];
  const idx = irmaaTierIndex(magi, status, year);
  const tier = t.tiers[idx];
  const surchargeB = tier.partB - t.standardB;
  const monthlySurcharge = surchargeB + tier.partD;
  const people = Math.max(1, Math.round(peopleOnMedicare));

  // Headroom to the current tier's ceiling and savings from dropping one tier.
  let nextThreshold: number | null = null;
  let dropTo: number | null = null;
  if (status === 'mfs') {
    if (idx === 0) nextThreshold = t.tiers[0].individualMax;
    else if (idx === 4) {
      nextThreshold = t.mfsMiddleMax;
      dropTo = t.tiers[0].individualMax;
    } else dropTo = t.mfsMiddleMax - 1;
  } else {
    const key = status === 'joint' ? 'jointMax' : 'individualMax';
    if (Number.isFinite(tier[key])) nextThreshold = tier[key];
    if (idx > 0) dropTo = t.tiers[idx - 1][key];
  }

  return {
    tierIndex: idx,
    partBMonthly: tier.partB,
    partDSurcharge: tier.partD,
    standardB: t.standardB,
    monthlySurchargePerPerson: monthlySurcharge,
    annualSurchargeHousehold: monthlySurcharge * 12 * people,
    annualPartBHousehold: tier.partB * 12 * people,
    headroom: nextThreshold !== null ? nextThreshold - magi : null,
    reduceBy: dropTo !== null ? Math.max(0, magi - dropTo) : null,
  };
}

/* ------------------------------------------------------------------------ */
/* SSDI back pay                                                              */
/* ------------------------------------------------------------------------ */

/** Maximum fee a representative can receive under a fee agreement (since Nov 30, 2024). */
export const SSDI_FEE_CAP = 9200;

export interface SsdiInput {
  /** Established onset date (YYYY-MM-DD). */
  onset: string;
  /** Date you applied (protective filing date). */
  applied: string;
  /** Date of approval (or expected approval). */
  approved: string;
  monthlyBenefit: number;
  hasRepresentative: boolean;
  /** ALS: no five-month waiting period. */
  als: boolean;
}

/** Month index (years × 12 + month) for date math at month granularity. */
const monthIndex = (d: Date) => d.getUTCFullYear() * 12 + d.getUTCMonth();
const parseDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1));
};
export const monthLabel = (idx: number) => {
  const y = Math.floor(idx / 12);
  const m = idx % 12;
  return new Date(Date.UTC(y, m, 1)).toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};

export function ssdiBackPay(i: SsdiInput) {
  const onset = parseDate(i.onset);
  const applied = parseDate(i.applied);
  const approved = parseDate(i.approved);

  // The waiting period starts with the first FULL calendar month of disability.
  const firstFullMonth = monthIndex(onset) + (onset.getUTCDate() === 1 ? 0 : 1);
  const waitingMonths = i.als ? 0 : 5;
  const entitlementMonth = firstFullMonth + waitingMonths;
  // Retroactive benefits: up to 12 months before the application month.
  const retroLimit = monthIndex(applied) - 12;
  const firstPayable = Math.max(entitlementMonth, retroLimit);
  // Past-due benefits run through the month before the approval month.
  const lastPastDue = monthIndex(approved) - 1;
  const months = Math.max(0, lastPastDue - firstPayable + 1);
  const backPay = months * Math.max(0, i.monthlyBenefit);
  const fee = i.hasRepresentative ? Math.min(backPay * 0.25, SSDI_FEE_CAP) : 0;

  return {
    firstFullMonth,
    entitlementMonth,
    retroLimit,
    firstPayable,
    lastPastDue,
    months,
    backPay,
    fee,
    net: backPay - fee,
    retroCapped: retroLimit > entitlementMonth,
    invalid: Number.isNaN(onset.getTime()) || Number.isNaN(applied.getTime()) || Number.isNaN(approved.getTime()) || approved < applied,
  };
}
