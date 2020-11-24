import View from './View.js';
import {Controller, NOTIFY_TIMEOUT} from 'Controller.js';
import T from '@scanex/translations';

const translate = T.getText.bind(T);

export default class User extends Controller {
    constructor({container, notify, path}) {
        super({notify});
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
                const {birthDate, email, firstName, middleName, lastName, inn, isLock} = data.userData;
                let view = new View(id);
                view.on('close', () => {
                   view.destroy();
                   view = null;
                });
                view.on('save', async e => {
                    view.destroy();
                    view = null; 
                    const {roles, locked} = e.detail;
                    const ok = await this.httpPost(`${this._path}/UserManager/UpdateUser`, {userID: id, userRoles: roles, isLock: locked}, false);
                    if (ok) {
                        this._notify.info(translate('info.ok'), NOTIFY_TIMEOUT);
                        let event = document.createEvent('Event');
                        event.initEvent('updated', false, false);
                        this.dispatchEvent(event);
                    }
                });
                view.name = `${lastName}, ${firstName} ${middleName}`;
                view.birthDate = new Date(birthDate).toLocaleDateString();
                view.email = email;
                view.itn = inn;
                view.locked = isLock;
                if (data.userRoles){                    
                    Object.keys(data.userRoles).forEach(id => {
                        roles[id].checked = true;
                    });
                    view.roles = roles;
                }
            }    
        }
    }
};