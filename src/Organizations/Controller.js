import View from './View.js';
import {Controller} from 'Controller.js';

export default class Organizations extends Controller {
    constructor({container, notify, loading, path}) {
        super({notify, loading});
        this._path = path;
        this._container = container;
        this._pageSize = 9;
    }
    async open() {
        const rs = await this.httpGet(`${this._path}/UserPermissionManager/GetRolesList`);
        if (rs && rs.rolesList) {
            this._container.innerHTML = '';
            this._view = new View(this._container, {pageSize: this._pageSize});
            this._view.on('change', async e => {
                const {name, role, inn, ogrn, page, filtered} = e.detail;
                let opts = {
                    StartPoint: (page - 1) * this._pageSize + 1,
                    SizeList: this._pageSize,
                    FullName: encodeURIComponent(name) || '',
                    RoleId: role || '',
                    Inn: inn || '',
                    Ogrn: ogrn || '',
                };                
                const data = await this.httpGet(`${this._path}/BussinessEntityManager/GetBussinesEntityList`, opts);
                if (data) {
                    const {count, bussinesEntityList} = data;
                    this._view.count = count;
                    this._view.organizations = bussinesEntityList;
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
}