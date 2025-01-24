import { useState, useEffect } from 'react';
import { Post, getPosts } from '@/api/posts';
import { PostCard } from './PostCard';
import { PostDialog } from './PostDialog';
import { Button } from './ui/button';
import { ImagePlus } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<'all' | 'my'>('all');
  const { toast } = useToast();

  const loadPosts = async (newPage = 1) => {
    try {
      setLoading(true);
      const { posts: newPosts, pagination } = await getPosts(newPage, 10, filter);

      if (newPage === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      setHasMore(pagination.page < pagination.pages);
      setPage(pagination.page);
    } catch (error) {
      console.log("Register error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as any)?.message,
      })
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadPosts(1);
  }, [filter]);

  const loadMore = () => {
    if (!loading && hasMore) {
      loadPosts(page + 1);
    }
  };

  const handleDelete = () => {
    loadPosts(1);
  };

  const handleSuccess = (post: Post) => {
    // Ensure post has all required fields before adding to state
    const formattedPost = {
      ...post,
      author: {
        name: post.author.name,
        avatar: post.author.avatar
      },
      isOwner: true
    };
    setPosts([formattedPost, ...posts]);
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Feed</h2>
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={(value: 'all' | 'my') => setFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter posts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Posts</SelectItem>
              <SelectItem value="my">My Posts</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setDialogOpen(true)}>
            <ImagePlus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} onDelete={handleDelete} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}

      <PostDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
}