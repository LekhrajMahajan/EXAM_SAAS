/**
 * Exposes generic environment and browser information useful for attaching to error logs.
 */
export const getEnvironmentDiagnostics = () => {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: (navigator as any).platform || 'unknown',
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
    deviceMemory: (navigator as any).deviceMemory || 'unknown',
    appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
    mode: import.meta.env.MODE,
  };
};
