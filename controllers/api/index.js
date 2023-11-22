const userRoutes = require('./user-routes');
const postRoutes = require('./post-routes');
const commentRoutes = require('./comments-routes');
const router = require('express').Router();

// User routes under '/users' prefix within '/api'
router.use('/users', userRoutes);

// Post routes under '/posts' prefix within '/api'
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
