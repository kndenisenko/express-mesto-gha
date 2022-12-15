const mongoose = require('mongoose');
const { REG_LINK } = require('../regexp/reglink');

const cardsSchema = new mongoose.Schema({
  name: {
    type: String, // тип поля - строка
    required: true, // обязательное поле
    minlength: 2, // минимальное количество символов
    maxlength: 30, // максимальное количество символов
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return REG_LINK.test(link);
      },
      message: () => 'Неверная ссылка на картинку',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardsSchema);
