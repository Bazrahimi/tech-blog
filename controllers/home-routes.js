const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
    Post.findAll({
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
        // Render the homepage handlebars template and pass the posts data to it
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn || false // Pass the logged-in status to the template
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('Error occurred while fetching posts.');
    });
});



// get one post
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: { id: req.params.id }, 
        attributes: ['id', 'title', 'content', 'created_at'],
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
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id'})
            return
        }
        res.json(dbPostData)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
});

// In one of your route files, e.g., auth-routes.js or a similar file

router.get('/login', (req, res) => {
    // If the user is already logged in, redirect them to the dashboard or home page
    if (req.session.loggedIn) {
      res.redirect('/'); // or res.redirect('/') for the home page
    } else {
      // Render the login view if the user is not logged in
      res.render('login');
    }
  });
  

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/')
        return
    }
    res.render('signUp')
});

module.exports = router;
