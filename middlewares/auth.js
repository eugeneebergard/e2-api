const jwt = require('jsonwebtoken');

const Unauthorized = require('../errors/unauthorized');

const { key } = require('../config');

const extractBearerToken = header => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized('Необходима авторизация'));
  }
  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, key);
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
