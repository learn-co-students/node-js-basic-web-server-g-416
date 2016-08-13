"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const bodyParser   = require('body-parser');
const bcrypt       = require('bcrypt');
const urlParser    = require('url');
const querystring  = require('querystring');
const router = new Router({mergeParams: true});

router.use(bodyParser.json());

let messages = []
let idCounter = 1

class Message {
  constructor(message) {
    this.id = idCounter
    this.message = message
    idCounter++
  }
}

router.get('/', (request, response) => {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8')
  response.end('Hello, World!');
});

router.get('/messages', (request, response) => {
  let url = urlParser.parse(request.url)
  let params = querystring.parse(url.query)
  response.setHeader('Content-Type', 'application/json; charset=utf-8')

  const msg = JSON.stringify(messages)

  if (params.encrypt) {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8')
    return bcrypt.hash(msg, 10, function(error, hash){
      if (error) {
        throw new Error()
      }
      response.end(hash)
    })
  }
  response.end(msg)
})

router.get('/message/:id', (request, response) => {
  let url = urlParser.parse(request.url)
  let params = querystring.parse(url.query)
  response.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (!request.params) {
    response.statusCode = 400
    response.statusMessage = 'Message not found'
    response.end()
    return
  }

  const found = messages.find((message) => {
    return message.id == request.params.id
  })

  const msg = JSON.stringify(found)

  if (params.encrypt) {
   response.setHeader('Content-Type', 'text/plain; charset=utf-8');
   return bcrypt.hash(msg, 10, (error, hashed) => {
     if (error) {
       throw new Error();
     }
     response.end(hashed);
   });
 }

  response.end(msg)
})

router.post('/message', (request, response) => {
  let newMessage

  response.setHeader('Content-Type', 'application/json; charset=utf-8')

  if(!request.body.message) {
    response.statusCode = 400
    response.statusMessage = 'Please provide a message'
    response.end()
    return
  }

  newMessage = new Message(request.body.message)
  messages.push(newMessage)
  response.end(JSON.stringify(newMessage.id))
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
