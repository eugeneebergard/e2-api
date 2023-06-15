const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const BadRequest = require('../errors/badRequest');
const Conflict = require('../errors/conflict');
const NotFound = require('../errors/notFound');
const Unauthorized = require('../errors/unauthorized');
const user = require('../models/user');
const { key } = require('../config');

module.exports.getMe = (req, res, next) => {
  user
    .findById(req.user._id)
    .then(foundUser => {
      return res.send({ email: foundUser.email, name: foundUser.name });
    })
    .catch(err => next(err));
};

module.exports.updateMe = async (req, res, next) => {
  const { email, password, name } = req.body;

  return bcrypt
    .hash(password, 10)
    .then(hash => {
      return user.findByIdAndUpdate(
        req.user._id,
        { email, password: hash, name },
        { new: true, runValidators: true, context: 'query' }
      );
    })
    .then(updatedUser =>
      res.send({
        data: {
          email: updatedUser.email,
          name: updatedUser.name,
        },
      })
    )
    .catch(err => {
      if (err.name === 'ValidationError') {
        if (err.errors.email && err.errors.email.kind === 'unique') {
          next(new Conflict('Пользователь с таким E-mail уже существует'));
        } else {
          next(err);
        }
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!password || password.length < 8) {
    throw new BadRequest('Задайте пароль не менее 8 символов');
  }

  return bcrypt
    .hash(password, 10)
    .then(hash => user.create({ email, password: hash, name }))
    .then(newUser =>
      res.send({
        data: {
          email: newUser.email,
          name: newUser.name,
        },
      })
    )
    .catch(err => {
      if (err.name === 'ValidationError') {
        if (err.errors.email && err.errors.email.kind === 'unique') {
          next(new Conflict('Пользователь с таким E-mail уже существует'));
        } else {
          next(err);
        }
      }
    });
};

module.exports.getUser = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    throw new BadRequest('Некорректный ID');
  }

  user
    .findById(req.params.userId)
    .orFail(new NotFound('Пользователь с таким id не найден'))
    .then(foundUser => res.send(foundUser))
    .catch(err => next(err));
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!password) {
    return next(new Unauthorized('Необходимо ввести пароль'));
  }

  return user
    .findUserByCredentials(email, password)
    .then(userObj => {
      const token = jwt.sign({ _id: userObj._id }, key, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(err => next(err));
};
