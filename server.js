"use strict";

let messages = [];
const http = require('http');
const finalhandler = require('finalhandler');
const Router = require('router');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const router = new Router({ mergeParams: true });
const Message = createMessage();
const urlParser    = require('url');
const querystring  = require('querystring');

function createMessage(){
  let MessageId = 0
  // return the class
  return class {
    constructor(message){
      this.message = message
      this.id = ++MessageId
    }
  }
}

router.use(bodyParser.json());

router.get('/', (request, response) => {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.end('Hello, World!')
});

router.post('/message', (request, response) => {
  // Save the message and send the message id back to the client.

  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (!request.body.message) {
    response.statusCode = 400;
    response.statusMessage = 'No message provided.';
    response.end();
    return;
  }

  let newMessage = new Message(request.body.message);

  messages.push(newMessage);
  response.end(JSON.stringify(newMessage.id));
});

router.get('/messages', (request, response) => {
  let url = urlParser.parse(request.url),
      params = querystring.parse(url.query);

  let result = JSON.stringify(messages);

  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (params.encrypt) {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return bcrypt.hash(result, 10, (error, hashed) => {
      if (error) {
        throw new Error();
      }
      response.end(hashed);
    });
  }

  response.end(result);
});

router.get('/message/:id', (request, response) => {
  let url    = urlParser.parse(request.url),
      params = querystring.parse(url.query);

  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (!request.params.id) {
    response.statusCode = 400;
    response.statusMessage = "No message id provided.";
    response.end();
    return;
  }

  let foundMessage = messages.find(message => message.id == request.params.id);

  if (!foundMessage) {
    response.statusCode = 404;
    response.statusMessage = `Unable to find a message with id ${request.params.id}`;
    response.end();
    return;
  }

  const result = JSON.stringify(foundMessage);

  if (params.encrypt) {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return bcrypt.hash(result, 10, (error, hashed) => {
      if (error) {
        throw new Error();
      }
      response.end(hashed);
    });
  }

  response.end(result);
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
