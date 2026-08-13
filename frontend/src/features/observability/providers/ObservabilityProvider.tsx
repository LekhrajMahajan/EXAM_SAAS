import React, { createContext, useContext, useEffect } from 'react';
import { ApplicationLogger } from '../logging/applicationLogger';
import { SentryAdapter } from '../adapters/sentry.adapter';
import { DatadogAdapter } from '../adapters/datadog.adapter';
import { observabilityConfig } from '../config/observability.config';
import { reportWebVitals } from '../performance/webVitals';

const ObservabilityContext = createContext<{ logger: typeof ApplicationLogger }>({
  logger: ApplicationLogger
});

export const ObservabilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Initialize required adapters on mount based on config
    if (observabilityConfig.enableSentry) {
      const sentry = new SentryAdapter();
      sentry.initialize();
      ApplicationLogger.registerAdapter(sentry);
    }

    if (observabilityConfig.enableDatadog) {
      const datadog = new DatadogAdapter();
      datadog.initialize();
      ApplicationLogger.registerAdapter(datadog);
    }

    // Initialize Performance Monitoring
    if (observabilityConfig.performance.captureWebVitals) {
      reportWebVitals((metric: any) => {
        ApplicationLogger.info('Web Vital Recorded', { metric });
      });
    }
  }, []);

  return (
    <ObservabilityContext.Provider value={{ logger: ApplicationLogger }}>
      {children}
    </ObservabilityContext.Provider>
  );
};

export const useLogger = () => useContext(ObservabilityContext).logger;
