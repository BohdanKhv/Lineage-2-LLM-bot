export type EventHandler = ((evt: Event) => void) & {
    _once?: boolean;
};
export interface Event {
    type: string;
    data: any;
    once: boolean;
}
export default class EventEmitter {
    _eventHandlers: Record<string, EventHandler[] | undefined>;
    on(type: string, handler: EventHandler): boolean;
    once(type: string, handler: EventHandler): boolean;
    off(type?: string, handler?: EventHandler): void;
    onAll(handler: EventHandler): boolean;
    offAll(): void;
    fire(type: string, data?: Record<string, unknown>): void;
    has(type: string, handler?: EventHandler): boolean;
    getHandlers(type: string): any[];
    createEvent(type: string, data?: Record<string, unknown>, once?: boolean): Event;
}
