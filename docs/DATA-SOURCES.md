# Official figures used by the calculators

Every rule-based number in the calculators is listed here with the source to check it against.

> **Important:** the build environment could not reach government websites (irs.gov, cms.gov, ssa.gov, hhs.gov, hud.gov were blocked). The figures below were entered from the official publications as known in September 2026, and cross-checked for internal consistency where possible. For example, IRMAA Part B amounts must equal the standard premium × 1.4 / 2.0 / 2.6 / 3.2 / 3.4, and a unit test enforces this. **Please open each source link and confirm the numbers before launch.** Also confirm that every source link on the pages resolves.

## Federal income tax (`src/lib/calc/tax.ts`)

| Figure | 2025 | 2026 | Source |
|---|---|---|---|
| Brackets (single) 10/12/22/24/32/35% tops | 11,925 · 48,475 · 103,350 · 197,300 · 250,525 · 626,350 | 12,400 · 50,400 · 105,700 · 201,775 · 256,225 · 640,600 | Rev. Proc. 2024-40 (2025); Rev. Proc. 2025-32 (2026) |
| Brackets (married filing jointly) | 23,850 · 96,950 · 206,700 · 394,600 · 501,050 · 751,600 | 24,800 · 100,800 · 211,400 · 403,550 · 512,450 · 768,700 | same |
| Brackets (head of household) | 17,000 · 64,850 · 103,350 · 197,300 · 250,500 · 626,350 | 17,700 · 67,450 · 105,700 · 201,750 · 256,200 · 640,600 | same |
| Brackets (married filing separately) | as single, 35% top 375,800 | as single, 35% top 384,350 | same |
| Standard deduction S / MFJ / HoH | 15,750 / 31,500 / 23,625 | 16,100 / 32,200 / 24,150 | OBBBA (2025); Rev. Proc. 2025-32 (2026) |
| Additional std. deduction 65+ (married / unmarried) | 1,600 / 2,000 | 1,650 / 2,050 | same |

## One Big Beautiful Bill Act deductions (Public Law 119-21), tax years 2025–2028

| Deduction | Cap | Phase-out | Notes |
|---|---|---|---|
| Qualified tips | $25,000 per return | −$100 per $1,000 MAGI over $150k ($300k joint) | MFS not eligible; occupation must be on Treasury's list |
| Qualified overtime | $12,500 ($25,000 joint) | −$100 per $1,000 over $150k ($300k joint) | Only the FLSA-required premium (the 0.5×) counts; MFS not eligible |
| Car loan interest | $10,000 per return | −$200 per $1,000 **or fraction** over $100k ($200k joint) | New vehicle, final assembly in US, loan after 12/31/2024, personal use, secured, VIN reported |
| Senior deduction | $6,000 per person 65+ | −6% of MAGI over $75k ($150k joint) | MFS not eligible |

Rounding assumption to verify on Schedule 1-A's instructions: the tips and overtime reductions count only whole $1,000 steps (`floor`), and the car loan reduction counts any part of $1,000 as a step (`ceil`).

Sources:
- https://www.irs.gov/newsroom/one-big-beautiful-bill-provisions
- https://www.congress.gov/bill/119th-congress/house-bill/1
- Schedule 1-A instructions on https://www.irs.gov/forms-instructions

## ACA premium tax credit (`src/lib/calc/benefits.ts`)

| Figure | Value | Source |
|---|---|---|
| 2025 poverty guidelines (for 2026 coverage), 48 states + DC | $15,650 + $5,500 per extra person | HHS/ASPE |
| Alaska / Hawaii | $19,550 + $6,880 / $17,990 + $6,330 | HHS/ASPE |
| 2026 applicable percentages | <133%: 2.10 · 133–150: 3.14–4.19 · 150–200: 4.19–6.60 · 200–250: 6.60–8.44 · 250–300: 8.44–9.96 · 300–400: 9.96 | Rev. Proc. 2025-25 |
| Enhanced 2021–2025 schedule (comparison only) | 0 / 0–2 / 2–4 / 4–6 / 6–8.5 / 8.5 above 400% | ARPA/IRA |
| Status of enhanced credits | Expired 12/31/2025 (400% cliff returns for 2026) | **Re-check**: if Congress restores them, update the page copy and default |

Sources:
- https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines
- https://www.irs.gov/pub/irs-drop/rp-25-25.pdf

## Medicare IRMAA (`src/lib/calc/benefits.ts`)

