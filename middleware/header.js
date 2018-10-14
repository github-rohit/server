// const allowedOrigins = process.env.ACCESS_CONTROL_ALLOW_ORIGIN.split(',');

module.exports = function(req, res, next) {
  const allowedOrigins = process.env.ACCESS_CONTROL_ALLOW_ORIGIN.split(',');
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, X-Auth'
  );
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');

  next();
};
