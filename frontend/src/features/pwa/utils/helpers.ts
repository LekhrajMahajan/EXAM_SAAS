export const isBrowserOffline = () => !navigator.onLine;

export const isStandalone = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
};
