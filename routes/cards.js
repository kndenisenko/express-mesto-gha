const router = require('express').Router();
const {
  getCards,
  getCardsById,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// Роутеры для get-запросов
router.get('/', getCards);
router.get('/:id', getCardsById);

// Роутер для post-запроса
router.post('/', createCard);

// Роутер для delete-запроса
router.delete('/:cardId', deleteCard);

// Роутер для лайка карточки
router.put('/:cardId/likes', likeCard);

// Роутер для дизлайка карточки
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
