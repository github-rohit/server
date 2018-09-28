module.exports = function(err, req, res, next) {
  if (err.isJoi) {
    return res.status(400).send(err.details);
  }

  console.log(err);
  res.status(500).send(`Something went wrong!`);
};
