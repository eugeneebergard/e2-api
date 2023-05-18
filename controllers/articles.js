const mongoose = require('mongoose');

const article = require('../models/article');
const BadRequest = require('../errors/badRequest');
const Forbidden = require('../errors/forbidden');
const NotFound = require('../errors/notFound');

module.exports.getArticles = (req, res, next) => {
  article
    .find({ owner: req.user._id })
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  article
    .create({ keyword, title, text, date, source, link, image, owner: req.user._id })
    .then((articles) => res.send({ data: articles }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Некорректная ссылка');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.articleId)) {
    throw new BadRequest('Некорректный ID');
  }

  return article
    .findById(req.params.articleId)
    .orFail(new NotFound('Статья не найдена'))
    .then((foundArticle) => {
      if (foundArticle.owner.toString() !== req.user._id) {
        throw new Forbidden('Вы не являетесь обладателем статьи');
      }
      return article
        .deleteOne(foundArticle)
        .then(() => res.send({ message: 'Статья удалена' }))
        .catch(next);
    })
    .catch(next);
};
