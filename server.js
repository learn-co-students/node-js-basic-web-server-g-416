"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const urlParser    = require('url');
const querystring  = require('querystring');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const router = new Router({ mergeParams: true });

router.use(bodyParser.json());

let messages = [];
let id = 1;


class Message {
  constructor(message) {
    this.id = id;
    this.message = message.message;
    id++;
  }
}

router.get('/', (request, response) => {  
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.end('Hello, World!');
});

router.post('/message', (request, response) => {
  let newMes;
  
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  if(!request.body) {
    response.statusCode = 400;
  }

  newMes = new Message(request.body);
  messages.push(newMes); 
  response.end(JSON.stringify(newMes.id));
});


router.get('/messages', (request, response) => {
  let url = urlParser.parse(request.url)
  let queryStr = querystring.parse(url.query);

  const result = JSON.stringify(messages)

  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  if(queryStr.encrypt === 'true') {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    console.log(queryStr.encrypt);
    return bcrypt.hash(result, saltRounds, (err, hash) => {
      response.end(hash);
    });
  }

  response.end(result);  
});


router.get('/message/:id', (request, response) => {
  let paramId = request.params.id;
  let message = messages[paramId-1];
  let queryStr = request._parsedUrl.query;

  const result = JSON.stringify(message);

  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  if(queryStr === 'encrypt=true') {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return bcrypt.hash(result, saltRounds, (err, hash) => {
      response.end(hash);
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
