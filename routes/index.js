const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { createUser, login } = require('../controllers/users');

const auth = require('../middlewares/auth');
const rateLimiterUsingThirdParty = require('../middlewares/rateLimit');

const NotFound = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');

const usersRouter = require('./users');
const articlesRouter = require('./articles');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email()
        .error(() => new BadRequest('Email должен быть корректного формата')),
      password: Joi.string().required().min(8)
        .error(() => new BadRequest('Пароль должен быть длиннее 8 символов')),
      name: Joi.string().required().min(2).max(30)
        .error(() => new BadRequest('Имя должно быть длинною от 2 до 30 символов')),
    }),
  }),
  rateLimiterUsingThirdParty,
  createUser
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email()
        .error(() => new BadRequest('Некорректный email')),
      password: Joi.string().required()
        .error(() => new BadRequest('Не указан пароль')),
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
