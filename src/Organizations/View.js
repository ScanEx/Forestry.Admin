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
        element.classList.add('scanex-forestry-admin-organizations');
        element.innerHTML = `<div class="filter">
            <div class="name">
                <i class="scanex-forestry-admin-icon search"></i>
                <input type="text" placeholder="${translate('admin.organizations.organizationName')}">
                <button>${translate('admin.organizations.search')}</button>
            </div>
            <div class="role-inn-ogrn">
                <div class="role">
                    <label>${translate('admin.organizations.role')}</label>                    
                    <select></select>                    
                </div>
                <div class="inn">
                    <label>${translate('admin.organizations.inn')}</label>
                    <input type="text">
                </div>                
                <div class="ogrn">                
                    <label>${translate('admin.organizations.ogrn')}</label>
                    <input type="text">
                </div>                
            </div>
        </div>        
        <div class="content">
            <div class="header">
                <div data-id="id">${translate('admin.organizations.id')}</div>
                <div data-id="okpf">${translate('admin.organizations.okpf')}</div>
                <div data-id="name">${translate('admin.organizations.name')}</div>
                <div data-id="role">${translate('admin.organizations.role')}</div>
                <div data-id="inn">${translate('admin.organizations.inn')}</div>
                <div data-id="ogrn">${translate('admin.organizations.ogrn')}</div>
            </div>
            <div class="body"></div>
        </div> 
        <div class="footer">       
            <div class="pager"></div>
        </div>`;
        const btnSearch = element.querySelector('.name button');
        btnSearch.addEventListener('click', e => {
            e.stopPropagation();
            this._change(true);
        });
        this._name = element.querySelector('.name input');
        this._rolesContainer = element.querySelector('.role select');
        this._body = element.querySelector('.content .body');
        this._pager = new Pager(element.querySelector('.pager'));
        this._pager.addEventListener('change', () => {
            this._change(false);
        }); 
        this._inn = element.querySelector('.inn input');
        this._ogrn = element.querySelector('.ogrn input');
        this._pager.pages = 1;        
    }
    set page(page) {
        this._pager.page = page;
    }
    _change(filtered) {
        let event = document.createEvent('Event');
        event.initEvent('change', false, false);
        const name = this._name.value;        
        const role = this._rolesContainer.value;
        const inn = this._inn.value;
        const ogrn = this._ogrn.value;
        const page = this._pager.page;
        event.detail = {name, role, inn, ogrn, page, filtered};
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
    set organizations(organizations) {                
        this._body.innerHTML = organizations.map(({address, fullName,id,inn,number,ogrn,okpof,phone,roleID}) => {
            return `<div class="row" data-id="${id || '-'}">
                <div data-id="id">${number || '-'}</div>
                <div data-id="okpf">${okpof || '-'}</div>
                <div data-id="name">${fullName || '-'}</div>                    
                <div data-id="role">${this._roles[roleID] || '-'}</div>
                <div data-id="inn">${inn || '-'}</div>
                <div data-id="ogrn">${ogrn || '-'}</div>
            </div>`;
        }).join('');
        const rows = this._body.querySelectorAll('.row');
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