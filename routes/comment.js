
const express = require('express');
const { getCommentsByPostId, addCommentForPost } = require('../Controller/comment');
const {auth}= require('../Middlewares/auth');

const commentRouter = express.Router();

commentRouter.post('/', auth, addCommentForPost);
commentRouter.get('/post/:postId', getCommentsByPostId)

module.exports = commentRouter;