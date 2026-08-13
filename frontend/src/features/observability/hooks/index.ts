export { useLogger } from '../providers/ObservabilityProvider';

import { Tracer } from '../tracing/tracer';
import { HealthMonitor } from '../health/healthMonitor';

export const useTracing = () => {
  return { startSpan: Tracer.startSpan };
};

export const useHealth = () => {
  return { 
    checkStorage: HealthMonitor.checkStorageHealth,
    checkApi: HealthMonitor.checkApiHealth
  };
};

export const useAnalytics = () => {
  return {
    trackPageView: (page: string) => { /* Placeholder */ },
    trackEvent: (event: string, properties?: any) => { /* Placeholder */ }
  };
};
