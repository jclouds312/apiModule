import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

import { firebaseConfig } from './config';
import { FirebaseClientProvider } from './client-provider';
import {
  useAuth,
  useFirebaseApp as useFirebase,
  useFirestore,
  FirebaseProvider,
  useFirebaseApp,
} from './provider';
import { useUser } from './auth/use-user';
import { useCollection, useMemoFirebase } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';

export type App = ReturnType<typeof initializeApp>;

export const initializeFirebase = (options?: FirebaseOptions) => {
  const app =
    getApps().length > 0 ? getApp() : initializeApp(options ?? firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return { app, auth, firestore };
};

export {
  FirebaseProvider,
  FirebaseClientProvider,
  useCollection,
  useDoc,
  useUser,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
  useMemoFirebase,
  type Auth,
  type Firestore,
};
