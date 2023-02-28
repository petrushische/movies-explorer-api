// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const router = require('express').Router();

const {
  getMovies, createMovie, cancellationDelete, getCardsId,
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', express.json(), createMovie);

router.delete('/movies/:_id', cancellationDelete);

router.delete('/movies/:_id', getCardsId);

module.exports = router;
