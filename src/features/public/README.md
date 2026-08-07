/**
 * IDN-UI-GEN-002: PUBLIC EXPERIENCE ARCHITECTURE
 * 
 * DERIVED FROM:
 * - IDN-PRD-001 (Product Requirements)
 * - IDN-SCR-001 (Screen Catalogue - SCR-PUB-01 to 04)
 * - IDN-JRN-001 (Business Journeys)
 * - IDN-API-001 (API Contracts)
 * - IDN-DS-001 (Design System)
 * - CONSENT-001 (Child Protection)
 * - ADR-0001, ADR-0002, ADR-0003
 * 
 * SCOPE: Public Experience ONLY (SCR-PUB-01, 02, 03, 04)
 * - NO authenticated modules
 * - NO dashboard pages
 * - NO player/guardian/organization screens
 * - NO competition module
 * - NO business logic
 * - NO mock data
 * - NO undocumented fields
 * 
 * STATUS: Sprint 2 Implementation
 * 
 * =========================================================================
 * PUBLIC FEATURE MODULE STRUCTURE
 * =========================================================================
 * 
 * src/features/public/
 * ├── types/
 * │   └── index.ts                 (Public feature types only)
 * ├── constants.ts                 (Routes, labels, API endpoints)
 * ├── components/
 * │   ├── HeroBanner.tsx
 * │   ├── FeatureCard.tsx
 * │   ├── StatisticCard.tsx
 * │   ├── PartnerLogo.tsx
 * │   ├── FAQAccordion.tsx
 * │   ├── PublicNavbar.tsx
 * │   ├── PublicFooter.tsx
 * │   ├── AuthCard.tsx
 * │   ├── FormSection.tsx
 * │   ├── SectionTitle.tsx
 * │   ├── CTAButton.tsx
 * │   └── LanguageSwitcher.tsx (TODO: i18n support)
 * ├── pages/
 * │   ├── LandingPage.tsx          (SCR-PUB-01)
 * │   ├── LoginPage.tsx            (SCR-PUB-02)
 * │   ├── RegisterPage.tsx         (SCR-PUB-03)
 * │   └── ForgotPasswordPage.tsx   (SCR-PUB-04)
 * ├── validators/
 * │   └── auth.validators.ts       (Login, Register, Recovery schemas)
 * ├── routes/
 * │   └── PublicRoutes.tsx         (Route definitions)
 * ├── hooks/
 * │   ├── useAuthMutation.ts       (Login mutation)
 * │   ├── useRegisterMutation.ts   (Register mutation)
 * │   └── useRecoveryMutation.ts   (Forgot password mutation)
 * ├── services/
 * │   └── public.service.ts        (Public data fetching - landing stats)
 * └── README.md
 * 
 * =========================================================================
 * APPROVED SCREENS
 * =========================================================================
 * 
 * SCR-PUB-01: Landing Page
 *   - Hero banner with value prop
 *   - Platform benefits
 *   - Key features
 *   - Statistics section
 *   - Partner section
 *   - FAQ
 *   - CTA to login/register
 *   - Footer with legal links
 *   - Dark mode support
 *   - Responsive (375, 768, 1024, 1440, 1920)
 * 
 * SCR-PUB-02: Login
 *   - Email input
 *   - Password input
 *   - Remember me checkbox
 *   - Forgot password link
 *   - Login button
 *   - Loading state
 *   - Error display
 *   - Keyboard navigation
 *   - Accessibility: form labels, error announcements
 * 
 * SCR-PUB-03: Register
 *   - Role selection (Player, Guardian, Organization, Association)
 *   - Progress stepper
 *   - Step 1: Age declaration & base info
 *   - Step 2: Guardian info (if minor)
 *   - Step 3: Consent notice
 *   - Validation per step
 *   - Privacy notice
 *   - Success state
 *   - CONSENT-001 child protection enforced
 * 
 * SCR-PUB-04: Forgot Password / Recovery
 *   - Email input
 *   - Verification flow
 *   - Confirmation message
 *   - Resend option
 *   - Error handling
 *   - Loading states
 * 
 * =========================================================================
 * IMPLEMENTATION CONSTRAINTS
 * =========================================================================
 * 
 * ✓ Use ONLY approved artefacts
 * ✓ NO invented fields or business rules
 * ✓ WCAG 2.1 Level AA accessibility
 * ✓ Keyboard navigation mandatory
 * ✓ 44px touch targets minimum
 * ✓ Respect prefers-reduced-motion
 * ✓ NO hardcoded strings (use constants)
 * ✓ NO relative imports >2 levels
 * ✓ NO mock data or fake statistics
 * ✓ Follow IDN-INFRA-001 patterns
 * ✓ API client integration (no direct fetch)
 * ✓ Error handling via error handler
 * ✓ Validation via shared validators
 * ✓ No sensitive data in logs
 * 
 * =========================================================================
 */

export const PUBLIC_FEATURE_MODULE = 'public' as const;
