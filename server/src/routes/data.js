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
    message: 'utiliza /leer_imagenes o /verImagenes'
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
    res.json({ filesSize: files.length });
  });
});

// Obtener datos de la BD
router.get('/verImagenes', (req, res) => {
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

module.exports = router;
