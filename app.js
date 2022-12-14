const express = require('express');
const { celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { isAuthorized } = require('./middlewares/auth');

const {
  createUser,
  login,
} = require('./controllers/users');

const REG_LINK = /^(?:(ftp|http|https):\/\/)?(?:[a-zA-Z]+\.){0,1}(?:[a-zA-Z0-9][a-zA-Z0-9-]+){1}(?:\.[a-zA-Z]{2,6})?(\/|\/\w\S*)?$/;

const app = express();
const { PORT = 3000 } = process.env;

// Используем helmet и body parser
app.use(helmet());
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Подключаемся к БД
mongoose.connect('mongodb://localhost:27017/mestodb');

// Эмуляция авторизации из описания ПР
// app.use((req, res, next) => {
//   req.user = {
//     _id: '639749daa603a64dec4d9314', // _id созданного в предыдущем пункте пользователя
//   };

//   next();
// });

// Роуты для логина и регистрации
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(REG_LINK),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

// Защищаем авторизацией всё что ниже
app.use(isAuthorized);

// Используем Роуты
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// Ошибка 404 для несуществующих страниц
app.use((req, res) => {
  res.status(404).send({ message: 'Ошибка 404. Запрошенной Страницы не существует' });
});

// Обработка ошибок celebrate
app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  res.status(500).send({ message: err });

  return next();
});

app.listen(PORT, () => {
  // console.log('Ссылка на сервер:');
  // console.log('http://localhost:' + PORT);
});
