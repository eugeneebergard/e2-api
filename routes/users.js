const usersRouter = require('express').Router();
const { getMe, updateMe } = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');
const rateLimiterUsingThirdParty = require('../middlewares/rateLimit');

usersRouter.get('/me', getMe);

usersRouter.put(
  '/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string().min(8),
      name: Joi.string().min(2).max(30),
    }),
  }),
  rateLimiterUsingThirdParty,
  updateMe
);

module.exports = usersRouter;
