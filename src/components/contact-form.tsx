'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, serverTimestamp, addDoc } from 'firebase/firestore';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useLanguage } from '@/context/language-context';

const translations = {
  en: {
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'Your Full Name',
    emailLabel: 'Email Address',
    emailPlaceholder: 'you@example.com',
    subjectLabel: 'Subject',
    subjectPlaceholder: 'Reason for contacting',
    messageLabel: 'Message',
    messagePlaceholder: 'Your message here...',
    sending: 'Sending...',
    sendMessage: 'Send Message',
    errorOccurred: 'An error occurred',
    dbUnavailable: 'Database service is not available.',
    messageSent: 'Message Sent!',
    messageSentDesc: 'Thank you for your message! We will get back to you shortly.',
    couldNotSend: 'Could not send your message. Please try again later.',
    validation: {
      nameMin: 'Name must be at least 2 characters.',
      emailInvalid: 'Please enter a valid email.',
      subjectMin: 'Subject must be at least 5 characters.',
      messageMin: 'Message must be at least 10 characters.',
    }
  },
  ar: {
    fullNameLabel: 'الاسم الكامل',
    fullNamePlaceholder: 'اسمك الكامل',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'you@example.com',
    subjectLabel: 'الموضوع',
    subjectPlaceholder: 'سبب التواصل',
    messageLabel: 'الرسالة',
    messagePlaceholder: 'رسالتك هنا...',
    sending: 'جار الإرسال...',
    sendMessage: 'إرسال الرسالة',
    errorOccurred: 'حدث خطأ',
    dbUnavailable: 'خدمة قاعدة البيانات غير متوفرة.',
    messageSent: 'تم إرسال الرسالة!',
    messageSentDesc: 'شكرا لرسالتك! سوف نعود اليكم قريبا.',
    couldNotSend: 'لا يمكن إرسال رسالتك. يرجى المحاولة مرة أخرى في وقت لاحق.',
    validation: {
      nameMin: 'يجب أن يتكون الاسم من حرفين على الأقل.',
      emailInvalid: 'يرجى إدخال بريد إلكتروني صحيح.',
      subjectMin: 'يجب أن يتكون الموضوع من 5 أحرف على الأقل.',
      messageMin: 'يجب أن تتكون الرسالة من 10 أحرف على الأقل.',
    }
  }
};


export function ContactForm() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];

  const translatedSchema = z.object({
    fullName: z.string().min(2, { message: t.validation.nameMin }),
    email: z.string().email({ message: t.validation.emailInvalid }),
    subject: z.string().min(5, { message: t.validation.subjectMin }),
    message: z.string().min(10, { message: t.validation.messageMin }),
  });

  type ContactFormValues = z.infer<typeof translatedSchema>;

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(translatedSchema),
    defaultValues: {
      fullName: '',
      email: '',
      subject: '',
      message: '',
    },
  });
  
  const { isSubmitting } = form.formState;

  const onSubmit = async (values: ContactFormValues) => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: t.errorOccurred,
        description: t.dbUnavailable,
      });
      return;
    }

    try {
      const submission = {
        ...values,
        submissionDate: serverTimestamp(),
        isRead: false,
      };
      const contactSubmissionsRef = collection(firestore, 'contact_submissions');
      
      await addDoc(contactSubmissionsRef, submission);

      toast({
        title: t.messageSent,
        description: t.messageSentDesc,
      });
      form.reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        variant: 'destructive',
        title: t.errorOccurred,
        description: t.couldNotSend,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.fullNameLabel}</FormLabel>
              <FormControl>
                <Input placeholder={t.fullNamePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.emailLabel}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t.emailPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.subjectLabel}</FormLabel>
              <FormControl>
                <Input placeholder={t.subjectPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.messageLabel}</FormLabel>
              <FormControl>
                <Textarea placeholder={t.messagePlaceholder} rows={6} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:ml-2 rtl:mr-0" />
              {t.sending}
            </>
          ) : (
            t.sendMessage
          )}
        </Button>
      </form>
    </Form>
  );
}
