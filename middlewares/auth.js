const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/unauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

// Значаение payload будет перезаписано, поэтому оно создано через let
let payload;

// Обработка авторизации
const isAuthorized = (req, res, next) => {
  const auth = req.headers.authorization;

  // Если аутентификация неудачна
  if (!auth) {
    throw new UnauthorizedError('Введите логин и пароль');
  }

  const token = auth.replace('Bearer ', '');

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : '%YfbWcx5ks@kviWTaB#aCqW9Y*');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;
  next();
};

module.exports = { isAuthorized };
