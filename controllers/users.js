const User = require('../models/user');

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
        return res.status(400).send({
          message: '400 — Передан невалидный _id, пользователь не найден.',
        });
      } return res.status(500).send({ message: '500 — Ошибка сервера' });
    });
};

// Контроллер создания юзера createUser
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: '400 — Переданы некорректные данные при создании пользователя',
        });
      } return res.status(500).send({ message: '500 — Ошибка сервера' });
    });
};

// Контроллер изменения имени и био Юзера updateUser
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  // new: true - чтобы возвращать данные обновлённого пользователя вместо старого
  // runValidators: true - валидация данных по схемам moongoose
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })

    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: '400 — Переданы некорректные данные при обновлении профиля.',
        });
      } return res.status(500).send({ message: '500 — Ошибка сервера' });
    });
};

// Контроллер изменения аватара юзера
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: '400 — Переданы некорректные данные при обновлении аватара.',
        });
      } return res.status(500).send({ message: '500 — Ошибка сервера' });
    });
};
