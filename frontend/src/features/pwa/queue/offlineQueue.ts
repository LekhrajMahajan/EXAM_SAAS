import type { SyncPayload } from '../types/pwa.types';

/**
 * Placeholder queue designed to back up failed TanStack Mutations offline.
 */
export class OfflineQueue {
  private queueName: string;

  constructor(queueName: string) {
    this.queueName = queueName;
  }

  public async push(payload: SyncPayload) {
    // Save to IndexedDB
  }

  public async getQueue(): Promise<SyncPayload[]> {
    // Read from IndexedDB
    return [];
  }

  public async clear() {
    // Clear from IndexedDB
  }
}
