const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');

const mongooseUniqueValidator = require('mongoose-unique-validator');

const Unauthorized = require('../errors/unauthorized');

const usersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный адрес электронной почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

usersSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
        }
        return user;
      });
    });
};

usersSchema.plugin(mongooseUniqueValidator, { message: 'Пользователь с таким E-Mail уже существует' });
module.exports = mongoose.model('user', usersSchema);
