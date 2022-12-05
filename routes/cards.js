const router = require('express').Router();
const {
  getCards,
  getCardsById,
  createCard,
  deleteCard,
} = require('../controllers/cards');

// Роутеры для get-запросов
router.get('/', getCards);
router.get('/:id', getCardsById);

// Роутер для post-запроса
router.post('/', createCard);

// Роутер для delete-запроса
router.delete('/:cardId', deleteCard);

module.exports = router;
