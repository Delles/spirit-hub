# SpiritHub MVP Feature Implementation Plan

> **Goal:** Replace Dream Symbols with Oracle feature + integrate Moon Phase into Energia Zilei

---

## User Review Required

> [!IMPORTANT]
> This plan removes all dream-related functionality. The `/vise` routes and dream search will be deleted.

> [!NOTE]
> Oracle messages need to be written (100 total). AI assistance recommended for initial draft.

---

## Phase 1: Remove Dream Symbols

### [DELETE] Dream Data Files
- `data/dream-symbols.json` (57KB, ~80 symbols)
- `data/dreams-search-index.json` (search index)

### [DELETE] Dream Components
- `components/vise/` (entire directory)
- `components/landing/widgets/dream-widget.tsx`

### [DELETE] Dream Routes
- `app/vise/` (entire directory including `[slug]`, `visul-zilei`)

### [DELETE] Dream Utilities
- `lib/dream-data.ts`
- `scripts/generate-dream-index.ts`

### [MODIFY] [daily-content-provider.tsx](file:///d:/Projects/spirit-hub/components/providers/daily-content-provider.tsx)
- Remove `dailyDream` from context
- Remove dream selection logic

### [MODIFY] [daily-widgets-client.tsx](file:///d:/Projects/spirit-hub/components/landing/daily-widgets-client.tsx)
- Remove `DreamWidget` import and usage
- Prepare slot for `OracleWidget`

---

## Phase 2: Create Oracle Feature

### [NEW] Data Schema: `data/interpretations/oracle.json`

```json
{
  "messages": [
    {
      "id": 1,
      "slug": "rabdare",
      "title": "Răbdare",
      "category": "growth",
      "theme": {
        "primary": "from-amber-500 to-orange-600",
        "accent": "text-amber-400",
        "icon": "Hourglass"
      },
      "insight": "Universul îți cere astăzi să încetinești. Nu totul trebuie să se întâmple acum. **Cele mai frumoase roade** vin din semințele plantate cu grijă.",
      "action": "Amână o decizie importantă cu 24 de ore.",
      "mantra": "Ceea ce este pentru mine nu mă va ocoli."
    }
  ]
}
```

**Content Categories (100 messages):**
| Category | Count | Examples |
|----------|-------|----------|
| `love` | 20 | Deschiderea Inimii, Iertarea, Vulnerabilitate |
| `abundance` | 20 | Curajul de a Risca, Mulțumire, Primire |
| `growth` | 25 | Răbdare, Limite Sănătoase, Eliberare |
| `energy` | 15 | Odihnă, Echilibru, Grounding |
| `spirit` | 20 | Încredere în Univers, Intuiție, Semne |

---

### [NEW] [oracle.ts](file:///d:/Projects/spirit-hub/lib/oracle.ts)

```typescript
import oracleData from "@/data/interpretations/oracle.json";

export interface OracleMessage {
  id: number;
  slug: string;
  title: string;
  category: string;
  theme: {
    primary: string;
    accent: string;
    icon: string;
  };
  insight: string;
  action: string;
  mantra: string;
}

/**
 * Get today's oracle message (deterministic by date)
 */
export function getDailyOracle(date: Date = new Date()): OracleMessage {
  const messages = oracleData.messages as OracleMessage[];
  const dayOfYear = getDayOfYear(date);
  const year = date.getFullYear();
  // Deterministic seed ensures same message all day
  const seed = (dayOfYear * 31 + year) % messages.length;
  return messages[seed];
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
```

---

### [NEW] [oracle-widget.tsx](file:///d:/Projects/spirit-hub/components/landing/widgets/oracle-widget.tsx)

**Design Specs:**
- Glass card matching existing design system
- Dynamic gradient based on message theme
- Lucide icon from message data
- Title prominent, insight truncated
- "Descoperă mai mult" CTA → `/mesaj-zilnic`

---

### [NEW] [mesaj-zilnic/page.tsx](file:///d:/Projects/spirit-hub/app/mesaj-zilnic/page.tsx)

**Full page with:**
- Hero card with flip reveal animation (optional for MVP)
- Full insight text with markdown rendering
- Action card (green accent)
- Mantra card (shareable format)
- Share button for Instagram Stories

---

### [MODIFY] [daily-content-provider.tsx](file:///d:/Projects/spirit-hub/components/providers/daily-content-provider.tsx)
- Add `dailyOracle: OracleMessage` to context
- Call `getDailyOracle()` in provider

### [MODIFY] [daily-widgets-client.tsx](file:///d:/Projects/spirit-hub/components/landing/daily-widgets-client.tsx)
- Import and render `OracleWidget` in dream's slot
- Pass oracle data from context

---

## Phase 3: Enhance Energia Zilei with Moon Phase

### [NEW] Data Schema: `data/interpretations/moon-guide.json`

