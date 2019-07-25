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

// Test
router.get('/insert/:algo', (req, res) => {
  database.insert({ message: req.params.algo });
  res.json({
    message: 'OK'
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
    res.json({ filesSize: files.length });
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
    res.json({
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
      res.json({
        docs
      });
    });
  } else {
    res.status(500).json({
      message: 'No se ha especificado una keyword'
    });
  }
});

module.exports = router;
