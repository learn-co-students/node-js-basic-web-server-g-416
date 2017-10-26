"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const bodyParser   = require('body-parser')

const router = new Router({mergeParams: true});
router.use(bodyParser.json())

let messages = []
let id = 1

class Message {
  constructor(message) {
    this.message = message
    this.id = id
    id ++
  }
}

router.get('/', (request, response) => {
  // A good place to start!
  response.setHeader('Content-Type', 'text/plain; charset=utf-8')
  response.end("Hello, World!");
});

router.get('/messages', (request, response) => {

  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(messages));
});

router.get('/message/:id', (request, response) => {
  
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    const message = messages.find(message => request.params.id == message.id)
    response.end(JSON.stringify(message));
  });

router.post('/message', (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8')

  let message = new Message(request.body.message)
  messages.push(message)
  response.end(JSON.stringify(message.id))
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
