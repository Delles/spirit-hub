# SpiritHub.ro

Romanian-language spiritual calculation platform combining numerology, dream interpretation, and biorhythm tools.

> 📖 **For detailed product specifications, see [product.md](./product.md)**

## Overview

SpiritHub.ro is a modern, mobile-first spiritual platform offering three interconnected tools:

1. **Numerologie** - Life Path, Destiny Number, Compatibility, and Daily Numbers calculators
2. **Interpretare Vise** - Dream interpretation dictionary with 500+ Romanian symbols
3. **Bioritm** - Physical, Emotional, and Intellectual cycle tracking with daily guidance

## Key Features

- **Mobile-First Design** - Optimized for 70% mobile traffic with <2s load times
- **Romanian Language** - All UI and content in Romanian (ro-RO) with full diacritic support
- **SEO Optimized** - Romanian keywords, structured data, semantic HTML
- **Daily Content** - Deterministic daily rotations (numbers, dreams, biorhythm insights)
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

> 🔧 **For detailed technology stack and development guidelines, see [Tech.md](./Tech.md)**

## Project Structure

High-level route structure (App Router):

```
app/
├── page.tsx               # Homepage
├── layout.tsx             # Root layout with SEO metadata
├── numerologie/           # Numerology calculators (life path, destiny, compatibility, daily number)
├── vise/                  # Dream interpretation (dictionary, combinations, visul zilei)
└── bioritm/               # Biorhythm calculator (daily + critical days)
```

> 📁 **For detailed architecture and folder structure, see [Structure.md](./Structure.md)**

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

**Note**: For production deployment, ensure `NEXT_PUBLIC_CONVEX_URL` is set in your deployment environment (e.g., Vercel).

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

- **[agents.md](./agents.md)** - AI agent behavior guidelines and workflows (required reading for AI assistants)
- **[product.md](./product.md)** - Complete product specifications, user journeys, and requirements
- **[Structure.md](./Structure.md)** - Project architecture, folder structure, and development patterns
- **[Tech.md](./Tech.md)** - Technology stack, code conventions, and development guidelines
- **[Next.js Documentation](https://nextjs.org/docs)** - Framework documentation

## License

Private project - All rights reserved
