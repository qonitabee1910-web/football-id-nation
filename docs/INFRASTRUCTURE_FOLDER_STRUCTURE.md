/**
 * IDN-INFRA-001: ENTERPRISE FOLDER STRUCTURE DOCUMENTATION
 * 
 * DERIVED FROM:
 * - EPOS-CORE-DOC-001 (Enterprise Architecture)
 * - ADR-0001 (Runtime Stack)
 * - IDN-PRD-001 (Product Domain)
 * - IDN-FE-001 (Frontend Architecture)
 * 
 * PURPOSE:
 * Scalable, feature-based folder structure for bounded contexts.
 * Every feature module MUST follow this standard.
 * 
 * STATUS: Enterprise Mandatory Baseline
 * VERSION: 1.0
 */

/*
==============================================================================
SOURCE DIRECTORY STRUCTURE
==============================================================================

src/
│
├── app/                           # Application entry point & lifecycle
│   ├── App.tsx                   # Root component
│   ├── bootstrap.ts              # App initialization
│   ├── lifecycle.ts              # App lifecycle hooks
│   └── config.ts                 # App configuration
│
├── providers/                     # Global providers & context
│   ├── index.tsx                 # Provider composition
│   ├── theme.tsx                 # Theme provider (Sprint 0)
│   ├── notifications.tsx         # Notifications provider (Sprint 0)
│   ├── auth.tsx                  # Auth context & state
│   ├── query.tsx                 # TanStack Query setup
│   └── router.tsx                # TanStack Router setup
│
├── config/                        # Configuration & environment
│   ├── environment.ts            # Env vars, validation
│   ├── constants.ts              # App constants
│   ├── feature-flags.ts          # Feature flag registry
│   └── version.ts                # Version management
│
├── shared/                        # Shared infrastructure (reusable across all features)
│   ├── api/                       # API client & HTTP infrastructure
│   │   ├── client.ts             # HTTP client (axios/fetch)
│   │   ├── request.ts            # Request interceptors
│   │   ├── response.ts           # Response interceptors
│   │   ├── errors.ts             # Error handling
│   │   ├── auth.ts               # Auth token management
│   │   ├── retry.ts              # Retry logic
│   │   └── offline.ts            # Offline support
│   │
│   ├── query/                     # Query & cache management
│   │   ├── query-keys.ts         # Query key factory
│   │   ├── query-options.ts      # Query configuration
│   │   ├── mutations.ts          # Mutation helpers
│   │   ├── cache.ts              # Cache strategies
│   │   └── prefetch.ts           # Prefetch utilities
│   │
│   ├── validation/                # Form validation (Zod)
│   │   ├── schema-registry.ts    # All Zod schemas
│   │   ├── error-mapping.ts      # Validation error mapping
│   │   ├── field-validators.ts   # Reusable field validators
│   │   └── index.ts              # Exports
│   │
│   ├── adapters/                  # Data transformation adapters
│   │   ├── api-adapter.ts        # API ↔ Domain model
│   │   ├── dto-adapter.ts        # DTO ↔ Domain model
│   │   ├── canonical-adapter.ts  # Canonical ↔ Domain model
│   │   └── view-model-adapter.ts # Domain ↔ View model
│   │
│   ├── mappers/                   # Entity & DTO mappers
│   │   ├── entity-mapper.ts      # Entity transformations
│   │   ├── dto-mapper.ts         # DTO transformations
│   │   ├── projection-mapper.ts  # Projection transformations
│   │   └── presentation-mapper.ts # Presentation model maps
│   │
│   ├── services/                  # Shared services (no business logic)
│   │   ├── logger.ts             # Logging service
│   │   ├── telemetry.ts          # Telemetry/analytics
│   │   ├── error-handler.ts      # Global error handling
│   │   ├── storage.ts            # Local/session storage
│   │   └── cache-manager.ts      # Cache management
│   │
│   ├── hooks/                     # Shared React hooks (Sprint 0)
│   │   ├── useQuery.ts           # TanStack Query wrapper
│   │   ├── useMutation.ts        # TanStack Mutation wrapper
│   │   ├── useAsync.ts           # Async operation hook
│   │   ├── useLocalStorage.ts    # Storage hook (Sprint 0)
│   │   └── useAuth.ts            # Auth hook (Sprint 0)
│   │
│   ├── components/                # Shared UI components (Sprint 0)
│   │   ├── layouts/              # Layout components (Sprint 0)
│   │   ├── navigation/           # Navigation components (Sprint 0)
│   │   ├── boundaries/           # Error/Loading boundaries (Sprint 0)
│   │   ├── notifications/        # Toast/Banner (Sprint 0)
│   │   └── common/               # Other shared UI components
│   │
│   ├── types/                     # Shared type definitions (Sprint 0)
│   │   ├── index.ts              # All shared types
│   │   ├── api.ts                # API request/response types
│   │   ├── errors.ts             # Error types
│   │   └── domain.ts             # Domain model types
│   │
│   ├── constants/                 # Shared constants
│   │   ├── design-tokens.ts      # Design tokens (Sprint 0)
│   │   ├── regex.ts              # Common regex patterns
│   │   ├── limits.ts             # Data limits
│   │   └── messages.ts           # Common messages
│   │
│   └── utils/                     # Shared utilities
│       ├── date.ts               # Date utilities
│       ├── string.ts             # String utilities
│       ├── number.ts             # Number utilities
│       ├── array.ts              # Array utilities
│       ├── object.ts             # Object utilities
│       ├── dom.ts                # DOM utilities
│       └── validation.ts         # Validation utilities
│
├── features/                      # Feature modules (bounded contexts)
│   │
│   ├── identity/                  # Identity bounded context
│   │   ├── components/            # Identity-specific components
│   │   ├── pages/                 # Identity pages/screens
│   │   ├── hooks/                 # Identity-specific hooks
│   │   ├── queries/               # Identity TanStack queries
│   │   ├── mutations/             # Identity TanStack mutations
│   │   ├── validators/            # Identity form validators
│   │   ├── services/              # Identity business services
│   │   ├── adapters/              # Identity API adapters
│   │   ├── mappers/               # Identity model mappers
│   │   ├── constants/             # Identity-specific constants
│   │   ├── types/                 # Identity domain types
│   │   ├── routes/                # Identity route definitions
│   │   └── index.ts               # Barrel exports
│   │
│   ├── organization/              # Organization bounded context
│   │   └── [same structure as identity/]
│   │
│   ├── competition/               # Competition bounded context
│   │   └── [same structure as identity/]
│   │
│   ├── referee/                   # Referee bounded context
│   │   └── [same structure as identity/]
│   │
│   ├── finance/                   # Finance bounded context
│   │   └── [same structure as identity/]
│   │
│   ├── medical/                   # Medical bounded context
│   │   └── [same structure as identity/]
│   │
│   ├── match/                     # Match bounded context
│   │   └── [same structure as identity/]
│   │
│   ├── tournament/                # Tournament bounded context
│   │   └── [same structure as identity/]
│   │
│   ├── education/                 # Education bounded context
│   │   └── [same structure as identity/]
│   │
│   └── [other bounded contexts follow same pattern]
│
├── routes/                        # Route definitions
│   ├── routes.manifest.ts         # Route registry with traceability
│   ├── navigation.manifest.ts     # Navigation registry
│   ├── [route files]              # TanStack Router route definitions
│   └── index.ts                   # Route exports
│
├── styles/                        # Global styles
│   ├── globals.css                # Global CSS
│   ├── animations.css             # Animation keyframes
│   └── tailwind.config.ts         # Tailwind configuration
│
├── lib/                           # Utilities & helpers
│   ├── constants.ts               # App constants (Sprint 0)
│   ├── validators/                # Form validators
│   ├── mappers/                   # Shared mappers
│   ├── adapters/                  # Shared adapters
│   ├── utils/                     # Utility functions
│   └── index.ts                   # Barrel exports
│
├── types/                         # Global type definitions (Sprint 0)
│   └── index.ts                   # All types
│
├── assets/                        # Static assets
│   ├── icons/                     # SVG icons
│   ├── images/                    # Images
│   ├── fonts/                     # Custom fonts
│   └── data/                      # Static data files
│
├── testing/                       # Testing infrastructure
│   ├── fixtures/                  # Test fixtures & mocks
│   ├── utils/                     # Test utilities
│   ├── setup.ts                   # Test setup
│   └── factories/                 # Object factories
│
├── manifests/                     # Central registries
│   ├── routes.manifest.ts         # Route registry
│   ├── navigation.manifest.ts     # Navigation registry
│   ├── components.manifest.ts     # Component registry
│   ├── icons.manifest.ts          # Icon registry
│   ├── tokens.manifest.ts         # Design token registry
│   └── index.ts                   # Exports
│
├── app.tsx                        # Root component
├── router.tsx                     # Router configuration (auto-generated)
├── start.tsx                      # TanStack Start entry
├── server.ts                      # Server functions (if SSR)
└── styles.css                     # Global styles


==============================================================================
FEATURE MODULE STANDARD STRUCTURE (MANDATORY)
==============================================================================

Every bounded context MUST follow this structure. No deviation allowed.

features/{feature-name}/
│
├── components/                    # Feature-specific React components
│   ├── {ComponentName}/
│   │   ├── {ComponentName}.tsx
│   │   ├── {ComponentName}.test.tsx
│   │   └── index.ts
│   └── index.ts                   # Barrel export
│
├── pages/                         # Feature pages/screens
│   ├── {PageName}.tsx
│   └── index.ts
│
├── hooks/                         # Feature-specific hooks
│   ├── use{HookName}.ts
│   └── index.ts
│
├── queries/                       # TanStack Query hooks
│   ├── use{Query}.ts              # Each query in separate file
│   └── index.ts
│
├── mutations/                     # TanStack Mutation hooks
│   ├── use{Mutation}.ts           # Each mutation in separate file
│   └── index.ts
│
├── validators/                    # Zod validation schemas
│   ├── {entity}.validators.ts
│   └── index.ts
│
├── services/                      # Business logic services
│   ├── {entity}.service.ts
│   └── index.ts
│
├── adapters/                      # Data transformation adapters
│   ├── {entity}-api.adapter.ts
│   ├── {entity}-dto.adapter.ts
│   └── index.ts
│
├── mappers/                       # Entity & DTO mappers
│   ├── {entity}.mapper.ts
│   └── index.ts
│
├── constants/                     # Feature-specific constants
│   └── index.ts
│
├── types/                         # Feature domain types
│   ├── {entity}.types.ts
│   └── index.ts
│
├── routes/                        # Feature route definitions
│   ├── {route}.route.ts
│   └── index.ts
│
├── index.ts                       # Barrel export (public API)
│
├── ARCHITECTURE.md                # Feature architecture doc
├── TRACEABILITY.md                # Artefact traceability
└── README.md                      # Feature documentation


==============================================================================
FOLDER CREATION CHECKLIST
==============================================================================

Core Infrastructure (Must create before feature development):
  ☐ src/app/
  ☐ src/providers/
  ☐ src/config/
  ☐ src/shared/api/
  ☐ src/shared/query/
  ☐ src/shared/validation/
  ☐ src/shared/adapters/
  ☐ src/shared/mappers/
  ☐ src/shared/services/
  ☐ src/shared/hooks/
  ☐ src/shared/components/
  ☐ src/shared/types/
  ☐ src/shared/constants/
  ☐ src/shared/utils/
  ☐ src/routes/
  ☐ src/styles/
  ☐ src/lib/
  ☐ src/types/
  ☐ src/assets/
  ☐ src/testing/
  ☐ src/manifests/
  ☐ src/features/ (empty, ready for bounded contexts)

For each bounded context (Identity, Organization, etc.):
  ☐ src/features/{context}/components/
  ☐ src/features/{context}/pages/
  ☐ src/features/{context}/hooks/
  ☐ src/features/{context}/queries/
  ☐ src/features/{context}/mutations/
  ☐ src/features/{context}/validators/
  ☐ src/features/{context}/services/
  ☐ src/features/{context}/adapters/
  ☐ src/features/{context}/mappers/
  ☐ src/features/{context}/constants/
  ☐ src/features/{context}/types/
  ☐ src/features/{context}/routes/


==============================================================================
NAMING CONVENTIONS (MANDATORY)
==============================================================================

Files:
  - Components: PascalCase.tsx
  - Hooks: useHookName.ts
  - Services: entity.service.ts
  - Validators: entity.validators.ts
  - Mappers: entity.mapper.ts
  - Adapters: entity-adapter.ts
  - Tests: *.test.ts(x)
  - Constants: CONSTANT_NAME
  - Types: TypeName (interfaces), type TypeName

Folders:
  - Feature modules: kebab-case
  - Shared libraries: kebab-case
  - Component folders: PascalCase

Imports:
  - Use path aliases: import { Component } from '~/components';
  - Use barrel exports: import { useQuery } from '~/shared/query';
  - Never use relative paths beyond 2 levels: ../../../


==============================================================================
IMPORT ALIASES (MUST CONFIGURE IN tsconfig.json)
==============================================================================

  ~                    → src/
  ~/app                → src/app/
  ~/providers          → src/providers/
  ~/config             → src/config/
  ~/shared             → src/shared/
  ~/features           → src/features/
  ~/routes             → src/routes/
  ~/styles             → src/styles/
  ~/lib                → src/lib/
  ~/types              → src/types/
  ~/assets             → src/assets/
  ~/testing            → src/testing/
  ~/manifests          → src/manifests/


==============================================================================
INITIALIZATION ORDER
==============================================================================

When creating the project structure, create in this order:

1. src/types/               # Types first (foundation)
2. src/config/              # Configuration
3. src/shared/              # Shared infrastructure
4. src/manifests/           # Registries (depends on shared)
5. src/providers/           # Providers (depends on shared)
6. src/routes/              # Routes (depends on shared)
7. src/features/            # Feature modules (depends on all above)
8. src/app/                 # App bootstrap (last, depends on all)


==============================================================================
KEY PRINCIPLES
==============================================================================

1. SCALABILITY: Can add 10+ bounded contexts without restructuring
2. ISOLATION: Each feature module is independently deployable
3. REUSABILITY: Shared infrastructure eliminates duplication
4. TESTABILITY: Clear separation enables unit/integration testing
5. MAINTAINABILITY: Consistent structure across all features
6. DISCOVERABILITY: Standard locations make features easy to find
7. TRACEABILITY: Every file links to approving artefacts
8. ACCESSIBILITY: Built-in accessibility from shared components
9. PERFORMANCE: Lazy loading, code splitting at feature boundaries
10. SECURITY: Auth/validation at infrastructure level


==============================================================================
PROHIBITED PATTERNS
==============================================================================

❌ DO NOT create shared folders per feature
   (Each feature has its own components, not shared)

❌ DO NOT mix business logic with UI components
   (Services, adapters, mappers handle logic)

❌ DO NOT create "utils" folder at feature root
   (Use shared/utils or feature-specific services)

❌ DO NOT use relative imports beyond 2 levels
   (Use path aliases: ~/shared, ~/features)

❌ DO NOT store API types in components folder
   (Types live in types/ and types/ folders)

❌ DO NOT create "models" or "classes" folders
   (Use types/, services/, adapters/ instead)

❌ DO NOT bypass shared infrastructure
   (Every feature MUST use shared API, validation, etc.)

❌ DO NOT hardcode API endpoints in components
   (Use adapters and services)

❌ DO NOT duplicate validation logic per feature
   (Build reusable validators in shared/validation)

❌ DO NOT skip tests
   (Testing folder provides all infrastructure)


==============================================================================
DEPENDENCIES FLOW (LAYERED ARCHITECTURE)
==============================================================================

                    ┌─────────────────────┐
                    │   App Bootstrap     │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
            ┌───────▼────────┐    ┌──────▼───────┐
            │   Providers    │    │   Routes     │
            │ (Auth, Query)  │    │  (Manifests) │
            └───────┬────────┘    └──────┬───────┘
                    │                    │
                    └────────┬───────────┘
                             │
                   ┌─────────▼─────────┐
                   │ Features/Pages    │
                   │ (Bounded Contexts)│
                   └────────┬──────────┘
                            │
          ┌─────────────────┼──────────────────┐
          │                 │                  │
     ┌────▼────┐       ┌────▼────┐      ┌────▼────┐
     │ Hooks   │       │ Services │      │ Adapters│
     │ Queries │       │ Mappers  │      │ Validators
     │ Mutations        └─────────┘      └────┬────┘
     └────┬────┘                              │
          │                ┌──────────────────┘
          └────────┬───────┘
                   │
          ┌────────▼──────────┐
          │ Shared Infrastructure
          │ (API, Storage, etc)
          └───────────────────┘


==============================================================================
DOCUMENTATION REQUIRED PER FEATURE
==============================================================================

Each bounded context MUST include:

README.md
  - Feature overview
  - Key responsibilities
  - Public API (what other features can import)
  - Usage examples

ARCHITECTURE.md
  - Feature structure
  - Data flow diagrams
  - Service responsibilities
  - Query/Mutation patterns

TRACEABILITY.md
  - Links to source artefacts (IDN-*, ADR-*, etc.)
  - Business requirements mapping
  - Screen-to-component mapping
  - API endpoint mapping

CHANGELOG.md
  - Version history
  - Breaking changes
  - Migration guides


==============================================================================
STATUS
==============================================================================

This folder structure is:
✅ APPROVED as enterprise mandatory baseline
✅ REQUIRED for all feature development
✅ NON-NEGOTIABLE for AI coding assistants
✅ FOUNDATION for all bounded contexts

No feature implementation may deviate from this structure.

*/
