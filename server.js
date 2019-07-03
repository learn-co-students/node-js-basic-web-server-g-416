"use strict";

const http = require('http');
const finalhandler = require('finalhandler');
const Router = require('router');
const bodyParser = require('body-parser');
const Message = require('./message');
const bcrypt = require('bcrypt');
const querystring = require('querystring');
const urlParser = require('url');

const router = new Router({ mergeParams: true });

router.use(bodyParser.json());

let messages = [];

router.get('/', (request, response) => {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8')
  response.end('Hello, World!');
});

router.post('/message', (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  const newMessage = new Message(request.body.message);
  messages.push(newMessage);

  response.end(JSON.stringify(newMessage.id));
});

router.get('/message/:id', (request, response) => {
  let url = urlParser.parse(request.url);
  let params = querystring.parse(url.query);

  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  const message = messages.find( message => message.id.toString() === request.params.id);

  if (!message) {
    response.statusCode = 404;
    response.statusMessage = `Unable to find a message with id ${request.params.id}`;
    response.end();
    return;
  }

  const result = JSON.stringify(message);

  if (params.encrypt) {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return bcrypt.hash(result, 10, (err, hash) => {
      response.end(hash);
    });
  }

  response.end(result)
});

router.get('/messages', (request, response) => {
  let url = urlParser.parse(request.url);
  let params = querystring.parse(url.query);

  let result = JSON.stringify(messages);

  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (params.encrypt) {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return bcrypt.hash(result, 10, (error, hashed) => {
      if (error) {
        throw new Error();
      }
      response.end(hashed);
    });df
  }

  response.end(result);
})

const server = http.createServer((request, response) => {
  router(request, response, finalhandler(request, response));
});

exports.listen = function(port, callback) {
  server.listen(port, callback);
};

exports.close = function(callback) {
  server.close(callback);
};