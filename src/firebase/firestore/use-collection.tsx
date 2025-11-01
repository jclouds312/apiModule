'use client';

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Query,
  where,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  startAt,
  doc,
  getDoc,
} from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';

import { useFirestore } from '@/firebase';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

type Options = {
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  where?: {
    field: string;
    operator:
      | '<'
      | '<='
      | '=='
      | '!='
      | '>='
      | '>'
      | 'array-contains'
      | 'in'
      | 'array-contains-any'
      | 'not-in';
    value: any;
  };
  limit?: number;
  startAfter?: any;
  endBefore?: any;
  startAt?: any;
};

export function useMemoFirebase<T>(
  factory: () => T,
  deps: React.DependencyList
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}

export const useCollection = <T,>(
  collectionName: string,
  options?: Options
) => {
  const firestore = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const queryRef = useMemoFirebase(() => {
    if (!firestore) return null;
    let q: Query = collection(firestore, collectionName);

    if (options?.where) {
      q = query(
        q,
        where(options.where.field, options.where.operator, options.where.value)
      );
    }

    if (options?.orderBy) {
      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction));
    }

    if (options?.startAt) {
      q = query(q, startAt(options.startAt));
    }

    if (options?.startAfter) {
      q = query(q, startAfter(options.startAfter));
    }

    if (options?.endBefore) {
      q = query(q, endBefore(options.endBefore));
    }

    if (options?.limit) {
      q = query(q, limit(options.limit));
    }

    return q;
  }, [
    collectionName,
    firestore,
    options?.orderBy?.field,
    options?.orderBy?.direction,
    options?.where?.field,
    options?.where?.operator,
    options?.where?.value,
    options?.limit,
    options?.startAfter,
    options?.endBefore,
    options?.startAt,
  ]);

  useEffect(() => {
    if (!queryRef) return;
    setLoading(true);

    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as T)
        );
        setData(docs);
        setLoading(false);
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
          path: queryRef.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [queryRef]);

  return { data, loading, error };
};
