# SpiritHub v2 reusable-advantages audit

**Research date:** 2026-07-26

**Scope:** first-party repository, Search Console exports, Vercel Analytics exports, and production
surfaces

**Question:** which existing SpiritHub assets create a credible head start for v2, and which are
legacy implementation or positioning choices that should not constrain it?

## Executive decision

SpiritHub has **one proven acquisition advantage, three reusable capability advantages, and no
proven retention or sharing moat yet**.

The strongest advantage is Romanian organic discovery around deterministic, birth-date-led
utilities—especially biorhythm. The latest supplied Search Console export recorded 706 impressions
and 19 clicks in one week, with Romania accounting for 674 impressions and 17 clicks; `/bioritm`
alone received 450 impressions. The corresponding Vercel export also placed `/bioritm` first among
non-homepage routes at 15 visitors and 26 events
([Search Console workbook](../inbox/2026-07-20-search-console-performance.xlsx),
[Vercel pages export](../inbox/2026-07-20-vercel-analytics-top-pages.csv)).

The reusable capability advantages are:

1. a working family of Romanian calculators and daily tools;
2. structured interpretation/configuration data that can feed richer personalized outputs;
3. separated deterministic domain logic and reusable result/OG composition seams.

Sharing, daily return, brand trust, and guide-to-tool navigation are **implemented surfaces**, not
validated advantages. They deserve reuse as inexpensive test infrastructure, but v2 should not
assume that they already cause retention, referrals, or willingness to pay.

## Evidence-ranked asset map

| Rank | Asset | First-party evidence | What v2 should reuse | Confidence |
|---|---|---|---|---|
| 1 | Romanian biorhythm search foothold | `/bioritm` led the 2026-07-20 Search Console workbook with 450 impressions; the leading queries were `calcul bioritm` and `bioritm calcul`. It also led non-homepage Vercel routes in the matching export ([Search Console](../inbox/2026-07-20-search-console-performance.xlsx), [Vercel](../inbox/2026-07-20-vercel-analytics-top-pages.csv)). | Preserve the indexed route and query ownership; use it as distribution into adjacent identity/current-cycle tests. | **High for discovery; low for payment or retention** |
| 2 | Deterministic calculator portfolio | The app exposes biorhythm, life-path, destiny-name, compatibility, daily-number, daily-energy, and critical-day experiences ([biorhythm route](../../app/bioritm/page.tsx), [numerology routes](../../app/numerologie/page.tsx), [daily message route](../../app/mesaj-zilnic/page.tsx)). | Reuse calculation logic, familiar inputs, and free-result entry points rather than rebuilding commodity calculators. | **High for capability; medium for demand outside biorhythm** |
| 3 | Structured interpretation corpus | Interpretation copy is stored by outcome/domain in JSON, while calculation mappings and thresholds live in config ([interpretation datasets](../../data/interpretations), [numerology config](../../config/numerology.ts), [biorhythm config](../../config/biorhythm.ts)). | Treat the corpus as modular source material for previews, reports, and experiments; keep derivation deterministic and copy reviewable. | **High for reuse; unproven as paid value** |
| 4 | Domain and presentation seams | Pure report/result/calendar/content modules separate derivation from route UI, and shared result/OG adapters reduce duplication ([biorhythm report](../../lib/biorhythm-report.ts), [numerology results](../../lib/numerology-results.ts), [daily content](../../lib/daily-content.ts), [OG composition](../../lib/og-composition.ts), [architecture tests](../../tests/architecture-seams.test.ts)). | Reuse these as the stable core beneath v2 experiments; add offers and delivery around them without coupling product decisions to today’s pages. | **High** |
| 5 | Guide inventory and internal-link surface | Guides are data-driven and rendered through one dynamic route plus an index ([guide data](../../data/guides.ts), [guide route](../../app/ghiduri/[slug]/page.tsx), [guide index](../../app/ghiduri/page.tsx)). | Reuse the publishing pipeline and reciprocal tool/guide links for inbound experiments. | **Medium as infrastructure; low as established traffic** |
| 6 | Shareable result infrastructure | Result screens use a shared share control and dedicated OG routes for multiple numerology and daily-result types ([share button](../../components/shared/share-button.tsx), [OG routes](../../app/api/og), [prefetch hook](../../hooks/use-prefetch-share-image.ts)). | Reuse it to instrument referral experiments. Do not treat it as a growth loop until share actions and referred visits are measured. | **High for implementation; none yet for behavior** |
| 7 | Daily-return surfaces | Daily number, daily energy, daily message, Bucharest calendar handling, and a shared daily provider already exist ([daily-number route](../../app/numerologie/numar-zilnic/page.tsx), [daily-energy route](../../app/bioritm/energia-zilei/page.tsx), [daily provider](../../components/providers/daily-content-provider.tsx), [calendar seam](../../lib/bucharest-calendar.ts)). | Reuse as a low-cost retention test bed with explicit revisit measurement. | **Medium for capability; unproven for return rate** |

## What is defensible and reusable

### 1. Query ownership plus an indexed route is the clearest head start

The durable asset is not “biorhythm” as a product commitment. It is the combination of a Romanian
route already understood by Google, query-language knowledge, and an experience that answers the
query without an account. Earlier first-party data showed the same pattern over a longer window:
`bioritm calcul`, `calcul bioritm`, `bioritm online`, and `calculator bioritm` generated the largest
query-level opportunity, while `/bioritm` was the strongest non-homepage utility in Vercel
Analytics
([Search Console review](../search-console-review-2026-06-11.md),
[Vercel review](../vercel-analytics-review-2026-06-11.md)).

