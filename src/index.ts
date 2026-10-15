export declare type EventType = string | number | symbol | RegExp;

// async events bus
class AmittEmitter<
    Keys extends EventType = any,
    Events extends Map<string, Set<any>> = Map<string, Set<any>>
> {
    private onceEvents = new Map() as Events;
    private events = new Map() as Events;

    // Set an event that invokes only one time
    once<U extends any[] = [], V = any>(
        type: string,
        handler: (...args: [...U, {type: Keys, once: boolean}]) => V | Promise<V>
    ): boolean {
        return this.addHandler<U, V>(this.onceEvents, type, handler);
    }

    // Register an event handler for a given type
    on<U extends any[] = [], V = any>(
        type: string,
        handler: (...args: [...U, {type: Keys, once: boolean}]) => V | Promise<V>
    ): boolean {
        return this.addHandler<U, V>(this.events, type, handler);
    }

    // Remove an event handler for a given type
    off<U = any>(
        type: string,
        handler?: U
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

    // Invoke all handlers for a given type
    // emit('test-event');
    // ответы handlers склаываются в responses
    emit<U extends any[] = [], V extends any[] = any[]>(
        type: Keys, // {key: Keys, immediate?: boolean}
        ...args: U
    ): V {
        const responses = [] as any;
        for(const store of [this.events, this.onceEvents]) { // Обходит карту событий и крту одноразовых собитй
            const isOnce = store === this.onceEvents;
            const handlersMap = new Map(); // store handlers by type
            if(type instanceof RegExp) {
                for(const key of store.keys()) {
                    if(type.test(key as string)) {
                        handlersMap.set(key, store.get(key));
                    }
                }
            } else {
                handlersMap.set(type, store.get(String(type)));
            }
            for(const key of handlersMap.keys()) { // exec by handlers map
                const handlers = handlersMap.get(key);
                if(!handlers || !handlers.size) {
                    continue;
                }
                for(const handler of handlers) {
                    const opt:{type: Keys, once: boolean} = {
                        type: key,
                        once: isOnce
                    };
                    responses.push(handler(...args, opt));
                    if(isOnce) {
                        handlers.delete(handler);
                    }
                }
                if(isOnce) { // if once store
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

    // TODO
    // pause
    // emit // Отложенный emit пока не будет выполнен // immediate // Добавить опцию
    // resume

    // Add handler to store
    private addHandler< U extends any[], V>(
        store: Events,
        type: string,
        handler: (...args: [...U, {type: Keys, once: boolean}]) => V | Promise<V>
    ): boolean {
        const handlers = store.get(type) || new Set();
        const size = handlers.size;
        handlers.add(handler);
        store.set(type, handlers);
        return size !== handlers.size;
    }
}

export const amitt = <
    Keys extends EventType,
    Events extends Map<string, Set<any>> = Map<string, Set<any>>
>() => new AmittEmitter<Keys, Events>();
export type {AmittEmitter};