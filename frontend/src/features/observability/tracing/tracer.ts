/**
 * Placeholder for Distributed Tracing (e.g. OpenTelemetry Spans, Sentry Transactions)
 */
export class Tracer {
  public static startSpan(name: string, op: string) {
    // return ApplicationLogger.adapters.startTransaction(name, op);
    return {
      finish: () => { /* end span */ }
    };
  }
}
