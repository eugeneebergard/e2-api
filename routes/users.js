const usersRouter = require('express').Router();
const { getMe, updateMe } = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');
const rateLimiterUsingThirdParty = require('../middlewares/rateLimit');
const BadRequest = require("../errors/badRequest");

usersRouter.get('/me', getMe);

usersRouter.put(
  '/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email()
        .error(() => new BadRequest('Email должен быть корректного формата')),
      password: Joi.string().min(8)
        .error(() => new BadRequest('Пароль должен быть длиннее 8 символов')),
      name: Joi.string().min(2).max(30)
        .error(() => new BadRequest('Имя должно быть длинною от 2 до 30 символов')),
    }),
  }),
  rateLimiterUsingThirdParty,
  updateMe
);

module.exports = usersRouter;
