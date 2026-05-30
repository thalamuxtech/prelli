"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/** Live-subscribe to a collection, ordered, returning typed docs (§6.2 realtime lists). */
export function useCollection<T>(
  path: string,
  ...constraints: QueryConstraint[]
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, path), ...constraints);
    const unsub = onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return { data, loading, error };
}

export const byCreatedDesc = () => orderBy("createdAt", "desc");
export const byOrderAsc = () => orderBy("order", "asc");

export async function createDoc(path: string, data: Record<string, unknown>) {
  return addDoc(collection(db, path), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateDocById(
  path: string,
  id: string,
  data: Record<string, unknown>,
) {
  return updateDoc(doc(db, path, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocById(path: string, id: string) {
  return deleteDoc(doc(db, path, id));
}
