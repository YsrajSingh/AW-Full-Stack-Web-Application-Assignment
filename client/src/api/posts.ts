import api from './api';

export type Post = {
  _id: string;
  caption: string;
  imageUrl: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
};

// Description: Create a new post
// Endpoint: POST /api/posts
// Request: FormData with 'image' file and 'caption' text
// Response: { post: Post }
export const createPost = async (data: FormData) => {
  try {
    const response = await api.post('/api/posts', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    // Check specifically for file size error
    if (error?.response?.data?.error?.includes('File too large')) {
      throw new Error('Image file size must be less than 2MB');
    }
    throw new Error(error?.response?.data?.error || 'Image file size must be less than 2MB');
  }
};

// Description: Get all posts with pagination
// Endpoint: GET /api/posts
// Request Query Parameters: { page?: number, limit?: number }
// Response: {
//   posts: Post[],
//   pagination: {
//     total: number,
//     page: number,
//     limit: number,
//     pages: number
//   }
// }
export const getPosts = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/api/posts', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};