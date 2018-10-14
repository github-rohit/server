const {
  User,
  validate,
  validateLogin,
  validateUpdate,
  validatePasswords,
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
    return res.status(404).send({
      errors: {
        msg: `User with the given ID was not found.`
      }
    });
  }

  res.status(200).send(user);
});

Router.post('/', async (req, res) => {
  await validate(req.body);
  const { email, passwd } = req.body;
  let user = await User.findOne({ email });

  if (user) {
    return res.status(403).send({
      errors: {
        msg: `User with the given ID already exist.`
      }
    });
  }

  req.body.passwd = await getEncryptPassword(passwd);

  user = new User(req.body);
  await user.save();

  res.status(201).send({
    success: true
  });
});

Router.post('/password', async (req, res) => {
  console.log('ddd');
  const { oldPasswd, passwd, confirmPasswd, id } = req.body;
  await validatePasswords({ oldPasswd, passwd, confirmPasswd });

  let user = await User.findOne({ _id: id });

  if (!user) {
    return res.status(403).send({
      errors: {
        msg: `User with the given ID was not found.`
      }
    });
  }

  const match = await bcrypt.compare(oldPasswd, user.passwd);

  if (!match) {
    return res.status(400).send({
      errors: {
        msg: `Invalid password.`
      }
    });
  }

  encryptPassword = await getEncryptPassword(passwd);

  user = await User.findByIdAndUpdate(
    id,
    { $set: { passwd: encryptPassword } },
    {
      new: true
    }
  );

  res.status(200).send({
    success: true,
    msg: 'Password updated successfully.'
  });
});

Router.patch('/:id', auth, async (req, res) => {
  const { passwd, name } = req.body;
  await validateUpdate({ name });
  const { id } = req.params;

  let user = await User.findById(id).select({
    passwd: 1
  });

  if (!user) {
    return res.status(404).send({
      errors: {
        msg: `User with the given ID was not found.`
      }
    });
  }

  // const match = await bcrypt.compare(passwd, user.passwd);

  // if (!match) {
  //   return res.status(400).send(`Invalid username or password.`);
  // }

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

  res.status(200).send({
    success: true,
    user: user
  });
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
    return res.status(400).send({
      errors: {
        msg: `Invalid username or password.`
      }
    });
  }

  const match = await bcrypt.compare(passwd, user.passwd);

  if (!match) {
    return res.status(400).send({
      errors: {
        msg: `Invalid username or password.`
      }
    });
  }

  const token = user.generateAuthToken();

  res
    .cookie('x-auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      domain: req.headers.origin
    })
    .status(200)
    .send({
      success: true,
      token
    });
});

Router.post('/logout', async (req, res) => {
  res
    .clearCookie('x-auth')
    .status(200)
    .send({
      success: true
    });
});

module.exports = Router;
