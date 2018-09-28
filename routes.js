const user = require('./user/route');
const post = require('./post/route');
const comment = require('./comment/route');
const error = require('./middleware/error');

module.exports = function(server) {
  server.use('/api/user', user);
  server.use('/api/posts', post);
  server.use('/api/comments', comment);
  server.use(error);
};
