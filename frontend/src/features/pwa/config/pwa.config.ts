export const PWA_CONFIG = {
  syncInterval: 5 * 60 * 1000, // 5 minutes
  maxRetries: 3,
  weakNetworkThreshold: 1500, // ms latency threshold
  queues: {
    sync: 'examguard-sync-queue',
    mutations: 'examguard-mutation-queue',
  }
};
