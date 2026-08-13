import type { NetworkStatus } from '../types/pwa.types';

export class NetworkManager {
  private static status: NetworkStatus = navigator.onLine ? 'online' : 'offline';
  private static listeners: Set<(status: NetworkStatus) => void> = new Set();

  public static initialize() {
    window.addEventListener('online', () => this.updateStatus('online'));
    window.addEventListener('offline', () => this.updateStatus('offline'));
    // Weak network detection would go here (e.g., using navigator.connection or ping latency)
  }

  private static updateStatus(newStatus: NetworkStatus) {
    this.status = newStatus;
    this.listeners.forEach(listener => listener(newStatus));
  }

  public static subscribe(listener: (status: NetworkStatus) => void) {
    this.listeners.add(listener);
    listener(this.status);
    return () => this.listeners.delete(listener);
  }

  public static getStatus() {
    return this.status;
  }
}
