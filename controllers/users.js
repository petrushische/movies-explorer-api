// eslint-disable-next-line import/no-extraneous-dependencies
const bcryptjs = require('bcryptjs');

// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const userSchema = require('../models/users');

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require('../errors/NotFoundError');
const NewConflicktError = require('../errors/ConflickError');
const BadRequestError = require('../errors/BadRequestError');

// регистрация
module.exports.register = (req, res, next) => {
  const { email, password, name } = req.body;
  bcryptjs.hash(password, 10)
    .then((hash) => {
      userSchema.create({
        name, email, password: hash,
      })
        // eslint-disable-next-line no-unused-vars
        .then((user) => res.status(200).send({
          name, email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Ошибка валидации'));
          } else if (err.code === 11000) {
            next(new NewConflicktError('Пользователь с таким email уже существует'));
          } else {
            next(err);
          }
        });
    });
};

// логгин
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return userSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-mega-secret', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(next);
};

// Текущий пользователь
module.exports.usersMe = (req, res, next) => {
  userSchema.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

// обновление данных пользователя
module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  userSchema.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('not found user');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации'));
      } else {
        next(err);
      }
    });
};
