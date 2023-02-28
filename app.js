// eslint-disable-next-line import/no-extraneous-dependencies
const dotenv = require('dotenv');

dotenv.config();

// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');

// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

const NotFoundError = require('./errors/NotFoundError');

const auth = require('./middlewares/auth');

const { register, login } = require('./controllers/users');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/diplomBD' } = process.env;

const userRouter = require('./routes/userRoutes');

const movieRouter = require('./routes/movieRoutes');

const app = express();

app.post('/signin', express.json(), login); // авторизация

app.post('/signup', express.json(), register); // регистрация

app.use(auth, userRouter);

app.use(auth, movieRouter);

// eslint-disable-next-line no-unused-vars
app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('page not found'));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
});

mongoose.set('strictQuery', false);
async function connect() {
  await mongoose.connect(MONGO_URL);
  // eslint-disable-next-line no-console
  console.log(`Успешное подключение к БД по адресу${MONGO_URL}`);
  await app.listen(PORT);
  // eslint-disable-next-line no-console
  console.log(`Подключение успешно, порт ${PORT}`);
}
connect();
