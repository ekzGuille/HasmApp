# HasmApp

Hasma meme App 😏

## Entorno
* **heroku**
  * [Cliente👨💼](https://hasmapp.herokuapp.com/)
  * [API👨💻](https://hasmapp-api.herokuapp.com/api)

### Desplegar en Heroku
* Cada app de Heroku ha de subirse a un *repositorio* propio de Heroku.
* Cliente
  * Ya que los arhivos estáticos no los detecta, se crea un `index.php` con lo siguiente:
  ```php
  <?php header ('Location: /index.html'); ?>
  ```
* Servidor
  * Como la carpeta `database` está en un ruta fuera del servidor, se ha de incluir dentro de la carpeta `server.
  * Es **necesario** modificar el archivo `server/src/routes/data.js` y sustituir esta línea:
  ~`const database = new Datastore('../database/hasma.db');`~ por:
  ```js
  const database = new Datastore('./database/hasma.db');
  ```
* Finalmente se hará el commit y push con todos los archivos al repositorio correspondiente. ([Ver documentación oficial](https://devcenter.heroku.com/articles/git))
