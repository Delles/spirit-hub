# Design Document - Convex Backend Setup

## Overview

This design establishes the Convex backend infrastructure for SpiritHub.ro, providing a serverless data layer with real-time capabilities. The implementation follows a straightforward setup process: install dependencies, initialize the Convex project, define the database schema, and verify integration with the React frontend.

The design prioritizes simplicity and follows Convex best practices while aligning with the project's existing Next.js 16 + React 19 + TypeScript architecture.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────┐
│   Next.js 16 Frontend (React 19)   │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   Convex React Provider      │  │
│  │   (ConvexProvider)           │  │
│  └──────────────────────────────┘  │
│              │                      │
│              │ useQuery/useMutation │
│              ▼                      │
└─────────────────────────────────────┘
              │
              │ HTTPS/WebSocket
              ▼
┌─────────────────────────────────────┐
│      Convex Cloud Platform          │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   Schema & Type Generation   │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │   Database Tables            │  │
│  │   - interpretations          │  │
│  │   - dreamSymbols             │  │
│  │   - dailyPicks               │  │
│  │   - analytics                │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │   Queries & Actions          │  │
│  │   (to be added in Phase 2)   │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Technology Stack Integration

- **Frontend**: Next.js 16 App Router with React 19
- **Backend**: Convex (serverless)
- **Language**: TypeScript 5 (strict mode)
- **Package Manager**: Bun (existing)
- **Development**: Convex dev server runs alongside Next.js dev server

## Components and Interfaces

### 1. Convex Configuration Files

#### `convex/schema.ts`
Primary schema definition file containing all table structures.

**Responsibilities:**
- Define database tables with typed fields
- Specify indexes for query optimization
- Export schema for type generation

**Key Exports:**
- `default`: Convex schema object

#### `.env.local`
Environment configuration for Convex deployment.

**Contents:**
```
CONVEX_DEPLOYMENT=<deployment-url>
NEXT_PUBLIC_CONVEX_URL=<deployment-url>
```

### 2. Frontend Integration

#### `app/layout.tsx` (Modified)
Root layout will be updated to include ConvexProvider.

**Changes:**
- Import `ConvexProvider` from `convex/react`
- Import `ConvexReactClient` from `convex/react`
- Wrap children with ConvexProvider
- Pass deployment URL from environment variable

**Pattern:**
```typescript
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

<ConvexProvider client={convex}>
  {children}
</ConvexProvider>
```

### 3. Generated Files

#### `convex/_generated/`
Auto-generated directory created by Convex dev server.

**Contents:**
- TypeScript type definitions for all tables
- API client types
- Server-side function types

**Note:** This directory should be gitignored but is essential for development.

## Data Models

### Table: interpretations

Stores static interpretation text for numerology numbers and other features.

**Schema:**
```typescript
interpretations: defineTable({
  type: v.string(),              // "life-path" | "destiny" | "compatibility"
  number: v.number(),            // 1-9 for numerology
  title: v.string(),             // Romanian title
  description: v.string(),       // Short Romanian description
  fullText: v.string(),          // Complete interpretation in Romanian
  createdAt: v.number(),         // Timestamp
})
.index("by_type_and_number", ["type", "number"])
```

**Indexes:**
- `by_type_and_number`: Efficient lookup by interpretation type and number

### Table: dreamSymbols

Stores dream dictionary entries with symbols and their meanings.

**Schema:**
```typescript
dreamSymbols: defineTable({
  name: v.string(),              // Romanian symbol name (e.g., "șarpe")
  slug: v.string(),              // URL-friendly slug
  category: v.string(),          // "animale" | "natură" | "obiecte" | "emoții"
  shortMeaning: v.string(),      // Brief interpretation (1-2 sentences)
  fullInterpretation: v.string(), // Complete interpretation
  keywords: v.array(v.string()), // Search keywords
  createdAt: v.number(),         // Timestamp
})
.index("by_slug", ["slug"])
.index("by_category", ["category"])
.searchIndex("search_symbols", {
  searchField: "name",
  filterFields: ["category"]
})
```

**Indexes:**
- `by_slug`: Fast lookup by URL slug
- `by_category`: Filter by category
- `search_symbols`: Full-text search on symbol names

### Table: dailyPicks

Stores daily selected content (numărul zilei, visul zilei).

**Schema:**
```typescript
dailyPicks: defineTable({
  date: v.string(),              // ISO date string (YYYY-MM-DD)
  type: v.string(),              // "daily-number" | "daily-dream"
  contentId: v.string(),         // Reference to interpretation or dream symbol
  createdAt: v.number(),         // Timestamp
})
.index("by_date_and_type", ["date", "type"])
```

**Indexes:**
- `by_date_and_type`: Efficient lookup of daily content

### Table: analytics

Optional usage tracking for understanding user behavior.

**Schema:**
```typescript
analytics: defineTable({
  eventType: v.string(),         // "pageview" | "calculator-use" | "search"
  feature: v.string(),           // "numerology" | "dreams" | "biorhythm"
  metadata: v.optional(v.any()), // Additional event data
  timestamp: v.number(),         // Event timestamp
})
.index("by_timestamp", ["timestamp"])
.index("by_feature", ["feature"])
```

**Indexes:**
- `by_timestamp`: Time-based queries
- `by_feature`: Feature-specific analytics

## Error Handling

### Installation Errors

**Scenario:** Convex package installation fails

**Handling:**
- Check network connectivity
- Verify Bun is functioning correctly
- Try alternative: `npm install convex` if Bun has issues
- Check package registry availability

### Initialization Errors

