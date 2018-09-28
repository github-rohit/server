const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;

const dbSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 50,
    unique: true
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25
  },
  passwd: {
    type: String,
    required: true
  },
  profileImage: {
    type: String
  },
  aboutme: {
    type: String
  },
  gender: {
    type: String
  },
  country: {
    type: String
  },
  website: {
    type: String
  },
  facebook: {
    type: String
  },
  twitter: {
    type: String
  },
  google_plus: {
    type: String
  },
  linkedIn: {
    type: String
  },
  instagram: {
    type: String
  },
  tumblr: {
    type: String
  },
  pinterest: {
    type: String
  },
  status: {
    type: String
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

dbSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { _id: this._id, name: this.name, email: this.email },
    process.env.SECRET,
    { expiresIn: '30 days' }
  );
};

const User = mongoose.model('User', dbSchema);

const validate = function(data) {
  return Joi.validate(
    data,
    {
      email: Joi.string()
        .email()
        .min(6)
        .max(50)
        .required()
        .label('email'),
      name: Joi.string()
        .min(3)
        .max(25)
        .required()
        .label('Name'),
      passwd: Joi.string()
        .min(6)
        .max(15)
        .required()
        .label('Password')
    },
    { abortEarly: false }
  );
};

const validateLogin = function(data) {
  return Joi.validate(
    data,
    {
      email: Joi.string()
        .email()
        .min(6)
        .max(50)
        .required()
        .label('email'),
      passwd: Joi.string()
        .min(6)
        .max(15)
        .required()
        .label('Password')
    },
    { abortEarly: false }
  );
};

const getEncryptPassword = async passwd => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(passwd, salt);
};

module.exports = { User, validate, validateLogin, getEncryptPassword };
