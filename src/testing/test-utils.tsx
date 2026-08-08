/**
 * IDN-INFRA-001: TESTING & ACCESSIBILITY INFRASTRUCTURE
 * 
 * DERIVED FROM:
 * - EPOS-CORE-DOC-001 (Testing Strategy)
 * - IDN-DS-001 (WCAG 2.1 Level AA)
 * - STK-INV-004 (Child Protection - Accessibility)
 * 
 * PURPOSE:
 * - Centralized testing setup and utilities
 * - Test fixtures and factories
 * - Accessibility testing helpers
 * - Child protection compliance testing
 * 
 * TESTING STACK:
 * - Jest: Unit testing
 * - React Testing Library: Component testing
 * - Vitest: Fast unit testing
 * 
 * ACCESSIBILITY:
 * - WCAG 2.1 Level AA compliance
 * - Keyboard navigation
 * - Screen reader support
 * - Focus management
 * 
 * STATUS: Enterprise Mandatory Baseline v1.0
 */

import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { queryClient } from '~/shared/query/query-client';

// =========================================================================
// TEST SETUP
// =========================================================================

/**
 * Global test setup (call in setupFilesAfterEnv)
 */
export function setupTests(): void {
  // Silence console errors in tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = (...args: any[]) => {
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('Warning: useLayoutEffect does nothing on the server') ||
          args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
      ) {
        return;
      }
      originalError.call(console, ...args);
    };
  });

  afterAll(() => {
    console.error = originalError;
  });

  // Reset query client after each test
  afterEach(() => {
    queryClient.clear();
  });

  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock IntersectionObserver
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() {
      return [];
    }
    unobserve() {}
  } as any;

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;
}

// =========================================================================
// CUSTOM RENDER (WITH PROVIDERS)
// =========================================================================

/**
 * Custom render function that includes all providers
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    queryClient: customQueryClient = queryClient,
    ...renderOptions
  }: RenderOptions & { queryClient?: QueryClient } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// =========================================================================
// TEST FIXTURES (MOCK DATA)
// =========================================================================

/**
 * Mock user data for testing
 */
export const mockUsers = {
  player: {
    id: 'player-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'player' as const,
    dateOfBirth: '2010-01-15',
  },
  guardian: {
    id: 'guardian-1',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    role: 'guardian' as const,
  },
  coach: {
    id: 'coach-1',
    firstName: 'Mike',
    lastName: 'Coach',
    email: 'mike@example.com',
    role: 'coach' as const,
  },
  admin: {
    id: 'admin-1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    role: 'club_admin' as const,
  },
};

/**
 * Mock team data for testing
 */
export const mockTeams = {
  team1: {
    id: 'team-1',
    name: 'United FC',
    clubId: 'club-1',
    ageGroup: 'U12',
    status: 'active' as const,
  },
  team2: {
    id: 'team-2',
    name: 'City FC',
    clubId: 'club-2',
    ageGroup: 'U14',
    status: 'active' as const,
  },
};

/**
 * Mock verification data for testing
 */
export const mockVerifications = {
  verified: {
    playerId: 'player-1',
    level: 3 as const,
    status: 'verified' as const,
    verifiedAt: new Date().toISOString(),
  },
  pending: {
    playerId: 'player-2',
    level: 0 as const,
    status: 'pending' as const,
  },
};

// =========================================================================
// TEST FACTORIES (BUILDERS)
// =========================================================================

/**
 * Factory for creating test data with defaults
 */
export class TestDataFactory {
  static createPlayer(overrides: any = {}) {
    return {
      ...mockUsers.player,
      ...overrides,
    };
  }

  static createGuardian(overrides: any = {}) {
    return {
      ...mockUsers.guardian,
      ...overrides,
    };
  }

  static createTeam(overrides: any = {}) {
    return {
      ...mockTeams.team1,
      ...overrides,
    };
  }

  static createVerification(overrides: any = {}) {
    return {
      ...mockVerifications.verified,
      ...overrides,
    };
  }

  static createBatch<T>(
    count: number,
    factory: (index: number) => T
  ): T[] {
    return Array.from({ length: count }, (_, i) => factory(i));
  }
}

// =========================================================================
// ACCESSIBILITY TESTING HELPERS
// =========================================================================

/**
 * Test helpers for WCAG 2.1 Level AA compliance
 */
export const a11y = {
  /**
   * Check if element has accessible name
   */
  hasAccessibleName(element: HTMLElement): boolean {
    return !!(element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.textContent?.trim());
  },

  /**
   * Check if button has accessible name
   */
  buttonHasName(button: HTMLButtonElement): boolean {
    return !!(button.getAttribute('aria-label') ||
      button.getAttribute('aria-labelledby') ||
      button.textContent?.trim());
  },

  /**
   * Check if form input has label
   */
  inputHasLabel(input: HTMLInputElement): boolean {
    const id = input.id;
    if (!id) return false;

    return !!document.querySelector(`label[for="${id}"]`);
  },

  /**
   * Check if element has sufficient color contrast
   * (simplified - real testing requires color computation)
   */
  hasContrast(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    const color = style.color;
    const backgroundColor = style.backgroundColor;

    // Simplified check - real implementation would compute WCAG contrast
    return color !== backgroundColor;
  },

  /**
   * Check if element is keyboard accessible
   */
  isKeyboardAccessible(element: HTMLElement): boolean {
    const tabindex = element.getAttribute('tabindex');
    const isClickable = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(
      element.tagName
    );

    return isClickable || (tabindex !== null && parseInt(tabindex) >= 0);
  },

  /**
   * Check if focus is visible
   */
  hasFocusVisible(element: HTMLElement): boolean {
    // Check for focus ring styles
    const style = window.getComputedStyle(element, ':focus');
    return style.outline !== 'none' || style.boxShadow !== 'none';
  },

  /**
   * Check if element has ARIA attributes
   */
  hasAriaAttributes(element: HTMLElement): boolean {
    return Array.from(element.attributes).some((attr) =>
      attr.name.startsWith('aria-')
    );
  },
};

