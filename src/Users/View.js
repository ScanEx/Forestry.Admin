import './View.css';
import T from '@scanex/translations';
import './strings.js';
import {Component, Pager} from '@scanex/components';
import {format_date_iso} from 'Utils.js';
import 'pikaday/css/pikaday.css';
import Pikaday from 'pikaday';

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
                <input type="text" placeholder="${translate('admin.users.name')}">
                <button class="search">${translate('admin.users.search')}</button>
            </div>
            <div class="role-date-status">
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
        </div>        
        <div class="content"></div>        
        <div class="pager"></div>`;
        const btnSearch = element.querySelector('.search');
        btnSearch.addEventListener('click', e => {
            e.stopPropagation();
            this._change(true);
        });
        this._name = element.querySelector('.name input');
        this._rolesContainer = element.querySelector('.role select');
        this._content = element.querySelector('.content');
        this._pager = new Pager(element.querySelector('.pager'));
        this._pager.addEventListener('change', () => {
            this._change(false);
        }); 
        this._status = element.querySelector('.status select');
        this._pager.pages = 1;  
        this._date = new Pikaday({
            field: element.querySelector('.date input'),
            format: 'DD.MM.YYYY',
            yearRange: 20,
            i18n: {
                previousMonth : 'Предыдущий месяц',
                nextMonth     : 'Следующий месяц',
                months        : ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
                weekdays      : ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
                weekdaysShort : ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']
            },
        }); 
    }
    set page(page) {
        this._pager.page = page;
    }
    _change(filtered) {
        let event = document.createEvent('Event');
        event.initEvent('change', false, false);
        const name = this._name.value;        
        const role = this._rolesContainer.value;
        const date = this._date.getDate();        
        const status = this._status.value;
        const page = this._pager.page;
        event.detail = {name, role, date: date && date.toISOString() || '', status, page, filtered};
        this.dispatchEvent(event);
    }
    set count(count) {
        this._pager.pages = count && Math.ceil(count / this._pageSize) || 1;        
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
                    <th>${translate('admin.users.org')}</th>
                    <th>${translate('admin.users.role')}</th>                    
                </tr>
            </thead>
            <tbody>
            ${Array.isArray(users) && users.length && users.map(({userID, userName, created, isLock, organizationName, roleList}) => {
                return `<tr data-id="${userID}">
                    <td>${userID}</td>
                    <td>${userName}</td>
                    <td>${format_date_iso(created)}</td>
                    <td>${translate(isLock ? 'admin.users.blocked' : 'admin.users.verified')}</td>
                    <td>${organizationName}</td>
                    <td>${roleList.map(id => this._roles[id]).join(',')}</td>
                </tr>`;
            }).join('')}
            </tbody>
        </table>`;
        const rows = this._content.querySelectorAll('[data-id]');
        for(let row of rows) {            
            row.addEventListener('click', e => {
                e.stopPropagation();
                let event = document.createEvent('Event');
                event.initEvent('select', false, false);
                event.detail = row.getAttribute('data-id');
                this.dispatchEvent(event);
            });
        }
    }
};