import { useAuth } from '@/context/AuthContext.jsx';

export function ProtectedRoute({ children, adminOnly = false }) {
  const { authReady, isAuthenticated, isAdmin } = useAuth();

  if (!authReady) {
    return <div className="p-8 text-cream-100/70">Verifying private access...</div>;
  }

  if (!isAuthenticated || (adminOnly && !isAdmin)) {
    return <div className="p-8 text-cream-100/70">Private access required.</div>;
  }

  return children;
}
