const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { error } = require('../middlewares/errors');

// Контроллер для получения инфы о юзере, без его ID
module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      res.send(user);
    })
    .catch(() => res.status(500).send({ message: '500 — Ошибка по умолчанию.' }));
};

// Контроллер для выдачи списка юзеров
module.exports.getUsers = (req, res) => {
  User.find(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: '500 — Ошибка по умолчанию.' }));
};

// Контроллер для поиска юзера по id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: '404 — Пользователь с указанным _id не найден',
        });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        error(
          err,
          res,
          '400',
          'CastError',
          '400 - Передан невалидный _id, пользователь не найден',
        );
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
        if (err.code === 11000) {
          next(error(
            err,
            res,
            '409',
            'ValidationError',
            '409 - пользователь с такой почтой уже зарегистрирован',
          ));
          return;
        }
        error(
          err,
          res,
          '400',
          'ValidationError',
          '400 - передены некорректные данные при создании пользоватея',
        );
      }));
};

// Контроллер изменения имени и био Юзера updateUser
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  // new: true - чтобы возвращать данные обновлённого пользователя вместо старого
  // runValidators: true - валидация данных по схемам moongoose
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })

    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      error(
        err,
        res,
        '400',
        'ValidationError',
        '400 — Переданы некорректные данные при обновлении профиля',
      );
    });
};

// Контроллер изменения аватара юзера
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      error(
        err,
        res,
        '400',
        'ValidationError',
        '400 — Переданы некорректные данные при обновлении аватара',
      );
    });
};

// login
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password) // login
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};
