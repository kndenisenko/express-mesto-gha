const router = require('express').Router();
const {
  getCards,
  getCardsById,
  createCard,
} = require('../controllers/cards');

// Роутеры для get-запросов
router.get('/', getCards);
router.get('/:id', getCardsById);

// Роутер для post-запроса
router.post('/', createCard);

module.exports = router;
