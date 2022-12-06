const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// Роутеры для get-запросов
router.get('/', getUsers);
router.get('/:id', getUserById);

// Роутер для post-запроса
router.post('/', createUser);

// Роутер для обновления инфы о юзере
router.patch('/me', updateUser);

// Роутер изменения аватара
router.patch('/me/avatar', updateAvatar);

module.exports = router;
