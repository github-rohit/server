const Joi = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dbSchema = new Schema({
  postId: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500
  },
  created_by: {
    type: Schema.ObjectId,
    required: true,
    ref: 'User'
  },
  created_on: {
    type: Date,
    default: new Date()
  }
});

const Comment = mongoose.model('Comment', dbSchema);

const validate = function(data) {
  return Joi.validate(data, {
    postId: Joi.string().required(),
    comment: Joi.string()
      .min(5)
      .max(500)
      .required(),
    created_by: Joi.required()
  });
};

module.exports = { Comment, validate };
