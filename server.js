"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const bodyParser = require('body-parser');

const router = new Router();
router.use(bodyParser.json());

let messages = [];

router.get('/', (request, response) => {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.end('Hello, World!');
});

route.post('/message',(request,response)=>{

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
