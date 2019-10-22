let id = 0;

class Message {
  constructor(message) {
    this.id = ++id;
    this.message = message;
  }
}

module.exports = Message;