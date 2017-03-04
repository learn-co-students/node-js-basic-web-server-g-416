"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const bodyParser   = require('body-parser');
const url          = require('url');
const querystring  = require('querystring');
const bcrypt       = require('bcrypt');
const router       = new Router({ mergeParams: true});

router.use(bodyParser.json());

let messages = [];
let msgId = 1;

class Message {
  constructor(message) {
    this.id = msgId;
    this.message = message;
    msgId ++;
  }
}

router.get('/', (request, response) => {
  // A good place to start!
  response.setHeader('Content-Type', 'text/plain; charset=utf-8')
  response.end('Hello, World!');
});


router.get('/message/:id', (request, response) => {
    let reqUrl = url.parse(request.url);
    let params = querystring.parse(reqUrl.query);

    response.setHeader('Content-Type', 'application/json; charset=utf-8');

  let returnedMessages = JSON.stringify(messages[request.params.id - 1])

  if (params.encrypt) {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    return bcrypt.hash(result, 10, (error, hashed) => {
      if(error) {
        throw new Error();
      }
      response.end(hashed);
    });
  }

  response.end(returnedMessages);
});


router.get('/messages', (request, response) => {
  let reqUrl = url.parse(request.url);
  let params = querystring.parse(reqUrl.query);

  response.setHeader('Content-Type', 'application/json; charset=utf-8')

  let returnedMessages = JSON.stringify(messages)

  if (params.encrypt) {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    return bcrypt.hash(result, 10, (error, hashed) => {
      if(error) {
        throw new Error();
      }
      response.end(hashed);
    })
  }
  response.end(returnedMessages);
})

router.post('/message', (request, response) => {

  response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});

  var newMessage = new Message(request.body.message);
  messages.push(newMessage);

  response.end(JSON.stringify(newMessage.id));
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
