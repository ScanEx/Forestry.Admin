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
		this._pageSize = 20;		
    }
    async open(userID) {
		const logConstants = await this.httpGet(`${this._path}/Log/GetLogsConstants`);
		if (logConstants) {
			this._userID = userID || '';
			this._container.innerHTML = '';
			this._view = new View(this._container, {...logConstants, userID: this._userID, pageSize: this._pageSize});
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

			this._view
			.on('find', async e => {
				this._userID = e.detail;
				await this._loadRoles(1);
				await this._loadInfo(1);
			})
			.on('roles:change', async e => {				
				await this._loadRoles(e.detail);
			})
			.on('info:change', async e => {				
				await this._loadInfo(e.detail);
			});

			

			await this._loadRoles(1);
			await this._loadInfo(1);
		}
    }
	async _loadRoles (start) {
		const userRolesLog = await this.httpGet(`${this._path}/Log/GetUserRolesLog?UserID=${this._userID}&StartPoint=${start}&SizeList=${this._pageSize}`);
		if (userRolesLog) {
			const {count, userRolesLogList} = userRolesLog;				
			this._view.rolePages = Math.floor (count / this._pageSize) + (count % this._pageSize ? 1 : 0);
			this._view.roles = userRolesLogList;
		}
	}
	async _loadInfo (start) {
		const userInfoLog = await this.httpGet(`${this._path}/Log/GetUserLog?UserID=${this._userID}&StartPoint=${start}&SizeList=${this._pageSize}`);
		if (userInfoLog) {
			const {count, userLogList} = userInfoLog;				
			this._view.infoPages = Math.floor (count / this._pageSize) + (count % this._pageSize ? 1 : 0);
			this._view.info = userLogList;
		}
	}
}