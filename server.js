// Resources: 
// https://webapplog.com/url-parameters-and-routing-in-express-js/

"use strict"; // Allows you to use the ES6 assignment keyword, 'let'

// Dependencies
const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const bodyParser   = require('body-parser');
var bcrypt         = require('bcrypt'); // bcrypt module encrypts message strings before sending back to client to prevent hackers from intercepting

// Instantiations
const saltRounds = 10;
const myPlaintextPassword = 'password';
const someOtherPlaintextPassword = 'not_bacon';
let messages = [];
let id = 1;

// Configurations?
const router = new Router({ mergeParams: true }); // sending mergeParams option into Router constructor allows server to make sense of /:id

// Middleware
router.use(bodyParser.json()); // Middleware that allows server to automatically parse JSON (POST) requests

// Routes
router.get('/', (request, response) => {
  response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
  response.end('Hello, World!');
});

router.post('/message', (request, response) => {
  messages.push({id: id++, message: request.body.message});
  response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
  response.end(JSON.stringify(id - 1));
});

router.get('/messages', (request, response) => {

    //response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    //response.end(JSON.stringify(request.params));

    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    response.end(request.query.encrypt);
});

router.get('/message/:id', (request, response) => {
  // Now the scope of this callback includes an `id` variable
  // that contains the id specified in each request (see mergeParams above)
  response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
  response.end(JSON.stringify(messages[request.params.id - 1]));
});

// Bootup
const server = http.createServer((request, response) => {
  router(request, response, finalhandler(request, response));
});

exports.listen = function(port, callback) {
  server.listen(port, callback);
};

exports.close = function(callback) {
  server.close(callback);
};
