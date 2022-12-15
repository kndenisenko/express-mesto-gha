const express = require('express');
const dotenv = require('dotenv');
const { celebrate, Joi } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { Error404 } = require('./errors/error404');
const { REG_LINK } = require('./regexp/reglink');

const { isAuthorized } = require('./middlewares/auth');

const { createUser, login } = require('./controllers/users');

// подключаем dotenv
dotenv.config();

const app = express();
const { PORT = 3000 } = process.env;

// Подключаем защиту от DDoS
// Ограничиваем количество запросов в 15 минут до 300 штук
// Хотя всё равно они прилетят за первые секунды. Наверное :)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  // legacyHeaders: false, // Disable the `X-RateLimit-*` headers --- уже отключено ниже, в helmet
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// Используем helmet и body parser
app.use(helmet());
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Подключаемся к БД
mongoose.connect('mongodb://localhost:27017/mestodb');

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
app.use((req, res, next) => {
  next(new Error404('404 - Страницы не существует'));
});

// Обработка ошибок celebrate
app.use(errors(app.err));

// Общая обработка ошибок. Надо перенести её отсюда, но как? :(
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
