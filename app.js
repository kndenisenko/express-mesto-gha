const express = require('express');

const app = express();

const { PORT = 3000, BASE_PATH } = process.env;

app.listen(PORT, () => {
  console.log('Ссылка на сервер:');
  console.log(BASE_PATH);
});