'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

export function Logo({ className }: { className?: string }) {
  const { language } = useLanguage();

  const enName = (
    <span
      className={cn(
        'font-bold leading-none text-primary group-hover:text-primary/80 transition-colors',
        montserrat.className,
        language === 'en' ? `text-base` : `text-xs`
      )}
    >
      Grand Coptic Benevolent Society
    </span>
  );

  const arName = (
    <span
      className={cn(
        'group-hover:text-foreground/80 transition-colors font-arabic',
        language === 'ar'
          ? 'text-lg font-bold text-primary'
          : 'text-xs text-muted-foreground'
      )}
    >
      الجمعية القبطية الخيرية الكبرى
    </span>
  );

  return (
    <Link href="/" className={cn('flex flex-col group py-2', className, language === 'ar' ? 'items-end' : 'items-start')}>
      {language === 'en' ? (
        <>
          {enName}
          {arName}
        </>
      ) : (
        <>
          {arName}
          {enName}
        </>
      )}
    </Link>
  );
}
