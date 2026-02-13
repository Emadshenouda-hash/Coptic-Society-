'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'font-bold',
          language === 'en' ? 'text-primary' : 'text-muted-foreground'
        )}
        onClick={() => setLanguage('en')}
      >
        EN
      </Button>
      <span className="text-muted-foreground mx-1">/</span>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'font-bold',
          language === 'ar' ? 'text-primary' : 'text-muted-foreground'
        )}
        onClick={() => setLanguage('ar')}
      >
        AR
      </Button>
    </div>
  );
}
