import './View.css';
import T from '@scanex/translations';
import './strings.js';
import {Component, Pager, Spinner} from '@scanex/components';
import {format_date_iso} from 'Utils.js';

const translate = T.getText.bind(T);

export default class View extends Component {
    constructor(container, options) {
        super(container, options);
    }
    _render(element, {shelfLife, userID, versionCounts, pageSize}) {
        element.classList.add('scanex-forestry-admin-eventlog');
        element.innerHTML = `<div class="constants-block">
            <div class="constants-block-first">
			 <div class="raw">
				<label>${translate('admin.eventlog.versionCounts')}</label>
				<div class="versionCounts"></div>
			 </div>                
			 <div class="raw">
				<label>${translate('admin.eventlog.shelfLife')}</label>
				<div class="shelfLife"></div>
			 </div>
            </div>                            
            <button class="save">${translate('admin.eventlog.apply')}</button>
        </div>
        <div class="user-id-block">
            <div class="raw raw-first">
                <label>${translate('admin.eventlog.userid')}</label>
                <input type="text" class="user-id" value="${userID}" />
            </div>
            <button class="find">${translate('admin.eventlog.find')}</button>
        </div>
        <div class="user-role-block">
            <div class="raw">
                <label>${translate('admin.eventlog.roles.title')}</label>
                <i class="scanex-forestry-admin-icon down"></i>
            </div>
            <div class="roles-container">
                <div class="roles-items"></div>
                <div class="roles-pager"></div>
            </div>
        </div>
        <div class="user-info-block">
            <div class="raw">
                <label>${translate('admin.eventlog.info.title')}</label>
                <i class="scanex-forestry-admin-icon down"></i>
            </div>
            <div class="info-container">
                <div class="info-items"></div>
                <div class="info-pager"></div>
            </div>
        </div>`;
		
        element.querySelector('button.save').addEventListener('click', e => {
            e.stopPropagation();
            this._save();
        });        

		this._versionCounts = new Spinner(element.querySelector('.versionCounts'));
		this._versionCounts.min = 1; this._versionCounts.max = 20; this._versionCounts.value = versionCounts;

		this._shelfLife = new Spinner(element.querySelector('.shelfLife'));
		this._shelfLife.min = 1; this._shelfLife.max = 12; this._shelfLife.value = shelfLife ;

        
        const findUserContainer = element.querySelector('.user-id-block .user-id');        
        const findUserButton = element.querySelector('.user-id-block button');
        const find = id => {
            let event = document.createEvent('Event');
            event.initEvent('find', false, false);
            event.detail = id;
            this.dispatchEvent(event);
        };
        findUserContainer.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.stopPropagation();                
                const id = findUserContainer.value.trim();
                find(id);
            }
        });
        findUserButton.addEventListener('click', e => {
            e.stopPropagation();
            const id = findUserContainer.value.trim();
            find(id);
        });

        this._rolesContainer = element.querySelector('.roles-container');
        this._rolesContainer.classList.add('hidden');
        this._rolesVisibilityButton = element.querySelector('.user-role-block .raw i');
        element.querySelector('.user-role-block .raw').addEventListener('click', e => {
            e.stopPropagation();
            const visible = !this._rolesVisibilityButton.classList.contains('up');
            if (visible) {
                this._rolesContainer.classList.remove('hidden');
                this._rolesVisibilityButton.classList.remove('down');
                this._rolesVisibilityButton.classList.add('up');
            }
            else {
                this._rolesContainer.classList.add('hidden');
                this._rolesVisibilityButton.classList.remove('up');
                this._rolesVisibilityButton.classList.add('down');
            }         
        });
        this._rolesItemsContainer = element.querySelector('.roles-items');
        this._rolesPager = new Pager(element.querySelector('.roles-pager'));
        this._rolesPager.on('change', e => {
            let event = document.createEvent('Event');
            event.initEvent('roles:change', false, false);
            event.detail = (this._rolesPager.page - 1) * pageSize + 1;
            this.dispatchEvent(event);
        });

        this._infoContainer = element.querySelector('.info-container');
        this._infoContainer.classList.add('hidden');
        this._infoVisibilityButton = element.querySelector('.user-info-block .raw i');
        element.querySelector('.user-info-block .raw').addEventListener('click', e => {
            e.stopPropagation();
            const visible = !this._infoVisibilityButton.classList.contains('up');
            if (visible) {
                this._infoContainer.classList.remove('hidden');
                this._infoVisibilityButton.classList.remove('down');
                this._infoVisibilityButton.classList.add('up');
            }
            else {
                this._infoContainer.classList.add('hidden');
                this._infoVisibilityButton.classList.remove('up');
                this._infoVisibilityButton.classList.add('down');
            }         
        });
        this._infoItemsContainer = element.querySelector('.info-items');
        this._infoPager = new Pager(element.querySelector('.info-pager'));
        this._infoPager.on('change', e => {
            let event = document.createEvent('Event');
            event.initEvent('info:change', false, false);
            event.detail = (this._infoPager.page - 1) * pageSize + 1;
            this.dispatchEvent(event);
        });
    }
    _save() {
        let event = document.createEvent('Event');
        event.initEvent('save', false, false);
        event.detail = {shelfLife: this._shelfLife.value, versionCounts: this._versionCounts.value};
        this.dispatchEvent(event);
    }
    _cancel() {
        let event = document.createEvent('Event');
        event.initEvent('cancel', false, false);
        event.detail = {};
        this.dispatchEvent(event);
    }
    set rolePages(pages) {        
        this._rolesPager.pages = pages;        
    }
    set rolePage(page) {                
        this._rolesPager.page = page;
    }
    set infoPages(pages) {        
        this._infoPager.pages = pages;                
    }    
    set infoPage(page) {
        this._infoPager.page = page;
    }
    set roles(roles) {
        this._rolesItemsContainer.innerHTML = `<div class="roles-header">
            <span>${translate('admin.eventlog.roles.actionDate')}</span>
            <span>${translate('admin.eventlog.roles.autor')}</span>
            <span>${translate('admin.eventlog.roles.userID')}</span>
            <span>${translate('admin.eventlog.roles.role')}</span>            
            <span>${translate('admin.eventlog.roles.status')}</span>            
        </div>
        ${roles.map(({actionDate,autor,role,status,userID}) => {
            return `<div class="roles-items-row">
                <span>${actionDate}</span>
                <span>${autor}</span>
                <span>${userID}</span>
                <span>${role}</span>                
                <span>${status}</span>                
            </div>`;
        }).join('')}`;        
    }
    set info(info) {
        this._infoItemsContainer.innerHTML = `<div class="info-header">                      
            <span>${translate('admin.eventlog.info.actionDate')}</span>
            <span>${translate('admin.eventlog.info.autor')}</span>
            <span>${translate('admin.eventlog.info.id')}</span>
            <span>${translate('admin.eventlog.info.esiaUID')}</span>
            <span>${translate('admin.eventlog.info.email')}</span>
            <span>${translate('admin.eventlog.info.startPage')}</span>
            <span>${translate('admin.eventlog.info.isLock')}</span>
            <span>${translate('admin.eventlog.info.firstName')}</span>
            <span>${translate('admin.eventlog.info.middleName')}</span>
            <span>${translate('admin.eventlog.info.lastName')}</span>
            <span>${translate('admin.eventlog.info.trusted')}</span>
            <span>${translate('admin.eventlog.info.verifying')}</span>
        </div>
        ${info.map(({
            actionDate,
            autor,
            id,
            esiaUID,
            email,
            startPage,
            isLock,
            firstName,
            middleName,            
            lastName,                                    
            trusted,
            verifying,
        }) => {
            return `<div class="info-items-row">
                <span>${actionDate}</span>
                <span>${autor}</span>
                <span>${id}</span>
                <span>${esiaUID}</span>
                <span>${email}</span>
                <span>${startPage}</span>
                <span>${translate(`admin.eventlog.${isLock ? 'yes': 'no'}`)}</span>
                <span>${firstName}</span>
                <span>${middleName}</span>      
                <span>${lastName}</span>                           
                <span>${translate(`admin.eventlog.${trusted ? 'yes': 'no'}`)}</span>
                <span>${translate(`admin.eventlog.${verifying ? 'yes': 'no'}`)}</span>
            </div>`;
        }).join('')}`;        
    }    
};