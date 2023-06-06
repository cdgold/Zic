function DatabaseError(message) {
    this.name = 'DatabaseError';
    this.message = message || '';
    var error = new Error(this.message);
    error.name = this.name;
    this.stack = error.stack;
    this.status = 400
  }

  module.exports = { DatabaseError }