/**
 * IDN-INFRA-001: VALIDATION LAYER (ZOD)
 * 
 * DERIVED FROM:
 * - EPOS-CORE-DOC-001 (Validation Architecture)
 * - IDN-API-001 (Data Contracts)
 * - Lovable Cloud (Database Schema)
 * 
 * PURPOSE:
 * Centralized validation schemas and patterns using Zod.
 * Every form, API request, and database operation validated through here.
 * 
 * RESPONSIBILITIES:
 * - Zod schema definitions (shared)
 * - Field-level validators
 * - Error message mapping
 * - Validation composition
 * - Form validation helpers
 * 
 * ARCHITECTURE:
 * Every feature module extends from this base.
 * No business validation logic - only infrastructure.
 * 
 * STATUS: Enterprise Mandatory Baseline v1.0
 */

import { z, ZodError, ZodSchema } from 'zod';

// =========================================================================
// COMMON FIELD VALIDATORS
// =========================================================================

/**
 * Reusable field validators for common patterns
 */
export const validators = {
  /**
   * Email validation
   */
  email: z.string().email('Invalid email address').min(1, 'Email is required'),

  /**
   * Password validation
   * Requirements:
   * - At least 8 characters
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   * - At least one special character
   */
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[!@#$%^&*]/, 'Password must contain a special character (!@#$%^&*)')
    .max(128, 'Password must be less than 128 characters'),

  /**
   * Username validation
   * Pattern: alphanumeric + underscore/hyphen
   */
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(32, 'Username must be less than 32 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),

  /**
   * Phone number validation (Indonesian format)
   * Accepts: +62, 0, or ()
   */
  phone: z
    .string()
    .regex(
      /^(?:\+62|0)[0-9]{9,12}$/,
      'Invalid phone number format'
    ),

  /**
   * URL validation
   */
  url: z.string().url('Invalid URL'),

  /**
   * UUID validation
   */
  uuid: z.string().uuid('Invalid UUID format'),

  /**
   * ID validation (can be string or number)
   */
  id: z.union([z.string().min(1), z.number().positive()]),

  /**
   * Date validation
   */
  date: z.coerce.date(),

  /**
   * ISO date string validation
   */
  isoDate: z.string().datetime('Invalid date format (use ISO 8601)'),

  /**
   * Percentage (0-100)
   */
  percentage: z.number().min(0).max(100),

  /**
   * Positive number
   */
  positiveNumber: z.number().positive(),

  /**
   * Non-negative number
   */
  nonNegativeNumber: z.number().nonnegative(),

  /**
   * Slug validation (URL-friendly)
   */
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),

  /**
   * Gender
   */
  gender: z.enum(['male', 'female', 'other']),

  /**
   * Role
   */
  role: z.enum(['player', 'guardian', 'coach', 'club_admin', 'federation_officer', 'system']),
};

// =========================================================================
// COMMON SCHEMAS
// =========================================================================

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

/**
 * List response schema (template)
 */
export const listResponseSchema = <T extends ZodSchema>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    hasMore: z.boolean(),
  });

/**
 * Error response schema
 */
export const errorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  status: z.number(),
  details: z.record(z.any()).optional(),
  traceId: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

/**
 * Success response schema (template)
 */
export const successResponseSchema = <T extends ZodSchema>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    status: z.number(),
    timestamp: z.string().datetime(),
  });

// =========================================================================
// VALIDATION ERROR MAPPING
// =========================================================================

/**
 * Map Zod errors to user-friendly messages
 */
export interface ValidationError {
  field: string;
  message: string;
}

export function mapValidationErrors(error: ZodError): ValidationError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: mapErrorMessage(issue),
  }));
}

/**
 * Map individual Zod error to message
 */
function mapErrorMessage(issue: z.ZodIssue): string {
  if (issue.message) {
    return issue.message;
  }

  switch (issue.code) {
    case 'invalid_type':
      return `Expected ${issue.expected}, got ${issue.received}`;

    case 'invalid_enum_value':
      return `Must be one of: ${(issue as any).options.join(', ')}`;

    case 'invalid_string':
      switch ((issue as any).validation) {
        case 'email':
          return 'Invalid email address';
        case 'url':
          return 'Invalid URL';
        case 'uuid':
          return 'Invalid UUID';
        case 'datetime':
          return 'Invalid date/time format';
        case 'regex':
          return 'Invalid format';
        default:
          return 'Invalid string format';
      }

    case 'too_small':
      return `Must be at least ${(issue as any).minimum}`;

    case 'too_big':
      return `Must be at most ${(issue as any).maximum}`;

    case 'not_a_number':
      return 'Must be a number';

    case 'invalid_date':
      return 'Invalid date';

    case 'unrecognized_keys':
      return `Unexpected fields: ${(issue as any).keys.join(', ')}`;

    default:
      return 'Validation error';
  }
}

