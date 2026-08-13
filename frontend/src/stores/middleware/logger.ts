import type { StateCreator } from 'zustand';

// Placeholder logger middleware for debugging state in development
export const loggerImpl = <T>(
  config: StateCreator<T, [], []>
): StateCreator<T, [], []> => (set, get, api) =>
  config(
    (...args) => {
      // console.log('  applying', args)
      (set as any)(...args);
      // console.log('  new state', get())
    },
    get,
    api
  );

export const logger = loggerImpl as unknown as any;
