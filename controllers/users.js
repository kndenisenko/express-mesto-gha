const User = require('../models/user');

// Контроллер для выдачи списка юзеров
module.exports.getUsers = (req, res) => {
  User.find(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка getUsers ${err.message}` }));
};

// Контроллер для поиска юзера по id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка getUserById ${err.message}` }));
};

// Контроллер создания юзера
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка createUser ${err.message}` }));
};
