const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const REG_LINK = /^(?:(http|https):\/\/)?(?:[a-zA-Z]+\.){0,1}(?:[a-zA-Z0-9]+){1}(?:\.[a-zA-Z]{2,6})?(\/|\/\w\S*)?$/;

// Роутеры для get-запросов
router.get('/', getUsers); // /users

router.get('/:id', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.get('/me', getUser);

// Роутер для обновления инфы о юзере
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

// Роутер изменения аватара
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(REG_LINK),
  }),
}), updateAvatar);

// Роутер для нового юзера и логина
// router.post('/signup', createUser); // новый юзер
// router.post('/signin', login); // логин текущего юзера

module.exports = router;
