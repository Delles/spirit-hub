Numerologie.ro: Technical Blueprint & Implementation Plan

1. Executive Summary

A mobile-first Romanian numerology platform delivering instant calculations (Life Path, Destiny Number, Daily Forecast) with optional AI-enhanced personalization. Built on Next.js 16 + Convex for 99.5% autonomy, monetized via AdSense, targeting 50K monthly pageviews within 6 months.

---

2. Market Opportunity & Positioning

Target Audience

- Primary: Romanian speakers aged 25-45 interested in spirituality, self-discovery

- Traffic Source: 80% organic search (Google.ro), 20% social (Facebook groups)

- Device Split: 70% mobile, 30% desktop

Competitive Advantage

- Speed: <2s load time (Vercel edge + Convex)

- Simplicity: 3-click flow vs. competitors' cluttered multi-page sites

- Localization: Native Romanian UX, diacritic support (ă, â, î, ș, ț)

- Modernity: App-like experience vs. outdated PHP sites

Revenue Potential

- Romanian Ad RPM: $2.50-$4.00 (higher than static sites due to engagement)

- 50K pageviews/month = $125-200/month

- Scaling: 100K pageviews = $250-400/month (12-month target)

---

3. Technical Architecture

Core Stack (100% Free Tier)

    Frontend:      Next.js 16 (App Router) + React 18

    Backend:       Convex (primary) + Supabase (fallback auth)

    Hosting:       Vercel (free tier) + Cloudflare CDN

    Database:      Convex localStorage (users) + Static JSON (interpretations)

    CMS:           Decap CMS (Git-based)

    AI (Optional): DeepSeek V3.2-Exp ($0.42/1M tokens)

    Monitoring:    UptimeRobot (free)

Architecture Diagram

    [User] → [Cloudflare] → [Vercel Edge] → [Next.js]

                                               ↓

                                        [Convex Functions]

                                               ↓

            ┌──────────────────┬──────────────────┬──────────────────┐

            ↓                  ↓                  ↓                  ↓

       [Calculate]      [Static JSON]      [Supabase]       [DeepSeek LLM]

       (Life Path)      (Interpretations)  (Auth Backup)    (Premium Daily)

Free Tier Capacity Analysis

Service Free Limit Your Usage (50K PV/mo) Buffer

Convex 1M calls/mo ~5K calls/day (150K/mo) 85% unused

Supabase 50K MAUs ~100 users/day (3K/mo) 94% unused

Vercel 100GB bandwidth ~10GB (lightweight) 90% unused

DeepSeek Pay-per-use ~1K generations/mo = $0.04 N/A

---

4. Product Features & MVP Scope

Phase 1: Core Calculators (Weeks 1-3)

1.

Life Path Number (Date of Birth → 1-9)

    - Input: Date picker



    - Output: Single-digit number + pre-written interpretation (500 words)



    - Pre-written combinations: 9 static texts

2.

Destiny/Name Number (Full Name → 1-9)

    - Input: Text field (Romanian diacritics supported)



    - Logic: A=1, B=2,... I=9, J=1, K=2,... (Pythagorean system)



    - Pre-written combinations: 9 static texts

3.

