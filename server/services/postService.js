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

  static async list({ page = 1, limit = 10 }) {
    try {
      console.log(`Fetching posts for page ${page} with limit ${limit}`);
      const skip = (page - 1) * limit;

      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name')
        .lean();

      console.log(`Found ${posts.length} posts`);

      const total = await Post.countDocuments();
      console.log(`Total posts in database: ${total}`);

      const formattedPosts = posts.map(post => ({
        ...post,
        author: {
          name: post.author?.name || 'Unknown User',
          avatar: post.author?.name
            ? `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}`
            : `https://ui-avatars.com/api/?name=Unknown`
        }
      }));

      const paginationData = {
        posts: formattedPosts,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      };

      console.log(`Returning page ${page} of ${Math.ceil(total / limit)} total pages`);
      return paginationData;
    } catch (error) {
      console.error('Error listing posts:', error);
      throw new Error('Failed to fetch posts');
    }
  }
}

module.exports = PostService;