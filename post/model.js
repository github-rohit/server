const Joi = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dbSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 120,
    text: true
  },
  description: {
    type: String,
    required: true,
    text: true
  },
  image: {
    type: String
  },
  category: {
    type: Array,
    default: 'Uncategorized',
    text: true
  },
  tags: {
    type: Array,
    text: true
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

Post.collection.createIndex({
  title: 'text',
  description: 'text'
});

const validate = function(data) {
  return Joi.validate(data, {
    title: Joi.string()
      .required()
      .min(5)
      .max(120),
    description: Joi.string().required(),
    status: Joi.string().required(),
    created_by: Joi.required()
  });
};

module.exports = { Post, validate };
