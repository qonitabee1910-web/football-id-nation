import idIdStrings from "./id-ID.json";

type Strings = typeof idIdStrings;
type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & (string | number)]: T[K] extends object
        ? `${K}.${NestedKeyOf<T[K]>}`
        : `${K}`;
    }[keyof T & (string | number)]
  : never;

export type I18nKey = NestedKeyOf<Strings>;

const STRINGS: Strings = idIdStrings as Strings;

function resolvePath(obj: unknown, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof current === "string" ? current : undefined;
}

export function t(key: I18nKey, fallback?: string): string {
  const resolved = resolvePath(STRINGS, key);
  if (resolved !== undefined) return resolved;
  if (fallback !== undefined) return fallback;
  return key;
}
