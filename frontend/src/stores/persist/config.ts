import type { PersistOptions } from 'zustand/middleware';

export const createPersistConfig = <T>(name: string, version = 1): PersistOptions<T> => ({
  name: `examguard-${name}-store`, // unique name for localStorage key
  version, // to handle migrations in the future
});
