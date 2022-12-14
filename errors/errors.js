module.exports.error = (err, res, errCode, errorName, errorMessage) => {
  if (err.name === errorName) {
    return res.status(errCode).send({
      message: errorMessage,
    });
  }

  return res.status(500).send({ message: '500 — Ошибка сервера' });
};
