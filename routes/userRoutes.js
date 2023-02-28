const express = require('express');

const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();

const {
  usersMe, updateUserInfo,
} = require('../controllers/users');

router.get('/users/me', usersMe);

router.patch('/users/me', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUserInfo);

module.exports = router;
