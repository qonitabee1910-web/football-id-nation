import { useEffect, useRef, useState } from "react";

export interface UseDelayedShowOptions {
  pendingMs?: number;
  minMs?: number;
  disableReducedMotion?: boolean;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function useDelayedShow(
  isPending: boolean,
  options: UseDelayedShowOptions = {},
): boolean {
  const { pendingMs = 150, minMs = 400, disableReducedMotion = false } = options;

  const [shouldShow, setShouldShow] = useState<boolean>(false);
  const showStartedAt = useRef<number | null>(null);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minShowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reducedMotion = disableReducedMotion ? false : prefersReducedMotion();
  const effectivePendingMs = reducedMotion ? 0 : pendingMs;
  const effectiveMinMs = reducedMotion ? 0 : minMs;

  useEffect(() => {
    const clearPending = () => {
      if (pendingTimer.current !== null) {
        clearTimeout(pendingTimer.current);
        pendingTimer.current = null;
      }
    };

    const clearMinShow = () => {
      if (minShowTimer.current !== null) {
        clearTimeout(minShowTimer.current);
        minShowTimer.current = null;
      }
    };

    if (isPending) {
      clearMinShow();
      clearPending();
      pendingTimer.current = setTimeout(() => {
        showStartedAt.current = Date.now();
        setShouldShow(true);
      }, effectivePendingMs);
    } else {
      clearPending();
      if (showStartedAt.current !== null) {
        const elapsed = Date.now() - showStartedAt.current;
        const remaining = effectiveMinMs - elapsed;
        if (remaining > 0) {
          minShowTimer.current = setTimeout(() => {
            showStartedAt.current = null;
            setShouldShow(false);
          }, remaining);
        } else {
          showStartedAt.current = null;
          setShouldShow(false);
        }
      } else {
        setShouldShow(false);
      }
    }

    return () => {
      clearPending();
      clearMinShow();
    };
  }, [isPending, effectivePendingMs, effectiveMinMs]);

  return shouldShow;
}
