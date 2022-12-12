const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');

// const saltRounds = 10;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';

const userSchema = new mongoose.Schema({
  name: {
    type: String, // тип поля - строка
    default: 'Жак-Ив Кусто',
    minlength: 2, // минимальное количество символов
    maxlength: 30, // максимальное количество символов
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат адреса электронной почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
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
  },
});

module.exports = mongoose.model('user', userSchema);
