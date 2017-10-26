"use strict";

const http = require('http');
const finalhandler = require('finalhandler');
const Router = require('router');
const bcrypt = require('bcrypt');

const router = new Router({ mergeParams: true });

const bodyParser = require('body-parser');
const urlParser = require('url');
const querystring = require('querystring');

router.use(bodyParser.json());

let nextId = 1;

class Message {
    constructor(message) {
        this.id = nextId;
        this.message = message;
        nextId++;
    }
}


let messages = [];

router.get('/', (request, response) => {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.end('Hello, World!');
});

router.post('/message', (request, response) => {
    let newMessage;

    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    newMessage = new Message(request.body.message)
    messages.push(newMessage);
    console.log(newMessage.id);

    response.end(JSON.stringify(newMessage.id));
});

router.get('/messages', (request, response) => {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');

    let url = urlParser.parse(request.url),
        params = querystring.parse(url.query);

    let result = JSON.stringify(messages);

    if (params.encrypt) {
        response.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return bcrypt.hash(result, 10, (error, hashed) => {
            if (error) {
                throw new Error();
            }
            response.end(hashed);
        });
    }

    response.end(JSON.stringify(messages));
});

router.get('/message/:id', (request, response) => {
    let url = urlParser.parse(request.url),
        params = querystring.parse(url.query);

    response.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (!request.params.id) {
        response.statusCode = 400;
        response.statusMessage = "No message id provided.";
        response.end();
        return;
    }

    const found = messages.find((message) => {
        return message.id == request.params.id;
    });

    if (!found) {
        response.statusCode = 404;
        response.statusMessage = `Unable to find a message with id ${request.params.id}`;
        response.end();
        return;
    }

    const result = JSON.stringify(found);

    if (params.encrypt) {
        response.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return bcrypt.hash(result, 10, (error, hashed) => {
            if (error) {
                throw new Error();
            }
            response.end(hashed);
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