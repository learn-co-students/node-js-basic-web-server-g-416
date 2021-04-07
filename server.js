"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const bcrypt       = require('bcrypt');
const bodyParser = require('body-parser');
const router = new Router();

// router.use(bodyParser.urlencoded({
//   extended: true
// }))

let messages = []

router.use(bodyParser.json());

router.get('/', (request, response) => {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.end('Hello, World!');
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

router.post('/message', (request, response) => {
  let newMsg;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (!request.body.message) {
    response.statusCode = 400;
    response.statusMessage = 'No message provided.';
    response.end();
    return;
  }
  newMsg = new Message(request.body.message);
  messages.push(newMsg);
  response.end(JSON.stringify(newMsg.id));
});