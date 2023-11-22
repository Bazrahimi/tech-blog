const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');
// get all posts
router.get('/', withAuth, (req, res) => {
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
            res.render('dashboard', { posts, loggedIn: true });
        })

        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// edit a post
router.put('/:id', withAuth, (req, res) => {
    Post.update(
        {
            title: req.body.title, 
            content: req.body.content
        }, 
        {
            where: { id: req.params.id }
        }
    )
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id'})
            return
        }
        res.redirect('/dashboard'); // Redirect to the dashboard route
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
});

module.exports = router;
// END: be15d9bcejpp

// edit a post
router.put('/:id', withAuth, (req, res) => {
    Post.update(
        {
            title: req.body.title, 
            content: req.body.content
        }, 
        {
            where: { id: req.params.id }
        }
    )
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

module.exports = router;

