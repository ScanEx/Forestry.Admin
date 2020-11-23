# API
* Объект: Map
  * Инициализация:
	```js
	var map = new Admin(container, {path});
	```
  	* container - DOM-элемент, содержащий карту	  	
  	* path - путь к API (значение по умолчанию '/adm')
  * Методы:
    * показать список ролей и разрешений
		```js
		async roles ();
		```			
	* показать список учетных записей
		```js
		async users();
		```
	* закрыть открытое представление
		```js
		close();
		```
# Пример
```js
	import './forestry-admin.css';
	import AdminUI from './forestry-admin.js';

	window.addEventListener('load', async () => {		
        // получение контейнера
        let container = document.getElementById('admin');
        
        // инициализация
        let admin = new AdminUI(container);			
        
        // показать список ролей и разрешений
        await admin.roles();		
	});
```