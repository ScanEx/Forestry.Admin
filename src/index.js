import Roles from './Roles/Controller.js';
import Users from './Users/Controller.js';
import User from './User/Controller.js';
import '@scanex/notify/dist/notify.css';
import Notify from '@scanex/notify';
import './index.css';
import './icons.css';
import 'strings.js';

export default class Admin {
    constructor(container, {path} = {path: '/adm'}) {
        this._container = container; 
        this._container.classList.add('scanex-forestry-admin');
        this._notify = new Notify();
        this._roles = new Roles({container: this._container, notify: this._notify, path});
        this._users = new Users({container: this._container, notify: this._notify, path});
        this._user = new User({container: this._container, notify: this._notify, path});
        this._user.on('updated', async () => {
            await this.users();
        });
        this._users.on('click', async e => {
            const id = e.detail;
            await this._user.open(id);
        });
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