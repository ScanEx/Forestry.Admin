import './View.css';
import T from '@scanex/translations';
import './strings.js';
import {Component, Pager} from '@scanex/components';

const translate = T.getText.bind(T);

export default class View extends Component {
    constructor(container, {pageSize}) {
        super(container);
        this._pageSize = pageSize;
    }
    _render(element) {
        element.classList.add('scanex-forestry-admin-permissions');
        element.innerHTML = `<div>${translate('admin.roles')}</div>
        <div>
            <label>${translate('admin.role')}</label>
            <select class="roles"></select>
        </div>
        <div class="content">
            <label>${translate('admin.permissions')}</label>
            <div class="permissions"></div>
        </div>
        <div class="footer">
            <div class="pager"></div>
            <button class="save">${translate('admin.save')}</button>
        </div>`;        
        this._roles = element.querySelector('.roles');
        this._roles.addEventListener('change', this._changeRole.bind(this));
        this._permissionsContainer = element.querySelector('.permissions');
        this._pager = new Pager(element.querySelector('.pager'));
        this._pager.addEventListener('change', () => {
            this._page = this._pager.page;
            this._changePage (this._page);
        });        
        this._pager.pages = 1;        
        const btnSave = element.querySelector('.save');
        btnSave.addEventListener('click', e => {
            e.stopPropagation();
            let event = document.createEvent('Event');
            event.initEvent('save', false, false);
            event.detail = this._roles.value;
            this.dispatchEvent(event);
        });
    }
    _changePage (page) {   
        const start = this._pageSize * (page - 1);
        const end = start + this._pageSize;
        const sorter = (a,b) => {
            const x = this._permissions[a].label;
            const y = this._permissions[b].label;
            if (x > y) {
                return 1;
            }
            else if (x < y) {
                return -1;
            }
            else {
                return 0;
            }
        };
        this._permissionsContainer.innerHTML = `<table cellpadding="0" cellspacing="0">
            ${Object.keys(this._permissions).sort(sorter).slice(start, end).map(id => {
                const {checked, label} = this._permissions[id];
                return `<tr data-id="${id}">
                    <td>
                        <i class="scanex-forestry-admin-icon box ${checked && 'active' || ''}"></i>
                    </td>
                    <td>
                        <label>${label}</label>
                    </td>
                </tr>`;
            }).join('')}
        </table>`;
        const rows = this._permissionsContainer.querySelectorAll('[data-id]');
        for(let row of rows) {            
            row.addEventListener('click', e => {
                e.stopPropagation();
                const id = row.getAttribute('data-id');
                let icon = row.querySelector('.scanex-forestry-admin-icon');
                const checked = !icon.classList.contains('active');
                if (checked) {
                    icon.classList.add('active');
                }
                else {
                    icon.classList.remove('active');
                }
                this._permissions[id].checked = checked;
            });
        }
    }
    set roles (roles) {
        this._roles.innerHTML = Object.keys(roles).map(id => `<option value="${id}">${roles[id]}</option>`).join('');
        this._changeRole();
    }
    set permissions(permissions) {        
        this._permissions = permissions;
        this._pager.pages = Math.ceil(Object.keys(permissions).length / this._pageSize);
        this._pager.page = this._page || 1;
    } 
    _changeRole() {
        let event = document.createEvent('Event');
        event.initEvent('role:change', false, false);
        event.detail = this._roles.value;
        this.dispatchEvent(event);
    }
};