// =========================================================================
// SCHEMA COMPOSITION HELPERS
// =========================================================================

/**
 * Create a form schema with common fields
 * 
 * USAGE:
 * const createPlayerSchema = z.object({
 *   email: validators.email,
 *   password: validators.password,
 *   firstName: z.string().min(1),
 *   lastName: z.string().min(1),
 *   dateOfBirth: validators.date,
 * });
 */

/**
 * Extend schema with pagination
 */
export function withPagination<T extends ZodSchema>(schema: T) {
  return schema.merge(paginationSchema);
}

/**
 * Make all fields optional (for PATCH requests)
 */
export function makePartial<T extends ZodSchema>(schema: T) {
  if (!(schema instanceof z.ZodObject)) {
    throw new Error('Can only make ZodObject schemas partial');
  }
  return (schema as any).partial();
}

// =========================================================================
// VALIDATION FUNCTIONS
// =========================================================================

/**
 * Validate data against schema
 */
export async function validate<T>(
  schema: ZodSchema,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: ValidationError[] }> {
  try {
    const validated = await schema.parseAsync(data);
    return { success: true, data: validated as T };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, errors: mapValidationErrors(error) };
    }
    throw error;
  }
}

/**
 * Validate data synchronously
 */
export function validateSync<T>(
  schema: ZodSchema,
  data: unknown
): { success: true; data: T } | { success: false; errors: ValidationError[] } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated as T };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, errors: mapValidationErrors(error) };
    }
    throw error;
  }
}

/**
 * Validate and throw on error
 */
export async function validateOrThrow<T>(
  schema: ZodSchema,
  data: unknown
): Promise<T> {
  return schema.parseAsync(data);
}

// =========================================================================
// SCHEMA REGISTRY
// =========================================================================

/**
 * Central registry of all validation schemas in the app.
 * Every feature module registers its schemas here.
 * 
 * USAGE:
 * 
 * // In features/identity/validators/index.ts
 * export const identityValidators = {
 *   createPlayer: z.object({ ... }),
 *   updatePlayer: z.object({ ... }),
 *   playerProfile: z.object({ ... }),
 * };
 * 
 * // Register in schema registry
 * schemaRegistry.register('identity.createPlayer', identityValidators.createPlayer);
 * schemaRegistry.register('identity.updatePlayer', identityValidators.updatePlayer);
 * schemaRegistry.register('identity.playerProfile', identityValidators.playerProfile);
 * 
 * // Use from registry
 * const schema = schemaRegistry.get('identity.createPlayer');
 */

class SchemaRegistry {
  private schemas: Map<string, ZodSchema> = new Map();

  register(key: string, schema: ZodSchema): void {
    if (this.schemas.has(key)) {
      console.warn(`Schema '${key}' already registered, overwriting...`);
    }
    this.schemas.set(key, schema);
  }

  get(key: string): ZodSchema | undefined {
    return this.schemas.get(key);
  }

  getOrThrow(key: string): ZodSchema {
    const schema = this.schemas.get(key);
    if (!schema) {
      throw new Error(`Schema '${key}' not found in registry`);
    }
    return schema;
  }

  list(): { key: string; schema: ZodSchema }[] {
    return Array.from(this.schemas.entries()).map(([key, schema]) => ({
      key,
      schema,
    }));
  }

  clear(): void {
    this.schemas.clear();
  }
}

export const schemaRegistry = new SchemaRegistry();

// =========================================================================
// FORM VALIDATION HELPERS (for React Hook Form)
// =========================================================================

/**
 * Adapt Zod schema for React Hook Form
 * 
 * USAGE:
 * 
 * const form = useForm({
 *   resolver: zodResolver(mySchema),
 * });
 */

export interface FormValidationResult {
  errors: Record<string, { message: string }>;
}

/**
 * Validate form data
 */
export async function validateFormData<T>(
  schema: ZodSchema,
  data: T
): Promise<FormValidationResult> {
  try {
    await schema.parseAsync(data);
    return { errors: {} };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, { message: string }> = {};
      error.issues.forEach((issue) => {
        const field = issue.path.join('.');
        errors[field] = { message: mapErrorMessage(issue) };
      });
      return { errors };
    }
    throw error;
  }
}

// =========================================================================
// EXPORTS
// =========================================================================

export {
  validators,
  paginationSchema,
  listResponseSchema,
  errorResponseSchema,
  successResponseSchema,
  schemaRegistry,
};

export type { ValidationError };
