const jwt = require('jsonwebtoken');
const { token } = require('../controllers/users'); // Берём токен, созданный в контроллере юзера

// Значаение payload будет перезаписано, поэтому оно создано через let
let payload;

// Обработка ошибок авторизации
const handleAuthErrors = (res) => {
  res.status(401)
    .send({ message: 'Требуется авторизация' });
};

// миддлвэр авторизации
const auth = (req, res, next) => {
  // если токен не токен, то возвращаем ошибку
  if (!token) {
    console.log('auth-log:', token);
    return handleAuthErrors(res);
  }

  try {
    payload = jwt.verify(token, '%YfbWcx5ks@kviWTaB#aCqW9Y*');
  } catch (err) { // Ловим ошибку
    return handleAuthErrors(res);
  }

  return next(); // пропускаем запрос дальше
};

module.exports = { auth, payload };
