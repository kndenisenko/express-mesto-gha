const Card = require('../models/cards');
const { error } = require('../errors/errors');
const { NoUserId } = require('../errors/noUserId');
const { CastError } = require('../errors/castError');
const { Forbidden } = require('../errors/forbidden');

module.exports.getCards = (req, res) => {
  Card.find()
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: '500 — Ошибка сервера' }));
};

// Контроллер создания карточки
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
      }
    });
};

// Контроллер удаления карточки
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      const owner = card.owner.toHexString();
      if (!card) {
        next(new NoUserId('404 - Карточка с указанным _id не найдена'));
      } else if (owner === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .orFail(new Error('NoValidId'))
          .then((cardDeleted) => res.send(cardDeleted))
          .catch((err) => {
            if (err.message === 'NoValidId') {
              next(new NoUserId('404 - Карточка с указанным _id не найдена'));
            } else {
              next(err);
            }
          });
      } else {
        next(new Forbidden('403 — чужие карточки удалять нельзя;'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('400 —  Карточка с указанным _id не найдена'));
      } else if (err.name === 'TypeError') {
        next(new NoUserId('404 - Удаление карточки с несуществующим _id'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('NoValidId'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        res
          .status(404)
          .send({ message: '404 — Передан несуществующий _id карточки' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('NoValidId'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        res
          .status(404)
          .send({ message: '404 — Передан несуществующий _id карточки' });
      }
    });
};
