const express = require('express');
const router = express.Router();

const comment = require('./comment');
const post = require('./post');
const user = require('./user');
// const auth = require('./auth');

router.use('/comments', comment);
router.use('/posts', post);
router.use('/users', user);

module.exports = router;