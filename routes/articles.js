const articlesRouter = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');
const BadRequest = require("../errors/badRequest");

articlesRouter.get('/', getArticles);

articlesRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required()
        .error(() => new BadRequest('Не указано поле keyword')),
      title: Joi.string().required()
        .error(() => new BadRequest('Не указано поле title')),
      text: Joi.string().required()
        .error(() => new BadRequest('Не указано поле text')),
      date: Joi.string().required()
        .error(() => new BadRequest('Не указано поле date')),
      source: Joi.string().required()
        .error(() => new BadRequest('Не указано поле source')),
      image: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true })) return value;
          return helpers.message('Поле image обязательно и должно являться URL ссылкой');
        }),
      link: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true })) return value;
          return helpers.message('Поле link обязательно и должно являться URL ссылкой');
        }),
    }),
  }),
  createArticle
);

articlesRouter.delete(
  '/:articleId',
  celebrate({
    params: Joi.object().keys({
      articleId: Joi.string().length(24).hex()
        .error(() => new BadRequest('Некорректный ID статьи')),
    }),
  }),
  deleteArticle
);

module.exports = articlesRouter;
