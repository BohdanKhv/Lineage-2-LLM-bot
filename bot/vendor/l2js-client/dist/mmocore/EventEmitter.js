"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventEmitter {
    constructor() {
        this._eventHandlers = {};
    }
    on(type, handler) {
        if (!type || !handler)
            return false;
        let handlers = this._eventHandlers[type];
        if (!handlers)
            handlers = this._eventHandlers[type] = [];
        if (handlers.length > 10)
            console.warn(`Possible EventEmitter memory leak detected. There are registered ${handlers.length} events for "${type}"`);
        if (handlers.indexOf(handler) >= 0)
            return false;
        handler._once = false;
        handlers.push(handler);
        return true;
    }
    once(type, handler) {
        if (!type || !handler)
            return false;
        const ret = this.on(type, handler);
        if (ret) {
            handler._once = true;
        }
        return ret;
    }
    off(type, handler) {
        if (!type)
            return this.offAll();
        if (!handler) {
            this._eventHandlers[type] = [];
            return;
        }
        const handlers = this._eventHandlers[type];
        if (!handlers || !handlers.length)
            return;
        for (let i = 0; i < handlers.length; i++) {
            const fn = handlers[i];
            if (fn === handler) {
                handlers.splice(i, 1);
                break;
            }
        }
    }
    onAll(handler) {
        return this.on("*", handler);
    }
    offAll() {
        this._eventHandlers = {};
    }
    fire(type, data) {
        var _a, _b;
        if (!type)
            return;
        let handlers = (_a = this._eventHandlers[type]) !== null && _a !== void 0 ? _a : [];
        const allHandlers = (_b = this._eventHandlers["*"]) !== null && _b !== void 0 ? _b : [];
        if (allHandlers && allHandlers.length)
            handlers = handlers.concat(allHandlers);
        if (!handlers.length)
            return;
        const event = this.createEvent(type, data);
        for (const handler of handlers) {
            const once = (event.once = handler._once === true);
            handler(event);
            if (once)
                setTimeout(this.off.bind(this), 0, type, handler);
        }
    }
    has(type, handler) {
        if (!type)
            return false;
        const handlers = this._eventHandlers[type];
        if (!handlers || !handlers.length)
            return false;
        if (!handler)
            return true;
        return handlers.indexOf(handler) >= 0;
    }
    getHandlers(type) {
        if (!type)
            return [];
        return this._eventHandlers[type] || [];
    }
    createEvent(type, data, once = false) {
        const event = { type, data, once };
        return event;
    }
}
exports.default = EventEmitter;
