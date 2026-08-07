import { Suspense, useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { useDelayedShow } from "@/hooks/use-delayed-show";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface LoadingBoundaryProps {
  children: ReactNode;
  skeletonElement?: ReactElement;
  pendingMs?: number;
  minMs?: number;
  className?: string;
}

function DefaultSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("w-full", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="space-y-4">
        <Skeleton className="h-10 w-2/5" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-4 w-9/12" />
        </div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

function DelayedFallback({
  skeleton,
  pendingMs,
  minMs,
  className,
  onMounted,
}: {
  skeleton?: ReactElement;
  pendingMs: number;
  minMs: number;
  className?: string;
  onMounted: (time: number) => void;
}) {
  const show = useDelayedShow(true, { pendingMs, minMs });

  useEffect(() => {
    onMounted(Date.now());
  }, [onMounted]);

  if (!show) return null;

  return skeleton ?? <DefaultSkeleton className={className} />;
}

function ResolvedSignal({ onResolved }: { onResolved: () => void }) {
  useEffect(() => {
    onResolved();
  }, [onResolved]);
  return null;
}

export function LoadingBoundary({
  children,
  skeletonElement,
  pendingMs = 150,
  minMs = 400,
  className,
}: LoadingBoundaryProps) {
  const fallbackMountedAt = useRef<number | null>(null);
  const minShowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [forceShow, setForceShow] = useState(false);

  const handleFallbackMounted = (time: number) => {
    if (minShowTimer.current !== null) {
      clearTimeout(minShowTimer.current);
      minShowTimer.current = null;
    }
    fallbackMountedAt.current = time;
  };

  const handleChildrenResolved = () => {
    const mountedAt = fallbackMountedAt.current;
    fallbackMountedAt.current = null;

    if (mountedAt === null) {
      if (forceShow) setForceShow(false);
      return;
    }

    const elapsed = Date.now() - mountedAt;
    const remaining = minMs - elapsed;

    if (remaining > 0) {
      setForceShow(true);
      if (minShowTimer.current !== null) {
        clearTimeout(minShowTimer.current);
      }
      minShowTimer.current = setTimeout(() => {
        setForceShow(false);
        minShowTimer.current = null;
      }, remaining);
    } else if (forceShow) {
      setForceShow(false);
    }
  };

  useEffect(() => {
    return () => {
      if (minShowTimer.current !== null) {
        clearTimeout(minShowTimer.current);
        minShowTimer.current = null;
      }
    };
  }, []);

  const fallback = (
    <DelayedFallback
      skeleton={skeletonElement}
      pendingMs={pendingMs}
      minMs={minMs}
      className={className}
      onMounted={handleFallbackMounted}
    />
  );

  return (
    <>
      <Suspense fallback={fallback}>
        <ResolvedSignal onResolved={handleChildrenResolved} />
        {children}
      </Suspense>
      {forceShow && (skeletonElement ?? <DefaultSkeleton className={className} />)}
    </>
  );
}