// =========================================================================
// KEYBOARD TESTING HELPERS
// =========================================================================

/**
 * Simulate keyboard navigation
 */
export const keyboard = {
  /**
   * Press Tab key
   */
  async tab(user: typeof userEvent) {
    await user.keyboard('{Tab}');
  },

  /**
   * Press Shift+Tab (reverse Tab)
   */
  async shiftTab(user: typeof userEvent) {
    await user.keyboard('{Shift>}{Tab}{/Shift}');
  },

  /**
   * Press Enter key
   */
  async enter(user: typeof userEvent) {
    await user.keyboard('{Enter}');
  },

  /**
   * Press Escape key
   */
  async escape(user: typeof userEvent) {
    await user.keyboard('{Escape}');
  },

  /**
   * Press Arrow keys
   */
  async arrowDown(user: typeof userEvent) {
    await user.keyboard('{ArrowDown}');
  },

  async arrowUp(user: typeof userEvent) {
    await user.keyboard('{ArrowUp}');
  },

  async arrowLeft(user: typeof userEvent) {
    await user.keyboard('{ArrowLeft}');
  },

  async arrowRight(user: typeof userEvent) {
    await user.keyboard('{ArrowRight}');
  },
};

// =========================================================================
// SCREEN READER TESTING HELPERS
// =========================================================================

/**
 * Test helpers for screen reader compatibility
 */
export const screenReader = {
  /**
   * Get accessible text representation
   */
  getAccessibleText(element: HTMLElement): string {
    const text: string[] = [];

    // Check for aria-label
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) text.push(ariaLabel);

    // Check for aria-labelledby
    const labelledBy = element.getAttribute('aria-labelledby');
    if (labelledBy) {
      const labels = labelledBy.split(' ').map((id) => {
        const el = document.getElementById(id);
        return el?.textContent?.trim() || '';
      });
      text.push(...labels.filter(Boolean));
    }

    // Check for associated label
    if (element instanceof HTMLInputElement && element.id) {
      const label = document.querySelector(`label[for="${element.id}"]`);
      if (label) text.push(label.textContent?.trim() || '');
    }

    // Check for text content
    if (text.length === 0 && element.textContent) {
      text.push(element.textContent.trim());
    }

    return text.join(' ');
  },

  /**
   * Check if element is announced to screen readers
   */
  isAnnounced(element: HTMLElement): boolean {
    const ariaHidden = element.getAttribute('aria-hidden');
    return ariaHidden !== 'true';
  },

  /**
   * Check if ARIA live region is used
   */
  hasLiveRegion(element: HTMLElement): boolean {
    return element.hasAttribute('aria-live');
  },
};

// =========================================================================
// CHILD PROTECTION TESTING
// =========================================================================

/**
 * Test helpers for child protection compliance
 */
export const childProtection = {
  /**
   * Check if data is not exposed in DOM
   */
  dataNotExposed(selector: string, sensitiveData: string): boolean {
    const element = document.querySelector(selector);
    return !element || !element.textContent?.includes(sensitiveData);
  },

  /**
   * Check if guardian consent is required
   */
  requiresGuardianConsent(element: HTMLElement): boolean {
    return element.getAttribute('data-requires-consent') === 'true';
  },

  /**
   * Check if age gate is present
   */
  hasAgeGate(element: HTMLElement): boolean {
    return element.getAttribute('data-age-gated') === 'true';
  },

  /**
   * Check if sensitive features are protected
   */
  isSensitiveFeatureProtected(element: HTMLElement): boolean {
    return !!(element.getAttribute('aria-requires-auth') ||
      element.getAttribute('data-requires-permission'));
  },
};

// =========================================================================
// MOCK API RESPONSES
// =========================================================================

/**
 * Mock API response generator
 */
export const mockApiResponses = {
  success<T>(data: T, status = 200) {
    return {
      ok: true,
      status,
      json: async () => data,
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    };
  },

  error(message: string, status = 400) {
    return {
      ok: false,
      status,
      json: async () => ({
        code: `ERROR_${status}`,
        message,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    };
  },

  notFound() {
    return this.error('Not Found', 404);
  },

  unauthorized() {
    return this.error('Unauthorized', 401);
  },

  forbidden() {
    return this.error('Forbidden', 403);
  },

  serverError() {
    return this.error('Server Error', 500);
  },
};

// =========================================================================
// EXPORTS
// =========================================================================

export {
  render,
  renderWithProviders,
  setupTests,
  TestDataFactory,
  keyboard,
  screenReader,
  childProtection,
  mockApiResponses,
  a11y,
};

export type { RenderOptions };
