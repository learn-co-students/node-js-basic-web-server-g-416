"use strict";

const urlParser = require("url");
const querystring = require("querystring");
const bodyParser = require("body-parser");
const http = require("http");
const finalhandler = require("finalhandler");
const Router = require("router");
const bcrypt = require("bcrypt");

const router = new Router({ mergeParams: true });

let messages = [];
let nextId = 1;

class Message {
  constructor(message) {
    this.id = nextId;
    this.message = message;
    nextId++;
  }
}

router.use(bodyParser.json());

router.get("/", (request, response) => {
  // A good place to start!
  response.setHeader("Content-Type", "text/plain; charset=utf-8");
  response.end("Hello, World!");
});

router.post("/message", (request, response) => {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  let newMess = new Message(request.body.message);
  messages.push(newMess);
  response.end(JSON.stringify(newMess.id));
});

router.get("/messages", (request, response) => {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(messages));
});

router.get("/message/:id", (request, response) => {
  let url = urlParser.parse(request.url);
  let params = querystring.parse(url.query);

  let data = messages.find((mess) => {
    return mess.id == request.params.id;
  });

  let processed = JSON.stringify(data);

  if (params.encrypt) {
    response.setHeader("Content-Type", "application/json; charset=utf-8");

    bcrypt.hash(processed, 10, (error, hashed) => {
      return response.end(hashed);
    });
  } else {
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    return response.end(processed);
  }
});

const server = http.createServer((request, response) => {
  router(request, response, finalhandler(request, response));
});

exports.listen = function (port, callback) {
  server.listen(port, callback);
};

exports.close = function (callback) {
  server.close(callback);
};
