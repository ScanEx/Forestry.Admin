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
            </div>`;
        this._rolesContainer = this.content.querySelector('.roles');

        this._name = this.content.querySelector('.name .value');
        this._okpf = this.content.querySelector('.okpf .value');
        this._inn = this.content.querySelector('.inn .value');                
        this._ogrn = this.content.querySelector('.ogrn .value');
        this._address = this.content.querySelector('.address .value');

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
};