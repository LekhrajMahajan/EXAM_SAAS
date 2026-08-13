export const observabilityConfig = {
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
  enableSentry: import.meta.env.VITE_ENABLE_SENTRY === 'true',
  enableDatadog: import.meta.env.VITE_ENABLE_DATADOG === 'true',
  sampleRate: 0.1, // Trace 10% of transactions by default
  performance: {
    captureWebVitals: true,
    reportLongTasks: true,
  }
};
