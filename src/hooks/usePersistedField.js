import { useCallback, useEffect, useRef, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

const readLocal = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export default function usePersistedField(field, { merge }) {
  const { user, loading: authLoading } = useAuth();
  const uid = user?.uid;
  const localKey = `parcel_${field}`;

  const [value, setValue] = useState(() => readLocal(localKey));
  const latest = useRef(value);
  const apply = useCallback((next) => {
    latest.current = next;
    setValue(next);
  }, []);

  useEffect(() => {
    if (authLoading) return undefined;
    if (!uid || !db) {
      apply(readLocal(localKey));
      return undefined;
    }

    const ref = doc(db, "users", uid);
    let firstSnapshot = true;
    return onSnapshot(
      ref,
      (snap) => {
        const remote = snap.data()?.[field] ?? [];
        if (firstSnapshot) {
          firstSnapshot = false;
          const local = readLocal(localKey);
          if (local.length > 0) {
            const merged = merge(remote, local);
            localStorage.removeItem(localKey);
            apply(merged);
            setDoc(ref, { [field]: merged }, { merge: true }).catch(
              console.error,
            );
            return;
          }
        }
        apply(remote);
      },
      (err) => console.error(`Couldn’t sync ${field}`, err),
    );
  }, [uid, authLoading, field, localKey, merge, apply]);

  const update = useCallback(
    (updater) => {
      const next =
        typeof updater === "function" ? updater(latest.current) : updater;
      apply(next);
      if (uid && db)
        setDoc(doc(db, "users", uid), { [field]: next }, { merge: true }).catch(
          console.error,
        );
      else localStorage.setItem(localKey, JSON.stringify(next));
    },
    [uid, field, localKey, apply],
  );

  return [value, update];
}
