export declare type EventType = string | number | symbol | RegExp;

/**
 * @package @jwn-js/amitt
 * @class AsyncEvents
 * @description async events bus
 */
class AmittEmitter<Events extends Map<EventType, Set<any>>> {
    private onceEvents = new Map() as Events;
    private events = new Map() as Events;

    /**
     * Set event that invoke only one time
     * @param type
     * @param handler
     * @returns is handler added
     */
    once<U extends any[] = [], V = any>(
        type: keyof Events|string,
        handler: (...args: U) => V | Promise<V>
    ): boolean {

        return this.addHandler<U, V>(this.onceEvents, type, handler);
    }

    /**
     * Register an event handler for given type
     * @param type - type of event
     * @param handler - fantion handler
     * @returns  if handler has been adding
     */
    on<U extends any[] = [], V = any>(
        type: keyof Events|string,
        handler: (...args: U) => V | Promise<V>
    ): boolean {

        return this.addHandler<U, V>(this.events, type, handler);
    }

    /**
     * Remove an event handler for given type
     * @param type - event type
     * @param handler handler
     * @returns - is handler has been removed
     */
    off<U = any>(
        type: keyof Events|string,
        handler: U
    ): boolean {
        for(const store of [this.events, this.onceEvents]) {
            const handlers = store.get(type);

            if(handlers) {

                if(handler) {
                    const isDeleted = handlers.delete(handler);

                    if(handlers.size === 0) {
                        store.delete(type);
                    } else {
                        store.set(type, handlers);
                    }

                    return isDeleted;
                } else {

                    return store.delete(type);
                }
            }
        }

        return false;
    }

    /**
     * Invoke all handlers for given type
     * @param type event type
     * @param args event argiments
     * @returns array of responses handlers, it can be Promise
     */
    emit<U extends any[] = [], V extends any[] = []>(
        type: EventType,
        ...args: U
    ): V {
        const responses = [] as any;
        for(const store of [this.events, this.onceEvents]) {
            const isOnce = store === this.onceEvents;
            const handlersMap = new Map();

            if(type instanceof RegExp) {

                for(const key of store.keys()) {
                    if(type.test(key as string)) {
                        handlersMap.set(key, store.get(key));
                    }
                }
            } else {
                handlersMap.set(type, store.get(type));
            }

            for(const key of handlersMap.keys()) {
                const handlers = handlersMap.get(key);

                if(!handlers || !handlers.size) {

                    continue;
                }

                for(const handler of handlers) {
                    responses.push(handler(...args));

                    if(isOnce) {
                        handlers.delete(handler);
                    }
                }

                // if once store
                if(isOnce) {

                    if(handlers.size) {
                        store.set(key, handlers);
                    } else {
                        store.delete(key);
                    }
                }
            }
        }

        return responses;
    }

    /**
     * Add handler to store
     * @param store
     * @param type
     * @param handler
     */
    private addHandler< U extends any[], V>(
        store: Events,
        type: keyof Events|string,
        handler: (...args: U) => V | Promise<V>
    ): boolean {
        const handlers = store.get(type) || new Set();
        const size = handlers.size;
        handlers.add(handler);
        store.set(type, handlers);

        return size !== handlers.size;
    }
}

export const amitt = () => new AmittEmitter();
export type {AmittEmitter};