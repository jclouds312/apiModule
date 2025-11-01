'use client';

import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';

import { useFirestore } from '@/firebase';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useMemoFirebase<T>(
  factory: () => T,
  deps: React.DependencyList
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}

export const useDoc = <T,>(collectionName: string, docId: string) => {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const docRef = useMemoFirebase(() => {
    if (!firestore || !docId) return null;
    return doc(firestore, collectionName, docId);
  }, [firestore, collectionName, docId]);

  useEffect(() => {
    if (!docRef) return;
    setLoading(true);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ ...snapshot.data(), id: snapshot.id } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [docRef]);

  return { data, loading, error };
};
