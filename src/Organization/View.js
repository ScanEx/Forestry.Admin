import './View.css';
import {Dialog} from '@scanex/components';
import T from '@scanex/translations';
import './strings.js';

const translate = T.getText.bind(T);

export default class Organization extends Dialog {
    constructor(id) {
        super({title: translate('admin.organization.title'), modal: true, top: 200, left: 400});
        this._bussinesEntityID = id;
        this._element.classList.add('scanex-forestry-admin-organization');        
        this.content.innerHTML = `<div class="logo">
                <i class="scanex-forestry-admin-icon organization"></i>                
                <ul class="roles"></ul>
            </div>
            <div> 
                <div class="name">
                    <label class="label">${translate('admin.organization.name')}</label>
                    <label class="value"></label>
                </div>
                <div class="okpf">
                    <label class="label">${translate('admin.organization.okpf')}</label>
                    <label class="value"></label>
                </div>
                <div class="inn">
                    <label class="label">${translate('admin.organization.inn')}</label>
                    <label class="value"></label>
                </div>
                <div class="ogrn">
                    <label class="label">${translate('admin.organization.ogrn')}</label>
                    <label class="value"></label>
                </div>
                <div class="address">
                    <label class="label">${translate('admin.organization.address')}</label>
                    <label class="value"></label>
                </div>                                    
            </div>
            <div class="users"></div>`;
        this._rolesContainer = this.content.querySelector('.roles');

        this._name = this.content.querySelector('.name .value');
        this._okpf = this.content.querySelector('.okpf .value');
        this._inn = this.content.querySelector('.inn .value');                
        this._ogrn = this.content.querySelector('.ogrn .value');
        this._address = this.content.querySelector('.address .value');

        this._usersContainer = this.content.querySelector('.users');

        this.footer.innerHTML = `<button class="save">${translate('admin.organization.save')}</button>
        <button class="cancel">${translate('admin.organization.cancel')}</button>`;

        const btnSave = this.footer.querySelector('.save');
        btnSave.addEventListener('click', e => {
            let event = document.createEvent('Event');
            event.initEvent('save', false, false); 
            event.detail = this.role;           
            this.dispatchEvent(event);
        });

        const btnCancel = this.footer.querySelector('.cancel');
        btnCancel.addEventListener('click', e => {
            let event = document.createEvent('Event');
            event.initEvent('close', false, false);            
            this.dispatchEvent(event);
        });

    }        
    set name(name) {
        this._name.innerText = name;
    }
    set okpf(okpf) {
        this._okpf.innerText = okpf;
    }    
    set inn(inn) {
        this._inn.innerText = inn;
    }
    set ogrn(ogrn) {
        this._ogrn.innerText = ogrn;
    }    
    set address(address) {
        this._address.innerText = address;
    } 
    get role() {
        return this._role;
    }
    set role(role) {        
        let rows = this._rolesContainer.querySelectorAll('li');
        this._role = parseInt(role, 10);
        for (let row of rows) {
            const id = parseInt(row.getAttribute('data-id'), 10);
            let icon = row.querySelector('.scanex-forestry-admin-icon');
            if (id === this._role) {
                icon.classList.add('active');
            }
            else {
                icon.classList.remove('active');
            }
        }
    }
    set roles(roles) {
        this._roles = roles;
        this._rolesContainer.innerHTML = Object.keys(this._roles).map(id => {            
            return `<li data-id="${id}">
                <i class="scanex-forestry-admin-icon box"></i>
                <label>${this._roles[id]}</label>
            </li>`;
        }).join('');         
        let rows = this._rolesContainer.querySelectorAll('li');
        for (let row of rows) {
            row.addEventListener('click', e => {
                this.role = row.getAttribute('data-id');                
            });
        }       
    }
    set users(users) {
        this._users = users;
        this._usersContainer.innerHTML = `<table cellpadding="0" cellspacing="0">
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
            ${Array.isArray(users) && users.length && users.map(({userID, lastName, firstName, middleName, email, phone, snils}) => {
                return `<tr data-id="${userID}">
                    <td>${lastName}</td>    
                    <td>${firstName}</td>                    
                    <td>${middleName}</td>
                    <td>${email}</td>
                    <td>${phone}</td>
                    <td>${snils}</td>
                </tr>`;
            }).join('')}
            </tbody>
        </table>`;
    }
};