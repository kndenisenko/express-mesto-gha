const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const REG_LINK = /^(?:(http|https):\/\/)?(?:[a-zA-Z]+\.){0,1}(?:[a-zA-Z0-9]+){1}(?:\.[a-zA-Z]{2,6})?(\/|\/\w\S*)?$/;

// Роутеры для get-запросов
router.get('/', getCards);

// Роутер для post-запроса
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(REG_LINK),
  }),
}), createCard);

// Роутер для delete-запроса
router.delete('/:cardId', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

// Роутер для лайка карточки
router.put('/:cardId/likes', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard);

// Роутер для дизлайка карточки
router.delete('/:cardId/likes', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

module.exports = router;
