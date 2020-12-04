import EventTarget from '@scanex/event-target';

export default class Loading extends EventTarget {
    constructor() {
        super();
    }
    start() {
        let event = document.createEvent('Event');
        event.initEvent('loading:start', false, false);
        this.dispatchEvent(event);
    }
    stop() {
        let event = document.createEvent('Event');
        event.initEvent('loading:stop', false, false);
        this.dispatchEvent(event);
    }
};