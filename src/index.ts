export declare type EventType = string|number|symbol|RegExp;
export declare type Handler = (...args: Array<any>) => any|Promise<any>;

/**
 * @package @jwn-js/amitt
 * @class AsyncEvents
 * @description async events bus
 */
class AmittEmitter {

    /**
     * Events that marks as once execute count
     */
    #once = new Map();

    /**
     * Map of events
     */
    #events = new Map();

    /**
     * Set event that invoke only one time
     * @param type
     * @param handler
     * @returns is handler added
     */
    once(type: EventType, handler: Handler): boolean {

        return this.#addHandler(this.#once, type, handler);
    }

    /**
     * Register an event handler for given type
     * @param type - type of event
     * @param handler - fantion handler
     * @returns  if handler has been adding
     */
    on(type: EventType, handler: Handler): boolean {

        return this.#addHandler(this.#events, type, handler);
    }

    /**
     * Add handler to store
     * @param store
     * @param type
     * @param handler
     */
    #addHandler(store: Map<EventType, Set<Handler>>, type: EventType, handler: Handler): boolean {
        const handlers = store.get(type) || new Set();
        const size = handlers.size;
        handlers.add(handler);
        store.set(type, handlers);

        return size !== handlers.size;
    }

    /**
     * Remove an event handler for given type
     * @param type - event type
     * @param handler handler
     * @returns - is handler has been removed
     */
    off(type: EventType, handler: Handler): boolean {
        for(const store of [this.#events, this.#once]) {
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
    emit(type: EventType, ...args: Array<any>): Array<any> {
        const responses: any[] = [];
        for(const store of [this.#events, this.#once])  {
            const isOnce = store === this.#once;
            const handlersMap = new Map();

            if(type instanceof RegExp) {

                for(const key of store.keys()) {
                   if(type.test(key)) {
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
}
export const amitt = () => new AmittEmitter();
export type {AmittEmitter};