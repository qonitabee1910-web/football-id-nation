/**
 * IDN-UI-GEN-002: PUBLIC EXPERIENCE TYPES
 * 
 * DERIVED FROM:
 * - IDN-API-001 (API Contracts)
 * - IDN-CDM-001 (Canonical Data Model)
 * 
 * Approved types ONLY from business artefacts.
 * NO invented fields or business rules.
 * NO mock data.
 */

// =========================================================================
// AUTHENTICATION TYPES (from IDN-API-001)
// =========================================================================

/**
 * Login request (IDN-API-001 Authentication endpoint)
 * Traces to: JRN-17 (Recover Identity), C-18 (RecoverIdentity)
 */
export interface LoginRequest {
  /** Person's identifier (email or Football ID display code) */
  identifier: string;
  /** Authentication secret */
  password: string;
  /** Persist session across browser closes */
  rememberMe?: boolean;
}

/**
 * Login response
 * Traces to: IDN-API-001 Authentication response
 */
export interface LoginResponse {
  /** Session token */
  token: string;
  /** Expiry timestamp */
  expiresAt: string;
  /** Person reference (opaque) */
  personRef: string;
  /** Roles assigned to person */
  roles: string[];
  /** Verification level */
  assuranceLevel: AssuranceLevel;
}

/**
 * Registration request (IDN-API-001 C-01 RegisterPerson)
 * Traces to: JRN-01 Register Person, IDN-PRD-001 FR-01..05
 * 
 * DO NOT invent fields. All fields derive from approved artefacts.
 * Age self-declaration is captured here; guardian info separate.
 */
export interface RegisterPersonRequest {
  /** First name */
  firstName: string;
  /** Last name */
  lastName: string;
  /** Email */
  email: string;
  /** Date of birth (ISO 8601) */
  dateOfBirth: string;
  /** Self-declared age band (affects guardian requirement) */
  ageBand: AgeBand;
  /** Password (validated by approved schema) */
  password: string;
  /** Password confirmation (client-side only) */
  passwordConfirm: string;
}

/**
 * Guardian registration request (IDN-API-001 C-02 RegisterGuardian)
 * Traces to: JRN-02 Register Guardian
 * 
 * Only used when registering a minor player; requires guardian info.
 */
export interface RegisterGuardianRequest {
  /** Guardian first name */
  firstName: string;
  /** Guardian last name */
  lastName: string;
  /** Guardian email */
  email: string;
  /** Guardian phone (for verification) */
  phone?: string;
  /** Guardian relationship to child (parent, legal guardian, etc.) */
  relationship: GuardianRelationship;
  /** Password for guardian account */
  password: string;
  /** Password confirmation */
  passwordConfirm: string;
}

/**
 * Registration response
 * Traces to: IDN-API-001 PersonRegistered event
 */
export interface RegisterResponse {
  /** Person reference (opaque) */
  personRef: string;
  /** Registration status */
  status: 'REGISTERED' | 'PENDING_VERIFICATION';
  /** Message for user */
  message: string;
  /** Next step in journey */
  nextStep: 'VERIFY_EMAIL' | 'GUARDIAN_CONSENT' | 'COMPLETE';
}

/**
 * Password recovery request (IDN-API-001 C-18 RecoverIdentity)
 * Traces to: JRN-17 Recover Identity
 */
export interface RecoveryRequest {
  /** Email or Football ID display code */
  identifier: string;
  /** Recovery method (email, SMS, etc.) */
  method: 'email' | 'security_question';
}

/**
 * Recovery response
 * Traces to: IDN-API-001 IdentityRecoveryRequested event
 */
export interface RecoveryResponse {
  /** Confirmation message */
  message: string;
  /** Where recovery code/link was sent */
  sentTo: string;
  /** Recovery token (for verification step) */
  recoveryToken: string;
  /** Expiry time for recovery (minutes) */
  expiresInMinutes: number;
}

/**
 * Consent acknowledgement
 * Traces to: CONSENT-001, IDN-API-001 C-06 GrantConsent
 */
export interface ConsentAcknowledgement {
  /** Purpose codes from CONSENT-001 P1..P8 */
  purposes: ConsentPurpose[];
  /** Timestamp of acknowledgement */
  acknowledgedAt: string;
}

// =========================================================================
// IDENTITY TYPES (from IDN-CDM-001)
// =========================================================================

