const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { REG_LINK } = require('../regexp/reglink');
const {
  getUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// Роутеры для get-запросов
router.get('/', getUsers); // выдать всех юзеров

router.get('/me', getUser); // текущий юзер, по идее залогиненный

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), getUserById);

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
