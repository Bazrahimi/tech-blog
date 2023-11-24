const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Get all posts for the dashboard or a public page
router.get('/', (req, res) => {
    // If this route is for the dashboard, you should also include 'withAuth' middleware
    Post.findAll({
        attributes: ['id', 'title', 'content', 'created_at'],
        order: [['created_at', 'asc']], 
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
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Get one post
router.get('/:id', (req, res) => {
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
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Create a post
router.post('/', withAuth, (req, res) => {
    Post.create({
        title: req.body.title, 
        content: req.body.content, 
        user_id: req.session.user_id // Assumes user_id is stored in session
    })
    .then(dbPostData => res.redirect('/dashboard'))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Update a post
router.put('/:id', withAuth, (req, res) => {
    Post.update(req.body, {
        where: {
            id: req.params.id,
            user_id: req.session.user_id // Check if the logged-in user is the owner of the post
        }
    })
    .then(dbPostData => {
        if (!dbPostData || dbPostData[0] === 0) {
            res.status(404).json({ message: 'No post found with this id or you are not authorized to edit this post' });
            return;
        }
        res.json({ message: 'Post updated' });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Delete a post
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.session.user_id;

        // Delete the comments associated with the post
        await Comment.destroy({
            where: {
                post_id: postId
            }
        });

        // Delete the post
        const deletedPost = await Post.destroy({
            where: {
                id: postId,
                user_id: userId
            }
        });

        if (!deletedPost) {
            res.status(404).json({ message: 'No post found with this id or you are not authorized to delete this post' });
            return;
        }

        res.json({ message: 'Post and comments deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;
