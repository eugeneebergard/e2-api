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
      return res.send({
        user: {
          email: foundUser.email,
          name: foundUser.name
        }
      });
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
        user: {
          email: updatedUser.email,
          name: updatedUser.name
        }
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
        user: {
          email: newUser.email,
          name: newUser.name,
        }
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
    .then(foundUser => res.send({ user: foundUser }))
    .catch(err => next(err));
};

module.exports.checkUser = async (req, res) => {
  const token = req.cookies.jwt;

  if (!token) return res.send({ isAuth: false })

  try {
    jwt.verify(token, key);
    res.send({ isAuth: true })
  } catch (err) {
    res.send({ isAuth: false })
  }
}


module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!password) {
    return next(new Unauthorized('Необходимо ввести пароль'));
  }

  return user
    .findUserByCredentials(email, password)
    .then(userObj => {
      const token = jwt.sign({ _id: userObj._id }, key, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ message: 'Success' });
    })
    .catch(err => next(err));
};

module.exports.logout = async (req, res) => {
  res.clearCookie('jwt');
  res.send({ message: 'Success' })
};
