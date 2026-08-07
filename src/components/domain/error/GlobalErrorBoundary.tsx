import { Component, type ErrorInfo, type ReactNode } from "react";
import { UnifiedNotFound } from "./UnifiedNotFound";
import { logger } from "@/lib/observability/logger";

const TRACE_ID_PATTERN = /\[traceId:([a-f0-9-]{8,64})\]/i;

export interface GlobalErrorBoundaryState {
  error: Error | null;
  traceId: string | null;
}

export interface GlobalErrorBoundaryProps {
  children: ReactNode;
  isStructural?: boolean;
  fallback?: ReactNode;
}

function extractTraceId(message: string): string | null {
  const match = message.match(TRACE_ID_PATTERN);
  return match ? match[1] : null;
}

export class GlobalErrorBoundary extends Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  public state: GlobalErrorBoundaryState = {
    error: null,
    traceId: null,
  };

  public static getDerivedStateFromError(error: Error): GlobalErrorBoundaryState {
    return {
      error,
      traceId: extractTraceId(error.message),
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const traceId = this.state.traceId ?? extractTraceId(error.message);
    logger.error(
      "GlobalErrorBoundary caught unhandled error",
      error,
      {
        traceId,
        componentStack: errorInfo.componentStack,
        boundary: "global",
      },
    );
  }

  private handleReset = (): void => {
    const { isStructural } = this.props;
    if (isStructural) {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
      return;
    }
    this.setState({ error: null, traceId: null });
  };

  private handleBackHome = (): void => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  public render(): ReactNode {
    const { error, traceId } = this.state;
    const { children, fallback, isStructural } = this.props;

    if (error === null) {
      return children;
    }

    if (fallback !== undefined) {
      return fallback;
    }

    return (
      <div data-trace-id={traceId ?? undefined} className="min-h-screen w-full bg-background">
        <UnifiedNotFound
          variant="404"
          onBackHome={this.handleBackHome}
          onTryAgain={isStructural ? this.handleBackHome : this.handleReset}
        />
      </div>
    );
  }
}
