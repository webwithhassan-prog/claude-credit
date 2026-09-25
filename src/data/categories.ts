export interface Category {
  id: string;
  name: string;
  /** Short nav label. */
  nav: string;
  icon: string;
  description: string;
  /** Longer introduction (HTML) shown on the category hub page. */
  intro: string;
  /** "Choosing the right calculator" guidance (HTML) shown below the tool grid. */
  guide: string;
}

/** Order here = order on the home page and in navigation. */
export const categories: Category[] = [
  {
    id: 'debt-credit',
    name: 'Debt & Credit',
    nav: 'Debt & Credit',
    icon: 'credit-card',
    description:
      'Plan your way out of credit card and loan debt, compare avalanche and snowball strategies, and check the ratios lenders look at.',
    intro:
      '<p>Most household debt problems come down to two numbers: the interest rate you pay and the amount you put toward the balance each month. These calculators make both visible. See how long a credit card balance will really take to clear, build a payoff plan across every debt you owe, and test whether a 0% balance transfer or a consolidation loan actually saves money once fees are included.</p><p>Lenders also judge you by ratios. Your <strong>debt-to-income ratio</strong> drives mortgage and loan approvals, and your <strong>credit utilization</strong> is one of the largest inputs to FICO and VantageScore credit scores. Each tool explains the rules behind the math so you can act on the result, not just read it.</p>',
    guide:
      '<h2>Which debt calculator do you need?</h2><ul><li><strong>One credit card balance?</strong> Start with the <a href="/credit-card-payoff-calculator/">credit card payoff calculator</a> to see your debt-free date and the payment needed to hit a deadline.</li><li><strong>Several debts?</strong> The <a href="/debt-payoff-calculator/">debt payoff calculator</a> builds a month-by-month plan and compares the avalanche and snowball methods.</li><li><strong>Thinking about moving the debt?</strong> Compare a 0% card with the <a href="/balance-transfer-calculator/">balance transfer calculator</a>, or a fixed-rate loan with the <a href="/debt-consolidation-calculator/">debt consolidation calculator</a>. Homeowners can also price a <a href="/heloc-payment-calculator/">HELOC</a>.</li><li><strong>Applying for a mortgage or loan soon?</strong> Check the two ratios lenders look at: your <a href="/debt-to-income-ratio-calculator/">debt-to-income ratio</a> and your <a href="/credit-utilization-calculator/">credit utilization</a>.</li></ul><h2>Three rules that save the most money</h2><p><strong>Pay a fixed amount, not the minimum.</strong> Minimum payments shrink as your balance falls, which can stretch a card balance over decades. <strong>Attack one debt at a time</strong> while paying minimums on the rest, rolling each freed-up payment into the next target. <strong>Lower the rate where you can</strong> — a transfer, consolidation loan or simply asking your issuer can cut the interest you pay on every remaining dollar.</p>',
  },
  {
    id: 'home-equity',
    name: 'Home Equity & Real Estate',
    nav: 'Home Equity',
    icon: 'home',
    description:
      'Estimate HELOC payments, how much equity you can borrow, whether a cash-out refinance beats a HELOC, and DSCR loan qualification for rentals.',
    intro:
      '<p>Home equity is often the largest — and cheapest — source of credit a household has, but the right way to tap it depends on your existing mortgage rate, how much you need and how long you will carry the balance. These calculators estimate what a lender may let you borrow, what a HELOC will cost during and after the draw period, and whether replacing your first mortgage with a cash-out refinance makes sense compared with adding a HELOC.</p><p>For real-estate investors, the DSCR calculator shows the debt service coverage ratio that non-QM lenders use to qualify rental properties on the property’s income rather than your personal income.</p>',
    guide:
      '<h2>Which home equity calculator do you need?</h2><ul><li><strong>How much could I borrow?</strong> The <a href="/home-equity-calculator/">home equity calculator</a> applies lender CLTV limits of 75% to 90% to your home’s value and mortgage balance.</li><li><strong>What would the payments be?</strong> The <a href="/heloc-payment-calculator/">HELOC payment calculator</a> shows the interest-only draw payment and the jump when repayment starts, with a rate stress test.</li><li><strong>Should I refinance instead?</strong> The <a href="/cash-out-refinance-vs-heloc-calculator/">cash-out refinance vs HELOC calculator</a> compares total cost over your time horizon and finds the break-even year.</li><li><strong>Buying or refinancing a rental?</strong> The <a href="/dscr-loan-calculator/">DSCR loan calculator</a> shows whether the rent covers the payment the way investor lenders measure it.</li></ul><h2>The number that matters most: your current mortgage rate</h2><p>If your first mortgage has a low fixed rate, keeping it and borrowing only what you need with a HELOC or home equity loan is usually cheaper than refinancing everything at today’s rates. If your current rate is above the market, a cash-out refinance can lower the cost of the whole balance. Either way, remember that your home secures the debt — borrow for purposes that improve your finances, and budget for the repayment period, not just the draw period.</p>',
  },
  {
    id: 'business-financing',
    name: 'Business Financing',
    nav: 'Business',
    icon: 'briefcase',
    description:
      'See the true cost of merchant cash advances, invoice factoring and equipment loans — converted to APR so you can compare offers.',
    intro:
      '<p>Business financing is often quoted in ways that hide the true cost: factor rates, flat fees, holdbacks and “per 30 days” pricing. These calculators convert every offer into the same yardstick — an annual percentage rate (APR) — so you can compare a merchant cash advance, invoice factoring and a term or equipment loan side by side.</p><p>Each tool shows the cash you actually receive, the total you repay and the effective annual cost, along with the questions to ask before you sign.</p>',
    guide:
      '<h2>Which business financing calculator do you need?</h2><ul><li><strong>Comparing a merchant cash advance offer?</strong> The <a href="/merchant-cash-advance-calculator/">MCA calculator</a> converts the factor rate and fees into an APR and shows the daily or weekly payment.</li><li><strong>Waiting on customer invoices?</strong> The <a href="/invoice-factoring-calculator/">invoice factoring calculator</a> shows the advance, fees, rebate and effective annual cost.</li><li><strong>Buying equipment or vehicles?</strong> The <a href="/equipment-loan-calculator/">equipment loan calculator</a> estimates payments, APR and potential Section 179 tax savings.</li></ul><h2>Always compare on APR</h2><p>Business financing is priced in many ways — factor rates, per-30-day fees, holdbacks, points and interest rates. The only fair comparison is the annual percentage rate on the cash you actually receive, over the time you actually use it. A 1.3 factor rate repaid in six months, a 3% fee per 30 days and a 12% term loan can differ by a factor of ten in real cost. Before you sign, ask every provider for the total repayment amount, all fees and the expected term, then run the numbers here.</p>',
  },
  {
    id: 'taxes',
    name: 'Tax Deductions 2025–2026',
    nav: 'Taxes',
    icon: 'receipt',
    description:
      'Estimate the new federal deductions for tips, overtime, car loan interest and seniors created by the 2025 tax law, with your real tax savings.',
    intro:
      '<p>The One Big Beautiful Bill Act (Public Law 119-21), signed on July 4, 2025, created four new federal deductions for tax years 2025 through 2028: up to $25,000 for qualified tips, up to $12,500 ($25,000 for joint filers) for qualified overtime, up to $10,000 of interest on a loan for a new U.S.-assembled vehicle, and an extra $6,000 deduction for people 65 and older.</p><p>All four are available whether or not you itemize, and all four phase out at higher incomes. These calculators apply the caps and phase-outs and then run the numbers through the federal tax brackets, so you see the tax you actually save — not just the size of the deduction.</p>',
    guide:
      '<h2>Which tax calculator do you need?</h2><ul><li><strong>Several of the new deductions apply?</strong> Use the <a href="/new-tax-deductions-calculator/">Schedule 1-A calculator</a> to stack tips, overtime, car loan interest and the senior deduction in one place.</li><li><strong>Tipped worker?</strong> The <a href="/no-tax-on-tips-calculator/">no tax on tips calculator</a> applies the $25,000 cap and the phase-out.</li><li><strong>Paid overtime?</strong> The <a href="/no-tax-on-overtime-calculator/">no tax on overtime calculator</a> works out the qualified “half” of time-and-a-half.</li><li><strong>Bought a new U.S.-assembled car with a loan?</strong> The <a href="/car-loan-interest-deduction-calculator/">car loan interest deduction calculator</a> can even estimate the year’s interest from your loan terms.</li><li><strong>Age 65 or older?</strong> The <a href="/senior-deduction-calculator/">senior deduction calculator</a> applies the 6% income phase-out.</li></ul><h2>Deductions vs. tax savings</h2><p>A deduction lowers taxable income, so the tax you save is roughly the deduction times your marginal tax rate — not the full deduction. That is why each calculator runs your numbers through the actual federal brackets for 2025 or 2026. These new deductions also do not reduce AGI, so they will not change income-tested amounts such as ACA subsidies or Medicare IRMAA.</p>',
  },
  {
    id: 'health-benefits',
    name: 'Health & Benefits',
    nav: 'Benefits',
    icon: 'shield',
    description:
      'Estimate your 2026 ACA premium tax credit, Medicare IRMAA surcharges and Social Security disability (SSDI) back pay.',
    intro:
      '<p>Health insurance and benefit programs are full of income cliffs and waiting periods that are hard to see until they cost you money. For 2026, the enhanced ACA premium tax credits have expired, bringing back the 400% of poverty “subsidy cliff”. Medicare charges higher Part B and Part D premiums — IRMAA — once your income crosses set thresholds, even by a dollar. And Social Security disability back pay depends on a five-month waiting period and a 12-month retroactivity limit.</p><p>These calculators apply the official 2026 tables so you can plan income, appeal decisions and budget with real numbers.</p>',
    guide:
      '<h2>Which benefits calculator do you need?</h2><ul><li><strong>Buying Marketplace health insurance?</strong> The <a href="/aca-subsidy-calculator/">ACA subsidy calculator</a> estimates your 2026 premium tax credit and warns you if you are near the 400% cliff.</li><li><strong>On Medicare with higher income?</strong> The <a href="/irmaa-calculator/">IRMAA calculator</a> shows your Part B and Part D surcharges and how far you are from the next bracket.</li><li><strong>Waiting on a disability decision?</strong> The <a href="/ssdi-back-pay-calculator/">SSDI back pay calculator</a> applies the waiting period, the retroactive limit and the representative fee cap.</li></ul><h2>Watch for income cliffs</h2><p>Several programs switch benefits on or off at a single income threshold. For 2026, earning $1 over 400% of the poverty line ends ACA premium tax credits entirely, and crossing an IRMAA bracket by $1 raises Medicare premiums for the whole year. Small, legal changes — a pre-tax retirement contribution, an HSA deposit, or timing a Roth conversion — can keep you under a threshold. When a few hundred dollars of income could cost thousands, it is worth planning carefully and confirming with a professional.</p>',
  },
];

export const categoryById = (id: string) => {
  const c = categories.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown category: ${id}`);
  return c;
};
