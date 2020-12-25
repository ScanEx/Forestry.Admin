import View from './View.js';
import {Controller} from 'Controller.js';

export default class Users extends Controller {
    constructor({container, notify, loading, path, pageSize}) {
        super({notify, loading});
        this._path = path;
        this._container = container;
        this._pageSize = pageSize;
    }
    async open() {
        const rs = await this.httpGet(`${this._path}/UserPermissionManager/GetRolesList`);
        if (rs && rs.rolesList) {
            this._container.innerHTML = '';
            this._view = new View(this._container, {pageSize: this._pageSize});
            this._view.on('change', async e => {
                const {name, role, date, status, page, filtered} = e.detail;
                let opts = {
                    StartPoint: (page - 1) * this._pageSize + 1,
                    SizeList: this._pageSize,
                    FullName: encodeURIComponent(name) || '',
                    RoleId: role || '',                  
                    CreatedAfter: date || '',
                };
                switch (status) {
                    case 'blocked':
                        opts.IsLocked = true;
                        break;
                    case 'verified':
                        opts.IsLocked = false;
                        break;
                    default:
                        break;
                }
                const data = await this.httpGet(`${this._path}/UserManager/GetUserList`, opts);
                if (data) {
                    const {count, userList} = data;
                    this._view.count = count;
                    this._view.users = userList;
                    if (filtered) {
                        this._view.page = 1;
                    }
                }
            });
            this._view.on('select', e => {
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