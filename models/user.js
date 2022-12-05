const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String, // тип поля - строка
    required: true, // обязательное поле
    minlength: 2, // минимальное количество символов
    maxlength: 30, // максимальное количество символов
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