```json
{
  "0": {
    "name": "Lună Nouă",
    "emoji": "🌑",
    "energy": "low",
    "theme": "Noi Începuturi",
    "short_guidance": "Plantează semințele intențiilor tale. Energia este subtilă dar plină de potențial.",
    "amplifier": "Energia zilei este în pregătire. Ideal pentru planificare, nu pentru acțiune."
  },
  "4": {
    "name": "Lună Plină",
    "emoji": "🌕",
    "energy": "peak",
    "theme": "Manifestare",
    "short_guidance": "Energia emoțională este la maxim. Recunoștință și eliberare.",
    "amplifier": "Energia zilei este amplificată. Emoțiile și intuiția sunt intensificate."
  }
}
```
*8 phases total (0-7)*

---

### [NEW] [moon-guide.ts](file:///d:/Projects/spirit-hub/lib/moon-guide.ts)

```typescript
import moonData from "@/data/interpretations/moon-guide.json";

export interface MoonPhaseData {
  phase: number;        // 0-7
  name: string;         // "Lună Nouă"
  emoji: string;        // "🌑"
  energy: string;       // "low" | "rising" | "peak" | "falling"
  theme: string;        // "Noi Începuturi"
  short_guidance: string;
  amplifier: string;    // How it affects daily energy
}

export function getMoonPhase(date: Date = new Date()): MoonPhaseData {
  const synodicMonth = 29.53058867;
  const knownNewMoon = new Date(2024, 0, 11).getTime();
  const daysSince = (date.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
  const phasePercent = (daysSince % synodicMonth) / synodicMonth;
  const phase = Math.floor(phasePercent * 8) % 8;
  
  const data = moonData[phase.toString()];
  return { phase, ...data };
}
```

---

### [MODIFY] [energia-zilei.ts](file:///d:/Projects/spirit-hub/lib/energia-zilei.ts)
- Import `getMoonPhase`
- Add moon data to returned object or keep separate

### [MODIFY] [energia-zilei-card.tsx](file:///d:/Projects/spirit-hub/components/bioritm/energia-zilei-card.tsx)
- Add moon phase section below main content
- Show emoji, name, and `amplifier` text

### [MODIFY] [moon-phase-header.tsx](file:///d:/Projects/spirit-hub/components/landing/moon-phase-header.tsx)
- Make tappable (link to `/bioritm/energia-zilei`)
- Add subtle "→" indicator

---

## Phase 4: Verification

### Build Check
```bash
bun run build
bun run typecheck
bun run lint
```

### Functional Tests
- [ ] Homepage loads with Oracle widget
- [ ] Oracle shows same message all day
- [ ] Oracle message changes next day (test with date override)
- [ ] `/mesaj-zilnic` page renders correctly
- [ ] Energia Zilei shows moon phase
- [ ] Moon phase header is tappable
- [ ] No 404s for removed dream routes
- [ ] Mobile responsive check

### Browser Testing
- Homepage bento grid layout
- Oracle widget interactions
- Moon phase display
- Share functionality (if implemented)

---

## File Summary

| Action | File | Notes |
|--------|------|-------|
| DELETE | `data/dream-symbols.json` | |
| DELETE | `data/dreams-search-index.json` | |
| DELETE | `components/vise/*` | Entire directory |
| DELETE | `components/landing/widgets/dream-widget.tsx` | |
| DELETE | `app/vise/*` | Entire directory |
| DELETE | `lib/dream-data.ts` | |
| DELETE | `scripts/generate-dream-index.ts` | |
| NEW | `data/interpretations/oracle.json` | 100 messages |
| NEW | `data/interpretations/moon-guide.json` | 8 phases |
| NEW | `lib/oracle.ts` | |
| NEW | `lib/moon-guide.ts` | |
| NEW | `components/landing/widgets/oracle-widget.tsx` | |
| NEW | `app/mesaj-zilnic/page.tsx` | |
| MODIFY | `components/providers/daily-content-provider.tsx` | |
| MODIFY | `components/landing/daily-widgets-client.tsx` | |
| MODIFY | `lib/energia-zilei.ts` | Optional |
| MODIFY | `components/bioritm/energia-zilei-card.tsx` | |
| MODIFY | `components/landing/moon-phase-header.tsx` | |

---

## Estimated Effort

| Phase | Time | Notes |
|-------|------|-------|
| Phase 1: Remove Dreams | 30 min | Mostly deletions |
| Phase 2: Oracle Feature | 4-6 hours | Content creation is longest |
| Phase 3: Moon Enhancement | 2-3 hours | Leverages existing code |
| Phase 4: Verification | 1 hour | Testing |
| **Total** | **8-10 hours** | Can be split across sessions |

---

## Session Breakpoints

**Session 1:** Phase 1 (Remove Dreams) + start Phase 2 data
**Session 2:** Complete Phase 2 (Oracle components)
**Session 3:** Phase 3 (Moon integration) + Phase 4 (Verify)
