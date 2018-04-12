"use strict";

const http         = require('http');
const urlParser    = require('url');
const finalhandler = require('finalhandler');
const Router       = require('router');
const bodyParser   = require('body-parser');
const queryString  = require('querystring');
const bcrypt       = require('bcrypt');

const router = new Router();

router.use(bodyParser.json());

let messages = [];
let id = 0;

router.get('/', (request, response) => {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.end('Hello, World!');
});

router.post('/message', (request, response) => {
  messages.push({ ...request.body, id: ++id });
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(id));
});

router.get('/messages', (request, response) => {
  let url    = urlParser.parse(request.url),
      params = queryString.parse(url.query);

  if (params.encrypt) {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return bcrypt.hash(JSON.stringify(messages), 10, (error, hashed) => {
      if (error) {
        throw new Error();
      }
      response.end(hashed);
    });
  }
  console.log(messages);
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(messages));
});

router.get('/message/:id', (request, response) => {

  let url    = urlParser.parse(request.url),
      params = queryString.parse(url.query);
  const found = messages.find(message => message.id === +request.params.id);
  const singleMessage = JSON.stringify(found);

  if (params.encrypt) {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return bcrypt.hash(singleMessage, 10, (error, hashed) => {
      if (error) {
        throw new Error();
      }
      response.end(hashed);
    });
  }
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(singleMessage);
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
