const Card = require('../models/cards');

module.exports.getCards = (req, res) => {
  Card.find()
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка getCards ${err.message}` }));
};

// Контроллер для поиска юзера по id
module.exports.getCardsById = (req, res) => {
  Card.findById(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка getCardsById ${err.message}` }));
};

// Контроллер создания юзера
module.exports.createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка createCard ${err.message}` }));
};
