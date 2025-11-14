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
- **Daily Content** - Cron-powered daily rotations (numbers, dreams, biorhythm insights)
- **Shareable Results** - One-click social media image generation
- **Autonomous Operation** - 99%+ autonomy via static content and deterministic calculations

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Language**: TypeScript
- **Icons**: Lucide React
- **Backend**: Convex (serverless backend and database)
- **Deployment**: Vercel

> 🔧 **For detailed technology stack and development guidelines, see [Tech.md](./Tech.md)**

## Project Structure

```
app/
├── page.tsx              # Homepage
├── layout.tsx            # Root layout with SEO metadata
├── numerologie/          # Numerology calculators
│   └── page.tsx
├── vise/                 # Dream interpretation
│   └── page.tsx
└── bioritm/              # Biorhythm calculator
    └── page.tsx
```

> 📁 **For detailed architecture and folder structure, see [Structure.md](./Structure.md)**

## Getting Started

### Prerequisites

- Node.js 18+ (or Bun)
- npm, yarn, pnpm, or bun
- Convex account (free tier available at [convex.dev](https://convex.dev))

### Installation

```bash
# Install dependencies
bun install
```

### Convex Backend Setup

The project uses Convex as a serverless backend for data storage and real-time queries.

#### 1. Initialize Convex

```bash
# Initialize Convex project (first time only)
npx convex dev
```

This will:
- Create the `convex/` directory structure
- Generate `.env.local` with your deployment URL
- Start the Convex development server

#### 2. Configure Environment Variables

After running `npx convex dev`, your `.env.local` file will be created with:

```env
CONVEX_DEPLOYMENT=https://your-deployment.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

**Note**: Both variables should have the same value (your Convex deployment URL).

If you need to set up manually, copy `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Then update with your actual Convex deployment URL.

### Development Workflow

The project requires **two terminal windows** running simultaneously:

#### Terminal 1: Convex Dev Server

```bash
npx convex dev
```

This watches for changes in `convex/` and syncs your schema and functions to the cloud.

#### Terminal 2: Next.js Dev Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

**Important**: Both servers must be running for the application to work correctly.

### Build

```bash
# Build for production
bun build

# Start production server
bun start
```

**Note**: For production deployment, ensure `NEXT_PUBLIC_CONVEX_URL` is set in your deployment environment (e.g., Vercel).

## Troubleshooting

### Convex Connection Issues

**Problem**: Frontend shows "Cannot connect to Convex" or queries fail

**Solutions**:
1. Verify `npx convex dev` is running in a separate terminal
2. Check that `.env.local` exists and contains `NEXT_PUBLIC_CONVEX_URL`
3. Restart both dev servers (Convex and Next.js)
4. Clear browser cache and reload

### Schema Compilation Errors

**Problem**: Convex dev server shows schema errors

**Solutions**:
1. Check `convex/schema.ts` for syntax errors
2. Ensure all imports are correct (`convex/server`, `convex/values`)
3. Verify table definitions follow Convex schema syntax
4. Review error messages - they include line numbers and specific issues

### Environment Variable Not Found

**Problem**: `NEXT_PUBLIC_CONVEX_URL is not defined`

**Solutions**:
1. Ensure `.env.local` exists in project root
2. Verify the variable name is exactly `NEXT_PUBLIC_CONVEX_URL`
3. Restart Next.js dev server after adding/changing environment variables
4. Check that `.env.local` is not in `.gitignore` (it should be)

### Port Conflicts

**Problem**: "Port already in use" errors

**Solutions**:
- **Next.js (port 3000)**: Use `bun dev -- -p 3001` to use a different port
- **Convex**: Convex uses its own ports; check for other Convex projects running

### First-Time Setup Issues

**Problem**: `npx convex dev` fails or asks for authentication

**Solutions**:
1. Create a free account at [convex.dev](https://convex.dev)
2. Run `npx convex login` to authenticate
3. Run `npx convex dev` again to initialize the project

### Generated Types Not Found

**Problem**: TypeScript errors about missing Convex types

**Solutions**:
1. Ensure `npx convex dev` is running (it generates types automatically)
2. Check that `convex/_generated/` directory exists
3. Wait a few seconds after schema changes for type regeneration
4. Restart your IDE/editor to pick up new types

## Development Guidelines

- **UI Language**: All user-facing text must be in Romanian
- **Code Language**: Development and technical documentation in English
- **Performance**: Target <2s initial load on mobile connections
- **Mobile-First**: Design and test mobile experience first
- **SEO**: Use semantic HTML, proper metadata, and Romanian keywords
- **Two-Terminal Workflow**: Always run both Convex and Next.js dev servers during development

## Documentation

- **[agents.md](./agents.md)** - AI agent behavior guidelines and workflows (required reading for AI assistants)
- **[product.md](./product.md)** - Complete product specifications, user journeys, and requirements
- **[Structure.md](./Structure.md)** - Project architecture, folder structure, and development patterns
- **[Tech.md](./Tech.md)** - Technology stack, code conventions, and development guidelines
- **[Next.js Documentation](https://nextjs.org/docs)** - Framework documentation

## License

Private project - All rights reserved
