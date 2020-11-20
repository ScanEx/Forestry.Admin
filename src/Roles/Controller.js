import View from './View.js';
import Controller from 'Controller.js';

export default class Roles extends Controller {
    constructor({container, notify, path}) {
        super({notify});
        this._path = path;
        this._container = container;        
    }
    async open () {
        const rs = await this.httpGet(`${this._path}/UserPermissionManager/GetRolesList`);
        if (rs && rs.rolesList) {
            this._container.innerHTML = '';
            this._view = new View(this._container, {pageSize: 20});
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

            });
            this._view.roles = rs.rolesList;            
        }
    }    
}