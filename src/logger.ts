export interface LoggerConfig {
  enableDebug?: boolean;
}

export class Logger {
  private enableDebug: boolean;

  constructor(config: LoggerConfig = {}) {
    this.enableDebug = config.enableDebug ?? false;
  }

  debug(message: string, data?: unknown): void {
    if (!this.enableDebug) return;
    console.log(
      `\x1b[36m[DEBUG]\x1b[0m ${message}`,
      data ? JSON.stringify(data) : ""
    );
  }

  info(message: string, data?: unknown): void {
    console.log(
      `\x1b[32m[INFO]\x1b[0m ${message}`,
      data ? JSON.stringify(data) : ""
    );
  }

  warn(message: string, data?: unknown): void {
    console.log(
      `\x1b[33m[WARN]\x1b[0m ${message}`,
      data ? JSON.stringify(data) : ""
    );
  }

  error(message: string, data?: unknown): void {
    console.log(
      `\x1b[31m[ERROR]\x1b[0m ${message}`,
      data ? JSON.stringify(data) : ""
    );
  }
}

// Global singleton
let globalLogger: Logger | null = null;

export function setGlobalLogger(logger: Logger): void {
  globalLogger = logger;
}

export function getLogger(): Logger {
  if (!globalLogger) {
    globalLogger = new Logger({ enableDebug: false });
  }
  return globalLogger;
}
