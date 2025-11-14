# Implementation Plan - Convex Backend Setup

## Task List

- [x] 1. Install Convex package and verify installation




  - Run `bun install convex` to add Convex to project dependencies
  - Verify the convex package appears in package.json
  - Confirm npx convex command is available
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Initialize Convex project and configure environment





  - Run `npx convex dev` to initialize the Convex project
  - Verify convex/ directory is created with initial structure
  - Confirm .env.local file is created with CONVEX_DEPLOYMENT URL
  - Add NEXT_PUBLIC_CONVEX_URL to .env.local (same as CONVEX_DEPLOYMENT)
  - Create .env.local.example with placeholder values for team reference
  - Update .gitignore to ensure .env.local is ignored (verify existing entry)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 3. Create database schema with all required tables





  - [x] 3.1 Create convex/schema.ts file with schema imports


    - Import defineSchema and defineTable from "convex/server"
    - Import v (validators) from "convex/values"
    - Set up basic schema structure
    - _Requirements: 3.1, 3.5, 3.6_

  - [x] 3.2 Define interpretations table

    - Add interpretations table with fields: type, number, title, description, fullText, createdAt
    - Define by_type_and_number index for efficient lookups
    - Add code comments explaining table purpose
    - _Requirements: 3.1, 4.1, 4.4_

  - [x] 3.3 Define dreamSymbols table

    - Add dreamSymbols table with fields: name, slug, category, shortMeaning, fullInterpretation, keywords, createdAt
    - Define by_slug index for URL lookups
    - Define by_category index for filtering
    - Define search_symbols search index on name field with category filter
    - Add code comments explaining search functionality
    - _Requirements: 3.2, 4.1, 4.3, 4.4_


  - [x] 3.4 Define dailyPicks table

    - Add dailyPicks table with fields: date, type, contentId, createdAt
    - Define by_date_and_type index for daily content queries
    - Add code comments explaining daily selection purpose
    - _Requirements: 3.3, 4.2, 4.4_



  - [x] 3.5 Define analytics table

    - Add analytics table with fields: eventType, feature, metadata, timestamp
    - Define by_timestamp index for time-based queries
    - Define by_feature index for feature-specific analytics
    - Add code comments noting this is optional tracking

    - _Requirements: 3.4, 4.2, 4.4_

  - [x] 3.6 Export schema and verify compilation

    - Export default schema object with all tables
    - Save file and observe Convex dev server output for compilation
    - Verify no TypeScript or schema errors
    - Confirm convex/_generated/ directory contains generated types
    - _Requirements: 3.5, 3.6, 6.1, 6.2, 6.3, 6.4_

- [x] 4. Integrate Convex with React frontend




  - [x] 4.1 Update root layout with ConvexProvider


    - Import ConvexProvider and ConvexReactClient from "convex/react"
    - Create ConvexReactClient instance with NEXT_PUBLIC_CONVEX_URL
    - Wrap children with ConvexProvider in app/layout.tsx
    - Ensure provider is placed correctly in component tree
    - _Requirements: 7.1, 7.5_


  - [x] 4.2 Create test component to verify integration

    - Create a simple test component that uses useQuery hook
    - Query one of the empty tables (e.g., interpretations)
    - Display loading state and query results
    - Place test component in app/page.tsx temporarily
    - _Requirements: 7.1, 7.2, 7.3, 7.4_


  - [x] 4.3 Verify frontend-backend connection

    - Start both Convex dev server and Next.js dev server
    - Open application in browser
    - Verify test component renders without errors
    - Confirm empty array is returned from query
    - Check browser console for any connection errors
    - Measure query response time (should be <500ms)
    - Remove test component after verification
    - _Requirements: 7.2, 7.3, 7.4_

- [x] 5. Create developer documentation





  - Update README.md with Convex setup instructions
  - Document the two-terminal development workflow
  - Add troubleshooting section for common setup issues
  - Include notes about environment variable configuration
  - _Requirements: 2.5, 5.5_
