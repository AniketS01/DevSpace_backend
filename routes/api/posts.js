const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Post = require('../../models/Posts')
const Profile = require('../../models/Profile')
const User = require('../../models/User')


router.post('/', [auth, [
    check('text', 'text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
      const user = await User.findById(req.user.id).select('-password')

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })  

        const post = await newPost.save()
        res.json(post)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
    }
});

// get all posts

router.get('/', auth, async (req,res) => {
    try {
        const posts = await Post.find().sort({date: -1})
        res.json(posts)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
    }
})

// get post by id
router.get('/:id', auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(!post) {
            return res.status(404).json({msg: 'post not found'})
        }
        res.json(post)
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({msg: 'post not found'})
        }
        res.status(500).send('server error')
    }
})

// delete a post 
router.delete('/:id', auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        //check user
        if(post.user.toString() !== req.user.id){
            return res.status(401).send({msg: 'user not valid'})
        }
        // check post
        if(!post){
            return res.status(400).send({msg: 'user not valid'})
        }

        await post.remove()
        res.json({msg: 'post removed'})
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({msg: 'post not found'})
        }
        res.status(500).send('server error')
    }
})

// likes 

router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        // if post has already been liked
        if(post.like.filter(likes => likes.user.toString() === req.user.id).length > 0){
           return res.status(400).json({msg: 'post already liked'})
        }

        post.like.unshift({user: req.user.id})
        await post.save()
        res.json(post.like)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
    }
})

// unlikes 

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        // if post has already been liked
        if(post.like.filter(likes => likes.user.toString() === req.user.id).length === 0){
           return res.status(400).json({msg: 'post post has not yet been liked'})
        }

        // remove index
        const removeIndex = post.like.map(likes => likes.user.toString().indexOf(req.user.id))
        post.like.splice(removeIndex, 1)
        await post.save()
        res.json(post.like)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
    }
})

// pst comment

router.post('/comment/:id', [auth, [
    check('text', 'text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
    }
});

// delete req

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        
        // get comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id)

        // does comment exist
        if(!comment) {
            return res.status(404).json({msg: 'comment dosnt exist'})
        }
        // check user

        if (comment.user.toString() !== req.user.id) {
            return res.status(401).send({msg : 'user not authorised'})
        }

        // remove index
        const removeIndex = post.comments.map(comment => comment.user.toString().indexOf(req.user.id))
        post.comments.splice(removeIndex, 1)
        await post.save()
        res.json(post.comments)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
    }
})



module.exports = router;
