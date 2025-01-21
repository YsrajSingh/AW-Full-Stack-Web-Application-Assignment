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

// Description: Get all posts
// Endpoint: GET /api/posts
// Request: {}
// Response: { posts: Post[] }
export const getPosts = () => {
  return new Promise<{ posts: Post[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        posts: [
          {
            _id: '1',
            caption: 'Beautiful sunset at the beach',
            imageUrl: 'https://source.unsplash.com/random/800x600?sunset',
            author: {
              name: 'John Doe',
              avatar: 'https://source.unsplash.com/random/100x100?face',
            },
            createdAt: '2024-03-20T10:00:00.000Z',
          },
          {
            _id: '2',
            caption: 'Morning coffee and code',
            imageUrl: 'https://source.unsplash.com/random/800x600?coffee',
            author: {
              name: 'Jane Smith',
              avatar: 'https://source.unsplash.com/random/100x100?portrait',
            },
            createdAt: '2024-03-19T15:30:00.000Z',
          },
        ],
      });
    }, 500);
  });
};

// Description: Create a new post
// Endpoint: POST /api/posts
// Request: FormData with 'image' file and 'caption' text
// Response: { post: Post }
export const createPost = (data: FormData) => {
  return new Promise<{ post: Post }>((resolve) => {
    setTimeout(() => {
      resolve({
        post: {
          _id: Math.random().toString(36).substr(2, 9),
          caption: data.get('caption') as string,
          imageUrl: 'https://source.unsplash.com/random/800x600',
          author: {
            name: 'Current User',
            avatar: 'https://source.unsplash.com/random/100x100',
          },
          createdAt: new Date().toISOString(),
        },
      });
    }, 500);
  });
};