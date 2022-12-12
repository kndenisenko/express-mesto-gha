const Card = require('../models/cards');
const { error } = require('../middlewares/errors');

module.exports.getCards = (req, res) => {
  Card.find()
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: '500 — Ошибка сервера' }));
};

// Контроллер создания юзера
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        error(
          err,
          res,
          '400',
          'ValidationError',
          '400 — Переданы некорректные данные при создании карточки',
        );
      } // return res.status(500).send({ message: '500 — Ошибка сервера' });
    });
};

// Контроллер удаления карточки
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({
          message: '404 — карточка с указанным _id не найдена',
        });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        error(
          err,
          res,
          '400',
          'CastError',
          '400 — карточка с указанным _id не найдена',
        );
      } // return res.status(500).send({ message: '500 — Ошибка сервера' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({
          message: '404 — карточка с указанным _id не найдена',
        });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        error(
          err,
          res,
          '400',
          'CastError',
          '400 — карточка с указанным _id не найдена',
        );
      } // return res.status(500).send({ message: '500 — Ошибка сервера' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({
          message: '404 — передан неверный _id, карточка не найдена',
        });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        error(
          err,
          res,
          '400',
          'CastError',
          '400 — карточка с указанным _id не найдена',
        );
      } // return res.status(500).send({ message: '500 — Ошибка сервера' });
    });
};