**Scenario:** `npx convex dev` fails to initialize

**Handling:**
- Verify Convex account is created (may require signup)
- Check authentication status
- Ensure no port conflicts (Convex uses specific ports)
- Review Convex CLI output for specific error messages

### Schema Compilation Errors

**Scenario:** Schema definition has syntax errors

**Handling:**
- Convex dev server provides detailed error messages with line numbers
- Common issues:
  - Missing imports (`v` from `convex/values`)
  - Incorrect field type definitions
  - Invalid index configurations
- Fix errors and save; dev server auto-recompiles

### Frontend Integration Errors

**Scenario:** React components cannot connect to Convex

**Handling:**
- Verify `NEXT_PUBLIC_CONVEX_URL` is set in `.env.local`
- Ensure ConvexProvider wraps the component tree
- Check browser console for connection errors
- Verify Convex dev server is running

## Testing Strategy

### Manual Testing Checklist

#### 1. Installation Verification
- [ ] Run `bun install convex`
- [ ] Verify `convex` appears in `package.json` dependencies
- [ ] Confirm `npx convex` command is available

#### 2. Initialization Verification
- [ ] Run `npx convex dev`
- [ ] Verify `convex/` directory is created
- [ ] Confirm `.env.local` contains `CONVEX_DEPLOYMENT`
- [ ] Check `convex/_generated/` directory exists

#### 3. Schema Verification
- [ ] Create `convex/schema.ts` with all four tables
- [ ] Save file and observe dev server output
- [ ] Verify no compilation errors
- [ ] Check `convex/_generated/` for type files

#### 4. Frontend Integration Verification
- [ ] Update `app/layout.tsx` with ConvexProvider
- [ ] Start Next.js dev server (`bun dev`)
- [ ] Create test component with `useQuery` hook
- [ ] Query empty table (should return empty array)
- [ ] Verify no console errors

### Success Criteria

**Installation Success:**
- `convex` package in dependencies
- No installation errors

**Initialization Success:**
- Convex dev server runs without errors
- Environment variables configured
- Generated files present

**Schema Success:**
- All tables defined correctly
- Indexes configured
- Types generated in `_generated/`

**Integration Success:**
- Frontend can import Convex hooks
- Queries execute successfully
- Empty tables return empty arrays within 500ms

## Implementation Notes

### Development Workflow

1. **Terminal 1**: Run `npx convex dev` (keep running)
2. **Terminal 2**: Run `bun dev` (Next.js dev server)
3. Both servers must run simultaneously during development

### Environment Variables

- `.env.local` is gitignored (contains deployment URL)
- `.env.local.example` should be created with placeholder values
- Team members need to run `npx convex dev` to get their own deployment URL

### TypeScript Configuration

No changes needed to `tsconfig.json`. Convex generates types that work with existing strict mode configuration.

### Package Manager Considerations

Using Bun as package manager:
- `bun install convex` for installation
- `npx convex dev` still uses npx (Convex CLI)
- No conflicts expected

## Security Considerations

### API Keys and Secrets

- Convex deployment URL is public (safe to expose in frontend)
- No additional API keys required for basic setup
- Authentication/authorization to be added in future phases

### Data Privacy

- No personal data stored in initial schema
- Analytics table designed for aggregate data only
- GDPR compliance considerations for future user features

## Performance Considerations

### Query Performance

- Indexes defined for all common query patterns
- Search index on dream symbols for fast text search
- Expected query latency: <100ms for indexed queries

### Development Performance

- Convex dev server provides instant schema updates
- Type generation completes in <5 seconds
- No impact on Next.js build times

## Future Extensibility

### Phase 2 Preparation

This schema design supports upcoming features:
- Numerology queries (Phase 2.2)
- Dream search functionality (Phase 2.3)
- Biorhythm data storage (Phase 2.1)
- Daily content automation (Phase 3.1)

### Schema Evolution

Convex supports schema migrations:
- Add new tables without downtime
- Add fields to existing tables
- Modify indexes as needed
- No manual migration scripts required

## Dependencies

### External Dependencies

- `convex` package (latest stable version)
- Convex cloud platform account (free tier sufficient for MVP)

### Internal Dependencies

- Next.js 16 project structure (already in place)
- TypeScript configuration (already in place)
- React 19 (already in place)

### No Breaking Changes

This setup does not modify existing code except:
- `app/layout.tsx` (adds ConvexProvider wrapper)
- `.env.local` (adds environment variables)
- `.gitignore` (should already ignore .env.local)

## Rollback Plan

If Convex setup fails or proves unsuitable:

1. Remove `convex` from dependencies
2. Delete `convex/` directory
3. Remove ConvexProvider from `app/layout.tsx`
4. Remove Convex environment variables
5. Alternative: Use Next.js API routes + database (Postgres/MongoDB)

## Documentation

### Developer Documentation

Create `.env.local.example`:
```
CONVEX_DEPLOYMENT=https://your-deployment.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

Add to README.md:
```markdown
## Backend Setup

1. Install dependencies: `bun install`
2. Initialize Convex: `npx convex dev`
3. Copy `.env.local.example` to `.env.local`
4. Start dev server: `bun dev`
```

### Code Comments

Minimal comments in schema file:
- Purpose of each table
- Explanation of indexes
- Notes on field constraints

## Conclusion

This design provides a solid foundation for the Convex backend, following best practices and integrating seamlessly with the existing Next.js + React architecture. The schema is designed for the specific needs of SpiritHub.ro while remaining flexible for future enhancements.

The implementation is straightforward and low-risk, with clear success criteria and a simple rollback plan if needed.
