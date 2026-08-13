export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  timestamp: string;
  error?: Error;
}

export interface IObservabilityAdapter {
  initialize(): void;
  captureException(error: Error, context?: Record<string, any>): void;
  captureMessage(message: string, level: LogLevel, context?: Record<string, any>): void;
  startTransaction(name: string, operation: string): any;
  setTag(key: string, value: string): void;
  setUser(user: any): void;
}
