import './main.css';
import AdminUI from 'index.js';

window.addEventListener('load', () => {    
    const container = document.getElementById('output');
    const adm = new AdminUI(container);
    adm.addEventListener('loading:start', () => {
        console.log('started');
    });
    adm.addEventListener('loading:stop', () => {
        console.log('stopped');
    });
    document.getElementById('main').addEventListener('click', e => {
        e.stopPropagation();
        adm.close();
    });
    document.getElementById('users').addEventListener('click', async e => {
        e.stopPropagation();
        await adm.users()
    });
    document.getElementById('roles').addEventListener('click', async e => {
        e.stopPropagation();
        await adm.roles()
    });
    document.getElementById('organizations').addEventListener('click', async e => {
        e.stopPropagation();
        await adm.organizations()
    });
});