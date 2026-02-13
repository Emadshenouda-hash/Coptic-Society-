'use client';

import { ReactNode } from 'react';
import { LanguageProvider } from '@/context/language-context';
import { FirebaseClientProvider } from '@/firebase';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <FirebaseClientProvider>{children}</FirebaseClientProvider>
    </LanguageProvider>
  );
}