V2 should preserve the URL and search intent even if the commercial offer changes. It should not
infer that users will pay for biorhythm: the exports prove discovery and visits, not conversion,
repeat use, or purchase intent.

### 2. The valuable product substrate is structured, deterministic personalization

SpiritHub can derive results immediately from dates and names without accounts, moderation, or a
human practitioner. Its calculation and interpretation layers are already separated
([numerology logic](../../lib/numerology.ts), [biorhythm logic](../../lib/biorhythm.ts),
[interpretation loader](../../lib/interpretations.ts)). That makes the existing system a useful
substrate for the leading `identity + current cycle` hypothesis: v2 can compose richer outputs from
known primitives before investing in a new engine.

The defensible part is operational: Romanian-native structured copy, deterministic delivery, and
the ability to update interpretation content independently. The formulas themselves are commodity
knowledge and should not be presented as proprietary.

### 3. The codebase has seams that support cheap offer experiments

The architecture already isolates biorhythm reports, numerology results, daily content/date
handling, and OG composition behind reusable modules, with public-interface tests protecting those
boundaries ([architecture tests](../../tests/architecture-seams.test.ts)). This reduces the cost of
building previews, report sections, landing-page variants, or manual-concierge fulfillment without
rewriting calculator math.

That technical option value is reusable. The present page hierarchy, component styling, and exact
result-card composition are not.

### 4. Trust language provides a baseline, not authority

SpiritHub has visible about, privacy, and terms pages plus legal navigation
([about](../../app/despre/page.tsx), [privacy](../../app/confidentialitate/page.tsx),
[terms](../../app/termeni/page.tsx), [legal footer](../../components/layout/legal-footer.tsx)).
This is a useful launch baseline for transparent symbolic products. It is not evidence that users
trust the brand, recognize it, or accept its claims. V2 should preserve plain Romanian explanations,
method transparency, privacy clarity, and non-scientific/symbolic boundaries, while testing whether
those signals change behavior.

## Implemented but unproven loops

### Sharing

Multiple result types can create share images and invoke a common share action. No supplied export
contains a share event, share completion, referred session, or conversion attributed to sharing.
Therefore the correct asset claim is **share-test readiness**, not virality or word of mouth.

### Return use

The daily routes and date-aware content create a natural reason to revisit. Page-level Vercel data
shows that daily tools receive some visits, but it does not distinguish new from returning users or
prove a repeat cadence
([2026-06-11 Vercel review](../vercel-analytics-review-2026-06-11.md),
[latest Vercel export](../inbox/2026-07-20-vercel-analytics-top-pages.csv)). The reusable asset is
the daily content engine; retention remains a hypothesis requiring event or cohort measurement.

### Guides and internal links

The guide pipeline can cheaply publish Romanian intent pages and route readers to calculators.
First-party analytics describes guide traffic as too small to judge
([2026-06-11 Vercel review](../vercel-analytics-review-2026-06-11.md)). Keep the pipeline; do not
count the current guide inventory as established authority.

## Legacy assets that should not constrain v2

- **The broad “spiritual hub” taxonomy.** Search evidence is concentrated in a few concrete
  utility intents. V2 may remain a focused product or a small family of related tools; it does not
  need to preserve equal prominence for every existing category.
- **Today’s homepage and navigation hierarchy.** The homepage is a router, not a validated product
  proposition. Preserve indexed destination URLs where valuable, but let the leading tested offer
  determine future information architecture.
- **The mystical visual treatment and generic inspirational framing.** These are presentation
  choices, not measured advantages. Retain calmness and Romanian fluency; allow v2 to become more
  specific, outcome-led, and evidence-transparent.
- **Every existing interpretation as canonical copy.** The datasets are reusable raw material, but
  paid or high-stakes outputs need editorial consolidation, duplication checks, and clearer
  reflective prompts.
- **Biorhythm as the paid product.** It is the best acquisition foothold and may be a component or
  channel. First-party evidence does not show willingness to pay for it.
- **Existing share and daily widgets as proven growth loops.** Instrument them before assigning
  forecasts or strategic dependence.
- **AdSense, account, newsletter, or payment assumptions.** None of these is a reusable advantage
  today, and the current operating model explicitly prioritizes value before friction
  ([operator manual](../operator-manual.md)).

## V2 carry-forward boundary

Carry forward:

- the `/bioritm` indexed route and its Romanian query ownership;
- deterministic date/name calculations and structured interpretations;
- domain seams, result composition, guide publishing, and OG/share infrastructure;
- Romanian-native, transparent, privacy-conscious trust language;
- no-account, immediate free value as the acquisition pattern.

Treat as experiments:

- identity/current-cycle synthesis as a richer product;
- guide-to-calculator conversion;
- sharing and referred acquisition;
- daily revisit behavior;
- trust-message impact and willingness to pay.

Leave behind unless testing revalidates them:

- the broad portal framing, equal category hierarchy, mystical styling, generic copy, and any
  assumption that traffic to a free calculator implies a paid market.

## Decision

SpiritHub v2 should be built **from the existing acquisition and personalization substrate, not as a
redesign of the current portal**. Its strongest right to win is a Romanian, deterministic,
no-account experience reached through an already ranking biorhythm route, then extended into a
coherent identity/current-cycle outcome. Preserve routes, logic, datasets, and technical seams;
retest proposition, visual identity, information architecture, return behavior, sharing, and paid
value from first principles.
