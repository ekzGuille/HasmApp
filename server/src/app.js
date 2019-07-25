const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const middlewares = require('./middlewares');
const data = require('./routes/data');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

app.get('/', (req, res) => {
  res.redirect('api');
});

app.use('/api/', data);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
