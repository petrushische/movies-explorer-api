const router = require('express').Router();

const userRouter = require('./userRoutes');

const movieRouter = require('./movieRoutes');

router.use(userRouter);

router.use(movieRouter);

module.exports = router;
