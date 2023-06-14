const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { createUser, login } = require('../controllers/users');

const auth = require('../middlewares/auth');
const rateLimiterUsingThirdParty = require('../middlewares/rateLimit');

const NotFound = require('../errors/notFound');

const usersRouter = require('./users');
const articlesRouter = require('./articles');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  rateLimiterUsingThirdParty,
  createUser
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  rateLimiterUsingThirdParty,
  login
);

router.use('/users', auth, rateLimiterUsingThirdParty, usersRouter);
router.use('/articles', auth, rateLimiterUsingThirdParty, articlesRouter);
router.use((req, res, next) => {
  next(new NotFound('Запрашиваемый ресурс не найден'));
});

module.exports = router;
