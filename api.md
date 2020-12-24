# API
* Объект: AdminUI
  * Инициализация:
	```js
	var map = new AdminUI(container, {path});
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
	* показать список организаций
		```js
		async organizations();
		```
	* закрыть открытое представление
		```js
		close();		
		```
  * События:  
  	* начало длительной операции ``loading:start``
  	* конец длительной операции ``loading:stop``
# Пример
```js
	import './forestry-admin.css';
	import AdminUI from './forestry-admin.js';

	window.addEventListener('load', async () => {		
        // получение контейнера
        let container = document.getElementById('admin');
        
        // инициализация
		let admin = new AdminUI(container);
		
		admin.addEventListener('loading:start', () => {
			// показать начало длительной операции
		});

		admin.addEventListener('loading:stop', () => {
			// завершить длительную операцию
		});
        
        // показать список ролей и разрешений
        await admin.roles();		
	});
```