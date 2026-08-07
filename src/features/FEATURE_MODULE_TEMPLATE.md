/**
 * IDN-INFRA-001: FEATURE MODULE STANDARD TEMPLATE
 * 
 * DERIVED FROM:
 * - EPOS-CORE-DOC-001 (Module Architecture)
 * - ADR-0001 (Feature Module Structure)
 * - docs/INFRASTRUCTURE_FOLDER_STRUCTURE.md
 * 
 * PURPOSE:
 * Define the exact folder structure and file requirements for every feature module.
 * Every bounded context (Identity, Organization, Competition, Referee, Finance, Medical,
 * Match, Tournament, Education, etc.) MUST follow this template exactly.
 * 
 * NO DEVIATIONS ALLOWED - This is the mandatory standard for all 8+ bounded contexts.
 * 
 * FOLDER STRUCTURE:
 * 
 * src/features/{feature-name}/
 * ├── README.md (Feature documentation)
 * ├── types/
 * │   └── index.ts (Feature-specific types)
 * ├── constants.ts (Feature constants)
 * ├── pages/
 * │   ├── {FeatureName}Page.tsx (Page components)
 * │   └── index.ts (Page exports)
 * ├── components/
 * │   ├── {ComponentName}.tsx (UI components)
 * │   └── index.ts (Component exports)
 * ├── hooks/
 * │   ├── use{HookName}.ts (Custom hooks)
 * │   └── index.ts (Hook exports)
 * ├── services/
 * │   ├── {service}.service.ts (Business logic)
 * │   └── index.ts (Service exports)
 * ├── queries/
 * │   ├── query-keys.ts (TanStack Query keys)
 * │   ├── {entity}.queries.ts (Query hooks)
 * │   └── index.ts (Query exports)
 * ├── mutations/
 * │   ├── {entity}.mutations.ts (Mutation hooks)
 * │   └── index.ts (Mutation exports)
 * ├── adapters/
 * │   ├── {entity}-api.adapter.ts (API → DTO)
 * │   └── index.ts (Adapter exports)
 * ├── mappers/
 * │   ├── {entity}.mapper.ts (DTO → Domain)
 * │   ├── {entity}-view.mapper.ts (Domain → View)
 * │   └── index.ts (Mapper exports)
 * ├── validators/
 * │   ├── {entity}.validators.ts (Zod schemas)
 * │   └── index.ts (Validator exports)
 * ├── routes/
 * │   ├── {FeatureName}Route.tsx (Route component)
 * │   └── index.ts (Route exports)
 * └── __tests__/ (Optional: Jest tests)
 *     ├── {component}.test.tsx
 *     ├── {hook}.test.ts
 *     └── {service}.test.ts
 * 
 * STATUS: Enterprise Mandatory Baseline v1.0
 */

// =========================================================================
// FEATURE MODULE CONFIGURATION TYPE
// =========================================================================

/**
 * Configuration for a feature module
 */
export interface FeatureModuleConfig {
  /**
   * Unique feature identifier (e.g., 'identity', 'organization')
   */
  name: string;

  /**
   * Feature display name
   */
  displayName: string;

  /**
   * Base route path (e.g., '/identity')
   */
  basePath: string;

  /**
   * Feature icon name
   */
  icon?: string;

  /**
   * Whether this feature is enabled
   */
  enabled: boolean;

  /**
   * Feature owner/squad
   */
  owner?: string;

  /**
   * List of entities managed by this feature
   */
  entities: string[];

  /**
   * Required permissions to access this feature
   */
  requiredPermissions?: string[];

  /**
   * Required roles to access this feature
   */
  requiredRoles?: string[];

  /**
   * Feature version
   */
  version: string;

  /**
   * Bounded context this feature belongs to
   */
  boundedContext: string;

  /**
   * Dependencies on other features
   */
  dependencies?: string[];
}

// =========================================================================
// MANDATORY FILE CHECKLIST
// =========================================================================

