import { useState, useEffect } from 'react';
import { Post, getPosts } from '@/api/posts';
import { PostCard } from './PostCard';
import { PostDialog } from './PostDialog';
import { Button } from './ui/button';
import { ImagePlus } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { posts } = await getPosts();
      setPosts(posts);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  const addPost = (post: Post) => {
    setPosts([post, ...posts]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Feed</h2>
        <Button onClick={() => setDialogOpen(true)}>
          <ImagePlus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      <PostDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={(post) => {
          addPost(post);
          setDialogOpen(false);
        }}
      />
    </div>
  );
}