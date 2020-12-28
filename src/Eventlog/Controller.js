import View from './View.js';
import {Controller, NOTIFY_TIMEOUT} from 'Controller.js';
import T from '@scanex/translations';

const translate = T.getText.bind(T);

export default class Eventlog extends Controller {
    constructor({container, notify, loading, path}) {
        super({notify, loading});
        this._notify = notify;
        this._path = path;
        this._container = container;
        this._shelfLife = 2;
        this._versionCounts = 3;
    }
    async open() {
		const data = await this.httpGet(`${this._path}/Log/GetLogsConstants`);

		this._container.innerHTML = '';
		this._view = new View(this._container, data);
		this._view.on('save', async e => {
			const ok = await this.httpPost(`${this._path}/Log/UpdateLogsConstants`, e.detail);
			if (!ok) {
				let event = document.createEvent('Event');
				event.initEvent('eventlog:save', false, false);
				this.dispatchEvent(event);
				this._notify.info(translate('info.ok'), NOTIFY_TIMEOUT);
			}
		});
		this._view.on('cancel', e => {
			let event = document.createEvent('Event');
			event.initEvent('close', false, false);            
			this.dispatchEvent(event);
		});            
    }
}