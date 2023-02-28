// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const router = require('express').Router();

const {
  usersMe, updateUserInfo,
} = require('../controllers/users');

router.get('/users/me', usersMe);

router.patch('/users/me', express.json(), updateUserInfo);

module.exports = router;