Daily Number (Today's Date + Personal Number)

    - Input: Life Path number (auto-filled if calculated)



    - Logic: (Day + Month + Year + Life Path) mod 9



    - Content: 9 static daily forecasts, rotated via cron

Phase 2: Engagement Features (Weeks 4-5)

1.

Love Compatibility (2 Names + 2 Birth Dates → Score 1-100)

    - Input: 4 fields (self + partner)



    - Logic: Average of Life Path compatibility + Name compatibility



    - Pre-written combinations: 10 score ranges (e.g., 80-89%)

2.

AI-Powered "Deep Insight" (Optional, Premium Feel)

    - Trigger: User clicks "Tell me more" on any result



    - Cost: $0.000042/generation (DeepSeek, 100 tokens)



    - Usage: ~5% of users = $0.10/month at 50K PV

Content Database Structure

    // convex/interpretations.ts

    export const INTERPRETATIONS = {

      lifePath: {

        1: { title: "Liderul", text: "Ești un vizionar..." },

        2: { title: "Mediatorul", text: "Ai darul diplomatiei..." },

        // ... 3-9

      },

      daily: {

        1: { forecast: "Astăzi este o zi pentru noi începuturi..." },

        // ... 3-9

      }

    };



    // cron job updates "daily" array every midnight

---

5. Design & UX Strategy

Visual Identity

- Color Palette: Deep Purple (#4C1D95) + Gold (#FCD34D) + Dark Mode

- Typography: Open Sans (supports Romanian diacritics), 18px minimum

- Layout: Single-column, mobile-first, no horizontal scrolling

- Animations:
  - Number counting up (Framer Motion, 1.5s duration)

  - Smooth transitions between steps (slide left/right)

  - Subtle glow effect on result reveal

User Flow (3 Clicks)

    Landing → [Enter Birth Date] → [Enter Full Name] → [Result Page]

                 ↓                        ↓                    ↓

             Date Picker            Text Input         Number + Reading

             (1 animation)      (auto-capitalize)    (Share Button + Ad)

Ad Placement (Max 2 Ads per Session)

1. Between Step 2 & 3: 300x250 (mobile: sticky bottom)

2. Within Result Text: Native ad after first paragraph

3. No interstitials: Google penalizes; kills UX

Ad Load Strategy:

    // components/AdSlot.tsx

    import Script from 'next/script';



    export default function AdSlot() {

      return (

        <div className="ad-container">

          <Script

            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"

            strategy="lazyOnload"

            onLoad={() => {

              (window.adsbygoogle = window.adsbygoogle || []).push({});

            }}

          />

          <ins className="adsbygoogle"

            style={{ display: 'block' }}

            data-ad-client="ca-pub-XXXX"

            data-ad-slot="YYYY"></ins>

        </div>

      );

    }

---

6. Implementation Timeline

MVP Launch: 5 Weeks

Week Tasks Deliverable Owner

1 - Set up Git repo

- Install Next.js 16 + Convex

- Configure Vercel + Cloudflare

- Design system (colors, typography) Dev environment ready You

2 - Code Life Path calculator

- Create 9 pre-written interpretations

- Implement date picker UI

- Add number animation Calculator #1 live You

3 - Code Destiny calculator

- Create 9 pre-written interpretations

- Add diacritic support

- Mobile responsiveness Calculator #2 live You

4 - Code Daily Number + cron job

- Code Compatibility calculator

- Create 10 compatibility texts

- Integrate Decap CMS All 4 calculators live You

5 - Apply for Google AdSense

- Place ad slots

- SEO: meta tags, sitemap, GSC

- Launch to Romanian Facebook groups Public Launch You

Post-Launch: Months 2-6

- Month 2: Monitor AdSense RPM, adjust placement

- Month 3: Add AI "Deep Insight" button (if users request)

- Month 4: Write 5 blog posts for SEO ("Numerologie românească")

- Month 5: A/B test result page layouts (Convex analytics)

- Month 6: Reach 50K pageviews, evaluate Ezoic upgrade

---

7. Cost Structure & Revenue Model

Monthly Costs (50K Pageviews)

Item Cost Notes

Domain (.ro) $1.70 Via Rotld, annual payment

Vercel $0 Free tier (100GB bandwidth)

Convex $0 Free tier (1M calls, 0.5GB storage)

Supabase $0 Free tier (50K MAUs, backup only)

Decap CMS $0 Git-based, no hosting cost

DeepSeek LLM $0.04 Optional: 1K generations/month

UptimeRobot $0 Free tier (5 monitors)

Cloudflare $0 Free CDN + DNS

TOTAL $1.74/month ~$21/year

Revenue Projections

Metric Month 1 Month 3 Month 6

Pageviews 5K 25K 50K

Sessions 2K 10K 20K

Ad RPM $2.00 $3.00 $3.50

Revenue $10 $75 $175

Profit $8.26 $73.26 $173.26

Break-even: Month 2 (cover domain cost)

ROI: 830% by Month 6 (if time valued at $0)

---

8. Automation & Operations Plan

   99.5% Autonomy Breakdown

Automated (No Human Input)

- ✅ Calculations (Convex functions)

- ✅ Result generation (static JSON lookup)

- ✅ Daily content rotation (cron job: 5 lines of code)

- ✅ Ad serving (AdSense Auto Ads)

- ✅ Performance monitoring (UptimeRobot alerts)

- ✅ SSL renewal (Cloudflare)

- ✅ Deployments (Vercel GitHub integration)

Manual (0.5% = 20 min/month)

- 🔄 Check AdSense dashboard (10 min)

- 🔄 Add 2-3 new interpretation texts (10 min via Decap CMS)

- 🔄 Review Convex usage metrics (5 min)

Optional (0% if disabled)

- 🤖 LLM generations: Fully automated, cost-capped at $1/month

Cron Job Setup

    // convex/cron.ts

    import { cron } from 'croner';



    // Rotate daily forecast every midnight UTC

    cron('0 0 * * *', () => {

      const today = new Date().toISOString().split('T')[0];

      // Update "dailyNumber" in Convex DB or static file

    });

---

9. Compliance & Legal (Romania)

GDPR Requirements

- Cookie Consent: Use Osano (free tier) or CookieYes

- Data Collection: Only birthdates + names (no PII)

- Storage: LocalStorage (not cookies) = no consent needed

- Right to Delete: Not applicable (no user accounts)

- Privacy Policy: Generate via GetTerms ($20 one-time)

Romanian Regulations

- .ro Domain: Register at www.rotld.ro (requires local ID)

- ANPC Compliance: Add disclaimer: "Destinat exclusiv divertismentului"

- AdSense Policy: No auto-refreshing ads, max 3 ads per page (compliant)

Content Guidelines

- Avoid medical/financial advice (stay in "spiritual guidance")

- No copyrighted numerology texts (write original interpretations)

- AI-generated content: Disclose "Generat cu asistență AI" (Romanian law)

---

10. Risk Management & Mitigation

Risk Probability Impact Mitigation

AdSense rejection Low High - No AI content on first 3 pages

- 15+ unique blog posts

- Wait 30 days post-launch

Convex free tier limits Low Medium - Monitor calls daily

- Cache results in localStorage

- Upgrade to $25/mo if needed

Low Romanian RPM Medium Medium - Focus on pageviews (SEO)

- Target diaspora (US/UK Romanians = higher RPM)

- Add Ezoic at 10K sessions

Competition from Facebook Medium Low - Facebook bans numerology ads, but organic groups work

- Focus on SEO, not paid

Content staleness Low Low - Add 2 texts/month (20 min)

- Users return for daily number, not new content

AI hallucinations Very Low Medium - Use LLM only for 5% premium users

- Pre-approve prompt templates

- Cost cap at $1/month

---

11. Success Metrics & KPIs

Launch KPIs (Month 1)

- ✅ 0-5K pageviews: Validate calculators work

- ✅ AdSense approval: Must get approved by Week 5

- ✅ <2s LCP: Core Web Vitals pass

Growth KPIs (Month 6)

- 🎯 50K pageviews/month: 20K sessions, 2.5 pages/session

- 🎯 $175/month revenue: $3.50 RPM average

- 🎯 <1% bounce rate: From result page (shareable content)

- 🎯 Top 3 SEO rankings: For "numerologie calcul", "numar destin"

Autonomy KPIs

- 🎯 <30 min manual work/month: Achieved via cron + static content

- 🎯 99.9% uptime: UptimeRobot monitoring

- 🎯 Zero server maintenance: Vercel + Convex handle infra

---

12. Final Recommendations

DO Use Your Tech Stack

- ✅ Next.js 16 + Convex: Faster dev, better UX, still free

- ✅ Vercel: Edge caching = <2s loads = higher ad viewability

- ✅ Optional LLM: $0.04/month for premium feel, not mandatory

DON'T Overcomplicate

- ❌ No user authentication: Use localStorage (no Supabase needed)

- ❌ No complex state: Convex useQuery is enough

- ❌ No paid APIs: Everything runs on free tiers

- ❌ No manual content: Pre-write 500+ texts, rotate automatically

Key Differentiator

Your edge is modern performance + Romanian localization. Competitors have outdated PHP sites with 5s load times. Your Next.js + Convex stack will feel like a native app, and Google rewards speed with higher rankings.

---

13. Implementation Checklist (Start Today)

- Buy domain numerologie.ro (€15/year)

- GitHub repo: numerologie-platform

- Install: npx create-next-app@latest (use App Router)

- Install: npm i convex + set up project

- Create Convex function: lifePath (hardcode 9 interpretations)

- Design in Figma: 3 screens (date → name → result)

- Code Week 1 tasks (see timeline above)

- Join Romanian Facebook groups (numerologie, spiritualitate)

- Set up UptimeRobot monitor (watch uptime from Day 1)

Launch Date: 5 weeks from today (e.g., if today is Nov 12 → Launch Dec 17)

Year 1 Goal: 50K pageviews/month, $175/month revenue, <30 min maintenance/month.

---

This blueprint is designed for 99.5% autonomy while leveraging your technical expertise. The Romanian market is underserved for modern spirituality tools—execute this plan, and you'll have a profitable side project by Q2 2025.
