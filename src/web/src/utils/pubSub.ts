type EventCallback = (...args: any[]) => void
export default class Pubsub {
    private events: { [key: string]: EventCallback[] };
    constructor() {
        this.events = {};
    }

    subscription= (eventName: string, func: (...args: any[]) => void) =>{
        const subscribe = ()=>this.subscribe(eventName, func);
        const unsubscribe = ()=>this.unsubscribe(eventName, func);
        return {
            subscribe,
            unsubscribe
        }
    }

    subscribe = (eventName: string, func: (...args: any[]) => void) => {
        if (this.events[eventName]) {
            this.events[eventName].push(func);
            console.log(`${func.name} has subscribed to ${eventName} Topic!`)
        } else {
            this.events[eventName] = [func];
            console.log(`${func.name} has subscribed to ${eventName} Topic!`)
        }
    };

    unsubscribe= (eventName: string, func: (...args: any[]) => void) => {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter((subscriber) => subscriber !== func);
            console.log(`${func.name} has unsubscribed from ${eventName} Topic!`)
        }
    }

    publish(eventName: string, ...args: any[]) {
        const funcs = this.events[eventName];
        if (Array.isArray(funcs)) {
            funcs.forEach((func) => {
                func.apply(null, args);
            });
        }
    }
}