const mongoose = require('mongoose');

// Просто так ObjectId не задался в поле type
// Задаём его через const для всех нужных полей
// const { ObjectId } = mongoose.Schema.Types.ObjectId;

const cardsSchema = mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    // Произошла ошибка createCard card validation failed:
    // likes: Cast to ObjectId failed for value \"[]\" (type Array)
    // at path \"likes\" because of \"BSONTypeError\"
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardsSchema);
