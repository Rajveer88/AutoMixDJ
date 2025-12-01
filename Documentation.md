# WarpDrive - Browser-Based Audio Mixing Application

## Overview

WarpDrive is a browser-based DJ application that enables real-time audio mixing with dual decks, BPM synchronization, automatic mixing with Apple Music-style crossfading, and time-stretching capabilities. The application features a cyberpunk/futuristic dark mode design inspired by professional DJ software like Rekordbox, Serato, and Traktor. Users can load audio files into two independent decks, sync their BPM, adjust playback rates, and experience seamless automatic crossfading between tracks.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, providing fast HMR (Hot Module Replacement)
- Wouter for client-side routing (lightweight alternative to React Router)
- Path aliases configured for clean imports (`@/`, `@shared/`, `@assets/`)

**State Management**
- TanStack Query (React Query) for server state management and API interactions
- Local component state using React hooks for UI interactions
- Custom hooks for reusable logic (e.g., `useIsMobile`, `useToast`)

**UI Component Library**
- shadcn/ui components built on Radix UI primitives
- Tailwind CSS for styling with custom cyberpunk theme
- CSS variables for dynamic theming (cyan/magenta accent colors)
- Custom fonts: Rajdhani/Orbitron for headings, Inter/Roboto for body text, JetBrains Mono for monospaced elements

**Audio Processing**
- Tone.js library (v14.8.49) loaded via CDN for Web Audio API abstractions
- GrainPlayer for time-stretching and pitch-independent playback rate control
- Dual audio channels with independent volume control for crossfading
- Canvas-based waveform visualization with real-time animations

**Design System**
- Three-column responsive layout: Deck A | Mixer | Deck B
- Responsive breakpoints: desktop (side-by-side), tablet/mobile (vertical stack)
- Cyberpunk aesthetic with neon glow effects, gradient borders, and angular typography
- Dark mode as the primary theme with HSL color variables for consistency

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for the HTTP server
- Node.js http module for server creation
- Middleware stack: JSON parsing, URL encoding, request logging

**Development vs Production**
- Development: Vite middleware integration for HMR and SSR-like capabilities
- Production: Static file serving from pre-built `dist/public` directory
- Environment-aware configuration using `NODE_ENV`

**API Structure**
- Routes defined in `server/routes.ts` with `/api` prefix convention
- Modular storage interface (`IStorage`) for data persistence abstraction
- In-memory storage implementation (`MemStorage`) as the default backend
- Extendable to database storage via the storage interface

**Build Process**
- Custom build script using esbuild for server bundling
- Selective dependency bundling to reduce cold start times
- Allowlist for critical dependencies to bundle (reduces file system calls)
- Client and server builds run sequentially

### Data Storage Solutions

**Current Implementation**
- In-memory storage with Map-based data structures
- User management with basic CRUD operations (create, get by ID, get by username)
- UUID generation for unique identifiers

**Database Schema (Drizzle ORM)**
- PostgreSQL configured via Drizzle Kit
- Schema defined with `drizzle-orm` and `drizzle-zod` for type safety and validation
- Users table with id (UUID), username (unique), and password fields
- Neon serverless PostgreSQL driver for cloud database connectivity
- Migration support via Drizzle Kit (migrations directory configured)

**Note**: The application is configured for PostgreSQL but currently uses in-memory storage. Database integration can be enabled by provisioning a PostgreSQL instance and setting the `DATABASE_URL` environment variable.

### External Dependencies

**Audio Processing**
- Tone.js (CDN): Web Audio API wrapper for audio synthesis, effects, and scheduling

**UI Component Libraries**
- Radix UI: Unstyled, accessible component primitives (20+ components including Dialog, Dropdown, Slider, Toast, etc.)
- Tailwind CSS: Utility-first CSS framework with custom configuration
- class-variance-authority: Utility for creating variant-based component APIs
- clsx & tailwind-merge: Conditional className composition

**Routing & State**
- Wouter: Minimalist routing for React
- TanStack Query: Async state management with caching and synchronization

**Form Handling**
- React Hook Form: Performance-focused form state management
- Zod: Schema validation integrated with Drizzle ORM
- @hookform/resolvers: Validation resolver for React Hook Form

**Database & ORM**
- Drizzle ORM: TypeScript ORM with type-safe queries
- @neondatabase/serverless: Serverless PostgreSQL driver for Neon
- connect-pg-simple: PostgreSQL session store for Express (configured but not actively used)

**Build & Development Tools**
- Vite plugins: Runtime error modal, Replit-specific development tools (cartographer, dev banner)
- esbuild: Fast JavaScript bundler for production builds
- TypeScript: Static type checking across the entire stack

**Utility Libraries**
- date-fns: Date manipulation and formatting
- nanoid: Compact unique ID generation
- lucide-react: Icon library for UI components

**Future Extensibility**
- Session management dependencies included (express-session, memorystore)
- Authentication scaffolding with Passport.js (passport, passport-local, jsonwebtoken)
- Email capabilities (nodemailer)
- Third-party integrations ready (OpenAI, Google Generative AI, Stripe)