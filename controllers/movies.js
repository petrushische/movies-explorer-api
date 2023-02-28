const movieSchema = require('../models/movies');

const NotFoundError = require('../errors/NotFoundError');

const BadRequestError = require('../errors/BadRequestError');

const DeleteError = require('../errors/DeleteError');

// поиск всех фильмов, сохраненных текущим пользователем
module.exports.getMovies = (req, res, next) => {
  movieSchema.find({ owner: req.user._id })
    .populate(['owner'])
    .then((card) => res.status(200).send(card))
    .catch(next);
};

// создание фильма
module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailer, nameRU, nameEN, thumbnail,
    movieId,
  } = req.body;
  movieSchema.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => movie.populate('owner'))
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации'));
      } else {
        next(err);
      }
    });
};

// Удаление фильма
module.exports.cancellationDelete = (req, res, next) => {
  movieSchema.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('not found Movie');
      } else if (req.user._id !== movie.owner._id.toHexString()) {
        throw new DeleteError('Вы не можете удалить этот фильм так как не являетесь его создателем');
      }
      next();
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.getCardsId = (req, res, next) => {
  movieSchema.findByIdAndRemove(req.params._id)
    .populate(['owner'])
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('not found Movie');
      }
      res.status(200).send(movie);
    })
    .catch(next);
};
