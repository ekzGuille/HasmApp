# HasmApp

Hasma meme App 😏

## Entornos
* **now**
  * [Cliente👨💼](https://hasmapp.now.sh/)
  * [API👨💻](https://hasmappapi.now.sh/api)
* **heroku**
  * [Cliente👨💼](https://hasmapp.herokuapp.com/)
  * [API👨💻](https://hasmapp-api.herokuapp.com/api)

### Desplegar en now
* Cada carpeta *cliente* y *servidor* tienen su propio archivo de configuración **`now.json`**.
* Para hacer deploy escribir:
```sh
now
```

### Desplegar en Heroku
* Cada app de Heroku ha de subirse a un *repositorio* propio de Heroku
* Cliente
  * Ya que los arhivos estáticos no los detecta, se crea un `index.php` con lo siguiente
  ```php
  <?php header ('Location: /index.html'); ?>
  ```
* Servidor
  * Como la carpeta `database` está en un ruta fuera del servidor, se ha incluido dentro.
  * Es **necesario** modificar el archivo `server/src/routes/data.js` y sustituir esta línea 
  ~`const database = new Datastore('../database/hasma.db');`~ por:
  ```js
  const database = new Datastore('./database/hasma.db');
  ```
* Finalmente se hará el commit y push con todos los archivos al repositorio correspondiente. ([Ver documentación oficial](https://devcenter.heroku.com/articles/git))
