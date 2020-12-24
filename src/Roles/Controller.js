import View from './View.js';
import {Controller, NOTIFY_TIMEOUT} from 'Controller.js';
import T from '@scanex/translations';

const translate = T.getText.bind(T);

export default class Roles extends Controller {
    constructor({container, notify, loading, path}) {
        super({notify, loading});
        this._path = path;
        this._container = container;        
    }
    async open () {
        const rs = await this.httpGet(`${this._path}/UserPermissionManager/GetRolesList`);
        if (rs && rs.rolesList) {
            this._container.innerHTML = '';
            this._view = new View(this._container, {pageSize: 12});
            this._view.on('role:change', async e => {
                const RoleID = e.detail;
                const ps = await this.httpGet(`${this._path}/UserPermissionManager/GetPermissionsList`);
                if (ps && ps.permissionsList) {
                    const permissions = Object.keys(ps.permissionsList).reduce((a,id) => {
                        a[id] = {id, label: ps.permissionsList[id], checked: false};
                        return a;
                    }, {});
                    const role = await this.httpGet(`${this._path}/UserPermissionManager/GetRole`, {RoleID});
                    if (role && role.permissionsList){                    
                        role.permissionsList.forEach(id => {
                            permissions[id].checked = true;
                        });
                        this._view.permissions = permissions;                        
                    }                    
                } 
            });
            this._view.on('save', async e => {
                const {roleID, permissions} = e.detail;
                const ok = await this.httpPost(`${this._path}/UserPermissionManager/UpdateRoles`, {roleID, permissionsList: permissions}, false);
                if (ok) {
                    let event = document.createEvent('Event');
                    event.initEvent('role:save', false, false);
                    this.dispatchEvent(event);
                    this._notify.info(translate('info.ok'), NOTIFY_TIMEOUT);
                }
            });
            this._view.roles = rs.rolesList;
        }
    }    
};