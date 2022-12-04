const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
} = require('../controllers/users');

// Роутеры для get-запросов
router.get('/', getUsers);
router.get('/:id', getUserById);

// Роутер для post-запроса
router.post('/', createUser);

module.exports = router;
