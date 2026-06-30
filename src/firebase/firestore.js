import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where
} from 'firebase/firestore';
import { firebaseApp } from './client';

export const firestore = firebaseApp ? getFirestore(firebaseApp) : null;

export async function fetchProducts({ category } = {}) {
  if (!firestore) {
    return [];
  }

  const productsRef = collection(firestore, 'products');
  const constraints = [orderBy('sortOrder', 'asc')];

  if (category && category !== 'All') {
    constraints.unshift(where('category', '==', category));
  }

  const snapshot = await getDocs(query(productsRef, ...constraints));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function fetchProductBySlug(slug) {
  if (!firestore || !slug) {
    return null;
  }

  const productRef = doc(firestore, 'products', slug);
  const snapshot = await getDoc(productRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}
