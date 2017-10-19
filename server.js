"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');

const router = new Router();

const bodyParser = require('body-parser');

router.use(bodyParser.json());

let messages = [];

class Message {
	constructor(message) {
		this.message = message;
		this.id = this.constructor.nextId;
		this.constructor.nextId++;
	}
}

Message.nextId = 1;

router.get('/', (request, response) => {
  // A good place to start!
  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.write('Hello, World!');
  response.end();
});

router.get('/messages', (request, response) => {
	response.statusCode = 200;
	response.setHeader('Content-Type', 'application/json; charset=utf-8');
	response.write(JSON.stringify(messages));
	response.end();
});

router.post('/message', (request, response) => {
	let message;
	response.setHeader('Content-Type', 'application/json; charset=utf-8');

	if (typeof request.body.message !== 'string') {
		response.statusCode = 400;
		response.statusMessage = 'No message provided.';
	} else {
		message = new Message(request.body.message);
		response.statusCode = 200;
		messages.push(message);
		response.write(JSON.stringify(message.id));
	}
	response.end();
});

const server = http.createServer((request, response) => {
  router(request, response, finalhandler(request, response));
});

exports.listen = function(port, callback) {
  server.listen(port, callback);
};

exports.close = function(callback) {
  server.close(callback);
};
