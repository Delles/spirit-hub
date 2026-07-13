# Biorhythm Calculator Page Ownership Design

## Goal

Make `https://www.spirithub.ro/bioritm` the unambiguous search result for Romanian biorhythm
calculator queries while keeping SpiritHub.ro as the umbrella brand.

## Evidence

- The owner SERP screenshot for `calcul bioritm` shows the homepage near the bottom of the visible
  results instead of `/bioritm`.
- The screenshot for `bioritm calcul` shows `/bioritm` around sixth, but its current result does not
  expose the graph, seven-day outlook, or no-account flow that differentiate it.
- The latest Search Console period gave `/bioritm` 327 impressions, 3 clicks, 0.92% CTR, and average
  position 8.55. The two largest exact queries had 166 and 145 impressions with CTR below 0.7%.

## Considered Approaches

1. Change only the `/bioritm` title. This is fast but leaves the homepage and root fallback metadata
   competing for calculator intent.
2. Remove competing global/homepage calculator signals and strengthen `/bioritm` around exact intent
   plus real differentiators. This is the selected approach because it addresses both page selection
   and click appeal.
3. Redirect, canonicalize, or noindex the homepage. This is rejected because the homepage has valid
   numerology and brand intent and should remain independently indexable.

## Design

- Root fallback metadata will describe SpiritHub as a numerology and daily-guidance brand, not as a
  biorhythm calculator page.
- The homepage keeps normal tool navigation but loses the dedicated exact-match biorhythm SEO
  paragraph that can make the source page compete with its destination.
- `/bioritm` will lead with `Calcul Bioritm Personal`, then differentiate with the graph and seven-day
  outlook. The description will state the three cycles, free use, and no-account flow.
- Open Graph, Twitter, visible H1, and introduction will use the same proposition.
- Canonicals, calculator behavior, guide content, and other verticals remain unchanged.

## Verification and Measurement

- Run `bun run typecheck`, `bun run lint`, and `bun run build`.
- Inspect generated homepage and `/bioritm` HTML for distinct titles, descriptions, canonicals, and
  one visible H1 per page.
- Request indexing for both URLs after deployment.
- After 7-14 days, use a query-filtered Search Console Pages export for the core biorhythm terms.
  Success means `/bioritm` owns most impressions for both `calcul bioritm` and `bioritm calcul`.
