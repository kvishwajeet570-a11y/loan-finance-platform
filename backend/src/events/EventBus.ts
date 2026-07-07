import { EventEmitter } from "events";

/* ========================================
   EVENT BUS
======================================== */

class EventBus extends EventEmitter {
  constructor() {
    super();

    this.setMaxListeners(100);
  }

  emitEvent(event: string, payload?: any): void {
    this.emit(event, payload);
  }

  subscribe(
    event: string,
    listener: (...args: any[]) => void
  ): void {
    this.on(event, listener);
  }

  unsubscribe(
    event: string,
    listener: (...args: any[]) => void
  ): void {
    this.off(event, listener);
  }
}

/* ========================================
   SINGLETON INSTANCE
======================================== */

export const eventBus = new EventBus();

export default eventBus;