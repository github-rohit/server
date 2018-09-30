require('express-async-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const server = express();
const db = require('./db');

const port = process.env.PORT || 3000;

process.on('unhandledRejection', ex => {
  console.log('unhandledRejection', ex);
});

process.on('uncaughtException', ex => {
  console.log('uncaughtException', ex);
});

server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
server.use(express.json());
server.use(helmet());
server.use(cookieParser());
server.use(express.urlencoded({ extended: true }));

require('./routes')(server);

server.listen(port, () => {
  console.log(`Server running on port ${port}!`);
});
