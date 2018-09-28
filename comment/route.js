const { Comment, validate } = require('./model');
const express = require('express');
const Router = express.Router();
const auth = require('../middleware/auth');

Router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ postId })
    .populate('created_by', 'name')
    .select({
      postId: 0,
      __v: 0
    });

  res.status(200).send(comments);
});

Router.post('/', auth, async (req, res) => {
  await validate(req.body);

  const comment = new Comment(req.body);
  const result = await comment.save();

  res.status(200).send(result);
});

Router.delete('/:id', auth, async (req, res) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);

  if (!comment) {
    return res.status(404).send(`Comment with the given ID was not found.`);
  }

  res.status(200).send(comment);
});

module.exports = Router;
