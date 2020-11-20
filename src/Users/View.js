import './View.css';
import T from '@scanex/translations';
import './strings.js';
import {Component, Pager} from '@scanex/components';
import {format_date_iso} from 'Utils.js';

const translate = T.getText.bind(T);

export default class View extends Component {
    constructor(container, {pageSize}) {
        super(container);
        this._pageSize = pageSize;
    }
    _render(element) {
        element.classList.add('scanex-forestry-admin-users');
        element.innerHTML = `<div class="filter">
            <div class="name">
                <input type="text">
                <button class="search">${translate('admin.users.search')}</button>
            </div>
            <div class="role">
                <label>${translate('admin.users.userRole')}</label>
                <select></select>
            </div>
            <div class="date">
                <label>${translate('admin.users.dateAfter')}</label>
                <input type="text">
            </div>
            <div class="status">                
                <label>${translate('admin.users.status')}</label>                
                <select>
                    <option value=""></option>
                    <option value="blocked">${translate('admin.users.blocked')}</option>
                    <option value="verified">${translate('admin.users.verified')}</option>
                </select>
            </div>
        </div>        
        <div class="content"></div>        
        <div class="pager"></div>`;
        const btnSearch = element.querySelector('.search');
        btnSearch.addEventListener('click', this._search.bind(this));
        this._rolesContainer = element.querySelector('.role select');
        this._content = element.querySelector('.content');
        this._pager = new Pager(element.querySelector('.pager'));
        this._pager.addEventListener('change', () => {            
            let event = document.createEvent('Event');
            event.initEvent('page:change', false, false);
            event.detail = this._pager.page;
            this.dispatchEvent(event);
        });        
        this._pager.pages = 1;        
    }
    set page(page) {
        this._pager.page = page;
    }
    _search(e) {
        e.stopPropagation();
        let event = document.createEvent('Event');
        event.initEvent('search', false, false);
        this.dispatchEvent(event);
    }    
    set count(count = 1) {
        this._pager.pages = Math.ceil(count / this._pageSize);
    }
    set roles(roles) {
        this._roles = roles;
        this._rolesContainer.innerHTML = `
            <option value=""></option>
            ${Object.keys(this._roles).map(id => `<option value="${id}">${this._roles[id]}</option>`).join('')}`;
    }
    set users(users) {                
        this._content.innerHTML = `<table cellpadding="0" cellspacing="0">
            <thead>
                <tr>
                    <th>${translate('admin.users.id')}</th>
                    <th>${translate('admin.users.name')}</th>
                    <th>${translate('admin.users.date')}</th>
                    <th>${translate('admin.users.status')}</th>
                    <th>${translate('admin.users.role')}</th>
                </tr>
            </thead>
            <tbody>
            ${users.map(({userID, userName, created, isLock, roleList}) => {
                return `<tr>
                    <td>${userID}</td>
                    <td>${userName}</td>
                    <td>${format_date_iso(created)}</td>
                    <td>${translate(isLock ? 'admin.users.blocked' : 'admin.users.verified')}</td>
                    <td>${roleList.map(id => this._roles[id]).join(',')}</td>
                </tr>`;
            }).join('')}
            </tbody>
        </table>`;
        // const rows = this._permissionsContainer.querySelectorAll('[data-id]');
        // for(let row of rows) {            
        //     row.addEventListener('click', e => {
        //         e.stopPropagation();
        //         const id = row.getAttribute('data-id');
        //         let icon = row.querySelector('.scanex-forestry-admin-icon');
        //         const checked = !icon.classList.contains('active');
        //         if (checked) {
        //             icon.classList.add('active');
        //         }
        //         else {
        //             icon.classList.remove('active');
        //         }
        //         this._permissions[id].checked = checked;
        //     });
        // }
    }
};