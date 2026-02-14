'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useFirestore } from '@/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  nameEn: z.string().min(2, { message: 'English name must be at least 2 characters.' }),
  nameAr: z.string().min(2, { message: 'Arabic name must be at least 2 characters.' }),
  titleEn: z.string().min(2, { message: 'English title must be at least 2 characters.' }),
  titleAr: z.string().min(2, { message: 'Arabic title must be at least 2 characters.' }),
  bioEn: z.string().optional(),
  bioAr: z.string().optional(),
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  termStartDate: z.date({ required_error: 'A start date is required.' }),
  termEndDate: z.date({ required_error: 'An end date is required.' }),
});

export type BoardMemberFormData = z.infer<typeof formSchema>;

interface BoardMemberFormProps {
  initialData?: BoardMemberFormData & { id: string };
  docId?: string;
}

export function BoardMemberForm({ initialData, docId }: BoardMemberFormProps) {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<BoardMemberFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
        ...initialData,
        termStartDate: initialData.termStartDate ? new Date(initialData.termStartDate) : new Date(),
        termEndDate: initialData.termEndDate ? new Date(initialData.termEndDate) : new Date(),
    } : {
      nameEn: '',
      nameAr: '',
      titleEn: '',
      titleAr: '',
      bioEn: '',
      bioAr: '',
      imageUrl: '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: BoardMemberFormData) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Firestore not available' });
      return;
    }
    
    // Convert dates to string format Firestore can handle well, e.g., ISO string
    const dataToSubmit = {
        ...values,
        termStartDate: values.termStartDate.toISOString().split('T')[0], // YYYY-MM-DD
        termEndDate: values.termEndDate.toISOString().split('T')[0], // YYYY-MM-DD
    };

    try {
      if (docId) {
        // Update existing document
        const docRef = doc(firestore, 'board_members', docId);
        await updateDoc(docRef, dataToSubmit);
        toast({ title: 'Success', description: 'Board member profile updated.' });
      } else {
        // Create new document
        const collectionRef = collection(firestore, 'board_members');
        await addDoc(collectionRef, dataToSubmit);
        toast({ title: 'Success', description: 'New board member added.' });
      }
      router.push('/admin/board-members');
      router.refresh();
    } catch (error) {
      console.error('Failed to save board member', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save board member profile.' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="nameEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (English)</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
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
                  <Input placeholder="جون دو" {...field} dir="rtl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="titleEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title (English)</FormLabel>
                <FormControl>
                  <Input placeholder="Chairman" {...field} />
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
                  <Input placeholder="رئيس مجلس الإدارة" {...field} dir="rtl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bioEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio (English)</FormLabel>
                <FormControl>
                  <Textarea placeholder="A short biography..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="bioAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio (Arabic)</FormLabel>
                <FormControl>
                  <Textarea placeholder="سيرة ذاتية قصيرة..." {...field} dir="rtl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="termStartDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Term Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="termEndDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Term End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center gap-4">
            <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {docId ? 'Update Member' : 'Add Member'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
            </Button>
        </div>
      </form>
    </Form>
  );
}
