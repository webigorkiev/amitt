export declare type EventType = string | number | symbol | RegExp;
export declare type Handler = (...args: Array<any>) => any | Promise<any>;
/**
 * @package @jwn-js/amitt
 * @class AsyncEvents
 * @description async events bus
 */
declare class AmittEmitter {
    #private;
    /**
     * Set event that invoke only one time
     * @param type
     * @param handler
     * @returns is handler added
     */
    once(type: EventType, handler: Handler): boolean;
    /**
     * Register an event handler for given type
     * @param type - type of event
     * @param handler - fantion handler
     * @returns  if handler has been adding
     */
    on(type: EventType, handler: Handler): boolean;
    /**
     * Remove an event handler for given type
     * @param type - event type
     * @param handler handler
     * @returns - is handler has been removed
     */
    off(type: EventType, handler: Handler): boolean;
    /**
     * Invoke all handlers for given type
     * @param type event type
     * @param args event argiments
     * @returns array of responses handlers, it can be Promise
     */
    emit(type: EventType, ...args: Array<any>): Array<any>;
}
export declare const amitt: () => AmittEmitter;
export default amitt;
export type { AmittEmitter };
