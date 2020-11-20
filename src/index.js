import Roles from './Roles/Controller.js';
import Users from './Users/Controller.js';
import '@scanex/notify/dist/notify.css';
import Notify from '@scanex/notify';
import './index.css';
import './icons.css';
import 'strings.js';

export default class Admin {
    constructor({container}) {
        this._container = container; 
        this._container.classList.add('scanex-forestry-admin');
        this._notify = new Notify();
        this._roles = new Roles({container: this._container, notify: this._notify, path: '/adm'});
        this._users = new Users({container: this._container, notify: this._notify, path: '/adm'});
    }
    close() {
        this._container.innerHTML = '';
    }
    async roles() {
        await this._roles.open();
    }
    async users() {
        await this._users.open();
    }
};