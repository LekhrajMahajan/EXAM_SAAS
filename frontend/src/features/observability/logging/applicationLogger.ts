import { observabilityConfig } from '../config/observability.config';
import type { LogLevel, IObservabilityAdapter } from '../types/observability.types';

/**
 * Singleton Logger orchestrating multiple adapters (e.g., Console, Sentry, Datadog)
 */
class Logger {
  private adapters: IObservabilityAdapter[] = [];
  
  public registerAdapter(adapter: IObservabilityAdapter) {
    this.adapters.push(adapter);
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal'];
    const configLevelIndex = levels.indexOf(observabilityConfig.logLevel as LogLevel);
    const incomingLevelIndex = levels.indexOf(level);
    return incomingLevelIndex >= configLevelIndex;
  }

  public log(level: LogLevel, message: string, context?: Record<string, any>) {
    if (!this.shouldLog(level)) return;

    // Local Console Output (Always present)
    const consoleMethod = level === 'fatal' ? 'error' : level;
    if (console[consoleMethod as keyof Console]) {
      (console as any)[consoleMethod](`[${level.toUpperCase()}] ${message}`, context || '');
    }

    // Push to registered adapters
    this.adapters.forEach(adapter => adapter.captureMessage(message, level, context));
  }

  public info(message: string, context?: Record<string, any>) { this.log('info', message, context); }
  public warn(message: string, context?: Record<string, any>) { this.log('warn', message, context); }
  public error(message: string, context?: Record<string, any>) {
    this.log('error', message, context);
    
    // Specifically route Exceptions
    if (context?.error instanceof Error) {
      this.adapters.forEach(adapter => adapter.captureException(context.error, context));
    }
  }
}

export const ApplicationLogger = new Logger();
