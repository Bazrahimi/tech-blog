const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');


// Get all posts for the logged-in user
router.get('/', withAuth, (req, res) => {
  Post.findAll({
      where: {
          user_id: req.session.user_id // Only select posts from the logged-in user
      },
      attributes: ['id', 'title', 'content', 'created_at'],
      order: [['created_at', 'DESC']],
      include: [
          {
              model: Comment,
              attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
              include: {
                  model: User,
                  attributes: ['username']
              }
          },
          {
              model: User,
              attributes: ['username']
          }
      ]
  })
  .then(dbPostData => {
      const posts = dbPostData.map(post => post.get({ plain: true }));
      res.render('dashboard', { posts, loggedIn: true }); // Pass 'loggedIn' flag from the session
  })
  .catch(err => {
      console.log(err);
      res.status(500).json(err);
  });
});

// Update a post by the logged-in user
router.get('/edit/:id', withAuth, (req, res) => {
  // Assuming 'withAuth' is middleware that checks if the user is logged in
  Post.findByPk(req.params.id, {
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
  .then(dbPostData => {
    if (dbPostData) {
      const post = dbPostData.get({ plain: true });
      
      // Render an 'edit-post' template, passing in the post data
      res.render('edit-post', { post, loggedIn: req.session.loggedIn });
    } else {
      res.status(404).json({ message: 'No post found with this id' });
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// Delete a post by the logged-in user
router.delete('/delete/:id', withAuth, (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id,
      user_id: req.session.user_id // Ensure the logged-in user owns the post
    },
    include: [
      {
        model: Comment,
        where: {
          post_id: req.params.id // Delete comments associated with the post
        }
      }
    ]
  })
    .then(dbPostData => {
      if (dbPostData === 0) {
        res.status(404).json({ message: 'No post found with this id or you do not have permission' });
        return;
      }
      res.json({ message: 'Post and associated comments deleted' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;


