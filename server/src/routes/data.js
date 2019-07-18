const express = require('express');
const Datastore = require('nedb');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const database = new Datastore('./database/hasma.db');

database.loadDatabase();

const fullPath = ['..', '..', '..', 'input_images'];

router.get('/', (req, res) => {
  res.json({
    message: 'DATA 😊'
  });
});

router.get('/insert/:algo', (req, res) => {
  database.insert({ message: req.params.algo });
  res.json({
    message: 'OK'
  });
});

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
      fs.readFile(path.join(__dirname, ...fullPath, file), (error, data) => {
        if (error) {
          res.status(500).json({
            error
          });
          return;
        }
        database.insert({
          fileName: file,
          image: Buffer.from(data).toString('base64'),
        });
      });
    });
    res.json({ filesSize: files.length });
  });
});

router.get('/getImages', (req, res) => {
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
