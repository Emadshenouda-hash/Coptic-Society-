'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  titleEn: z.string().min(5, { message: 'English title must be at least 5 characters.' }),
  titleAr: z.string().min(5, { message: 'Arabic title must be at least 5 characters.' }),
  summaryEn: z.string().min(10, { message: 'English summary must be at least 10 characters.' }),
  summaryAr: z.string().min(10, { message: 'Arabic summary must be at least 10 characters.' }),
  contentEn: z.string().min(20, { message: 'English content must be at least 20 characters.' }),
  contentAr: z.string().min(20, { message: 'Arabic content must be at least 20 characters.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }),
  tags: z.string().optional(),
});

export type PostFormData = z.infer<typeof formSchema>;

interface PostFormProps {
  initialData?: PostFormData & { id: string };
  docId?: string;
}

export function PostForm({ initialData, docId }: PostFormProps) {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  // Convert tags array to comma-separated string for the form
  const defaultValues = initialData 
    ? { ...initialData, tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '' } 
    : {
      titleEn: '',
      titleAr: '',
      summaryEn: '',
      summaryAr: '',
      contentEn: '',
      contentAr: '',
      imageUrl: '',
      tags: '',
    };

  const form = useForm<PostFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: PostFormData) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Firestore not available' });
      return;
    }
    
    const dataToSubmit = {
      ...values,
      tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
    };

    try {
      if (docId) {
        // Update existing document
        const docRef = doc(firestore, 'posts', docId);
        await updateDoc(docRef, { ...dataToSubmit });
        toast({ title: 'Success', description: 'Post updated successfully.' });
      } else {
        // Create new document
        const collectionRef = collection(firestore, 'posts');
        await addDoc(collectionRef, { ...dataToSubmit, publishDate: serverTimestamp() });
        toast({ title: 'Success', description: 'New post created.' });
      }
      router.push('/admin/news');
      router.refresh();
    } catch (error) {
      console.error('Failed to save post', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save post.' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="titleEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title (English)</FormLabel>
                <FormControl>
                  <Input placeholder="Annual Charity Gala Success" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="titleAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title (Arabic)</FormLabel>
                <FormControl>
                  <Input placeholder="نجاح الحفل الخيري السنوي" {...field} dir="rtl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="summaryEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Summary (English)</FormLabel>
                <FormControl>
                  <Textarea placeholder="A short summary of the post..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="summaryAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Summary (Arabic)</FormLabel>
                <FormControl>
                  <Textarea placeholder="ملخص قصير للمنشور..." {...field} dir="rtl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contentEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content (English)</FormLabel>
                <FormControl>
                  <Textarea placeholder="The full content of the post..." rows={10} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="contentAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content (Arabic)</FormLabel>
                <FormControl>
                  <Textarea placeholder="المحتوى الكامل للمنشور..." rows={10} {...field} dir="rtl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Featured Image URL</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Tags (comma-separated)</FormLabel>
                <FormControl>
                  <Input placeholder="event, charity, cairo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center gap-4">
            <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {docId ? 'Update Post' : 'Create Post'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
            </Button>
        </div>
      </form>
    </Form>
  );
}
