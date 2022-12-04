const mongoose = require('mongoose');

// Просто так ObjectId не задался в поле type
// Задаём его через const для всех нужных полей
const ObjectId = mongoose.Types.ObjectId();

const userSchema = new mongoose.Schema({
  name: {
    type: String, // тип поля - строка
    required: true, // обязательное поле
    minlength: 2, // минимальное количество символов
    maxlength: 30, // максимальное количество символов
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: ObjectId,
    required: true,
  },
  likes: {
    type: ObjectId,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', userSchema);
