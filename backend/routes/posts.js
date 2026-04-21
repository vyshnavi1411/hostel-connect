const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/authMiddleware');

// @route   GET api/posts
// @desc    Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name role')
      .sort({ createdAt: -1 });

    // Mask user data if isAnonymous
    const maskedPosts = posts.map(post => {
      const postObj = post.toObject();
      if (post.isAnonymous) {
        postObj.user = { name: 'Anonymous Student' };
      }
      return postObj;
    });

    res.json(maskedPosts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts
// @desc    Create a post
router.post('/', protect, async (req, res) => {
  try {
    const { content, isAnonymous } = req.body;

    const newPost = new Post({
      content,
      isAnonymous,
      user: req.user.id
    });

    const post = await newPost.save();
    
    // Return masked version if anonymous
    const postObj = post.toObject();
    if (post.isAnonymous) {
      postObj.user = { name: 'Anonymous Student' };
    } else {
      postObj.user = { name: req.user.name, role: req.user.role };
    }

    res.json(postObj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts/:id/like
// @desc    Like/Unlike a post
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if post has already been liked by this user
    if (post.likes.includes(req.user.id)) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    } else {
      // Like
      post.likes.unshift(req.user.id);
    }

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
