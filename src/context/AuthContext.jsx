import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '@/firebase/auth';

const AuthContext = createContext(null);
const LOCAL_SESSION_KEY = 'swavik.localSession';

function readLocalSession() {
  try {
    const raw = window.localStorage.getItem(LOCAL_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function createLocalUser(email) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  return {
    uid: `local:${cleanEmail}`,
    email: cleanEmail,
    displayName: cleanEmail.split('@')[0] || 'Guest',
    providerId: 'local-otp'
  };
}

export function AuthProvider({ children }) {
  const [localUser, setLocalUser] = useState(() => (typeof window === 'undefined' ? null : readLocalSession()));
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!firebaseAuth) {
      setAuthReady(true);
      return undefined;
    }

    return onAuthStateChanged(firebaseAuth, (nextUser) => {
      setFirebaseUser(nextUser);
      setAuthReady(true);
    });
  }, []);

  const user = firebaseUser || localUser;

  const value = useMemo(
    () => ({
      user,
      authReady,
      isAuthenticated: Boolean(user),
      isAdmin: isAdminEmail(user?.email),
      loginWithEmail: (email) => {
        const nextUser = createLocalUser(email);
        window.localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(nextUser));
        setLocalUser(nextUser);
        return nextUser;
      },
      logout: () => {
        window.localStorage.removeItem(LOCAL_SESSION_KEY);
        setLocalUser(null);
      }
    }),
    [authReady, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

function isAdminEmail(email) {
  const allowList = import.meta.env.VITE_ADMIN_EMAILS || '';
  return allowList
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .includes((email || '').toLowerCase());
}
