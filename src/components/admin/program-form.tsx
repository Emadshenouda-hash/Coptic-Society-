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
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  nameEn: z.string().min(2, { message: 'English name is required.' }),
  nameAr: z.string().min(2, { message: 'Arabic name is required.' }),
  shortDescriptionEn: z.string().min(10, { message: 'English short description is required.' }),
  shortDescriptionAr: z.string().min(10, { message: 'Arabic short description is required.' }),
  fullDescriptionEn: z.string().min(20, { message: 'English full description is required.' }),
  fullDescriptionAr: z.string().min(20, { message: 'Arabic full description is required.' }),
  iconName: z.string().min(2, { message: 'An icon name is required (e.g., HeartHandshake).' }),
  imageUrl: z.string().url({ message: 'A valid image URL is required.' }),
  galleryImageUrls: z.string().optional(),
});

export type ProgramFormData = z.infer<typeof formSchema>;

interface ProgramFormProps {
  initialData?: ProgramFormData & { id: string };
  docId?: string;
}

export function ProgramForm({ initialData, docId }: ProgramFormProps) {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const defaultValues = initialData 
    ? { ...initialData, galleryImageUrls: Array.isArray(initialData.galleryImageUrls) ? initialData.galleryImageUrls.join(', ') : '' } 
    : {
      nameEn: '',
      nameAr: '',
      shortDescriptionEn: '',
      shortDescriptionAr: '',
      fullDescriptionEn: '',
      fullDescriptionAr: '',
      iconName: '',
      imageUrl: '',
      galleryImageUrls: '',
    };

  const form = useForm<ProgramFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: ProgramFormData) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Firestore not available' });
      return;
    }

    const dataToSubmit = {
      ...values,
      galleryImageUrls: values.galleryImageUrls ? values.galleryImageUrls.split(',').map(url => url.trim()).filter(url => url) : [],
    };

    try {
      if (docId) {
        const docRef = doc(firestore, 'programs', docId);
        await updateDoc(docRef, dataToSubmit);
        toast({ title: 'Success', description: 'Program updated successfully.' });
      } else {
        const collectionRef = collection(firestore, 'programs');
        await addDoc(collectionRef, dataToSubmit);
        toast({ title: 'Success', description: 'New program created.' });
      }
      router.push('/admin/programs');
      router.refresh();
    } catch (error) {
      console.error('Failed to save program', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save program.' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <FormField
            control={form.control}
            name="nameEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (English)</FormLabel>
                <FormControl>
                  <Input placeholder="Healthcare Services" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nameAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (Arabic)</FormLabel>
                <FormControl>
                  <Input placeholder="خدمات الرعاية الصحية" {...field} dir="rtl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shortDescriptionEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description (English)</FormLabel>
                <FormControl>
                  <Textarea placeholder="A brief summary of the program..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shortDescriptionAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description (Arabic)</FormLabel>
                <FormControl>
                  <Textarea placeholder="ملخص قصير للبرنامج..." {...field} dir="rtl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullDescriptionEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Description (English)</FormLabel>
                <FormControl>
                  <Textarea placeholder="The complete details of the program..." rows={6} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullDescriptionAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Description (Arabic)</FormLabel>
                <FormControl>
                  <Textarea placeholder="التفاصيل الكاملة للبرنامج..." rows={6} {...field} dir="rtl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="iconName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Stethoscope" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
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
            name="galleryImageUrls"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Gallery Image URLs (comma-separated)</FormLabel>
                <FormControl>
                  <Textarea placeholder="https://example.com/gallery1.jpg, https://example.com/gallery2.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex items-center gap-4">
            <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {docId ? 'Update Program' : 'Create Program'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
            </Button>
        </div>
      </form>
    </Form>
  );
}
