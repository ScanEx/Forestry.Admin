import './View.css';
import T from '@scanex/translations';
import './strings.js';
import {Component, Spinner} from '@scanex/components';

const translate = T.getText.bind(T);

export default class View extends Component {
    constructor(container, {shelfLife, versionCounts}) {
        super(container, {shelfLife, versionCounts});
    }
    _render(element, {shelfLife, versionCounts}) {
        element.classList.add('scanex-forestry-admin-eventlog');
        element.innerHTML = `<div>
			<div class="raw">
				<label>${translate('admin.eventlog.versionCounts')}</label>
				<div class="versionCounts"></div>
			</div>                
			<div class="raw">
				<label>${translate('admin.eventlog.shelfLife')}</label>
				<div class="shelfLife"></div>
			</div>                
        </div>
		<div class="footer">
			<button class="save">${translate('admin.organization.save')}</button>
			<button class="cancel">${translate('admin.organization.cancel')}</button>
		</div>
		`;
		
        element.querySelector('button.save').addEventListener('click', e => {
            e.stopPropagation();
            this._save();
        });
        element.querySelector('button.cancel').addEventListener('click', e => {
            e.stopPropagation();
            this._cancel();
        });

		this._versionCounts = new Spinner(element.querySelector('.versionCounts'));
		this._versionCounts.min = 1; this._versionCounts.max = 20; this._versionCounts.value = versionCounts;

		this._shelfLife = new Spinner(element.querySelector('.shelfLife'));
		this._shelfLife.min = 1; this._shelfLife.max = 12; this._shelfLife.value = shelfLife ;
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
};