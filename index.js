require('express-async-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
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
  res.header('Access-Control-Allow-Origin', process.env.ACCESS_CONTROL_ALLOW_ORIGIN);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');

  next();
});
server.use(express.json());

server.use(cookieParser());
server.use(express.urlencoded({ extended: true }));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

require('./routes')(server);

server.listen(port, () => {
  console.log(`Server running on port ${port}!`);
});
