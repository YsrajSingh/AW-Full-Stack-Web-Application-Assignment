import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { useToast } from '@/hooks/useToast';
import { Post, createPost } from '@/api/posts';
import { Upload } from 'lucide-react';

interface PostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (post: Post) => void;
}

interface FormData {
  caption: string;
  image: FileList;
}

export function PostDialog({ open, onOpenChange, onSuccess }: PostDialogProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormData>();
  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    try {
      console.log('Form data received:', {
        caption: data.caption,
        imageFile: data.image[0] ? {
          name: data.image[0].name,
          type: data.image[0].type,
          size: data.image[0].size
        } : null
      });
      setIsUploading(true);
      const formData = new FormData();
      formData.append('caption', data.caption);
      formData.append('image', data.image[0]);

      console.log('FormData entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const { post } = await createPost(formData);
      onSuccess(post);
      reset();
    } catch (error) {
      console.error('Error in onSubmit:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                id="image"
                accept="image/*"
                {...register('image', { required: true })}
                className="hidden"
              />
              <Label
                htmlFor="image"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8" />
                <span>Click to upload image</span>
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              {...register('caption', { required: true })}
              placeholder="Write a caption..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}