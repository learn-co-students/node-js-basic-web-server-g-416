"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const urlParser = require('url');
const querystring = require('querystring');

const router = new Router();

router.use(bodyParser.json());

const parseEncrypt = request => querystring.parse(urlParser.parse(request.url).query).encrypt === 'true';

let messages = [],
	Message = require("./lib/message");

router.get('/', (request, response) => {
  // A good place to start!
  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.write('Hello, World!');
  response.end();
});

router.get('/messages', (request, response) => {
	let shouldEncrypt = parseEncrypt(request),
		messagesJson = JSON.stringify(messages);
	response.statusCode = 200;

	if (shouldEncrypt) {
		response.setHeader('Content-Type', 'text/plain; charset=utf-8');
		bcrypt.hash(messagesJson, 10, (error, hashed) => {
			if (error) {
				throw new Error();
			}
			response.end(hashed);
		});
	} else {

		response.setHeader('Content-Type', 'application/json; charset=utf-8');
		response.write(messagesJson);
		response.end();
	}
});

router.get('/message/:id', (request, response) => {
	let id = parseInt(request.params.id, 10),
		shouldEncrypt = parseEncrypt(request),
		matchingMessage = messages.find(message => message.id === id);

	response.setHeader('Content-Type', 'application/json; charset=utf-8');
	

	if (typeof matchingMessage !== 'object' || matchingMessage === null) {
		response.statusCode = 404;
		response.statusMessage = `Cannot find message with id ${id}`;
	} else if (matchingMessage.constructor === Message) {
		let matchingMessageJson = JSON.stringify(matchingMessage);
		response.statusCode = 200;
		if (shouldEncrypt) {
			response.setHeader('Content-Type', 'text/plain; charset=utf-8');
			return bcrypt.hash(matchingMessageJson, 10, (error, hashed) => {
				if (error) {
					throw new Error();
				}
				response.end(hashed);
			});
		} else {
			response.write(matchingMessageJson);
		}
	} else {
		response.statusCode = 500;
		response.statusMessage = "Server encountered an expected error. Please contact technical support."
	}

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
