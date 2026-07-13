# Biorhythm Topic Authority Design

## Decision

Strengthen the existing biorhythm guide cluster without changing `/bioritm` metadata or calculator
behavior. The fresh 2026-07-05 through 2026-07-11 Search Console evidence shows that `/bioritm`
still ranks around positions 6–9 for high-volume calculator queries, but its weekly CTR fell from
1.85% to 0.92% and its average position fell from 7.60 to 8.55.

## Considered Approaches

1. Rewrite the calculator title and description again. This could affect CTR quickly, but the current
   title already matches exact calculator intent and no fresh owner SERP screenshot is available to
   show what result treatment would differentiate it.
2. Strengthen biorhythm topic authority through a clearer methodology guide and reciprocal internal
   links. This reuses the lower-risk pattern that coincided with improved compatibility performance
   and addresses the current ranking decline. This is the selected approach.
3. Build a biorhythm compatibility calculator. The query cluster exists, but it is much smaller than
   the core calculator cluster and would add disproportionate product scope.

## Content and Linking Design

- Expand `Ce este bioritmul?` with the actual cycle formula, an understandable worked explanation,
  and a short calculator workflow.
- Preserve explicit non-scientific and non-medical boundaries.
- Add reciprocal contextual links among the biorhythm methodology guide, critical-days guide,
  daily-energy guide, and main calculator.
- Keep `/bioritm` metadata, H1, primary copy, and calculator behavior unchanged.

## Verification

- Typecheck, lint, and build with Bun.
- Confirm the generated guide pages include the new methodology copy and intended links.
- Review the diff for natural Romanian copy, accurate formulas, and no unrelated edits.
