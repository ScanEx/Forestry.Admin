import './View.css';
import T from '@scanex/translations';
import './strings.js';
import {Component, Spinner} from '@scanex/components';

const translate = T.getText.bind(T);

export default class View extends Component {
    constructor(container, {pageSize}) {
        super(container);
        this._pageSize = pageSize;
    }
    _render(element) {
        element.classList.add('scanex-forestry-admin-eventlog');
        element.innerHTML = `<div>
			<div class="raw">
				<label>${translate('admin.eventlog.deps')}</label>
				<div class="depsInput"></div>
			</div>                
			<div class="raw">
				<label>${translate('admin.eventlog.monthsSave')}</label>
				<div class="monthsSaveInput"></div>
			</div>                
        </div>
		<div class="footer">
			<button class="save">${translate('admin.organization.save')}</button>
			<button class="cancel">${translate('admin.organization.cancel')}</button>
		</div>
		`;
		
        const btnSave = element.querySelector('button.save');
        btnSave.addEventListener('click', e => {
            e.stopPropagation();
            this._save();
        });
        const btnCancel = element.querySelector('button.cancel');
        btnCancel.addEventListener('click', e => {
            e.stopPropagation();
            this._cancel();
        });

		this._depsSp = new Spinner(element.querySelector('.depsInput'));
		this._depsSp.min = 1; this._depsSp.max = 20; this._depsSp.value = 5;

		this._monthsSaveSp = new Spinner(element.querySelector('.monthsSaveInput'));
		this._monthsSaveSp.min = 1; this._monthsSaveSp.max = 12; this._monthsSaveSp.value = 1;
		// depsSp.on('change', e => alert(`spinner: ${e.detail}`));
    }
    _save() {
        let event = document.createEvent('Event');
        event.initEvent('save', false, false);
        const deps = this._depsSp.value;
        const monthsSave = this._monthsSaveSp.value;

        event.detail = {deps, monthsSave};
        this.dispatchEvent(event);
    }
    _cancel() {
        let event = document.createEvent('Event');
        event.initEvent('cancel', false, false);
        event.detail = {};
        this.dispatchEvent(event);
    }
};