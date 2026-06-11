# SpiritHub.ro

Romanian-language spiritual calculation platform combining numerology, biorhythm tools, and daily guidance.

> 📖 **For detailed product specifications, see [product.md](./docs/product.md)**

## Overview

SpiritHub.ro is a modern, mobile-first spiritual platform offering interconnected tools:

1. **Numerologie** - Life Path, Destiny Number, Compatibility, and Daily Numbers calculators
2. **Bioritm** - Physical, Emotional, and Intellectual cycle tracking with daily guidance
3. **Mesaj Zilnic** - Deterministic oracle-style daily guidance and homepage widgets

## Key Features

- **Mobile-First Design** - Optimized for 70% mobile traffic with <2s load times
- **Romanian Language** - All UI and content in Romanian (ro-RO) with full diacritic support
- **SEO Optimized** - Romanian keywords, structured data, semantic HTML
- **Daily Content** - Deterministic daily rotations (numbers, oracle messages, biorhythm insights)
- **Monetization Ready** - Optional AdSense integration plus trust/legal pages
- **Shareable Results** - One-click social media image generation
- **Autonomous Operation** - 99%+ autonomy via static content and deterministic calculations

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript 5
- **Data**: Static JSON datasets + deterministic lib functions (SSG/ISR)
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix-based UI components)
- **Animations**: Framer Motion (for subtle transitions and result animations)
- **Icons**: Lucide React
- **Runtime / Package Manager**: Bun
- **Deployment**: Vercel (ISR/SSG)

> 🔧 **For detailed technology stack and development guidelines, see [Tech.md](./docs/Tech.md)**

## Project Structure

High-level route structure (App Router):

```
app/
├── page.tsx               # Homepage
├── layout.tsx             # Root layout with SEO metadata
├── numerologie/           # Numerology calculators (life path, destiny, compatibility, daily number)
├── mesaj-zilnic/          # Daily oracle message
└── bioritm/               # Biorhythm calculator (daily + critical days)
```

> 📁 **For detailed architecture and folder structure, see [Structure.md](./docs/Structure.md)**

### Path Aliases

The project uses a single `@/` alias defined in `tsconfig.json`:

- `@/*` → root of the project (`./*`)

Common patterns:

- `@/app/...` – route files and layouts
- `@/components/...` – shared and feature components
- `@/lib/...` – pure domain logic (numerology, biorhythm, dreams, utilities)
- `@/config/...` – site- and feature-level configuration
- `@/hooks/...` – custom React hooks

When adding new code, prefer `@/` imports over relative (`../../..`) paths.

## Getting Started

### Prerequisites

- Node.js 18+ (or Bun)
- npm, yarn, pnpm, or bun

### Installation

```bash
# Install dependencies
bun install
```

### Development Workflow

The project is fully static/ISR; only the Next.js dev server is required.

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Linting & Type Checking

Run lint and type checks via Bun, using the scripts from `package.json`:

```bash
# ESLint
bun run lint

# TypeScript (no emit)
bun run typecheck
```

### Build

```bash
# Build for production
bun run build

# Start production server
bun start
```

### Monetization Environment

AdSense support is present but disabled until publisher values are configured:

```bash
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_RESULT_INLINE=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_CONTENT_FOOTER=1234567890
```

Result-page ad slots render only when both the client id and slot id are available.

## Troubleshooting

### Port Conflicts

**Problem**: "Port already in use" errors

**Solutions**:

- **Next.js (port 3000)**: Use `bun dev -- -p 3001` to use a different port

## Development Guidelines

- **UI Language**: All user-facing text must be in Romanian
- **Code Language**: Development and technical documentation in English
- **Performance**: Target <2s initial load on mobile connections
- **Mobile-First**: Design and test mobile experience first
- **SEO**: Use semantic HTML, proper metadata, and Romanian keywords

## Documentation

- **[product.md](./docs/product.md)** - Complete product specifications, user journeys, and requirements
- **[Structure.md](./docs/Structure.md)** - Project architecture, folder structure, and development patterns
- **[Tech.md](./docs/Tech.md)** - Technology stack, code conventions, and development guidelines
- **[business-roadmap.md](./docs/business-roadmap.md)** - Monetization and business execution plan
- **[operator-manual.md](./docs/operator-manual.md)** - Codex operating model and session playbook
- **[manual-work-queue.md](./docs/manual-work-queue.md)** - External account/config tasks for the user
- **[Next.js Documentation](https://nextjs.org/docs)** - Framework documentation

## License

Private project - All rights reserved
