import { Post, deletePost } from '@/api/posts';
import { Card, CardContent, CardHeader } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface PostCardProps {
  post: Post;
  onDelete?: () => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deletePost(post._id);
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      });
      onDelete?.();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name ? post.author.name[0] : 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{post.author.name}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        {post.isOwner && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <img
          src={post.imageUrl}
          alt={post.caption}
          className="w-full aspect-video object-cover"
        />
        <p className="p-4">{post.caption}</p>
      </CardContent>
    </Card>
  );
}