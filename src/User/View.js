import './View.css';
import {Dialog} from '@scanex/components';
import T from '@scanex/translations';
import './strings.js';

const translate = T.getText.bind(T);

export default class User extends Dialog {
    constructor(id) {
        super({title: translate('admin.user.title'), modal: true, top: 200, left: 400});
        this._userID = id;
        this._element.classList.add('scanex-forestry-admin-user');
        this._locked = false;
        this.content.innerHTML = `<table  cellpadding="0" cellspacing="0">
            <tr>
                <td>                    
                    <div>
                        <i class="scanex-forestry-admin-icon user"></i>
                    </div>
                    <ul class="roles"></ul>
                </td>
                <td>
                    <div class="locked">
                        <label>${translate('admin.user.locked')}</label>
                        <i class="scanex-forestry-admin-icon box"></i>
                    </div>
                    <table cellpadding="0" cellspacing="0" class="account-info">
                        <tr class="name">
                            <td class="label">
                                <label>${translate('admin.user.name')}</label>
                            </td>
                            <td class="value">
                                <label></label>
                            </td>
                        </tr>
                        <tr class="dob">
                            <td class="label">
                                <label>${translate('admin.user.dob')}</label>
                            </td>
                            <td class="value">
                                <label></label>
                            </td>
                        </tr>
                        <tr class="email">
                            <td class="label">
                                <label>${translate('admin.user.email')}</label>
                            </td>
                            <td class="value">
                                <label></label>
                            </td>
                        </tr>                        
                        <tr class="phone">
                            <td class="label">
                                <label>${translate('admin.user.phone')}</label>
                            </td>
                            <td class="value">
                                <label></label>
                            </td>
                        </tr>
                        <tr class="snils">
                            <td class="label">
                                <label>${translate('admin.user.snils')}</label>
                            </td>
                            <td class="value">
                                <label></label>
                            </td>
                        </tr>
                    </table>                    
                </td>
            </tr>            
        </table>
        <div class="organization">
            <div class="org">
                <div class="label">${translate('admin.user.org')}</div>
                <div class="value"></div>
            </div>
            <div>
                <div class="itn">
                    <div class="label">${translate('admin.user.itn')}</div>
                    <div class="value"></div>
                </div>
                <div class="ogrn">
                    <div class="label">${translate('admin.user.ogrn')}</div>
                    <div class="value"></div>
                </div>
            </div>
        </div>`;
        let btnBlock = this.content.querySelector('.locked');
        btnBlock.addEventListener('click', e => {
            e.stopPropagation();             
            this.locked = !this._locked;
        });
        this._rolesContainer = this.content.querySelector('.roles');

        this._name = this.content.querySelector('.name .value label');
        this._dob = this.content.querySelector('.dob .value label');
        this._email = this.content.querySelector('.email .value label');
        this._snils = this.content.querySelector('.snils .value label');
        this._itn = this.content.querySelector('.itn .value');
        this._phone = this.content.querySelector('.phone .value label');
        this._org = this.content.querySelector('.org .value');
        this._ogrn = this.content.querySelector('.ogrn .value');

        this.footer.innerHTML = `<button class="save">${translate('admin.user.save')}</button>
        <button class="cancel">${translate('admin.user.cancel')}</button>`;

        const btnSave = this.footer.querySelector('.save');
        btnSave.addEventListener('click', e => {
            let event = document.createEvent('Event');
            event.initEvent('save', false, false);
            const roles = Object.keys(this._roles).reduce((a,id) => {
                const {checked} = this._roles[id];
                const k = parseInt(id, 10);
                if (checked && !isNaN(k)) {
                    a.push(k);
                }
                return a;
            }, []);
            event.detail = {roles, locked: this._locked};
            this.dispatchEvent(event);
        });

        const btnCancel = this.footer.querySelector('.cancel');
        btnCancel.addEventListener('click', e => {
            let event = document.createEvent('Event');
            event.initEvent('close', false, false);
            this.dispatchEvent(event);
        });

    }    
    set locked (locked) {
        this._locked = locked;
        let icon = this.content.querySelector('.locked .box');        
        if (this._locked) {
            icon.classList.add('active');
        }
        else {
            icon.classList.remove('active');
        }
    }
    set name(name) {
        this._name.innerText = name;
    }
    set birthDate(birthDate) {
        this._dob.innerText = birthDate;
    }
    set email(email) {
        this._email.innerText = email;
    }
    set itn(itn) {
        this._itn.innerText = itn;
    }
    set ogrn(ogrn) {
        this._ogrn.innerText = ogrn;
    }
    set org(org) {
        this._org.innerText = org;
    }
    set snils(snils) {
        this._snils.innerText = snils;
    }
    set phone(phone) {
        this._phone.innerText = phone;
    }    
    set roles(roles) {
        this._roles = roles;
        this._rolesContainer.innerHTML = Object.keys(this._roles).map(id => {
            const {checked, label} = this._roles[id];
            return `<li data-id="${id}">
                <i class="scanex-forestry-admin-icon box ${checked && 'active' || ''}"></i>
                <label>${label}</label>
            </li>`;
        }).join('');
        let rows = this._rolesContainer.querySelectorAll('li');
        for (let row of rows) {
            row.addEventListener('click', e => {
                const id = row.getAttribute('data-id');
                let icon = row.querySelector('.scanex-forestry-admin-icon');
                const checked = !icon.classList.contains('active');
                if (checked) {
                    icon.classList.add('active');
                }
                else {
                    icon.classList.remove('active');
                }
                this._roles[id].checked = checked;
            });
        }
    }
};