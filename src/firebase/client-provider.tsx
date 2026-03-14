'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider, FirebaseContext, type FirebaseContextState } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

type FirebaseServices = ReturnType<typeof initializeFirebase>;

// Provided during SSR / before client hydration so hooks don't throw.
// areServicesAvailable: false causes useFirestore/useAuth to return null,
// and all pages already guard with `if (firestore) { ... }`.
const SSR_FALLBACK: FirebaseContextState = {
  areServicesAvailable: false,
  firebaseApp: null,
  firestore: null,
  auth: null,
  user: null,
  isUserLoading: true,
  userError: null,
};

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [services, setServices] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    // Runs only in the browser — avoids the auth/invalid-api-key error
    // that Firebase throws during Node.js SSR when env vars are absent.
    setServices(initializeFirebase());
  }, []);

  if (!services) {
    return (
      <FirebaseContext.Provider value={SSR_FALLBACK}>
        {children}
      </FirebaseContext.Provider>
    );
  }

  return (
    <FirebaseProvider
      firebaseApp={services.firebaseApp}
      auth={services.auth}
      firestore={services.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
