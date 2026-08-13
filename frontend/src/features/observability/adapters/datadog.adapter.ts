import type { IObservabilityAdapter, LogLevel } from '../types/observability.types';

/**
 * Placeholder Datadog RUM Adapter implementation
 */
export class DatadogAdapter implements IObservabilityAdapter {
  initialize() {
    // datadogRum.init({ applicationId: '...', clientToken: '...' })
  }

  captureException(error: Error, context?: Record<string, any>) {
    // datadogRum.addError(error, context);
  }

  captureMessage(message: string, level: LogLevel, context?: Record<string, any>) {
    // datadogLogs.logger.log(message, context, level);
  }

  startTransaction(name: string, operation: string) {
    // return datadogRum.startAction(name);
  }

  setTag(key: string, value: string) {
    // datadogRum.addGlobalContext(key, value);
  }

  setUser(user: any) {
    // datadogRum.setUser({ id: user.id });
  }
}
