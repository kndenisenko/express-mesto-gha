const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  // createUser,
  // login,
} = require('../controllers/users');

// Роутеры для get-запросов
router.get('/', getUsers);
router.get('/:id', getUserById);

// Роутер для обновления инфы о юзере
router.patch('/me', updateUser);

// Роутер изменения аватара
router.patch('/me/avatar', updateAvatar);

// Роутер для нового юзера и логина
// router.post('/signup', createUser); // новый юзер
// router.post('/signin', login); // логин текущего юзера

module.exports = router;
