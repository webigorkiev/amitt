export declare type EventType = string|number|symbol;
export declare type Handler = (...args: Array<any>) => any|Promise<any>;

/**
 * @package @jwn-js/amitt
 * @class AsyncEvents
 * @description async events bus
 */
export class AmittEmitter {

    /**
     * Map of events
     * @type {Map<number|string|symbol, Set<Function>>}
     */
    #events = new Map();

    /**
     * Register an event handler for given type
     * @param type - type of event
     * @param handler - fantion handler
     * @returns {boolean} if handler has been adding
     */
    on(type: EventType, handler: Handler): boolean {
        const handlers = this.#events.get(type) || new Set();
        const size = handlers.size;
        handlers.add(handler);
        this.#events.set(type, handlers);

        return size !== handlers.size;
    }

    /**
     * Remove an event handler for given type
     * @param type - event type
     * @param handler handler
     * @returns {boolean} - is handler has been removed
     */
    off(type: EventType, handler: Handler): boolean {
        const handlers = this.#events.get(type);

        if(handlers) {

            if(handler) {
                const isDeleted = handlers.delete(handler);

                if(handlers.size === 0) {
                    this.#events.delete(type);
                } else {
                    this.#events.set(type, handlers);
                }

                return isDeleted;
            } else {

                return this.#events.delete(type);
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
        const handlers = this.#events.get(type);

        if(!handlers) {

            return responses;
        }

        for(const handler of handlers) {
            responses.push(handler(...args));
        }

        return responses;
    }
}

/**
 * Export AmittEmitter instance as result of function
 */
export const amitt = () => new AmittEmitter();
export default amitt;