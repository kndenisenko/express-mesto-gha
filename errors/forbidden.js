// https://javascript.info/custom-errors

class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.name = 'NoPermission';
    this.statusCode = 403;
  }
}

module.exports = { Forbidden };
