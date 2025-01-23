const Post = require('../models/Post');
const { uploadImage } = require('../utils/cloudinary');

class PostService {
  static async create({ caption, image, userId }) {
    try {
      const { url: imageUrl } = await uploadImage(image);

      const post = new Post({
        caption,
        imageUrl,
        author: userId,
      });

      await post.save();

      const populatedPost = await Post.findById(post._id)
        .populate('author', 'name')
        .lean();

      return {
        ...populatedPost,
        author: {
          name: populatedPost.author.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(populatedPost.author.name)}`,
        },
      };
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error(error.message);
    }
  }

  static async list({ page = 1, limit = 10, userId = null, filter = 'all' }) {
    try {
      console.log(`Fetching posts for page ${page} with limit ${limit}`);
      const skip = (page - 1) * limit;

      let query = {};
      if (filter === 'my') {
        query.author = userId;
      }

      const posts = await Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name')
        .lean();

      console.log(`Found ${posts.length} posts`);

      const total = await Post.countDocuments(query);
      console.log(`Total posts in database: ${total}`);

      const formattedPosts = posts.map(post => {
        // Ensure we always have author data
        const authorName = post.author ? post.author.name : 'Unknown User';
        return {
          ...post,
          author: {
            name: authorName,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}`
          },
          isOwner: userId && post.author && post.author._id.toString() === userId.toString()
        };
      });

      return {
        posts: formattedPosts,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error listing posts:', error);
      throw new Error('Failed to fetch posts');
    }
  }

  static async delete(postId, userId) {
    try {
      const post = await Post.findOne({ _id: postId, author: userId });

      if (!post) {
        throw new Error('Post not found or you do not have permission to delete it');
      }

      await post.deleteOne();
      return { success: true };
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
}

module.exports = PostService;