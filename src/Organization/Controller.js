import View from './View.js';
import {Controller, NOTIFY_TIMEOUT} from 'Controller.js';
import T from '@scanex/translations';

const translate = T.getText.bind(T);

export default class Organization extends Controller {
    constructor({container, notify, loading, path}) {
        super({notify, loading});
        this._path = path;
        this._container = container;        
    }
    async open(id) {        
        const rs = await this.httpGet(`${this._path}/UserPermissionManager/GetRolesList`, {restrictRoles: true});
        if (rs && rs.rolesList) {  
            const roles = Object.keys(rs.rolesList).reduce((a,id) => {
                a[id] = rs.rolesList[id];
                return a;
            }, {});
            const data = await this.httpGet(`${this._path}/BussinessEntityManager/GetBussinesEntity`, {BussinesEntityID: id});
            if (data) {
                const {address,fullName,id,inn,number,ogrn,okpof,roleID} = data;
                let view = new View(id);
                view.on('close', () => {
                   view.destroy();
                   view = null;
                });
                view.on('save', async e => {
                    view.destroy();
                    view = null; 
                    const roleID = e.detail;
                    const ok = await this.httpPost(`${this._path}/BussinessEntityManager/UpdateBussinesEntity`, {bussinesEntityID: id, roleID}, false);
                    if (ok) {
                        this._notify.info(translate('info.ok'), NOTIFY_TIMEOUT);
                        let event = document.createEvent('Event');
                        event.initEvent('updated', false, false);
                        this.dispatchEvent(event);
                    }
                });
                view.name = fullName;
                view.address = address;
                view.inn = inn;
                view.okpf = okpof;
                view.ogrn = ogrn;                
                view.roles = roles;
                view.role = roleID;
            }    
        }
    }
};