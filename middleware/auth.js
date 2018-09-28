const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.cookies['x-auth'];

  if (!token) {
    return res.status(401).send('Access denied.');
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(401).send('Access denied.');
  }
};
