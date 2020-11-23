import View from './View.js';
import {Controller} from 'Controller.js';

export default class Users extends Controller {
    constructor({container, notify, path}) {
        super({notify});
        this._path = path;
        this._container = container;
        this._pageSize = 25; 
    }
    async open() {
        const rs = await this.httpGet(`${this._path}/UserPermissionManager/GetRolesList`);
        if (rs && rs.rolesList) {
            this._container.innerHTML = '';
            this._view = new View(this._container, {pageSize: this._pageSize});
            this._view.on('change', async e => {
                const {name, role, date, status, page} = e.detail;
                const data = await this.httpGet(`${this._path}/UserManager/GetUserList`, {
                    StartPoint: (page - 1) * this._pageSize + 1,
                    SizeList: this._pageSize,
                    FullName: encodeURIComponent(name) || '',
                    RoleId: role || '',
                    IsLocked: status === 'blocked',
                    CreatedAfter: date || '',
                });
                if (data) {
                    const {count, userList} = data;
                    this._view.count = count;
                    this._view.users = userList;
                }
            });
            this._view.on('user:select', e => {
                let event = document.createEvent('Event');
                event.initEvent('click', false, false);
                event.detail = e.detail;
                this.dispatchEvent(event);
            });            
            this._view.page = 1;
            this._view.roles = rs.rolesList;
        }
    }
};