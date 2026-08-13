/**
 * Placeholder queue mechanism for offline events.
 * Will store events locally when disconnected and flush them upon reconnect.
 */
export class OfflineQueue {
  private queue: Array<{ event: string; payload: any }> = [];

  public enqueue(event: string, payload: any) {
    this.queue.push({ event, payload });
  }

  public flush(socket: any) {
    if (!socket || !socket.connected) return;
    
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        socket.emit(item.event, item.payload);
      }
    }
  }

  public clear() {
    this.queue = [];
  }

  public get size() {
    return this.queue.length;
  }
}

export const offlineQueue = new OfflineQueue();
