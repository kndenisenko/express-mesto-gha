// https://javascript.info/custom-errors

class NoUserId extends Error {
  constructor(message) {
    super(message);
    this.name = 'NoUserId';
    this.statusCode = 404;
  }
}

module.exports = { NoUserId };
