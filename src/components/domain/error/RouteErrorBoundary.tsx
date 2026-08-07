import { Component, type ErrorInfo, type ReactNode } from "react";
import { UnifiedNotFound } from "./UnifiedNotFound";
import { logger } from "@/lib/observability/logger";

const TRACE_ID_PATTERN = /\[traceId:([a-f0-9-]{8,64})\]/i;

export interface RouteErrorBoundaryState {
  error: Error | null;
  traceId: string | null;
}

export interface RouteErrorBoundaryProps {
  children: ReactNode;
  appShell?: ReactNode;
  isStructural?: boolean;
  fallback?: ReactNode;
  onReset?: () => void;
}

function extractTraceId(message: string): string | null {
  const match = message.match(TRACE_ID_PATTERN);
  return match ? match[1] : null;
}

export class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  public state: RouteErrorBoundaryState = {
    error: null,
    traceId: null,
  };

  public static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return {
      error,
      traceId: extractTraceId(error.message),
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const traceId = this.state.traceId ?? extractTraceId(error.message);
    logger.error(
      "RouteErrorBoundary caught route subtree error",
      error,
      {
        traceId,
        componentStack: errorInfo.componentStack,
        boundary: "route",
      },
    );
  }

  private handleReset = (): void => {
    const { isStructural, onReset } = this.props;
    if (isStructural) {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
      return;
    }
    if (onReset) {
      onReset();
    }
    this.setState({ error: null, traceId: null });
  };

  private handleBackHome = (): void => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  private renderFallback(): ReactNode {
    const { error, traceId } = this.state;
    const { fallback, isStructural } = this.props;

    if (fallback !== undefined) {
      return <div data-trace-id={traceId ?? undefined}>{fallback}</div>;
    }

    return (
      <div data-trace-id={traceId ?? undefined} className="min-h-0 w-full flex-1">
        <UnifiedNotFound
          variant="404"
          onBackHome={this.handleBackHome}
          onTryAgain={isStructural ? this.handleBackHome : this.handleReset}
        />
      </div>
    );
  }

  public render(): ReactNode {
    const { error } = this.state;
    const { children, appShell } = this.props;

    if (error === null) {
      return children;
    }

    if (appShell !== undefined) {
      return <>{appShell}{this.renderFallback()}</>;
    }

    return this.renderFallback();
  }
}
