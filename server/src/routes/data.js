const express = require('express');
const Datastore = require('nedb');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const database = new Datastore('../database/hasma.db');

database.loadDatabase();

const fullPath = ['..', '..', '..', 'input_images'];

router.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la HasmaApp API 😏'
  });
});

// Leer imagenes de la carpeta y cargarlos en BD
router.get('/leer_imagenes', (req, res) => {
  fs.readdir(path.join(__dirname, ...fullPath), (err, files) => {
    if (err) {
      res.status(500).json({
        err
      });
      return;
    }
    if (files.length <= 1) {
      // eslint-disable-next-line array-callback-return
      files.map((file) => {
        if (!file.startsWith('.')) {
          fs.readFile(path.join(__dirname, ...fullPath, file), (error, data) => {
            if (error) {
              res.status(500).json({
                error
              });
              return;
            }
            database.insert({
              fileName: file,
              keywords: file.substr(0, file.indexOf('.')).split('_'),
              image: `data:image/png;base64,${Buffer.from(data).toString('base64')}`
            });
          });
        }
      });
    }
    res.status(200).json({ filesSize: files.length });
  });
});

// Obtener datos de la BD
router.get('/ver_todas_imagenes', (req, res) => {
  database.find({}, (err, docs) => {
    if (err) {
      res.status(500).json({
        err
      });
      return;
    }
    res.status(200).json({
      docs
    });
  });
});

// Obtener datos de la BD
router.get('/ver_imagenes/:keyword', (req, res) => {
  const { keyword } = req.params;
  if (keyword && keyword !== '') {
    database.find({ keywords: { $in: [keyword] } }, (err, docs) => {
      if (err) {
        res.status(500).json({
          err
        });
        return;
      }
      res.status(200).json({
        docs
      });
    });
  } else {
    res.status(500).json({
      message: 'No se ha especificado una keyword'
    });
  }
});

function obtenerRepeticion(lista) {
  const datos = {};
  // eslint-disable-next-line array-callback-return
  lista.map((el) => {
    if (!datos[el]) {
      datos[el] = 1;
    } else {
      datos[el] += 1;
    }
  });
  return datos;
}

// Obtener las categorias de los memes
router.get('/obtener_categorias', (req, res) => {
  const categorias = [];
  database.find({}, { image: 0, fileName: 0, _id: 0 }, (err, docs) => {
    if (err) {
      res.status(500).json({
        err
      });
      return;
    }
    docs.map(keys => categorias.push(...keys.keywords));

    const lista_repeticion = obtenerRepeticion(categorias);
    const keys = Object.keys(lista_repeticion);
    let lista_categorias = [];
    // eslint-disable-next-line array-callback-return
    lista_categorias = keys.map((key) => {
      if (lista_repeticion[key] > 2) {
        return {
          key,
          cantidad: lista_repeticion[key]
        };
      }
    });
    // lista_repeticion = lista_repeticion.filter(cat => cat.length > 3);
    res.status(200).json({
      categorias: lista_categorias
    });
  });
});


module.exports = router;
