/**
 * Financial glossary: plain-English definitions of the terms used across the
 * calculators and guides. Each term gets an anchor on /glossary/ (e.g.
 * /glossary/#apr), and calculators and guides link to the terms listed for
 * them. Keep figures in sync with src/lib/calc/* and the guides.
 */

export interface GlossaryTerm {
  /** Anchor on /glossary/ — lowercase, hyphenated, unique. */
  id: string;
  term: string;
  /** Plain text (no HTML) — also used in structured data. */
  definition: string;
  /** Calculator slugs where the term matters. */
  tools?: string[];
  /** Guide slugs that explain the term in depth. */
  guides?: string[];
  /** Related glossary ids. */
  see?: string[];
}

/** Date the glossary was last reviewed. */
export const glossaryUpdated = '2026-09-25';

export const glossary: GlossaryTerm[] = [
  // Debt & credit
  {
    id: 'amortization',
    term: 'Amortization',
    definition:
      'Repaying a loan with equal scheduled payments that cover both interest and principal. Early payments are mostly interest; as the balance falls, more of each payment goes to principal. An amortization schedule shows the split payment by payment.',
    tools: ['equipment-loan-calculator', 'debt-consolidation-calculator', 'heloc-payment-calculator'],
    see: ['principal', 'apr'],
  },
  {
    id: 'apr',
    term: 'Annual percentage rate (APR)',
    definition:
      'The yearly cost of borrowing, expressed as a percentage. For installment loans, APR includes the interest rate plus certain fees, so it lets you compare offers on equal terms. For credit cards, the APR is the interest rate charged on balances you carry.',
    tools: ['credit-card-payoff-calculator', 'debt-consolidation-calculator', 'merchant-cash-advance-calculator', 'equipment-loan-calculator'],
    guides: ['factor-rate-vs-apr', 'how-credit-card-interest-is-calculated'],
    see: ['daily-periodic-rate', 'factor-rate'],
  },
  {
    id: 'average-daily-balance',
    term: 'Average daily balance',
    definition:
      'The method most credit card issuers use to calculate interest: the balance at the end of each day in the billing cycle, added up and divided by the number of days. Interest is roughly the average daily balance times the daily periodic rate times the days in the cycle.',
    tools: ['credit-card-payoff-calculator'],
    guides: ['how-credit-card-interest-is-calculated'],
    see: ['daily-periodic-rate', 'grace-period'],
  },
  {
    id: 'balance-transfer',
    term: 'Balance transfer',
    definition:
      'Moving a balance from one credit card or loan to another card, usually to use a low or 0% introductory APR. Most cards charge a balance transfer fee, commonly 3% to 5% of the amount moved.',
    tools: ['balance-transfer-calculator'],
    guides: ['balance-transfer-vs-personal-loan'],
    see: ['intro-apr', 'debt-consolidation'],
  },
  {
    id: 'credit-utilization',
    term: 'Credit utilization ratio',
    definition:
      'The share of your available revolving credit you are using: total card balances divided by total credit limits. Credit scores consider both your overall ratio and each card’s ratio. Lower is better, and many experts suggest staying under 30%.',
    tools: ['credit-utilization-calculator'],
    guides: ['pay-credit-card-before-statement-date'],
  },
  {
    id: 'daily-periodic-rate',
    term: 'Daily periodic rate',
    definition:
      'A credit card’s APR divided by 365 (some issuers use 360). It is the rate applied to each day’s balance when interest is calculated.',
    tools: ['credit-card-payoff-calculator'],
    guides: ['how-credit-card-interest-is-calculated'],
    see: ['apr', 'average-daily-balance'],
  },
  {
    id: 'debt-avalanche',
    term: 'Debt avalanche',
    definition:
      'A payoff strategy: pay the minimum on every debt and put all extra money toward the debt with the highest interest rate first. It costs the least total interest.',
    tools: ['debt-payoff-calculator'],
    guides: ['debt-avalanche-vs-snowball'],
    see: ['debt-snowball'],
  },
  {
    id: 'debt-consolidation',
    term: 'Debt consolidation',
    definition:
      'Combining several debts into one new loan or credit line, ideally with a lower interest rate or a single, predictable payment. Common options are personal loans, balance transfer cards and home equity loans.',
    tools: ['debt-consolidation-calculator', 'balance-transfer-calculator'],
    guides: ['balance-transfer-vs-personal-loan'],
    see: ['balance-transfer'],
  },
  {
    id: 'debt-snowball',
    term: 'Debt snowball',
    definition:
      'A payoff strategy: pay the minimum on every debt and put extra money toward the smallest balance first, regardless of its rate. It usually costs more interest than the avalanche but delivers quick wins that help some people stay motivated.',
    tools: ['debt-payoff-calculator'],
    guides: ['debt-avalanche-vs-snowball'],
    see: ['debt-avalanche'],
  },
  {
    id: 'dti',
    term: 'Debt-to-income ratio (DTI)',
    definition:
      'Your monthly debt payments divided by your gross (pre-tax) monthly income. Lenders look at the front-end ratio, which counts housing costs only, and the back-end ratio, which counts all debts including housing.',
    tools: ['debt-to-income-ratio-calculator'],
    guides: ['how-lenders-calculate-dti', 'heloc-requirements'],
  },
  {
    id: 'grace-period',
    term: 'Grace period',
    definition:
      'For credit cards, the time between the end of a billing cycle and the payment due date — at least 21 days when a card offers one. If you pay the full statement balance by the due date, you usually owe no interest on new purchases.',
    tools: ['credit-card-payoff-calculator'],
    guides: ['how-credit-card-interest-is-calculated', 'pay-credit-card-before-statement-date'],
    see: ['average-daily-balance'],
  },
  {
    id: 'intro-apr',
    term: 'Introductory (promotional) APR',
    definition:
      'A temporary low or 0% rate on purchases or balance transfers, often lasting 12 to 21 months. When it ends, any remaining balance starts accruing interest at the card’s regular APR.',
    tools: ['balance-transfer-calculator'],
    guides: ['balance-transfer-vs-personal-loan'],
    see: ['balance-transfer', 'apr'],
  },
  {
    id: 'minimum-payment',
    term: 'Minimum payment',
    definition:
      'The smallest amount you must pay on a credit card each month to stay current — often 1% to 3% of the balance plus interest and fees, or a flat minimum such as $25 to $40. Paying only the minimum can stretch payoff over many years and multiply the interest you pay.',
    tools: ['credit-card-payoff-calculator', 'debt-payoff-calculator'],
  },
  {
    id: 'principal',
    term: 'Principal',
    definition:
      'The amount you borrowed, or the part of it you still owe, not counting interest. Extra payments applied to principal reduce the interest charged from then on.',
    tools: ['debt-payoff-calculator', 'equipment-loan-calculator'],
    see: ['amortization'],
  },

  {
    id: 'statement-closing-date',
    term: 'Statement closing date',
    definition:
      'The last day of a credit card’s billing cycle. Your statement balance is calculated that day, and most issuers report it to the credit bureaus around then. The payment due date usually falls 21 to 25 days later.',
    tools: ['credit-utilization-calculator', 'credit-card-payoff-calculator'],
    guides: ['pay-credit-card-before-statement-date'],
    see: ['credit-utilization', 'grace-period'],
  },
  // Home equity & real estate
  {
    id: 'arv',
    term: 'After-repair value (ARV)',
    definition:
      'The estimated market value of a property after planned renovations. In the BRRRR method, the refinance loan is usually sized as a percentage of the appraised after-repair value.',
    tools: ['brrrr-calculator'],
    see: ['brrrr', 'ltv'],
  },
  {
    id: 'brrrr',
    term: 'BRRRR method',
    definition:
      'Buy, rehab, rent, refinance, repeat: buying a property below its potential value, renovating it, renting it out, then doing a cash-out refinance based on the higher value to recover the cash you invested for the next deal.',
    tools: ['brrrr-calculator', 'rental-property-calculator'],
    see: ['arv', 'seasoning-period', 'cash-out-refinance'],
  },
  {
    id: 'cap-rate',
    term: 'Cap rate (capitalization rate)',
    definition:
      'A property’s net operating income divided by its price or value. It measures the return of the property itself, ignoring financing, which makes it useful for comparing properties and markets.',
    tools: ['rental-property-calculator'],
    guides: ['cap-rate-vs-cash-on-cash-return'],
    see: ['noi', 'cash-on-cash-return'],
  },
  {
    id: 'cash-on-cash-return',
    term: 'Cash-on-cash return',
    definition:
      'Annual pre-tax cash flow divided by the total cash you invested, such as the down payment, closing costs and repairs. Unlike the cap rate, it reflects how the property is financed.',
    tools: ['rental-property-calculator', 'brrrr-calculator'],
    guides: ['cap-rate-vs-cash-on-cash-return'],
    see: ['cap-rate'],
  },
  {
    id: 'cash-out-refinance',
    term: 'Cash-out refinance',
    definition:
      'Replacing your mortgage with a new, larger one and receiving the difference in cash. It resets the rate and term on your whole mortgage balance, which is why it is often compared with a HELOC.',
    tools: ['cash-out-refinance-vs-heloc-calculator', 'home-equity-calculator'],
    guides: ['heloc-vs-cash-out-refinance'],
    see: ['heloc', 'closing-costs'],
  },
  {
    id: 'closing-costs',
    term: 'Closing costs',
    definition:
      'Fees paid to finalize a mortgage or refinance, such as origination, appraisal, title and recording fees. They commonly total 2% to 5% of the loan amount.',
    tools: ['cash-out-refinance-vs-heloc-calculator', 'brrrr-calculator'],
    guides: ['heloc-vs-cash-out-refinance'],
  },
  {
    id: 'cltv',
    term: 'Combined loan-to-value (CLTV)',
    definition:
      'The total of all loans secured by a home — the first mortgage plus any home equity loan or HELOC — divided by the home’s value. Many lenders cap CLTV at 80% to 90% for home equity borrowing.',
    tools: ['home-equity-calculator', 'heloc-payment-calculator'],
    guides: ['heloc-requirements'],
    see: ['ltv', 'home-equity'],
  },
  {
    id: 'dscr',
    term: 'Debt service coverage ratio (DSCR)',
    definition:
      'For rental property loans, the property’s rental income divided by its monthly payment of principal, interest, taxes, insurance and any association dues. A DSCR of 1.0 means the rent exactly covers the payment; many lenders look for 1.0 to 1.25 or higher.',
    tools: ['dscr-loan-calculator'],
    guides: ['dscr-loans-explained', 'what-is-a-good-dscr'],
    see: ['pitia', 'noi'],
  },
  {
    id: 'draw-period',
    term: 'Draw period',
    definition:
      'The first phase of a HELOC, often 10 years, when you can borrow against your line. Many lenders allow interest-only payments during this time.',
    tools: ['heloc-payment-calculator'],
    guides: ['heloc-draw-period-ending'],
    see: ['heloc', 'repayment-period'],
  },
  {
    id: 'heloc',
    term: 'HELOC (home equity line of credit)',
    definition:
      'A revolving credit line secured by your home. You borrow as needed during the draw period, then repay principal and interest during the repayment period. Rates are usually variable: the prime rate plus a margin.',
    tools: ['heloc-payment-calculator', 'home-equity-calculator', 'cash-out-refinance-vs-heloc-calculator'],
    guides: ['heloc-vs-cash-out-refinance', 'heloc-draw-period-ending', 'heloc-requirements'],
    see: ['draw-period', 'repayment-period', 'prime-rate', 'cltv'],
  },
  {
    id: 'home-equity',
    term: 'Home equity',
    definition:
      'Your home’s market value minus everything you owe on loans secured by it. Lenders usually let you borrow only part of it, because they cap the combined loan-to-value ratio.',
    tools: ['home-equity-calculator'],
    guides: ['heloc-requirements'],
    see: ['cltv', 'heloc'],
  },
  {
    id: 'ltv',
    term: 'Loan-to-value ratio (LTV)',
    definition:
      'A loan’s balance divided by the value of the property securing it. A $240,000 mortgage on a $300,000 home has an 80% LTV.',
    tools: ['home-equity-calculator', 'cash-out-refinance-vs-heloc-calculator', 'brrrr-calculator', 'dscr-loan-calculator'],
    see: ['cltv'],
  },
  {
    id: 'noi',
    term: 'Net operating income (NOI)',
    definition:
      'A rental property’s income after operating expenses such as vacancy, property taxes, insurance, repairs and management, but before mortgage payments and income taxes.',
    tools: ['rental-property-calculator'],
    guides: ['cap-rate-vs-cash-on-cash-return', 'rental-property-expenses'],
    see: ['cap-rate'],
  },
  {
    id: 'pitia',
    term: 'PITIA',
    definition:
      'Principal, interest, taxes, insurance and association dues: the full monthly housing payment lenders use when calculating DSCR and debt-to-income ratios.',
    tools: ['dscr-loan-calculator', 'debt-to-income-ratio-calculator'],
    guides: ['dscr-loans-explained', 'what-is-a-good-dscr'],
    see: ['dscr', 'dti'],
  },
  {
    id: 'prime-rate',
    term: 'Prime rate',
    definition:
      'The benchmark rate banks use to set many variable rates, including most HELOCs and credit cards. It moves with the Federal Reserve’s target for the federal funds rate and typically sits 3 percentage points above the top of that range.',
    tools: ['heloc-payment-calculator'],
    guides: ['heloc-requirements'],
    see: ['heloc'],
  },
  {
    id: 'repayment-period',
    term: 'Repayment period',
    definition:
      'The phase of a HELOC after the draw period ends, often lasting up to 20 years, when you can no longer borrow and must repay principal plus interest. Payments can jump sharply when it begins.',
    tools: ['heloc-payment-calculator'],
    guides: ['heloc-draw-period-ending'],
    see: ['draw-period', 'heloc'],
  },
  {
    id: 'seasoning-period',
    term: 'Seasoning period',
    definition:
      'The time a lender requires between buying a property and refinancing it based on a new appraised value — commonly six months or more, depending on the lender and loan program. It shapes BRRRR timelines.',
    tools: ['brrrr-calculator'],
    see: ['brrrr', 'cash-out-refinance'],
  },

  {
    id: 'capex',
    term: 'Capital expenditures (CapEx)',
    definition:
      'Spending on big, infrequent replacements or improvements to a property, such as a roof, HVAC system, water heater or flooring. Rental investors set aside a monthly CapEx reserve so these costs don’t wipe out years of cash flow.',
    tools: ['rental-property-calculator', 'brrrr-calculator'],
    guides: ['rental-property-expenses'],
    see: ['noi'],
  },
  // Business financing
  {
    id: 'advance-rate',
    term: 'Advance rate',
    definition:
      'In invoice factoring, the share of an invoice’s value the factor pays you up front — commonly 70% to 95%. The rest, minus the factoring fee, is paid after your customer pays the invoice.',
    tools: ['invoice-factoring-calculator'],
    guides: ['invoice-factoring-vs-line-of-credit'],
    see: ['invoice-factoring'],
  },
  {
    id: 'bonus-depreciation',
    term: 'Bonus depreciation',
    definition:
      'A tax rule that lets a business deduct a large share of the cost of qualifying equipment in the first year instead of spreading it over several years. The 2025 tax law permanently restored 100% bonus depreciation for qualifying property acquired after January 19, 2025.',
    tools: ['equipment-loan-calculator'],
    guides: ['section-179-vs-bonus-depreciation', 'equipment-financing-vs-leasing'],
    see: ['section-179'],
  },
  {
    id: 'factor-rate',
    term: 'Factor rate',
    definition:
      'How merchant cash advances and some short-term business loans are priced: a multiplier, such as 1.3, applied to the amount advanced to get the total you repay. It is not an interest rate — because repayment is fast, the equivalent APR is usually far higher than the factor rate suggests.',
    tools: ['merchant-cash-advance-calculator'],
    guides: ['factor-rate-vs-apr', 'mca-stacking-and-consolidation'],
    see: ['mca', 'apr'],
  },
  {
    id: 'holdback',
    term: 'Holdback (retrieval rate)',
    definition:
      'The percentage of daily card sales or deposits a merchant cash advance provider collects until the advance is repaid. A higher holdback repays the advance faster, which raises its effective APR.',
    tools: ['merchant-cash-advance-calculator'],
    guides: ['factor-rate-vs-apr', 'mca-stacking-and-consolidation'],
    see: ['mca'],
  },
  {
    id: 'invoice-factoring',
    term: 'Invoice factoring',
    definition:
      'Selling your unpaid customer invoices to a factoring company for immediate cash. The factor advances most of the invoice value, collects from your customer, then pays you the rest minus its fee.',
    tools: ['invoice-factoring-calculator'],
    guides: ['invoice-factoring-vs-line-of-credit'],
    see: ['advance-rate', 'recourse-factoring'],
  },
  {
    id: 'mca',
    term: 'Merchant cash advance (MCA)',
    definition:
      'A lump sum paid to a business in exchange for a share of its future sales, repaid through daily or weekly withdrawals. MCAs are usually structured as purchases of future receivables rather than loans, so they are priced with a factor rate instead of an interest rate — though some states, including California and New York, now require providers to disclose an estimated APR.',
    tools: ['merchant-cash-advance-calculator'],
    guides: ['factor-rate-vs-apr', 'mca-stacking-and-consolidation'],
    see: ['factor-rate', 'holdback'],
  },
  {
    id: 'recourse-factoring',
    term: 'Recourse factoring',
    definition:
      'A factoring arrangement in which you must buy back or replace any invoice your customer fails to pay. Non-recourse factoring shifts some of that credit risk to the factor, usually for a higher fee.',
    tools: ['invoice-factoring-calculator'],
    guides: ['invoice-factoring-vs-line-of-credit'],
    see: ['invoice-factoring'],
  },
  {
    id: 'section-179',
    term: 'Section 179 deduction',
    definition:
      'A tax election that lets a business deduct the full cost of qualifying equipment and software in the year it is placed in service, rather than depreciating it over time. The 2025 tax law raised the annual limit to $2.5 million, phasing out once equipment purchases exceed $4 million.',
    tools: ['equipment-loan-calculator'],
    guides: ['section-179-vs-bonus-depreciation', 'equipment-financing-vs-leasing'],
    see: ['bonus-depreciation'],
  },

  {
    id: 'dollar-buyout-lease',
    term: 'Buyout lease ($1 buyout lease)',
    definition:
      'An equipment lease that transfers ownership to you for $1 at the end of the term. For tax purposes it is generally treated as a purchase, so you can depreciate the equipment or use the Section 179 deduction.',
    tools: ['equipment-loan-calculator'],
    guides: ['equipment-financing-vs-leasing'],
    see: ['fmv-lease', 'section-179'],
  },
  {
    id: 'fmv-lease',
    term: 'Fair market value (FMV) lease',
    definition:
      'An equipment lease with lower payments where, at the end, you return the equipment, renew the lease or buy the equipment at its fair market value. A true lease is generally deducted as rent rather than depreciated.',
    tools: ['equipment-loan-calculator'],
    guides: ['equipment-financing-vs-leasing'],
    see: ['dollar-buyout-lease', 'section-179'],
  },
  {
    id: 'stacking',
    term: 'Stacking (merchant cash advances)',
    definition:
      'Taking a second or third merchant cash advance while earlier ones are still being repaid. The daily or weekly debits add up quickly, and many MCA contracts prohibit it.',
    tools: ['merchant-cash-advance-calculator'],
    guides: ['mca-stacking-and-consolidation'],
    see: ['mca', 'factor-rate'],
  },
  // Taxes
  {
    id: 'agi',
    term: 'Adjusted gross income (AGI)',
    definition:
      'Your total income minus certain adjustments, such as deductible IRA and HSA contributions and student loan interest. It is the starting point for most income limits on your federal return.',
    tools: ['new-tax-deductions-calculator'],
    see: ['magi'],
  },
  {
    id: 'marginal-tax-rate',
    term: 'Marginal tax rate',
    definition:
      'The rate applied to your last dollar of taxable income — your tax bracket. A deduction saves money at your marginal rate, so the same deduction is worth more in a higher bracket.',
    tools: ['new-tax-deductions-calculator', 'no-tax-on-overtime-calculator', 'no-tax-on-tips-calculator'],
    see: ['deduction-vs-credit'],
  },
  {
    id: 'magi',
    term: 'Modified adjusted gross income (MAGI)',
    definition:
      'Adjusted gross income with certain amounts added back, and the definition depends on the program. For Marketplace subsidies it adds tax-exempt interest, untaxed Social Security benefits and excluded foreign income; for IRMAA, it is AGI plus tax-exempt interest; for the 2025–2028 tips, overtime, car loan interest and senior deductions, it is AGI plus excluded foreign income.',
    tools: ['aca-subsidy-calculator', 'irmaa-calculator', 'new-tax-deductions-calculator'],
    guides: ['aca-subsidy-cliff-2026', 'how-to-appeal-irmaa', 'schedule-1a-deductions-explained'],
    see: ['agi', 'phase-out'],
  },
  {
    id: 'phase-out',
    term: 'Phase-out',
    definition:
      'An income range over which a tax benefit shrinks. For example, the tips and overtime deductions fall by $100 for every $1,000 of MAGI above $150,000 ($300,000 for joint filers).',
    tools: ['no-tax-on-overtime-calculator', 'no-tax-on-tips-calculator', 'senior-deduction-calculator', 'car-loan-interest-deduction-calculator'],
    guides: ['schedule-1a-deductions-explained', 'how-to-calculate-qualified-overtime', 'no-tax-on-tips-eligible-jobs'],
    see: ['magi'],
  },
  {
    id: 'qualified-overtime',
    term: 'Qualified overtime compensation',
    definition:
      'For the overtime deduction, only the premium portion of overtime pay required by the Fair Labor Standards Act — the “half” in time-and-a-half for hours over 40 in a workweek. Regular pay for those hours, and overtime required only by state law or a contract, doesn’t count. The deduction is capped at $12,500 ($25,000 for joint filers).',
    tools: ['no-tax-on-overtime-calculator', 'new-tax-deductions-calculator'],
    guides: ['schedule-1a-deductions-explained', 'how-to-calculate-qualified-overtime'],
    see: ['phase-out'],
  },
  {
    id: 'qualified-tips',
    term: 'Qualified tips',
    definition:
      'For the tips deduction, voluntary cash or charged tips received in an occupation that customarily received tips on or before December 31, 2024, as listed by the Treasury. Mandatory service charges don’t qualify. The deduction is capped at $25,000.',
    tools: ['no-tax-on-tips-calculator', 'new-tax-deductions-calculator'],
    guides: ['schedule-1a-deductions-explained', 'no-tax-on-tips-eligible-jobs'],
    see: ['phase-out'],
  },
  {
    id: 'schedule-1-a',
    term: 'Schedule 1-A',
    definition:
      'The IRS form, new for 2025 returns, used to claim the four temporary deductions created by the 2025 tax law: qualified tips, qualified overtime, car loan interest and the senior deduction. You can claim them whether or not you itemize.',
    tools: ['new-tax-deductions-calculator', 'car-loan-interest-deduction-calculator'],
    guides: ['schedule-1a-deductions-explained', 'how-to-calculate-qualified-overtime', 'no-tax-on-tips-eligible-jobs'],
    see: ['qualified-tips', 'qualified-overtime', 'senior-deduction'],
  },
  {
    id: 'senior-deduction',
    term: 'Senior deduction',
    definition:
      'A temporary deduction of up to $6,000 for each taxpayer age 65 or older, for tax years 2025 through 2028. It is reduced by 6% of MAGI above $75,000 ($150,000 for joint filers) and comes on top of the regular extra standard deduction for people 65 and older.',
    tools: ['senior-deduction-calculator', 'new-tax-deductions-calculator'],
    guides: ['schedule-1a-deductions-explained'],
    see: ['standard-deduction', 'phase-out'],
  },
  {
    id: 'standard-deduction',
    term: 'Standard deduction',
    definition:
      'A flat amount that reduces your taxable income if you don’t itemize. For 2026 it is $16,100 for single filers and $32,200 for married couples filing jointly, plus an extra amount for each person who is 65 or older or blind.',
    tools: ['senior-deduction-calculator', 'new-tax-deductions-calculator'],
    see: ['senior-deduction'],
  },
  {
    id: 'deduction-vs-credit',
    term: 'Tax deduction vs. tax credit',
    definition:
      'A deduction lowers your taxable income, so it saves your marginal tax rate times the deduction. A credit reduces your tax bill dollar for dollar. In the 22% bracket, a $1,000 deduction saves $220, while a $1,000 credit saves $1,000.',
    tools: ['new-tax-deductions-calculator'],
    see: ['marginal-tax-rate'],
  },

  {
    id: 'regular-rate',
    term: 'Regular rate of pay',
    definition:
      'Under the Fair Labor Standards Act, the hourly rate used to calculate overtime. It generally includes hourly pay plus shift differentials, commissions and non-discretionary bonuses for the week, divided by the hours worked.',
    tools: ['no-tax-on-overtime-calculator'],
    guides: ['how-to-calculate-qualified-overtime'],
    see: ['qualified-overtime'],
  },
  // Health & benefits
  {
    id: 'applicable-percentage',
    term: 'Applicable percentage',
    definition:
      'The share of household income you are expected to pay toward the benchmark Marketplace plan before the premium tax credit covers the rest. It rises with your income as a percentage of the federal poverty line.',
    tools: ['aca-subsidy-calculator'],
    guides: ['aca-subsidy-cliff-2026'],
    see: ['premium-tax-credit', 'benchmark-plan'],
  },
  {
    id: 'benchmark-plan',
    term: 'Benchmark plan (SLCSP)',
    definition:
      'The second-lowest-cost silver plan available to you on the Marketplace. Your premium tax credit equals the benchmark premium minus your expected contribution, and you can apply it to other Marketplace plans except catastrophic plans.',
    tools: ['aca-subsidy-calculator'],
    guides: ['aca-subsidy-cliff-2026'],
    see: ['premium-tax-credit', 'applicable-percentage'],
  },
  {
    id: 'fpl',
    term: 'Federal poverty level (FPL)',
    definition:
      'The poverty guidelines HHS publishes each year by household size. Marketplace subsidies use the prior year’s guidelines: 2026 coverage uses the 2025 figures, which start at $15,650 for one person in the 48 contiguous states.',
    tools: ['aca-subsidy-calculator'],
    guides: ['aca-subsidy-cliff-2026'],
    see: ['subsidy-cliff'],
  },
  {
    id: 'premium-tax-credit',
    term: 'Premium tax credit',
    definition:
      'The federal subsidy that lowers Marketplace health insurance premiums. For 2026 it is generally available with household income from 100% to 400% of the federal poverty line. It can be paid in advance to your insurer and is reconciled on your tax return.',
    tools: ['aca-subsidy-calculator'],
    guides: ['aca-subsidy-cliff-2026'],
    see: ['benchmark-plan', 'subsidy-cliff', 'magi'],
  },
  {
    id: 'subsidy-cliff',
    term: 'Subsidy cliff',
    definition:
      'The income point — 400% of the federal poverty line — above which Marketplace premium tax credits generally stop entirely. It returned for 2026 after the enhanced credits of 2021–2025 expired, so earning slightly more can cost thousands of dollars in lost help.',
    tools: ['aca-subsidy-calculator'],
    guides: ['aca-subsidy-cliff-2026'],
    see: ['premium-tax-credit', 'fpl'],
  },
  {
    id: 'irmaa',
    term: 'IRMAA',
    definition:
      'The income-related monthly adjustment amount: an extra charge on Medicare Part B and Part D premiums for people with higher incomes. It is based on your MAGI from two years earlier, so 2026 premiums use your 2024 tax return. For 2026 it applies above $109,000 of MAGI for single filers and $218,000 for joint filers.',
    tools: ['irmaa-calculator'],
    guides: ['how-to-appeal-irmaa'],
    see: ['life-changing-event', 'magi'],
  },
  {
    id: 'life-changing-event',
    term: 'Life-changing event',
    definition:
      'An event such as retirement or reduced work hours, marriage, divorce or a spouse’s death that lets you ask Social Security to recalculate IRMAA using more recent income, by filing Form SSA-44.',
    tools: ['irmaa-calculator'],
    guides: ['how-to-appeal-irmaa'],
    see: ['irmaa'],
  },
  {
    id: 'ssdi',
    term: 'SSDI (Social Security Disability Insurance)',
    definition:
      'A federal benefit for people who can’t work because of a medical condition expected to last at least 12 months or to result in death, and who have worked long enough under Social Security. Benefits are based on your earnings record, not on financial need.',
    tools: ['ssdi-back-pay-calculator'],
    guides: ['after-ssdi-approval'],
    see: ['back-pay', 'pia'],
  },
  {
    id: 'back-pay',
    term: 'Back pay (past-due benefits)',
    definition:
      'SSDI benefits owed for the months between when your benefits should have started and when your claim was approved. They are usually paid as a lump sum, minus any representative fee.',
    tools: ['ssdi-back-pay-calculator'],
    guides: ['after-ssdi-approval'],
    see: ['onset-date', 'retroactive-benefits', 'representative-fee'],
  },
  {
    id: 'onset-date',
    term: 'Established onset date (EOD)',
    definition:
      'The date Social Security determines your disability began. It sets when your five-month waiting period starts, and so how much SSDI back pay you are owed.',
    tools: ['ssdi-back-pay-calculator'],
    guides: ['after-ssdi-approval'],
    see: ['waiting-period', 'back-pay'],
  },
  {
    id: 'waiting-period',
    term: 'Five-month waiting period',
    definition:
      'SSDI benefits generally begin with the sixth full month after your established onset date; nothing is paid for the first five full months. People with ALS are exempt.',
    tools: ['ssdi-back-pay-calculator'],
    guides: ['after-ssdi-approval'],
    see: ['onset-date'],
  },
  {
    id: 'medicare-waiting-period',
    term: 'Medicare waiting period',
    definition:
      'Most people approved for SSDI become eligible for Medicare after 24 months of disability benefits, counted from the month benefits begin rather than the approval date. People with ALS get Medicare as soon as their benefits start.',
    tools: ['ssdi-back-pay-calculator'],
    guides: ['after-ssdi-approval'],
    see: ['ssdi'],
  },
  {
    id: 'pia',
    term: 'Primary insurance amount (PIA)',
    definition:
      'Your full monthly Social Security benefit, calculated from your lifetime earnings. Your SSDI benefit generally equals your PIA.',
    tools: ['ssdi-back-pay-calculator'],
    see: ['ssdi'],
  },
  {
    id: 'representative-fee',
    term: 'Representative fee',
    definition:
      'What an attorney or other representative is paid for winning a disability claim. Under a standard fee agreement it is 25% of past-due benefits, capped at $9,200, and Social Security pays it directly out of your back pay.',
    tools: ['ssdi-back-pay-calculator'],
    guides: ['after-ssdi-approval'],
    see: ['back-pay'],
  },
  {
    id: 'retroactive-benefits',
    term: 'Retroactive benefits',
    definition:
      'SSDI benefits paid for months before you applied. Social Security can pay up to 12 months of retroactive benefits if you were already disabled, and past the waiting period, during that time.',
    tools: ['ssdi-back-pay-calculator'],
    guides: ['after-ssdi-approval'],
    see: ['back-pay', 'waiting-period'],
  },
];

/** Terms sorted A–Z, ignoring case and leading punctuation. */
export const glossarySorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));

export const termById = (id: string) => glossary.find((t) => t.id === id);

/** Glossary terms relevant to a calculator, A–Z. */
export const termsForTool = (slug: string) => glossarySorted.filter((t) => t.tools?.includes(slug));

/** Glossary terms a guide explains, A–Z. */
export const termsForGuide = (slug: string) => glossarySorted.filter((t) => t.guides?.includes(slug));
