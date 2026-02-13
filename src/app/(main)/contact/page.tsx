import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { ContactForm } from '@/components/contact-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Grand Coptic Benevolent Society. Find our address, phone number, and email, or use the contact form to send us a message.',
};

export default function ContactPage() {
  const contactImage = PlaceHolderImages.find(p => p.id === 'contact-us');

  return (
    <div className="bg-background">
      <div className="container py-16 lg:py-24">
        <div className="text-center">
          <h1 className="font-headline text-4xl md:text-5xl text-primary">Get In Touch</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            We welcome your questions, feedback, and collaboration proposals. Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
           <div className="space-y-8">
                <h2 className="font-headline text-3xl text-primary">Contact Information</h2>
                 <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Our Headquarters</h3>
                            <p className="text-muted-foreground">175 Ramsis Street, Cairo, Egypt</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                            <Phone className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Phone</h3>
                            <a href="tel:+20212345678" className="text-muted-foreground hover:text-primary transition-colors">+20 2 1234 5678</a>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Email</h3>
                            <a href="mailto:info@coptic-society.org" className="text-muted-foreground hover:text-primary transition-colors">info@coptic-society.org</a>
                        </div>
                    </div>
                </div>
                {contactImage && (
                    <div className="relative h-64 w-full rounded-lg shadow-md overflow-hidden">
                        <Image
                            src={contactImage.imageUrl}
                            alt={contactImage.description}
                            fill
                            className="object-cover"
                            data-ai-hint={contactImage.imageHint}
                        />
                    </div>
                )}
           </div>
           
           <Card className="p-6 md:p-8 shadow-lg">
                <h2 className="font-headline text-3xl text-primary mb-6">Send Us a Message</h2>
                <ContactForm />
           </Card>
        </div>
      </div>
    </div>
  );
}
