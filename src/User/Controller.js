import View from './View.js';
import Controller from 'Controller.js';

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
                const {birthDate, email, firstName, middleName, lastName, inn, } = data.userData;
                let view = new View(id);
                view.on('close', () => {
                   view.destroy();
                   view = null;
                });
                view.on('save', async e => {
                    view.destroy();
                    view = null;                    
                    console.log('user:', id, ', roles:', e.detail);
                });
                view.name = `${lastName}, ${firstName} ${middleName}`;
                view.birthDate = new Date(birthDate).toLocaleDateString();
                view.email = email;
                view.itn = inn;
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