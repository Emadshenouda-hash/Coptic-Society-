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
        language === 'en' ? `${montserrat.className} text-2xl` : `${montserrat.className} text-sm`
      )}
    >
      Grand Coptic Benevolent Society
    </span>
  );

  const arName = (
    <span
      className={cn(
        'group-hover:text-foreground/80 transition-colors',
        language === 'ar'
          ? 'font-arabic text-2xl font-bold text-primary'
          : 'text-xs text-muted-foreground font-arabic'
      )}
    >
      الجمعية القبطية الخيرية الكبرى
    </span>
  );

  return (
    <Link href="/" className={cn('flex flex-col group', className, language === 'ar' ? 'items-end' : 'items-start')}>
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
