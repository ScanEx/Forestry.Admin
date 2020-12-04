import Roles from './Roles/Controller.js';
import Users from './Users/Controller.js';
import User from './User/Controller.js';
import '@scanex/notify/dist/notify.css';
import Notify from '@scanex/notify';
import './index.css';
import './icons.css';
import 'strings.js';
import EventTarget from '@scanex/event-target';
import Loading from 'Loading.js';

export default class Admin extends EventTarget {
    constructor(container, {path} = {path: '/adm'}) {
        super();
        this._container = container; 
        this._container.classList.add('scanex-forestry-admin');
        this._notify = new Notify();
        this._loading = new Loading();
        this._loading.on('loading:start', () => {
            let event = document.createEvent('Event');
            event.initEvent('loading:start', false, false);
            this.dispatchEvent(event);
        });
        this._loading.on('loading:stop', () => {
            let event = document.createEvent('Event');
            event.initEvent('loading:stop', false, false);
            this.dispatchEvent(event);
        });
        this._roles = new Roles({container: this._container, notify: this._notify, loading: this._loading, path});        
        this._users = new Users({container: this._container, notify: this._notify, loading: this._loading, path});
        this._user = new User({container: this._container, notify: this._notify, loading: this._loading, path});
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