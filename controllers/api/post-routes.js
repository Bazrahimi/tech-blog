const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');
// get all posts
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
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
});

// get one post
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

// create a post
router.post('/', withAuth, (req, res) => {
    Post.create({
        title: req.body.title, 
        content: req.body.content, 
        user_id: req.session.user_id
    })
    .then(dbPostData => {
        // redirect to dashboard route
        res.redirect('/dashboard')
    })

    
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
   
});

// update a post  
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

// delete a post
router.delete('/:id', withAuth, (req, res) => {
    const loggedInUserId = req.session.user_id; // Assuming this is set when the user logs in

    // First, find the post to see if it exists and belongs to the user
    Post.findOne({
        where: {
            id: req.params.id,
            user_id: loggedInUserId // Check if the post belongs to the currently logged-in user
        }
    })
    .then(post => {
        if (!post) {
            // If the post doesn't exist or doesn't belong to the user, return a 404 error
            res.status(404).json({ message: 'No post found with this id or you do not have permission to delete this post' });
            return;
        }

        // If the post does belong to the user, delete it
        return post.destroy();
    })
    .then(() => {
        // Redirect to dashboard after the post is deleted
        res.redirect('/dashboard');
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});



module.exports = router;


