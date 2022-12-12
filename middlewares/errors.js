module.exports.error = (err, res, errStatus, errorName, errorMessage) => {
  if (err.name === errorName) {
    return res.status(errStatus).send({
      message: errorMessage,
    });
  }

  return res.status(500).send({ message: '500 — Ошибка сервера' });
};
