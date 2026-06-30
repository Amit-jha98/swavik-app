import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export function AdminShell({ children }) {
  return (
    <ProtectedRoute adminOnly>
      <main className="min-h-svh bg-ink-950 px-6 py-24 text-cream-50">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </ProtectedRoute>
  );
}
