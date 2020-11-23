import './main.css';
import Admin from 'index.js';

window.addEventListener('load', () => {    
    const container = document.getElementById('output');
    const adm = new Admin(container);
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
});