/**
 * @class AsyncEvents
 * @description async events bus
 */
export default class {

    /**
     * Map of events
     * @type {Map<number|string|symbol, Set<Function>>}
     */
    #events = new Map();

    /**
     * Register an event handler for given type
     * @param {number|string|symbol} type - type of event
     * @param {Function} handler - fantion handler
     * @returns {boolean}
     */
    on(type, handler) {
        const handlers = this.#events.get(type) || new Set();
        const size = handlers.size;
        handlers.add(handler);
        this.#events.set(type, handlers);

        return size === handlers.size;
    }

    /**
     * Remove an event handler for given type
     * @param {number|string|symbol} type
     * @param {Function} handler
     * @returns {boolean}
     */
    off(type, handler) {
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
     * @param {number|string|symbol} type
     * @param {Array} args
     * @returns {Array} - array of responses handlers
     */
    emit(type, ...args) {
        const responses = [];
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