module.exports = function(err, req, res, next) {
  if (err.isJoi) {
    const errors = {};

    for (const detail of err.details) {
      const { path, message } = detail;
      errors[path[0]] = message;
    }
    return res.status(400).send({
      errors
    });
  }

  console.log(err);
  res.status(500).send(`Something went wrong!`);
};
