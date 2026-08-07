/**
 * IDN-UI-GEN-001: SPRINT 0 TYPE DEFINITIONS
 * 
 * Derives from:
 * - CONSENT-001 (Guardian/Player types)
 * - IDN-PRD-001 (User roles)
 * - IDN-ERD-001 (Entities)
 * - IDN-DMN-001 (Domain model)
 * 
 * Traceability: All types derive from approved data models
 */

// =============================================================================
// AUTHENTICATION & IDENTITY
// =============================================================================

export type UserRole = 
  | 'player'
  | 'guardian'
  | 'coach'
  | 'club_admin'
  | 'verification_authority'
  | 'association_officer'
  | 'data_steward'
  | 'privacy_officer'
  | 'child_protection_officer'
  | 'federation_officer'
  | 'system';

export type PlayerAgeGroup = 'child' | 'adult';

export interface AuthSession {
  id: string;
  personId: string;
  footballId: string;
  email: string;
  roles: UserRole[];
  primaryRole: UserRole;
  ageGroup: PlayerAgeGroup;
  isVerified: boolean;
  hasActiveConsent: boolean;
  expiresAt: Date;
  refreshToken: string;
}

export interface User {
  id: string;
  footballId: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  ageGroup: PlayerAgeGroup;
  roles: UserRole[];
  primaryRole: UserRole;
  isVerified: boolean;
  verificationLevel: VerificationLevel;
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// VERIFICATION (IDN-DMN-001, VerificationPolicy)
// =============================================================================

export type VerificationLevel = 'L0' | 'L1' | 'L2' | 'L3';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface VerificationState {
  level: VerificationLevel;
  status: VerificationStatus;
  requestedAt?: Date;
  completedAt?: Date;
  rejectionReason?: string;
}

// =============================================================================
// MEMBERSHIP (ADR-0003: Membership Model)
// =============================================================================

export type MembershipType = 'primary' | 'secondary';
export type MembershipStatus = 'active' | 'pending' | 'inactive' | 'transferred';

export interface Membership {
  id: string;
  personId: string;
  organizationId: string;
  organizationName: string;
  type: MembershipType;
  status: MembershipStatus;
  createdAt: Date;
  updatedAt: Date;
  endedAt?: Date;
}

// =============================================================================
// CONSENT (CONSENT-001)
// =============================================================================

export type ConsentPurpose = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7' | 'P8';
export type ConsentState = 'granted' | 'revoked' | 'pending';

export interface ConsentRecord {
  purposeId: ConsentPurpose;
  state: ConsentState;
  grantedAt?: Date;
  revokedAt?: Date;
  policyVersion: string;
}

export interface ConsentProfile {
  personId: string;
  consents: Map<ConsentPurpose, ConsentRecord>;
  lastUpdatedAt: Date;
  isGuardianControlled: boolean; // true if person is minor
}

// =============================================================================
// NAVIGATION & UI STATE
// =============================================================================

export type NavigationArea = 
  | 'public'
  | 'player'
  | 'guardian'
  | 'organization'
  | 'association'
  | 'federation'
  | 'system';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Breadcrumb {
  label: string;
  href: string;
  current: boolean;
}

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // auto-dismiss in ms, 0 = persistent
  action?: {
    label: string;
    onClick: () => void;
  };
}

// =============================================================================
// API CONTRACTS (IDN-API-001)
// =============================================================================

export interface ApiErrorResponse {
  code: string;
  message: string;
  field?: string;
  policyVersion?: string;
  correlationId: string;
  timestamp: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
}

// =============================================================================
// SCREEN-LEVEL STATE (IDN-SCR-001)
// =============================================================================

export interface ScreenContext {
  screenId: string;
  navigationArea: NavigationArea;
  primaryActor: UserRole;
  supportingActors: UserRole[];
  journeyId: string;
  isLoading: boolean;
  isError: boolean;
  error?: ApiErrorResponse;
  breadcrumbs: Breadcrumb[];
}

export interface LayoutVariant {
  type: 'public' | 'authenticated' | 'dashboard' | 'empty' | 'error';
  requiresAuth: boolean;
  requiredRoles?: UserRole[];
  showNavigation: boolean;
  showSidebar: boolean;
  showHeader: boolean;
}

// =============================================================================
// CHILD PROTECTION RULES (Constitution Article 0, STK-INV-*)
// =============================================================================

export interface ChildProtectionContext {
  isMinor: boolean;
  requiresGuardianConsent: boolean;
  guardianId?: string;
  isGuardianApprovalPending: boolean;
  dataMinimizationApplied: boolean;
  maskedFields: Set<string>;
}

// =============================================================================
// ACCESSIBILITY CONTRACTS (WCAG 2.1 AA, IDN-DS-001)
// =============================================================================

export interface AccessibilityAttributes {
  role?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaLive?: 'polite' | 'assertive';
  ariaExpanded?: boolean;
  ariaPressed?: boolean;
  ariaSelected?: boolean;
}

// =============================================================================
// FORM STATE (React Hook Form + Zod)
// =============================================================================

export interface FormFieldError {
  field: string;
  message: string;
  code: string;
}

export interface FormState {
  isDirty: boolean;
  isSubmitting: boolean;
  isValidating: boolean;
  errors: FormFieldError[];
  submitCount: number;
}

// =============================================================================
// RESPONSIVE CONTEXT (IDN-DS-001)
// =============================================================================

export type BreakpointName = 'mobile' | 'tablet' | 'desktop' | 'wide';

export interface ResponsiveContext {
  breakpoint: BreakpointName;
  viewport: {
    width: number;
    height: number;
  };
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
}

// =============================================================================
// EXPORT TYPE GUARDS
// =============================================================================

export const isPlayerRole = (role: UserRole): role is 'player' => role === 'player';
export const isGuardianRole = (role: UserRole): role is 'guardian' => role === 'guardian';
export const isOrgRole = (role: UserRole): role is 'club_admin' | 'coach' => 
  role === 'club_admin' || role === 'coach';
export const isAssocRole = (role: UserRole): role is 'association_officer' | 'data_steward' | 'verification_authority' =>
  role === 'association_officer' || role === 'data_steward' || role === 'verification_authority';
export const isFedRole = (role: UserRole): role is 'federation_officer' | 'privacy_officer' | 'child_protection_officer' =>
  role === 'federation_officer' || role === 'privacy_officer' || role === 'child_protection_officer';
