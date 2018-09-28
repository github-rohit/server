const Joi = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dbSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  category: {
    type: Array,
    default: 'Uncategorized'
  },
  tags: {
    type: Array
  },
  created_by: {
    type: Schema.ObjectId,
    required: true,
    ref: 'User'
  },
  created_on: {
    type: Date,
    default: new Date()
  },
  status: {
    type: String,
    required: true
  },
  post_reference_id: {
    type: Schema.ObjectId
  },
  schedule_at: {
    type: Date
  }
});

const Post = mongoose.model('Post', dbSchema);

const validate = function(data) {
  return Join.validate(data, {
    title: Joi.string()
      .min(5)
      .max(50)
      .required(),
    description: Joi.string().required(),
    status: Joi.string().required()
  });
};

module.exports = { Post, validate };
