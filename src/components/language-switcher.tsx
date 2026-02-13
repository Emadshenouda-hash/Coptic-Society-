'use client';

import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  return (
    <div className="flex items-center">
      <Button variant="ghost" size="sm" className="font-bold text-primary">
        EN
      </Button>
      <span className="text-muted-foreground mx-1">/</span>
      <Button variant="ghost" size="sm" className="text-muted-foreground">
        AR
      </Button>
    </div>
  );
}
