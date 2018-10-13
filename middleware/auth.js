const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.cookies['x-auth'];

  if (!token) {
    console.log('x-auth', token);
    res.status(401).send({
      errors: {
        msg: 'Access denied.'
      }
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    console.log('x-auth', token);
    res.status(401).send({
      errors: {
        msg: 'Access denied.'
      }
    });
  }
};
