const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ValidationError } = require('../errors/validationError');
const { ConflictError } = require('../errors/castError');
const { CastError } = require('../errors/castError');
const { NoUserId } = require('../errors/noUserId');

// Контроллер для получения инфы о юзере, без его ID
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

// Контроллер для выдачи списка юзеров
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

// Контроллер для поиска юзера по id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new Error('NoValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        next(new NoUserId('404 - Пользователь не существует'));
      } else if (err.message === 'CastError') {
        next(new CastError('400 —  Некорректное ID пользователя'));
      } else {
        next(err);
      }
    });
};

// Контроллер создания юзера createUser
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })

      .then((user) => {
        const data = {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        };
        res.status(201).send(data);
      })
      .catch((err) => {
        console.log(name);
        if (err.code === 409) {
          next(new ConflictError('409 - Почта уже используется, смените почту'));
        } else if (err.name === 'ValidationError') {
          next(new ValidationError('400 - Переданы некорректные данные при создании пользователя'));
        } else {
          next(err);
        }
      }));
};

// Контроллер изменения имени и био Юзера updateUser
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  // new: true - чтобы возвращать данные обновлённого пользователя вместо старого
  // runValidators: true - валидация данных по схемам moongoose
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })

    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 —  Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

// Контроллер изменения аватара юзера
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 — Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
};

// login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password) // login
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign({ _id: user._id }, '%YfbWcx5ks@kviWTaB#aCqW9Y*', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
