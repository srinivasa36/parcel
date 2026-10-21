import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";

const requireDb = () => {
  if (!db)
    throw new Error(
      "Firebase isn’t configured yet. Add your keys to .env to place orders.",
    );
  return db;
};

export async function createOrder(order) {
  const ref = await addDoc(collection(requireDb(), "orders"), order);
  return ref.id;
}

export async function listOrders(uid) {
  const snap = await getDocs(
    query(collection(requireDb(), "orders"), where("userId", "==", uid)),
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrder(id) {
  const snap = await getDoc(doc(requireDb(), "orders", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
