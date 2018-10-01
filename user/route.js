const {
  User,
  validate,
  validateLogin,
  getEncryptPassword
} = require('./model');
const bcrypt = require('bcrypt');
const express = require('express');
const Router = express.Router();
const auth = require('../middleware/auth');

Router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select({
    passwd: 0,
    tokens: 0,
    __v: 0
  });

  if (!user) {
    return res.status(404).send(`User with the given ID was not found.`);
  }

  res.status(200).send(user);
});

Router.post('/', async (req, res) => {
  await validate(req.body);
  const { email, passwd } = req.body;
  let user = await User.findOne({ email });

  if (user) {
    return res.status(403).send({
      msg: `User with the given ID already exist.`
    });
  }

  req.body.passwd = await getEncryptPassword(passwd);

  user = new User(req.body);
  const result = await user.save();

  res.status(201).send(result);
});

Router.patch('/:id', auth, async (req, res) => {
  const { passwd } = req.body;
  const { id } = req.params;

  const user = await User.findById(id).select({
    passwd: 1
  });

  const match = await bcrypt.compare(passwd, user.passwd);

  if (!match) {
    return res.status(400).send(`Invalid username or password.`);
  }

  delete req.body['email'];
  delete req.body['passwd'];
  delete req.body['tokens'];

  user = await User.findByIdAndUpdate(
    id,
    { $set: { ...req.body } },
    {
      new: true
    }
  );

  res.status(200).send(user);
});

Router.post('/login', async (req, res) => {
  await validateLogin(req.body);

  const { email, passwd } = req.body;
  const user = await User.findOne({ email }).select({
    passwd: 1,
    email: 1,
    name: 1
  });

  if (!user) {
    return res.status(400).send(`Invalid username or password.`);
  }

  const match = await bcrypt.compare(passwd, user.passwd);

  if (!match) {
    return res.status(400).send(`Invalid username or password.`);
  }

  const token = user.generateAuthToken();

  res
    .cookie('x-auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    })
    .status(200)
    .send(true);
});

module.exports = Router;
