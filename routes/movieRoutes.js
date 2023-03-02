const express = require('express');

const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();

const auth = require('../middlewares/auth');

const {
  getMovies, createMovie, cancellationDelete, deleteMovie,
} = require('../controllers/movies');

router.get('/movies', auth, getMovies);

router.post('/movies', auth, express.json(), celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/).required(),
    trailer: Joi.string().regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/).required(),
    movieId: Joi.number().required(),
  }),
}), createMovie);

router.delete('/movies/:_id', auth, celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24).required(),
  }),
}), cancellationDelete, deleteMovie);

module.exports = router;
