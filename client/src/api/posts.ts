// @ts-nocheck
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
  isOwner: boolean;
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
    if (error?.response?.data?.error?.includes('File too large')) {
      throw new Error('Image file size must be less than 5MB');
    }
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get all posts with pagination and filtering
// Endpoint: GET /api/posts
// Request Query Parameters: { page?: number, limit?: number, filter?: 'all' | 'my' }
// Response: {
//   posts: Post[],
//   pagination: {
//     total: number,
//     page: number,
//     limit: number,
//     pages: number
//   }
// }
export const getPosts = async (page = 1, limit = 10, filter: 'all' | 'my' = 'all') => {
  try {
    const response = await api.get('/api/posts', {
      params: { page, limit, filter }
    });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete a post
// Endpoint: DELETE /api/posts/:id
// Response: { success: true }
export const deletePost = async (postId: string) => {
  try {
    const response = await api.delete(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};