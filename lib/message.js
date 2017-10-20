class Message {
	constructor(message) {
		this.id = this.constructor.nextId;
		this.message = message;
		this.constructor.nextId++;
	}
}

Message.nextId = 1;

module.exports = Message;