import Roles from './Roles/Controller.js';
import '@scanex/notify/dist/notify.css';
import Notify from '@scanex/notify';
import './index.css';
import './icons.css';
import 'strings.js';

export default class Admin {
    constructor({container}) {
        this._container = container;
        this._controllers = {};
        this._notify = new Notify();
        this._controllers.roles = new Roles({container: this._container, notify: this._notify, path: '/adm'});
    }
    close() {
        this._container.innerHTML = '';
    }
    async roles() {
        await this._controllers.roles.open();
    }    
};