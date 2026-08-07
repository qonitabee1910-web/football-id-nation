type LogContext = Record<string, unknown>;

interface LogEntry {
  level: "debug" | "info" | "warn" | "error";
  message: string;
  timestamp: number;
  context?: LogContext;
}

const isBrowser = typeof window !== "undefined";

function formatEntry(entry: LogEntry): string {
  const ts = new Date(entry.timestamp).toISOString();
  const ctx = entry.context ? ` ${JSON.stringify(entry.context)}` : "";
  return `[${ts}] [${entry.level.toUpperCase()}] ${entry.message}${ctx}`;
}

function log(level: LogEntry["level"], message: string, context?: LogContext): void {
  const entry: LogEntry = {
    level,
    message,
    timestamp: Date.now(),
    context,
  };

  const formatted = formatEntry(entry);

  switch (level) {
    case "debug":
      if (isBrowser && localStorage.getItem("LOG_DEBUG") === "1") {
        console.debug(formatted);
      }
      break;
    case "info":
      console.info(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    case "error":
      console.error(formatted);
      break;
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) => log("debug", message, context),
  info: (message: string, context?: LogContext) => log("info", message, context),
  warn: (message: string, context?: LogContext) => log("warn", message, context),
  error: (message: string, error?: unknown, context?: LogContext) => {
    const enriched: LogContext = { ...context };
    if (error instanceof Error) {
      enriched.errorName = error.name;
      enriched.errorMessage = error.message;
      enriched.errorStack = error.stack;
    } else if (error !== undefined) {
      enriched.error = error;
    }
    log("error", message, Object.keys(enriched).length > 0 ? enriched : undefined);
  },
};
