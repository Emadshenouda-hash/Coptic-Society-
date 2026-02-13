'use server';

import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export type ContactFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
  };
};

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your input.',
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { name, email, subject, message } = validatedFields.data;

  try {
    // TODO: Add Firebase logic here to save the data to Firestore.
    // Example:
    // import { db } from '@/lib/firebase'; // Assuming you have a firebase config file
    // import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
    // await addDoc(collection(db, 'contactSubmissions'), {
    //   name,
    //   email,
    //   subject,
    //   message,
    //   submittedAt: serverTimestamp(),
    // });
    
    console.log('Contact form submitted:');
    console.log({ name, email, subject, message });

    return {
      message: 'Thank you for your message! We will get back to you shortly.',
      status: 'success',
    };
  } catch (error) {
    console.error('Error saving to database:', error);
    return {
      message: 'An internal error occurred. Please try again later.',
      status: 'error',
    };
  }
}
