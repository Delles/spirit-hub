# Vercel Analytics Review - 2026-06-11

Source: user-exported Vercel Web Analytics CSV files.
Primary date range: 2026-05-12 17:00 to 2026-06-11 17:59.
Earlier 7-day exports for 2026-06-04 17:00 to 2026-06-11 17:59 are also preserved in
`docs/inbox/`, but this review uses the 30-day window because it is more stable.

Raw inputs saved in `docs/inbox/`:

- `2026-06-11-vercel-analytics-top-pages.csv`
- `2026-06-11-vercel-analytics-top-referrers.csv`
- `2026-06-11-vercel-analytics-top-operating-systems.csv`
- `2026-06-11-vercel-analytics-top-devices.csv`
- `2026-06-11-vercel-analytics-top-countries.csv`
- `2026-06-11-vercel-analytics-30d-top-pages.csv`
- `2026-06-11-vercel-analytics-30d-top-referrers.csv`
- `2026-06-11-vercel-analytics-30d-top-operating-systems.csv`
- `2026-06-11-vercel-analytics-30d-top-devices.csv`
- `2026-06-11-vercel-analytics-30d-top-countries.csv`

---

## Executive Read

This is still early data, but the 30-day window is useful enough for owner decisions. Vercel reports
85 visitors and 345 total page views/events across device, country, and operating system panels.

The site is getting real usage beyond owner checks, especially from Romania and Google. The sample is
still small enough that owner/development traffic may distort device and OS splits, but the content
and acquisition signals are now clearer.

The strongest product signal remains utility pages. `/bioritm` is the top non-homepage route, while
daily/numerology tools also show meaningful use. This supports the current strategy: keep improving
calculator entry pages and do not build paid features yet.

---

## Top Pages

| Page | Visitors | Total views |
| --- | ---: | ---: |
| `/` | 52 | 111 |
| `/bioritm` | 31 | 41 |
| `/numerologie/numar-zilnic` | 19 | 30 |
| `/bioritm/energia-zilei` | 18 | 24 |
| `/mesaj-zilnic` | 17 | 24 |
| `/numerologie` | 17 | 36 |
| `/numerologie/calea-vietii` | 17 | 26 |
| `/numerologie/compatibilitate` | 13 | 20 |
| `/numerologie/nume-destin` | 12 | 18 |
| `/bioritm/critice` | 6 | 8 |
| `/ghiduri` | 3 | 3 |
| `/bioritm/zile-critice` | 1 | 1 |
| `/ghiduri/ce-este-calea-vietii-in-numerologie` | 1 | 2 |
| `/ghiduri/energia-zilei-cum-sa-o-folosesti` | 1 | 1 |

Interpretation:

- The homepage is doing its job as the main entry/router.
- `/bioritm` is the strongest non-homepage page, matching Search Console's biorhythm signal.
- Daily tools matter: `/numerologie/numar-zilnic`, `/bioritm/energia-zilei`, and `/mesaj-zilnic`
  all appear in the top five non-homepage experiences.
- Numerology calculators are getting usage, but no single numerology route yet beats `/bioritm`.
- Guide pages are present in analytics, but still too new or too low-volume to judge.

---

## Acquisition

| Referrer | Visitors | Total |
| --- | ---: | ---: |
| `google.com` | 34 | 35 |
| `google.ro` | 2 | 2 |
| `vercel.com` | 2 | 2 |
| `baidu.ro` | 1 | 1 |
| `bing.ro` | 1 | 1 |
| `chatgpt.com` | 1 | 2 |

Interpretation:

- Google is already a meaningful source in this window, with 36 visitors across `google.com` and
  `google.ro`.
- Vercel's referrer export explains 41 referred visitors, so direct, unknown, or unlisted traffic is
  not fully explained by this CSV.

---

## Audience And Devices

Countries:

| Country | Visitors | Total |
| --- | ---: | ---: |
| RO | 71 | 279 |
| US | 9 | 58 |
| MD | 2 | 5 |
| DK | 1 | 1 |
| IN | 1 | 1 |
| VN | 1 | 1 |

Devices:

| Device | Visitors | Total |
| --- | ---: | ---: |
| desktop | 55 | 231 |
| mobile | 30 | 114 |

Operating systems:

| OS | Visitors | Total |
| --- | ---: | ---: |
| Windows | 42 | 211 |
| Android | 27 | 107 |
| GNU/Linux | 7 | 11 |
| Mac | 5 | 8 |
| iOS | 3 | 7 |
| Debian | 1 | 1 |

Interpretation:

- Romania is the clear primary market, consistent with Search Console.
- The desktop/Windows skew conflicts with Search Console's mobile-heavy search data and may include
  owner/development traffic, so do not make design decisions from this Vercel device split alone.
- Keep mobile-first as the product rule because search acquisition is mobile-heavy and future organic
  growth is likely to stay mobile-heavy.

---

## Owner Decisions

1. Keep the current business priority: traffic, trust, and monetization eligibility before product
   complexity.
2. Do not assign a new dev task from Vercel Analytics alone; combine it with the next Search Console
   export.
3. Wait for the next Search Console export between 2026-06-18 and 2026-06-25 before choosing the next
   SEO/content task.
4. When Vercel Analytics is exported again, prefer CSV panel exports over screenshots.
5. If traffic grows, add analytics event tracking for important calculator actions so Vercel can show
   tool usage, not just page visits.
6. Treat daily-return pages as a real retention surface, not only SEO support content.

---

## Candidate Future Event Tracking

Consider tracking these only after the next Search Console review or once traffic grows enough to
make event data meaningful:

- calculator result generated,
- share button clicked,
- guide CTA clicked into a calculator,
- daily tool revisited,
- ad slot rendered after AdSense approval.
