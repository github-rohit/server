require('express-async-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const server = express();
const header = require('./middleware/header');
const db = require('./db');
const config = require('./config/config');

const port = process.env.PORT || 3000;

process.on('unhandledRejection', ex => {
  console.log('unhandledRejection', ex);
});

process.on('uncaughtException', ex => {
  console.log('uncaughtException', ex);
});

server.use(helmet());
server.use(header);
server.use(express.json());

server.use(cookieParser());
server.use(express.urlencoded({ extended: true }));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

require('./routes')(server);

server.listen(port, () => {
  console.log(`Server running on port ${port}!`);
});
