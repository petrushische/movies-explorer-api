// eslint-disable-next-line import/no-extraneous-dependencies
const dotenv = require('dotenv');

dotenv.config();

// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');

// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/diplomBD' } = process.env;

const app = express();

mongoose.set('strictQuery', false);
async function connect() {
  await mongoose.connect(MONGO_URL);
  console.log(`Успешное подключение к БД по адресу${MONGO_URL}`);
  await app.listen(PORT);
  console.log(`Подключение успешно, порт ${PORT}`);
}
connect();
