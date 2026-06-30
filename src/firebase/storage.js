import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { firebaseApp } from './client';

export const firebaseStorage = firebaseApp ? getStorage(firebaseApp) : null;

export async function getAssetUrl(path) {
  if (!firebaseStorage || !path) {
    return '';
  }

  return getDownloadURL(ref(firebaseStorage, path));
}
