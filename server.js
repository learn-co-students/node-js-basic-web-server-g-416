"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const urlParser    = require('url');
const querystring  = require('querystring');
const bodyParser   = require('body-parser');
const bcrypt = require('bcrypt');

const router = new Router({ mergeParams: true });
router.use(bodyParser.json());

const saltRounds = 10;
let messages = [];


class Message {
  constructor(input) {
    this.id = messages.length + 1;
    this.message = input.message;
  }
}

router.get('/', (request, response) => {
  const body = 'Hello, World!';
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.end(body);
});

router.post('/message', (request, response) => {
  let newMessage = new Message(request.body);
  messages.push(newMessage);

  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(newMessage.id));
});

router.get('/messages', (request, response) => {
  const body = JSON.stringify(messages);
  const url = urlParser.parse(request.url);
  const query = querystring.parse(url.query);

  if(query.encrypt) {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    bcrypt.hash(body, saltRounds, (err, hashedBody) => {
      response.end(hashedBody);
    });
  }

  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(body);
});

router.get('/message/:id', (request, response) => {
  const message = messages[request.params.id - 1];
  const body = JSON.stringify(message);
  const url = urlParser.parse(request.url);
  const query = querystring.parse(url.query);

  if(query.encrypt) {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    bcrypt.hash(body, saltRounds, (err, hashedBody) => {
      response.end(hashedBody);
    });
  }

  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(body);
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
