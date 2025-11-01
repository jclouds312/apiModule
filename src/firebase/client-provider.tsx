'use client';

import {
  App,
  Auth,
  Firestore,
  FirebaseProvider,
  initializeFirebase,
} from '@/firebase';
import { ReactNode, useEffect, useState } from 'react';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<{
    app: App;
    auth: Auth;
    firestore: Firestore;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const firebaseServices = initializeFirebase();
      setServices(firebaseServices);
    }
  }, []);

  if (!services) {
    return null;
  }

  return (
    <FirebaseProvider
      app={services.app}
      auth={services.auth}
      firestore={services.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
