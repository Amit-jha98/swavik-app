import { getAuth } from 'firebase/auth';
import { firebaseApp } from './client';

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