/**
 * Age band classification
 * Traces to: IDN-CDM-001 AgeBand, CONSENT-001
 * 
 * Coarse age classification; never the actual date of birth.
 * Determines guardian requirement and consent scope.
 */
export type AgeBand = 'UNDER_13' | 'MINOR_13_17' | 'ADULT';

/**
 * Guardian relationship types
 * Traces to: IDN-CDM-001 GuardianRelationship
 */
export type GuardianRelationship =
  | 'PARENT'
  | 'LEGAL_GUARDIAN'
  | 'GRANDPARENT'
  | 'OTHER';

/**
 * Assurance level (verification result)
 * Traces to: IDN-DMN-001, IDN-CDM-001 AssuranceLevel
 * L0: No verification
 * L1: Basic verification
 * L2: Enhanced verification
 * L3: Strong verification
 */
export type AssuranceLevel = 'L0' | 'L1' | 'L2' | 'L3';

/**
 * Consent purposes (IMMUTABLE)
 * Traces to: CONSENT-001 P1..P8
 * 
 * P1: Use data for this competition only
 * P2: Use photo/statistics for announcements
 * P3: Store development assessments
 * P4: Share with coaching network
 * P5: Analyze performance trends
 * P6: Include in talent visibility (13+)
 * P7: Share with federation
 * P8: Use for research (anonymized)
 */
export type ConsentPurpose =
  | 'P1_COMPETITION_ONLY'
  | 'P2_ANNOUNCEMENTS'
  | 'P3_ASSESSMENTS'
  | 'P4_COACHING_NETWORK'
  | 'P5_PERFORMANCE_ANALYSIS'
  | 'P6_TALENT_VISIBILITY'
  | 'P7_FEDERATION_SHARE'
  | 'P8_RESEARCH';

/**
 * Person lifecycle states
 * Traces to: IDN-DMN-001, IDN-PRD-001 FR-LFC
 */
export type PersonLifecycleState =
  | 'REGISTERED'
  | 'VERIFIED'
  | 'ACTIVE'
  | 'TEMPORARILY_INACTIVE'
  | 'ARCHIVED'
  | 'MERGED';

// =========================================================================
// UI COMPONENT TYPES
// =========================================================================

/**
 * Form field state
 */
export interface FormFieldState {
  value: string;
  error?: string;
  isDirty: boolean;
  isTouched: boolean;
}

/**
 * Form submission state
 */
export interface FormSubmissionState {
  isLoading: boolean;
  error?: string;
  isSuccess: boolean;
  successMessage?: string;
}

/**
 * Registration wizard state
 */
export interface RegistrationWizardState {
  currentStep: 1 | 2 | 3;
  playerData: Partial<RegisterPersonRequest>;
  guardianData?: Partial<RegisterGuardianRequest>;
  consentData?: ConsentAcknowledgement;
  isCompleted: boolean;
}

/**
 * Login form state
 */
export interface LoginFormState {
  identifier: string;
  password: string;
  rememberMe: boolean;
  errors: {
    identifier?: string;
    password?: string;
  };
}

// =========================================================================
// ERROR TYPES
// =========================================================================

/**
 * Public-facing error messages
 * Traces to: IDN-API-001 Error Consistency, IDN-DS-001
 */
export interface PublicErrorDisplay {
  /** User-friendly title */
  title: string;
  /** Detailed message */
  message: string;
  /** Field-specific error (if applicable) */
  fieldError?: string;
  /** Error code for recovery */
  errorCode: string;
  /** Suggested action */
  actionLabel?: string;
  /** Is retry possible */
  isRetryable: boolean;
}

// =========================================================================
// NAVIGATION TYPES
// =========================================================================

/**
 * Public navigation item
 */
export interface PublicNavItem {
  label: string;
  href: string;
  icon?: string;
  description?: string;
}

/**
 * Page metadata for SEO
 * Traces to: IDN-FE-001 SEO requirements
 */
export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export const PUBLIC_TYPES = {
  AgeBand: 'UNDER_13 | MINOR_13_17 | ADULT',
  AssuranceLevel: 'L0 | L1 | L2 | L3',
  ConsentPurpose: 'P1_COMPETITION_ONLY | P2_ANNOUNCEMENTS | ... (P1..P8)',
  PersonLifecycleState:
    'REGISTERED | VERIFIED | ACTIVE | TEMPORARILY_INACTIVE | ARCHIVED | MERGED',
};
