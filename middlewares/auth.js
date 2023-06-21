const jwt = require('jsonwebtoken');

const Unauthorized = require('../errors/unauthorized');

const { key } = require('../config');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, key);
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};
