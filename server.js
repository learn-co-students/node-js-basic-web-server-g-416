"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const bodyParser   = require('body-parser');
const bcrypt       = require('bcrypt');

const router = new Router({ mergeParams: true });
router.use(bodyParser.json());

// Message store in memory
let counter = 1;
let messages = [];

router.get('/', (request, response) => {
  // A good place to start!
  response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
  response.end('Hello, World!');
});

router.post('/message', (request, response) => {
  messages.push( Object.assign({}, {id: counter++}, request.body) );
  response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
  let newMessage = messages[messages.length-1]['id'];
  response.end(JSON.stringify(newMessage));
});

router.get('/messages', (request, response) => {

  let jsonMsgs = JSON.stringify(messages);

  if (request._parsedUrl.query) {
    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
      return bcrypt.hash(jsonMsgs, 10, (error, hashed) => {
        if (error) {
          throw new Error();
        }
        console.log(hashed);
        response.end(hashed);
      });
  }
  response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
  response.end(jsonMsgs);
});

router.get('/message/:id', (request, response) => {

  const requestedMsg = messages.find(msg => msg.id === parseInt(request.params.id,10));
  let jsonMsg = JSON.stringify(requestedMsg);

  if (request._parsedUrl.query) {
    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
      return bcrypt.hash(jsonMsg, 10, (error, hashed) => {
        if (error) {
          throw new Error();
        }
        response.end(hashed);
      });
  } else {
    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    response.end(jsonMsg);
  }
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
