import View from './View.js';
import {Controller, NOTIFY_TIMEOUT} from 'Controller.js';
import T from '@scanex/translations';

const translate = T.getText.bind(T);

export default class User extends Controller {
    constructor({container, notify, loading, path}) {
        super({notify, loading});
        this._path = path;
        this._container = container;        
    }
    async open(id) {        
        const rs = await this.httpGet(`${this._path}/UserPermissionManager/GetRolesList`, {restrictRoles: true});
        if (rs && rs.rolesList) {  
            const roles = Object.keys(rs.rolesList).reduce((a,id) => {
                a[id] = {id, label: rs.rolesList[id], checked: false};
                return a;
            }, {});
            const data = await this.httpGet(`${this._path}/UserManager/GetUser`, {UserID: id});
            if (data && data.userData) {
                const {birthDate, email, firstName, middleName, lastName, isLock, snils, businessEntity: {fullName, name, ogrn, inn}} = data.userData;
                this._view = new View(id);
                this._view
                    .on('close', () => {
                        this._view.destroy();
                        this._view = null;
                    })
                    .on('save', async e => {                    
                        const {roles, locked} = e.detail;
                        const ok = await this.httpPost(`${this._path}/UserManager/UpdateUser`, {userID: id, userRoles: roles, isLock: locked}, false);
                        if (ok) {
                            this._notify.info(translate('info.ok'), NOTIFY_TIMEOUT);
                            let event = document.createEvent('Event');
                            event.initEvent('updated', false, false);
                            this.dispatchEvent(event);
                        }
                    })
                    .on('eventlog:view', e => {                        
                        let event = document.createEvent('Event');
                        event.initEvent('eventlog:view', false, false);
                        event.detail = e.detail;
                        this.dispatchEvent(event);
                    });
                this._view.name = `${lastName}, ${firstName} ${middleName}`;
                this._view.birthDate = new Date(birthDate).toLocaleDateString();
                this._view.email = email;
                this._view.itn = inn;
                this._view.org = fullName;
                this._view.snils = snils;
                this._view.ogrn = ogrn;
                this._view.locked = isLock;
                if (data.userRoles){                    
                    Object.keys(data.userRoles).forEach(id => {
                        roles[id].checked = true;
                    });
                    this._view.roles = roles;
                }
            }    
        }
    }
    close () {
        this._view && this._view.destroy();
        this._view = null;
    }
};