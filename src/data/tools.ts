import { categoryById } from './categories';

export interface Tool {
  /** URL segment: /{slug}/ */
  slug: string;
  /** Visible H1 and card title. */
  title: string;
  /** One-line description for cards and menus. */
  short: string;
  category: string;
  icon: string;
  /** <title> — keep under ~60 characters; the site name is appended automatically. */
  metaTitle: string;
  /** Meta description — aim for 140–160 characters. */
  metaDescription: string;
  /** ISO date the page (and its rules/data) were last reviewed. */
  updated: string;
  /** Show on the home page "popular" row. */
  featured?: boolean;
}

export const tools: Tool[] = [
  // Debt & credit
  {
    slug: 'credit-card-payoff-calculator',
    title: 'Credit Card Payoff Calculator',
    short: 'Find your payoff date, total interest, and the payment needed to be debt-free by a target date.',
    category: 'debt-credit',
    icon: 'credit-card',
    metaTitle: 'Credit Card Payoff Calculator: Payoff Date & Interest',
    metaDescription:
      'Free credit card payoff calculator. See your debt-free date, total interest, and how much faster a bigger payment pays off your balance versus the minimum.',
    updated: '2026-09-25',
    featured: true,
  },
  {
    slug: 'debt-payoff-calculator',
    title: 'Debt Payoff Calculator: Avalanche vs Snowball',
    short: 'Build a month-by-month plan for all your debts and compare the avalanche and snowball methods.',
    category: 'debt-credit',
    icon: 'layers',
    metaTitle: 'Debt Payoff Calculator: Avalanche vs Snowball Planner',
    metaDescription:
      'Compare the debt avalanche and debt snowball methods side by side. Enter up to 10 debts to see your payoff order, debt-free date and interest saved.',
    updated: '2026-09-25',
    featured: true,
  },
  {
    slug: 'debt-to-income-ratio-calculator',
    title: 'Debt-to-Income (DTI) Ratio Calculator',
    short: 'Calculate front-end and back-end DTI and see how lenders for mortgages and loans will view it.',
    category: 'debt-credit',
    icon: 'percent',
    metaTitle: 'Debt-to-Income Ratio Calculator (Front & Back-End DTI)',
    metaDescription:
      'Calculate your front-end and back-end debt-to-income ratio, compare it with conventional, FHA, VA and USDA mortgage limits, and find your max housing payment.',
    updated: '2026-09-25',
    featured: true,
  },
  {
    slug: 'credit-utilization-calculator',
    title: 'Credit Utilization Calculator',
    short: 'Check your overall and per-card utilization and how much to pay down to hit your target.',
    category: 'debt-credit',
    icon: 'pie-chart',
    metaTitle: 'Credit Utilization Calculator: Overall & Per-Card Ratio',
    metaDescription:
      'Calculate your credit utilization ratio across all cards and per card, see where it falls for credit scoring, and how much to pay down to reach 30% or 10%.',
    updated: '2026-09-25',
  },
  {
    slug: 'balance-transfer-calculator',
    title: 'Balance Transfer Calculator',
    short: 'Find out if a 0% balance transfer card saves money after the transfer fee.',
    category: 'debt-credit',
    icon: 'arrow-right',
    metaTitle: 'Balance Transfer Calculator: Is a 0% Offer Worth It?',
    metaDescription:
      'See how much a 0% APR balance transfer saves after the 3%–5% fee, the monthly payment needed to clear it before the promo ends, and what happens if you don’t.',
    updated: '2026-09-25',
  },
  {
    slug: 'debt-consolidation-calculator',
    title: 'Debt Consolidation Calculator',
    short: 'Compare keeping your current debts with a consolidation loan, including origination fees.',
    category: 'debt-credit',
    icon: 'coins',
    metaTitle: 'Debt Consolidation Calculator: Loan vs Current Debts',
    metaDescription:
      'Compare your current debts with a debt consolidation loan. Includes origination fees and true APR so you can see your real monthly and total savings.',
    updated: '2026-09-25',
  },

  // Home equity & real estate
  {
    slug: 'heloc-payment-calculator',
    title: 'HELOC Payment Calculator',
    short: 'Estimate interest-only draw-period payments and the jump when repayment begins.',
    category: 'home-equity',
    icon: 'home',
    metaTitle: 'HELOC Payment Calculator: Interest-Only & Repayment',
    metaDescription:
      'Estimate your HELOC payment during the interest-only draw period and the higher principal-and-interest payment when repayment starts, plus total interest.',
    updated: '2026-09-25',
    featured: true,
  },
  {
    slug: 'home-equity-calculator',
    title: 'Home Equity Calculator: How Much Can I Borrow?',
    short: 'See your equity and how much a lender may let you borrow at 80%, 85% or 90% CLTV.',
    category: 'home-equity',
    icon: 'landmark',
    metaTitle: 'Home Equity Calculator: How Much Can You Borrow?',
    metaDescription:
      'Calculate your home equity and how much you can borrow with a HELOC or home equity loan at 80%, 85% or 90% combined loan-to-value (CLTV).',
    updated: '2026-09-25',
  },
  {
    slug: 'cash-out-refinance-vs-heloc-calculator',
    title: 'Cash-Out Refinance vs HELOC Calculator',
    short: 'Compare the full cost of refinancing your mortgage vs keeping it and adding a HELOC.',
    category: 'home-equity',
    icon: 'sliders',
    metaTitle: 'Cash-Out Refinance vs HELOC Calculator: Which Costs Less?',
    metaDescription:
      'Compare a cash-out refinance with keeping your mortgage and opening a HELOC. See monthly payments, closing costs and total interest over your time horizon.',
    updated: '2026-09-25',
  },
  {
    slug: 'dscr-loan-calculator',
    title: 'DSCR Loan Calculator',
    short: 'Calculate the debt service coverage ratio lenders use for rental property loans.',
    category: 'home-equity',
    icon: 'building',
    metaTitle: 'DSCR Loan Calculator: Rental Property DSCR & Max Loan',
    metaDescription:
      'Calculate the DSCR ratio lenders use for investment property loans, the maximum loan at a 1.0 or 1.25 DSCR, and the rent you need to qualify.',
    updated: '2026-09-25',
  },

  {
    slug: 'rental-property-calculator',
    title: 'Rental Property Calculator',
    short: 'Cash flow, cap rate, cash-on-cash return and DSCR for a rental property.',
    category: 'home-equity',
    icon: 'chart',
    metaTitle: 'Rental Property Calculator: Cash Flow, Cap Rate & ROI',
    metaDescription:
      'Analyze a rental property: monthly cash flow, NOI, cap rate, cash-on-cash return, DSCR and break-even occupancy, with realistic expense estimates.',
    updated: '2026-09-25',
  },
  {
    slug: 'brrrr-calculator',
    title: 'BRRRR Calculator',
    short: 'Buy, rehab, rent, refinance, repeat: cash left in the deal, cash flow and returns.',
    category: 'home-equity',
    icon: 'refresh',
    metaTitle: 'BRRRR Calculator: Cash Left in the Deal, Cash Flow & ROI',
    metaDescription:
      'Model a BRRRR deal: all-in cost, hard money costs, cash-out refinance at ARV, cash left in the deal, monthly cash flow and cash-on-cash return.',
    updated: '2026-09-25',
  },
  // Business financing
  {
    slug: 'merchant-cash-advance-calculator',
    title: 'Merchant Cash Advance Calculator',
    short: 'Convert an MCA factor rate into APR and see the daily or weekly payment.',
    category: 'business-financing',
    icon: 'zap',
    metaTitle: 'Merchant Cash Advance Calculator: Factor Rate to APR',
    metaDescription:
      'Convert a merchant cash advance factor rate into a true APR. See total payback, daily or weekly payments and the real cost after fees before you sign.',
    updated: '2026-09-25',
    featured: true,
  },
  {
    slug: 'invoice-factoring-calculator',
    title: 'Invoice Factoring Calculator',
    short: 'See your advance, fees, rebate and the effective annual cost of factoring an invoice.',
    category: 'business-financing',
    icon: 'file-text',
    metaTitle: 'Invoice Factoring Calculator: Fees, Advance & True APR',
    metaDescription:
      'Calculate invoice factoring costs: upfront advance, factoring fees, reserve rebate, net proceeds and the effective APR on the cash you actually receive.',
    updated: '2026-09-25',
  },
  {
    slug: 'equipment-loan-calculator',
    title: 'Equipment Loan Calculator',
    short: 'Estimate monthly payments, total interest and year-one tax savings on equipment financing.',
    category: 'business-financing',
    icon: 'briefcase',
    metaTitle: 'Equipment Loan Calculator: Payment, APR & Tax Savings',
    metaDescription:
      'Estimate equipment loan payments with down payment, sales tax, fees and balloon options, plus the true APR and potential Section 179 tax savings.',
    updated: '2026-09-25',
  },

  // Taxes
  {
    slug: 'new-tax-deductions-calculator',
    title: 'Schedule 1-A Calculator: New Tax Deductions',
    short: 'Stack the tips, overtime, car loan interest and senior deductions and see your total tax savings.',
    category: 'taxes',
    icon: 'receipt',
    metaTitle: 'Schedule 1-A Calculator: Tips, Overtime, Car Loan & Senior',
    metaDescription:
      'Estimate all four new Schedule 1-A deductions — tips, overtime, car loan interest and the $6,000 senior deduction — plus your combined federal tax savings.',
    updated: '2026-09-25',
    featured: true,
  },
  {
    slug: 'car-loan-interest-deduction-calculator',
    title: 'Car Loan Interest Deduction Calculator',
    short: 'Estimate the new up-to-$10,000 deduction for new-car loan interest (2025–2028).',
    category: 'taxes',
    icon: 'car',
    metaTitle: 'Car Loan Interest Deduction Calculator (2025–2028)',
    metaDescription:
      'Estimate the new car loan interest deduction: eligibility, the $10,000 cap, the income phase-out, and how much it actually lowers your federal tax.',
    updated: '2026-09-25',
  },
  {
    slug: 'no-tax-on-overtime-calculator',
    title: 'No Tax on Overtime Calculator',
    short: 'Work out your qualified overtime and the federal tax the new deduction saves.',
    category: 'taxes',
    icon: 'clock',
    metaTitle: 'No Tax on Overtime Calculator 2026: Deduction & Savings',
    metaDescription:
      'Estimate the overtime deduction: qualified overtime (the “half” in time-and-a-half), the $12,500/$25,000 cap, the income phase-out and your federal tax savings.',
    updated: '2026-09-25',
  },
  {
    slug: 'no-tax-on-tips-calculator',
    title: 'No Tax on Tips Calculator',
    short: 'Estimate the deduction for qualified tips (up to $25,000) and your tax savings.',
    category: 'taxes',
    icon: 'gift',
    metaTitle: 'No Tax on Tips Calculator 2026: $25,000 Deduction Estimate',
    metaDescription:
      'Estimate the no tax on tips deduction: qualified tips, the $25,000 cap, the phase-out above $150,000 of income and how much federal tax you save.',
    updated: '2026-09-25',
  },
  {
    slug: 'senior-deduction-calculator',
    title: 'Senior Deduction Calculator ($6,000)',
    short: 'Estimate the new $6,000 deduction for people 65 and older, after the income phase-out.',
    category: 'taxes',
    icon: 'heart',
    metaTitle: 'Senior Bonus Deduction Calculator: Extra $6,000 for 65+',
    metaDescription:
      'Estimate the new $6,000 senior deduction for taxpayers 65 and older (2025–2028), including the 6% income phase-out and your federal tax savings.',
    updated: '2026-09-25',
  },

  // Health & benefits
  {
    slug: 'aca-subsidy-calculator',
    title: 'ACA Subsidy Calculator 2026',
    short: 'Estimate your 2026 premium tax credit and see if the 400% income cliff affects you.',
    category: 'health-benefits',
    icon: 'shield',
    metaTitle: 'ACA Subsidy Calculator 2026: Premium Tax Credit Estimate',
    metaDescription:
      'Estimate your 2026 ACA premium tax credit from household size, income and the benchmark silver premium — and see how the return of the 400% FPL cliff affects you.',
    updated: '2026-09-25',
    featured: true,
  },
  {
    slug: 'irmaa-calculator',
    title: 'IRMAA Calculator 2026',
    short: 'See your 2026 Medicare Part B and Part D premiums and how close you are to the next bracket.',
    category: 'health-benefits',
    icon: 'trending-up',
    metaTitle: 'IRMAA Calculator 2026: Medicare Part B & D Surcharges',
    metaDescription:
      'Calculate 2026 Medicare IRMAA surcharges for Part B and Part D from your MAGI and filing status, see your bracket, and how much income to cut to drop a tier.',
    updated: '2026-09-25',
    featured: true,
  },
  {
    slug: 'ssdi-back-pay-calculator',
    title: 'SSDI Back Pay Calculator',
    short: 'Estimate Social Security disability back pay, the waiting period and attorney fee.',
    category: 'health-benefits',
    icon: 'calendar',
    metaTitle: 'SSDI Back Pay Calculator: Estimate Your Lump Sum',
    metaDescription:
      'Estimate SSDI back pay from your onset, application and approval dates: the 5-month waiting period, 12-month retroactive limit and the $9,200 attorney fee cap.',
    updated: '2026-09-25',
  },
];

export const toolBySlug = (slug: string): Tool => {
  const t = tools.find((x) => x.slug === slug);
  if (!t) throw new Error(`Unknown tool: ${slug}`);
  return t;
};

export const toolsInCategory = (categoryId: string) => tools.filter((t) => t.category === categoryId);

/** Related tools: explicit list first, then same-category siblings. */
export const relatedTools = (slug: string, explicit: string[] = [], limit = 6): Tool[] => {
  const self = toolBySlug(slug);
  const picked = explicit.map(toolBySlug);
  const siblings = toolsInCategory(self.category).filter(
    (t) => t.slug !== slug && !picked.some((p) => p.slug === t.slug),
  );
  return [...picked, ...siblings].slice(0, limit);
};

export const categoryOf = (tool: Tool) => categoryById(tool.category);

/** Title without a subtitle after a colon or a trailing parenthetical, for compact link lists. */
export const shortTitle = (tool: Tool) => tool.title.replace(/:.*$/, '').replace(/\s*\([^)]*\)$/, '');
