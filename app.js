const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const validator = require('validator ');

const app = express();

const { PORT = 3000 } = process.env;

// Используем body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Подключаемся к БД
mongoose.connect('mongodb://localhost:27017/mestodb');

// Эмуляция авторизации из описания ПР
app.use((req, res, next) => {
  req.user = {
    _id: '638cc711793262883c4a1f55', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

// Используем Роуты
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// Ошибка 404 для несуществующих страниц
app.use((req, res) => {
  res.status(404).send({ message: 'Ошибка 404. Запрошенной Страницы не существует' });
});

app.listen(PORT, () => {
  // console.log('Ссылка на сервер:');
  // console.log('http://localhost:' + PORT);
});
