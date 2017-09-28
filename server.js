"use strict";

const bodyParser   = require('body-parser'),
      bcrypt       = require('bcrypt'),
      http         = require('http'),
      finalhandler = require('finalhandler'),
      Router       = require('router'),
      router       = new Router({ mergeParams: true }),
      url          = require('url');

let messages = [];
let messageId = 1;

router.use(bodyParser.json());

router.get('/', (request, response) => {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.end('Hello, World!');
});

router.get('/messages', (request, response) => {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  let urlObject = url.parse(request.url, true);
  if (urlObject.query.encrypt == 'true') {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    let json = JSON.stringify(messages);
    bcrypt.hash(json, 10, (err, hash) => {
      response.end(hash);
    });
  } else {
    response.end(JSON.stringify(messages));
  }

});

router.get('/message/:id', (request, response) => {
  let message = messages.find(m => m.id == request.params.id);
  response.statusCode = 200;

  let urlObject = url.parse(request.url, true);
  if (urlObject.query.encrypt == 'true') {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    let json = JSON.stringify(message);
    bcrypt.hash(json, 10, (err, hash) => {
      response.end(hash);
    });
  } else {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify(message));
  }
});

router.post('/message', (request, response) => {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  let message = {
    id: messageId++,
    message: request.body.message
  };
  messages.push(message);
  response.end(`${message.id}`);
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