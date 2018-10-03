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

Router.patch('/:id', auth, (req, res) => {
  console.log('[Post POST is working]');
  res.status(200).send('Post is working');
});

Router.delete('/:id', auth, async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return res.status(404).send(`Post with the given ID was not found.`);
  }

  res.status(200).send(post);
});

function getQuery(query) {
  const { status, createdBy, category, tags } = query;
  const searchQuery = {
    status: 'PUBLISHED'
  };

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
