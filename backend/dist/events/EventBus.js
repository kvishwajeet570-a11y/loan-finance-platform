"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventBus = void 0;
const events_1 = require("events");
/* ========================================
   EVENT BUS
======================================== */
class EventBus extends events_1.EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(100);
    }
    emitEvent(event, payload) {
        this.emit(event, payload);
    }
    subscribe(event, listener) {
        this.on(event, listener);
    }
    unsubscribe(event, listener) {
        this.off(event, listener);
    }
}
/* ========================================
   SINGLETON INSTANCE
======================================== */
exports.eventBus = new EventBus();
exports.default = exports.eventBus;
