const articlesRouter = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');

articlesRouter.get('/', getArticles);

articlesRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      image: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true })) return value;
          return helpers.message('Поле image не является URL ссылкой');
        }),
      link: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true })) return value;
          return helpers.message('Поле link не является URL ссылкой');
        }),
    }),
  }),
  createArticle
);

articlesRouter.delete(
  '/:articleId',
  celebrate({
    params: Joi.object().keys({
      articleId: Joi.string().length(24).hex(),
    }),
  }),
  deleteArticle
);

module.exports = articlesRouter;