/**
 * Every feature module MUST include these files:
 * 
 * ✅ README.md
 *    - Feature description
 *    - Bounded context it belongs to
 *    - Key entities
 *    - API endpoints used
 *    - External dependencies
 *    - Architecture diagram (Mermaid)
 *    - Traceability link to artefacts
 * 
 * ✅ types/index.ts
 *    - Feature-specific TypeScript types
 *    - Interfaces for entities
 *    - Enums for status/state
 *    - Request/response types
 *    - Derived from artefacts (ERD, API contracts)
 * 
 * ✅ constants.ts
 *    - Feature-specific constants
 *    - Status values
 *    - Default values
 *    - API endpoints
 *    - Message templates
 *    - NO hardcoded strings in components
 * 
 * ✅ pages/
 *    - Page components (container components)
 *    - Connect to routes
 *    - Handle data fetching
 *    - Manage page-level state
 *    - Name: {FeatureNameCamelCase}Page.tsx
 *    - Example: PlayerProfilePage.tsx, TeamsListPage.tsx
 * 
 * ✅ components/
 *    - Reusable UI components (presentational)
 *    - NO business logic
 *    - Accept props for all data
 *    - Composition-based architecture
 *    - Name: {ComponentName}.tsx
 *    - Example: PlayerCard.tsx, TeamSelector.tsx
 * 
 * ✅ hooks/
 *    - Custom React hooks for this feature
 *    - Handle feature-specific logic
 *    - Query hooks (use data)
 *    - Mutation hooks (modify data)
 *    - State management hooks
 *    - Name: use{HookName}.ts
 *    - Example: usePlayer.ts, useTeamMembership.ts
 * 
 * ✅ services/
 *    - Pure business logic (no React/UI code)
 *    - Entity operations
 *    - Business rules
 *    - Calculations
 *    - Transformations
 *    - Name: {entityName}.service.ts
 *    - Example: player.service.ts, team.service.ts
 * 
 * ✅ queries/
 *    - TanStack Query integration
 *    - query-keys.ts: Query key factory
 *    - {entity}.queries.ts: useQuery hooks
 *    - Name: use{EntityName}Query.ts
 *    - Example: usePlayerQuery.ts, useTeamQuery.ts
 * 
 * ✅ mutations/
 *    - TanStack Query mutations
 *    - useMutation hooks for create/update/delete
 *    - Optimistic updates
 *    - Name: use{EntityName}Mutation.ts
 *    - Example: useCreatePlayerMutation.ts
 * 
 * ✅ adapters/
 *    - Transform API responses to DTOs
 *    - Implement APIAdapter<APIResponse, DTO>
 *    - Handle response mapping
 *    - Name: {entity}-api.adapter.ts
 *    - Example: player-api.adapter.ts
 * 
 * ✅ mappers/
 *    - {entity}.mapper.ts: DTO ↔ Domain
 *    - {entity}-view.mapper.ts: Domain → View
 *    - Implement DTOMapper and ViewModelMapper
 *    - Handle entity transformations
 * 
 * ✅ validators/
 *    - Zod schemas for validation
 *    - Form validation schemas
 *    - API request validation
 *    - Name: {entity}.validators.ts
 *    - Export schema registry entries
 * 
 * ✅ routes/
 *    - Feature route definition
 *    - TanStack Router configuration
 *    - Nested routes for feature pages
 *    - Protected routes (auth, permissions)
 *    - Name: {FeatureName}Route.tsx
 *    - Example: IdentityRoute.tsx
 * 
 * ✅ __tests__/ (Optional but recommended)
 *    - Unit tests for components, hooks, services
 *    - Jest + React Testing Library
 *    - Separate test file per source file
 *    - Name: {source}.test.tsx / {source}.test.ts
 * 
 * PROHIBITED FILES:
 * ❌ utils.ts (use shared/utils)
 * ❌ index.ts in feature root (use barrel exports in subfolders)
 * ❌ lib/ (use shared/lib)
 * ❌ styles/ (use Tailwind CSS, not separate stylesheets)
 * ❌ api.ts (use queries/ and mutations/)
 */

// =========================================================================
// SAMPLE FEATURE MODULE CHECKLIST
// =========================================================================

