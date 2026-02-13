import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex flex-col group', className)}>
      <span className="font-headline text-2xl font-bold leading-none text-primary group-hover:text-primary/80 transition-colors">
        Al-Birr Society
      </span>
      <span className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">
        الجمعية القبطية الخيرية الكبرى
      </span>
    </Link>
  );
}
