import { BylawsClient } from '@/components/bylaws-client';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bylaws',
  description: 'Review the official bylaws of the Grand Coptic Benevolent Society or use our AI tool to summarize the document.',
};

export default function BylawsPage() {
  return (
    <div className="bg-background">
      <div className="container py-16 lg:py-24 space-y-16">
        <div className="text-center">
          <h1 className="font-headline text-4xl md:text-5xl text-primary">Society Bylaws</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Our operations are guided by a comprehensive set of bylaws. You can download the full official document or use our AI tool for a quick summary.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
            <h2 className="font-headline text-2xl text-primary">Official Document</h2>
            <Button size="lg" asChild>
                {/* The actual bylaws.pdf should be placed in the /public directory */}
                <a href="/bylaws.pdf" download>
                    <Download className="mr-2 h-5 w-5" />
                    Download Full Bylaws (PDF)
                </a>
            </Button>
        </div>
        
        <BylawsClient />
      </div>
    </div>
  );
}
