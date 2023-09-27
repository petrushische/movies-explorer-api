const dotenv = require('dotenv');

dotenv.config();

const { errors } = require('celebrate');

const express = require('express');

const mongoose = require('mongoose');

const { centralizedErrorHandler } = require('./centralizedErrorHandler/centralizedErrorHandler');

const NotFoundError = require('./errors/NotFoundError');

const auth = require('./middlewares/auth');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const router = require('./routes/index');

const app = express();

const allowedCors = [
  'http://localhost:3000',
  'https://bibliofilms.nomoredomains.work',
  'http://bibliofilms.nomoredomains.work',
  'https://petrushische.github.io/movies-explorer-frontend/',
];
// Cors
app.use((req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  next();
});

app.use(requestLogger); //  логгер запросов

// Все запросы
app.use(router);

app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('page not found'));
});

app.use(errorLogger); //  логгер ошибок

app.use(errors());

app.use(centralizedErrorHandler);

mongoose.set('strictQuery', false);
async function connect() {
  await mongoose.connect(MONGO_URL);
  console.log(`Успешное подключение к БД по адресу${MONGO_URL}`);
  await app.listen(PORT);
  console.log(`Подключение успешно, порт ${PORT}`);
}
connect();
