import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary text-center px-4">
      <div className="space-y-6 max-w-lg">
        <p className="font-headline text-8xl font-bold text-accent">404</p>
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">
          Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground">
          The page you are looking for may have been moved, deleted, or might never have existed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="rounded-full font-semibold">
            <Link href="/">Return to Home</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full font-semibold">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
