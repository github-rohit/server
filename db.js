const config = require('./config/config');
const mongoose = require('mongoose');

mongoose
  .connect(
    config.getDbConnectionString(),
    { useNewUrlParser: true }
  )
  .then(() => console.log(`Database connected...`));
