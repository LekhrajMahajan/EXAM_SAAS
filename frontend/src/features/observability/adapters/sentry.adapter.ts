import type { IObservabilityAdapter, LogLevel } from '../types/observability.types';

/**
 * Placeholder Sentry Adapter implementation
 */
export class SentryAdapter implements IObservabilityAdapter {
  initialize() {
    // Sentry.init({ dsn: '...', environment: 'production' })
  }

  captureException(error: Error, context?: Record<string, any>) {
    // Sentry.captureException(error, { extra: context });
  }

  captureMessage(message: string, level: LogLevel, context?: Record<string, any>) {
    // Sentry.captureMessage(message, level);
  }

  startTransaction(name: string, operation: string) {
    // return Sentry.startTransaction({ name, op: operation });
  }

  setTag(key: string, value: string) {
    // Sentry.setTag(key, value);
  }

  setUser(user: any) {
    // Sentry.setUser({ id: user.id, email: user.email });
  }
}
