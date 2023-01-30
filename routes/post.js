const express = require('express');
const { createPost, getBlogs, getBlogById } = require('../Controller/post');
const {auth}= require('../Middlewares/auth');

const postRouter = express.Router();


postRouter.post('/', auth, createPost)
postRouter.get('/', getBlogs)
postRouter.get('/:id', getBlogById)

module.exports = postRouter;

