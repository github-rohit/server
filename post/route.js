const { Post, validate } = require('./model');
const express = require('express');
const Router = express.Router();
const auth = require('../middleware/auth');

Router.get('/', async (req, res) => {
  const query = getQuery(req.query);
  const { page = 1, limit = 12 } = req.query;

  const posts = await Post.find(query)
    .sort({ created_on: -1 })
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .populate('created_by', 'name');

  const total = await Post.count(query);

  res.status(200).send({
    posts,
    total
  });
});

Router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    'created_by',
    'name'
  );

  if (!post) {
    return res.status(404).send(`Post with the given ID was not found.`);
  }

  res.status(200).send(post);
});

Router.post('/', auth, async (req, res) => {
  const { title, description, created_by, status } = req.body;
  await validate({ title, description, created_by, status });

  const post = new Post(req.body);
  const result = await post.save();

  res.status(201).send({
    success: true,
    post: result
  });
});

Router.post('/:id', auth, async (req, res) => {
  const query = getQuery(req.query);
  const { page = 1, limit = 12 } = req.query;

  const posts = await Post.find({ ...query, status: req.query.status })
    .sort({ created_on: -1 })
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .populate('created_by', 'name');

  const total = await Post.count(query);

  res.status(200).send({
    posts,
    total
  });
});

Router.patch('/:id', auth, async (req, res) => {
  const { title, description, created_by, status } = req.body;
  await validate({ title, description, created_by, status });

  const {id} = req.params;
  let post = await Post.findById(id);

  if (!post) {
    return res.status(404).send({
      errors: {
        msg: `Post with the given ID was not found.`
      }
    });
  }

  post = await Post.findByIdAndUpdate(
    id,
    { $set: { ...req.body } },
    {
      new: true
    }
  );

  res.status(200).send({
    success: true,
    post
  });
});

Router.delete('/:id', auth, async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return res.status(404).send({
      errors: {
        msg: `Post has been deleted successfully`
      }
    });
  }

  res.status(200).send({
    success: true,
    msg: `Post has been deleted successfully`
  });
});

function getQuery(query) {
  const { status, createdBy, category, tags, q: reqQuery } = query;
  const searchQuery = {
    status: 'PUBLISHED'
  };

  if (reqQuery) {
    searchQuery.$text = { $search: reqQuery };
  }

  if (createdBy) {
    searchQuery.created_by = createdBy;
  }

  if (category) {
    searchQuery.category = category;
  }

  if (tags) {
    searchQuery.tags = tags;
  }

  return searchQuery;
}

module.exports = Router;
