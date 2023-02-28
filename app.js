const dotenv = require('dotenv');

dotenv.config();

const { errors, celebrate, Joi } = require('celebrate');

const express = require('express');

const mongoose = require('mongoose');

const { centralizedErrorHandler } = require('./centralizedErrorHandler/centralizedErrorHandler');

const NotFoundError = require('./errors/NotFoundError');

const auth = require('./middlewares/auth');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { register, login } = require('./controllers/users');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const userRouter = require('./routes/userRoutes');

const movieRouter = require('./routes/movieRoutes');

const app = express();

app.use(requestLogger); //  логгер запросов

app.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login); // авторизация

app.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), register); // регистрация

app.use(auth, userRouter);

app.use(auth, movieRouter);

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
