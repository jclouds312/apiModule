'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import type { App, Auth, Firestore } from '.';

const FirebaseAppContext = createContext<App | undefined>(undefined);
const AuthContext = createContext<Auth | undefined>(undefined);
const FirestoreContext = createContext<Firestore | undefined>(undefined);

export const FirebaseProvider = ({
  children,
  app,
  auth,
  firestore,
}: {
  children: ReactNode;
  app: App;
  auth: Auth;
  firestore: Firestore;
}) => {
  return (
    <FirebaseAppContext.Provider value={app}>
      <AuthContext.Provider value={auth}>
        <FirestoreContext.Provider value={firestore}>
          {children}
        </FirestoreContext.Provider>
      </AuthContext.Provider>
    </FirebaseAppContext.Provider>
  );
};

export const useFirebaseApp = () => useContext(FirebaseAppContext);
export const useAuth = () => useContext(AuthContext);
export const useFirestore = () => useContext(FirestoreContext);
