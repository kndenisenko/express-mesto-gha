const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
const { UnauthorizedError } = require('../errors/unauthorizedError');

const REG_LINK = /^(?:(ftp|http|https):\/\/)?(?:[a-zA-Z]+\.){0,1}(?:[a-zA-Z0-9][a-zA-Z0-9-]+){1}(?:\.[a-zA-Z]{2,6})?(\/|\/\w\S*)?$/;

// схема юзера
const userSchema = new mongoose.Schema({
  name: {
    type: String, // тип поля - строка
    default: 'Жак-Ив Кусто', // обязательное поле
    minlength: 2, // минимальное количество символов
    maxlength: 30, // максимальное количество символов
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => REG_LINK.test(v),
      message: () => 'Неправильный формат ссылки на картинку',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат электропочты',
    },
  },
  password: {
    type: String,
    required: true,
    unique: true,
    minlength: 8,
    select: false,
  },
});

// Схема идентификации юзера методами moongoose
// 14 спринт → Тема 2/9: Аутентификация и авторизация. Продолжение → Урок 5/7
userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      // не нашёлся — отклоняем
      if (!user) {
        return Promise.reject(new UnauthorizedError('401 - Юзер не найден'));
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { // Если не совпадает почта или пароль
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user; // почта и пароль совпал, теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
