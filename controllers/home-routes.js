const router = require('express').Router();
const { User, BlogPost } = require('../models');

// 1. GET all blog posts for the homepage
router.get('/', async (req, res) => {
  try {
    const dbBlogPostData = await BlogPost.findAll({
      include: [{
        model: User,
        attributes: ['username'], // Assuming User model has 'username'
      }],
    });

    const blogPosts = dbBlogPostData.map((blogPost) => blogPost.get({ plain: true }));

    res.render('homepage', {
      blogPosts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// 2. GET a single blog post's details
router.get('/blogpost/:id', async (req, res) => {
  try {
    const dbBlogPostData = await BlogPost.findOne({
      where: {
        id: req.params.id,
      },
      include: [{
        model: User,
        attributes: ['username'],
      }],
    });

    if (!dbBlogPostData) {
      res.status(404).json({ message: 'No blog post found with this id!' });
      return;
    }

    const blogPost = dbBlogPostData.get({ plain: true });
    res.render('blogpost-detail', { blogPost, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// 3. POST to create a new blog post
router.post('/blogpost', async (req, res) => {
  try {
    const newBlogPost = await BlogPost.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.userId, // Assuming you save the logged-in user's ID in the session
    });

    res.status(201).json(newBlogPost);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// 4. PUT to update a blog post
router.put('/blogpost/:id', async (req, res) => {
  try {
    const updatedBlogPost = await BlogPost.update({
      title: req.body.title,
      content: req.body.content,
    }, {
      where: {
        id: req.params.id,
      },
    });

    if (!updatedBlogPost) {
      res.status(404).json({ message: 'No blog post found with this id!' });
      return;
    }

    res.json(updatedBlogPost);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// 5. DELETE a blog post
router.delete('/blogpost/:id', async (req, res) => {
  try {
    const blogPostData = await BlogPost.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!blogPostData) {
      res.status(404).json({ message: 'No blog post found with this id!' });
      return;
    }

    res.json(blogPostData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



module.exports = router;