/**
 * EXAMPLE: Identity Feature Module (Use as template for other features)
 * 
 * src/features/identity/
 * ├── README.md
 * ├── types/
 * │   └── index.ts (Player, Guardian, VerificationLevel types)
 * ├── constants.ts (PLAYER_ROLES, VERIFICATION_LEVELS, API endpoints)
 * ├── pages/
 * │   ├── PlayerProfilePage.tsx
 * │   ├── PlayersListPage.tsx
 * │   ├── GuardianConsentPage.tsx
 * │   └── index.ts
 * ├── components/
 * │   ├── PlayerCard.tsx
 * │   ├── PlayerForm.tsx
 * │   ├── VerificationBadge.tsx
 * │   └── index.ts
 * ├── hooks/
 * │   ├── usePlayer.ts
 * │   ├── useGuardianConsent.ts
 * │   └── index.ts
 * ├── services/
 * │   ├── player.service.ts (age calculation, role validation)
 * │   ├── verification.service.ts (verification logic)
 * │   └── index.ts
 * ├── queries/
 * │   ├── query-keys.ts (identityKeys factory)
 * │   ├── player.queries.ts (usePlayerQuery, usePlayersQuery)
 * │   ├── guardian.queries.ts (useGuardianQuery)
 * │   └── index.ts
 * ├── mutations/
 * │   ├── player.mutations.ts (useCreatePlayerMutation, useUpdatePlayerMutation)
 * │   ├── guardian.mutations.ts (useCreateGuardianMutation)
 * │   └── index.ts
 * ├── adapters/
 * │   ├── player-api.adapter.ts (API response → PlayerDTO)
 * │   ├── guardian-api.adapter.ts (API response → GuardianDTO)
 * │   └── index.ts
 * ├── mappers/
 * │   ├── player.mapper.ts (PlayerDTO ↔ Player domain)
 * │   ├── player-view.mapper.ts (Player → PlayerView)
 * │   ├── guardian.mapper.ts (GuardianDTO ↔ Guardian domain)
 * │   └── index.ts
 * ├── validators/
 * │   ├── player.validators.ts (player schema, registration schema)
 * │   ├── guardian.validators.ts (guardian consent schema)
 * │   └── index.ts
 * ├── routes/
 * │   ├── IdentityRoute.tsx (route definition)
 * │   └── index.ts
 * └── __tests__/
 *     ├── PlayerCard.test.tsx
 *     ├── usePlayer.test.ts
 *     ├── player.service.test.ts
 *     └── player.queries.test.ts
 */

// =========================================================================
// FEATURE MODULE INITIALIZATION
// =========================================================================

/**
 * Example of how to initialize a feature module
 * 
 * STEP 1: Define types (types/index.ts)
 * STEP 2: Create services (services/{entity}.service.ts)
 * STEP 3: Create adapters (adapters/{entity}-api.adapter.ts)
 * STEP 4: Create mappers (mappers/{entity}.mapper.ts)
 * STEP 5: Create validators (validators/{entity}.validators.ts)
 * STEP 6: Create queries (queries/{entity}.queries.ts)
 * STEP 7: Create mutations (mutations/{entity}.mutations.ts)
 * STEP 8: Create hooks (hooks/use{Entity}.ts)
 * STEP 9: Create components (components/{Component}.tsx)
 * STEP 10: Create pages (pages/{Page}Page.tsx)
 * STEP 11: Create routes (routes/{Feature}Route.tsx)
 * STEP 12: Write tests (__tests__/)
 * STEP 13: Create README.md with architecture diagram
 * 
 * DEPENDENCY ORDER:
 * types → services → adapters → mappers → validators →
 * queries → mutations → hooks → components → pages → routes
 */

// =========================================================================
// NAMING CONVENTIONS (MANDATORY)
// =========================================================================

/**
 * FOLDER NAMING:
 * - kebab-case (lowercase with hyphens)
 * - Example: identity-service, player-profile, team-management
 * 
 * FILE NAMING:
 * - PascalCase for React components: {ComponentName}.tsx
 *   Example: PlayerCard.tsx, TeamSelector.tsx
 * 
 * - camelCase for non-component files: {fileName}.ts
 *   Example: player.service.ts, use-player.ts, player-api.adapter.ts
 * 
 * - camelCase with "use" prefix for hooks: use{HookName}.ts
 *   Example: usePlayer.ts, useTeamMembership.ts
 * 
 * - camelCase for utilities: {utilName}.ts
 *   Example: formatDate.ts, calculateAge.ts
 * 
 * EXPORT NAMING:
 * - Components: export default PlayerCard
 * - Hooks: export function usePlayer() {}
 * - Services: export class PlayerService {}
 * - Functions: export function getPlayer() {}
 * - Types: export interface Player {}
 * - Enums: export enum PlayerRole {}
 * 
 * INDEX FILES:
 * - Re-export all public items from index.ts
 * - Example: export * from './player-card'
 * - Import order: components, hooks, services, types
 * 
 * CASE CONVERSION:
 * - camelCase → PascalCase: usePlayer → UsePlayer (not used, keep functions camelCase)
 * - Path → camelCase: /my-feature/my-hook.ts → import { useMyHook } from '~/features/myFeature/hooks'
 */

