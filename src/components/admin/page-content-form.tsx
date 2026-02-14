'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMemo } from 'react';

// Define a schema for a single key-value pair
const entrySchema = z.object({
  key: z.string(),
  value: z.string(),
});

// Define the main form schema
const formSchema = z.object({
  contentEn: z.array(entrySchema),
  contentAr: z.array(entrySchema),
});

type PageContentFormData = z.infer<typeof formSchema>;

interface PageContentFormProps {
  initialData: {
    id: string;
    contentEn: Record<string, string>;
    contentAr: Record<string, string>;
  };
  docId: string;
}

export function PageContentForm({ initialData, docId }: PageContentFormProps) {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<PageContentFormData>({
    resolver: zodResolver(formSchema), 
    defaultValues: useMemo(() => ({
      contentEn: Object.entries(initialData.contentEn || {}).map(([key, value]) => ({ key, value })),
      contentAr: Object.entries(initialData.contentAr || {}).map(([key, value]) => ({ key, value })),
    }), [initialData]),
  });

  const { fields: fieldsEn } = useFieldArray({
    control: form.control,
    name: 'contentEn',
  });
  const { fields: fieldsAr } = useFieldArray({
    control: form.control,
    name: 'contentAr',
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: PageContentFormData) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Firestore not available' });
      return;
    }

    // Convert arrays back to objects
    const contentEnObject = values.contentEn.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});
    const contentArObject = values.contentAr.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});

    try {
      const docRef = doc(firestore, 'page_content', docId);
      await updateDoc(docRef, {
        contentEn: contentEnObject,
        contentAr: contentArObject,
        lastUpdated: serverTimestamp(),
      });
      toast({ title: 'Success', description: 'Page content updated.' });
      router.push('/admin/pages');
      router.refresh(); // Force a refresh of the page list
    } catch (error) {
      console.error('Failed to save page content', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save page content.' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          {fieldsEn.map((field, index) => {
            const arFieldIndex = fieldsAr.findIndex(f => f.key === field.key);
            return (
              <Card key={field.id}>
                <CardHeader>
                  <CardTitle className="capitalize font-normal text-lg">{field.key.replace(/([A-Z])/g, ' $1')}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name={`contentEn.${index}.value`}
                    render={({ field: renderField }) => (
                      <FormItem>
                        <FormLabel>English</FormLabel>
                        <FormControl>
                          <Textarea {...renderField} rows={renderField.value.length > 80 ? 5 : 3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {arFieldIndex !== -1 && (
                    <FormField
                      key={fieldsAr[arFieldIndex].id}
                      control={form.control}
                      name={`contentAr.${arFieldIndex}.value`}
                      render={({ field: renderField }) => (
                        <FormItem dir="rtl">
                          <FormLabel>العربية</FormLabel>
                          <FormControl>
                             <Textarea {...renderField} rows={renderField.value.length > 80 ? 5 : 3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Content
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