| Year | Standard Part B | Part B tiers | Part D add-ons | Individual thresholds | Joint thresholds |
|---|---|---|---|---|---|
| 2026 | $202.90 (deductible $283) | 284.10 · 405.80 · 527.50 · 649.20 · 689.90 | 14.50 · 37.50 · 60.40 · 83.30 · 91.00 | 109k · 137k · 171k · 205k · 500k | 218k · 274k · 342k · 410k · 750k |
| 2025 | $185.00 (deductible $257) | 259.00 · 370.00 · 480.90 · 591.90 · 628.90 | 13.70 · 35.30 · 57.00 · 78.60 · 85.80 | 106k · 133k · 167k · 200k · 500k | 212k · 266k · 334k · 400k · 750k |

Married filing separately (lived with spouse): 2026 upper cut-off $391,000; 2025 $394,000.

Sources:
- https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-and-deductibles
- https://www.ssa.gov/benefits/medicare/medicare-premiums.html

## SSDI (`src/lib/calc/benefits.ts` and the SSDI page)

| Figure | Value | Source |
|---|---|---|
| Waiting period | 5 full calendar months (none for ALS) | SSA |
| Retroactivity | Up to 12 months before the application month | SSA |
| Fee agreement cap | $9,200 (effective Nov 30, 2024) | https://www.ssa.gov/representation/fee_agreements.htm |
| 2026 COLA | 2.8% | https://www.ssa.gov/cola/ |
| 2026 SGA | $1,690/month ($2,830 blind) | https://www.ssa.gov/cola/ |

## Business and lending (page copy)

- Section 179 limit: $2.5M, with the phase-out starting at $4M (2025, indexed after), and permanent 100% bonus depreciation for property acquired after Jan 19, 2025 (OBBBA). Source: IRS Publication 946.
- DTI program limits: Fannie Mae B3-6-02 (36%/45% manual, 50% DU), FHA 31/43, VA 41% guideline, USDA 29/41.
- The HELOC/home equity CLTV ranges, factoring fees, MCA factor rates and DSCR requirements are described on the pages as typical industry ranges, not legal limits.

## Source links used on pages that may have moved

Confirm these load:
- `https://www.hud.gov/program_offices/housing/sfh/handbook_references` (DTI page)
- `https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/` (DTI page)
- `https://www.consumerfinance.gov/ask-cfpb/what-do-i-need-to-know-about-consolidating-my-credit-card-debt-en-1861/` (debt consolidation)
- `https://consumer.ftc.gov/articles/how-get-out-debt` (debt payoff, consolidation)
- `https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill` (tax pages)
- `https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-and-deductibles` (IRMAA)
- `https://www.hud.gov/counseling` (HELOC draw-period guide)
- `https://www.irs.gov/businesses/small-businesses-self-employed/tangible-property-final-regulations` (Section 179 guide)

You can list every external link with:

```bash
grep -rhoE "url: '[^']+'" src/pages | sort -u
```

## Additional facts stated in the guides (`src/content/guides/`)

- ACA: 400% FPL limits by household size (derived from the poverty guidelines above).
- ACA: repayment caps on excess advance premium tax credits no longer apply from tax year 2026 (OBBBA).
- ACA: bronze and catastrophic Marketplace plans are treated as HSA-eligible starting in 2026 (OBBBA).
- DTI guide, student loan payments used when no payment is reported: FHA 0.5% of balance, Freddie Mac 0.5%, Fannie Mae 1% (or a calculated payment); VA uses its own threshold. Check the current seller/servicer guides.
- IRMAA guide: SSA-44 life-changing events list; SSA-561 for reconsideration.
- Debt guide research citations: Gal & McShane (2012), *Journal of Marketing Research*; Trudel (2016), *Harvard Business Review*.
- Section 179 guide: 2025 limit $2.5M / phase-out $4M (indexed after 2025); 100% bonus for property acquired after Jan 19, 2025; the pre-OBBBA bonus rate for 2025 was 40%; the >50% business-use requirement; the $2,500 de minimis safe harbor.
- SSDI guide: Medicare after 24 months of entitlement; auxiliary benefits for children and spouses; 2026 SGA of $1,690 ($2,830 blind); fee cap $9,200.
- Real-estate pages: conventional investment cash-out LTV of 75% (1 unit) / 70% (2–4 units); seasoning periods commonly 6–12 months (lender-specific).
