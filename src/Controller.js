import EventTarget from '@scanex/event-target';
import T from '@scanex/translations';

const translate = T.getText.bind(T);

const NOTIFY_TIMEOUT = 5000;

export default class Controller extends EventTarget {
    constructor({notify}) {
        super();
        this._notify = notify;        
    }
    _status(response) {
        switch (response.status) {
            case 200:
                return response.json();
            case 401:
                this._notify.error(translate('error.unauthorized'), NOTIFY_TIMEOUT);
                return;
            case 403:
                this._notify.error(translate('error.forbidden'), NOTIFY_TIMEOUT);
                return;
            case 404:
                this._notify.error(translate('error.notfound'), NOTIFY_TIMEOUT);
                return;
            case 500:
                this._notify.error(translate('error.server'), NOTIFY_TIMEOUT);
                return;
            case 502:
                this._notify.error(translate('error.gateway'), NOTIFY_TIMEOUT);
                return;
            case 503:
                this._notify.error(translate('error.unavailable'), NOTIFY_TIMEOUT);
                return;
            default:
                this._notify.error(translate('error.other'), NOTIFY_TIMEOUT);
                return;
        }
    }
    _start() {
        let event = document.createEvent('Event');
        event.initEvent('load:start', false, false);
        this.dispatchEvent(event);
    } 
    _stop() {
        let event = document.createEvent('Event');
        event.initEvent('load:stop', false, false);
        this.dispatchEvent(event);
    }
    httpPost (url, options) {
        return new Promise(resolve => {
            this._start();
            fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(options)
            })
            .then(this._status.bind(this))
            .then(data => {
                this._stop();
                resolve(data);
            })
            .catch(e => {
                this._stop();
                resolve();
            });            
        });           
    }    

    postData(url, fd) {
        return new Promise(resolve => {
            this._start();
            fetch(url, {
                method: 'POST',
                credentials: 'include',            
                body: fd
            })
            .then(this._status.bind(this))
            .then(data => {
                this._stop();
                resolve(data);
            })
            .catch(e => {
                this._stop();
                resolve();
            });            
        }); 
    }

    httpGet(url, options = {}) {        
        return new Promise(resolve => {
            this._start();
            const args = Object.keys(options);
            fetch(`${args.length > 0 ? `${url}?${args.map(k => `${k}=${options[k]}`).join('&')}` : url}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },            
            })
            .then(this._status.bind(this))
            .then(data => {
                this._stop();
                resolve(data);
            })
            .catch(e => {
                this._stop();
                resolve();
            });
        });
    }  
};