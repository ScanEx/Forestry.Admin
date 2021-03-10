import Evented from '@scanex/evented';
import T from '@scanex/translations';

const translate = T.getText.bind(T);

const NOTIFY_TIMEOUT = 5000;

class Controller extends Evented {
    constructor({notify, loading}) {
        super();
        this._notify = notify;  
        this._loading = loading;      
    }
    _status(jsonResponse, response) {
        switch (response.status) {
            case 200:                            
                return jsonResponse ? response.json() : true;
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
        this._loading.start();
    } 
    _stop() {
        this._loading.stop();
    }
    httpPost (url, options, jsonResponse = true) {
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
            .then(this._status.bind(this, jsonResponse))
            .then(data => {
                this._stop();
                resolve(data);
            })
            .catch(e => {
                this._stop();
                resolve(false);
            });            
        });           
    }    

    postData(url, fd, jsonResponse = true) {
        return new Promise(resolve => {
            this._start();
            fetch(url, {
                method: 'POST',
                credentials: 'include',            
                body: fd
            })
            .then(this._status.bind(this, jsonResponse))
            .then(data => {
                this._stop();
                resolve(data);
            })
            .catch(e => {
                this._stop();
                resolve(false);
            });            
        }); 
    }

    httpGet(url, options = {}, jsonResponse = true) {
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
            .then(this._status.bind(this, jsonResponse))
            .then(data => {
                this._stop();
                resolve(data || true);
            })
            .catch(e => {
                this._stop();
                resolve(false);
            });
        });
    }  
}

export {Controller, NOTIFY_TIMEOUT};