// =========================================================================
// PROHIBITED PATTERNS (VIOLATIONS = ARCHITECTURE FAILURE)
// =========================================================================

/**
 * ❌ DO NOT DO:
 * 
 * 1. Business logic in components
 *    ✅ Correct: Move to services/ or hooks/
 *    ❌ Wrong: const [user, setUser] = useState(); fetch(`/api/users/${id}`);
 * 
 * 2. Hardcoded strings in components
 *    ✅ Correct: constants.PLAYER_ROLES
 *    ❌ Wrong: if (role === 'player')
 * 
 * 3. Duplicate validation logic
 *    ✅ Correct: Use validators/{entity}.validators.ts
 *    ❌ Wrong: z.string().email() in components/players, components/admins, etc.
 * 
 * 4. Direct API calls in components
 *    ✅ Correct: Use hooks/ or queries/
 *    ❌ Wrong: fetch('/api/players') in component body
 * 
 * 5. Relative imports >2 levels
 *    ✅ Correct: import { Player } from '~/features/identity/types'
 *    ❌ Wrong: import { Player } from '../../../types'
 * 
 * 6. Shared folders inside feature modules
 *    ✅ Correct: Use src/shared/ for all shared code
 *    ❌ Wrong: src/features/identity/shared/
 * 
 * 7. Multiple responsibility in services
 *    ✅ Correct: player.service.ts handles only player logic
 *    ❌ Wrong: player.service.ts with guardian logic, team logic, etc.
 * 
 * 8. Prop drilling more than 2 levels
 *    ✅ Correct: Use hooks to access data
 *    ❌ Wrong: <Component prop1={data} /> → <SubComponent prop1={prop1} /> → <NestedComponent prop1={prop1} />
 * 
 * 9. Feature modules importing from feature modules
 *    ✅ Correct: features/identity uses shared/ infrastructure
 *    ❌ Wrong: features/organization imports from features/identity directly
 *    NOTE: Only through shared APIs/integrations
 * 
 * 10. Test files in the same folder as source
 *     ✅ Correct: __tests__/ subfolder or .test.ts suffix
 *     ❌ Wrong: player.tsx and player.test.tsx in same folder (unless .test.ts suffix)
 */

// =========================================================================
// DOCUMENTATION TEMPLATE
// =========================================================================

/**
 * README.md TEMPLATE:
 * 
 * # {Feature Name} Feature
 * 
 * ## Overview
 * Brief description of what this feature does.
 * Bounded context: {Identity|Organization|Competition|etc.}
 * 
 * ## Architecture
 * 
 * ```
 * API → Adapter → DTO → Mapper → Domain → Service → Hook → Component
 * ```
 * 
 * ## Entities
 * - {Entity1}: Description
 * - {Entity2}: Description
 * 
 * ## API Endpoints
 * - GET /api/{entities}
 * - GET /api/{entities}/{id}
 * - POST /api/{entities}
 * - PUT /api/{entities}/{id}
 * - DELETE /api/{entities}/{id}
 * 
 * ## Key Files
 * - types/: Entity types
 * - services/: Business logic
 * - queries/: Data fetching
 * - mutations/: Data mutations
 * - components/: UI components
 * 
 * ## External Dependencies
 * - List other features used
 * - List shared infrastructure used
 * 
 * ## Traceability
 * - Derives from: {Artefact References}
 * - Architecture: {ADR References}
 * 
 * ## Status
 * - Version: 1.0
 * - Last Updated: {Date}
 * - Owner: {Squad/Team}
 */

// =========================================================================
// EXPORTS
// =========================================================================

export type { FeatureModuleConfig };

/**
 * This file documents the mandatory feature module structure.
 * Every bounded context (Identity, Organization, Competition, Referee,
 * Finance, Medical, Match, Tournament, Education) MUST follow this exactly.
 * 
 * Deviations from this structure are architecture failures.
 * Strict compliance ensures consistency across all 8+ bounded contexts.
 */
