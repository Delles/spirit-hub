# Product Overview – SpiritHub.ro

SpiritHub.ro is a Romanian-language spiritual platform that offers modern, app-like tools for self-discovery and daily guidance. It combines Numerology, Dream Interpretation, and Biorhythm calculations into a unified, fast, and mobile-first experience.

All UI and content are in Romanian; development and technical docs are in English.

---

## Core Purpose

1. **Accessible Spiritual Tools**

   Provide Romanians with easy-to-use, free tools to explore numerology, dreams, and biorhythms without complexity or registration.

2. **Daily Engagement**

   Encourage repeat visits through daily numbers, dream-of-the-day, and biorhythm insights.

3. **Autonomous Content Delivery**

   Achieve ~99% autonomy by relying on deterministic calculations, pre-written interpretations, and minimal ongoing manual work.

4. **Sustainable Monetization**

   Monetize via ethical, non-intrusive ads (AdSense/Ezoic) while preserving user experience.

---

## Main Modules

### 1. Numerologie (Numerology)

**Main entry:** `/numerologie`

**Features:**

- **Calea Vieții** (`/numerologie/calea-vietii`)
  - Input: Date of birth.
  - Output: Life Path number (1–9) + detailed interpretation.

- **Nume de Destin** (`/numerologie/nume-destin`)
  - Input: Full name (Romanian alphabet, with diacritics).
  - Output: Destiny number (1–9) + interpretation.

- **Compatibilitate** (`/numerologie/compatibilitate`)
  - Input: Two names and two birth dates.
  - Output: Compatibility score (e.g. 1–100) + textual explanation.

- **Numărul Zilei** (`/numerologie/numar-zilnic`)
  - Daily numerology number and forecast.
  - Generated deterministically for the current date.

**Goals:**

- Simple 2–3 step flows.
- Clear, culturally relevant Romanian interpretations.
- Fast, mobile-first user experience.

---

### 2. Interpretare Vise (Dream Interpretation)

**Main entry:** `/vise`

**Features:**

- **Dictionary Search** (`/vise`)
  - Search bar for dream symbols (e.g. "șarpe", "apă", "casă").
  - Results list with short interpretation snippets.

- **Symbol Detail** (`/vise/[slug]` or via inline expansion)
  - Full interpretation text for a symbol (traditional Romanian meanings).

- **Interpretare Vis** (`/vise/interpretare`)
  - User selects up to 3 main symbols from their dream.
  - Combine interpretations into a coherent, pre-written text.

- **Visul Zilei** (`/vise/visul-zilei`)
  - Daily highlighted dream symbol + interpretation.

**Goals:**

- High engagement through curiosity and emotional relevance.
- Strong SEO via many symbol-specific pages.
- Fast, searchable UI with debounced queries.

---

### 3. Bioritm (Biorhythm)

**Main entry:** `/bioritm`

**Features:**

- **Daily Biorhythm Calculator** (`/bioritm`)
  - Input: Date of birth.
  - Output: Graph or indicators for:
    - Physical cycle
    - Emotional cycle
    - Intellectual cycle
  - Textual summary: what today is good for (e.g. "zi bună pentru efort fizic").

- **Zile Critice** (`/bioritm/critice`)
  - Shows upcoming "critical days" when cycles cross zero.
  - Simple explanation of what to be cautious about.

**Goals:**

- Provide useful, easy-to-understand visual and textual guidance.
- Motivate users to return daily or weekly.

---

### 4. Blog & Educational Content

**Main entry:** `/blog`

**Features:**

- Articles explaining:
  - Basics of numerology.
  - How to interpret dreams in Romanian tradition.
  - Biorhythm concepts and how to use them.

- SEO-focused, long-form content to:
  - Build authority & trust.
  - Attract organic traffic from Google.

**Goals:**

- Establish SpiritHub.ro as a credible source in the Romanian spiritual space.
- Support E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).

---

## User Types

1. **Curious Visitors**
   - Find the site via Google or social media.
   - Use 1 tool once (e.g. life path number or dream symbol).
   - Need instant results with no friction.

2. **Returning Spiritual Users**
   - Check daily number, dream-of-the-day, or daily biorhythm.
   - More engaged with multiple tools.
   - More likely to share results on social media.

3. **Content Seekers**
   - Read blog posts on numerology, dreams, or biorhythms.
   - May not use calculators immediately.
   - Important for SEO and ad revenue.

---

## Language & Tone

- **UI Language:** Romanian only (ro_RO).
- **Docs & Code Language:** English.
- **Tone:**
  - Respectful, warm, and non-judgmental.
  - Spiritual but not dogmatic; no fearmongering.
  - Emphasize guidance and reflection, not deterministic fate.

---

## Non-Functional Requirements

1. **Performance**
   - Fast initial load (<2 seconds on typical mobile connections).
   - Snappy interactions for calculators and search.
   - Use static rendering and caching where possible.

2. **Autonomy**
   - Minimize manual content updates.
   - Use cron jobs/automation for daily selections (numărul zilei, visul zilei).
   - Prefer static interpretations and deterministic logic over frequent editorial work.

3. **Availability & Reliability**
   - Aim for high uptime (99.9%) using Vercel + Convex.
   - Minimal moving parts and no heavy infrastructure.

4. **SEO & Discoverability**
   - Use semantic HTML and rich metadata.
   - Create separate URLs for key features and symbols.
   - Optimize titles and descriptions in Romanian.

5. **Monetization**
   - Primary: Google AdSense (or similar) with non-intrusive placements.
   - Optional: Affiliate links for books or related products (respecting guidelines).

6. **Privacy & Compliance**
   - No mandatory registration.
   - Minimal data collection (e.g., birth date, name for calculations only).
   - GDPR-compliant cookie and privacy practices.

---

## Primary User Journeys (Examples)

1. **Life Path Number Journey**
   - User searches "număr de destin" on Google.
   - Lands on `/numerologie/calea-vietii`.
   - Enters birth date → gets Life Path number and interpretation.
   - Shares result image on Facebook.

2. **Dream Interpretation Journey**
   - User remembers a dream with a "șarpe".
   - Searches "ce înseamnă când visez șerpi".
   - Lands on `/vise` or symbol page.
   - Reads interpretation; optionally adds more symbols in `/vise/interpretare`.

3. **Daily Biorhythm Journey**
   - Returning user opens SpiritHub.ro directly.
   - Uses homepage widget to open `/bioritm`.
   - Sees today's cycles and "critical days" warnings.
   - Comes back next week to compare.

