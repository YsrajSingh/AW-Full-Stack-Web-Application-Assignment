const express = require('express');
const router = express.Router();
const multer = require('multer');
const PostService = require('../services/postService');
const { requireUser } = require('./middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.get('/', requireUser, async (req, res) => {
  try {
    const { page = 1, limit = 10, filter = 'all' } = req.query;
    const result = await PostService.list({
      page: parseInt(page),
      limit: parseInt(limit),
      userId: req.user.id,
      filter
    });
    res.json(result);
  } catch (error) {
    console.error('Error in get posts route:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', requireUser, upload.single('image'), async (req, res) => {
  console.log('Received post request:');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('File:', req.file);

  try {
    if (!req.file) {
      console.log('No file detected in request');
      return res.status(400).json({ error: 'Image is required' });
    }

    if (!req.body.caption) {
      return res.status(400).json({ error: 'Caption is required' });
    }

    const post = await PostService.create({
      caption: req.body.caption,
      image: req.file,
      userId: req.user._id,
    });

    res.status(201).json({ post });
  } catch (error) {
    console.error('Error in create post route:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', requireUser, async (req, res) => {
  try {
    await PostService.delete(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error in delete post route:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;